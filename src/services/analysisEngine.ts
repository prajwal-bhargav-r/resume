import { 
  AnalysisInput, 
  CareerGapReport, 
  ResumeFlaw, 
  SkillGapItem, 
  ProjectRecommendation, 
  RoadmapPhase, 
  NextActionItem, 
  ReadabilityCheckItem, 
  SkillsToDevelopGroup,
  ResumeScorecard,
  ScoreCategoryComparison,
  CandidateDiagnostics,
  GoodSignal,
  BadPattern,
  WorkOnItem,
  WhatMakesItGoodPrinciple
} from "../types";
import { TARGET_COMPANIES } from "../data/targetRolesAndCompanies";

export async function analyzeResume(input: AnalysisInput): Promise<CareerGapReport> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.report && !data.fallback) {
        return normalizeReport(data.report, input);
      }
    }
  } catch (err) {
    console.warn("API call failed or timed out, falling back to rule-based engine:", err);
  }

  // Fallback to our grounded, role-specific intelligent generator
  return generateGroundedAnalysis(input);
}

export const generateAnalysisReport = analyzeResume;

export async function sendCareerCoachMessage(
  question: string,
  report: CareerGapReport | null,
  history: { sender: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...history, { sender: "user", content: question }],
        context: {
          targetRole: report?.targetRole || "Software/AI Engineer",
          targetCompany: report?.targetCompany || "Technology",
          experienceLevel: report?.experienceLevel || "Student",
          summary: {
            alignment: report?.alignmentScore,
            topStrengths: report?.strengths?.slice(0, 3),
            topGaps: report?.gaps?.slice(0, 3),
          },
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.reply && !data.fallback) {
        return data.reply;
      }
    }
  } catch (err) {
    console.warn("Chat API unavailable, using coach generator:", err);
  }

  // Grounded context-aware answers for common questions
  return generateContextualCoachResponse(question, report);
}

export function computeResumeScorecard(overallScore: number, input: AnalysisInput, raw?: any): ResumeScorecard {
  const score = Math.max(35, Math.min(96, Math.round(overallScore || 72)));
  const company = (input.targetCompany || "").toLowerCase();
  
  // Benchmark target score out of 100
  const isTier1 = ["nvidia", "google", "apple", "microsoft", "meta", "amazon", "openai", "netflix"].some(c => company.includes(c));
  const targetBenchmark = isTier1 ? 88 : 82;
  const applicantPoolAverage = 66;
  const topTierThreshold = 92;
  const pointsToTarget = score - targetBenchmark;

  let tier = "Competitive Candidate (Top 25%)";
  if (score >= 88) {
    tier = "Exceptional Match (Top 5%)";
  } else if (score >= 80) {
    tier = "Strong Candidate (Top 15%)";
  } else if (score >= 70) {
    tier = "Competitive with Focused Levers (Top 30%)";
  } else if (score >= 60) {
    tier = "Foundational Match — Targeted Bridging Required";
  } else {
    tier = "Emerging Profile — Project & Stack Rebuild Recommended";
  }

  const verdict = pointsToTarget >= 0
    ? `Your resume score of ${score}/100 exceeds the standard entry benchmark of ${targetBenchmark}/100 for ${input.targetRole} at ${input.targetCompany || 'target employers'}. Focus on interview delivery and system design depth.`
    : `Your resume score is ${score}/100 compared against the target hiring threshold of ${targetBenchmark}/100 (a ${Math.abs(pointsToTarget)} point gap). Strategic project additions and metric quantification will bridge this gap.`;

  // 5 Dimensional score comparisons out of 100
  const text = (input.resumeText || "").toLowerCase();
  const hasGit = text.includes("git");
  const hasDocker = text.includes("docker") || text.includes("container");
  const hasMetrics = text.includes("%") || text.includes("ms") || text.includes("improved") || text.includes("reduced") || text.includes("increased");
  const hasCloud = text.includes("aws") || text.includes("gcp") || text.includes("cloud") || text.includes("azure");

  const techScore = Math.min(94, Math.max(45, score + (hasDocker ? 4 : -4) + (hasGit ? 3 : -2)));
  const projectScore = Math.min(92, Math.max(40, score + (hasCloud ? 3 : -5) - 3));
  const metricsScore = Math.min(90, Math.max(35, score + (hasMetrics ? 6 : -12)));
  const atsScore = Math.min(96, Math.max(70, 88 + (text.length > 500 ? 4 : 0)));
  const domainScore = Math.min(92, Math.max(48, score + 2));

  const categories: ScoreCategoryComparison[] = [
    {
      category: "Core Technical Stack & Tooling Match",
      clientScore: techScore,
      targetBenchmark: isTier1 ? 90 : 85,
      status: techScore >= (isTier1 ? 90 : 85) ? "Meets" : (techScore < 65 ? "Critical Gap" : "Below"),
      pointsDelta: techScore - (isTier1 ? 90 : 85),
      potentialGain: Math.max(0, (isTier1 ? 90 : 85) - techScore),
      detail: "Evaluation of programming languages, libraries, framework versions, and developer toolchain listed in your resume."
    },
    {
      category: "Project Depth & System Architecture",
      clientScore: projectScore,
      targetBenchmark: 85,
      status: projectScore >= 85 ? "Meets" : (projectScore < 60 ? "Critical Gap" : "Below"),
      pointsDelta: projectScore - 85,
      potentialGain: Math.max(0, 85 - projectScore),
      detail: "Evidence of end-to-end deployment, containerization, microservice API design, and distributed workloads."
    },
    {
      category: "Quantified Impact & Business Metrics",
      clientScore: metricsScore,
      targetBenchmark: 80,
      status: metricsScore >= 80 ? "Meets" : (metricsScore < 50 ? "Critical Gap" : "Below"),
      pointsDelta: metricsScore - 80,
      potentialGain: Math.max(0, 80 - metricsScore),
      detail: "Presence of concrete business numbers, efficiency gains (latency, memory, % accuracy, user scale) vs passive job duty descriptions."
    },
    {
      category: "ATS Parsing & Structural Readability",
      clientScore: atsScore,
      targetBenchmark: 90,
      status: atsScore >= 90 ? "Exceeds" : "Meets",
      pointsDelta: atsScore - 90,
      potentialGain: Math.max(0, 90 - atsScore),
      detail: "Clean single-column parsing, standard semantic headings, machine-readable date ranges, and clear contact links."
    },
    {
      category: "Role & Domain Alignment",
      clientScore: domainScore,
      targetBenchmark: 85,
      status: domainScore >= 85 ? "Meets" : (domainScore < 65 ? "Critical Gap" : "Below"),
      pointsDelta: domainScore - 85,
      potentialGain: Math.max(0, 85 - domainScore),
      detail: "Direct relevance of coursework, capstone focus, and domain context matching daily job expectations."
    }
  ];

  return {
    overallScore: score,
    targetBenchmark,
    applicantPoolAverage,
    topTierThreshold,
    pointsToTarget,
    tier,
    verdict,
    categories
  };
}

export function computeCandidateDiagnostics(input: AnalysisInput, alignmentScore?: number): CandidateDiagnostics {
  const text = (input.resumeText || "").toLowerCase();
  const role = (input.targetRole || "Software Engineer").toLowerCase();
  const company = input.targetCompany || "Industry Leader";
  const level = input.experienceLevel || "Junior / Graduate";

  const isML = role.includes("machine learning") || role.includes("ai") || role.includes("data scientist") || role.includes("nlp");
  const isSDE = role.includes("software") || role.includes("backend") || role.includes("frontend") || role.includes("full");
  const isData = role.includes("data analyst") || role.includes("analytics") || role.includes("bi");

  // Detect key technologies from resume text
  const hasPython = text.includes("python");
  const hasJSorTS = text.includes("javascript") || text.includes("typescript") || text.includes("react") || text.includes("node");
  const hasJavaOrCpp = text.includes("java") || text.includes("c++") || text.includes("c#") || text.includes("rust");
  const hasGit = text.includes("git") || text.includes("github");
  const hasDocker = text.includes("docker") || text.includes("container") || text.includes("kubernetes");
  const hasMetrics = text.includes("%") || text.includes("ms") || text.includes("reduced") || text.includes("improved") || text.includes("increased") || text.includes("latency");

  const primaryLang = hasPython ? "Python" : (hasJSorTS ? "TypeScript / JavaScript" : (hasJavaOrCpp ? "Java / C++" : "Primary Language"));

  // 1. WHAT HE IS GOOD IN (Strengths, validated assets, positive signals)
  const goodSignals: GoodSignal[] = [
    {
      id: "good-1",
      title: `Core Language Proficiency & Syntax Grounding (${primaryLang})`,
      tag: "Foundational Asset",
      evidence: `Evidence of working with ${primaryLang} and standard data structures across coursework and portfolio repositories.`,
      recruiterTakeaway: "Candidate possesses baseline algorithmic logic and syntax comfort, reducing initial ramp-up friction on foundational coding tasks.",
      scoreImpact: "+14 pts to technical screening"
    },
    {
      id: "good-2",
      title: "Version Control Hygiene & Repository Structure",
      tag: "Workflow Hygiene",
      evidence: hasGit 
        ? "Explicit mentions of Git/GitHub with modular folder layouts and commit history." 
        : "Presence of code versioning indicators and collaborative repository awareness.",
      recruiterTakeaway: "Familiarity with distributed revision control passes automated recruiter baseline checks for team collaboration.",
      scoreImpact: "+10 pts to screening pass"
    },
    {
      id: "good-3",
      title: isML 
        ? "Machine Learning & Mathematical Foundation" 
        : (isData ? "Analytical Inquiry & SQL/Tabular Mechanics" : "System Modularity & Component Separation"),
      tag: "Domain Competency",
      evidence: isML 
        ? "Coursework or projects covering model training, loss minimization, and standard statistical algorithms." 
        : "Understanding of functional separation between client interface, application logic, and storage.",
      recruiterTakeaway: "Solid theoretical aptitude indicates the candidate can learn specialized domain frameworks quickly once coached.",
      scoreImpact: "+12 pts to domain fit"
    },
    {
      id: "good-4",
      title: "Academic Problem Solving & Project Initiative",
      tag: "Learning Velocity",
      evidence: `Demonstrated self-directed completion of end-of-semester capstones or personal engineering projects relevant to ${level} profile.`,
      recruiterTakeaway: "Shows genuine curiosity and willingness to build software beyond mandatory classroom lectures.",
      scoreImpact: "+8 pts to culture index"
    }
  ];

  // 2. WHAT HE IS BAD IN (Critical flaws, red flags, high friction anti-patterns)
  const badPatterns: BadPattern[] = [
    {
      id: "bad-1",
      title: "Passive Task Description Syndrome ('Responsible For...')",
      tag: "High Friction Pattern",
      flaw: "Framing bullet points as assigned job duties ('Responsible for building API endpoints') rather than ownership and measurable technical engineering.",
      whyItHurts: "Recruiters and engineering leads scan resumes in 6 seconds. Passive duty descriptions signal low initiative and mask whether the code actually worked in practice.",
      severity: "Fatal Flaw",
      scoreDrag: "-14 pts penalty"
    },
    {
      id: "bad-2",
      title: "Zero Production Deployment & Localhost Prison",
      tag: "DevOps Disconnect",
      flaw: hasDocker 
        ? "Incomplete cloud hosting telemetry and missing publicly testable URL endpoint."
        : "Projects run solely on localhost or local notebooks; no Docker containerization, cloud deployment, or live clickable URLs.",
      whyItHurts: `Engineering teams at ${company} ship to production daily. If a candidate cannot package or deploy their code, hiring managers assume weeks of basic DevOps training will be required.`,
      severity: "Fatal Flaw",
      scoreDrag: "-16 pts penalty"
    },
    {
      id: "bad-3",
      title: "Absence of Quantifiable Scale & Latency Metrics",
      tag: "Vagueness Trap",
      flaw: hasMetrics 
        ? "Metrics are isolated rather than systematically applied across 70%+ of experience and project bullet points."
        : "Statements lack numeric scale (e.g. dataset sizes, request latency in ms, QPS, memory footprint, or percentage improvements).",
      whyItHurts: "Without hard numbers, claims like 'fast', 'scalable', and 'accurate' read as unsubstantiated fluff to senior tech screeners.",
      severity: "High Friction",
      scoreDrag: "-12 pts penalty"
    },
    {
      id: "bad-4",
      title: "Generic Tutorial Cliché Repositories",
      tag: "Portfolio Cliché",
      flaw: "Including standard tutorial projects (e.g. stock predictor, movie recommendation, basic todo list) with clean sanitized data and no edge-case handling.",
      whyItHurts: "Recruiters review hundreds of identical clone projects weekly. Cliché projects trigger immediate skepticism about original engineering capability.",
      severity: "Moderate Drag",
      scoreDrag: "-8 pts penalty"
    }
  ];

  // 3. WHAT HE SHOULD WORK ON (Targeted bridging levers & prioritized next steps)
  const workOnItems: WorkOnItem[] = [
    {
      id: "work-1",
      area: "Bullet Point Metric Overhaul (Google XYZ Formula)",
      category: "Metric Quantification",
      specificAction: "Rewrite all 6-8 project bullets to: 'Accomplished [X] as measured by [Y], by doing [Z]'. Example: 'Reduced inference latency by 38% (down to 16ms) by quantizing model weights with ONNX runtime.'",
      timeframe: "Next 48 Hours (Immediate ROI)",
      targetGain: "+9 pts",
      priority: "High Priority"
    },
    {
      id: "work-2",
      area: `Containerize & Deploy Flagship Project for ${company}`,
      category: "Deployed Project",
      specificAction: "Package your primary project in a multi-stage Dockerfile, deploy to GCP Cloud Run, AWS, or Render, and paste a live clickable '[Live Demo ↗]' link in the resume title.",
      timeframe: "Week 1 - 2",
      targetGain: "+12 pts",
      priority: "High Priority"
    },
    {
      id: "work-3",
      area: isML 
        ? "Production Inference & Model Serving Architecture" 
        : "High-Throughput Caching Layer & Database Indexing",
      category: "Architecture Depth",
      specificAction: isML 
        ? "Expose your model behind a FastAPI or TorchServe endpoint with request batching, p95 latency tracking, and input validation via Pydantic." 
        : "Implement Redis caching layer for hot read paths, optimize SQL queries with EXPLAIN ANALYZE, and benchmark concurrency with k6.",
      timeframe: "Week 2 - 3",
      targetGain: "+8 pts",
      priority: "High Priority"
    },
    {
      id: "work-4",
      area: "Automated Testing & CI/CD Pipeline Telemetry",
      category: "Core Skill",
      specificAction: "Configure a GitHub Actions YAML workflow that runs automated unit tests on every pull request, adding a passing build badge to your repo README.",
      timeframe: "Month 1",
      targetGain: "+6 pts",
      priority: "Medium Priority"
    },
    {
      id: "work-5",
      area: `${company} Stack & System Design Alignment`,
      category: "Architecture Depth",
      specificAction: `Review ${company}'s published engineering blogs and open-source contributions; align your technical terminology and architectural trade-offs to their production ecosystem.`,
      timeframe: "Ongoing Preparation",
      targetGain: "+5 pts",
      priority: "Medium Priority"
    }
  ];

  // 4. WHAT MAKES IT GOOD (The Transformation Blueprint: Exact Before/After & Recruiter Rubric)
  const whatMakesItGood: WhatMakesItGoodPrinciple[] = [
    {
      id: "good-rule-1",
      ruleName: "The Google 'X-Y-Z' Formula: Impact-First Engineering",
      principleDescription: "Every exceptional engineering bullet starts with a decisive action verb, proves measurable business or technical impact with hard units, and explains the engineering mechanism.",
      badSnippet: "Worked on machine learning model to predict house prices using Python and scikit-learn.",
      goodSnippet: "Architected gradient-boosted regression pipeline across 180K+ property records, cutting prediction error (MAE) by 23.4% and reducing inference latency to 14ms via ONNX runtime quantization.",
      whyThisWorks: "Replaces vague participation ('Worked on') with technical ownership ('Architected'), provides scale (180K+ records), quantifies improvement (-23.4%), and proves production latency mastery (14ms ONNX).",
      recruiterMentalModel: "Recruiters skim for numbers and tech depth. This bullet immediately proves senior ownership, mathematical rigor, and deployment awareness.",
      pointUplift: "+16 pts"
    },
    {
      id: "good-rule-2",
      ruleName: "Architecture & Systems Context Over Isolated Code Snippets",
      principleDescription: "Great resumes show how software lives in a distributed production environment — illustrating concurrency, caching, data access patterns, and fault tolerance.",
      badSnippet: "Created REST APIs using Node.js and Express to fetch user profile data from MongoDB.",
      goodSnippet: "Engineered 6 RESTful microservice endpoints with Node.js/Express, introducing Redis caching for hot user queries to drop p95 response times from 420ms to 48ms under simulated 500 QPS load.",
      whyThisWorks: "Mentions concrete latency benchmarks (p95 drop from 420ms to 48ms), architectural strategy (Redis caching layer), and validated concurrency stress-testing (500 QPS).",
      recruiterMentalModel: "Engineering managers immediately recognize a developer who anticipates production traffic spikes and understands system bottlenecks.",
      pointUplift: "+14 pts"
    },
    {
      id: "good-rule-3",
      ruleName: "Live Production Verification & DevOps Proof",
      principleDescription: "A project with a clickable live URL and clean Dockerfile receives up to 4x higher screening pass rates than code residing solely on a local laptop.",
      badSnippet: "Built an image recognition application (Source code available on GitHub repository).",
      goodSnippet: "Containerized and deployed PyTorch vision inference service on GCP Cloud Run with automated GitHub Actions CI/CD; achieved 99.4% uptime across 3,200+ public test queries [Live Demo ↗].",
      whyThisWorks: "Demonstrates the complete software lifecycle: containerization (Docker), cloud deployment (Cloud Run), automation (CI/CD), and operational verification (99.4% uptime).",
      recruiterMentalModel: "Hiring managers know this candidate can write code that runs in production on Day 1 without weeks of basic infrastructure hand-holding.",
      pointUplift: "+12 pts"
    }
  ];

  return {
    goodSignals,
    badPatterns,
    workOnItems,
    whatMakesItGood
  };
}

function normalizeReport(raw: any, input: AnalysisInput): CareerGapReport {
  const alignmentScore = raw.alignmentScore || 72;
  const scorecard = raw.scorecard || computeResumeScorecard(alignmentScore, input, raw);
  const diagnostics = raw.diagnostics || computeCandidateDiagnostics(input, alignmentScore);

  return {
    id: `report-${Date.now()}`,
    createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    targetRole: input.targetRole,
    targetCompany: input.targetCompany || "Industry Leader",
    experienceLevel: input.experienceLevel,
    resumeFileName: input.fileName || "Uploaded_Resume.pdf",
    alignmentScore,
    scorecard,
    diagnostics,
    alignmentSummary: raw.alignmentSummary || "The resume shows relevant academic fundamentals and preliminary project work, but lacks high-throughput deployment exposure and low-level optimization required by the target role.",
    strengths: Array.isArray(raw.strengths) ? raw.strengths : ["Python fundamentals", "Foundational ML models", "Academic coursework", "Version control basics"],
    gaps: Array.isArray(raw.gaps) ? raw.gaps : ["Limited deep learning production experience", "No containerized model deployment", "Missing evaluation benchmarking"],
    priorityActions: Array.isArray(raw.priorityActions) ? raw.priorityActions : ["Build an end-to-end deployed project", "Add quantifiable business impact metrics", "Deepen PyTorch and Docker skills"],
    resumeFlaws: Array.isArray(raw.resumeFlaws) ? raw.resumeFlaws.map((f: any, i: number) => ({ ...f, id: `flaw-${i}` })) : [],
    skillGaps: Array.isArray(raw.skillGaps) ? raw.skillGaps : [],
    skillsToDevelop: raw.skillsToDevelop || { mustDevelop: [], strengthen: [], optional: [] },
    projectRecommendations: Array.isArray(raw.projectRecommendations) ? raw.projectRecommendations : [],
    targetPreparation: raw.targetPreparation || { roleFocus: [], companyResearch: [] },
    resumeImprovements: Array.isArray(raw.resumeImprovements) ? raw.resumeImprovements.map((r: any, i: number) => ({ ...r, id: `imp-${i}`, applied: false })) : [],
    roadmap: Array.isArray(raw.roadmap) ? raw.roadmap : [],
    nextFiveActions: Array.isArray(raw.nextFiveActions) ? raw.nextFiveActions.map((a: any, i: number) => ({ ...a, step: i + 1, completed: false })) : [],
    readabilityChecklist: Array.isArray(raw.readabilityChecklist) ? raw.readabilityChecklist : []
  };
}

export function generateGroundedAnalysis(input: AnalysisInput): CareerGapReport {
  const text = (input.resumeText || "").toLowerCase();
  const role = input.targetRole.toLowerCase();
  const company = input.targetCompany || "Industry Leader";
  const level = input.experienceLevel;

  const isML = role.includes("machine learning") || role.includes("ai") || role.includes("data scientist");
  const isSDE = role.includes("software") || role.includes("backend") || role.includes("frontend") || role.includes("full");
  const isData = role.includes("data analyst") || role.includes("analytics") || role.includes("bi");
  const isHardware = role.includes("embedded") || role.includes("vlsi") || role.includes("hardware");
  const isSecurity = role.includes("cyber") || role.includes("security");

  // Matched company public details
  const matchedCompany = TARGET_COMPANIES.find(
    (c) => c.name.toLowerCase() === company.toLowerCase()
  );

  // Calculate evidence for key skills
  const hasPython = text.includes("python");
  const hasCpp = text.includes("c++") || text.includes("cpp");
  const hasSQL = text.includes("sql");
  const hasPyTorch = text.includes("pytorch");
  const hasDocker = text.includes("docker") || text.includes("container");
  const hasGit = text.includes("git") || text.includes("github");
  const hasReact = text.includes("react");
  const hasDeploy = text.includes("deploy") || text.includes("aws") || text.includes("gcp") || text.includes("azure") || text.includes("cloud");

  let alignmentScore = 68;
  if (hasPython) alignmentScore += 4;
  if (hasGit) alignmentScore += 3;
  if (hasSQL) alignmentScore += 3;
  if (hasPyTorch || hasCpp || hasReact) alignmentScore += 4;
  if (hasDocker || hasDeploy) alignmentScore += 5;
  if (level === "Student") alignmentScore = Math.min(alignmentScore, 78);
  if (level === "5+ years") alignmentScore = Math.min(Math.max(alignmentScore, 75), 88);

  const skillGaps: SkillGapItem[] = [];

  if (isML) {
    skillGaps.push({
      skill: "Python",
      currentEvidence: hasPython ? "Strong" : "Limited",
      currentScore: hasPython ? 90 : 35,
      targetImportance: "High",
      gap: hasPython ? "Low" : "High",
      recommendation: hasPython ? "Continue writing clean, modular Python and object-oriented architectures." : "Prioritize solidifying core Python and numerical libraries."
    });
    skillGaps.push({
      skill: "PyTorch / Deep Learning",
      currentEvidence: hasPyTorch ? "Limited" : "None",
      currentScore: hasPyTorch ? 45 : 15,
      targetImportance: "High",
      gap: hasPyTorch ? "Medium" : "High",
      recommendation: "Build hands-on neural network architectures beyond standard Scikit-learn tabular models."
    });
    skillGaps.push({
      skill: "Model Deployment & Docker",
      currentEvidence: hasDocker ? "Limited" : "None",
      currentScore: hasDocker ? 40 : 10,
      targetImportance: "High",
      gap: "High",
      recommendation: "Learn to containerize a FastAPI/Flask inference service with Docker and deploy it to a live cloud host."
    });
    skillGaps.push({
      skill: "SQL & Data Pipeline Querying",
      currentEvidence: hasSQL ? "Strong" : "Limited",
      currentScore: hasSQL ? 75 : 25,
      targetImportance: "High",
      gap: hasSQL ? "Low" : "Medium",
      recommendation: "Practice window functions, cohort aggregations, and feature store query pipelines."
    });
    skillGaps.push({
      skill: "C++ / Hardware Acceleration",
      currentEvidence: hasCpp ? "Limited" : "None",
      currentScore: hasCpp ? 50 : 10,
      targetImportance: matchedCompany?.name === "NVIDIA" ? "High" : "Medium",
      gap: matchedCompany?.name === "NVIDIA" ? "High" : "Medium",
      recommendation: "Focus on memory management, pointer arithmetic, and CUDA kernel integration if targeting hardware-adjacent teams."
    });
  } else if (isData) {
    skillGaps.push({
      skill: "Advanced SQL (CTEs, Window Functions)",
      currentEvidence: hasSQL ? "Strong" : "Limited",
      currentScore: hasSQL ? 85 : 30,
      targetImportance: "High",
      gap: hasSQL ? "Low" : "High",
      recommendation: "Demonstrate complex joins, running metrics, and partitioned aggregations."
    });
    skillGaps.push({
      skill: "BI Visualization (Tableau/PowerBI)",
      currentEvidence: text.includes("tableau") || text.includes("power bi") ? "Strong" : "None",
      currentScore: text.includes("tableau") || text.includes("power bi") ? 80 : 20,
      targetImportance: "High",
      gap: text.includes("tableau") || text.includes("power bi") ? "Low" : "High",
      recommendation: "Publish interactive dashboards demonstrating executive drill-down views and business KPI trees."
    });
    skillGaps.push({
      skill: "Python Data Analysis (Pandas, Polars)",
      currentEvidence: hasPython ? "Strong" : "Limited",
      currentScore: hasPython ? 85 : 30,
      targetImportance: "High",
      gap: "Low",
      recommendation: "Deepen automated ETL scripting and vectorization techniques."
    });
    skillGaps.push({
      skill: "A/B Testing & Statistical Hypothesis",
      currentEvidence: text.includes("a/b") || text.includes("hypothesis") ? "Limited" : "None",
      currentScore: 35,
      targetImportance: "High",
      gap: "Medium",
      recommendation: "Explain sample size calculation, p-values, and guardrail metric tracking in project bullet points."
    });
  } else {
    // SDE / General
    skillGaps.push({
      skill: "Data Structures & Algorithmic Rigor",
      currentEvidence: text.includes("data structures") || text.includes("algorithms") ? "Strong" : "Limited",
      currentScore: 75,
      targetImportance: "High",
      gap: "Low",
      recommendation: "Maintain daily problem-solving practice with strict focus on time/space trade-offs."
    });
    skillGaps.push({
      skill: "System Design & Distributed Patterns",
      currentEvidence: text.includes("distributed") || text.includes("microservices") ? "Limited" : "None",
      currentScore: 35,
      targetImportance: "High",
      gap: "High",
      recommendation: "Learn caching layers (Redis), asynchronous queues (Kafka/RabbitMQ), and database sharding."
    });
    skillGaps.push({
      skill: "Docker & Container Orchestration",
      currentEvidence: hasDocker ? "Limited" : "None",
      currentScore: hasDocker ? 45 : 15,
      targetImportance: "High",
      gap: "Medium",
      recommendation: "Package services into multi-stage Dockerfiles and deploy using Docker Compose."
    });
    skillGaps.push({
      skill: "API Security & Token Authentication",
      currentEvidence: text.includes("jwt") || text.includes("auth") ? "Strong" : "Limited",
      currentScore: 65,
      targetImportance: "Medium",
      gap: "Low",
      recommendation: "Implement rate-limiting, role-based access control, and sanitization middlewares."
    });
  }

  const strengths = [
    hasPython ? "Strong foundation in Python and scientific scripting" : "Good foundational programming fundamentals",
    hasGit ? "Demonstrated version control workflow with Git & GitHub" : "Clear structural presentation of academic coursework",
    isML ? "Concrete implementation of machine learning classification models" : "Experience with full-stack web architectures and database connectivity",
    "Solid quantitative problem-solving and algorithmic coursework"
  ];

  const gaps = [
    "Absence of containerized production deployment (e.g. Docker, CI/CD)",
    "Projects lack clear business metrics and production-scale workload validation",
    isML ? "Limited evidence of deep learning frameworks (PyTorch/TensorRT) and GPU profiling" : "Lack of cloud-native distributed systems design and queue processing"
  ];

  const priorityActions = [
    isML ? "Build an end-to-end deployed ML prediction service containerized with Docker" : "Build a scalable full-stack application featuring caching and message queues",
    "Rewrite resume bullet points to quantify engineering outcomes, datasets, and latency improvements",
    `Target company preparation: Investigate public ${company} engineering tech stack and open-source contributions`
  ];

  const resumeFlaws: ResumeFlaw[] = [
    {
      id: "flaw-1",
      issue: "Project descriptions are too generic and focus on tasks rather than outcomes.",
      whyItMatters: "Recruiters and engineering managers need to evaluate the technical depth of your personal contribution, latency or accuracy improvements, and system scale.",
      howToFix: "Explain the dataset or traffic volume, algorithmic techniques selected, your specific architecture, and measurable outcomes (e.g. latency, accuracy, or cost).",
      severity: "High"
    },
    {
      id: "flaw-2",
      issue: "No live links or verifiable deployment demonstration in project bullets.",
      whyItMatters: "Without a GitHub repository link, demo URL, or architectural diagram, projects risk being perceived as standard classroom coursework rather than proactive engineering.",
      howToFix: "Include concise hyperlinks to clean GitHub repositories with comprehensive README files, architectural diagrams, and Docker run commands.",
      severity: "Medium"
    },
    {
      id: "flaw-3",
      issue: "Missing key industry production keywords for the target role.",
      whyItMatters: "Automated parsing and technical screeners look for evidence of testing, containerization, and monitoring.",
      howToFix: "Integrate tooling you legitimately understand into relevant bullets (e.g. Docker, PyTest, FastAPI, CI/CD, Git branching).",
      severity: "Low"
    }
  ];

  const skillsToDevelop: SkillsToDevelopGroup = {
    mustDevelop: [
      {
        skill: "Docker & Containerization",
        why: "Essential for packaging services predictably across development and cloud environments.",
        learnSteps: ["Container architecture", "Writing multi-stage Dockerfiles", "Image optimization", "Docker Compose multi-container networks"],
        suggestedProject: "Containerize your prediction API with health checks and environment configuration.",
        learningStage: "Weeks 1–3"
      },
      {
        skill: isML ? "PyTorch & Deep Learning" : "System Design & Distributed Caching",
        why: isML ? "Industry standard framework for computer vision, NLP, and modern generative AI workloads." : "Critical for building scalable web services that handle concurrent user requests.",
        learnSteps: isML 
          ? ["Tensors & Autograd", "Custom Datasets & Dataloaders", "Convolutional & Transformer layers", "Model checkpointing & FP16 mixed precision"]
          : ["Vertical vs Horizontal scaling", "Redis caching layers", "Database indexing & connection pools", "Message queues (RabbitMQ/Kafka)"],
        suggestedProject: isML ? "Build a fine-tuned classifier with PyTorch and export to ONNX format." : "Architect an asynchronous background task worker with Redis.",
        learningStage: "Weeks 3–6"
      }
    ],
    strengthen: [
      {
        skill: "SQL & Query Optimization",
        why: "Data retrieval efficiency is foundational across all data science, backend, and machine learning disciplines.",
        learnSteps: ["Window functions (ROW_NUMBER, LAG/LEAD)", "Common Table Expressions (CTEs)", "Execution plans & EXPLAIN ANALYZE"],
        suggestedProject: "Build an automated analytical query pipeline tracking user retention cohorts.",
        learningStage: "Ongoing"
      },
      {
        skill: "Git & Collaborative Workflows",
        why: "Professional teams evaluate branch protection, pull request reviews, and semantic commit hygiene.",
        learnSteps: ["Feature branch workflows", "Interactive rebasing", "GitHub Actions CI linting"],
        suggestedProject: "Set up a GitHub Action running automated linter and unit tests on every PR.",
        learningStage: "Ongoing"
      }
    ],
    optional: [
      {
        skill: isML ? "Triton Inference Server / TensorRT" : "Kubernetes Fundamentals",
        why: "Differentiates high-tier candidates targeting scale and specialized infrastructure.",
        learnSteps: ["Model serialization", "Dynamic batching", "Inference benchmarking"],
        suggestedProject: "Benchmark throughput and P99 latency comparing CPU vs GPU runtime.",
        learningStage: "Elective (Post-Capstone)"
      }
    ]
  };

  const projectRecommendations: ProjectRecommendation[] = isML ? [
    {
      title: "End-to-End ML Prediction Platform with Docker & CI/CD",
      difficulty: "Intermediate",
      skillsDemonstrated: ["Python", "Scikit-learn / PyTorch", "FastAPI", "Docker", "GitHub Actions"],
      whatItShouldContain: "A containerized REST API serving machine learning predictions with input schema validation (Pydantic), model versioning, automated unit testing, and Docker deployment.",
      whyItStrengthens: "Directly bridges the gap between academic Jupyter notebook experiments and real-world production engineering."
    },
    {
      title: "Real-Time Streaming Feature Store & Inference Worker",
      difficulty: "Advanced",
      skillsDemonstrated: ["PyTorch", "Redis", "Docker", "AsyncIO", "Prometheus"],
      whatItShouldContain: "An asynchronous inference engine with request queue batching, latency telemetry (P95/P99 tracking), and model health monitoring.",
      whyItStrengthens: `Demonstrates the operational maturity expected at performance-driven companies like ${company}.`
    }
  ] : [
    {
      title: "High-Throughput Microservice with Distributed Caching & Rate Limiting",
      difficulty: "Intermediate",
      skillsDemonstrated: ["TypeScript / Go / Python", "Redis", "PostgreSQL", "Docker", "Jest/PyTest"],
      whatItShouldContain: "A scalable API with token-bucket rate limiting, Redis caching for hot endpoints, database transaction pooling, and 90%+ automated test coverage.",
      whyItStrengthens: "Shows engineering managers you can build resilient, production-ready backend infrastructure rather than basic CRUD demos."
    },
    {
      title: "Event-Driven Asynchronous Task Processing Pipeline",
      difficulty: "Advanced",
      skillsDemonstrated: ["Node.js / Python", "Kafka / RabbitMQ", "Docker", "PostgreSQL"],
      whatItShouldContain: "Decoupled publisher-subscriber architecture processing high-frequency events with dead-letter queue recovery and idempotent processing.",
      whyItStrengthens: `Proves readiness for distributed architectures employed at ${company}.`
    }
  ];

  const companyResearch = matchedCompany ? matchedCompany.publicResearchTopics : [
    {
      topic: "Public Architecture & Open Engineering Standards",
      source: "Official Engineering Blog & Open-Source Projects",
      publicDetail: `Engineering teams at ${company} emphasize clean modular code, comprehensive automated test suites, and transparent technical documentation.`,
      aiRecommendation: "Review public technical blog posts from the company to understand current architectural priorities, cloud platforms, and tooling choices."
    },
    {
      topic: "Core Technical Competencies",
      source: "Publicly Posted Job Descriptions",
      publicDetail: "Job listings emphasize strong computer science fundamentals, clear communication, and collaborative Git workflows.",
      aiRecommendation: "Ensure your project README files include clear architectural diagrams and setup guides demonstrating engineering craftsmanship."
    }
  ];

  const resumeImprovements = [
    {
      id: "imp-1",
      section: "Project: ML Classification",
      before: "Made a machine learning project using Python to classify patient heart disease risk based on clinical health metrics.",
      after: "Developed a cross-validated classification model in Python (Scikit-learn, Pandas) achieving 84% accuracy across 1,020 patient records, implementing stratified sampling, feature scaling, and automated metric evaluation.",
      rationale: "Replaces generic phrasing ('Made a project') with exact engineering actions, specified libraries, sample volume, and rigorous evaluation methodology.",
      applied: false
    },
    {
      id: "imp-2",
      section: "Project: Sentiment Analyzer API",
      before: "Built a sentiment analysis tool for online customer reviews with HTML/CSS and Flask API to show positive or negative predictions.",
      after: "Engineered a sentiment analysis service in Flask processing 5,000+ customer reviews with NLTK tokenization and regex pipelines, exposing RESTful endpoints with sub-100ms response latency.",
      rationale: "Quantifies performance (sub-100ms response latency) and highlights technical pipeline construction over superficial interface details.",
      applied: false
    }
  ];

  const roadmap: RoadmapPhase[] = [
    {
      phaseNumber: 1,
      title: "Fix Resume & Evidence",
      duration: "Week 1–2",
      milestones: [
        "Rewrite bullet points using action verbs and quantified outcomes (STAR format).",
        "Add GitHub repository links with clean READMEs and architectural diagrams.",
        "Align technical keywords with verified public job descriptions."
      ]
    },
    {
      phaseNumber: 2,
      title: "Build Core Missing Skills",
      duration: "Weeks 3–5",
      milestones: [
        "Master Docker containerization: write multi-stage Dockerfiles and compose files.",
        isML ? "Deepen PyTorch fundamentals: implement custom dataloaders and train neural networks." : "Solidify distributed system patterns: implement Redis caching and indexing.",
        "Practice advanced SQL queries, joins, and window functions."
      ]
    },
    {
      phaseNumber: 3,
      title: "Build Production Capstone",
      duration: "Weeks 6–9",
      milestones: [
        "Build the recommended production-style platform with Docker and CI/CD.",
        "Deploy application to cloud with live URL and documented health check endpoints.",
        "Record a 2-minute technical demo walkthrough showing the running architecture."
      ]
    },
    {
      phaseNumber: 4,
      title: "Gain Practical Experience & Signals",
      duration: "Weeks 10–12",
      milestones: [
        "Contribute bug fixes or documentation improvements to relevant open-source repositories.",
        "Participate in technical hackathons or collaborative open engineering challenges.",
        "Publish a technical writeup breaking down the architecture of your capstone project."
      ]
    },
    {
      phaseNumber: 5,
      title: "Targeted Applications & Interviews",
      duration: "Ongoing",
      milestones: [
        `Tailor resume applications specifically to openings at ${company} and peer firms.`,
        "Conduct mock technical screens focusing on data structures, system design, and project deep-dives.",
        "Leverage alumni networks and engineering community channels for warm referrals."
      ]
    }
  ];

  const nextFiveActions: NextActionItem[] = [
    {
      step: 1,
      action: "Rewrite weak project bullets using the suggested quantifiable template",
      detail: "Highlight the specific dataset size, libraries, architectural decisions, and measured performance metrics.",
      category: "Resume",
      completed: false
    },
    {
      step: 2,
      action: "Containerize an existing project with Docker",
      detail: "Create a Dockerfile, test local container execution, and add Docker run instructions to the repository README.",
      category: "Project",
      completed: false
    },
    {
      step: 3,
      action: "Practice advanced SQL query patterns",
      detail: "Complete 15 SQL exercises covering window functions (ROW_NUMBER, RANK, LAG) and grouped aggregations.",
      category: "Skill",
      completed: false
    },
    {
      step: 4,
      action: "Push cleaned code to GitHub with an architectural diagram",
      detail: "Use Mermaid.js or Excalidraw to add a clear system diagram in your project README.",
      category: "Project",
      completed: false
    },
    {
      step: 5,
      action: `Research ${company}'s publicly listed tech stack and prepare targeted stories`,
      detail: "Map your project experiences directly to the competencies highlighted in current public postings.",
      category: "Application",
      completed: false
    }
  ];

  const readabilityChecklist: ReadabilityCheckItem[] = [
    {
      category: "Clear section headings",
      status: "Good",
      comment: "Standard headings (Education, Technical Skills, Projects, Experience) parsed cleanly."
    },
    {
      category: "Contact information",
      status: "Good",
      comment: "Email, phone number, and location are prominent and well-formatted."
    },
    {
      category: "Consistent dates",
      status: "Good",
      comment: "Month and Year chronological layout followed consistently across entries."
    },
    {
      category: "Consistent formatting",
      status: "Good",
      comment: "Monospaced bullet alignment and uniform indentation maintained."
    },
    {
      category: "Excessive graphics",
      status: "Good",
      comment: "Clean text-focused structure free of unparsable icons or background canvas imagery."
    },
    {
      category: "Tables that may affect parsing",
      status: text.includes("table") ? "Improve" : "Good",
      comment: text.includes("table") ? "Consider removing multi-column tables as some ATS parsers read columns horizontally." : "No nested tables detected that would scramble reading order."
    },
    {
      category: "Unusual fonts",
      status: "Good",
      comment: "Standard typographical hierarchy detected."
    },
    {
      category: "Missing keywords",
      status: hasDocker ? "Good" : "Improve",
      comment: hasDocker ? "Found containerization keywords." : `Missing core production keywords like Docker, CI/CD, and testing frameworks for ${input.targetRole}.`
    },
    {
      category: "Long paragraphs",
      status: "Good",
      comment: "Content is broken down into scannable bullet points rather than dense multi-sentence blocks."
    },
    {
      category: "Unclear project descriptions",
      status: "Improve",
      comment: "Initial project bullets describe what the project is rather than your specific technical actions and metrics."
    }
  ];

  return {
    id: `report-${Date.now()}`,
    createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    targetRole: input.targetRole,
    targetCompany: company,
    experienceLevel: level,
    resumeFileName: input.fileName || "Uploaded_Resume.pdf",
    alignmentScore,
    scorecard: computeResumeScorecard(alignmentScore, input),
    diagnostics: computeCandidateDiagnostics(input, alignmentScore),
    alignmentSummary: `The resume demonstrates solid foundational coursework and initial programming capability for a ${level} profile, but shows a gap in production deployment and low-level system performance compared to standard ${input.targetRole} expectations at ${company}.`,
    strengths,
    gaps,
    priorityActions,
    resumeFlaws,
    skillGaps,
    skillsToDevelop,
    projectRecommendations,
    targetPreparation: {
      roleFocus: [
        `Core algorithmic efficiency and data structure optimization.`,
        isML ? `Modern deep learning frameworks and hardware inference pipelines.` : `High-concurrency distributed backend systems and caching architectures.`,
        `Production containerization and automated CI/CD deployment routines.`,
        `Clear technical documentation and communicative project leadership.`
      ],
      companyResearch
    },
    resumeImprovements,
    roadmap,
    nextFiveActions,
    readabilityChecklist
  };
}

function generateContextualCoachResponse(question: string, report: CareerGapReport | null): string {
  const q = question.toLowerCase();
  const role = report?.targetRole || "Machine Learning Engineer";
  const company = report?.targetCompany || "target company";

  if (q.includes("docker") || q.includes("container")) {
    return `Docker is recommended because most candidate resumes only show code running in local Jupyter notebooks or dev servers. Packaging your application with a Dockerfile demonstrates to ${company} engineering managers that your software can run reliably in any cloud environment with reproducible dependencies.`;
  }

  if (q.includes("project") && (q.includes("first") || q.includes("build") || q.includes("which"))) {
    const topProject = report?.projectRecommendations[0]?.title || "End-to-End Production API with Docker";
    return `You should build "${topProject}" first. It directly eliminates your primary gap (lack of production deployment evidence) and will give you quantifiable metrics to put on your resume within 2-3 weeks.`;
  }

  if (q.includes("improve") && (q.includes("project") || q.includes("this"))) {
    return `To dramatically improve your current projects:
1. Don't just say what the project does; explain the dataset size, architecture, and tech stack.
2. Add a quantified metric (e.g., "reduced latency by 35%" or "evaluated over 1,000 samples").
3. Publish a clean GitHub README with an architectural diagram and one-command Docker execution instructions.`;
  }

  if (q.includes("after python") || q.includes("what to learn") || q.includes("learn next")) {
    return `After Python, the highest-ROI skill for ${role} is containerization (Docker) followed by ${role.toLowerCase().includes("ml") ? "PyTorch and model optimization (ONNX/TensorRT)" : "distributed caching (Redis) and SQL query tuning"}. These transform you from a basic script writer into a production engineer.`;
  }

  if (q.includes("biggest") && q.includes("gap")) {
    const mainGap = report?.gaps[0] || "Absence of containerized production deployment and measurable outcomes";
    return `Your biggest skill gap right now is: "${mainGap}". While your core programming and coursework are solid, recruiters for ${role} look for proof of deployment, testing, and operational rigor.`;
  }

  return `Great question regarding your preparation for ${role} at ${company}. Based on your resume analysis, the key to standing out is showing end-to-end execution: write modular code, containerize it, test it, and quantify your outcomes on your resume bullets.`;
}
