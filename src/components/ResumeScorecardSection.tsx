import React from "react";
import { 
  ResumeScorecard, 
  ScoreCategoryComparison 
} from "../types";
import { 
  Scale, 
  Target, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  Zap, 
  BarChart3,
  ArrowRight
} from "lucide-react";

interface ResumeScorecardSectionProps {
  scorecard: ResumeScorecard;
  targetRole: string;
  targetCompany: string;
  experienceLevel: string;
  onOpenCoach?: (question?: string) => void;
}

export const ResumeScorecardSection: React.FC<ResumeScorecardSectionProps> = ({
  scorecard,
  targetRole,
  targetCompany,
  experienceLevel,
  onOpenCoach,
}) => {
  const potentialScore = Math.min(96, scorecard.overallScore + 18);
  const isAhead = scorecard.pointsToTarget >= 0;

  return (
    <section 
      id="resume-scorecard-comparison-section" 
      className="p-6 sm:p-10 rounded-3xl glass-panel border border-[#D4AF37]/35 bg-gradient-to-br from-black/95 via-[#0C0C0C]/95 to-black/95 shadow-2xl shadow-black relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#B8860B]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#D4AF37]/20 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#F5D061] bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
              Benchmark Analysis
            </span>
            <span className="text-xs font-mono text-[#E5C158] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
              Evaluated out of 100
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
            Resume Score & Benchmark Comparison
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-1.5 max-w-3xl">
            Objective evaluation comparing the client&apos;s resume out of <strong className="text-white">100 points</strong> against target hiring expectations for <span className="text-[#F5D061] font-semibold">{targetRole}</span> at <span className="text-white font-semibold">{targetCompany}</span>.
          </p>
        </div>

        {onOpenCoach && (
          <button
            type="button"
            onClick={() => onOpenCoach(`How can I improve my resume score from ${scorecard.overallScore}/100 to ${scorecard.targetBenchmark}+ /100 for ${targetRole} at ${targetCompany}?`)}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-black/70 text-[#F5D061] hover:text-white border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#141414] transition-all self-start md:self-auto shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Ask Coach How to Reach 90/100</span>
          </button>
        )}
      </div>

      {/* Primary 4-Metric Grid Comparing Out of 100 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10">
        {/* Metric 1: Client Resume Score */}
        <div 
          id="scorecard-client-score-card"
          className="p-5 rounded-2xl bg-gradient-to-br from-[#1C1709]/90 to-black/90 border-2 border-[#D4AF37]/70 shadow-lg shadow-[#D4AF37]/15 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#F5D061] uppercase tracking-wider mb-2">
            <span>Client Resume Score</span>
            <span className="p-1 rounded-md bg-[#D4AF37]/20 text-[#F5D061]">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
              {scorecard.overallScore}
            </span>
            <span className="text-lg font-bold text-[#A1A1AA] font-mono">/ 100</span>
          </div>
          <div className="mt-2 text-xs font-medium text-[#F5D061] truncate">
            {scorecard.tier}
          </div>
        </div>

        {/* Metric 2: Target Role Expectation */}
        <div 
          id="scorecard-target-benchmark-card"
          className="p-5 rounded-2xl bg-black/80 border border-[#D4AF37]/25 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-2">
            <span>Target Benchmark</span>
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-mono tracking-tight">
              {scorecard.targetBenchmark}
            </span>
            <span className="text-lg font-bold text-[#A1A1AA] font-mono">/ 100</span>
          </div>
          <div className="mt-2 text-xs text-[#A1A1AA] truncate">
            {targetCompany} Hiring Bar
          </div>
        </div>

        {/* Metric 3: Applicant Pool Average */}
        <div 
          id="scorecard-applicant-pool-card"
          className="p-5 rounded-2xl bg-black/80 border border-[#D4AF37]/25 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-2">
            <span>Applicant Average</span>
            <span className="p-1 rounded-md bg-[#D4AF37]/10 text-[#D4AF37]">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-4xl sm:text-5xl font-extrabold text-zinc-200 font-mono tracking-tight">
              {scorecard.applicantPoolAverage}
            </span>
            <span className="text-lg font-bold text-[#A1A1AA] font-mono">/ 100</span>
          </div>
          <div className="mt-2 text-xs text-emerald-400">
            {scorecard.overallScore >= scorecard.applicantPoolAverage
              ? `+${scorecard.overallScore - scorecard.applicantPoolAverage} pts above applicant pool`
              : `${scorecard.applicantPoolAverage - scorecard.overallScore} pts below applicant pool`}
          </div>
        </div>

        {/* Metric 4: Delta to Target Benchmark */}
        <div 
          id="scorecard-points-delta-card"
          className={`p-5 rounded-2xl border relative overflow-hidden ${
            isAhead 
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400' 
              : 'bg-[#241A0B]/60 border-[#D4AF37]/50 text-[#F5D061]'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider mb-2 opacity-90">
            <span>Points Delta</span>
            <span className="p-1 rounded-md bg-white/10">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight">
              {isAhead ? `+${scorecard.pointsToTarget}` : scorecard.pointsToTarget}
            </span>
            <span className="text-lg font-bold font-mono">pts</span>
          </div>
          <div className="mt-2 text-xs truncate">
            {isAhead ? "Exceeds standard hiring bar" : `${Math.abs(scorecard.pointsToTarget)} pts to target threshold`}
          </div>
        </div>
      </div>

      {/* Continuous 0 - 100 Comparative Spectrum Gauge */}
      <div className="p-6 rounded-2xl bg-black/80 border border-[#D4AF37]/25 mb-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Candidate Benchmark Spectrum (0 – 100)
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-[#A1A1AA]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
              Client: <strong className="text-white">{scorecard.overallScore}/100</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Target: <strong className="text-white">{scorecard.targetBenchmark}/100</strong>
            </span>
          </div>
        </div>

        {/* Visual Spectrum Track */}
        <div className="relative pt-6 pb-4">
          {/* Base gradient bar */}
          <div className="h-3 w-full rounded-full bg-gradient-to-r from-rose-600/70 via-amber-600/70 via-[#B8860B]/70 via-[#D4AF37]/80 to-emerald-400/90 shadow-inner" />

          {/* Marker 1: Applicant Average (66) */}
          <div 
            className="absolute top-0 flex flex-col items-center -translate-x-1/2"
            style={{ left: `${scorecard.applicantPoolAverage}%` }}
          >
            <span className="text-[10px] font-mono text-[#A1A1AA] whitespace-nowrap bg-black px-1.5 py-0.5 rounded border border-[#D4AF37]/25">
              Pool: {scorecard.applicantPoolAverage}
            </span>
            <div className="w-0.5 h-4 bg-[#71717A] mt-1" />
          </div>

          {/* Marker 2: Client Resume Score */}
          <div 
            className="absolute top-0 flex flex-col items-center -translate-x-1/2 z-20"
            style={{ left: `${Math.min(95, Math.max(8, scorecard.overallScore))}%` }}
          >
            <div className="text-[11px] font-mono font-bold text-black whitespace-nowrap bg-gradient-to-r from-[#D4AF37] to-[#B8860B] px-2.5 py-0.5 rounded-full border border-white/40 shadow-lg shadow-[#D4AF37]/30 flex items-center gap-1">
              <span>Your Resume: {scorecard.overallScore}/100</span>
            </div>
            <div className="w-1 h-5 bg-[#F5D061] shadow-md shadow-[#D4AF37]/60 mt-1 rounded-full" />
          </div>

          {/* Marker 3: Target Benchmark */}
          <div 
            className="absolute top-0 flex flex-col items-center -translate-x-1/2 z-10"
            style={{ left: `${scorecard.targetBenchmark}%` }}
          >
            <span className="text-[10px] font-mono font-bold text-emerald-300 whitespace-nowrap bg-emerald-950/90 px-1.5 py-0.5 rounded border border-emerald-500/40">
              Target: {scorecard.targetBenchmark}
            </span>
            <div className="w-0.5 h-4 bg-emerald-400 mt-1" />
          </div>

          {/* Marker 4: Top Tier (92) */}
          <div 
            className="absolute top-0 flex flex-col items-center -translate-x-1/2"
            style={{ left: `${scorecard.topTierThreshold}%` }}
          >
            <span className="text-[10px] font-mono text-[#F5D061] whitespace-nowrap bg-black px-1.5 py-0.5 rounded border border-[#D4AF37]/40">
              Top 10%: {scorecard.topTierThreshold}
            </span>
            <div className="w-0.5 h-4 bg-[#D4AF37] mt-1" />
          </div>
        </div>

        {/* Spectrum Range Labels */}
        <div className="flex justify-between text-[11px] font-mono text-[#71717A] pt-1">
          <span>0 (Rebuild)</span>
          <span>50 (Foundational)</span>
          <span>70 (Competitive Contender)</span>
          <span>85 (Target Offer Tier)</span>
          <span>100 (Elite)</span>
        </div>
      </div>

      {/* 5 Dimensional Category Score Comparison Rows */}
      <div className="space-y-4 mb-8 relative z-10">
        <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
            5-Axis Category Comparison (Out of 100)
          </h3>
          <span className="text-xs font-mono text-[#A1A1AA] hidden sm:inline">
            Client Score vs Target Benchmark
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {scorecard.categories.map((cat, idx) => {
            const statusColor = 
              cat.status === 'Exceeds' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
              cat.status === 'Meets' ? 'text-[#F5D061] bg-[#D4AF37]/15 border-[#D4AF37]/30' :
              cat.status === 'Below' ? 'text-amber-300 bg-amber-500/10 border-amber-500/30' :
              'text-rose-300 bg-rose-500/10 border-rose-500/30';

            const barGradient = 
              cat.status === 'Exceeds' ? 'from-emerald-500 to-teal-400' :
              cat.status === 'Meets' ? 'from-[#D4AF37] to-[#F5D061]' :
              cat.status === 'Below' ? 'from-amber-500 to-[#D4AF37]' :
              'from-rose-500 to-amber-500';

            return (
              <div 
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-black/80 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-[#71717A] w-5">0{idx + 1}.</span>
                    <span className="text-sm font-bold text-white tracking-wide">
                      {cat.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${statusColor}`}>
                      {cat.status === 'Exceeds' ? `+${cat.pointsDelta} pts (Exceeds)` :
                       cat.status === 'Meets' ? `Meets Bar (${cat.clientScore}/100)` :
                       `${cat.pointsDelta} pts Gap`}
                    </span>
                    <div className="text-xs font-mono font-bold text-right">
                      <span className="text-white text-sm">{cat.clientScore}</span>
                      <span className="text-[#71717A]"> / 100</span>
                      <span className="text-[11px] text-[#A1A1AA] ml-2">(Target: {cat.targetBenchmark})</span>
                    </div>
                  </div>
                </div>

                {/* Comparative dual track bar */}
                <div className="relative mb-2.5">
                  {/* Background Track */}
                  <div className="h-2.5 w-full bg-[#181818] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-700`}
                      style={{ width: `${Math.min(100, Math.max(5, cat.clientScore))}%` }}
                    />
                  </div>

                  {/* Target benchmark notch indicator */}
                  <div 
                    className="absolute top-[-3px] bottom-[-3px] w-0.5 bg-emerald-400 z-10"
                    style={{ left: `${cat.targetBenchmark}%` }}
                    title={`Target Benchmark: ${cat.targetBenchmark}/100`}
                  />
                </div>

                {/* Diagnostic detail & Potential gain note */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-[#A1A1AA]">
                  <p className="text-[#A1A1AA] leading-relaxed">
                    {cat.detail}
                  </p>
                  {cat.potentialGain > 0 && (
                    <span className="text-[11px] font-mono text-[#F5D061] font-semibold flex items-center gap-1 flex-shrink-0">
                      <Zap className="w-3 h-3 text-[#D4AF37]" />
                      +{cat.potentialGain} pts gain available
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score Uplift Forecast & Bridge Summary */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#181307]/80 via-black to-[#140F06] border border-[#D4AF37]/40 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-black flex-shrink-0 shadow-lg shadow-[#D4AF37]/20">
            <TrendingUp className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5D061]">
                Score Uplift Forecast
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                +18 Points Potential
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#E4E4E7] mt-1 leading-relaxed">
              By applying the suggested bullet rewrites and completing the recommended deployed project, this resume score bridges from <strong className="text-white font-mono">{scorecard.overallScore}/100</strong> to <strong className="text-emerald-400 font-mono">{potentialScore}/100</strong>, surpassing the <strong className="text-white font-mono">{scorecard.targetBenchmark}/100</strong> hiring bar.
            </p>
          </div>
        </div>

        {onOpenCoach && (
          <button
            type="button"
            onClick={() => onOpenCoach(`Walk me through step-by-step how to gain the 18 points on my resume to go from ${scorecard.overallScore}/100 to ${potentialScore}/100.`)}
            className="flex-shrink-0 w-full md:w-auto px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B8860B] text-black shadow-lg shadow-[#D4AF37]/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Bridge Score Gap</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </button>
        )}
      </div>
    </section>
  );
};
