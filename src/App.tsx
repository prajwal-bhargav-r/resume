import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { LandingHero } from "./components/LandingHero";
import { HowItWorks } from "./components/HowItWorks";
import { AnalysisForm } from "./components/AnalysisForm";
import { LoadingAnalysisModal } from "./components/LoadingAnalysisModal";
import { ReportDashboard } from "./components/ReportDashboard";
import { CareerCoachChat } from "./components/CareerCoachChat";
import { Footer } from "./components/Footer";
import { AnalysisInput, CareerGapReport } from "./types";
import { generateAnalysisReport, generateGroundedAnalysis } from "./services/analysisEngine";
import { SAMPLE_RESUMES } from "./data/sampleResumes";
import { validateResumeContent } from "./utils/resumeValidator";
import { Sparkles, Bot, ArrowRight, FileCheck } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "how-it-works" | "analyze" | "dashboard">("home");
  const [report, setReport] = useState<CareerGapReport | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
  const [showLoadingModal, setShowLoadingModal] = useState<boolean>(false);
  const [pendingReport, setPendingReport] = useState<CareerGapReport | null>(null);
  const [currentAnalysisInput, setCurrentAnalysisInput] = useState<AnalysisInput | null>(null);

  // Chat Coach Drawer state
  const [isCoachOpen, setIsCoachOpen] = useState<boolean>(false);
  const [coachInitialQuestion, setCoachInitialQuestion] = useState<string | undefined>(undefined);

  const handleStartAnalysis = () => {
    setActiveTab("analyze");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExploreHowItWorks = () => {
    setActiveTab("how-it-works");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSubmit = async (input: AnalysisInput) => {
    // Validate that the submitted input is a genuine resume
    const check = validateResumeContent(input.resumeText, input.fileName);
    if (!check.isResume) {
      console.warn("Analysis rejected: uploaded document is not a genuine resume");
      return;
    }

    setCurrentAnalysisInput(input);
    setPendingReport(null);
    setIsLoadingAnalysis(true);
    setShowLoadingModal(true);

    try {
      // Trigger analysis generation (handles Gemini API or fallback seamlessly)
      const generated = await generateAnalysisReport(input);
      setPendingReport(generated);
    } catch (err) {
      console.warn("Report generation error, applying grounded fallback:", err);
      const fallbackReport = generateGroundedAnalysis(input);
      setPendingReport(fallbackReport);
    }
  };

  const handleLoadingModalComplete = () => {
    setShowLoadingModal(false);
    setIsLoadingAnalysis(false);
    const finalReport = pendingReport || (currentAnalysisInput ? generateGroundedAnalysis(currentAnalysisInput) : null);
    if (finalReport) {
      setReport(finalReport);
      setActiveTab("dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleOpenCoach = (initialQuestion?: string) => {
    setCoachInitialQuestion(initialQuestion);
    setIsCoachOpen(true);
  };

  // Quick helper to load sample report for immediate inspection
  const handleLoadDemoReport = async () => {
    const sample = SAMPLE_RESUMES[0];
    const demoInput: AnalysisInput = {
      resumeText: sample.text,
      fileName: sample.fileName,
      fileSize: "48 KB",
      targetRole: sample.roleHint,
      targetCompany: sample.companyHint,
      experienceLevel: sample.level,
      userGoals: "I want to become a machine learning engineer and I'm unsure whether my projects are strong enough.",
    };
    setCurrentAnalysisInput(demoInput);
    setPendingReport(null);
    setIsLoadingAnalysis(true);
    setShowLoadingModal(true);
    try {
      const demoReport = await generateAnalysisReport(demoInput);
      setPendingReport(demoReport);
    } catch {
      setPendingReport(generateGroundedAnalysis(demoInput));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-[#FAF9F6] font-sans selection:bg-[#D4AF37]/30 selection:text-[#FAF9F6]">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasReport={report !== null}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === "home" && (
          <div>
            <LandingHero
              onStartAnalysis={handleStartAnalysis}
              onExploreHowItWorks={handleExploreHowItWorks}
            />

            {/* Quick Demo Launch Strip */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 -mt-4">
              <div className="p-4 rounded-2xl glass-panel border border-[#D4AF37]/30 bg-gradient-to-r from-black/90 via-[#0C0C0C]/90 to-black/90 shadow-xl shadow-black/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="p-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Want to see a real report right now?</h4>
                    <p className="text-xs text-[#A1A1AA]">
                      Preview the Machine Learning Engineer report for an ML student targeting NVIDIA.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="home-preview-demo-report-btn"
                  onClick={handleLoadDemoReport}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B8860B] hover:brightness-110 text-black shadow-md shadow-[#D4AF37]/20 transition-all whitespace-nowrap"
                >
                  <span>Launch Live Demo Report</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
            </div>

            <HowItWorks onStartClick={handleStartAnalysis} />
          </div>
        )}

        {activeTab === "how-it-works" && (
          <div className="pt-8">
            <HowItWorks onStartClick={handleStartAnalysis} />
          </div>
        )}

        {activeTab === "analyze" && (
          <AnalysisForm
            onSubmit={handleFormSubmit}
            isLoading={isLoadingAnalysis}
          />
        )}

        {activeTab === "dashboard" && report && (
          <ReportDashboard
            report={report}
            onReanalyze={() => setActiveTab("analyze")}
            onOpenCoach={handleOpenCoach}
          />
        )}

        {/* Fallback if user clicked dashboard before analyzing */}
        {activeTab === "dashboard" && !report && (
          <div className="py-24 text-center max-w-lg mx-auto px-4">
            <div className="w-16 h-16 rounded-2xl bg-black/80 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-6 text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10">
              <Sparkles className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h2 className="text-2xl font-bold text-white font-heading">No Active Report Yet</h2>
            <p className="text-sm text-[#A1A1AA] mt-2 mb-6">
              Upload your resume and select a target company to generate your career gap analysis and roadmap.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setActiveTab("analyze")}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B8860B] text-black hover:brightness-110 shadow-md shadow-[#D4AF37]/20 transition-all"
              >
                Upload & Analyze
              </button>
              <button
                onClick={handleLoadDemoReport}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-black/60 border border-[#D4AF37]/30 text-[#D4D4D8] hover:text-[#D4AF37] hover:border-[#D4AF37]/60 transition-all"
              >
                Load Demo Profile
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Step-by-Step Loading Modal */}
      <LoadingAnalysisModal
        isOpen={showLoadingModal}
        isReady={pendingReport !== null}
        targetRole={currentAnalysisInput?.targetRole || "Target Role"}
        targetCompany={currentAnalysisInput?.targetCompany || "Target Company"}
        onComplete={handleLoadingModalComplete}
      />

      {/* Floating AI Career Coach Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="floating-career-ai-btn"
          onClick={() => setIsCoachOpen(!isCoachOpen)}
          className="group relative flex items-center gap-2.5 px-5 py-3 rounded-full bg-black/90 backdrop-blur-xl border border-[#D4AF37]/60 text-[#F5D061] font-semibold text-xs sm:text-sm shadow-2xl shadow-black hover:border-[#D4AF37] hover:bg-[#121212] hover:scale-105 active:scale-95 transition-all ring-1 ring-[#D4AF37]/20"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]" />
          </span>
          <Bot className="w-4 h-4 text-[#D4AF37]" />
          <span>Ask Career AI</span>
        </button>
      </div>

      {/* Career Coach Chat Panel */}
      <CareerCoachChat
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        report={report}
        initialQuestion={coachInitialQuestion}
      />

      {/* Comprehensive Footer */}
      <Footer onNavClick={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }} />
    </div>
  );
}
