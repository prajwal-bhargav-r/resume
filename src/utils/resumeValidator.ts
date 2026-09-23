export interface ResumeVerificationResult {
  isResume: boolean;
  confidence: number; // 0 to 100
  identifiedType: string; // e.g. "Software Resume", "Financial Invoice", "Source Code", etc.
  identificationDetails: string;
  detectedSections: string[];
  missingStandardSections: string[];
  errorMessage?: string; // Will contain '"PLEASE UPLOAD AN GENUINE RESUME"' if not a resume
}

// Common patterns for non-resume document types
const NON_RESUME_DETECTORS = [
  {
    type: "Financial Invoice / Billing Receipt",
    weight: 15,
    keywords: [
      /\b(invoice\s*#?|invoice\s*number|billing\s*address|billed\s*to|remit\s*to|subtotal|total\s*due|amount\s*due|payment\s*terms|unit\s*price|qty\b|tax\s*rate|vat\s*reg|receipt\s*#)\b/i,
      /\b(payment\s*method|bank\s*transfer|due\s*date:\s*\d|balance\s*due|purchase\s*order|po\s*box)\b/i
    ],
    explanation: "This document contains billing numbers, currency lines, itemized unit prices, or tax breakdowns typical of an invoice or receipt rather than employment history."
  },
  {
    type: "Programming Source Code / Script",
    weight: 15,
    keywords: [
      /\b(import\s+React|import\s+.*from\s+['"]|function\s+[a-zA-Z0-9_]+\s*\(|const\s+[a-zA-Z0-9_]+\s*=|def\s+[a-zA-Z0-9_]+\s*\(|public\s+static\s+void\s+main|console\.log|npm\s+run|class\s+[A-Z][a-zA-Z0-9_]*\s*\{|<\/?[a-z][a-z0-9]*\b|std::cout|#include\s*<)\b/,
      /[{}();]{3,}/
    ],
    explanation: "This file consists of computer source code, function definitions, script imports, or programming syntax rather than a candidate resume."
  },
  {
    type: "Cooking Recipe / Culinary Guide",
    weight: 15,
    keywords: [
      /\b(ingredients?:|preheat\s*oven|tablespoon|teaspoon|cups?\s+of|pinch\s+of\s+salt|simmer\s+for|cook\s+over\s+medium|bake\s+for\s+\d+|servings?:\s*\d|directions?:|stir\s+well|whisk\s+together)\b/i
    ],
    explanation: "This document contains cooking ingredients, preparation steps, oven temperatures, or culinary directions."
  },
  {
    type: "Legal Contract / Agreement / Policy",
    weight: 15,
    keywords: [
      /\b(terms\s*and\s*conditions|privacy\s*policy|confidentiality\s*agreement|non-disclosure|indemnif(y|ication)|governing\s*law|hereby\s*agrees?|party\s*of\s*the\s*first\s*part|severability|whereas\b|in\s*witness\s*whereof)\b/i
    ],
    explanation: "This text consists of legal clauses, terms of service, indemnification, or contractual definitions."
  },
  {
    type: "Medical Prescription / Clinical Record",
    weight: 15,
    keywords: [
      /\b(prescription|rx\s*#?|patient\s*name|dosage|mg\s*tablet|take\s+\d+\s+times?\s+daily|refills?:|physician\s*signature|diagnosis:\s*|clinic\s*notes|blood\s*pressure)\b/i
    ],
    explanation: "This document contains clinical patient information, prescription dosages, or medical diagnostic notes."
  },
  {
    type: "Random Placeholder / Gibberish",
    weight: 12,
    keywords: [
      /\b(lorem\s*ipsum|dolor\s*sit\s*amet|consectetur\s*adipiscing|asdf|qwerty|testing\s*1\s*2\s*3|blah\s*blah|foobar)\b/i,
      /(.)\1{6,}/
    ],
    explanation: "This text contains repetitive placeholder filler, lorem ipsum, or random characters."
  },
  {
    type: "Academic Research Paper / Thesis",
    weight: 10,
    keywords: [
      /\b(abstract\b.*introduction\b|related\s*works?|methodology|experimental\s*results|figure\s*\d+:|table\s*\d+:|references\s*\[\d+\]|in\s*this\s*paper\s*,?\s*we\s*propose|et\s*al\.\s*\[\d+\])\b/i
    ],
    explanation: "This document reads like an academic research publication or thesis without personal resume career history or professional contact coordinates."
  },
  {
    type: "Meeting Minutes / Internal Notes",
    weight: 10,
    keywords: [
      /\b(meeting\s*minutes|attendees?:|agenda\s*items?:|action\s*items?:|adjourned\s*at|roll\s*call|minutes\s*of\s*the\s*meeting)\b/i
    ],
    explanation: "This text represents meeting minutes, agenda notes, or internal team action items."
  }
];

// Essential Resume Section and Content Markers
const RESUME_MARKERS = [
  { section: "Experience / Employment", regex: /\b(experience|work\s*experience|employment(\s*history)?|professional\s*experience|career\s*history|job\s*history|internships?|work\s*history)\b/i },
  { section: "Education", regex: /\b(education|academic\s*background|b\.?tech|b\.?s\.?|bachelor|m\.?s\.?|master|ph\.?d|degree|university|college|gpa|cgpa|school\s*of)\b/i },
  { section: "Skills / Competencies", regex: /\b(skills|technical\s*skills|core\s*competencies|technologies|proficiencies|programming\s*languages|tools\s*&?\s*frameworks)\b/i },
  { section: "Projects", regex: /\b(projects|academic\s*projects|personal\s*projects|key\s*projects|portfolio|technical\s*projects)\b/i },
  { section: "Summary / Objective", regex: /\b(summary|professional\s*summary|profile|about\s*me|career\s*objective|executive\s*summary)\b/i },
  { section: "Certifications / Awards", regex: /\b(certifications?|awards?|achievements?|honors?|licenses?|publications?)\b/i }
];

const CONTACT_MARKERS = [
  { type: "Email", regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ },
  { type: "Phone", regex: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/ },
  { type: "LinkedIn/GitHub", regex: /(linkedin\.com\/in\/|github\.com\/)/i }
];

const ACTION_VERBS = [
  /\b(developed|engineered|implemented|designed|built|managed|led|spearheaded|architected|optimized|created|maintained|orchestrated|automated|collaborated|conducted|resolved)\b/i
];

/**
 * Validates document text to determine if it is an actual resume
 * or something other than a resume, identifying its specific category.
 */
export function validateResumeContent(
  text: string, 
  fileName: string = ""
): ResumeVerificationResult {
  const trimmed = (text || "").trim();

  // 1. Check if completely empty or minimal text
  if (!trimmed || trimmed.length < 50) {
    return {
      isResume: false,
      confidence: 99,
      identifiedType: "Empty / Incomplete Document",
      identificationDetails: "The uploaded file does not contain enough readable text (minimum 50 characters required).",
      detectedSections: [],
      missingStandardSections: ["Experience", "Education", "Skills", "Contact Information"],
      errorMessage: '"PLEASE UPLOAD AN GENUINE RESUME"'
    };
  }

  // 2. Test for explicit non-resume document categories
  for (const detector of NON_RESUME_DETECTORS) {
    let matchCount = 0;
    for (const kwRegex of detector.keywords) {
      if (kwRegex.test(trimmed)) {
        matchCount++;
      }
    }

    // If strong match for non-resume category
    if (matchCount >= 2 || (detector.keywords.length === 1 && matchCount >= 1)) {
      // Check if it also lacks core resume headers
      const hasEducation = RESUME_MARKERS[1].regex.test(trimmed);
      const hasExperience = RESUME_MARKERS[0].regex.test(trimmed);
      const hasSkills = RESUME_MARKERS[2].regex.test(trimmed);

      // If it strongly matches a non-resume pattern and lacks 2+ core resume sections
      if (!((hasEducation && hasExperience) || (hasExperience && hasSkills))) {
        return {
          isResume: false,
          confidence: 95,
          identifiedType: detector.type,
          identificationDetails: detector.explanation,
          detectedSections: [],
          missingStandardSections: ["Work Experience", "Education", "Technical Skills"],
          errorMessage: '"PLEASE UPLOAD AN GENUINE RESUME"'
        };
      }
    }
  }

  // 3. Check for Resume Section Headers
  const detectedSections: string[] = [];
  const missingStandardSections: string[] = [];

  for (const marker of RESUME_MARKERS) {
    if (marker.regex.test(trimmed)) {
      detectedSections.push(marker.section);
    } else {
      missingStandardSections.push(marker.section);
    }
  }

  // 4. Check for contact details
  let hasContact = false;
  for (const contact of CONTACT_MARKERS) {
    if (contact.regex.test(trimmed)) {
      hasContact = true;
      break;
    }
  }

  // 5. Check for action verbs
  let hasActionVerbs = false;
  for (const verb of ACTION_VERBS) {
    if (verb.test(trimmed)) {
      hasActionVerbs = true;
      break;
    }
  }

  // 6. Word count and structural check
  const wordCount = trimmed.split(/\s+/).length;

  // Evaluation scoring
  let resumeScore = 0;
  resumeScore += detectedSections.length * 20; // up to 120
  if (hasContact) resumeScore += 25;
  if (hasActionVerbs) resumeScore += 20;
  if (wordCount >= 80 && wordCount <= 2500) resumeScore += 15;

  // File name heuristic hint (e.g. invoice.pdf, recipe.docx, test.js vs resume.pdf, cv.pdf)
  const lowerFile = fileName.toLowerCase();
  if (lowerFile.includes("invoice") || lowerFile.includes("bill") || lowerFile.includes("receipt") || lowerFile.includes("ticket")) {
    resumeScore -= 40;
  }
  if (lowerFile.includes(".js") || lowerFile.includes(".ts") || lowerFile.includes(".py") || lowerFile.includes(".java") || lowerFile.includes(".cpp")) {
    resumeScore -= 50;
  }
  if (lowerFile.includes("resume") || lowerFile.includes("cv") || lowerFile.includes("curriculum")) {
    resumeScore += 15;
  }

  // Final Decision Threshold
  // A genuine resume should have at least 2 distinct resume sections (e.g. Education + Skills, or Experience + Education)
  const hasCoreSections = detectedSections.length >= 2;
  const isLikelyResume = resumeScore >= 60 && hasCoreSections;

  if (isLikelyResume) {
    return {
      isResume: true,
      confidence: Math.min(99, Math.max(70, resumeScore)),
      identifiedType: "Candidate Resume / Curriculum Vitae",
      identificationDetails: `Verified authentic candidate profile containing ${detectedSections.join(", ")} and professional qualifications.`,
      detectedSections,
      missingStandardSections,
    };
  }

  // Not a resume: synthesize what it might be
  let fallbackIdentifiedType = "Non-Resume General Document";
  let fallbackDetails = "This file does not have the structure of a genuine resume. It is missing essential sections such as Work Experience, Education, or Technical Skills.";

  if (wordCount < 60) {
    fallbackIdentifiedType = "Short Note / Incomplete Text";
    fallbackDetails = "The uploaded file is too brief and lacks structured career or educational background.";
  } else if (!hasContact && detectedSections.length === 0) {
    fallbackIdentifiedType = "Generic Document / Article";
    fallbackDetails = "The uploaded file appears to be an article, essay, or generic text document with no candidate contact details, work history, or qualifications.";
  }

  return {
    isResume: false,
    confidence: 85,
    identifiedType: fallbackIdentifiedType,
    identificationDetails: fallbackDetails,
    detectedSections,
    missingStandardSections: ["Work Experience", "Education", "Skills", "Contact Info"],
    errorMessage: '"PLEASE UPLOAD AN GENUINE RESUME"'
  };
}

/**
 * Asynchronously verifies a resume using the server-side Gemini API (if available),
 * gracefully falling back to local heuristic verification.
 */
export async function verifyResumeRemotely(
  text: string, 
  fileName: string,
  fileBase64?: string
): Promise<ResumeVerificationResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch("/api/verify-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        fileName,
        fileBase64
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.isResume === "boolean") {
        return {
          isResume: data.isResume,
          confidence: data.confidence || 90,
          identifiedType: data.identifiedType || (data.isResume ? "Candidate Resume" : "Non-Resume Document"),
          identificationDetails: data.identificationDetails || data.explanation || "",
          detectedSections: data.detectedSections || [],
          missingStandardSections: data.missingStandardSections || [],
          errorMessage: data.isResume ? undefined : '"PLEASE UPLOAD AN GENUINE RESUME"'
        };
      }
    }
  } catch (err) {
    console.warn("Server verify endpoint unavailable, using local validator:", err);
  }

  // Local fallback verification
  return validateResumeContent(text, fileName);
}
