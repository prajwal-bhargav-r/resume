import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

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

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
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
