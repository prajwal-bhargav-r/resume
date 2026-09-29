export interface ResumeVerificationResult {
  isResume: boolean;
  confidence: number; // 0 to 100
  identifiedType: string; // e.g. "Candidate Resume / CV", "Financial Invoice", etc.
  identificationDetails: string;
  detectedSections: string[];
  missingStandardSections: string[];
  errorMessage?: string; // Will contain '"PLEASE UPLOAD AN GENUINE RESUME"' if not a resume
  extractedText?: string;
}

// Common patterns for unmistakably non-resume document types
const NON_RESUME_DETECTORS = [
  {
    type: "Financial Invoice / Billing Receipt",
    keywords: [
      /\b(invoice\s*#?|invoice\s*number|billing\s*address|billed\s*to|remit\s*to|subtotal|total\s*due|amount\s*due|payment\s*terms|unit\s*price|qty\b|tax\s*rate|vat\s*reg|receipt\s*#)\b/i,
      /\b(payment\s*method|bank\s*transfer|due\s*date:\s*\d|balance\s*due|purchase\s*order)\b/i
    ],
    explanation: "This document contains billing numbers, currency lines, itemized unit prices, or tax breakdowns typical of an invoice or receipt rather than employment history."
  },
  {
    type: "Cooking Recipe / Culinary Guide",
    keywords: [
      /\b(ingredients?:|preheat\s*oven|tablespoon|teaspoon|cups?\s+of|pinch\s+of\s+salt|simmer\s+for|cook\s+over\s+medium|bake\s+for\s+\d+|servings?:\s*\d|directions?:|stir\s+well|whisk\s+together)\b/i
    ],
    explanation: "This document contains cooking ingredients, preparation steps, oven temperatures, or culinary directions."
  },
  {
    type: "Legal Contract / Agreement / Policy",
    keywords: [
      /\b(terms\s*and\s*conditions|privacy\s*policy|confidentiality\s*agreement|non-disclosure|indemnif(y|ication)|governing\s*law|hereby\s*agrees?|party\s*of\s*the\s*first\s*part|severability|whereas\b|in\s*witness\s*whereof)\b/i
    ],
    explanation: "This text consists of legal clauses, terms of service, indemnification, or contractual definitions."
  },
  {
    type: "Medical Prescription / Clinical Record",
    keywords: [
      /\b(prescription|rx\s*#?|patient\s*name|dosage|mg\s*tablet|take\s+\d+\s+times?\s+daily|refills?:|physician\s*signature|diagnosis:\s*|clinic\s*notes|blood\s*pressure)\b/i
    ],
    explanation: "This document contains clinical patient information, prescription dosages, or medical diagnostic notes."
  },
  {
    type: "Random Placeholder / Gibberish",
    keywords: [
      /\b(lorem\s*ipsum|dolor\s*sit\s*amet|consectetur\s*adipiscing|asdfgh|qwertyui|blah\s*blah\s*blah)\b/i,
      /(.)\1{12,}/
    ],
    explanation: "This text contains repetitive placeholder filler, lorem ipsum, or random unreadable characters."
  }
];

// Essential Resume Section and Content Markers (inclusive of all real-world formats)
const RESUME_MARKERS = [
  { 
    section: "Experience / Work History", 
    regex: /\b(experience|work\s*experience|employment(\s*history)?|professional\s*experience|career\s*history|job\s*history|internships?|work\s*history|work|roles?|positions?|professional\s*background|responsibilities|positions?\s*held|employment\s*record|career\s*overview|career\s*profile)\b/i 
  },
  { 
    section: "Education", 
    regex: /\b(education|academic(\s*background)?|academics?|qualifications?|b\.?tech|b\.?s\.?|b\.?e\.?|bca|mca|bba|bachelor|m\.?s\.?|m\.?tech|master|ph\.?d|mba|degree|university|college|gpa|cgpa|school(\s*of)?|graduat(ed?|ion)|coursework|diploma|matriculation|hsc|ssc|board)\b/i 
  },
  { 
    section: "Skills / Technologies", 
    regex: /\b(skills?|technical\s*skills?|core\s*competencies|technologies|proficiencies|programming\s*languages|tools(\s*&?\s*frameworks)?|frameworks|tech\s*stack|languages|competencies|expertise|key\s*skills?|strengths|technical\s*proficiency|capabilities|toolbox)\b/i 
  },
  { 
    section: "Projects", 
    regex: /\b(projects?|academic\s*projects?|personal\s*projects?|key\s*projects?|portfolio|technical\s*projects?|capstone|github|hackathon|open\s*source|key\s*initiatives|assignments?)\b/i 
  },
  { 
    section: "Summary / Profile", 
    regex: /\b(summary|professional\s*summary|profile|about\s*me|about|career\s*objective|objective|executive\s*summary|overview|biography|bio|synopsis|personal\s*details|declaration)\b/i 
  },
  { 
    section: "Certifications / Awards", 
    regex: /\b(certifications?|certificates?|awards?|achievements?|honors?|licenses?|publications?|activities|leadership|accomplishments|extracurricular|interests|hobbies)\b/i 
  }
];

const CONTACT_MARKERS = [
  { type: "Email", regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i },
  { type: "Phone", regex: /(\+?\d{1,4}[-.\s]?)?(\(?\d{2,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}|\b\d{10}\b/ },
  { type: "Web Profile", regex: /(linkedin\.com|github\.com|gitlab\.com|portfolio|leetcode\.com|behance\.net|medium\.com|https?:\/\/)/i },
  { type: "Location", regex: /\b(bangalore|bengaluru|mumbai|delhi|hyderabad|chennai|pune|kolkata|noida|gurgaon|new york|san francisco|california|london|remote|india|usa|united states|uk|canada)\b/i }
];

const CAREER_INDICATORS = [
  /\b(software\s*engineer|developer|frontend|backend|fullstack|data\s*scientist|intern|student|analyst|manager|specialist|consultant|architect|designer|lead|associate|engineer|officer|executive|administrator|coordinator|director|programmer|technician|representative|accountant|writer|educator|nurse|fresher)\b/i,
  /\b((19|20)\d\d\s*[-–—/]\s*((19|20)\d\d|present|current)|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i,
  /\b(developed|engineered|implemented|designed|built|managed|led|optimized|created|maintained|collaborated|conducted|resolved|analyzed|assisted|coordinated|organized|supported|tested|handled|worked|achieved|trained|monitored|improved|delivered)\b/i
];

/**
 * Validates document text to determine if it is an actual resume
 * or something other than a resume, identifying its specific category.
 * Designed to be permissive with genuine candidates across all disciplines and levels.
 */
export function validateResumeContent(
  text: string, 
  fileName: string = ""
): ResumeVerificationResult {
  const trimmed = (text || "").trim();

  // 1. Check if completely empty or minimal text
  if (!trimmed || trimmed.length < 20) {
    return {
      isResume: false,
      confidence: 95,
      identifiedType: "Empty / Incomplete Document",
      identificationDetails: "The uploaded file does not contain enough readable text.",
      detectedSections: [],
      missingStandardSections: ["Experience", "Education", "Skills", "Contact Information"],
      errorMessage: '"PLEASE UPLOAD AN GENUINE RESUME"'
    };
  }

  // 2. Check for Resume Section Headers
  const detectedSections: string[] = [];
  const missingStandardSections: string[] = [];

  for (const marker of RESUME_MARKERS) {
    if (marker.regex.test(trimmed)) {
      detectedSections.push(marker.section);
    } else {
      missingStandardSections.push(marker.section);
    }
  }

  // 3. Check for contact details
  let hasContact = false;
  for (const contact of CONTACT_MARKERS) {
    if (contact.regex.test(trimmed)) {
      hasContact = true;
      break;
    }
  }

  // 4. Check for career signals (job titles, dates, action verbs)
  let careerSignalsCount = 0;
  for (const indicator of CAREER_INDICATORS) {
    if (indicator.test(trimmed)) {
      careerSignalsCount++;
    }
  }

  // 5. Test for explicit non-resume document categories
  // Only trigger if document completely lacks resume sections AND contact info
  if (detectedSections.length === 0 && !hasContact) {
    for (const detector of NON_RESUME_DETECTORS) {
      let matchCount = 0;
      for (const kwRegex of detector.keywords) {
        if (kwRegex.test(trimmed)) {
          matchCount++;
        }
      }

      if (matchCount >= 2 || (detector.keywords.length === 1 && matchCount >= 1)) {
        return {
          isResume: false,
          confidence: 90,
          identifiedType: detector.type,
          identificationDetails: detector.explanation,
          detectedSections,
          missingStandardSections: ["Work Experience", "Education", "Technical Skills"],
          errorMessage: '"PLEASE UPLOAD AN GENUINE RESUME"'
        };
      }
    }
  }

  // 6. Word count and filename signals
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  const lowerFile = fileName.toLowerCase();
  const hasResumeInFilename = 
    lowerFile.includes("resume") || 
    lowerFile.includes("cv") || 
    lowerFile.includes("curriculum") || 
    lowerFile.includes("bio") || 
    lowerFile.includes("profile");

  // Scoring
  let resumeScore = 40; // baseline for readable candidate text
  resumeScore += detectedSections.length * 15;
  if (hasContact) resumeScore += 20;
  if (careerSignalsCount >= 1) resumeScore += 15;
  if (careerSignalsCount >= 2) resumeScore += 15;
  if (hasResumeInFilename) resumeScore += 20;
  if (wordCount >= 25) resumeScore += 10;

  // Genuine resume threshold:
  // - Any document with at least 1 detected section
  // - OR contact information (email/phone/link) + career signals or word count
  // - OR resume in filename + at least some career signals or contact
  // - OR career signals count >= 1 with reasonable word count
  // - OR multiple career signals
  const isLikelyResume = 
    (detectedSections.length >= 1) ||
    (hasContact && (careerSignalsCount >= 1 || wordCount >= 15)) ||
    (hasResumeInFilename && (wordCount >= 15 || careerSignalsCount >= 1)) ||
    (careerSignalsCount >= 2) ||
    (wordCount >= 40 && careerSignalsCount >= 1);

  if (isLikelyResume) {
    return {
      isResume: true,
      confidence: Math.min(99, Math.max(75, resumeScore)),
      identifiedType: "Candidate Resume / Curriculum Vitae",
      identificationDetails: `Verified authentic candidate profile containing ${detectedSections.length > 0 ? detectedSections.join(", ") : "career qualifications"} and credentials.`,
      detectedSections,
      missingStandardSections,
    };
  }

  // If clearly lacking structure and no signals
  return {
    isResume: false,
    confidence: 80,
    identifiedType: "Unstructured / Incomplete Document",
    identificationDetails: "The uploaded file does not clearly reflect standard candidate sections such as Experience, Education, or Skills.",
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
    const timeoutId = setTimeout(() => controller.abort(), 7000);

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
          identifiedType: data.identifiedType || (data.isResume ? "Candidate Resume / CV" : "Non-Resume Document"),
          identificationDetails: data.identificationDetails || data.explanation || "",
          detectedSections: data.detectedSections || [],
          missingStandardSections: data.missingStandardSections || [],
          errorMessage: data.isResume ? undefined : '"PLEASE UPLOAD AN GENUINE RESUME"',
          extractedText: data.extractedText
        };
      }
    }
  } catch (err) {
    console.warn("Server verify endpoint unavailable, using local validator:", err);
  }

  // Local fallback verification
  return validateResumeContent(text, fileName);
}
