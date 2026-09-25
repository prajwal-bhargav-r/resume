import React, { useState, useEffect } from "react";
import { CheckCircle2, Sparkles, BrainCircuit } from "lucide-react";

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
    >
      <div className="relative w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-white border border-neutral-200 shadow-2xl overflow-hidden text-center">
        
        {/* Subtle architectural grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Central Animated AI Core */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          {/* Rotating dashed ring */}
          <div 
            className="absolute inset-0 rounded-full border-2 border-dashed border-black/40 animate-spin" 
            style={{ animationDuration: '8s' }} 
          />
          <div className="absolute inset-2 rounded-full border border-neutral-300 animate-ping opacity-30" />
          
          <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl shadow-black/20">
            <BrainCircuit className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>

        {/* Target Context */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-mono text-neutral-800 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span>Auditing for {targetRole} @ {targetCompany}</span>
        </div>

        {/* Current Active Step Heading */}
        <h3 
          id="loading-current-step-text"
          className="text-2xl font-bold text-neutral-950 mb-6 font-heading min-h-[36px] transition-all"
        >
          {steps[currentStepIndex]}
        </h3>

        {/* Multi-step Progress Indicators */}
        <div className="space-y-2.5 text-left mb-6 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
          {steps.map((stepText, idx) => {
            const isFinished = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div 
                key={idx}
                className={`flex items-center gap-3 text-xs transition-colors ${
                  isFinished 
                    ? "text-emerald-700 font-medium" 
                    : isCurrent 
                    ? "text-black font-bold" 
                    : "text-neutral-400"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {isFinished ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                  )}
                </div>
                <span>{stepText}</span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden border border-neutral-200">
          <div
            className="bg-black h-full transition-all duration-500 rounded-full"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        <p className="text-[11px] font-mono text-neutral-500 mt-4">
          Synthesizing resume facts against verified industry criteria...
        </p>

      </div>
    </div>
  );
};
