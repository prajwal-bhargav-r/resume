import jsPDF from "jspdf";
import { CareerGapReport } from "../types";

export interface GeneratePdfOptions {
  fileName?: string;
}

export function generateCareerGapPdf(report: CareerGapReport, options?: GeneratePdfOptions): string {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2;
  const bottomLimit = pageHeight - 18;

  let cursorY = 16;
  let currentPage = 1;

  // Helper to ensure clean page breaks with running header and footer
  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > bottomLimit) {
      drawFooter();
      doc.addPage();
      currentPage++;
      drawRunningHeader();
      cursorY = 22;
    }
  };

  const drawRunningHeader = () => {
    doc.setFillColor(24, 24, 27);
    doc.rect(0, 0, pageWidth, 12, "F");

    doc.setFillColor(212, 175, 55);
    doc.rect(0, 11.5, pageWidth, 0.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(212, 175, 55);
    doc.text("RESUME ANALYZER", marginX, 7.5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 180, 190);
    doc.text(`Career Gap Analysis & Benchmark Report • ${report.targetRole} @ ${report.targetCompany}`, marginX + 38, 7.5);

    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 150);
    doc.text(new Date(report.createdAt || Date.now()).toLocaleDateString(), pageWidth - marginX, 7.5, { align: "right" });
  };

  const drawFooter = () => {
    doc.setDrawColor(220, 220, 228);
    doc.setLineWidth(0.3);
    doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 130);
    doc.text("Confidential • Prepared for Candidate Career Development", marginX, pageHeight - 7);
    doc.text(`Page ${currentPage}`, pageWidth - marginX, pageHeight - 7, { align: "right" });
  };

  // =========================================================================
  // PAGE 1: COVER & EXECUTIVE DASHBOARD
  // =========================================================================

  // Top Accent Banner
  doc.setFillColor(15, 15, 18);
  doc.rect(0, 0, pageWidth, 42, "F");
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 41, pageWidth, 1.2, "F");

  // Logo / Tag
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(212, 175, 55);
  doc.text("RESUME ANALYZER • EXECUTIVE REPORT", marginX, 12);

  // Main Title
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("Career Gap & Benchmark Analysis", marginX, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 210);
  doc.text(
    `Structural evaluation, technical gap diagnosis, and ATS readiness roadmap`,
    marginX,
    29
  );

  doc.setFontSize(8);
  doc.setTextColor(160, 160, 170);
  const dateStr = new Date(report.createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  doc.text(`Generated on ${dateStr} • File: ${report.resumeFileName || "Candidate_Resume.pdf"}`, marginX, 36);

  cursorY = 48;

  // Candidate Target Specs Card
  doc.setFillColor(248, 249, 251);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, cursorY, contentWidth, 24, 2, 2, "FD");

  const colW = contentWidth / 3;
  // Target Role
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(140, 115, 25);
  doc.text("TARGET ROLE", marginX + 6, cursorY + 7);
  doc.setFontSize(10.5);
  doc.setTextColor(20, 20, 25);
  doc.text(report.targetRole || "Software Engineer", marginX + 6, cursorY + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 110);
  doc.text("Level: " + (report.experienceLevel || "Mid"), marginX + 6, cursorY + 20);

  // Target Company
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(140, 115, 25);
  doc.text("TARGET COMPANY", marginX + colW + 4, cursorY + 7);
  doc.setFontSize(10.5);
  doc.setTextColor(20, 20, 25);
  doc.text(report.targetCompany || "Industry Standard", marginX + colW + 4, cursorY + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 110);
  doc.text("Hiring Benchmark Model", marginX + colW + 4, cursorY + 20);

  // Overall Match
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(140, 115, 25);
  doc.text("RESUME SCORE", marginX + colW * 2 + 4, cursorY + 7);
  doc.setFontSize(13);
  doc.setTextColor(180, 130, 20);
  const scoreVal = report.scorecard?.overallScore ?? report.alignmentScore;
  doc.text(`${scoreVal} / 100`, marginX + colW * 2 + 4, cursorY + 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 110);
  doc.text(report.scorecard?.tier || "Competitive Match", marginX + colW * 2 + 4, cursorY + 20);

  cursorY += 30;

  // =========================================================================
  // BENCHMARK COMPARISON & SCORECARD SUMMARY
  // =========================================================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 25);
  doc.text("1. Resume Score & Benchmark Alignment", marginX, cursorY);
  cursorY += 4;

  const targetBench = report.scorecard?.targetBenchmark ?? 85;
  const poolAvg = report.scorecard?.applicantPoolAverage ?? 68;
  const topTier = report.scorecard?.topTierThreshold ?? 92;
  const ptsToTarget = report.scorecard?.pointsToTarget ?? (scoreVal - targetBench);

  // Benchmark pill box
  doc.setFillColor(245, 246, 248);
  doc.setDrawColor(225, 226, 230);
  doc.roundedRect(marginX, cursorY, contentWidth, 20, 1.5, 1.5, "FD");

  const statW = contentWidth / 4;
  // Stat 1: Candidate Score
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 110);
  doc.text("CLIENT SCORE", marginX + 4, cursorY + 6);
  doc.setFontSize(12);
  doc.setTextColor(180, 130, 20);
  doc.text(`${scoreVal} / 100`, marginX + 4, cursorY + 14);

  // Stat 2: Target Bar
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 110);
  doc.text("TARGET BENCHMARK", marginX + statW + 4, cursorY + 6);
  doc.setFontSize(12);
  doc.setTextColor(22, 101, 52);
  doc.text(`${targetBench} / 100`, marginX + statW + 4, cursorY + 14);

  // Stat 3: Applicant Pool Avg
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 110);
  doc.text("APPLICANT POOL AVG", marginX + statW * 2 + 4, cursorY + 6);
  doc.setFontSize(12);
  doc.setTextColor(70, 70, 80);
  doc.text(`${poolAvg} / 100`, marginX + statW * 2 + 4, cursorY + 14);

  // Stat 4: Points Gap
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 110);
  doc.text("POINTS TO TARGET", marginX + statW * 3 + 4, cursorY + 6);
  doc.setFontSize(12);
  doc.setTextColor(ptsToTarget >= 0 ? 22 : 185, ptsToTarget >= 0 ? 101 : 28, ptsToTarget >= 0 ? 52 : 28);
  doc.text(`${ptsToTarget >= 0 ? "+" + ptsToTarget : ptsToTarget} pts`, marginX + statW * 3 + 4, cursorY + 14);

  cursorY += 24;

  // Verdict & Alignment Summary
  if (report.scorecard?.verdict) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(140, 115, 25);
    doc.text("VERDICT: " + report.scorecard.verdict, marginX, cursorY);
    cursorY += 4.5;
  }

  if (report.alignmentSummary) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(55, 55, 65);
    const summaryLines = doc.splitTextToSize(report.alignmentSummary, contentWidth);
    doc.text(summaryLines, marginX, cursorY);
    cursorY += summaryLines.length * 4 + 4;
  }

  // Score Categories Table (if available)
  if (report.scorecard?.categories && report.scorecard.categories.length > 0) {
    checkPageBreak(38);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 40);
    doc.text("Score Category Breakdown", marginX, cursorY);
    cursorY += 3.5;

    // Table Header
    doc.setFillColor(235, 237, 242);
    doc.rect(marginX, cursorY, contentWidth, 5.5, "F");
    doc.setFontSize(7);
    doc.setTextColor(60, 60, 70);
    doc.text("EVALUATION CATEGORY", marginX + 3, cursorY + 4);
    doc.text("SCORE", marginX + 75, cursorY + 4);
    doc.text("BENCHMARK", marginX + 98, cursorY + 4);
    doc.text("DELTA", marginX + 124, cursorY + 4);
    doc.text("STATUS", marginX + 145, cursorY + 4);
    doc.text("POTENTIAL GAIN", marginX + contentWidth - 3, cursorY + 4, { align: "right" });
    cursorY += 6;

    report.scorecard.categories.slice(0, 5).forEach((cat) => {
      checkPageBreak(6);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(25, 25, 30);
      doc.text(cat.category, marginX + 3, cursorY + 4);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(40, 40, 50);
      doc.text(`${cat.clientScore} / 100`, marginX + 75, cursorY + 4);
      doc.text(`${cat.targetBenchmark} / 100`, marginX + 98, cursorY + 4);

      doc.setFont("helvetica", "bold");
      const deltaStr = cat.pointsDelta >= 0 ? `+${cat.pointsDelta}` : `${cat.pointsDelta}`;
      if (cat.pointsDelta >= 0) {
        doc.setTextColor(22, 101, 52);
      } else {
        doc.setTextColor(185, 28, 28);
      }
      doc.text(deltaStr, marginX + 124, cursorY + 4);

      doc.setFontSize(7);
      doc.setTextColor(60, 60, 70);
      doc.text(cat.status, marginX + 145, cursorY + 4);

      doc.setTextColor(140, 115, 25);
      doc.text(`+${cat.potentialGain} pts`, marginX + contentWidth - 3, cursorY + 4, { align: "right" });

      doc.setDrawColor(240, 240, 245);
      doc.line(marginX, cursorY + 5.5, marginX + contentWidth, cursorY + 5.5);
      cursorY += 6;
    });
    cursorY += 4;
  }

  // =========================================================================
  // EXECUTIVE SNAPSHOT: STRENGTHS & KEY GAPS
  // =========================================================================
  checkPageBreak(50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 25);
  doc.text("2. Executive Snapshot: Strengths & Identified Gaps", marginX, cursorY);
  cursorY += 4.5;

  const halfW = (contentWidth - 6) / 2;

  // Left: Strengths Box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(marginX, cursorY, halfW, 46, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(22, 101, 52);
  doc.text("PROVEN ASSETS & STRENGTHS", marginX + 4, cursorY + 6);

  let strY = cursorY + 11;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(30, 40, 30);
  report.strengths.slice(0, 4).forEach((str) => {
    const wrapped = doc.splitTextToSize(`• ${str}`, halfW - 8);
    doc.text(wrapped, marginX + 4, strY);
    strY += wrapped.length * 3.6 + 1.2;
  });

  // Right: Gaps Box
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(254, 240, 138);
  doc.roundedRect(marginX + halfW + 6, cursorY, halfW, 46, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(140, 115, 25);
  doc.text("AREAS TO BRIDGE (KEY Gaps)", marginX + halfW + 10, cursorY + 6);

  let gapY = cursorY + 11;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(50, 45, 20);
  report.gaps.slice(0, 4).forEach((gap) => {
    const wrapped = doc.splitTextToSize(`• ${gap}`, halfW - 8);
    doc.text(wrapped, marginX + halfW + 10, gapY);
    gapY += wrapped.length * 3.6 + 1.2;
  });

  cursorY += 52;

  // =========================================================================
  // PAGE 2: DIAGNOSTICS & WHAT MAKES IT GOOD
  // =========================================================================
  if (report.diagnostics) {
    checkPageBreak(70);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 25);
    doc.text("3. Candidate Diagnostic Signals & Recruiter Mental Model", marginX, cursorY);
    cursorY += 4.5;

    // Good Signals
    if (report.diagnostics.goodSignals && report.diagnostics.goodSignals.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(22, 101, 52);
      doc.text("Positive Signals Detected in Resume", marginX, cursorY);
      cursorY += 3.5;

      report.diagnostics.goodSignals.slice(0, 3).forEach((sig) => {
        checkPageBreak(16);
        doc.setFillColor(245, 250, 245);
        doc.setDrawColor(200, 235, 210);
        doc.roundedRect(marginX, cursorY, contentWidth, 14, 1, 1, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(20, 20, 25);
        doc.text(sig.title, marginX + 3, cursorY + 4.5);

        doc.setFontSize(7);
        doc.setTextColor(22, 101, 52);
        doc.text(sig.scoreImpact || "+10 pts", marginX + contentWidth - 3, cursorY + 4.5, { align: "right" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.2);
        doc.setTextColor(70, 70, 80);
        const evLines = doc.splitTextToSize(`Evidence: ${sig.evidence}`, contentWidth - 8);
        doc.text(evLines, marginX + 3, cursorY + 9);

        cursorY += 16;
      });
    }

    // Bad Patterns
    if (report.diagnostics.badPatterns && report.diagnostics.badPatterns.length > 0) {
      checkPageBreak(25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(185, 28, 28);
      doc.text("Friction Points & Flaws Dragging Down Score", marginX, cursorY);
      cursorY += 3.5;

      report.diagnostics.badPatterns.slice(0, 3).forEach((pat) => {
        checkPageBreak(16);
        doc.setFillColor(254, 242, 242);
        doc.setDrawColor(254, 202, 202);
        doc.roundedRect(marginX, cursorY, contentWidth, 14, 1, 1, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(20, 20, 25);
        doc.text(pat.title, marginX + 3, cursorY + 4.5);

        doc.setFontSize(7);
        doc.setTextColor(185, 28, 28);
        doc.text(`${pat.severity} • ${pat.scoreDrag}`, marginX + contentWidth - 3, cursorY + 4.5, { align: "right" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.2);
        doc.setTextColor(70, 70, 80);
        const flawLines = doc.splitTextToSize(`Flaw: ${pat.flaw} (${pat.whyItHurts})`, contentWidth - 8);
        doc.text(flawLines, marginX + 3, cursorY + 9);

        cursorY += 16;
      });
    }

    // Work On Items
    if (report.diagnostics.workOnItems && report.diagnostics.workOnItems.length > 0) {
      checkPageBreak(25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(140, 115, 25);
      doc.text("Targeted Improvement Items (Point Uplift Opportunities)", marginX, cursorY);
      cursorY += 3.5;

      report.diagnostics.workOnItems.slice(0, 3).forEach((wo) => {
        checkPageBreak(16);
        doc.setFillColor(253, 250, 238);
        doc.setDrawColor(245, 230, 160);
        doc.roundedRect(marginX, cursorY, contentWidth, 14, 1, 1, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(20, 20, 25);
        doc.text(wo.area, marginX + 3, cursorY + 4.5);

        doc.setFontSize(7);
        doc.setTextColor(140, 115, 25);
        doc.text(`Target Gain: ${wo.targetGain} • Timeframe: ${wo.timeframe}`, marginX + contentWidth - 3, cursorY + 4.5, { align: "right" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.2);
        doc.setTextColor(70, 70, 80);
        const actLines = doc.splitTextToSize(`Action: ${wo.specificAction}`, contentWidth - 8);
        doc.text(actLines, marginX + 3, cursorY + 9);

        cursorY += 16;
      });
    }

    // What Makes It Good Principle
    if (report.diagnostics.whatMakesItGood && report.diagnostics.whatMakesItGood.length > 0) {
      checkPageBreak(30);
      const principle = report.diagnostics.whatMakesItGood[0];
      doc.setFillColor(248, 249, 251);
      doc.setDrawColor(212, 175, 55);
      doc.roundedRect(marginX, cursorY, contentWidth, 26, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(140, 115, 25);
      doc.text(`PRO PRINCIPLE: ${principle.ruleName} (${principle.pointUplift})`, marginX + 3, cursorY + 5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(185, 28, 28);
      const badL = doc.splitTextToSize(`❌ Weak: "${principle.badSnippet}"`, contentWidth - 8);
      doc.text(badL, marginX + 3, cursorY + 10);

      doc.setTextColor(22, 101, 52);
      const goodL = doc.splitTextToSize(`✓ Strong: "${principle.goodSnippet}"`, contentWidth - 8);
      doc.text(goodL, marginX + 3, cursorY + 16);

      doc.setTextColor(80, 80, 90);
      doc.text(`Mental Model: ${principle.recruiterMentalModel}`, marginX + 3, cursorY + 22);

      cursorY += 30;
    }
  }

  // =========================================================================
  // PAGE 3: TECHNICAL SKILL GAPS
  // =========================================================================
  checkPageBreak(45);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 25);
  doc.text("4. In-Depth Technical Skill Gap Matrix", marginX, cursorY);
  cursorY += 4.5;

  if (report.skillGaps && report.skillGaps.length > 0) {
    // Table Header
    doc.setFillColor(235, 237, 242);
    doc.rect(marginX, cursorY, contentWidth, 5.5, "F");
    doc.setFontSize(7);
    doc.setTextColor(60, 60, 70);
    doc.text("SKILL REQUIREMENT", marginX + 3, cursorY + 4);
    doc.text("CURRENT EVIDENCE", marginX + 60, cursorY + 4);
    doc.text("GAP SEVERITY", marginX + 105, cursorY + 4);
    doc.text("RECOMMENDED ACTION", marginX + 138, cursorY + 4);
    cursorY += 6;

    report.skillGaps.slice(0, 7).forEach((sg) => {
      checkPageBreak(9);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(25, 25, 30);
      doc.text(sg.skill, marginX + 3, cursorY + 4);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(60, 60, 70);
      doc.text(`${sg.currentEvidence} (${sg.currentScore}%)`, marginX + 60, cursorY + 4);

      doc.setFont("helvetica", "bold");
      if (sg.gap === "High") {
        doc.setTextColor(185, 28, 28);
      } else if (sg.gap === "Medium") {
        doc.setTextColor(180, 130, 20);
      } else {
        doc.setTextColor(22, 101, 52);
      }
      doc.text(sg.gap + " Gap", marginX + 105, cursorY + 4);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(60, 60, 70);
      const recLines = doc.splitTextToSize(sg.recommendation, contentWidth - 140);
      doc.text(recLines[0] || "", marginX + 138, cursorY + 4);

      doc.setDrawColor(240, 240, 245);
      doc.line(marginX, cursorY + 6, marginX + contentWidth, cursorY + 6);
      cursorY += 7;
    });
    cursorY += 5;
  }

  // =========================================================================
  // RECOMMENDED PROJECTS TO BRIDGE GAPS
  // =========================================================================
  if (report.projectRecommendations && report.projectRecommendations.length > 0) {
    checkPageBreak(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 25);
    doc.text("5. Recommended Strategic Portfolio Projects", marginX, cursorY);
    cursorY += 4.5;

    report.projectRecommendations.slice(0, 3).forEach((proj, idx) => {
      checkPageBreak(24);
      doc.setFillColor(248, 249, 251);
      doc.setDrawColor(220, 220, 230);
      doc.roundedRect(marginX, cursorY, contentWidth, 22, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(20, 20, 25);
      doc.text(`Project 0${idx + 1}: ${proj.title}`, marginX + 4, cursorY + 5);

      doc.setFontSize(7);
      doc.setTextColor(140, 115, 25);
      doc.text(`Difficulty: ${proj.difficulty}`, marginX + contentWidth - 4, cursorY + 5, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.2);
      doc.setTextColor(60, 60, 70);
      const techStr = `Demonstrates: ${proj.skillsDemonstrated.join(", ")}`;
      doc.text(techStr, marginX + 4, cursorY + 10);

      const specLines = doc.splitTextToSize(`Specs: ${proj.whatItShouldContain}`, contentWidth - 8);
      doc.text(specLines[0] || "", marginX + 4, cursorY + 15);

      const whyLines = doc.splitTextToSize(`Why it strengthens: ${proj.whyItStrengthens}`, contentWidth - 8);
      doc.text(whyLines[0] || "", marginX + 4, cursorY + 19);

      cursorY += 25;
    });
  }

  // =========================================================================
  // RESUME BULLET REWRITES (BEFORE & AFTER)
  // =========================================================================
  if (report.resumeImprovements && report.resumeImprovements.length > 0) {
    checkPageBreak(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 25);
    doc.text("6. High-Impact Resume Rewrite Transformations", marginX, cursorY);
    cursorY += 4.5;

    report.resumeImprovements.slice(0, 3).forEach((imp) => {
      checkPageBreak(28);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(220, 220, 230);
      doc.roundedRect(marginX, cursorY, contentWidth, 26, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(140, 115, 25);
      doc.text(`SECTION: ${imp.section.toUpperCase()}`, marginX + 3, cursorY + 4.5);

      // Before
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(185, 28, 28);
      const beforeLines = doc.splitTextToSize(`Before: "${imp.before}"`, contentWidth - 8);
      doc.text(beforeLines, marginX + 3, cursorY + 9);

      // After
      const afterStart = cursorY + 9 + beforeLines.length * 3.5;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(22, 101, 52);
      const afterLines = doc.splitTextToSize(`After: "${imp.after}"`, contentWidth - 8);
      doc.text(afterLines, marginX + 3, afterStart);

      // Rationale
      const ratStart = afterStart + afterLines.length * 3.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      doc.setTextColor(100, 100, 110);
      const ratLines = doc.splitTextToSize(`Rationale: ${imp.rationale}`, contentWidth - 8);
      doc.text(ratLines[0] || "", marginX + 3, ratStart);

      cursorY = ratStart + 6;
    });
  }

  // =========================================================================
  // CAREER ROADMAP & 5 IMMEDIATE ACTIONS
  // =========================================================================
  if (report.roadmap && report.roadmap.length > 0) {
    checkPageBreak(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 25);
    doc.text("7. Career Gap Bridging Roadmap", marginX, cursorY);
    cursorY += 4.5;

    report.roadmap.forEach((phase) => {
      checkPageBreak(16);
      doc.setFillColor(248, 249, 251);
      doc.setDrawColor(212, 175, 55);
      doc.roundedRect(marginX, cursorY, contentWidth, 14, 1, 1, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(20, 20, 25);
      doc.text(`Phase 0${phase.phaseNumber}: ${phase.title}`, marginX + 3, cursorY + 4.5);

      doc.setFontSize(7);
      doc.setTextColor(140, 115, 25);
      doc.text(`Duration: ${phase.duration}`, marginX + contentWidth - 3, cursorY + 4.5, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(70, 70, 80);
      const msStr = phase.milestones.join(" • ");
      const msLines = doc.splitTextToSize(msStr, contentWidth - 8);
      doc.text(msLines[0] || "", marginX + 3, cursorY + 9.5);

      cursorY += 16;
    });
  }

  if (report.nextFiveActions && report.nextFiveActions.length > 0) {
    checkPageBreak(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 25);
    doc.text("8. Immediate 5-Step Action Checklist", marginX, cursorY);
    cursorY += 4.5;

    report.nextFiveActions.forEach((act) => {
      checkPageBreak(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(140, 115, 25);
      doc.text(`Step 0${act.step} [${act.category}]`, marginX + 3, cursorY + 3.5);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(20, 20, 25);
      doc.text(act.action, marginX + 32, cursorY + 3.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 90);
      const detLines = doc.splitTextToSize(act.detail, contentWidth - 8);
      doc.text(detLines[0] || "", marginX + 3, cursorY + 7.5);

      doc.setDrawColor(240, 240, 245);
      doc.line(marginX, cursorY + 9.5, marginX + contentWidth, cursorY + 9.5);
      cursorY += 11;
    });
  }

  // =========================================================================
  // ATS READABILITY CHECKLIST
  // =========================================================================
  if (report.readabilityChecklist && report.readabilityChecklist.length > 0) {
    checkPageBreak(35);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 25);
    doc.text("9. ATS Parsing & Readability Inspection", marginX, cursorY);
    cursorY += 4.5;

    const readW = (contentWidth - 4) / 2;
    report.readabilityChecklist.slice(0, 6).forEach((item, idx) => {
      const isRight = idx % 2 === 1;
      const x = isRight ? marginX + readW + 4 : marginX;

      if (!isRight) {
        checkPageBreak(13);
      }

      doc.setFillColor(248, 249, 251);
      doc.setDrawColor(230, 230, 235);
      doc.roundedRect(x, cursorY, readW, 11, 1, 1, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(20, 20, 25);
      doc.text(item.category, x + 3, cursorY + 4);

      if (item.status === "Good") {
        doc.setTextColor(22, 101, 52);
      } else if (item.status === "Improve") {
        doc.setTextColor(180, 130, 20);
      } else {
        doc.setTextColor(185, 28, 28);
      }
      doc.text(item.status.toUpperCase(), x + readW - 3, cursorY + 4, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(90, 90, 100);
      const comLines = doc.splitTextToSize(item.comment, readW - 6);
      doc.text(comLines[0] || "", x + 3, cursorY + 8);

      if (isRight || idx === report.readabilityChecklist.length - 1) {
        cursorY += 13;
      }
    });
  }

  // Draw footer on final page
  drawFooter();

  // Generate safe download filename
  const cleanRole = (report.targetRole || "Role").replace(/[^a-zA-Z0-9_-]/g, "_");
  const cleanCompany = (report.targetCompany || "Analysis").replace(/[^a-zA-Z0-9_-]/g, "_");
  const defaultFileName = `Career_Gap_Report_${cleanRole}_${cleanCompany}.pdf`;
  const finalFileName = options?.fileName || defaultFileName;

  doc.save(finalFileName);
  return finalFileName;
}
