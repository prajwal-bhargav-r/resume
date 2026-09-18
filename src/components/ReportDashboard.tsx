import React, { useState } from "react";
import { 
  CareerGapReport, 
  ResumeImprovement, 
  NextActionItem 
} from "../types";
import { computeResumeScorecard, computeCandidateDiagnostics } from "../services/analysisEngine";
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
  Download, 
  Share2, 
  RotateCcw,
  Building2,
  Briefcase,
  Layers,
  ChevronRight,
  HelpCircle,
  Clock,
  Code2,
  FileCheck,
  ShieldCheck,
  ExternalLink,
  Target,
  Scale,
  TrendingUp,
  Award
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

  const filteredSkills = report.skillGaps.filter((item) => {
    if (skillFilter === "All") return true;
    return item.gap === skillFilter;
  });

  return (
    <div id="career-gap-report-dashboard" className="py-12 md:py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ============================================================ */}
        {/* HEADER & PROFILE ALIGNMENT HERO */}
        {/* ============================================================ */}
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-[#D4AF37]/35 bg-gradient-to-br from-black/95 via-[#0C0C0C]/95 to-black/95 shadow-2xl shadow-black relative overflow-hidden">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B8860B]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar: Action Buttons & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#D4AF37]/20 relative z-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#F5D061] bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                Official Analysis Report
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 font-heading">
                Your Career Gap Report
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                id="reanalyze-btn"
                onClick={onReanalyze}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-black/60 text-[#A1A1AA] hover:text-white border border-[#D4AF37]/25 hover:border-[#D4AF37]/50 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Analyze</span>
              </button>

              <button
                type="button"
                id="export-report-btn"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B8860B] text-black shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-black" />
                <span>Export / Print</span>
              </button>
            </div>
          </div>

          {/* Target Metadata Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 relative z-10">
            <div className="p-4 rounded-2xl bg-black/80 border border-[#D4AF37]/20 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 text-[#F5D061]">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider block">Target Role</span>
                <span className="text-sm sm:text-base font-bold text-white">{report.targetRole}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/80 border border-[#D4AF37]/20 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 text-[#F5D061]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider block">Target Company</span>
                <span className="text-sm sm:text-base font-bold text-white">{report.targetCompany}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/80 border border-[#D4AF37]/20 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider block">Experience Level</span>
                <span className="text-sm sm:text-base font-bold text-white">{report.experienceLevel}</span>
              </div>
            </div>
          </div>

          {/* LARGE PROFILE ALIGNMENT VISUALIZATION */}
          <div 
            id="profile-alignment-container"
            className="p-6 sm:p-8 rounded-2xl bg-black/80 border border-[#D4AF37]/25 relative z-10 flex flex-col md:flex-row items-center gap-8"
          >
            {/* Circular score dial visual */}
            <div className="relative flex-shrink-0 flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  className="text-zinc-800"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  className="text-[#D4AF37]"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - report.alignmentScore / 100)}
                  strokeLinecap="round"
                  stroke="url(#gradient-accent-gold)"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="gradient-accent-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#F5D061" />
                    <stop offset="100%" stopColor="#B8860B" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight leading-none">
                  {scorecard.overallScore}
                  <span className="text-base sm:text-lg font-bold text-[#A1A1AA]">/100</span>
                </span>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#F5D061] mt-1">
                  Resume Score
                </span>
              </div>
            </div>

            {/* Description & Transparency Note */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
                  Resume Score & Benchmark Alignment
                </h2>
                <span className="text-xs font-mono text-[#F5D061] bg-[#D4AF37]/15 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                  Compared out of 100
                </span>
              </div>

              <p className="text-sm text-[#F5D061] font-medium mb-3">
                {scorecard.verdict}
              </p>

              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-4">
                {report.alignmentSummary}
              </p>

              {/* Quick Hero Benchmark Comparison Bar */}
              <div className="grid grid-cols-3 gap-2 mb-4 p-2 rounded-xl bg-black/90 border border-[#D4AF37]/20 text-center">
                <div className="p-1.5">
                  <span className="text-[10px] font-mono text-[#A1A1AA] uppercase block">Client Score</span>
                  <span className="text-sm sm:text-base font-bold text-white font-mono">{scorecard.overallScore} / 100</span>
                </div>
                <div className="p-1.5 border-x border-[#D4AF37]/20">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase block">Target Bar</span>
                  <span className="text-sm sm:text-base font-bold text-emerald-400 font-mono">{scorecard.targetBenchmark} / 100</span>
                </div>
                <div className="p-1.5">
                  <span className="text-[10px] font-mono text-[#F5D061] uppercase block">Points Gap</span>
                  <span className={`text-sm sm:text-base font-bold font-mono ${scorecard.pointsToTarget >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {scorecard.pointsToTarget >= 0 ? `+${scorecard.pointsToTarget}` : scorecard.pointsToTarget} pts
                  </span>
                </div>
              </div>

              {/* Explicit Transparency Disclaimer */}
              <div className="p-3 rounded-xl bg-black/90 border border-[#D4AF37]/20 text-[11px] text-[#A1A1AA] flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
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
              <span className="text-xs font-mono uppercase tracking-wider text-[#F5D061]">Section 01</span>
              <h3 className="text-2xl font-bold text-white font-heading">Quick Summary</h3>
            </div>
            <span className="text-xs text-[#A1A1AA] font-mono">Executive Snapshot</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Strengths Card */}
            <div 
              id="summary-strengths-card"
              className="p-6 rounded-2xl glass-panel border border-[#D4AF37]/20 bg-black/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Strengths
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Proven Assets
                  </span>
                </div>
                <ul className="space-y-2.5 text-sm text-[#E4E4E7]">
                  {report.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#D4AF37]/15 text-[11px] text-[#71717A]">
                Reinforce these in technical interviews.
              </div>
            </div>

            {/* Gaps Card */}
            <div 
              id="summary-gaps-card"
              className="p-6 rounded-2xl glass-panel border border-[#D4AF37]/20 bg-black/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#F5D061] font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#D4AF37]" />
                    Gaps
                  </span>
                  <span className="text-[10px] font-mono text-[#F5D061] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                    Areas to Bridge
                  </span>
                </div>
                <ul className="space-y-2.5 text-sm text-[#E4E4E7]">
                  {report.gaps.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-[#F5D061] font-bold mt-0.5">⚠</span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#D4AF37]/15 text-[11px] text-[#71717A]">
                Focus projects here to remove screen friction.
              </div>
            </div>

            {/* Priority Card */}
            <div 
              id="summary-priority-card"
              className="p-6 rounded-2xl glass-panel border border-[#D4AF37]/40 bg-gradient-to-br from-[#1C1709]/80 to-black/90 flex flex-col justify-between shadow-lg shadow-[#D4AF37]/5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#F5D061] font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    Priority Focus
                  </span>
                  <span className="text-[10px] font-mono text-[#F5D061] bg-[#D4AF37]/15 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                    Immediate ROI
                  </span>
                </div>
                <ol className="space-y-3 text-sm text-[#E4E4E7]">
                  {report.priorityActions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#F5D061] text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#D4AF37]/30">
                        {i + 1}
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="mt-6 pt-4 border-t border-[#D4AF37]/20">
                <button
                  type="button"
                  onClick={() => onOpenCoach("Which project should I build first?")}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-black/60 text-[#F5D061] hover:text-white border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Ask Career Coach About Priorities</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" />
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
            <span className="text-xs font-mono uppercase tracking-wider text-[#F5D061]">Section 02</span>
            <h3 className="text-2xl font-bold text-white font-heading">What Could Be Improved</h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Objective, actionable critique of existing presentation flaws. Designed to help you convey true engineering depth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {report.resumeFlaws.map((flaw) => {
              const severityColor = 
                flaw.severity === "High" ? "text-rose-400 bg-rose-500/10 border-rose-500/30" :
                flaw.severity === "Medium" ? "text-[#F5D061] bg-[#D4AF37]/15 border-[#D4AF37]/30" :
                "text-amber-300 bg-amber-500/10 border-amber-500/30";

              return (
                <div
                  key={flaw.id}
                  id={`flaw-card-${flaw.id}`}
                  className="p-6 rounded-2xl glass-panel border border-[#D4AF37]/20 bg-black/80 flex flex-col justify-between relative overflow-hidden"
                >
                  <div>
                    {/* Severity Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${severityColor}`}>
                        {flaw.severity} Severity
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-3 font-heading leading-snug">
                      "{flaw.issue}"
                    </h4>

                    {/* Why It Matters */}
                    <div className="mb-3.5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] block mb-1">
                        Why it matters:
                      </span>
                      <p className="text-xs text-[#CBD5E1] leading-relaxed">
                        {flaw.whyItMatters}
                      </p>
                    </div>

                    {/* How To Fix */}
                    <div className="p-3 rounded-xl bg-black/90 border border-[#D4AF37]/20">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#F5D061] block mb-1">
                        How to fix:
                      </span>
                      <p className="text-xs text-[#E4E4E7] leading-relaxed">
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
              <span className="text-xs font-mono uppercase tracking-wider text-[#F5D061]">Section 03</span>
              <h3 className="text-2xl font-bold text-white font-heading">Skill Gap Analysis</h3>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                Evaluation of current evidence found in your resume compared with standard role requirements.
              </p>
            </div>

            {/* Gap filter buttons */}
            <div className="flex items-center gap-1.5 bg-black/90 p-1 rounded-xl border border-[#D4AF37]/25 self-start sm:self-auto">
              {(["All", "High", "Medium", "Low"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSkillFilter(filter)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    skillFilter === filter
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold shadow-md shadow-[#D4AF37]/20"
                      : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl glass-panel border border-[#D4AF37]/25 bg-black/80 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-black/90 border-b border-[#D4AF37]/20 text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA]">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Skill</th>
                    <th className="py-3.5 px-4 sm:px-6">Current Evidence</th>
                    <th className="py-3.5 px-4 sm:px-6">Target Importance</th>
                    <th className="py-3.5 px-4 sm:px-6">Gap</th>
                    <th className="py-3.5 px-4 sm:px-6">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/15 text-[#E4E4E7]">
                  {filteredSkills.map((item, idx) => {
                    const evidenceBadge =
                      item.currentEvidence === "Strong"
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                        : item.currentEvidence === "Limited"
                        ? "text-[#F5D061] bg-[#D4AF37]/15 border-[#D4AF37]/30"
                        : "text-[#A1A1AA] bg-zinc-900 border-zinc-800";

                    const gapBadge =
                      item.gap === "High"
                        ? "text-rose-400 bg-rose-500/10 border-rose-500/30"
                        : item.gap === "Medium"
                        ? "text-[#F5D061] bg-[#D4AF37]/15 border-[#D4AF37]/30"
                        : "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";

                    return (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        {/* Skill Name */}
                        <td className="py-4 px-4 sm:px-6 font-bold text-white font-mono whitespace-nowrap">
                          {item.skill}
                        </td>

                        {/* Current Evidence with Progress Bar */}
                        <td className="py-4 px-4 sm:px-6 min-w-[160px]">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full border ${evidenceBadge}`}>
                              {item.currentEvidence}
                            </span>
                            <span className="text-[11px] font-mono text-[#A1A1AA]">
                              {item.currentScore}%
                            </span>
                          </div>
                          <div className="w-full bg-[#181818] rounded-full h-1.5 overflow-hidden border border-[#D4AF37]/20">
                            <div
                              className={`h-full rounded-full ${
                                item.currentScore >= 70
                                  ? "bg-emerald-400"
                                  : item.currentScore >= 40
                                  ? "bg-[#D4AF37]"
                                  : "bg-zinc-600"
                              }`}
                              style={{ width: `${item.currentScore}%` }}
                            />
                          </div>
                        </td>

                        {/* Target Importance */}
                        <td className="py-4 px-4 sm:px-6 font-medium whitespace-nowrap">
                          <span className={`text-xs ${item.targetImportance === "High" ? "text-white font-semibold" : "text-[#A1A1AA]"}`}>
                            {item.targetImportance}
                          </span>
                        </td>

                        {/* Gap */}
                        <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                          <span className={`text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${gapBadge}`}>
                            {item.gap} Gap
                          </span>
                        </td>

                        {/* Recommendation */}
                        <td className="py-4 px-4 sm:px-6 text-xs text-[#CBD5E1] leading-relaxed max-w-xs">
                          {item.recommendation}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-black/90 border-t border-[#D4AF37]/20 text-[11px] text-[#71717A] flex items-center justify-between">
              <span>Skill importance reflects publicly verified technical standards for {report.targetRole}.</span>
              <button
                type="button"
                onClick={() => onOpenCoach("Explain my biggest skill gap.")}
                className="text-[#F5D061] hover:underline flex items-center gap-1 font-semibold"
              >
                Ask AI about your gaps →
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 4 — SKILLS TO DEVELOP (Must Develop, Strengthen, Optional) */}
        {/* ============================================================ */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-[#F5D061]">Section 04</span>
            <h3 className="text-2xl font-bold text-white font-heading">Skills to Develop</h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Curated roadmap categories showing what to learn, why it matters, and a concrete demonstration project.
            </p>
          </div>

          <div className="space-y-6">
            {/* Category: Must Develop */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h4 className="text-sm font-bold uppercase font-mono tracking-wider text-rose-400">
                  Must Develop (Central to {report.targetRole})
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.skillsToDevelop.mustDevelop.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl glass-panel border border-[#D4AF37]/20 bg-black/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-bold text-white font-mono">{item.skill}</span>
                        <span className="text-[10px] font-mono text-[#F5D061] bg-[#D4AF37]/15 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                          {item.learningStage}
                        </span>
                      </div>
                      <p className="text-xs text-[#CBD5E1] mb-3">
                        <strong className="text-[#A1A1AA]">Why:</strong> {item.why}
                      </p>

                      <div className="mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA] block mb-1">
                          Learning sequence:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.learnSteps.map((step, sIdx) => (
                            <span key={sIdx} className="text-[11px] px-2 py-0.5 rounded bg-black text-[#F5D061] border border-[#D4AF37]/30">
                              {step}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 mt-2 border-t border-[#D4AF37]/15 text-xs text-[#E4E4E7]">
                      <span className="font-semibold text-[#F5D061]">Suggested Project: </span>
                      {item.suggestedProject}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category: Strengthen */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                <h4 className="text-sm font-bold uppercase font-mono tracking-wider text-[#F5D061]">
                  Strengthen (Existing Knowledge to Deepen)
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.skillsToDevelop.strengthen.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl glass-panel border border-[#D4AF37]/20 bg-black/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-bold text-white font-mono">{item.skill}</span>
                        <span className="text-[10px] font-mono text-[#F5D061] bg-[#D4AF37]/15 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                          {item.learningStage}
                        </span>
                      </div>
                      <p className="text-xs text-[#CBD5E1] mb-3">
                        <strong className="text-[#A1A1AA]">Why:</strong> {item.why}
                      </p>
                      <div className="mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA] block mb-1">
                          Learning sequence:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.learnSteps.map((step, sIdx) => (
                            <span key={sIdx} className="text-[11px] px-2 py-0.5 rounded bg-black text-[#E4E4E7] border border-[#D4AF37]/25">
                              {step}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 mt-2 border-t border-[#D4AF37]/15 text-xs text-[#E4E4E7]">
                      <span className="font-semibold text-[#F5D061]">Project: </span>
                      {item.suggestedProject}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category: Optional */}
            {report.skillsToDevelop.optional.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B]" />
                  <h4 className="text-sm font-bold uppercase font-mono tracking-wider text-[#D4AF37]">
                    Optional (Differentiators & Electives)
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.skillsToDevelop.optional.map((item, idx) => (
                    <div key={idx} className="p-5 rounded-2xl glass-panel border border-[#D4AF37]/20 bg-black/80">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-bold text-white font-mono">{item.skill}</span>
                        <span className="text-[10px] font-mono text-[#A1A1AA] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                          {item.learningStage}
                        </span>
                      </div>
                      <p className="text-xs text-[#CBD5E1] mb-2">{item.why}</p>
                      <p className="text-xs text-[#E4E4E7]">
                        <strong className="text-[#F5D061]">Elective Idea:</strong> {item.suggestedProject}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 5 — PROJECT GAP ANALYSIS */}
        {/* ============================================================ */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-[#F5D061]">Section 05</span>
            <h3 className="text-2xl font-bold text-white font-heading">
              Projects That Would Strengthen Your Profile
            </h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Production-style project architectures specifically tailored to bridge your missing tools and validate real-world readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.projectRecommendations.map((project, idx) => (
              <div 
                key={idx}
                id={`recommended-project-${idx}`}
                className="p-7 rounded-2xl glass-panel border border-[#D4AF37]/35 bg-gradient-to-br from-black via-[#0E0C07] to-black flex flex-col justify-between shadow-xl shadow-black relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F5D061] border border-[#D4AF37]/30">
                      {project.difficulty} Difficulty
                    </span>
                    <span className="text-xs font-mono text-[#D4AF37]">Capstone Proposal #{idx + 1}</span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-3 font-heading">
                    {project.title}
                  </h4>

                  {/* Skills Demonstrated */}
                  <div className="mb-4">
                    <span className="text-[11px] font-mono uppercase text-[#A1A1AA] block mb-1.5">
                      Skills Demonstrated:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.skillsDemonstrated.map((s, sIdx) => (
                        <span key={sIdx} className="text-xs font-mono px-2 py-0.5 rounded bg-black text-[#F5D061] border border-[#D4AF37]/25">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* What it should contain */}
                  <div className="p-3.5 rounded-xl bg-black/90 border border-[#D4AF37]/20 mb-4">
                    <span className="text-[11px] font-mono uppercase text-emerald-400 block mb-1">
                      What the project should contain:
                    </span>
                    <p className="text-xs text-[#E4E4E7] leading-relaxed">
                      {project.whatItShouldContain}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D4AF37]/15">
                  <span className="text-[11px] font-mono uppercase text-[#F5D061] block mb-1">
                    Why it strengthens your target profile:
                  </span>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
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
            <span className="text-xs font-mono uppercase tracking-wider text-[#F5D061]">Section 06</span>
            <h3 className="text-2xl font-bold text-white font-heading">Target Preparation</h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Dual-perspective guidance comparing general role competencies against publicly documented company engineering practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Column 1: Role Focus */}
            <div className="p-6 rounded-2xl glass-panel border border-[#D4AF37]/20 bg-black/80">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D4AF37]/15">
                <Briefcase className="w-5 h-5 text-[#F5D061]" />
                <h4 className="text-base font-bold text-white font-heading">
                  Role Focus: {report.targetRole}
                </h4>
              </div>
              <p className="text-xs text-[#A1A1AA] mb-4">
                What skills and technical knowledge are universally expected across modern engineering teams hiring for this title:
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-[#E4E4E7]">
                {report.targetPreparation.roleFocus.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/90 border border-[#D4AF37]/20">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#F5D061] font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#D4AF37]/30">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Company Research (Publicly Documented vs AI Recommendations) */}
            <div className="p-6 rounded-2xl glass-panel border border-[#D4AF37]/20 bg-black/80">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D4AF37]/15">
                <Building2 className="w-5 h-5 text-[#F5D061]" />
                <h4 className="text-base font-bold text-white font-heading">
                  Company Research: {report.targetCompany}
                </h4>
              </div>
              <p className="text-xs text-[#A1A1AA] mb-4">
                Publicly documented technology architectures and publicly listed job qualifications:
              </p>

              <div className="space-y-4">
                {report.targetPreparation.companyResearch.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-black/90 border border-[#D4AF37]/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.topic}</span>
                      <span className="text-[10px] font-mono text-[#F5D061] bg-[#D4AF37]/15 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                        {item.source}
                      </span>
                    </div>

                    {/* Separated: Publicly Documented Information */}
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#A1A1AA] block">
                        Publicly Documented Information:
                      </span>
                      <p className="text-xs text-[#CBD5E1] mt-0.5 leading-relaxed">
                        {item.publicDetail}
                      </p>
                    </div>

                    {/* Separated: AI Recommendation */}
                    <div className="pt-2 border-t border-[#D4AF37]/15">
                      <span className="text-[10px] font-mono uppercase text-[#F5D061] block">
                        AI-Generated Recommendation:
                      </span>
                      <p className="text-xs text-white/90 mt-0.5 leading-relaxed">
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
            <span className="text-xs font-mono uppercase tracking-wider text-[#F5D061]">Section 07</span>
            <h3 className="text-2xl font-bold text-white font-heading">Resume Bullet Rewrites</h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Real-world demonstrations showing how to transform vague task descriptions into high-impact, quantified achievement statements without fabricating fake experiences.
            </p>
          </div>

          <div className="space-y-6">
            {rewrites.map((item) => (
              <div 
                key={item.id}
                id={`resume-rewrite-${item.id}`}
                className="p-6 rounded-2xl glass-panel border border-[#D4AF37]/20 bg-black/80 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase font-bold text-[#F5D061]">
                    {item.section}
                  </span>
                  <button
                    type="button"
                    onClick={() => applyRewrite(item.id, item.after)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      item.applied
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                        : "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold shadow-sm hover:brightness-110 active:scale-95"
                    }`}
                  >
                    {item.applied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Applied & Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-black" />
                        <span>Apply Suggested Rewrite</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-rose-400 mb-2">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Before (Weak / Task-Centric)</span>
                    </div>
                    <p className="text-xs text-[#CBD5E1] italic leading-relaxed">
                      "{item.before}"
                    </p>
                  </div>

                  {/* After */}
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30">
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-emerald-400 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>After (Quantified / Action-Driven)</span>
                    </div>
                    <p className="text-xs text-white font-medium leading-relaxed">
                      "{item.after}"
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-[#A1A1AA] pt-2 border-t border-[#D4AF37]/15 flex items-center gap-1.5">
                  <span className="font-mono text-[#F5D061]">Rationale:</span>
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
            <span className="text-xs font-mono uppercase tracking-wider text-[#F5D061]">Section 08</span>
            <h3 className="text-2xl font-bold text-white font-heading">Personalized Career Roadmap</h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Customized progression pipeline adapted to your current stage ({report.experienceLevel}) and target ({report.targetRole} @ {report.targetCompany}).
            </p>
          </div>

          <div className="relative">
            {/* Connecting visual track */}
            <div className="hidden lg:block absolute left-8 top-12 bottom-12 w-[2px] bg-gradient-to-b from-[#D4AF37] via-[#B8860B] to-emerald-400 z-0 opacity-40" />

            <div className="space-y-6 relative z-10">
              {report.roadmap.map((phase) => (
                <div 
                  key={phase.phaseNumber}
                  id={`roadmap-phase-${phase.phaseNumber}`}
                  className="p-6 rounded-2xl glass-panel border border-[#D4AF37]/20 bg-black/80 flex flex-col md:flex-row items-start md:items-center gap-6"
                >
                  {/* Phase Number & Duration Badge */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-black font-mono font-extrabold text-lg flex items-center justify-center shadow-lg shadow-[#D4AF37]/25">
                      0{phase.phaseNumber}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#F5D061] bg-[#D4AF37]/15 px-2 py-0.5 rounded border border-[#D4AF37]/30 block w-fit mb-1">
                        {phase.duration}
                      </span>
                      <h4 className="text-lg font-bold text-white font-heading">
                        {phase.title}
                      </h4>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="flex-1 pl-0 md:pl-6 md:border-l border-[#D4AF37]/15 w-full">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {phase.milestones.map((milestone, mIdx) => (
                        <li key={mIdx} className="p-3 rounded-xl bg-black/90 border border-[#D4AF37]/20 text-xs text-[#E4E4E7] flex items-start gap-2">
                          <span className="text-[#F5D061] font-bold mt-0.5">›</span>
                          <span className="leading-snug">{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 9 — ACTION PLAN ("Your Next 5 Actions") */}
        {/* ============================================================ */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-[#F5D061]">Section 09</span>
            <h3 className="text-2xl font-bold text-white font-heading">Your Next 5 Actions</h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Extremely practical, high-impact tasks you can start executing immediately. Check them off as you complete them!
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#D4AF37]/35 bg-gradient-to-br from-black/95 via-[#0C0C0C] to-black space-y-4">
            {actions.map((item) => (
              <div 
                key={item.step}
                id={`action-item-${item.step}`}
                onClick={() => toggleAction(item.step)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 select-none ${
                  item.completed
                    ? "bg-emerald-500/10 border-emerald-500/40 opacity-75"
                    : "bg-black/80 border-[#D4AF37]/20 hover:border-[#D4AF37]/50"
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                    item.completed ? "bg-emerald-500 text-white" : "border border-[#D4AF37]/40 bg-black"
                  }`}>
                    {item.completed && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[#F5D061]">Step 0{item.step}</span>
                    <span className="text-[10px] font-mono text-[#E5C158] bg-[#D4AF37]/15 px-2 py-0.2 rounded border border-[#D4AF37]/30">
                      {item.category}
                    </span>
                  </div>
                  <h4 className={`text-sm font-semibold text-white ${item.completed ? "line-through text-[#71717A]" : ""}`}>
                    {item.action}
                  </h4>
                  <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#A1A1AA]">
              <span>Progress: {actions.filter(a => a.completed).length} of 5 completed</span>
              <button
                type="button"
                onClick={() => onOpenCoach("Which project should I build first?")}
                className="text-[#F5D061] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Discuss implementation roadmap with Career AI</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RESUME ATS CHECKER (Readability Section) */}
        {/* ============================================================ */}
        <div id="resume-ats-readability-section">
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-[#F5D061]">ATS Audit</span>
            <h3 className="text-2xl font-bold text-white font-heading">Resume Readability</h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Structural parsing and readability inspection across standard ATS extraction criteria.
            </p>
          </div>

          <div className="rounded-2xl glass-panel border border-[#D4AF37]/20 bg-black/80 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {report.readabilityChecklist.map((item, idx) => {
                const statusBadge =
                  item.status === "Good" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" :
                  item.status === "Improve" ? "text-[#F5D061] bg-[#D4AF37]/15 border-[#D4AF37]/30" :
                  "text-rose-400 bg-rose-500/10 border-rose-500/30";

                const icon =
                  item.status === "Good" ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> :
                  item.status === "Improve" ? <AlertTriangle className="w-4 h-4 text-[#F5D061] flex-shrink-0" /> :
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />;

                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-black/90 border border-[#D4AF37]/20 flex items-start gap-3">
                    <div className="mt-0.5">{icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-white">{item.category}</span>
                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${statusBadge}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                        {item.comment}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-black/90 border border-[#D4AF37]/20 text-xs text-[#71717A] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F5D061] flex-shrink-0 mt-0.5" />
              <span>
                <strong>Parser Policy:</strong> Readability scores assess font consistency, linear reading flow, and standard metadata headers. A clean score helps ensure automated parsers do not drop your contact details or scramble project dates, but does not guarantee employment passing.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
