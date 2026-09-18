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
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-black bg-radial-glow">
      {/* Abstract Background Grid & Warm Gold Ambience on Pure Black */}
      <div className="absolute inset-0 bg-career-grid pointer-events-none opacity-90" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#D4AF37]/12 via-[#B8860B]/6 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Small Badge */}
            <div 
              id="hero-badge"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black border border-[#D4AF37]/45 text-xs font-semibold tracking-wider uppercase text-[#F5D061] mb-6 shadow-sm shadow-[#D4AF37]/15"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[#FAF9F6]">AI-POWERED <span className="text-[#F5D061]">CAREER GAP ANALYZER</span></span>
            </div>

            {/* Main Heading */}
            <h1 
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FAF9F6] leading-[1.12] mb-6 font-heading"
            >
              Your Resume Shows <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FAF9F6] via-[#E2E2DE] to-[#D4D4D8]">
                Where You Are.
              </span>{" "}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D061] via-[#E6CA65] to-[#D4AF37]">
                We'll Show You How to Get There.
              </span>
            </h1>

            {/* Supporting Text */}
            <p 
              id="hero-supporting-text"
              className="text-lg sm:text-xl text-[#E2E2DE] leading-relaxed max-w-2xl mb-8"
            >
              Upload your resume, choose your target role and company, and let AI identify the skills, experience and projects you need to become a stronger candidate.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                id="hero-cta-analyze-btn"
                onClick={onStartAnalysis}
                className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-[#D4AF37] via-[#F5D061] to-[#B8860B] text-black shadow-lg shadow-[#D4AF37]/25 hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <span>Analyze My Resume</span>
                <ArrowRight className="w-5 h-5 text-black" />
              </button>

              <button
                id="hero-cta-how-it-works-btn"
                onClick={onExploreHowItWorks}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold bg-black text-[#FAF9F6] border border-[#D4AF37]/35 hover:border-[#D4AF37] hover:bg-black/90 transition-all"
              >
                <span>See How It Works</span>
              </button>
            </div>

            {/* Key feature pills */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#E2E2DE]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#FAF9F6]">Zero fabricated metrics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E6CA65]" />
                <span className="text-[#FAF9F6]">Transparent role & public research</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#FAF9F6]">Actionable 5-phase career roadmap</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Pathway Illustration */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div 
              id="career-pathway-visual-card"
              className="w-full max-w-md p-6 rounded-2xl glass-panel border border-[#D4AF37]/30 bg-black/90 relative overflow-hidden shadow-2xl shadow-black"
            >
              {/* Subtle card glow header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#D4AF37]/20">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                  <span className="text-xs font-mono font-bold tracking-wider text-[#F5D061] uppercase">
                    Career Gap Visualization Engine
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#FAF9F6]/60">Real-Time Flow</span>
              </div>

              {/* Connecting vertical line container */}
              <div className="relative flex flex-col gap-6 pl-3">
                {/* Connecting Line in Gold */}
                <div className="absolute left-[31px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#D4AF37] via-[#F5D061] to-[#996515] opacity-60" />

                {/* Node 1: Resume */}
                <div className="relative flex items-center gap-4 group">
                  <div className="relative z-10 w-12 h-12 rounded-xl bg-black border border-[#D4AF37]/45 flex items-center justify-center text-[#D4AF37] shadow-md shadow-black group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-black border border-[#D4AF37]/25">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#FAF9F6] uppercase tracking-wider font-mono">01. Resume</span>
                      <span className="text-[10px] text-[#F5D061] font-mono bg-[#D4AF37]/15 px-1.5 py-0.5 rounded border border-[#D4AF37]/30">Current State</span>
                    </div>
                    <p className="text-xs text-[#E2E2DE] mt-0.5">Parsed projects, coursework, and technical skills</p>
                  </div>
                </div>

                {/* Node 2: AI Analysis */}
                <div className="relative flex items-center gap-4 group">
                  <div className="relative z-10 w-12 h-12 rounded-xl bg-black border border-[#D4AF37]/45 flex items-center justify-center text-[#F5D061] shadow-md shadow-black group-hover:scale-105 transition-transform">
                    <Cpu className="w-6 h-6 text-[#F5D061]" />
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-black border border-[#D4AF37]/25">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#FAF9F6] uppercase tracking-wider font-mono">02. AI Analysis</span>
                      <span className="text-[10px] text-[#D4AF37] font-mono bg-[#D4AF37]/15 px-1.5 py-0.5 rounded border border-[#D4AF37]/30">Target Match</span>
                    </div>
                    <p className="text-xs text-[#E2E2DE] mt-0.5">Role requirements vs profile depth matrix</p>
                  </div>
                </div>

                {/* Node 3: Skill Gap */}
                <div className="relative flex items-center gap-4 group">
                  <div className="relative z-10 w-12 h-12 rounded-xl bg-black border border-[#D4AF37]/45 flex items-center justify-center text-[#E5C158] shadow-md shadow-black group-hover:scale-105 transition-transform">
                    <Layers className="w-6 h-6 text-[#E5C158]" />
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-black border border-[#D4AF37]/25">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#FAF9F6] uppercase tracking-wider font-mono">03. Skill Gap</span>
                      <span className="text-[10px] text-[#F5D061] font-mono bg-[#D4AF37]/15 px-1.5 py-0.5 rounded border border-[#D4AF37]/30">Deficits</span>
                    </div>
                    <p className="text-xs text-[#E2E2DE] mt-0.5">Identified missing tools, deployment & evidence</p>
                  </div>
                </div>

                {/* Node 4: Career Roadmap */}
                <div className="relative flex items-center gap-4 group">
                  <div className="relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-black shadow-lg shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform">
                    <Milestone className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-black border border-[#D4AF37]/45">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#FAF9F6] uppercase tracking-wider font-mono">04. Career Roadmap</span>
                      <span className="text-[10px] text-[#D4AF37] font-mono bg-[#D4AF37]/20 px-1.5 py-0.5 rounded border border-[#D4AF37]/30 font-bold">Actionable</span>
                    </div>
                    <p className="text-xs text-[#F5D061] mt-0.5">Phase-by-phase learning, projects & rewrites</p>
                  </div>
                </div>

              </div>

              {/* Bottom live indicator */}
              <div className="mt-6 pt-4 border-t border-[#D4AF37]/20 flex items-center justify-between text-[11px] text-[#E2E2DE]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] inline-block" />
                  <span className="text-[#FAF9F6]">Interactive Guidance Engine</span>
                </div>
                <span className="font-mono text-[#F5D061]">Precision Analysis</span>
              </div>
            </div>
          </div>

        </div>

        {/* Below Hero: 3 Simple Pillars */}
        <div 
          id="hero-three-pillars"
          className="mt-16 md:mt-24 pt-10 border-t border-[#D4AF37]/20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Pillar 1 */}
          <div className="p-6 rounded-xl glass-panel glass-panel-hover border border-[#D4AF37]/20 bg-black flex items-start gap-4">
            <div className="p-3 rounded-xl bg-black border border-[#D4AF37]/35 text-[#D4AF37]">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#FAF9F6] font-heading">Resume Analysis</h3>
              <p className="text-sm text-[#E2E2DE] mt-1">
                Deep structural and technical inspection of project descriptions, metrics, and bullet strength.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-xl glass-panel glass-panel-hover border border-[#D4AF37]/20 bg-black flex items-start gap-4">
            <div className="p-3 rounded-xl bg-black border border-[#D4AF37]/35 text-[#E5C158]">
              <Crosshair className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#FAF9F6] font-heading">Skill Gap Detection</h3>
              <p className="text-sm text-[#E2E2DE] mt-1">
                Objective comparison against target role requirements and publicly documented industry stacks.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-xl glass-panel glass-panel-hover border border-[#D4AF37]/20 bg-black flex items-start gap-4">
            <div className="p-3 rounded-xl bg-black border border-[#D4AF37]/35 text-[#F5D061]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#FAF9F6] font-heading">Personalized Roadmaps</h3>
              <p className="text-sm text-[#E2E2DE] mt-1">
                Step-by-step 5-phase career plan detailing skills to develop, production projects, and tailored rewrites.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
