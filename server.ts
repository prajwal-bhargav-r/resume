import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { PDFParse } from "pdf-parse";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const SERVER_START_TIME = Date.now();

app.use(express.json({ limit: "25mb" }));

// Helper to format server uptime into human-readable duration
function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0 || d > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0 || d > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
}

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Candidate models in preference order (valid @google/genai models)
const CANDIDATE_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
];

// Robust Gemini content generation with multi-model fallback and transient retry
async function generateWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
): Promise<string> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });

        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || "");
        const status = err?.status || err?.code;
        const isTransient =
          status === 503 ||
          msg.includes("503") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("high demand") ||
          msg.includes("ResourceExhausted") ||
          status === 429;

        if (isTransient) {
          console.warn(
            `[Gemini API] Model ${model} is experiencing temporary demand spike (code: ${status || 503}, attempt ${attempt}/2). Retrying or trying next candidate...`
          );
          if (attempt === 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
          }
        } else {
          console.warn(`[Gemini API] Model ${model} returned: ${msg}. Trying next candidate model.`);
          break;
        }
      }
    }
  }

  throw lastError || new Error("All candidate Gemini models were unavailable.");
}

// Clean markdown fences from JSON output
function cleanAndParseJSON(rawText: string): any {
  if (!rawText) return null;
  let text = rawText.trim();
  if (text.startsWith("```json")) {
    text = text.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  } else if (text.startsWith("```")) {
    text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return JSON.parse(text);
}

// Rich Health Check API Endpoint
app.get("/api/health", (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - SERVER_START_TIME) / 1000);
  const mem = process.memoryUsage();
  const hasKey = Boolean(process.env.GEMINI_API_KEY);

  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    uptimeFormatted: formatUptime(uptimeSeconds),
    service: "ResumeLens AI Career Engine",
    version: "1.2.0",
    environment: process.env.NODE_ENV || "development",
    hasApiKey: hasKey,
    gemini: {
      configured: hasKey,
      preferredModel: CANDIDATE_MODELS[0],
      candidateModels: CANDIDATE_MODELS,
      mode: hasKey ? "Live Gemini AI API (Multi-Model Resilient)" : "Grounded Career Engine (Deterministic Fallback)",
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      memoryUsage: {
        heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)} MB`,
        rss: `${Math.round(mem.rss / 1024 / 1024)} MB`,
      },
    },
    endpoints: [
      {
        path: "/api/health",
        method: "GET",
        description: "Diagnostic status, system health, uptime, memory, and Gemini integration state",
      },
      {
        path: "/api/extract-text",
        method: "POST",
        description: "Extract readable text from PDF or DOCX candidate resumes",
      },
      {
        path: "/api/verify-resume",
        method: "POST",
        description: "Authenticity and ATS gatekeeper classifier to verify genuine candidate resumes",
      },
      {
        path: "/api/analyze",
        method: "POST",
        description: "Comprehensive career gap analysis, skill gap metrics, rewrites, and 5-phase roadmap",
      },
      {
        path: "/api/chat",
        method: "POST",
        description: "Interactive AI Career Coach chat grounded in candidate profile",
      },
    ],
  });
});

// Helper to detect raw binary string data
function isBinaryString(str: string): boolean {
  if (!str) return false;
  if (
    str.startsWith("%PDF-") ||
    str.startsWith("PK\x03\x04") ||
    str.includes("/FlateDecode") ||
    str.includes("/FontDescriptor")
  ) {
    return true;
  }
  let nonPrintable = 0;
  const sample = str.slice(0, 1500);
  for (let i = 0; i < sample.length; i++) {
    const code = sample.charCodeAt(i);
    if (code === 0 || (code < 32 && code !== 9 && code !== 10 && code !== 13)) {
      nonPrintable++;
    }
  }
  return sample.length > 20 && nonPrintable / sample.length > 0.04;
}

// Helper to extract text from PDF, DOCX, or base64 buffers
async function extractTextFromBuffer(
  buffer: Buffer,
  fileName: string = "document.pdf"
): Promise<{ text: string; pagesCount?: number }> {
  const lowerName = fileName.toLowerCase();
  const isDocx = lowerName.endsWith(".docx") || lowerName.endsWith(".doc") || (buffer.length > 4 && buffer[0] === 0x50 && buffer[1] === 0x4b);

  // 1. DOCX / DOC extraction via mammoth
  if (isDocx) {
    try {
      const mammoth = await import("mammoth");
      const mod = (mammoth as any).default || mammoth;
      if (typeof mod.extractRawText === "function") {
        const result = await mod.extractRawText({ buffer });
        if (result && result.value && result.value.trim().length > 0) {
          return { text: result.value.trim() };
        }
      }
    } catch (err: any) {
      console.warn(`[Server] Mammoth docx extraction failed for ${fileName}:`, err?.message || err);
    }
  }

  // 2. PDF extraction via PDFParse
  try {
    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    await parser.destroy();
    
    if (parsed && typeof parsed.text === "string" && parsed.text.trim().length > 0) {
      return {
        text: parsed.text.trim(),
        pagesCount: parsed.pages ? parsed.pages.length : undefined,
      };
    }
  } catch (err: any) {
    console.warn(`[Server] PDFParse failed for ${fileName}:`, err?.message || err);
  }

  // 3. Fallback: UTF-8 string if it's text-based and NOT binary
  const rawString = buffer.toString("utf-8");
  if (!isBinaryString(rawString)) {
    return { text: rawString.replace(/\0/g, "").trim() };
  }

  return { text: "" };
}

// API: Extract plain text from PDF or document uploads
app.post("/api/extract-text", async (req, res) => {
  try {
    const { fileBase64, fileName } = req.body;
    if (!fileBase64) {
      return res.status(400).json({ error: "No fileBase64 data provided" });
    }

    // Clean base64 header if included (e.g. data:application/pdf;base64,...)
    const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");

    const extraction = await extractTextFromBuffer(buffer, fileName);
    const text = extraction.text;

    return res.json({
      success: true,
      text,
      characterCount: text.length,
      wordCount: text.split(/\s+/).filter(Boolean).length,
      pagesCount: extraction.pagesCount,
      fileName,
    });
  } catch (err: any) {
    console.warn("[Server] Document text extraction error:", err?.message || err);
    return res.status(500).json({
      error: "Failed to extract text from document",
      message: err?.message,
    });
  }
});

// API: Verify whether an uploaded file is an authentic resume or another document
app.post("/api/verify-resume", async (req, res) => {
  try {
    let { text, fileName, fileBase64 } = req.body;

    // If text is minimal, missing, or raw binary, extract readable text from fileBase64
    const isBinary = isBinaryString(text || "");
    if ((!text || text.trim().length < 40 || isBinary) && fileBase64) {
      try {
        const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, "");
        const buffer = Buffer.from(cleanBase64, "base64");
        const extracted = await extractTextFromBuffer(buffer, fileName);
        if (extracted.text && extracted.text.length > 15) {
          text = extracted.text;
        }
      } catch (e) {
        console.warn("[Server] Base64 extraction in verify-resume failed:", e);
      }
    }

    if (!text || text.trim().length < 20 || isBinaryString(text)) {
      return res.json({
        isResume: false,
        confidence: 95,
        identifiedType: "Empty / Incomplete Document",
        identificationDetails: "The uploaded file does not contain enough readable text.",
        detectedSections: [],
        missingStandardSections: ["Experience", "Education", "Skills"],
        errorMessage: '"PLEASE UPLOAD AN GENUINE RESUME"',
      });
    }

    const ai = getAI();
    if (!ai) {
      return res.json({ fallback: true, extractedText: text });
    }

    const prompt = `You are an expert document inspector and ATS gatekeeper.
Examine the following document text (file name: "${fileName || 'document'}").
Task:
1. Determine whether this document is an authentic candidate Resume / Curriculum Vitae (CV), professional biography, candidate portfolio, or job application.
2. IMPORTANT GUIDELINE: BE PERMISSIVE AND WELCOMING WITH CANDIDATES. Genuine candidate resumes come in many formats (e.g., student resumes, entry-level profiles, tech resumes with GitHub links, academic CVs, non-traditional career shifts, brief 1-page summaries). If it represents a real person's career credentials, education, work, projects, or technical skills, classify it as "isResume": true.
3. ONLY classify as "isResume": false if the document is CLEARLY and UNMISTAKABLY something other than a candidate's profile, such as:
   - A financial bill, grocery receipt, or sales invoice
   - A pure computer source code file (e.g., only import statements and functions without personal info)
   - A cooking recipe or food preparation guide
   - A legal terms of service contract or privacy policy
   - A clinical doctor's prescription or medical record
   - Pure repetitive placeholder or lorem ipsum text
   - Completely empty or gibberish text
4. If it is NOT a resume, name what it is (e.g. "Financial Invoice", "Source Code", "Cooking Recipe", "Legal Agreement", etc.) and explain why.

DOCUMENT TEXT (first 4000 characters):
${text.slice(0, 4000)}

Respond with STRICT JSON adhering to this schema:
{
  "isResume": boolean,
  "confidence": number between 60 and 100,
  "identifiedType": string,
  "explanation": string,
  "detectedSections": string[],
  "missingStandardSections": string[]
}`;

    const textResponse = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a fair, precise document classifier. Accurately identify candidate resumes and CVs while filtering out non-resume files like receipts, recipes, and contracts.",
      },
    });

    const parsed = cleanAndParseJSON(textResponse);
    if (parsed && typeof parsed.isResume === "boolean") {
      return res.json({
        isResume: Boolean(parsed.isResume),
        confidence: parsed.confidence || 90,
        identifiedType: parsed.identifiedType || (parsed.isResume ? "Candidate Resume / CV" : "Non-Resume Document"),
        identificationDetails: parsed.explanation || "",
        detectedSections: parsed.detectedSections || [],
        missingStandardSections: parsed.missingStandardSections || [],
        errorMessage: parsed.isResume ? undefined : '"PLEASE UPLOAD AN GENUINE RESUME"',
        extractedText: text,
      });
    }

    return res.json({ fallback: true, extractedText: text });
  } catch (err: any) {
    console.warn("[Server] Resume verification error:", err?.message || err);
    return res.json({ fallback: true });
  }
});

// API: Analyze Resume
app.post("/api/analyze", async (req, res) => {
  try {
    const { resumeText, targetRole, targetCompany, experienceLevel, userGoals } = req.body;

    if (!resumeText || !targetRole) {
      return res.status(400).json({ error: "Resume text and target role are required" });
    }

    const ai = getAI();
    if (!ai) {
      // Server informs frontend to use client-side expert simulation engine
      return res.json({ fallback: true, message: "No API key configured on server. Falling back to rule-grounded engine." });
    }

    const prompt = `You are a high-level technical career coach, principal engineering hiring manager, and ATS auditor.
Analyze the following resume for a candidate seeking the role of "${targetRole}" at "${targetCompany || 'Top Tech Companies'}" with experience level "${experienceLevel || 'Student/Fresher'}".
Candidate specific goals: "${userGoals || 'General improvement and career gap analysis'}".

RESUME TEXT:
${resumeText.slice(0, 10000)}

Provide a thorough, objective, and realistic analysis formatted as JSON adhering to this exact schema:
{
  "alignmentScore": number between 40 and 95 (realistic, not overly flattering),
  "alignmentSummary": "2-3 sentences explaining the alignment without making hiring guarantees",
  "strengths": ["string", "string", "string", "string"],
  "gaps": ["string", "string", "string"],
  "priorityActions": ["string", "string", "string"],
  "resumeFlaws": [
    {
      "issue": "string",
      "whyItMatters": "string",
      "howToFix": "string",
      "severity": "High" | "Medium" | "Low"
    }
  ],
  "skillGaps": [
    {
      "skill": "string",
      "currentEvidence": "Strong" | "Limited" | "None",
      "currentScore": number 0 to 100,
      "targetImportance": "High" | "Medium" | "Low",
      "gap": "High" | "Medium" | "Low",
      "recommendation": "string"
    }
  ],
  "skillsToDevelop": {
    "mustDevelop": [
      {
        "skill": "string",
        "why": "string",
        "learnSteps": ["step 1", "step 2", "step 3"],
        "suggestedProject": "string",
        "learningStage": "Weeks 1-3"
      }
    ],
    "strengthen": [
      {
        "skill": "string",
        "why": "string",
        "learnSteps": ["step 1", "step 2"],
        "suggestedProject": "string",
        "learningStage": "Ongoing"
      }
    ],
    "optional": [
      {
        "skill": "string",
        "why": "string",
        "learnSteps": ["step 1"],
        "suggestedProject": "string",
        "learningStage": "Elective"
      }
    ]
  },
  "projectRecommendations": [
    {
      "title": "string",
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "skillsDemonstrated": ["string"],
      "whatItShouldContain": "string",
      "whyItStrengthens": "string"
    }
  ],
  "targetPreparation": {
    "roleFocus": ["string", "string", "string", "string"],
    "companyResearch": [
      {
        "topic": "string",
        "source": "string (e.g. Public Engineering Blog, Job Listing)",
        "publicDetail": "string",
        "aiRecommendation": "string"
      }
    ]
  },
  "resumeImprovements": [
    {
      "section": "string",
      "before": "string (extracted from or representative of weak resume bullet)",
      "after": "string (action-verb, metric, stack, outcome)",
      "rationale": "string"
    }
  ],
  "roadmap": [
    {
      "phaseNumber": 1,
      "title": "Fix Resume & Evidence",
      "duration": "1-2 Weeks",
      "milestones": ["string", "string", "string"]
    },
    {
      "phaseNumber": 2,
      "title": "Build Core Missing Skills",
      "duration": "3-6 Weeks",
      "milestones": ["string", "string", "string"]
    },
    {
      "phaseNumber": 3,
      "title": "Build Capstone Projects",
      "duration": "4-8 Weeks",
      "milestones": ["string", "string"]
    },
    {
      "phaseNumber": 4,
      "title": "Gain Experience & Signals",
      "duration": "2-4 Weeks",
      "milestones": ["string", "string"]
    },
    {
      "phaseNumber": 5,
      "title": "Targeted Applications & Interviews",
      "duration": "Ongoing",
      "milestones": ["string", "string"]
    }
  ],
  "nextFiveActions": [
    {
      "step": 1,
      "action": "string",
      "detail": "string",
      "category": "Resume" | "Skill" | "Project" | "Application"
    }
  ],
  "readabilityChecklist": [
    {
      "category": "Clear section headings",
      "status": "Good" | "Improve" | "Problem",
      "comment": "string"
    },
    {
      "category": "Contact information",
      "status": "Good" | "Improve" | "Problem",
      "comment": "string"
    },
    {
      "category": "Consistent dates",
      "status": "Good" | "Improve" | "Problem",
      "comment": "string"
    },
    {
      "category": "Consistent formatting",
      "status": "Good" | "Improve" | "Problem",
      "comment": "string"
    },
    {
      "category": "Excessive graphics",
      "status": "Good" | "Improve" | "Problem",
      "comment": "string"
    },
    {
      "category": "Tables that may affect parsing",
      "status": "Good" | "Improve" | "Problem",
      "comment": "string"
    },
    {
      "category": "Unusual fonts",
      "status": "Good" | "Improve" | "Problem",
      "comment": "string"
    },
    {
      "category": "Missing keywords",
      "status": "Good" | "Improve" | "Problem",
      "comment": "string"
    },
    {
      "category": "Long paragraphs",
      "status": "Good" | "Improve" | "Problem",
      "comment": "string"
    },
    {
      "category": "Unclear project descriptions",
      "status": "Good" | "Improve" | "Problem",
      "comment": "string"
    }
  ]
}`;

    const textResponse = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an honest, insightful, encouraging technical career coach who analyzes resumes with pinpoint precision. Only rewrite bullets based on the candidate's actual resume facts without inventing fake companies or degrees. Return strict JSON.",
      },
    });

    const parsed = cleanAndParseJSON(textResponse);
    if (!parsed) {
      throw new Error("Model response was empty or unparseable JSON");
    }
    return res.json({ success: true, report: parsed });
  } catch (error: any) {
    console.warn("[Server] Gemini analysis API fallback triggered:", error?.message || error);
    return res.json({
      fallback: true,
      error: error?.message || "Analysis temporarily using local ground truth engine",
    });
  }
});

// API: Career Coach Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, context } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        reply: "I am ready to help you navigate your career gaps! Ask about specific skills, projects to prioritize, or bullet point rewrites.",
        fallback: true,
      });
    }

    const systemPrompt = `You are the ResumeLens AI Career Coach.
Candidate target role: "${context?.targetRole || 'Software/AI Engineer'}".
Target company: "${context?.targetCompany || 'Tech'}"
Experience level: "${context?.experienceLevel || 'Student'}".
Resume Summary Context: ${JSON.stringify(context?.summary || {})}.

Be direct, actionable, practical, supportive, and grounded in industry engineering hiring norms. Keep responses concise (under 180 words unless the user explicitly requests code or full rewrites).`;

    const userLastMessage = messages[messages.length - 1]?.content || "What should I focus on next?";

    const replyText = await generateWithFallback(ai, {
      contents: [
        {
          text: `System Context: ${systemPrompt}\n\nCandidate Question: ${userLastMessage}`,
        },
      ],
    });

    return res.json({ reply: replyText });
  } catch (err: any) {
    console.warn("[Server] Chat fallback triggered:", err?.message || err);
    return res.json({
      reply: "Based on your target profile, focusing on building end-to-end projects with clear measurable outcomes is your best lever.",
      fallback: true,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ResumeLens AI server listening on port ${PORT}`);
  });
}

startServer();
