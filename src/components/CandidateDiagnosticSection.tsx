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
  BookOpen
} from "lucide-react";

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
  experienceLevel,
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
      className="p-6 sm:p-10 rounded-3xl glass-panel border border-[#D4AF37]/30 bg-black shadow-2xl shadow-black relative overflow-hidden"
    >
      {/* Background Accent Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#B8860B]/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 mb-8 border-b border-[#D4AF37]/20 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#F5D061] bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
              Candidate 360° Diagnostic
            </span>
            <span className="text-xs font-mono text-[#FAF9F6] bg-black px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
              Strengths, Red Flags & Transformation Blueprint
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FAF9F6] tracking-tight font-heading">
            Profile Breakdown: What&apos;s Good, What&apos;s Bad & What Makes It Great
          </h2>
          <p className="text-sm text-[#E2E2DE] mt-1.5 max-w-3xl leading-relaxed">
            Direct recruiter audit calibrated against <span className="text-[#F5D061] font-semibold">{targetRole}</span> hiring expectations at <span className="text-[#FAF9F6] font-semibold">{targetCompany}</span>.
          </p>
        </div>

        {onOpenCoach && (
          <button
            type="button"
            onClick={() => onOpenCoach(`Provide a customized action plan to fix what's bad in my resume and elevate it to what makes it good for ${targetRole} at ${targetCompany}.`)}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-black text-[#F5D061] hover:text-[#FAF9F6] border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-black/90 transition-all self-start lg:self-auto shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Consult Coach on Diagnostics</span>
          </button>
        )}
      </div>

      {/* 4 Interactive Pillar Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 relative z-10">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 border ${
            activeTab === "all"
              ? "bg-[#D4AF37]/25 text-[#F5D061] border-[#D4AF37] shadow-md shadow-[#D4AF37]/15 font-bold"
              : "bg-black text-[#E2E2DE] border-[#D4AF37]/25 hover:text-[#FAF9F6] hover:border-[#D4AF37]/50"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All 4 Dimensions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("good")}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 border ${
            activeTab === "good"
              ? "bg-[#D4AF37]/25 text-[#F5D061] border-[#D4AF37] shadow-md shadow-[#D4AF37]/15 font-bold"
              : "bg-black text-[#E2E2DE] border-[#D4AF37]/25 hover:text-[#F5D061] hover:border-[#D4AF37]/50"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>1. What He Is Good In ({diagnostics.goodSignals.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bad")}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 border ${
            activeTab === "bad"
              ? "bg-[#D4AF37]/25 text-[#F5D061] border-[#D4AF37] shadow-md shadow-[#D4AF37]/15 font-bold"
              : "bg-black text-[#E2E2DE] border-[#D4AF37]/25 hover:text-[#F5D061] hover:border-[#D4AF37]/50"
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>2. What He Is Bad In ({diagnostics.badPatterns.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("work_on")}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 border ${
            activeTab === "work_on"
              ? "bg-[#D4AF37]/25 text-[#F5D061] border-[#D4AF37] shadow-md shadow-[#D4AF37]/15 font-bold"
              : "bg-black text-[#E2E2DE] border-[#D4AF37]/25 hover:text-[#F5D061] hover:border-[#D4AF37]/50"
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>3. What He Should Work On ({diagnostics.workOnItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("what_makes_it_good")}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 border ${
            activeTab === "what_makes_it_good"
              ? "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black border-[#D4AF37] shadow-md shadow-[#D4AF37]/20 font-bold"
              : "bg-black text-[#E2E2DE] border-[#D4AF37]/25 hover:text-[#F5D061] hover:border-[#D4AF37]/50"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
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
            className="p-6 sm:p-7 rounded-2xl bg-black border-2 border-[#D4AF37]/35 shadow-xl shadow-black"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[#D4AF37]/25">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-black border border-[#D4AF37]/45 flex items-center justify-center text-[#D4AF37]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#F5D061] font-bold uppercase tracking-wider">
                      Pillar 01 — Positive Signals
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-[#FAF9F6] border border-[#D4AF37]/35">
                      Verified Assets
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#FAF9F6] font-heading">
                    What He Is Good In
                  </h3>
                </div>
              </div>

              <div className="text-xs font-mono text-[#FAF9F6] flex items-center gap-1.5 self-start sm:self-auto bg-black px-3 py-1.5 rounded-lg border border-[#D4AF37]/35">
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                <span>Anchors to emphasize in screening</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diagnostics.goodSignals.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 sm:p-5 rounded-xl bg-black border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-black text-[#FAF9F6] border border-[#D4AF37]/30">
                        {item.tag}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#F5D061] flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {item.scoreImpact}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-[#FAF9F6] mb-2 leading-snug">
                      {item.title}
                    </h4>

                    <div className="p-2.5 rounded-lg bg-black border border-[#D4AF37]/30 text-xs text-[#FAF9F6] mb-3 font-mono">
                      <span className="text-[#F5D061] font-semibold mr-1.5">Resume Evidence:</span>
                      {item.evidence}
                    </div>

                    <p className="text-xs text-[#E2E2DE] leading-relaxed">
                      <strong className="text-[#FAF9F6]">Recruiter Takeaway:</strong> {item.recruiterTakeaway}
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
            className="p-6 sm:p-7 rounded-2xl bg-black border-2 border-[#D4AF37]/35 shadow-xl shadow-black"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[#D4AF37]/25">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-black border border-[#D4AF37]/45 flex items-center justify-center text-[#F5D061]">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#F5D061] font-bold uppercase tracking-wider">
                      Pillar 02 — Critical Red Flags & Drag
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-[#FAF9F6] border border-[#D4AF37]/35">
                      High Rejection Risk
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#FAF9F6] font-heading">
                    What He Is Bad In (Anti-Patterns to Eliminate)
                  </h3>
                </div>
              </div>

              <div className="text-xs font-mono text-[#FAF9F6] flex items-center gap-1.5 self-start sm:self-auto bg-black px-3 py-1.5 rounded-lg border border-[#D4AF37]/35">
                <TrendingDown className="w-4 h-4 text-[#D4AF37]" />
                <span>Root cause of recruiter screen drops</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diagnostics.badPatterns.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 sm:p-5 rounded-xl bg-black border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-black text-[#F5D061] border border-[#D4AF37]/30 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-[#D4AF37]" />
                        {item.severity}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#F5D061]">
                        {item.scoreDrag}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-[#FAF9F6] mb-2 leading-snug">
                      {item.title}
                    </h4>

                    <div className="p-2.5 rounded-lg bg-black border border-[#D4AF37]/30 text-xs text-[#FAF9F6] mb-3 leading-relaxed">
                      <span className="text-[#F5D061] font-semibold mr-1.5">Identified Flaw:</span>
                      {item.flaw}
                    </div>

                    <p className="text-xs text-[#E2E2DE] leading-relaxed">
                      <strong className="text-[#FAF9F6]">Why It Hurts You:</strong> {item.whyItHurts}
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
            className="p-6 sm:p-7 rounded-2xl bg-black border-2 border-[#D4AF37]/45 shadow-xl shadow-black"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[#D4AF37]/25">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-black border border-[#D4AF37]/45 flex items-center justify-center text-[#F5D061]">
                  <Zap className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#F5D061] font-bold uppercase tracking-wider">
                      Pillar 03 — Priority Bridge Levers
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-[#FAF9F6] border border-[#D4AF37]/35">
                      Highest ROI Levers
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#FAF9F6] font-heading">
                    What He Should Work On (Action Roadmap)
                  </h3>
                </div>
              </div>

              <div className="text-xs font-mono text-[#FAF9F6] flex items-center gap-1.5 self-start sm:self-auto bg-black px-3 py-1.5 rounded-lg border border-[#D4AF37]/35">
                <Flame className="w-4 h-4 text-[#D4AF37]" />
                <span>Closes the gap to target benchmark</span>
              </div>
            </div>

            <div className="space-y-3.5">
              {diagnostics.workOnItems.map((item, idx) => (
                <div 
                  key={item.id}
                  className="p-4 sm:p-5 rounded-xl bg-black border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-black text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      0{idx + 1}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-[#FAF9F6] font-heading">
                          {item.area}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black text-[#F5D061] border border-[#D4AF37]/30">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono text-[#FAF9F6] bg-black px-2 py-0.5 rounded border border-[#D4AF37]/20">
                          ⏱ {item.timeframe}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#E2E2DE] leading-relaxed">
                        {item.specificAction}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-3 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#D4AF37]/20">
                    <span className="text-xs font-mono font-bold text-[#F5D061] bg-black px-2.5 py-1 rounded border border-[#D4AF37]/35">
                      {item.targetGain} Score Gain
                    </span>
                    {onOpenCoach && (
                      <button
                        type="button"
                        onClick={() => onOpenCoach(`How do I execute this step: "${item.area}" for ${targetRole} at ${targetCompany}?`)}
                        className="p-1.5 rounded-lg bg-black text-[#F5D061] hover:text-[#FAF9F6] border border-[#D4AF37]/35 hover:border-[#D4AF37] transition-all text-xs flex items-center gap-1"
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
            className="p-6 sm:p-7 rounded-2xl bg-black border-2 border-[#D4AF37]/50 shadow-xl shadow-[#D4AF37]/15"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[#D4AF37]/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-black shadow-md shadow-[#D4AF37]/20">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#F5D061] font-bold uppercase tracking-wider">
                      Pillar 04 — The Excellence Blueprint
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-[#FAF9F6] border border-[#D4AF37]/40">
                      Recruiter Standard
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#FAF9F6] font-heading">
                    What Makes It Good (Before vs. After Transformation Rules)
                  </h3>
                </div>
              </div>

              <div className="text-xs font-mono text-[#FAF9F6] flex items-center gap-1.5 self-start sm:self-auto bg-black px-3 py-1.5 rounded-lg border border-[#D4AF37]/35">
                <FileCheck2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Google X-Y-Z & Systems Rubric</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#E2E2DE] mb-6 leading-relaxed">
              Why does a top 5% resume land interviews while a typical resume gets filtered? Below are the exact mechanical transformations that turn a rejected bullet into an offer-winning signal.
            </p>

            <div className="space-y-6">
              {diagnostics.whatMakesItGood.map((rule) => (
                <div 
                  key={rule.id}
                  className="p-5 sm:p-6 rounded-2xl bg-black border border-[#D4AF37]/35 relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <h4 className="text-base font-bold text-[#FAF9F6] flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                      {rule.ruleName}
                    </h4>
                    <span className="text-xs font-mono font-bold text-[#F5D061] bg-black px-2.5 py-0.5 rounded border border-[#D4AF37]/35 self-start sm:self-auto">
                      {rule.pointUplift} Uplift
                    </span>
                  </div>

                  <p className="text-xs text-[#E2E2DE] mb-4 leading-relaxed">
                    {rule.principleDescription}
                  </p>

                  {/* Comparative Side-by-Side: Bad vs Good */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Bad Example */}
                    <div className="p-4 rounded-xl bg-black border border-[#D4AF37]/25 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA] font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#71717A]" />
                            What Makes It Bad (Vague / Passive)
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#FAF9F6]/80 font-mono italic leading-relaxed">
                          &ldquo;{rule.badSnippet}&rdquo;
                        </p>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-[#D4AF37]/15 text-[11px] text-[#A1A1AA]">
                        ✖ No scale, no metric, no technical mechanism.
                      </div>
                    </div>

                    {/* Good Example */}
                    <div className="p-4 rounded-xl bg-black border-2 border-[#D4AF37]/50 flex flex-col justify-between relative group">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5D061] font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                            What Makes It Good (High Impact Signal)
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(rule.goodSnippet, rule.id)}
                            className="text-[11px] font-mono text-[#FAF9F6] hover:text-[#F5D061] flex items-center gap-1 bg-black px-2 py-0.5 rounded border border-[#D4AF37]/40 transition-all"
                            title="Copy Good Bullet"
                          >
                            {copiedId === rule.id ? (
                              <>
                                <Check className="w-3 h-3 text-[#D4AF37]" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-[#D4AF37]" />
                                <span>Copy Formula</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-[#FAF9F6] font-mono leading-relaxed font-medium">
                          &ldquo;{rule.goodSnippet}&rdquo;
                        </p>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-[#D4AF37]/20 text-[11px] text-[#F5D061]">
                        ✔ Clear metric, concrete architecture, and verified ownership.
                      </div>
                    </div>
                  </div>

                  {/* Why it works & Recruiter mental model */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl bg-black border border-[#D4AF37]/25 text-xs">
                    <div>
                      <span className="font-semibold text-[#F5D061] block mb-0.5">Why This Transformation Works:</span>
                      <p className="text-[#E2E2DE] leading-relaxed">{rule.whyThisWorks}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-[#FAF9F6] block mb-0.5">Recruiter Mental Model:</span>
                      <p className="text-[#E2E2DE] leading-relaxed">{rule.recruiterMentalModel}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Guidance Bar */}
      <div className="mt-8 p-4 rounded-xl bg-black border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#E2E2DE] relative z-10">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <HelpCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
          <span>
            <strong>Pro Tip:</strong> Apply the <strong>&ldquo;What Makes It Good&rdquo;</strong> formula to every single project bullet on your resume before submitting to {targetCompany}.
          </span>
        </div>

        {onOpenCoach && (
          <button
            type="button"
            onClick={() => onOpenCoach(`Walk me through rewriting my worst bullet into a 'What Makes It Good' bullet for ${targetRole}.`)}
            className="flex-shrink-0 text-xs font-semibold text-[#D4AF37] hover:text-[#F5D061] flex items-center gap-1 transition-colors"
          >
            <span>Rewrite My Bullets with AI Coach</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </section>
  );
};
