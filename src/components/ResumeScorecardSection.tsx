import React from "react";
import { 
  ResumeScorecard 
} from "../types";
import { 
  Scale, 
  Target, 
  TrendingUp, 
  Award, 
  Sparkles, 
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
  onOpenCoach,
}) => {
  const potentialScore = Math.min(96, scorecard.overallScore + 18);
  const isAhead = scorecard.pointsToTarget >= 0;

  return (
    <section 
      id="resume-scorecard-comparison-section" 
      className="p-6 sm:p-10 rounded-3xl bg-white border border-neutral-200 shadow-sm relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-neutral-200 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-900 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-300 flex items-center gap-1.5 font-semibold">
              <Scale className="w-3.5 h-3.5 text-black" />
              Benchmark Analysis
            </span>
            <span className="text-xs font-mono text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-200">
              Evaluated out of 100
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight font-heading">
            Resume Score & Benchmark Comparison
          </h2>
          <p className="text-sm text-neutral-600 mt-1.5 max-w-3xl leading-relaxed">
            Objective evaluation comparing the client&apos;s resume out of <strong className="text-neutral-950">100 points</strong> against target hiring expectations for <span className="text-black font-bold">{targetRole}</span> at <span className="text-black font-bold">{targetCompany}</span>.
          </p>
        </div>

        {onOpenCoach && (
          <button
            type="button"
            onClick={() => onOpenCoach(`How can I improve my resume score from ${scorecard.overallScore}/100 to ${scorecard.targetBenchmark}+ /100 for ${targetRole} at ${targetCompany}?`)}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-black text-white hover:bg-neutral-800 transition-all self-start md:self-auto shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Consult Coach on Reaching 90/100</span>
          </button>
        )}
      </div>

      {/* Primary 4-Metric Grid Comparing Out of 100 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10">
        {/* Metric 1: Client Resume Score (Standout Obsidian Focal Card with Subtle Cyan Pop) */}
        <div 
          id="scorecard-client-score-card"
          className="p-5 rounded-2xl bg-neutral-950 text-white border border-neutral-800 shadow-md relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
            <span>Client Resume Score</span>
            <span className="p-1 rounded-md bg-blue-950 text-cyan-400 border border-blue-800/80">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
              {scorecard.overallScore}
            </span>
            <span className="text-lg font-bold text-neutral-400 font-mono">/ 100</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-cyan-300 truncate font-mono">
            {scorecard.tier}
          </div>
        </div>

        {/* Metric 2: Target Role Expectation */}
        <div 
          id="scorecard-target-benchmark-card"
          className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2">
            <span>Target Benchmark</span>
            <span className="p-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-4xl sm:text-5xl font-extrabold text-neutral-900 font-mono tracking-tight">
              {scorecard.targetBenchmark}
            </span>
            <span className="text-lg font-bold text-neutral-400 font-mono">/ 100</span>
          </div>
          <div className="mt-2 text-xs text-neutral-600 truncate font-medium">
            {targetCompany} Target Bar
          </div>
        </div>

        {/* Metric 3: Applicant Pool Average */}
        <div 
          id="scorecard-applicant-pool-card"
          className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2">
            <span>Applicant Average</span>
            <span className="p-1 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-300">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-4xl sm:text-5xl font-extrabold text-neutral-900 font-mono tracking-tight">
              {scorecard.applicantPoolAverage}
            </span>
            <span className="text-lg font-bold text-neutral-400 font-mono">/ 100</span>
          </div>
          <div className="mt-2 text-xs text-neutral-600 font-medium">
            {scorecard.overallScore >= scorecard.applicantPoolAverage
              ? `+${scorecard.overallScore - scorecard.applicantPoolAverage} pts above applicant pool`
              : `${scorecard.applicantPoolAverage - scorecard.overallScore} pts below applicant pool`}
          </div>
        </div>

        {/* Metric 4: Delta to Target Benchmark */}
        <div 
          id="scorecard-points-delta-card"
          className={`p-5 rounded-2xl border relative overflow-hidden ${
            isAhead ? 'bg-emerald-50/40 border-emerald-200' : 'bg-amber-50/40 border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider mb-2">
            <span className={isAhead ? "text-emerald-800" : "text-amber-800"}>Points Delta</span>
            <span className={`p-1 rounded-md border ${
              isAhead ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className={`text-4xl sm:text-5xl font-extrabold font-mono tracking-tight ${isAhead ? 'text-emerald-700' : 'text-amber-900'}`}>
              {isAhead ? `+${scorecard.pointsToTarget}` : scorecard.pointsToTarget}
            </span>
            <span className={`text-lg font-bold font-mono ${isAhead ? 'text-emerald-600' : 'text-amber-700'}`}>pts</span>
          </div>
          <div className={`mt-2 text-xs font-medium truncate ${isAhead ? 'text-emerald-800' : 'text-amber-800'}`}>
            {isAhead ? "Exceeds standard hiring bar" : `${Math.abs(scorecard.pointsToTarget)} pts to target threshold`}
          </div>
        </div>
      </div>

      {/* Continuous 0 - 100 Comparative Spectrum Gauge */}
      <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200 mb-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
              Candidate Benchmark Spectrum (0 – 100)
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-black ring-2 ring-cyan-400" />
              Client: <strong className="text-black">{scorecard.overallScore}/100</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              Target: <strong className="text-neutral-900">{scorecard.targetBenchmark}/100</strong>
            </span>
          </div>
        </div>

        {/* Visual Spectrum Track with subtle zone color gradient */}
        <div className="relative pt-6 pb-4">
          {/* Subtle multi-zone gradient track */}
          <div className="h-3 w-full rounded-full bg-gradient-to-r from-neutral-200 via-amber-100/90 via-blue-100/90 to-emerald-200 border border-neutral-300 shadow-inner" />

          {/* Marker 1: Applicant Average */}
          <div 
            className="absolute top-0 flex flex-col items-center -translate-x-1/2"
            style={{ left: `${scorecard.applicantPoolAverage}%` }}
          >
            <span className="text-[10px] font-mono text-neutral-600 whitespace-nowrap bg-white px-1.5 py-0.5 rounded border border-neutral-300">
              Pool: {scorecard.applicantPoolAverage}
            </span>
            <div className="w-0.5 h-4 bg-neutral-400 mt-1" />
          </div>

          {/* Marker 2: Client Resume Score */}
          <div 
            className="absolute top-0 flex flex-col items-center -translate-x-1/2 z-20"
            style={{ left: `${Math.min(95, Math.max(8, scorecard.overallScore))}%` }}
          >
            <div className="text-[11px] font-mono font-bold text-white whitespace-nowrap bg-neutral-950 px-2.5 py-0.5 rounded-full border border-cyan-400/80 shadow-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Your Resume: {scorecard.overallScore}/100</span>
            </div>
            <div className="w-1 h-5 bg-neutral-950 mt-1 rounded-full" />
          </div>

          {/* Marker 3: Target Benchmark */}
          <div 
            className="absolute top-0 flex flex-col items-center -translate-x-1/2 z-10"
            style={{ left: `${scorecard.targetBenchmark}%` }}
          >
            <span className="text-[10px] font-mono font-bold text-indigo-900 whitespace-nowrap bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-300 shadow-2xs">
              Target: {scorecard.targetBenchmark}
            </span>
            <div className="w-0.5 h-4 bg-indigo-600 mt-1" />
          </div>

          {/* Marker 4: Top Tier */}
          <div 
            className="absolute top-0 flex flex-col items-center -translate-x-1/2"
            style={{ left: `${scorecard.topTierThreshold}%` }}
          >
            <span className="text-[10px] font-mono text-emerald-800 whitespace-nowrap bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 font-semibold">
              Top 10%: {scorecard.topTierThreshold}
            </span>
            <div className="w-0.5 h-4 bg-emerald-600 mt-1" />
          </div>
        </div>

        {/* Spectrum Range Labels */}
        <div className="flex justify-between text-[11px] font-mono text-neutral-500 pt-1">
          <span>0 (Rebuild)</span>
          <span>50 (Foundational)</span>
          <span className="text-amber-800">70 (Competitive Contender)</span>
          <span className="text-indigo-800">85 (Target Offer Tier)</span>
          <span className="text-emerald-800 font-semibold">100 (Elite)</span>
        </div>
      </div>

      {/* 5 Dimensional Category Score Comparison Rows */}
      <div className="space-y-4 mb-8 relative z-10">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
          <h3 className="text-base font-bold text-neutral-950 font-heading flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-black" />
            5-Axis Category Comparison (Out of 100)
          </h3>
          <span className="text-xs font-mono text-neutral-500 hidden sm:inline">
            Client Score vs Target Benchmark
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {scorecard.categories.map((cat, idx) => {
            const statusBadge = 
              cat.status === 'Exceeds' ? 'text-emerald-800 bg-emerald-50 border-emerald-300' :
              cat.status === 'Meets' ? 'text-blue-800 bg-blue-50 border-blue-300' :
              cat.status === 'Below' ? 'text-amber-800 bg-amber-50 border-amber-300' :
              'text-rose-800 bg-rose-50 border-rose-300';

            const barColor =
              cat.status === 'Exceeds' ? 'bg-emerald-600' :
              cat.status === 'Meets' ? 'bg-blue-600' :
              cat.status === 'Below' ? 'bg-amber-500' :
              'bg-rose-500';

            return (
              <div 
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 hover:border-black transition-all shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-neutral-400 w-5">0{idx + 1}.</span>
                    <span className="text-sm font-bold text-neutral-950 tracking-wide">
                      {cat.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${statusBadge}`}>
                      {cat.status === 'Exceeds' ? `+${cat.pointsDelta} pts (Exceeds)` :
                       cat.status === 'Meets' ? `Meets Bar (${cat.clientScore}/100)` :
                       `${cat.pointsDelta} pts Gap`}
                    </span>
                    <div className="text-xs font-mono font-bold text-right">
                      <span className="text-neutral-950 text-sm">{cat.clientScore}</span>
                      <span className="text-neutral-400"> / 100</span>
                      <span className="text-[11px] text-neutral-500 ml-2">(Target: {cat.targetBenchmark})</span>
                    </div>
                  </div>
                </div>

                {/* Comparative dual track bar */}
                <div className="relative mb-2.5">
                  {/* Background Track */}
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${barColor} transition-all duration-700`}
                      style={{ width: `${Math.min(100, Math.max(5, cat.clientScore))}%` }}
                    />
                  </div>

                  {/* Target benchmark notch indicator */}
                  <div 
                    className="absolute top-[-3px] bottom-[-3px] w-0.5 bg-neutral-800 z-10"
                    style={{ left: `${cat.targetBenchmark}%` }}
                    title={`Target Benchmark: ${cat.targetBenchmark}/100`}
                  />
                </div>

                {/* Diagnostic detail & Potential gain note */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-neutral-600">
                  <p className="leading-relaxed">
                    {cat.detail}
                  </p>
                  {cat.potentialGain > 0 && (
                    <span className="text-[11px] font-mono text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-bold flex items-center gap-1 flex-shrink-0">
                      <Zap className="w-3 h-3 text-indigo-600" />
                      +{cat.potentialGain} pts gain available
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score Uplift Forecast (Architectural Obsidian Card) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950 text-white border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 shadow-md">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center flex-shrink-0 shadow-sm">
            <TrendingUp className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Score Uplift Forecast
              </span>
              <span className="text-[10px] font-mono text-white bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700 font-bold">
                +18 Points Potential
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 leading-relaxed">
              By applying the suggested bullet rewrites and completing the recommended deployed project, this resume score bridges from <strong className="text-white font-mono">{scorecard.overallScore}/100</strong> to <strong className="text-white font-mono">{potentialScore}/100</strong>, surpassing the <strong className="text-white font-mono">{scorecard.targetBenchmark}/100</strong> hiring bar.
            </p>
          </div>
        </div>

        {onOpenCoach && (
          <button
            type="button"
            onClick={() => onOpenCoach(`Walk me through step-by-step how to gain the 18 points on my resume to go from ${scorecard.overallScore}/100 to ${potentialScore}/100.`)}
            className="flex-shrink-0 w-full md:w-auto px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-100 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Bridge Score Gap</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </button>
        )}
      </div>
    </section>
  );
};
