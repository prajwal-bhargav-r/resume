import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  FileText, 
  Trash2, 
  Check, 
  Search, 
  Sparkles, 
  Briefcase, 
  Building2, 
  UserCheck, 
  HelpCircle,
  AlertCircle,
  FileCheck
} from "lucide-react";
import { AnalysisInput, ExperienceLevel } from "../types";
import { TARGET_ROLES, TARGET_COMPANIES } from "../data/targetRolesAndCompanies";
import { SAMPLE_RESUMES } from "../data/sampleResumes";

interface AnalysisFormProps {
  onSubmit: (data: AnalysisInput) => void;
  isLoading: boolean;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ onSubmit, isLoading }) => {
  // Form State
  const [resumeText, setResumeText] = useState<string>(SAMPLE_RESUMES[0].text);
  const [fileName, setFileName] = useState<string>(SAMPLE_RESUMES[0].fileName);
  const [fileSize, setFileSize] = useState<string>("48 KB");
  const [isCustomUpload, setIsCustomUpload] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Role State
  const [targetRole, setTargetRole] = useState<string>(TARGET_ROLES[0]);
  const [customRole, setCustomRole] = useState<string>("");
  const [isCustomRoleActive, setIsCustomRoleActive] = useState<boolean>(false);
  const [roleSearch, setRoleSearch] = useState<string>("");

  // Company State
  const [targetCompany, setTargetCompany] = useState<string>("NVIDIA");
  const [customCompany, setCustomCompany] = useState<string>("");
  const [isCustomCompanyActive, setIsCustomCompanyActive] = useState<boolean>(false);
  const [companySearch, setCompanySearch] = useState<string>("");

  // Experience Level
  const experienceOptions: ExperienceLevel[] = [
    "Student",
    "Fresher",
    "0–2 years",
    "2–5 years",
    "5+ years"
  ];
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("Student");

  // Optional goals
  const [userGoals, setUserGoals] = useState<string>(
    "I want to become a machine learning engineer and I'm unsure whether my projects are strong enough."
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file drop/upload
  const handleFileUpload = (file: File) => {
    const validExtensions = [".pdf", ".docx", ".txt"];
    const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    
    if (!validExtensions.includes(extension)) {
      alert("Please upload a supported PDF, DOCX, or TXT file.");
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    setFileName(file.name);
    setFileSize(sizeFormatted);
    setIsCustomUpload(true);

    // Read file text content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) || "";
      if (content) {
        setResumeText(content);
      } else {
        // Mocking extracted text for PDF simulation if binary
        setResumeText(`Extracted contents from ${file.name}:\nTechnical background in software and machine learning. Experienced with Python, Git, and data structures.`);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClearResume = () => {
    setFileName("");
    setFileSize("");
    setResumeText("");
    setIsCustomUpload(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_RESUMES.find((s) => s.id === sampleId);
    if (sample) {
      setFileName(sample.fileName);
      setFileSize("52 KB");
      setResumeText(sample.text);
      setTargetRole(sample.roleHint);
      setTargetCompany(sample.companyHint);
      setExperienceLevel(sample.level);
      setIsCustomRoleActive(false);
      setIsCustomCompanyActive(false);
      setIsCustomUpload(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalRole = isCustomRoleActive && customRole.trim() ? customRole.trim() : targetRole;
    const finalCompany = isCustomCompanyActive && customCompany.trim() ? customCompany.trim() : targetCompany;

    if (!resumeText.trim()) {
      alert("Please provide or upload your resume text to continue.");
      return;
    }

    if (!finalRole.trim()) {
      alert("Please select or enter your target role.");
      return;
    }

    onSubmit({
      resumeText: resumeText.trim(),
      fileName: fileName || "My_Resume.pdf",
      fileSize: fileSize || "45 KB",
      targetRole: finalRole,
      targetCompany: finalCompany || "Target Company",
      experienceLevel,
      userGoals: userGoals.trim()
    });
  };

  const filteredRoles = TARGET_ROLES.filter((r) =>
    r.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const filteredCompanies = TARGET_COMPANIES.filter((c) =>
    c.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <section id="analysis-form-section" className="py-16 md:py-24 bg-black/95 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Form Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-[#D4AF37]/35 text-xs font-mono font-semibold text-[#F5D061] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Target Specification</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-heading">
            Let's Define Your Target
          </h2>
          <p className="text-base sm:text-lg text-[#A1A1AA] mt-3 max-w-2xl mx-auto">
            Provide your current resume and target aspirations. Our AI analyzer examines structural alignment, missing technical stacks, and public engineering profiles.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="mb-10 p-4 rounded-2xl glass-panel border border-[#D4AF37]/20 bg-black/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#F5D061]" />
              Quick Fill: Test With Pre-Loaded Candidate Profiles
            </span>
            <span className="text-[11px] text-[#71717A]">1-Click Instant Preview</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SAMPLE_RESUMES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                id={`sample-profile-btn-${sample.id}`}
                onClick={() => handleSelectSample(sample.id)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  fileName === sample.fileName
                    ? "bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-sm shadow-[#D4AF37]/20"
                    : "bg-black/70 border-[#D4AF37]/20 text-[#A1A1AA] hover:border-[#D4AF37]/50 hover:text-white"
                }`}
              >
                <div className="text-xs font-semibold text-white truncate">{sample.label}</div>
                <div className="text-[11px] text-[#F5D061] mt-0.5">{sample.roleHint} • {sample.companyHint}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Form Card */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl glass-panel border border-[#D4AF37]/25 bg-black/85 space-y-10 shadow-2xl shadow-black">
          
          {/* STEP 1: RESUME UPLOAD */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#F5D061]" />
                1. Resume Upload
              </label>
              <span className="text-xs text-[#A1A1AA]">Supported: PDF, DOCX</span>
            </div>

            {/* Drop Zone */}
            <div
              id="resume-dropzone"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
                isDragOver
                  ? "border-[#F5D061] bg-[#D4AF37]/15 shadow-inner"
                  : fileName
                  ? "border-[#D4AF37]/60 bg-black/80 hover:border-[#D4AF37]"
                  : "border-[#D4AF37]/20 bg-black/60 hover:border-[#D4AF37]/50 hover:bg-black/80"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div className="w-14 h-14 mx-auto rounded-2xl bg-black border border-[#D4AF37]/30 flex items-center justify-center text-[#F5D061] mb-4 shadow-md shadow-black">
                <UploadCloud className="w-7 h-7 text-[#F5D061]" />
              </div>

              <h4 className="text-base font-semibold text-white font-heading">
                Drop your resume here
              </h4>
              <p className="text-xs text-[#A1A1AA] mt-1">
                or click to browse from your computer (PDF or DOCX)
              </p>
            </div>

            {/* Uploaded File Banner */}
            {fileName && (
              <div 
                id="uploaded-resume-status"
                className="mt-4 p-3.5 rounded-xl bg-black/90 border border-[#D4AF37]/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#D4AF37]/20 text-[#F5D061]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <span>{fileName}</span>
                      <span className="text-[10px] font-mono text-[#F5D061] bg-[#D4AF37]/15 px-1.5 py-0.5 rounded border border-[#D4AF37]/30">
                        {fileSize || "Ready"}
                      </span>
                    </div>
                    <div className="text-xs text-[#A1A1AA] mt-0.5">
                      {resumeText.length > 0 ? `${resumeText.length} characters parsed` : "File attached"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  id="remove-resume-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearResume();
                  }}
                  className="p-2 rounded-lg text-[#A1A1AA] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove uploaded resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* STEP 2: TARGET ROLE */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#F5D061]" />
                2. Target Role
              </label>
              <button
                type="button"
                id="toggle-custom-role-btn"
                onClick={() => {
                  setIsCustomRoleActive(!isCustomRoleActive);
                  if (!isCustomRoleActive && !customRole) {
                    setCustomRole("");
                  }
                }}
                className="text-xs text-[#F5D061] hover:underline"
              >
                {isCustomRoleActive ? "Select from common roles" : "Enter a custom role"}
              </button>
            </div>

            {isCustomRoleActive ? (
              <div>
                <input
                  type="text"
                  id="custom-role-input"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="e.g. Robotics Vision Engineer, Cloud Security Architect..."
                  className="w-full px-4 py-3 rounded-xl bg-black border border-[#D4AF37]/40 text-white placeholder-[#71717A] focus:outline-none focus:border-[#D4AF37] text-sm"
                />
              </div>
            ) : (
              <div className="space-y-3">
                {/* Search input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    id="search-role-input"
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                    placeholder="Search standard roles..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black border border-[#D4AF37]/20 text-white placeholder-[#71717A] focus:outline-none focus:border-[#D4AF37] text-xs"
                  />
                </div>

                {/* Role badges */}
                <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-1">
                  {filteredRoles.map((role) => {
                    const isSelected = targetRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        id={`role-chip-${role.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => setTargetRole(role)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-md shadow-[#D4AF37]/30 font-bold"
                            : "bg-black/90 text-[#A1A1AA] border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:text-white"
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: TARGET COMPANY */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#F5D061]" />
                3. Target Company
              </label>
              <button
                type="button"
                id="toggle-custom-company-btn"
                onClick={() => {
                  setIsCustomCompanyActive(!isCustomCompanyActive);
                  if (!isCustomCompanyActive && !customCompany) {
                    setCustomCompany("");
                  }
                }}
                className="text-xs text-[#F5D061] hover:underline"
              >
                {isCustomCompanyActive ? "Select from tech leaders" : "Enter a custom company"}
              </button>
            </div>

            {isCustomCompanyActive ? (
              <div>
                <input
                  type="text"
                  id="custom-company-input"
                  value={customCompany}
                  onChange={(e) => setCustomCompany(e.target.value)}
                  placeholder="e.g. Stripe, Databricks, Snowflake, Palantir..."
                  className="w-full px-4 py-3 rounded-xl bg-black border border-[#D4AF37]/40 text-white placeholder-[#71717A] focus:outline-none focus:border-[#D4AF37] text-sm"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    id="search-company-input"
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    placeholder="Search top tech companies..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black border border-[#D4AF37]/20 text-white placeholder-[#71717A] focus:outline-none focus:border-[#D4AF37] text-xs"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {filteredCompanies.map((c) => {
                    const isSelected = targetCompany === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        id={`company-chip-${c.name.toLowerCase()}`}
                        onClick={() => setTargetCompany(c.name)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold shadow-md shadow-[#D4AF37]/30"
                            : "bg-black/90 text-[#A1A1AA] border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:text-white"
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Note on company criteria privacy */}
            <p className="text-[11px] text-[#71717A] mt-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#A1A1AA]" />
              <span>Company preparation is based on publicly documented technology stacks and public engineering blogs, not private internal hiring rubrics.</span>
            </p>
          </div>

          {/* STEP 4: EXPERIENCE LEVEL */}
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wider text-white font-mono mb-3 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#F5D061]" />
              4. Experience Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {experienceOptions.map((level) => {
                const isSelected = experienceLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    id={`exp-level-chip-${level.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                    onClick={() => setExperienceLevel(level)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                      isSelected
                        ? "bg-[#D4AF37]/25 text-[#F5D061] border-[#D4AF37] shadow-sm shadow-[#D4AF37]/20 font-bold"
                        : "bg-black/90 text-[#A1A1AA] border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:text-white"
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 5: OPTIONAL SPECIFIC GOALS */}
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wider text-white font-mono mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#F5D061]" />
                5. Anything specific you want to improve? (Optional)
              </span>
              <span className="text-[11px] text-[#71717A] normal-case">Optional focus area</span>
            </label>
            <textarea
              id="user-specific-goals-textarea"
              rows={3}
              value={userGoals}
              onChange={(e) => setUserGoals(e.target.value)}
              placeholder="I want to become a machine learning engineer and I'm unsure whether my projects are strong enough."
              className="w-full px-4 py-3 rounded-xl bg-black border border-[#D4AF37]/25 text-white placeholder-[#71717A] focus:outline-none focus:border-[#D4AF37] text-sm resize-none"
            />
          </div>

          {/* SUBMIT BUTTON & SMALL NOTE */}
          <div className="pt-4 border-t border-[#D4AF37]/15">
            <button
              type="submit"
              id="run-ai-analysis-btn"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl text-base font-bold text-black bg-gradient-to-r from-[#D4AF37] via-[#F5D061] to-[#B8860B] shadow-xl shadow-[#D4AF37]/20 hover:shadow-2xl hover:shadow-[#D4AF37]/40 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Sparkles className="w-5 h-5 text-black" />
              <span>{isLoading ? "Analyzing Profile..." : "Run AI Analysis"}</span>
            </button>

            <p className="text-center text-xs text-[#71717A] mt-3">
              Your analysis is based on the resume and target information you provide.
            </p>
          </div>

        </form>

      </div>
    </section>
  );
};
