import React, { useState, useEffect } from "react";
import { Cpu, CheckCircle2, Sparkles, BrainCircuit } from "lucide-react";

interface LoadingAnalysisModalProps {
  isOpen: boolean;
  isReady?: boolean;
  targetRole: string;
  targetCompany: string;
  onComplete: () => void;
}

export const LoadingAnalysisModal: React.FC<LoadingAnalysisModalProps> = ({
  isOpen,
  isReady = false,
  targetRole,
  targetCompany,
  onComplete,
}) => {
  const steps = [
    "Reading your resume...",
    "Identifying skills...",
    "Mapping your experience...",
    "Comparing with your target role...",
    "Building your improvement roadmap...",
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    // Step progression timer
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 550);

    return () => clearInterval(interval);
  }, [isOpen, steps.length]);

  // When reached final step and isReady is true, trigger onComplete
  useEffect(() => {
    if (!isOpen) return;

    if (currentStepIndex >= steps.length - 1 && isReady) {
      const timer = setTimeout(() => {
        onComplete();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentStepIndex, isReady, steps.length, onComplete]);

  // Safety fallback: if 11s elapses, complete anyway
  useEffect(() => {
    if (!isOpen) return;
    const safetyTimer = setTimeout(() => {
      onComplete();
    }, 11000);
    return () => clearTimeout(safetyTimer);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div 
      id="analysis-loading-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
    >
      <div className="relative w-full max-w-lg p-8 rounded-3xl glass-panel border border-[#D4AF37]/40 bg-black/95 shadow-2xl shadow-black overflow-hidden text-center">
        
        {/* Subtle Background Gold Accents */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#B8860B]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Central Animated AI Core */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          {/* Rotating halo */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4AF37]/50 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="absolute inset-2 rounded-full border border-[#F5D061]/40 animate-ping opacity-25" />
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-black shadow-lg shadow-[#D4AF37]/30">
            <BrainCircuit className="w-8 h-8 text-black animate-pulse" />
          </div>
        </div>

        {/* Target Context */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-[#D4AF37]/30 text-xs font-mono text-[#F5D061] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Auditing for {targetRole} @ {targetCompany}</span>
        </div>

        {/* Current Active Step Heading */}
        <h3 
          id="loading-current-step-text"
          className="text-2xl font-bold text-white mb-6 font-heading min-h-[36px] transition-all"
        >
          {steps[currentStepIndex]}
        </h3>

        {/* Multi-step Progress Indicators */}
        <div className="space-y-2.5 text-left mb-6 bg-black/70 p-4 rounded-2xl border border-[#D4AF37]/20">
          {steps.map((stepText, idx) => {
            const isFinished = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div 
                key={idx}
                className={`flex items-center gap-3 text-xs transition-colors ${
                  isFinished 
                    ? "text-emerald-400 font-medium" 
                    : isCurrent 
                    ? "text-[#F5D061] font-semibold" 
                    : "text-[#71717A]"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {isFinished ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F5D061] animate-ping" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#27272A]" />
                  )}
                </div>
                <span>{stepText}</span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black rounded-full h-2 overflow-hidden border border-[#D4AF37]/25">
          <div
            className="bg-gradient-to-r from-[#D4AF37] via-[#F5D061] to-[#B8860B] h-full transition-all duration-500 rounded-full"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        <p className="text-[11px] font-mono text-[#71717A] mt-4">
          Synthesizing resume facts against verified industry criteria...
        </p>

      </div>
    </div>
  );
};
