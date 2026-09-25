export type ExperienceLevel = 'Student' | 'Fresher' | '0–2 years' | '2–5 years' | '5+ years';

export interface AnalysisInput {
  resumeText: string;
  fileName: string;
  fileSize?: string;
  targetRole: string;
  targetCompany: string;
  experienceLevel: ExperienceLevel;
  userGoals: string;
}

export interface ResumeFlaw {
  id: string;
  issue: string;
  whyItMatters: string;
  howToFix: string;
  severity: 'High' | 'Medium' | 'Low';
}

export type ResourceType = 'youtube' | 'article' | 'documentation';

export interface LearningResource {
  id: string;
  topic: string; // The topic or skill where the candidate lacks
  title: string;
  creatorOrPublisher: string; // e.g. "freeCodeCamp.org", "TechWorld with Nana", "ByteByteGo", "Martin Fowler", "Fireship"
  type: ResourceType;
  url: string; // Genuine, popular, verified link
  durationOrReadTime: string; // e.g. "2h 45m video", "15 min read", "Official Docs"
  description: string;
  popularMetric?: string; // e.g. "5.2M+ views", "Top Industry Guide", "1.8M+ views"
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  whyRecommended?: string; // Explains specifically how this bridges the candidate's gap
}

export interface SkillGapItem {
  skill: string;
  currentEvidence: 'Strong' | 'Limited' | 'None';
  currentScore: number; // 0 - 100%
  targetImportance: 'High' | 'Medium' | 'Low';
  gap: 'High' | 'Medium' | 'Low';
  recommendation: string;
  resources?: LearningResource[];
}

export interface SkillToDevelop {
  skill: string;
  why: string;
  learnSteps: string[];
  suggestedProject: string;
  learningStage: string;
  resources?: LearningResource[];
}

export interface SkillsToDevelopGroup {
  mustDevelop: SkillToDevelop[];
  strengthen: SkillToDevelop[];
  optional: SkillToDevelop[];
}

export interface ProjectRecommendation {
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skillsDemonstrated: string[];
  whatItShouldContain: string;
  whyItStrengthens: string;
}

export interface CompanyResearchItem {
  topic: string;
  source: string;
  publicDetail: string;
  aiRecommendation: string;
}

export interface TargetPreparation {
  roleFocus: string[];
  companyResearch: CompanyResearchItem[];
}

export interface ResumeImprovement {
  id: string;
  section: string;
  before: string;
  after: string;
  rationale: string;
  applied?: boolean;
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  milestones: string[];
}

export interface NextActionItem {
  step: number;
  action: string;
  detail: string;
  category: 'Resume' | 'Skill' | 'Project' | 'Application';
  completed?: boolean;
}

export interface ReadabilityCheckItem {
  category: string;
  status: 'Good' | 'Improve' | 'Problem';
  comment: string;
}

export interface ScoreCategoryComparison {
  category: string;
  clientScore: number; // Client's resume score out of 100
  targetBenchmark: number; // Target benchmark score out of 100
  status: 'Exceeds' | 'Meets' | 'Below' | 'Critical Gap';
  detail: string;
  pointsDelta: number; // e.g. -12 or +4
  potentialGain: number; // Points candidate can gain
}

export interface ResumeScorecard {
  overallScore: number; // Overall client resume score out of 100
  targetBenchmark: number; // Target role expectation out of 100 (e.g. 85)
  applicantPoolAverage: number; // Average applicant pool score out of 100 (e.g. 66)
  topTierThreshold: number; // Top 10% candidate score out of 100 (e.g. 92)
  pointsToTarget: number; // Difference from target (e.g. -13)
  tier: string; // e.g. "Competitive with Focus Areas"
  verdict: string; // Summary of comparison
  categories: ScoreCategoryComparison[];
}

export interface GoodSignal {
  id: string;
  title: string;
  tag: string;
  evidence: string;
  recruiterTakeaway: string;
  scoreImpact: string; // e.g. "+14 pts"
}

export interface BadPattern {
  id: string;
  title: string;
  tag: string;
  flaw: string;
  whyItHurts: string;
  severity: 'Fatal Flaw' | 'High Friction' | 'Moderate Drag';
  scoreDrag: string; // e.g. "-12 pts"
}

export interface WorkOnItem {
  id: string;
  area: string;
  category: 'Core Skill' | 'Deployed Project' | 'Metric Quantification' | 'Architecture Depth';
  specificAction: string;
  timeframe: string;
  targetGain: string; // e.g. "+8 pts"
  priority: 'High Priority' | 'Medium Priority';
}

export interface WhatMakesItGoodPrinciple {
  id: string;
  ruleName: string;
  principleDescription: string;
  badSnippet: string;
  goodSnippet: string;
  whyThisWorks: string;
  recruiterMentalModel: string;
  pointUplift: string; // e.g. "+15 pts"
}

export interface CandidateDiagnostics {
  goodSignals: GoodSignal[];
  badPatterns: BadPattern[];
  workOnItems: WorkOnItem[];
  whatMakesItGood: WhatMakesItGoodPrinciple[];
}

export interface CareerGapReport {
  id: string;
  createdAt: string;
  targetRole: string;
  targetCompany: string;
  experienceLevel: ExperienceLevel;
  resumeFileName: string;
  alignmentScore: number; // 0 - 100
  scorecard?: ResumeScorecard;
  diagnostics?: CandidateDiagnostics;
  alignmentSummary: string;
  strengths: string[];
  gaps: string[];
  priorityActions: string[];
  resumeFlaws: ResumeFlaw[];
  skillGaps: SkillGapItem[];
  skillsToDevelop: SkillsToDevelopGroup;
  projectRecommendations: ProjectRecommendation[];
  targetPreparation: TargetPreparation;
  resumeImprovements: ResumeImprovement[];
  roadmap: RoadmapPhase[];
  nextFiveActions: NextActionItem[];
  readabilityChecklist: ReadabilityCheckItem[];
  curatedResources?: LearningResource[];
}

export interface SampleResume {
  id: string;
  label: string;
  roleHint: string;
  companyHint: string;
  level: ExperienceLevel;
  fileName: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
