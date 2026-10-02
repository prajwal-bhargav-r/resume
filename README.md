# ResumeLens AI — AI-Powered Resume & Career Gap Analyzer

An intelligent, full-stack career gap analysis platform designed for students, freshers, and engineers. ResumeLens AI audits candidate resumes against industry benchmarks, identifies ATS readability flaws, scores alignment with tier-1 tech companies, highlights missing technical proficiencies, generates before/after bullet rewrites, and constructs a personalized 5-phase career preparation roadmap with curated learning resources and an interactive AI career coach.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture & System Flow](#architecture--system-flow)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [How to Run the Application](#how-to-run-the-application)
- [Usage Instructions](#usage-instructions)
- [API Endpoints](#api-endpoints)
- [AI & LLM Integration](#aillm-integration)
- [Database & Storage](#database--storage)
- [Authentication](#authentication)
- [Export & Reporting](#export--reporting)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)
- [Known Limitations](#known-limitations)
- [License](#license)

---

## Overview

Applying for competitive tech positions often leaves job seekers guessing why their resumes fail applicant tracking systems (ATS) or recruiter screens. **ResumeLens AI** provides transparent, actionable, and objective career gap evaluations.

Candidates can upload their resume in PDF, DOCX, DOC, TXT, or Markdown format, select their target engineering role (such as Machine Learning Engineer, Frontend Developer, or Full Stack Engineer) and desired employer (such as NVIDIA, Google, Stripe, or Meta), and receive:

1. **Overall Alignment Score & Percentile Benchmark** against real-world candidate pools.
2. **ATS Readability & Structure Audit** inspecting headings, formatting, dates, tables, and typography.
3. **Skill Gap Breakdown** differentiating between *Must Develop*, *Strengthen*, and *Elective* proficiencies.
4. **Before/After Bullet Rewrites** transforming weak descriptions into metric-driven, action-oriented accomplishments.
5. **Project Recommendations** proposing specific capstone projects with required technical stacks.
6. **5-Phase Actionable Roadmap** spanning 1–12+ weeks with milestones.
7. **Curated Learning Resource Directory** connecting gaps to verified guides and documentation.
8. **Interactive AI Career Coach** answering personalized follow-up questions.
9. **Exportable A4 Multi-Page PDF Report** generated client-side for offline sharing.

---

## Key Features

- **Dual-Layer Document Text Extraction**:
  - In-browser parsing for `.pdf` (via `pdfjs-dist`) and `.docx` (via `mammoth`).
  - Server-side fallback parsing (via `pdf-parse` and `mammoth`) on `/api/extract-text`.
  - Binary stream detection to prevent raw byte strings from corrupting the evaluation.
- **Document Authenticity Gatekeeper**:
  - Classifies documents to ensure genuine candidate profiles are analyzed while rejecting non-resume files (invoices, food recipes, legal contracts, medical prescriptions).
  - Includes a manual override button (*"This Is My Genuine Resume"*) to guarantee candidates are never blocked.
- **Pre-Loaded Benchmark Profiles**:
  - One-click sample resumes for rapid demonstration (e.g., Machine Learning Student targeting NVIDIA, Frontend Developer targeting Stripe).
- **Target Company & Role Alignment**:
  - Pre-configured benchmarks for top tech employers and standard roles, plus support for custom roles and companies.
- **Dual-Engine Analysis (Resilient Fallback)**:
  - **Live Gemini AI Mode**: Uses the `@google/genai` SDK with multi-model fallback (`gemini-3.8-flash`, `gemini-flash-latest`, `gemini-3.1-flash-lite`).
  - **Deterministic Grounded Rule Engine**: Operates automatically without API keys or during network outages, ensuring 100% application uptime.
- **Interactive Career Coach Chat**:
  - Context-aware chat drawer grounded in the candidate's specific resume and target role.
- **Multi-Page PDF Report Generator**:
  - Client-side A4 document compilation powered by `jspdf` featuring headers, metric cards, gap tables, and roadmap timelines.
- **System Health & Diagnostic Monitor**:
  - Dedicated `/api/health` view tracking server uptime, memory usage, Node runtime version, and Gemini API configuration state.

---

## Technology Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) (`react`, `react-dom` `^19.0.1`)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (`^7.0.2` / `~5.7`)
- **Build Tool**: [Vite 8](https://vitejs.dev/) (`^8.3.0`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`, `tailwindcss` `^4.3.3`)
- **Icons**: [Lucide React](https://lucide.dev/) (`^0.546.0`)
- **Animations**: [Motion](https://motion.dev/) (`^12.23.24`)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/) (`^3.10.1`)
- **Document Processing**: [pdfjs-dist](https://mozilla.github.io/pdf.js/) (`legacy build`), [mammoth](https://github.com/mwilliamson/mammoth.js) (`^1.13.0`)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) (`^4.2.1`), [html2canvas](https://html2canvas.hertzen.com/) (`^1.4.1`)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (v20+ / v22+)
- **Server Framework**: [Express 4](https://expressjs.com/) (`^4.21.2`)
- **TypeScript Runner**: [tsx](https://github.com/privatenumber/tsx) (`^4.21.0`)
- **Bundler**: [esbuild](https://esbuild.github.io/) (`^0.25.0`)
- **AI SDK**: [@google/genai](https://www.npmjs.com/package/@google/genai) (`^2.4.0`)
- **Server PDF Parsing**: [pdf-parse](https://www.npmjs.com/package/pdf-parse) (`^2.4.5`)
- **Server DOCX Parsing**: [mammoth](https://www.npmjs.com/package/mammoth) (`^1.13.0`)
- **Environment Management**: [dotenv](https://github.com/motdotla/dotenv) (`^17.2.3`)

---

## Architecture & System Flow

```
┌────────────────────────────────────────────────────────┐
│                   Browser Client (SPA)                 │
│  React 19 + Vite + Tailwind CSS + Lucide Icons         │
└──────────────┬───────────────────────────▲─────────────┘
               │                           │
         File Upload /               JSON Report /
         Analysis Request            Chat Responses
               │                           │
┌──────────────▼───────────────────────────┴─────────────┐
│              Express Application (server.ts)           │
│   • Middleware: express.json({ limit: "25mb" })        │
│   • Dev Mode: Mounts Vite via vite.middlewares         │
│   • Prod Mode: Serves static assets from /dist         │
├────────────────────────────────────────────────────────┤
│ API Routes:                                            │
│   GET  /api/health         -> System Diagnostics       │
│   POST /api/extract-text   -> PDF/DOCX Parser          │
│   POST /api/verify-resume  -> Document Classifier      │
│   POST /api/analyze        -> Career Gap Analysis      │
│   POST /api/chat           -> AI Career Coach          │
└──────────────┬───────────────────────────▲─────────────┘
               │                           │
       Prompt & Schema             Generated JSON
               │                           │
┌──────────────▼───────────────────────────┴─────────────┐
│          Google Gemini API (@google/genai)             │
│   Candidate Models:                                    │
│     1. gemini-3.8-flash (Primary)                      │
│     2. gemini-flash-latest (Transient Fallback)        │
│     3. gemini-3.1-flash-lite (Secondary Fallback)      │
│                                                        │
│   *If GEMINI_API_KEY is not set or API is unreachable, │
│    the internal Grounded Rule Engine handles analysis. │
└────────────────────────────────────────────────────────┘
```

### Request Flow
1. **Resume Ingestion**: The user uploads a file or selects a sample profile. The document text is extracted client-side via `pdfjs-dist` or `mammoth`. If in-browser extraction produces sparse output, `/api/extract-text` handles decoding on the server.
2. **Resume Verification**: `/api/verify-resume` and `resumeValidator.ts` verify that the document contains recognizable candidate credentials rather than non-resume content (invoices, recipes, legal policies).
3. **Analysis Processing**: `/api/analyze` sends the parsed resume, target role, target company, and experience level to Gemini with a strict JSON schema. If the Gemini API is unconfigured or unavailable, `generateGroundedAnalysis()` computes the report using deterministic rule-based evaluation.
4. **Interactive Dashboard**: The client renders the report with alignment metrics, diagnostic signals, skill gaps, rewrites, and the 5-phase roadmap.
5. **Career Coaching & Export**: The user can ask follow-up questions to the career coach via `/api/chat` or export a styled A4 PDF report via `jspdf`.

---

## Project Structure

```
├── .env.example              # Example environment configuration
├── .gitignore                # Git ignore patterns
├── bun.lock                  # Bun lockfile
├── index.html                # HTML entry point with Google Fonts
├── metadata.json             # Applet metadata and permissions
├── package.json              # Project scripts and dependencies
├── server.ts                 # Full-stack Express server and API routes
├── tsconfig.json             # TypeScript compiler configuration
├── vite.config.ts            # Vite and Tailwind CSS build setup
├── public/                   # Static public assets
└── src/
    ├── App.tsx               # Main application component and tab navigation
    ├── main.tsx              # React DOM entry point
    ├── index.css             # Global styles and Tailwind CSS directives
    ├── types.ts              # Core TypeScript interfaces and data models
    ├── components/
    │   ├── AnalysisForm.tsx                 # Resume dropzone, role inputs, and submission
    │   ├── CandidateDiagnosticSection.tsx   # Good signals, anti-patterns, and principles
    │   ├── CareerCoachChat.tsx              # Floating conversational AI coach drawer
    │   ├── Footer.tsx                       # Site footer and navigational links
    │   ├── HealthCheckView.tsx              # System diagnostic and API monitor tab
    │   ├── HowItWorks.tsx                   # Informational explanation of analysis methodology
    │   ├── LandingHero.tsx                  # Hero banner, feature highlights, and CTA buttons
    │   ├── LoadingAnalysisModal.tsx         # Multi-step progress modal during analysis
    │   ├── Navbar.tsx                       # Top navigation bar with active tab indicators
    │   ├── ReportDashboard.tsx              # Comprehensive career gap report view
    │   └── ResumeScorecardSection.tsx       # Alignment scorecards and benchmark comparisons
    ├── data/
    │   ├── sampleResumes.ts                 # Pre-configured sample resumes for instant demo
    │   └── targetRolesAndCompanies.ts       # Curated lists of tech roles and benchmark employers
    ├── services/
    │   ├── analysisEngine.ts                # Dual-mode analysis caller and grounded rule generator
    │   ├── learningResources.ts             # Curated directory of verified learning tutorials
    │   └── pdfReportGenerator.ts            # Multi-page A4 PDF report compiler using jsPDF
    └── utils/
        ├── documentExtractor.ts             # Universal client & server text extractor (PDF/DOCX)
        └── resumeValidator.ts               # Gatekeeper resume verification and heuristic rules
```

---

## Prerequisites

- **Node.js**: `v20.x` or `v22.x` (verified on Node `v22.23.2`)
- **Package Manager**: `npm` (v10+), `bun`, or `yarn`
- **Gemini API Key** *(Optional)*: A [Google AI Studio](https://aistudio.google.com/) API key to enable live Gemini AI generation. The application includes a full rule-based fallback if no key is supplied.

---

## Installation & Setup

1. **Clone or navigate to the repository directory**:
   ```bash
   cd /path/to/repository
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```

4. **Add your Gemini API Key (Optional)**:
   Open `.env` and set:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

---

## Environment Variables

The application reads the following environment variables (defined in `.env.example` and accessed via `process.env` in `server.ts` and `vite.config.ts`):

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Optional | `undefined` | Google Gemini API key used by `@google/genai`. If omitted, the app operates using the deterministic grounded analysis engine. |
| `APP_URL` | Optional | `undefined` | The host URL of the running application (automatically injected in Cloud Run / AI Studio environments). |
| `PORT` | Optional | `3000` | Port number on which the Express server listens. |
| `NODE_ENV` | Optional | `development` | Set to `production` when running the compiled bundle. In development, Express mounts Vite middleware. |
| `DISABLE_HMR` | Optional | `false` | When set to `'true'`, disables Vite Hot Module Replacement (HMR) and file watching to reduce CPU overhead. |

---

## Available Scripts

All commands are defined in `package.json`:

```bash
# Start the full-stack development server (Express + Vite middleware on port 3000)
npm run dev

# Compile the client SPA with Vite and bundle server.ts with esbuild into dist/server.cjs
npm run build

# Start the compiled production server
npm run start

# Preview the static Vite production build
npm run preview

# Run TypeScript compiler to validate types across the codebase without emitting files
npm run lint

# Clean build artifacts (deletes dist/ and server.js)
npm run clean
```

---

## How to Run the Application

### Development Mode
Runs `tsx server.ts`, which starts the Express server on port 3000 and mounts the Vite dev server as middleware:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

### Production Mode
Build the production client assets and server bundle, then start the server:
```bash
npm run build
npm run start
```
The production server serves static assets from `./dist` and handles API requests on port 3000.

---

## Usage Instructions

1. **Start Analysis**: Click **"Analyze My Resume"** from the landing page or switch to the **"Analyze"** tab in the navigation bar.
2. **Provide Resume**:
   - **Upload File**: Drag and drop or browse for a `.pdf`, `.docx`, `.doc`, `.txt`, or `.md` file.
   - **Use Sample**: Click on one of the pre-loaded profiles (e.g., *Student ML Engineer*, *Frontend Developer*) to test the system immediately.
   - **Direct Edit**: Toggle the text editor to paste or adjust resume text directly.
3. **Select Target Role & Company**:
   - Pick from curated roles (e.g., *Machine Learning Engineer*, *Full Stack Engineer*, *DevOps / Cloud Engineer*) or enter a custom title.
   - Pick a benchmark company (e.g., *NVIDIA*, *Google*, *Meta*, *Stripe*) or specify a custom organization.
4. **Choose Experience Level & Goals**:
   - Select *Student*, *Fresher*, *0–2 years*, *2–5 years*, or *5+ years*.
   - Optionally supply specific questions or target focus areas.
5. **Run AI Analysis**: Click **"Run AI Analysis"**. The modal will display real-time progress steps while the report is generated.
6. **Review the Dashboard**:
   - **Scorecard**: Review your overall alignment score, percentile rank, and breakdown across Core Tech Stack, Projects, and ATS Readability.
   - **Candidate 360° Diagnostics**: Four-pillar evaluation breaking down **Core Strengths & Demonstrated Proficiencies (Where the Candidate Excels)**, **Critical Weaknesses & Red Flags (Key Areas for Improvement & Identified Deficiencies)**, **Priority Growth Areas**, and **Standout Benchmarks**.
   - **Skill Gap Matrix**: View skills grouped by Must Develop, Strengthen, and Elective, with difficulty ratings and recommended steps.
   - **Curated Technical Resource Vault**: Search and filter famous engineering blogs and landmark articles (Martin Fowler, Stripe Engineering, Netflix TechBlog, Julia Evans, ByteByteGo, Andrej Karpathy, Eugene Yan, Chip Huyen, Lilian Weng, The Pragmatic Engineer, AWS Builders' Library, Real Python, Markus Winand) alongside video masterclasses and official documentation.
   - **Resume Improvements**: Review bullet rewrites comparing original bullets with outcome-driven alternatives.
   - **5-Phase Roadmap**: Follow phased milestones across resume fixes, skill building, capstone projects, and interview preparation.
7. **Ask the Career Coach**: Click the floating **"Ask Career AI"** button on the bottom right to ask questions about your report.
8. **Export PDF**: Click **"Download PDF Report"** on the dashboard to export a multi-page A4 document.
9. **System Diagnostics**: Click the **"Health"** tab in the navigation bar to inspect server status, uptime, memory, and Gemini integration state.

---

## API Endpoints

The Express server exposes the following endpoints under `/api`:

### `GET /api/health`
Returns system status, memory utilization, uptime, Node version, and Gemini AI integration state.
- **Response**:
  ```json
  {
    "status": "ok",
    "uptimeSeconds": 120,
    "uptimeFormatted": "2m 0s",
    "service": "ResumeLens AI Career Engine",
    "version": "1.2.0",
    "environment": "development",
    "hasApiKey": true,
    "gemini": {
      "configured": true,
      "preferredModel": "gemini-3.8-flash",
      "candidateModels": ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"],
      "mode": "Live Gemini AI API (Multi-Model Resilient)"
    },
    "system": {
      "nodeVersion": "v22.23.2",
      "platform": "linux",
      "arch": "x64",
      "memoryUsage": { "heapUsed": "45 MB", "heapTotal": "60 MB", "rss": "110 MB" }
    }
  }
  ```

### `POST /api/extract-text`
Extracts readable text from base64-encoded PDF or DOCX documents.
- **Request Body**:
  ```json
  {
    "fileBase64": "data:application/pdf;base64,...",
    "fileName": "candidate_resume.pdf"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "text": "Extracted resume content...",
    "characterCount": 2450,
    "wordCount": 380,
    "pagesCount": 1,
    "fileName": "candidate_resume.pdf"
  }
  ```

### `POST /api/verify-resume`
Checks whether a document is an authentic resume/CV or an unrelated file (invoice, recipe, contract).
- **Request Body**:
  ```json
  {
    "text": "Document text content...",
    "fileName": "resume.pdf",
    "fileBase64": "optional_base64_string"
  }
  ```
- **Response**:
  ```json
  {
    "isResume": true,
    "confidence": 95,
    "identifiedType": "Candidate Resume / CV",
    "identificationDetails": "Verified authentic candidate profile...",
    "detectedSections": ["Experience", "Education", "Skills"],
    "missingStandardSections": []
  }
  ```

### `POST /api/analyze`
Generates a complete career gap analysis report comparing a resume against a target role and company.
- **Request Body**:
  ```json
  {
    "resumeText": "Full plain text of the resume...",
    "targetRole": "Machine Learning Engineer",
    "targetCompany": "NVIDIA",
    "experienceLevel": "Student",
    "userGoals": "Improve deep learning and systems engineering skills."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "report": {
      "alignmentScore": 74,
      "alignmentSummary": "Strong foundational background in Python and ML...",
      "strengths": ["Clear ML project experience", "Strong math foundation"],
      "gaps": ["Lacks evidence of distributed training or CUDA optimization"],
      "priorityActions": ["Containerize training scripts", "Deploy on cloud GPU"],
      "resumeFlaws": [],
      "skillGaps": [],
      "skillsToDevelop": { "mustDevelop": [], "strengthen": [], "optional": [] },
      "projectRecommendations": [],
      "targetPreparation": { "roleFocus": [], "companyResearch": [] },
      "resumeImprovements": [],
      "roadmap": [],
      "nextFiveActions": [],
      "readabilityChecklist": []
    }
  }
  ```

### `POST /api/chat`
Provides conversational career coaching grounded in the candidate's analysis report.
- **Request Body**:
  ```json
  {
    "messages": [
      { "sender": "user", "content": "How can I improve my project bullet points?" }
    ],
    "context": {
      "targetRole": "Machine Learning Engineer",
      "targetCompany": "NVIDIA",
      "experienceLevel": "Student",
      "summary": {
        "alignment": 74,
        "topStrengths": ["Python", "PyTorch"],
        "topGaps": ["CUDA", "TensorRT"]
      }
    }
  }
  ```
- **Response**:
  ```json
  {
    "reply": "Focus on framing each project with action verbs, exact technical stacks, and measurable latency or accuracy improvements..."
  }
  ```

---

## AI & LLM Integration

The application integrates with Google's Gemini models via the `@google/genai` TypeScript SDK:

- **Model Hierarchy**:
  1. `gemini-3.8-flash` (Primary candidate)
  2. `gemini-flash-latest` (Secondary candidate)
  3. `gemini-3.1-flash-lite` (Tertiary candidate)
- **Multi-Model Transient Fallback**:
  `generateWithFallback()` in `server.ts` intercepts transient errors (HTTP 429, 503, high demand spikes) and attempts immediate retry before cascading to alternative candidate models.
- **Structured JSON Output**:
  Prompts use `responseMimeType: "application/json"` with comprehensive system instructions and schema definitions.
- **Zero-Dependency Fallback**:
  If `GEMINI_API_KEY` is not provided in `.env`, or if all remote API models are unreachable, the server returns `{ fallback: true }`. The client's `src/services/analysisEngine.ts` seamlessly switches to `generateGroundedAnalysis()`, providing a realistic, role-specific career gap assessment without failing.

---

## Database & Storage

- **No External Database Required**: The application does not require PostgreSQL, MySQL, MongoDB, or Firebase.
- **In-Memory & Session State**: Uploaded documents, generated reports, and chat history are maintained in client React state (`App.tsx`, `CareerCoachChat.tsx`) during the active session.
- **No Disk Persistence**: Files uploaded to `/api/extract-text` are parsed in-memory as Buffers and discarded after processing.

---

## Authentication

- **No User Accounts Required**: The platform does not require registration, login, or OAuth tokens to run analyses.
- **Public Session Access**: Every user can immediately upload a resume, view benchmark evaluations, and export PDF reports without friction.

---

## Export & Reporting

The application includes a client-side A4 PDF export engine implemented in `src/services/pdfReportGenerator.ts`:
- **Engine**: `jspdf` (`^4.2.1`).
- **Layout**: Standard A4 portrait (`210mm x 297mm`) with running headers, footers, page numbering, and dynamic page-break calculations.
- **Sections Included in PDF**:
  - Executive Overview & Target Role/Company alignment
  - Scorecard Breakdown (Core Stack, Projects, Experience, ATS Readability)
  - Must-Develop, Strengthen, and Elective Skill Gaps
  - Before/After Resume Bullet Point Rewrites
  - Recommended Capstone Projects
  - 5-Phase Preparation Roadmap with Milestones
  - ATS Readability Audit Checklist

---

## Testing & Quality Assurance

- **Type Checking**:
  Run TypeScript type validation across all server and client files:
  ```bash
  npm run lint
  ```
- **Production Build Verification**:
  Ensure both the Vite client bundle and the esbuild Node server build cleanly:
  ```bash
  npm run build
  ```
- **Health Check Verification**:
  With the dev server running, verify system health via:
  ```bash
  curl http://localhost:3000/api/health
  ```
  or navigate to the **"Health"** tab in the UI.

---

## Deployment

### Full-Stack Hosting (Cloud Run, Render, Railway, VPS)
1. Set environment variables on your host:
   - `GEMINI_API_KEY`: Your Google AI Studio API key.
   - `NODE_ENV`: Set to `production`.
   - `PORT`: Set to `3000` (or host-assigned port).
2. Configure build and start commands:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start` (executes `node dist/server.cjs`)

### Static Hosting (Netlify, Vercel, GitHub Pages)
When deploying only the frontend to static hosting platforms:
- **Build Command**: `vite build`
- **Publish Directory**: `dist`
- **Behavior**: Client-side document extraction (`pdfjs-dist` and `mammoth`) handles `.pdf`, `.docx`, and `.txt` files directly in the browser. In the absence of the Node.js backend `/api` routes, the application uses the built-in deterministic grounded engine (`generateGroundedAnalysis`) to deliver full career reports.

---

## Troubleshooting

### 1. Port 3000 is already in use
If another process is bound to port 3000, specify a different port in your environment:
```bash
PORT=3001 npm run dev
```

### 2. "PLEASE UPLOAD AN GENUINE RESUME" Warning
- **Cause**: The document was detected as empty, unreadable, or classified as a non-resume document (such as an invoice or recipe).
- **Resolution**: Ensure your PDF or DOCX file contains selectable text (not a scanned image with no OCR). You can also click the green **"This Is My Genuine Resume (Proceed Anyway)"** button in the alert to bypass the warning, or paste text directly using the text editor.

### 3. Gemini API Returns 429 or 503
- **Cause**: Temporary rate limits or upstream capacity on Google AI Studio.
- **Resolution**: The server automatically attempts multi-model retries (`gemini-3.8-flash` -> `gemini-flash-latest` -> `gemini-3.1-flash-lite`). If all fail, the app falls back to the deterministic grounded engine without crashing.

### 4. Running Without an API Key
- If `GEMINI_API_KEY` is not defined in `.env`, the system automatically activates the rule-grounded career gap analysis engine. All scores, flaws, skill matrices, bullet rewrites, roadmaps, and PDF exports remain functional.

---

## Security Considerations

- **Server-Side API Key Secrecy**: The `GEMINI_API_KEY` is exclusively read on the server (`server.ts`) and is never bundled or transmitted to the client.
- **Request Size Limiting**: `express.json({ limit: "25mb" })` prevents denial-of-service attempts via oversized payloads.
- **No Unsafe Execution**: Uploaded files are parsed as raw byte arrays and text strings. No uploaded code is evaluated or executed.
- **Transient Memory Lifecycle**: Uploaded files and base64 streams are not written to disk and are garbage-collected after response completion.

---

## Known Limitations

- **Scanned / Image-Only PDFs**: Text extraction relies on digital text layers in PDFs (`pdfjs-dist` / `pdf-parse`). Image-only scanned resumes without an embedded text layer require OCR or manual text entry via the editor.
- **Session-Based Storage**: Reports and chat conversations exist in client memory and are not stored in a database; refreshing the page resets the active session unless a report is re-analyzed or exported as PDF.

---

## License

This project is marked as private in `package.json` (`"private": true`). All rights reserved.
