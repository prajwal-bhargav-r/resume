import React, { useState } from "react";
import { CandidateDiagnostics } from "../types";
import { 
  CheckCircle2, 
  AlertOctagon, 
  ArrowUpRight, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  HelpCircle, 
  Copy, 
  Check, 
  Layers, 
  ShieldAlert, 
  Award, 
  SlidersHorizontal, 
  ChevronRight, 
  Flame, 
  FileCheck2, 
  BookOpen,
  Youtube,
  ExternalLink
} from "lucide-react";
import { findResourcesForSkill } from "../services/learningResources";

interface CandidateDiagnosticSectionProps {
  diagnostics: CandidateDiagnostics;
  targetRole: string;
  targetCompany: string;
  experienceLevel: string;
  onOpenCoach?: (prompt?: string) => void;
}

type TabFilter = "all" | "good" | "bad" | "work_on" | "what_makes_it_good";

export const CandidateDiagnosticSection: React.FC<CandidateDiagnosticSectionProps> = ({
  diagnostics,
  targetRole,
  targetCompany,
  onOpenCoach,
}) => {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section 
      id="candidate-diagnostic-4-pillar-section"
      className="p-6 sm:p-10 rounded-3xl bg-white border border-neutral-200 shadow-sm relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 mb-8 border-b border-neutral-200 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-900 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-300 flex items-center gap-1.5 font-semibold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-black" />
              Candidate 360° Diagnostic
            </span>
            <span className="text-xs font-mono text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-200">
              Strengths, Red Flags & Transformation Blueprint
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight font-heading">
            Profile Breakdown: What&apos;s Good, What&apos;s Bad & What Makes It Great
          </h2>
          <p className="text-sm text-neutral-600 mt-1.5 max-w-3xl leading-relaxed">
            Direct recruiter audit calibrated against <span className="text-black font-bold">{targetRole}</span> hiring expectations at <span className="text-black font-bold">{targetCompany}</span>.
          </p>
        </div>

        {onOpenCoach && (
          <button
            type="button"
            onClick={() => onOpenCoach(`Provide a customized action plan to fix what's bad in my resume and elevate it to what makes it good for ${targetRole} at ${targetCompany}.`)}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-black text-white hover:bg-neutral-800 transition-all self-start lg:self-auto shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Consult Coach on Diagnostics</span>
          </button>
        )}
      </div>

      {/* 4 Interactive Pillar Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 relative z-10">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 border cursor-pointer ${
            activeTab === "all"
              ? "bg-neutral-950 text-white border-neutral-950 shadow-xs font-bold ring-1 ring-neutral-700"
              : "bg-white text-neutral-700 border-neutral-200 hover:text-black hover:bg-neutral-100"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All 4 Dimensions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("good")}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 border cursor-pointer ${
            activeTab === "good"
              ? "bg-emerald-950 text-emerald-300 border-emerald-700 shadow-xs font-bold ring-1 ring-emerald-500/50"
              : "bg-white text-neutral-700 border-neutral-200 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/50"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>1. What He Is Good In ({diagnostics.goodSignals.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bad")}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 border cursor-pointer ${
            activeTab === "bad"
              ? "bg-rose-950 text-rose-300 border-rose-700 shadow-xs font-bold ring-1 ring-rose-500/50"
              : "bg-white text-neutral-700 border-neutral-200 hover:text-rose-700 hover:border-rose-300 hover:bg-rose-50/50"
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
          <span>2. What He Is Bad In ({diagnostics.badPatterns.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("work_on")}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 border cursor-pointer ${
            activeTab === "work_on"
              ? "bg-amber-950 text-amber-300 border-amber-700 shadow-xs font-bold ring-1 ring-amber-500/50"
              : "bg-white text-neutral-700 border-neutral-200 hover:text-amber-800 hover:border-amber-300 hover:bg-amber-50/50"
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>3. What He Should Work On ({diagnostics.workOnItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("what_makes_it_good")}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 border cursor-pointer ${
            activeTab === "what_makes_it_good"
              ? "bg-indigo-950 text-indigo-300 border-indigo-700 shadow-xs font-bold ring-1 ring-indigo-500/50"
              : "bg-white text-neutral-700 border-neutral-200 hover:text-indigo-800 hover:border-indigo-300 hover:bg-indigo-50/50"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>4. What Makes It Good ({diagnostics.whatMakesItGood.length} Blueprints)</span>
        </button>
      </div>

      <div className="space-y-10 relative z-10">
        {/* ========================================================================= */}
        {/* PILLAR 1: WHAT HE IS GOOD IN */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "good") && (
          <div 
            id="diagnostic-pillar-good"
            className="p-6 sm:p-7 rounded-2xl bg-neutral-50/70 border border-neutral-200 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-800 font-bold uppercase tracking-wider">
                      Pillar 01 — Positive Signals
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                      Verified Assets
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-950 font-heading">
                    What He Is Good In
                  </h3>
                </div>
              </div>

              <div className="text-xs font-mono text-emerald-800 flex items-center gap-1.5 self-start sm:self-auto bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>Anchors to emphasize in screening</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diagnostics.goodSignals.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 sm:p-5 rounded-xl bg-white border border-neutral-200 hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {item.tag}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50/50 px-2 py-0.5 rounded border border-emerald-200">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        {item.scoreImpact}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-neutral-950 mb-2 leading-snug">
                      {item.title}
                    </h4>

                    <div className="p-2.5 rounded-lg bg-neutral-50/80 border-l-2 border-l-emerald-500 border-neutral-200 text-xs text-neutral-800 mb-3 font-mono">
                      <span className="text-neutral-950 font-semibold mr-1.5">Resume Evidence:</span>
                      {item.evidence}
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      <strong className="text-neutral-950">Recruiter Takeaway:</strong> {item.recruiterTakeaway}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PILLAR 2: WHAT HE IS BAD IN */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "bad") && (
          <div 
            id="diagnostic-pillar-bad"
            className="p-6 sm:p-7 rounded-2xl bg-neutral-50/70 border border-neutral-200 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center shadow-xs">
                  <AlertOctagon className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-rose-800 font-bold uppercase tracking-wider">
                      Pillar 02 — Critical Red Flags & Drag
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                      High Rejection Risk
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-950 font-heading">
                    What He Is Bad In (Anti-Patterns to Eliminate)
                  </h3>
                </div>
              </div>

              <div className="text-xs font-mono text-rose-800 flex items-center gap-1.5 self-start sm:self-auto bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                <TrendingDown className="w-4 h-4 text-rose-600" />
                <span>Root cause of recruiter screen drops</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diagnostics.badPatterns.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 sm:p-5 rounded-xl bg-white border border-neutral-200 hover:border-rose-400/60 transition-all flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-rose-600" />
                        {item.severity}
                      </span>
                      <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50/50 px-2 py-0.5 rounded border border-rose-200">
                        {item.scoreDrag}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-neutral-950 mb-2 leading-snug">
                      {item.title}
                    </h4>

                    <div className="p-2.5 rounded-lg bg-neutral-50/80 border-l-2 border-l-rose-500 border-neutral-200 text-xs text-neutral-800 mb-3 leading-relaxed">
                      <span className="text-neutral-950 font-semibold mr-1.5">Identified Flaw:</span>
                      {item.flaw}
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      <strong className="text-neutral-950">Why It Hurts You:</strong> {item.whyItHurts}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PILLAR 3: WHAT HE SHOULD WORK ON */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "work_on") && (
          <div 
            id="diagnostic-pillar-work-on"
            className="p-6 sm:p-7 rounded-2xl bg-neutral-50/70 border border-neutral-200 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center shadow-xs">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-amber-800 font-bold uppercase tracking-wider">
                      Pillar 03 — Priority Bridge Levers
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                      Highest ROI Levers
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-950 font-heading">
                    What He Should Work On (Action Roadmap)
                  </h3>
                </div>
              </div>

              <div className="text-xs font-mono text-amber-800 flex items-center gap-1.5 self-start sm:self-auto bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Closes the gap to target benchmark</span>
              </div>
            </div>

            <div className="space-y-3">
              {diagnostics.workOnItems.map((item, idx) => (
                <div 
                  key={item.id}
                  className="p-4 sm:p-5 rounded-xl bg-white border border-neutral-200 hover:border-amber-400/60 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-neutral-950 text-amber-400 text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/30">
                      0{idx + 1}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-neutral-950 font-heading">
                          {item.area}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-600 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200">
                          ⏱ {item.timeframe}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                        {item.specificAction}
                      </p>

                      {/* Genuine Verified Resource Recommendation */}
                      {(() => {
                        const resources = findResourcesForSkill(item.area);
                        if (!resources || resources.length === 0) return null;
                        const topRes = resources[0];
                        return (
                          <div className="mt-2.5 pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-mono text-neutral-500 uppercase font-semibold">
                              Popular Resource:
                            </span>
                            <a
                              href={topRes.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 text-xs font-medium transition-all group"
                              title={topRes.description}
                            >
                              {topRes.type === "youtube" ? (
                                <Youtube className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                              ) : (
                                <BookOpen className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                              )}
                              <span className="truncate max-w-[200px] sm:max-w-xs">{topRes.title}</span>
                              <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
                                • {topRes.creatorOrPublisher}
                              </span>
                              <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-black transition-colors flex-shrink-0 ml-0.5" />
                            </a>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-3 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-200">
                    <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                      {item.targetGain} Score Gain
                    </span>
                    {onOpenCoach && (
                      <button
                        type="button"
                        onClick={() => onOpenCoach(`How do I execute this step: "${item.area}" for ${targetRole} at ${targetCompany}?`)}
                        className="p-1.5 rounded-lg bg-neutral-100 text-black hover:bg-black hover:text-white border border-neutral-300 transition-all text-xs flex items-center gap-1 cursor-pointer"
                        title="Ask Coach about this action"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PILLAR 4: WHAT MAKES IT GOOD (THE TRANSFORMATION BLUEPRINT) */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "what_makes_it_good") && (
          <div 
            id="diagnostic-pillar-what-makes-it-good"
            className="p-6 sm:p-7 rounded-2xl bg-neutral-50/70 border border-neutral-200 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-indigo-800 font-bold uppercase tracking-wider">
                      Pillar 04 — The Excellence Blueprint
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold">
                      Recruiter Standard
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-950 font-heading">
                    What Makes It Good (Before vs. After Transformation Rules)
                  </h3>
                </div>
              </div>

              <div className="text-xs font-mono text-indigo-800 flex items-center gap-1.5 self-start sm:self-auto bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200">
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                <span>Google X-Y-Z & Systems Rubric</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 mb-6 leading-relaxed">
              Why does a top 5% resume land interviews while a typical resume gets filtered? Below are the exact mechanical transformations that turn a rejected bullet into an offer-winning signal.
            </p>

            <div className="space-y-6">
              {diagnostics.whatMakesItGood.map((rule) => (
                <div 
                  key={rule.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200 hover:border-indigo-400/60 transition-all shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <h4 className="text-base font-bold text-neutral-950 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-700" />
                      {rule.ruleName}
                    </h4>
                    <span className="text-xs font-mono font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200 self-start sm:self-auto">
                      {rule.pointUplift} Uplift
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                    {rule.principleDescription}
                  </p>

                  {/* Comparative Side-by-Side: Bad vs Good (Stark Inverted Contrast with Subtle Accent Tints) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Bad Example */}
                    <div className="p-4 rounded-xl bg-rose-50/30 border border-rose-200/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-rose-800 font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            What Makes It Bad (Vague / Passive)
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-800 font-mono italic leading-relaxed">
                          &ldquo;{rule.badSnippet}&rdquo;
                        </p>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-rose-200/60 text-[11px] text-rose-700">
                        ✖ No scale, no metric, no technical mechanism.
                      </div>
                    </div>

                    {/* Good Example (Standout Obsidian Card with Emerald/Indigo Accents) */}
                    <div className="p-4 rounded-xl bg-neutral-950 text-white border border-neutral-800 hover:border-emerald-500/50 flex flex-col justify-between relative group shadow-sm">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            What Makes It Good (High Impact Signal)
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(rule.goodSnippet, rule.id)}
                            className="text-[11px] font-mono text-black hover:bg-neutral-100 flex items-center gap-1 bg-white px-2 py-0.5 rounded transition-all cursor-pointer font-semibold"
                            title="Copy Good Bullet"
                          >
                            {copiedId === rule.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-black" />
                                <span>Copy Formula</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-white font-mono leading-relaxed font-medium">
                          &ldquo;{rule.goodSnippet}&rdquo;
                        </p>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-neutral-800 text-[11px] text-emerald-300/90">
                        ✔ Clear metric, concrete architecture, and verified ownership.
                      </div>
                    </div>
                  </div>

                  {/* Why it works & Recruiter mental model */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
                    <div>
                      <span className="font-semibold text-black block mb-0.5">Why This Transformation Works:</span>
                      <p className="text-neutral-600 leading-relaxed">{rule.whyThisWorks}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-black block mb-0.5">Recruiter Mental Model:</span>
                      <p className="text-neutral-600 leading-relaxed">{rule.recruiterMentalModel}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Guidance Bar */}
      <div className="mt-8 p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-700 relative z-10">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <HelpCircle className="w-4 h-4 text-black flex-shrink-0" />
          <span>
            <strong>Pro Tip:</strong> Apply the <strong>&ldquo;What Makes It Good&rdquo;</strong> formula to every single project bullet on your resume before submitting to {targetCompany}.
          </span>
        </div>

        {onOpenCoach && (
          <button
            type="button"
            onClick={() => onOpenCoach(`Walk me through rewriting my worst bullet into a 'What Makes It Good' bullet for ${targetRole}.`)}
            className="flex-shrink-0 text-xs font-bold text-black hover:underline flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Rewrite My Bullets with AI Coach</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </section>
  );
};
