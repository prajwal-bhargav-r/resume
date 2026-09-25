import React from "react";
import { 
  FileText, 
  Cpu, 
  Layers, 
  Milestone, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Search,
  Crosshair,
  TrendingUp
} from "lucide-react";

interface LandingHeroProps {
  onStartAnalysis: () => void;
  onExploreHowItWorks: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartAnalysis,
  onExploreHowItWorks,
}) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-[#FAFAFA] bg-radial-glow border-b border-neutral-200/80">
      {/* Abstract Background Architectural Grid */}
      <div className="absolute inset-0 bg-career-grid pointer-events-none opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Small Badge */}
            <div 
              id="hero-badge"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200/90 text-xs font-semibold tracking-wider uppercase text-neutral-900 mb-6 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI-POWERED <span className="font-bold text-neutral-950 underline decoration-indigo-400">CAREER GAP ANALYZER</span></span>
            </div>

            {/* Main Heading */}
            <h1 
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.12] mb-6 font-heading"
            >
              Your Resume Shows <br className="hidden sm:block" />
              <span className="text-neutral-900">
                Where You Are.
              </span>{" "}
              <br />
              <span className="text-black bg-neutral-100 px-2 py-0.5 rounded-lg border border-neutral-200 inline-block mt-1">
                We'll Show You How to Get There.
              </span>
            </h1>

            {/* Supporting Text */}
            <p 
              id="hero-supporting-text"
              className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl mb-8 font-normal"
            >
              Upload your resume, specify your target company, and receive an objective structural evaluation identifying the critical tools, deployed projects, and metric rewrites required to win the offer.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                id="hero-cta-analyze-btn"
                onClick={onStartAnalysis}
                className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold bg-black text-white hover:bg-neutral-800 shadow-md active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Analyze My Resume</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </button>

              <button
                id="hero-cta-how-it-works-btn"
                onClick={onExploreHowItWorks}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold bg-white text-neutral-900 border border-neutral-300 hover:border-black hover:bg-neutral-50 transition-all cursor-pointer shadow-xs"
              >
                <span>See How It Works</span>
              </button>
            </div>

            {/* Key feature items */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Zero fabricated vanity metrics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Grounded role benchmark rubrics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Concrete 5-phase career roadmap</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Pathway Illustration (Distinctive Obsidian Architectural Card) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div 
              id="career-pathway-visual-card"
              className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-neutral-950 text-white border border-neutral-800 relative overflow-hidden shadow-2xl"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider text-neutral-200 uppercase">
                    Career Gap Engine
                  </span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400">Live Pathway</span>
              </div>

              {/* Connecting vertical line container */}
              <div className="relative flex flex-col gap-5 pl-2">
                {/* Connecting Line in Stark White/Gray */}
                <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-neutral-800" />

                {/* Node 1: Resume */}
                <div className="relative flex items-center gap-3.5 group">
                  <div className="relative z-10 w-11 h-11 rounded-xl bg-black border border-neutral-800 flex items-center justify-center text-white shadow-md">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">01. Resume</span>
                      <span className="text-[10px] text-blue-300 font-mono bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800/80">Current State</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">Parsed projects, coursework, and technical skills</p>
                  </div>
                </div>

                {/* Node 2: AI Analysis */}
                <div className="relative flex items-center gap-3.5 group">
                  <div className="relative z-10 w-11 h-11 rounded-xl bg-black border border-neutral-800 flex items-center justify-center text-white shadow-md">
                    <Cpu className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">02. Benchmark</span>
                      <span className="text-[10px] text-indigo-300 font-mono bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-800/80">Target Match</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">Role requirements vs profile depth matrix</p>
                  </div>
                </div>

                {/* Node 3: Skill Gap */}
                <div className="relative flex items-center gap-3.5 group">
                  <div className="relative z-10 w-11 h-11 rounded-xl bg-black border border-neutral-800 flex items-center justify-center text-white shadow-md">
                    <Layers className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">03. Skill Gap</span>
                      <span className="text-[10px] text-amber-300 font-mono bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/80">Deficits</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">Identified missing tools, deployment & evidence</p>
                  </div>
                </div>

                {/* Node 4: Career Roadmap */}
                <div className="relative flex items-center gap-3.5 group">
                  <div className="relative z-10 w-11 h-11 rounded-xl bg-white text-black flex items-center justify-center shadow-lg ring-2 ring-emerald-400/80">
                    <Milestone className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-white text-black border border-neutral-200 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-black uppercase tracking-wider font-mono">04. Roadmap</span>
                      <span className="text-[10px] text-emerald-800 font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 font-bold">Actionable</span>
                    </div>
                    <p className="text-xs text-neutral-700 mt-0.5 font-medium">Phase-by-phase learning, projects & rewrites</p>
                  </div>
                </div>

              </div>

              {/* Bottom live indicator */}
              <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span className="text-neutral-300">Objective Diagnostics</span>
                </div>
                <span className="font-mono text-emerald-400 font-medium">96% Grounded</span>
              </div>
            </div>
          </div>

        </div>

        {/* Below Hero: 3 Feature Cards */}
        <div 
          id="hero-three-pillars"
          className="mt-16 md:mt-24 pt-10 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-blue-400/60 transition-all shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-950 font-heading">Resume Analysis</h3>
              <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                Deep structural and technical inspection of project descriptions, metrics, and bullet strength.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-amber-400/60 transition-all shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
              <Crosshair className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-950 font-heading">Skill Gap Detection</h3>
              <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                Objective comparison against target role requirements and publicly documented industry stacks.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-emerald-400/60 transition-all shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-950 font-heading">Personalized Roadmaps</h3>
              <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                Step-by-step 5-phase career plan detailing skills to develop, production projects, and tailored rewrites.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
