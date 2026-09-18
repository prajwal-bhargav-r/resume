import React from "react";
import { Upload, Target, BrainCircuit, Map, ArrowRight } from "lucide-react";

interface HowItWorksProps {
  onStartClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartClick }) => {
  const steps = [
    {
      number: "01",
      title: "Upload",
      subtitle: "Upload your latest resume.",
      description: "Drop your PDF or DOCX file, or paste your resume content. We parse your technical skills, projects, and work history cleanly.",
      icon: Upload,
      accentColor: "from-[#D4AF37] to-[#B8860B]",
      borderGlow: "border-[#D4AF37]/40",
      iconColor: "text-[#F5D061]",
      tag: "Source Input"
    },
    {
      number: "02",
      title: "Choose Your Target",
      subtitle: "Tell us the role and company you're preparing for.",
      description: "Select from curated high-demand engineering tracks or enter a custom target. Specify your current experience stage.",
      icon: Target,
      accentColor: "from-[#B8860B] to-[#D4AF37]",
      borderGlow: "border-[#D4AF37]/40",
      iconColor: "text-[#D4AF37]",
      tag: "Goal Setting"
    },
    {
      number: "03",
      title: "AI Analysis",
      subtitle: "AI compares your current profile with the target requirements.",
      description: "Identifies your proven strengths, critical missing production tools, vague project bullets, and ATS readability friction points.",
      icon: BrainCircuit,
      accentColor: "from-[#D4AF37] to-[#F5D061]",
      borderGlow: "border-[#D4AF37]/50",
      iconColor: "text-[#F5D061]",
      tag: "Deep Audit"
    },
    {
      number: "04",
      title: "Get Your Roadmap",
      subtitle: "Receive a personalized list of improvements and skills to develop.",
      description: "Walk away with a concrete 5-phase career roadmap, specific production project architectures, and instant bullet point rewrites.",
      icon: Map,
      accentColor: "from-[#F5D061] to-[#D4AF37]",
      borderGlow: "border-emerald-500/40",
      iconColor: "text-emerald-400",
      tag: "Action Plan"
    }
  ];

  return (
    <section id="how-it-works-section" className="py-20 md:py-28 relative bg-black/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-[#D4AF37]/30 text-xs font-mono font-semibold text-[#F5D061] uppercase tracking-wider mb-4">
            <span>Process & Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-heading">
            How ResumeLens AI Works
          </h2>
          <p className="text-base sm:text-lg text-[#A1A1AA] mt-4 leading-relaxed">
            From raw resume to customized engineering roadmap in four structured, transparent steps.
          </p>
        </div>

        {/* Desktop Horizontal Timeline / Mobile Vertical Timeline */}
        <div className="relative">
          
          {/* Desktop Timeline Connecting Gradient Bar */}
          <div className="hidden lg:block absolute top-[52px] left-[6%] right-[6%] h-[2px] bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-emerald-400 z-0 opacity-40" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  id={`how-it-works-step-${step.number}`}
                  className="flex flex-col p-6 rounded-2xl glass-panel glass-panel-hover border border-[#D4AF37]/20 bg-black/80 relative"
                >
                  {/* Step Indicator Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-black border ${step.borderGlow} flex items-center justify-center shadow-lg shadow-black`}>
                      <Icon className={`w-6 h-6 ${step.iconColor}`} />
                    </div>
                    <span className="text-2xl font-extrabold font-mono text-[#D4AF37]/30 tracking-wider">
                      {step.number}
                    </span>
                  </div>

                  {/* Step Content */}
                  <div className="mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#F5D061] bg-[#D4AF37]/15 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                      {step.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-2 font-heading">
                    {step.title}
                  </h3>

                  <p className="text-sm font-semibold text-[#F5D061] mt-1">
                    "{step.subtitle}"
                  </p>

                  <p className="text-xs text-[#A1A1AA] mt-3 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-black via-[#12100A] to-black border border-[#D4AF37]/35 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-black">
          <div className="text-center md:text-left">
            <h4 className="text-xl font-bold text-white font-heading">
              Ready to discover your career readiness?
            </h4>
            <p className="text-sm text-[#A1A1AA] mt-1">
              Start with a sample student profile or upload your personal resume now.
            </p>
          </div>
          <button
            id="how-it-works-cta-btn"
            onClick={onStartClick}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-lg shadow-[#D4AF37]/25 hover:brightness-110 active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <span>Launch Analysis</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>

      </div>
    </section>
  );
};
