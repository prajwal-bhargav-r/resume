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
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  RefreshCw 
} from "lucide-react";
import { AnalysisInput, ExperienceLevel } from "../types";
import { TARGET_ROLES, TARGET_COMPANIES } from "../data/targetRolesAndCompanies";
import { SAMPLE_RESUMES } from "../data/sampleResumes";
import { validateResumeContent, verifyResumeRemotely, ResumeVerificationResult } from "../utils/resumeValidator";

interface AnalysisFormProps {
  onSubmit: (data: AnalysisInput) => void;
  isLoading: boolean;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ onSubmit, isLoading }) => {
  // Form State: Starts empty so the user explicitly uploads or selects their resume
  const [resumeText, setResumeText] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [isCustomUpload, setIsCustomUpload] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Resume Verification and Document Identification State
  const [isVerifyingResume, setIsVerifyingResume] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<ResumeVerificationResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

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

  // Handle file drop/upload with deep document authenticity verification & identification
  const handleFileUpload = async (file: File) => {
    const validExtensions = [".pdf", ".docx", ".txt", ".doc"];
    const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    
    if (!validExtensions.includes(extension)) {
      setValidationError("PLEASE UPLOAD AN GENUINE RESUME");
      setVerificationResult({
        isResume: false,
        confidence: 99,
        identifiedType: `Unsupported File Format (${extension || 'Unknown'})`,
        identificationDetails: "Only PDF, DOCX, or TXT candidate resume documents are supported. The uploaded file is not recognized as a resume.",
        detectedSections: [],
        missingStandardSections: ["Experience", "Education", "Skills"],
        errorMessage: '"PLEASE UPLOAD AN GENUINE RESUME"'
      });
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    setFileName(file.name);
    setFileSize(sizeFormatted);
    setIsCustomUpload(true);
    setIsVerifyingResume(true);
    setValidationError(null);

    // Read file text content
    const reader = new FileReader();
    reader.onload = async (e) => {
      let content = (e.target?.result as string) || "";
      
      // If minimal or empty, provide minimal representation
      if (!content || content.length < 20) {
        content = `Document: ${file.name}\nFile size: ${sizeFormatted}`;
      }

      setResumeText(content);

      // Perform local verification immediately
      const localResult = validateResumeContent(content, file.name);

      // Also invoke server-side inspection if available
      try {
        const remoteResult = await verifyResumeRemotely(content, file.name);
        setIsVerifyingResume(false);
        setVerificationResult(remoteResult);

        if (!remoteResult.isResume) {
          setValidationError("PLEASE UPLOAD AN GENUINE RESUME");
        } else {
          setValidationError(null);
        }
      } catch {
        setIsVerifyingResume(false);
        setVerificationResult(localResult);
        if (!localResult.isResume) {
          setValidationError("PLEASE UPLOAD AN GENUINE RESUME");
        } else {
          setValidationError(null);
        }
      }
    };

    reader.onerror = () => {
      setIsVerifyingResume(false);
      setValidationError("PLEASE UPLOAD AN GENUINE RESUME");
      setVerificationResult({
        isResume: false,
        confidence: 95,
        identifiedType: "Corrupted / Unreadable File",
        identificationDetails: "The file could not be parsed properly as text. Please upload an authentic candidate resume document in PDF or TXT format.",
        detectedSections: [],
        missingStandardSections: ["Experience", "Education", "Skills"],
        errorMessage: '"PLEASE UPLOAD AN GENUINE RESUME"'
      });
    };

    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClearResume = () => {
    setResumeText("");
    setFileName("");
    setFileSize("");
    setIsCustomUpload(false);
    setVerificationResult(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectSample = (sampleId: string) => {
    const selected = SAMPLE_RESUMES.find((s) => s.id === sampleId);
    if (selected) {
      setResumeText(selected.text);
      setFileName(selected.fileName);
      setFileSize("42 KB");
      setIsCustomUpload(false);
      setTargetRole(selected.roleHint);
      setTargetCompany(selected.companyHint);
      setExperienceLevel(selected.level);
      setIsCustomRoleActive(false);
      setIsCustomCompanyActive(false);

      // Verify sample immediately
      const verified = validateResumeContent(selected.text, selected.fileName);
      setVerificationResult(verified);
      setValidationError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Guard: Check if a resume is selected or uploaded
    if (!resumeText.trim() || !fileName.trim()) {
      setValidationError("PLEASE UPLOAD AN GENUINE RESUME");
      setVerificationResult({
        isResume: false,
        confidence: 100,
        identifiedType: "No Document Uploaded",
        identificationDetails: "Please upload or select an authentic candidate resume before requesting an analysis.",
        detectedSections: [],
        missingStandardSections: ["Experience", "Education", "Skills"],
        errorMessage: '"PLEASE UPLOAD AN GENUINE RESUME"'
      });
      const dropzone = document.getElementById("resume-dropzone-container");
      dropzone?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Guard: Deep check if the document is actually a genuine resume
    const check = verificationResult || validateResumeContent(resumeText, fileName);
    if (!check.isResume) {
      setVerificationResult(check);
      setValidationError("PLEASE UPLOAD AN GENUINE RESUME");
      const dropzone = document.getElementById("resume-dropzone-container");
      dropzone?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const finalRole = isCustomRoleActive && customRole.trim() ? customRole.trim() : targetRole;
    const finalCompany = isCustomCompanyActive && customCompany.trim() ? customCompany.trim() : targetCompany;

    if (!finalRole.trim()) {
      return;
    }

    setValidationError(null);
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
    <section id="analysis-form-section" className="py-16 md:py-24 bg-[#FAFAFA] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Form Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-300 text-xs font-mono font-semibold text-neutral-800 uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Target Specification</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight font-heading">
            Let's Define Your Target
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 mt-3 max-w-2xl mx-auto">
            Provide your current resume and target aspirations. Our AI analyzer examines structural alignment, missing technical stacks, and public engineering profiles.
          </p>
        </div>

        {/* Global Validation Alert Banner */}
        {validationError && (
          <div 
            id="resume-global-validation-alert"
            className="mb-8 p-5 sm:p-6 rounded-2xl bg-neutral-950 text-white border-2 border-rose-600 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-top duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-rose-600 text-white flex-shrink-0 shadow-sm">
                <AlertTriangle className="w-6 h-6 text-white stroke-[2.5]" />
              </div>
              <div className="flex-1">
                <div className="text-lg sm:text-xl font-black tracking-wide text-rose-300 font-mono flex items-center gap-2">
                  <span>&ldquo;PLEASE UPLOAD AN GENUINE RESUME&rdquo;</span>
                </div>

                {/* If non-resume was identified */}
                {verificationResult && !verificationResult.isResume ? (
                  <div className="mt-3.5 p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-neutral-400 font-bold uppercase tracking-wider text-[11px]">
                        Identified Document:
                      </span>
                      <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono font-bold text-xs">
                        {verificationResult.identifiedType}
                      </span>
                    </div>
                    <p className="text-neutral-300 leading-relaxed text-xs sm:text-sm">
                      {verificationResult.identificationDetails}
                    </p>
                    {verificationResult.missingStandardSections && verificationResult.missingStandardSections.length > 0 && (
                      <div className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-800">
                        <span className="text-neutral-200 font-semibold">Missing Standard Resume Signals:</span>{" "}
                        {verificationResult.missingStandardSections.join(" • ")}
                      </div>
                    )}
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleClearResume}
                        className="px-3.5 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-black" />
                        <span>Remove & Upload Genuine Resume</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
                    No resume document has been uploaded or selected. Please upload an authentic candidate resume (PDF, DOCX, or TXT) or select one of the pre-loaded profiles below to proceed.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Sample Selector */}
        <div className="mb-10 p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-900 font-semibold flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-black" />
              Quick Fill: Test With Pre-Loaded Candidate Profiles
            </span>
            <span className="text-[11px] text-neutral-500">1-Click Instant Preview</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SAMPLE_RESUMES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                id={`sample-profile-btn-${sample.id}`}
                onClick={() => handleSelectSample(sample.id)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  fileName === sample.fileName
                    ? "bg-black text-white border-black shadow-xs font-semibold"
                    : "bg-neutral-50/70 border-neutral-200 text-neutral-700 hover:border-black hover:bg-white"
                }`}
              >
                <div className={`text-xs font-semibold truncate ${fileName === sample.fileName ? "text-white" : "text-neutral-900"}`}>{sample.label}</div>
                <div className={`text-[11px] mt-0.5 ${fileName === sample.fileName ? "text-neutral-300" : "text-neutral-500"}`}>{sample.roleHint} • {sample.companyHint}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Form Card */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-white border border-neutral-200 space-y-10 shadow-sm">
          
          {/* STEP 1: RESUME UPLOAD */}
          <div id="resume-dropzone-container">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold uppercase tracking-wider text-neutral-950 font-mono flex items-center gap-2">
                <FileText className="w-4 h-4 text-black" />
                1. Resume Upload
              </label>
              <span className="text-xs text-neutral-500">Supported: PDF, DOCX, TXT</span>
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
                  ? "border-black bg-neutral-100 shadow-inner"
                  : validationError
                  ? "border-neutral-900 bg-neutral-50 hover:border-black"
                  : fileName
                  ? "border-neutral-400 bg-neutral-50 hover:border-black"
                  : "border-neutral-300 bg-neutral-50/60 hover:border-black hover:bg-neutral-100/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.doc"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-neutral-300 flex items-center justify-center text-black mb-4 shadow-xs">
                <UploadCloud className="w-7 h-7 text-black" />
              </div>

              <h4 className="text-base font-semibold text-neutral-950 font-heading">
                {fileName ? "Change Uploaded Resume" : "Drop your resume here"}
              </h4>
              <p className="text-xs text-neutral-500 mt-1">
                or click to browse from your computer (PDF, DOCX, or TXT)
              </p>
            </div>

            {/* Verifying Resume Inspection Indicator */}
            {isVerifyingResume && (
              <div className="mt-4 p-3.5 rounded-xl bg-neutral-100 border border-neutral-300 flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-black animate-spin flex-shrink-0" />
                <div className="text-xs font-mono text-neutral-900">
                  Inspecting file contents to verify authentic candidate resume structure...
                </div>
              </div>
            )}

            {/* Verified Genuine Resume Badge */}
            {verificationResult && verificationResult.isResume && !isVerifyingResume && (
              <div 
                id="resume-verified-badge"
                className="mt-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white flex-shrink-0 shadow-xs">
                    <CheckCircle2 className="w-5 h-5 text-white stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-neutral-950 flex items-center gap-2">
                      <span className="text-emerald-950">Genuine Resume Verified</span>
                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-semibold">
                        {verificationResult.identifiedType}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-900 mt-0.5">
                      Detected: {verificationResult.detectedSections.join(", ")}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-800 font-bold self-start sm:self-auto bg-white px-2.5 py-1 rounded border border-emerald-300 shadow-2xs">
                  ✔ Valid Candidate File
                </span>
              </div>
            )}

            {/* Uploaded File Banner */}
            {fileName && (
              <div 
                id="uploaded-resume-status"
                className="mt-4 p-3.5 rounded-xl bg-neutral-50 border border-neutral-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2 rounded-lg bg-white border border-neutral-300 text-black flex-shrink-0">
                    <FileText className="w-5 h-5 text-black" />
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-semibold text-neutral-950 flex items-center gap-2 truncate">
                      <span className="truncate">{fileName}</span>
                      <span className="text-[10px] font-mono text-neutral-700 bg-neutral-200 px-1.5 py-0.5 rounded border border-neutral-300 flex-shrink-0">
                        {fileSize || "Ready"}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
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
                  className="p-2 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors flex-shrink-0 ml-2 cursor-pointer"
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
              <label className="text-sm font-semibold uppercase tracking-wider text-neutral-950 font-mono flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-black" />
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
                className="text-xs text-black font-semibold hover:underline cursor-pointer"
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
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black text-sm"
                />
              </div>
            ) : (
              <div className="space-y-3">
                {/* Search input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    id="search-role-input"
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                    placeholder="Search standard roles..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black text-xs"
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
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-black text-white shadow-xs font-bold border border-black"
                            : "bg-neutral-50 text-neutral-700 border border-neutral-200 hover:border-neutral-400 hover:text-black"
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
              <label className="text-sm font-semibold uppercase tracking-wider text-neutral-950 font-mono flex items-center gap-2">
                <Building2 className="w-4 h-4 text-black" />
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
                className="text-xs text-black font-semibold hover:underline cursor-pointer"
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
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black text-sm"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    id="search-company-input"
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    placeholder="Search top tech companies..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black text-xs"
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
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-black text-white font-bold shadow-xs border border-black"
                            : "bg-neutral-50 text-neutral-700 border border-neutral-200 hover:border-neutral-400 hover:text-black"
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
            <p className="text-[11px] text-neutral-500 mt-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />
              <span>Company preparation is based on publicly documented technology stacks and public engineering blogs, not private internal hiring rubrics.</span>
            </p>
          </div>

          {/* STEP 4: EXPERIENCE LEVEL */}
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wider text-neutral-950 font-mono mb-3 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-black" />
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
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-black text-white border-black shadow-xs font-bold"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:text-black"
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
            <label className="block text-sm font-semibold uppercase tracking-wider text-neutral-950 font-mono mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-black" />
                5. Anything specific you want to improve? (Optional)
              </span>
              <span className="text-[11px] text-neutral-500 normal-case">Optional focus area</span>
            </label>
            <textarea
              id="user-specific-goals-textarea"
              rows={3}
              value={userGoals}
              onChange={(e) => setUserGoals(e.target.value)}
              placeholder="I want to become a machine learning engineer and I'm unsure whether my projects are strong enough."
              className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black text-sm resize-none"
            />
          </div>

          {/* SUBMIT BUTTON & SMALL NOTE */}
          <div className="pt-4 border-t border-neutral-200">
            {validationError && (
              <div 
                id="submit-validation-error-banner"
                className="mb-4 p-4 rounded-xl bg-neutral-950 text-white border-2 border-rose-600 text-center flex items-center justify-center gap-2.5 shadow-lg animate-in fade-in duration-200"
              >
                <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <span className="font-mono text-sm sm:text-base font-black text-rose-300 tracking-wide">
                  &ldquo;PLEASE UPLOAD AN GENUINE RESUME&rdquo;
                </span>
              </div>
            )}

            <button
              type="submit"
              id="run-ai-analysis-btn"
              disabled={isLoading || isVerifyingResume}
              className="w-full py-4 px-6 rounded-2xl text-base font-bold text-white bg-black hover:bg-neutral-800 shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span>{isLoading ? "Analyzing Profile..." : isVerifyingResume ? "Verifying Resume..." : "Run AI Analysis"}</span>
            </button>

            <p className="text-center text-xs text-neutral-500 mt-3">
              Your analysis is based on the resume and target information you provide.
            </p>
          </div>

        </form>

      </div>
    </section>
  );
};
