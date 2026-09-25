import React, { useState } from "react";
import { 
  CareerGapReport, 
  ResumeImprovement, 
  NextActionItem,
  LearningResource 
} from "../types";
import { computeResumeScorecard, computeCandidateDiagnostics } from "../services/analysisEngine";
import { generateCareerGapPdf } from "../services/pdfReportGenerator";
import { findResourcesForSkill, getCuratedResourcesForGaps } from "../services/learningResources";
import { ResumeScorecardSection } from "./ResumeScorecardSection";
import { CandidateDiagnosticSection } from "./CandidateDiagnosticSection";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowUpRight, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw,
  Building2,
  Briefcase,
  ChevronRight,
  HelpCircle,
  FileCheck,
  ShieldCheck,
  Target,
  Award,
  FileDown,
  Loader2,
  Printer,
  Youtube,
  BookOpen,
  ExternalLink,
  Play,
  Search,
  Filter,
  GraduationCap,
  Video,
  FileText
} from "lucide-react";

interface ReportDashboardProps {
  report: CareerGapReport;
  onReanalyze: () => void;
  onOpenCoach: (initialQuestion?: string) => void;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({
  report,
  onReanalyze,
  onOpenCoach,
}) => {
  // Ensure rich scorecard is available
  const scorecard = report.scorecard || computeResumeScorecard(report.alignmentScore, {
    targetRole: report.targetRole,
    targetCompany: report.targetCompany,
    experienceLevel: report.experienceLevel,
    resumeText: "",
    fileName: report.resumeFileName || "resume.pdf",
    userGoals: ""
  });

  // Ensure rich diagnostics are available (Good, Bad, Work On, What Makes It Good)
  const diagnostics = report.diagnostics || computeCandidateDiagnostics({
    targetRole: report.targetRole,
    targetCompany: report.targetCompany,
    experienceLevel: report.experienceLevel,
    resumeText: "",
    fileName: report.resumeFileName || "resume.pdf",
    userGoals: ""
  }, report.alignmentScore);

  // Local interactive state for rewrites and action items
  const [rewrites, setRewrites] = useState<ResumeImprovement[]>(report.resumeImprovements);
  const [actions, setActions] = useState<NextActionItem[]>(report.nextFiveActions);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [skillFilter, setSkillFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [resourceTypeFilter, setResourceTypeFilter] = useState<"all" | "youtube" | "article" | "documentation">("all");
  const [resourceSearch, setResourceSearch] = useState<string>("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);

  // Compute all curated resources addressing candidate gaps
  const allCuratedResources: LearningResource[] = (report.curatedResources && report.curatedResources.length > 0)
    ? report.curatedResources
    : getCuratedResourcesForGaps(report.skillGaps, report.skillsToDevelop, report.targetRole);

  const filteredResources = allCuratedResources.filter((res) => {
    if (resourceTypeFilter !== "all" && res.type !== resourceTypeFilter) {
      return false;
    }
    if (resourceSearch.trim()) {
      const q = resourceSearch.toLowerCase().trim();
      return (
        res.title.toLowerCase().includes(q) ||
        res.topic.toLowerCase().includes(q) ||
        res.creatorOrPublisher.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        (res.whyRecommended && res.whyRecommended.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const toggleAction = (stepNumber: number) => {
    setActions((prev) =>
      prev.map((item) =>
        item.step === stepNumber ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const applyRewrite = (id: string, textToCopy: string) => {
    setRewrites((prev) =>
      prev.map((item) => (item.id === id ? { ...item, applied: true } : item))
    );
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    try {
      setIsGeneratingPdf(true);
      // Brief async tick for smooth UI spinner rendering
      await new Promise((resolve) => setTimeout(resolve, 300));
      const savedFileName = generateCareerGapPdf(report);
      setPdfSuccessMessage(`Career gap report downloaded as ${savedFileName}`);
      setTimeout(() => setPdfSuccessMessage(null), 5000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      // Graceful fallback to browser print if needed
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const filteredSkills = report.skillGaps.filter((item) => {
    if (skillFilter === "All") return true;
    return item.gap === skillFilter;
  });

  return (
    <div id="career-gap-report-dashboard" className="py-12 md:py-20 bg-[#FAFAFA] text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ============================================================ */}
        {/* HEADER & PROFILE ALIGNMENT HERO */}
        {/* ============================================================ */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-neutral-200 shadow-sm relative overflow-hidden">
          {/* Top Bar: Action Buttons & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-neutral-200 relative z-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-900 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-300 font-semibold">
                Official Analysis Report
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight mt-2 font-heading">
                Your Career Gap Report
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                id="reanalyze-btn"
                onClick={onReanalyze}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-100 text-neutral-800 hover:text-black hover:bg-neutral-200 border border-neutral-300 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Analyze</span>
              </button>

              <button
                type="button"
                id="print-report-btn"
                onClick={handlePrint}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-100 text-neutral-800 hover:text-black border border-neutral-300 transition-all cursor-pointer"
                title="Print report via browser"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                type="button"
                id="download-pdf-btn"
                data-testid="download-pdf-btn"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-black text-white hover:bg-neutral-800 shadow-sm active:scale-95 disabled:opacity-75 disabled:cursor-wait transition-all cursor-pointer"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-3.5 h-3.5 text-white" />
                    <span>Download Report as PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Download Notification Toast / Banner */}
          {pdfSuccessMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-neutral-100 border border-neutral-300 text-neutral-900 text-xs flex items-center justify-between shadow-xs relative z-10 animate-fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Success:</strong> {pdfSuccessMessage}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPdfSuccessMessage(null)}
                className="text-neutral-600 hover:text-black ml-3 text-xs font-mono px-2 py-0.5 rounded bg-neutral-200 hover:bg-neutral-300 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Target Metadata Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 relative z-10">
            <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-neutral-200 text-black">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">Target Role</span>
                <span className="text-sm sm:text-base font-bold text-neutral-950">{report.targetRole}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-neutral-200 text-black">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">Target Company</span>
                <span className="text-sm sm:text-base font-bold text-neutral-950">{report.targetCompany}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-neutral-200 text-black">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">Experience Level</span>
                <span className="text-sm sm:text-base font-bold text-neutral-950">{report.experienceLevel}</span>
              </div>
            </div>
          </div>

          {/* LARGE PROFILE ALIGNMENT VISUALIZATION */}
          <div 
            id="profile-alignment-container"
            className="p-6 sm:p-8 rounded-2xl bg-neutral-50/80 border border-neutral-200 relative z-10 flex flex-col md:flex-row items-center gap-8"
          >
            {/* Circular score dial visual with subtle dynamic accent color */}
            <div className="relative flex-shrink-0 flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  className="text-neutral-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  stroke={scorecard.overallScore >= 80 ? "#059669" : scorecard.overallScore >= 65 ? "#2563EB" : "#D97706"}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - report.alignmentScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-mono tracking-tight leading-none">
                  {scorecard.overallScore}
                  <span className="text-base sm:text-lg font-bold text-neutral-400">/100</span>
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider mt-1 ${
                  scorecard.overallScore >= 80 ? 'text-emerald-700' : scorecard.overallScore >= 65 ? 'text-blue-700' : 'text-amber-700'
                }`}>
                  Resume Score
                </span>
              </div>
            </div>

            {/* Description & Transparency Note */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 font-heading">
                  Resume Score & Benchmark Alignment
                </h2>
                <span className="text-xs font-mono text-neutral-700 bg-neutral-200 px-2 py-0.5 rounded border border-neutral-300">
                  Compared out of 100
                </span>
              </div>

              <p className="text-sm text-neutral-900 font-semibold mb-3">
                {scorecard.verdict}
              </p>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                {report.alignmentSummary}
              </p>

              {/* Quick Hero Benchmark Comparison Bar */}
              <div className="grid grid-cols-3 gap-2 mb-4 p-2 rounded-xl bg-white border border-neutral-200 text-center shadow-2xs">
                <div className="p-1.5">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">Client Score</span>
                  <span className="text-sm sm:text-base font-bold text-neutral-950 font-mono">{scorecard.overallScore} / 100</span>
                </div>
                <div className="p-1.5 border-x border-neutral-200">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">Target Bar</span>
                  <span className="text-sm sm:text-base font-bold text-neutral-950 font-mono">{scorecard.targetBenchmark} / 100</span>
                </div>
                <div className="p-1.5">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">Points Gap</span>
                  <span className={`text-sm sm:text-base font-bold font-mono ${scorecard.pointsToTarget >= 0 ? 'text-emerald-600' : 'text-neutral-900'}`}>
                    {scorecard.pointsToTarget >= 0 ? `+${scorecard.pointsToTarget}` : scorecard.pointsToTarget} pts
                  </span>
                </div>
              </div>

              {/* Explicit Transparency Disclaimer */}
              <div className="p-3 rounded-xl bg-white border border-neutral-200 text-[11px] text-neutral-600 flex items-start gap-2 shadow-2xs">
                <HelpCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Assessment Note:</strong> This score is an objective AI-grounded structural evaluation comparing technical stack coverage, project deployment depth, and quantifiable metrics against public engineering benchmarks.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* DEDICATED RESUME SCORECARD & BENCHMARK COMPARISON (OUT OF 100) */}
        {/* ============================================================ */}
        <ResumeScorecardSection
          scorecard={scorecard}
          targetRole={report.targetRole}
          targetCompany={report.targetCompany}
          experienceLevel={report.experienceLevel}
          onOpenCoach={onOpenCoach}
        />

        {/* ============================================================ */}
        {/* CANDIDATE DIAGNOSTIC: WHAT HE IS GOOD IN, BAD IN, WORK ON, WHAT MAKES IT GOOD */}
        {/* ============================================================ */}
        <CandidateDiagnosticSection
          diagnostics={diagnostics}
          targetRole={report.targetRole}
          targetCompany={report.targetCompany}
          experienceLevel={report.experienceLevel}
          onOpenCoach={onOpenCoach}
        />

        {/* ============================================================ */}
        {/* SECTION 1 — QUICK SUMMARY (Strengths, Gaps, Priority) */}
        {/* ============================================================ */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-900 font-semibold">Section 01</span>
              <h3 className="text-2xl font-bold text-neutral-950 font-heading">Quick Summary</h3>
            </div>
            <span className="text-xs text-neutral-500 font-mono">Executive Snapshot</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Strengths Card */}
            <div 
              id="summary-strengths-card"
              className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Strengths
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    Proven Assets
                  </span>
                </div>
                <ul className="space-y-2.5 text-sm text-neutral-800">
                  {report.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-200 text-[11px] text-neutral-500">
                Reinforce these in technical interviews.
              </div>
            </div>

            {/* Gaps Card with Warm Amber Accents */}
            <div 
              id="summary-gaps-card"
              className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-amber-300 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-900 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Gaps
                  </span>
                  <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                    Areas to Bridge
                  </span>
                </div>
                <ul className="space-y-2.5 text-sm text-neutral-800">
                  {report.gaps.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-amber-600 font-bold mt-0.5">⚠</span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-200 text-[11px] text-neutral-500">
                Focus projects here to remove screen friction.
              </div>
            </div>

            {/* Priority Card (Standout Obsidian Card with Electric Indigo Spark) */}
            <div 
              id="summary-priority-card"
              className="p-6 rounded-2xl bg-neutral-950 text-white border border-neutral-800 hover:border-indigo-500/50 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Priority Focus
                  </span>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-700 font-bold">
                    Immediate ROI
                  </span>
                </div>
                <ol className="space-y-3 text-sm text-neutral-200">
                  {report.priorityActions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-white text-black text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => onOpenCoach("Which project should I build first?")}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Ask Career Coach About Priorities</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 2 — RESUME FLAWS ("What Could Be Improved") */}
        {/* ============================================================ */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-900 font-semibold">Section 02</span>
            <h3 className="text-2xl font-bold text-neutral-950 font-heading">What Could Be Improved</h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Objective, actionable critique of existing presentation flaws. Designed to help you convey true engineering depth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {report.resumeFlaws.map((flaw) => {
              const severityColor = 
                flaw.severity === "High" ? "text-rose-800 bg-rose-50 border-rose-300" :
                flaw.severity === "Medium" ? "text-amber-800 bg-amber-50 border-amber-300" :
                "text-blue-800 bg-blue-50 border-blue-300";

              const hoverBorder =
                flaw.severity === "High" ? "hover:border-rose-400" :
                flaw.severity === "Medium" ? "hover:border-amber-400" :
                "hover:border-blue-400";

              return (
                <div
                  key={flaw.id}
                  id={`flaw-card-${flaw.id}`}
                  className={`p-6 rounded-2xl bg-white border border-neutral-200 ${hoverBorder} transition-all flex flex-col justify-between relative overflow-hidden shadow-xs`}
                >
                  <div>
                    {/* Severity Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${severityColor}`}>
                        {flaw.severity} Severity
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-neutral-950 mb-3 font-heading leading-snug">
                      "{flaw.issue}"
                    </h4>

                    {/* Why It Matters */}
                    <div className="mb-3.5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                        Why it matters:
                      </span>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {flaw.whyItMatters}
                      </p>
                    </div>

                    {/* How To Fix */}
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-900 font-semibold block mb-1">
                        How to fix:
                      </span>
                      <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                        {flaw.howToFix}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 3 — SKILL GAP ANALYSIS TABLE */}
        {/* ============================================================ */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-900 font-semibold">Section 03</span>
              <h3 className="text-2xl font-bold text-neutral-950 font-heading">Skill Gap Analysis</h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                Evaluation of current evidence found in your resume compared with standard role requirements.
              </p>
            </div>

            {/* Gap filter buttons */}
            <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl border border-neutral-200 self-start sm:self-auto">
              {(["All", "High", "Medium", "Low"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSkillFilter(filter)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    skillFilter === filter
                      ? "bg-black text-white font-bold shadow-xs"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl bg-white border border-neutral-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-mono uppercase tracking-wider text-neutral-600">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Skill</th>
                    <th className="py-3.5 px-4 sm:px-6">Current Evidence</th>
                    <th className="py-3.5 px-4 sm:px-6">Target Importance</th>
                    <th className="py-3.5 px-4 sm:px-6">Gap</th>
                    <th className="py-3.5 px-4 sm:px-6">Recommendation</th>
                    <th className="py-3.5 px-4 sm:px-6">Curated Resources</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-neutral-800">
                  {filteredSkills.map((item, idx) => {
                    const evidenceBadge =
                      item.currentEvidence === "Strong"
                        ? "text-emerald-800 bg-emerald-50 border-emerald-300"
                        : item.currentEvidence === "Limited"
                        ? "text-amber-800 bg-amber-50 border-amber-300"
                        : "text-neutral-700 bg-neutral-100 border-neutral-300";

                    const gapBadge =
                      item.gap === "High"
                        ? "text-rose-800 bg-rose-50 border-rose-300 font-bold"
                        : item.gap === "Medium"
                        ? "text-amber-800 bg-amber-50 border-amber-300 font-semibold"
                        : "text-emerald-800 bg-emerald-50 border-emerald-300 font-semibold";

                    const barColor =
                      item.currentScore >= 70
                        ? "bg-emerald-600"
                        : item.currentScore >= 40
                        ? "bg-amber-500"
                        : "bg-rose-500";

                    return (
                      <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                        {/* Skill Name */}
                        <td className="py-4 px-4 sm:px-6 font-bold text-neutral-950 font-mono whitespace-nowrap">
                          {item.skill}
                        </td>

                        {/* Current Evidence with Progress Bar */}
                        <td className="py-4 px-4 sm:px-6 min-w-[160px]">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full border ${evidenceBadge}`}>
                              {item.currentEvidence}
                            </span>
                            <span className="text-[11px] font-mono text-neutral-500">
                              {item.currentScore}%
                            </span>
                          </div>
                          <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${barColor}`}
                              style={{ width: `${item.currentScore}%` }}
                            />
                          </div>
                        </td>

                        {/* Target Importance */}
                        <td className="py-4 px-4 sm:px-6 font-medium whitespace-nowrap">
                          <span className={`text-xs ${item.targetImportance === "High" ? "text-neutral-950 font-semibold" : "text-neutral-600"}`}>
                            {item.targetImportance}
                          </span>
                        </td>

                        {/* Gap */}
                        <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                          <span className={`text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${gapBadge}`}>
                            {item.gap} Gap
                          </span>
                        </td>

                        {/* Recommendation */}
                        <td className="py-4 px-4 sm:px-6 text-xs text-neutral-600 leading-relaxed max-w-xs">
                          {item.recommendation}
                        </td>

                        {/* Curated Resources to Bridge this Skill */}
                        <td className="py-4 px-4 sm:px-6">
                          {(() => {
                            const resList = item.resources && item.resources.length > 0
                              ? item.resources
                              : findResourcesForSkill(item.skill);
                            if (!resList || resList.length === 0) {
                              return <span className="text-neutral-400 text-xs">—</span>;
                            }
                            return (
                              <div className="flex flex-col gap-1.5 min-w-[210px]">
                                {resList.slice(0, 2).map((res) => (
                                  <a
                                    key={res.id}
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-900 border border-neutral-200 text-xs transition-colors group"
                                    title={`${res.title} • ${res.creatorOrPublisher} (${res.popularMetric || ''})`}
                                  >
                                    {res.type === "youtube" ? (
                                      <Youtube className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                                    ) : (
                                      <BookOpen className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                                    )}
                                    <span className="truncate max-w-[140px] font-medium">{res.title}</span>
                                    <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-black ml-auto flex-shrink-0" />
                                  </a>
                                ))}
                              </div>
                            );
                          })()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-neutral-50 border-t border-neutral-200 text-[11px] text-neutral-500 flex items-center justify-between">
              <span>Skill importance reflects publicly verified technical standards for {report.targetRole}.</span>
              <button
                type="button"
                onClick={() => onOpenCoach("Explain my biggest skill gap.")}
                className="text-black font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Ask AI about your gaps →
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 4 — SKILLS TO DEVELOP */}
        {/* ============================================================ */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-900 font-semibold">Section 04</span>
            <h3 className="text-2xl font-bold text-neutral-950 font-heading">Skills to Develop</h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Curated roadmap categories showing what to learn, why it matters, and a concrete demonstration project.
            </p>
          </div>

          <div className="space-y-6">
            {/* Category: Must Develop */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-black" />
                <h4 className="text-sm font-bold uppercase font-mono tracking-wider text-neutral-950">
                  Must Develop (Central to {report.targetRole})
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.skillsToDevelop.mustDevelop.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-black transition-all flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-bold text-neutral-950 font-mono">{item.skill}</span>
                        <span className="text-[10px] font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300 font-semibold">
                          {item.learningStage}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mb-3">
                        <strong className="text-neutral-950">Why:</strong> {item.why}
                      </p>

                      <div className="mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                          Learning sequence:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.learnSteps.map((step, sIdx) => (
                            <span key={sIdx} className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-300">
                              {step}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Curated Popular Learning Resources for This Skill */}
                    {(() => {
                      const resList = item.resources && item.resources.length > 0
                        ? item.resources
                        : findResourcesForSkill(item.skill);
                      if (!resList || resList.length === 0) return null;
                      return (
                        <div className="mb-3 pt-2.5 border-t border-neutral-100">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1.5 font-semibold">
                            Curated Remediation Resources:
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {resList.slice(0, 2).map((res) => (
                              <a
                                key={res.id}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs transition-colors group"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {res.type === "youtube" ? (
                                    <div className="w-5 h-5 rounded bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                                      <Youtube className="w-3 h-3" />
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                                      <BookOpen className="w-3 h-3" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="font-semibold text-neutral-900 truncate group-hover:text-black">{res.title}</p>
                                    <p className="text-[10px] text-neutral-500 font-mono">
                                      {res.creatorOrPublisher} • {res.popularMetric || res.durationOrReadTime}
                                    </p>
                                  </div>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black flex-shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    <div className="pt-3 mt-2 border-t border-neutral-200 text-xs text-neutral-800">
                      <span className="font-semibold text-black">Suggested Project: </span>
                      {item.suggestedProject}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category: Strengthen */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-500" />
                <h4 className="text-sm font-bold uppercase font-mono tracking-wider text-neutral-800">
                  Strengthen (Existing Knowledge to Deepen)
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.skillsToDevelop.strengthen.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-black transition-all flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-bold text-neutral-950 font-mono">{item.skill}</span>
                        <span className="text-[10px] font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300 font-semibold">
                          {item.learningStage}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mb-3">
                        <strong className="text-neutral-950">Why:</strong> {item.why}
                      </p>
                      <div className="mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                          Learning sequence:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.learnSteps.map((step, sIdx) => (
                            <span key={sIdx} className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-300">
                              {step}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Curated Popular Learning Resources for This Skill */}
                      {(() => {
                        const resList = item.resources && item.resources.length > 0
                          ? item.resources
                          : findResourcesForSkill(item.skill);
                        if (!resList || resList.length === 0) return null;
                        return (
                          <div className="mb-3 pt-2.5 border-t border-neutral-100">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1.5 font-semibold">
                              Curated Remediation Resources:
                            </span>
                            <div className="flex flex-col gap-1.5">
                              {resList.slice(0, 2).map((res) => (
                                <a
                                  key={res.id}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs transition-colors group"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    {res.type === "youtube" ? (
                                      <div className="w-5 h-5 rounded bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                                        <Youtube className="w-3 h-3" />
                                      </div>
                                    ) : (
                                      <div className="w-5 h-5 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-3 h-3" />
                                      </div>
                                    )}
                                    <div className="min-w-0">
                                      <p className="font-semibold text-neutral-900 truncate group-hover:text-black">{res.title}</p>
                                      <p className="text-[10px] text-neutral-500 font-mono">
                                        {res.creatorOrPublisher} • {res.popularMetric || res.durationOrReadTime}
                                      </p>
                                    </div>
                                  </div>
                                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black flex-shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="pt-3 mt-2 border-t border-neutral-200 text-xs text-neutral-800">
                      <span className="font-semibold text-black">Project: </span>
                      {item.suggestedProject}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 5 — PROJECT GAP ANALYSIS */}
        {/* ============================================================ */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-900 font-semibold">Section 05</span>
            <h3 className="text-2xl font-bold text-neutral-950 font-heading">
              Projects That Would Strengthen Your Profile
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Production-style project architectures specifically tailored to bridge your missing tools and validate real-world readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.projectRecommendations.map((project, idx) => (
              <div 
                key={idx}
                id={`recommended-project-${idx}`}
                className="p-7 rounded-2xl bg-white border border-neutral-200 hover:border-black transition-all flex flex-col justify-between shadow-xs relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-900 border border-neutral-300 font-semibold">
                      {project.difficulty} Difficulty
                    </span>
                    <span className="text-xs font-mono text-neutral-500">Capstone Proposal #{idx + 1}</span>
                  </div>

                  <h4 className="text-lg font-bold text-neutral-950 mb-3 font-heading">
                    {project.title}
                  </h4>

                  {/* Skills Demonstrated */}
                  <div className="mb-4">
                    <span className="text-[11px] font-mono uppercase text-neutral-500 block mb-1.5">
                      Skills Demonstrated:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.skillsDemonstrated.map((s, sIdx) => (
                        <span key={sIdx} className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* What it should contain */}
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 mb-4">
                    <span className="text-[11px] font-mono uppercase text-neutral-900 font-bold block mb-1">
                      What the project should contain:
                    </span>
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      {project.whatItShouldContain}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-200">
                  <span className="text-[11px] font-mono uppercase text-black font-semibold block mb-1">
                    Why it strengthens your target profile:
                  </span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {project.whyItStrengthens}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 6 — COMPANY / ROLE PREPARATION */}
        {/* ============================================================ */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-900 font-semibold">Section 06</span>
            <h3 className="text-2xl font-bold text-neutral-950 font-heading">Target Preparation</h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Dual-perspective guidance comparing general role competencies against publicly documented company engineering practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Column 1: Role Focus */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-200">
                <Briefcase className="w-5 h-5 text-black" />
                <h4 className="text-base font-bold text-neutral-950 font-heading">
                  Role Focus: {report.targetRole}
                </h4>
              </div>
              <p className="text-xs text-neutral-600 mb-4">
                What skills and technical knowledge are universally expected across modern engineering teams hiring for this title:
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-neutral-800">
                {report.targetPreparation.roleFocus.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                    <span className="w-5 h-5 rounded-full bg-black text-white font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Company Research */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-200">
                <Building2 className="w-5 h-5 text-black" />
                <h4 className="text-base font-bold text-neutral-950 font-heading">
                  Company Research: {report.targetCompany}
                </h4>
              </div>
              <p className="text-xs text-neutral-600 mb-4">
                Publicly documented technology architectures and publicly listed job qualifications:
              </p>

              <div className="space-y-4">
                {report.targetPreparation.companyResearch.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-950">{item.topic}</span>
                      <span className="text-[10px] font-mono text-neutral-700 bg-neutral-200/80 px-2 py-0.5 rounded border border-neutral-300 font-semibold">
                        {item.source}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                        Publicly Documented Information:
                      </span>
                      <p className="text-xs text-neutral-700 mt-0.5 leading-relaxed">
                        {item.publicDetail}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-200">
                      <span className="text-[10px] font-mono uppercase text-black font-semibold block">
                        AI-Generated Recommendation:
                      </span>
                      <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium">
                        {item.aiRecommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 7 — RESUME IMPROVEMENT (Before vs After) */}
        {/* ============================================================ */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-900 font-semibold">Section 07</span>
            <h3 className="text-2xl font-bold text-neutral-950 font-heading">Resume Bullet Rewrites</h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Real-world demonstrations showing how to transform vague task descriptions into high-impact, quantified achievement statements without fabricating fake experiences.
            </p>
          </div>

          <div className="space-y-6">
            {rewrites.map((item) => (
              <div 
                key={item.id}
                id={`resume-rewrite-${item.id}`}
                className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded border border-neutral-300">
                    {item.section}
                  </span>
                  <button
                    type="button"
                    onClick={() => applyRewrite(item.id, item.after)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      item.applied
                        ? "bg-neutral-100 text-neutral-900 border border-neutral-300 font-bold"
                        : "bg-black text-white hover:bg-neutral-800 shadow-xs"
                    }`}
                  >
                    {item.applied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-black" />
                        <span>Applied & Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-white" />
                        <span>Apply Suggested Rewrite</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before (Weak with subtle rose tint) */}
                  <div className="p-4 rounded-xl bg-rose-50/25 border border-rose-200/70">
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-rose-800 mb-2">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Before (Weak / Task-Centric)</span>
                    </div>
                    <p className="text-xs text-neutral-800 italic leading-relaxed">
                      "{item.before}"
                    </p>
                  </div>

                  {/* After (Standout Obsidian Box with emerald accent) */}
                  <div className="p-4 rounded-xl bg-neutral-950 text-white border border-neutral-800 hover:border-emerald-500/50 transition-colors shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-emerald-400 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>After (Quantified / Action-Driven)</span>
                    </div>
                    <p className="text-xs text-white font-medium leading-relaxed font-mono">
                      "{item.after}"
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-200 flex items-center gap-1.5">
                  <span className="font-mono text-neutral-900 font-semibold">Rationale:</span>
                  <span>{item.rationale}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 8 — PERSONALIZED ROADMAP */}
        {/* ============================================================ */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-900 font-semibold">Section 08</span>
            <h3 className="text-2xl font-bold text-neutral-950 font-heading">Personalized Career Roadmap</h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Customized progression pipeline adapted to your current stage ({report.experienceLevel}) and target ({report.targetRole} @ {report.targetCompany}).
            </p>
          </div>

          <div className="space-y-6">
            {report.roadmap.map((phase) => (
              <div 
                key={phase.phaseNumber}
                id={`roadmap-phase-${phase.phaseNumber}`}
                className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-black transition-all flex flex-col md:flex-row items-start md:items-center gap-6 shadow-xs"
              >
                {/* Phase Number & Duration Badge */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-black text-white font-mono font-extrabold text-lg flex items-center justify-center shadow-sm">
                    0{phase.phaseNumber}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300 block w-fit mb-1 font-semibold">
                      {phase.duration}
                    </span>
                    <h4 className="text-lg font-bold text-neutral-950 font-heading">
                      {phase.title}
                    </h4>
                  </div>
                </div>

                {/* Milestones */}
                <div className="flex-1 pl-0 md:pl-6 md:border-l border-neutral-200 w-full">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {phase.milestones.map((milestone, mIdx) => (
                      <li key={mIdx} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 flex items-start gap-2">
                        <span className="text-black font-bold mt-0.5">›</span>
                        <span className="leading-snug">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 9 — ACTION PLAN ("Your Next 5 Actions") */}
        {/* ============================================================ */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-900 font-semibold">Section 09</span>
            <h3 className="text-2xl font-bold text-neutral-950 font-heading">Your Next 5 Actions</h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Extremely practical, high-impact tasks you can start executing immediately. Check them off as you complete them!
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4">
            {actions.map((item) => (
              <div 
                key={item.step}
                id={`action-item-${item.step}`}
                onClick={() => toggleAction(item.step)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 select-none ${
                  item.completed
                    ? "bg-neutral-100 border-neutral-300 opacity-60"
                    : "bg-neutral-50/80 border-neutral-200 hover:border-black"
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                    item.completed ? "bg-black text-white" : "border border-neutral-400 bg-white"
                  }`}>
                    {item.completed && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-black">Step 0{item.step}</span>
                    <span className="text-[10px] font-mono text-neutral-700 bg-neutral-200 px-2 py-0.2 rounded border border-neutral-300 font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <h4 className={`text-sm font-semibold text-neutral-950 ${item.completed ? "line-through text-neutral-400" : ""}`}>
                    {item.action}
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-600">
              <span>Progress: {actions.filter(a => a.completed).length} of 5 completed</span>
              <button
                type="button"
                onClick={() => onOpenCoach("Which project should I build first?")}
                className="text-black hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>Discuss implementation roadmap with Career AI</span>
                <ChevronRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RESUME ATS CHECKER (Readability Section) */}
        {/* ============================================================ */}
        <div id="resume-ats-readability-section">
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-900 font-semibold">ATS Audit</span>
            <h3 className="text-2xl font-bold text-neutral-950 font-heading">Resume Readability</h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Structural parsing and readability inspection across standard ATS extraction criteria.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-neutral-200 p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {report.readabilityChecklist.map((item, idx) => {
                const statusBadge =
                  item.status === "Good" ? "text-emerald-800 bg-emerald-50 border-emerald-300" :
                  item.status === "Improve" ? "text-amber-800 bg-amber-50 border-amber-300" :
                  "text-rose-800 bg-rose-50 border-rose-300";

                const icon =
                  item.status === "Good" ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> :
                  item.status === "Improve" ? <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" /> :
                  <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />;

                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-start gap-3">
                    <div className="mt-0.5">{icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-neutral-950">{item.category}</span>
                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${statusBadge}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">
                        {item.comment}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
              <span>
                <strong>Parser Policy:</strong> Readability scores assess font consistency, linear reading flow, and standard metadata headers. A clean score helps ensure automated parsers do not drop your contact details or scramble project dates, but does not guarantee employment passing.
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* FOOTER ACTION BANNER: DOWNLOAD REPORT AS PDF & NEXT STEPS */}
        {/* ============================================================ */}
        <div className="p-8 sm:p-10 rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-300 bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700 inline-block font-semibold">
              Save Your Career Gap Analysis
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              Keep your personalized roadmap handy
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Download your complete executive PDF report containing your benchmark score (out of 100), detailed recruiter signals, actionable skill gaps, portfolio project specifications, bullet point rewrites, and the 5-step milestone checklist.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 flex-shrink-0">
            <button
              type="button"
              id="bottom-download-pdf-btn"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-100 shadow-lg active:scale-95 disabled:opacity-75 disabled:cursor-wait transition-all cursor-pointer"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-black" />
                  <span>Download Report as PDF</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpenCoach("What are the top 3 priorities I should tackle first from this report?")}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-900 text-white border border-neutral-700 hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Discuss with Career AI</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
