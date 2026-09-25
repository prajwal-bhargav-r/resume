import React from "react";
import { Upload, Target, BrainCircuit, Map, ArrowRight } from "lucide-react";

interface HowItWorksProps {
  onStartClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartClick }) => {
  const steps = [
    {
      number: "01",
      title: "Upload Resume",
      subtitle: "Drop your PDF or paste your text.",
      description: "We parse your technical stack, projects, coursework, and work history cleanly with zero automated friction.",
      icon: Upload,
      tag: "Source Input"
    },
    {
      number: "02",
      title: "Target Definition",
      subtitle: "Select role and target company.",
      description: "Choose from high-demand engineering tracks or enter a custom target. Calibrate against actual hiring benchmarks.",
      icon: Target,
      tag: "Goal Setting"
    },
    {
      number: "03",
      title: "AI Gap Diagnosis",
      subtitle: "Deep profile alignment analysis.",
      description: "Identifies your proven strengths, missing production tools, vague project bullet points, and ATS readability score.",
      icon: BrainCircuit,
      tag: "Audit"
    },
    {
      number: "04",
      title: "Strategic Roadmap",
      subtitle: "Personalized milestone plan.",
      description: "Walk away with a concrete 5-phase career plan, production portfolio project specifications, and bullet rewrites.",
      icon: Map,
      tag: "Action Plan"
    }
  ];

  return (
    <section id="how-it-works-section" className="py-20 md:py-28 relative bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-mono font-semibold text-neutral-800 uppercase tracking-wider mb-4">
            <span>Process & Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight font-heading">
            How Resume Analyzer Works
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 mt-4 leading-relaxed">
            From raw candidate resume to customized engineering roadmap in four structured, transparent steps.
          </p>
        </div>

        {/* Desktop Horizontal Timeline / Mobile Vertical Timeline */}
        <div className="relative">
          
          {/* Desktop Timeline Connecting Bar */}
          <div className="hidden lg:block absolute top-[52px] left-[6%] right-[6%] h-[2px] bg-neutral-200 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              const colorStyles = 
                step.number === "01" ? { tag: "text-blue-800 bg-blue-50 border-blue-200", hover: "hover:border-blue-400" } :
                step.number === "02" ? { tag: "text-indigo-800 bg-indigo-50 border-indigo-200", hover: "hover:border-indigo-400" } :
                step.number === "03" ? { tag: "text-amber-800 bg-amber-50 border-amber-200", hover: "hover:border-amber-400" } :
                { tag: "text-emerald-800 bg-emerald-50 border-emerald-200", hover: "hover:border-emerald-400" };

              return (
                <div
                  key={step.number}
                  id={`how-it-works-step-${step.number}`}
                  className={`flex flex-col p-6 rounded-2xl bg-[#FAFAFA] border border-neutral-200 ${colorStyles.hover} transition-all shadow-xs relative`}
                >
                  {/* Step Indicator Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-extrabold font-mono text-neutral-300 tracking-wider">
                      {step.number}
                    </span>
                  </div>

                  {/* Step Content */}
                  <div className="mb-2">
                    <span className={`text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border font-semibold ${colorStyles.tag}`}>
                      {step.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-950 mt-2 font-heading">
                    {step.title}
                  </h3>

                  <p className="text-xs font-semibold text-neutral-700 mt-1">
                    "{step.subtitle}"
                  </p>

                  <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Callout Banner (Architectural Obsidian Card) */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-neutral-950 text-white border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-center md:text-left">
            <h4 className="text-xl sm:text-2xl font-bold text-white font-heading">
              Ready to discover your career readiness?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 max-w-xl leading-relaxed">
              Start with a sample student profile or upload your personal resume now to get your score and gap analysis.
            </p>
          </div>
          <button
            id="how-it-works-cta-btn"
            onClick={onStartClick}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white text-black hover:bg-neutral-100 shadow-md active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
          >
            <span>Launch Analysis</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>

      </div>
    </section>
  );
};
