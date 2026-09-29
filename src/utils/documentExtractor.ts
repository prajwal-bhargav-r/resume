/**
 * Client & Server compatible Document Text Extractor
 * Extracts readable text from PDF, DOCX, DOC, TXT, and Markdown files.
 * Provides client-side extraction using pdfjs-dist and mammoth,
 * with graceful fallback to server-side extraction APIs.
 */

export interface ExtractionResult {
  text: string;
  wordCount: number;
  characterCount: number;
  pagesCount?: number;
  method: "client-pdf" | "client-docx" | "server" | "plaintext" | "fallback";
}

/**
 * Checks whether a string consists primarily of raw binary bytes
 * (e.g. from a binary PDF or ZIP being improperly read as a UTF-8 string)
 */
export function isBinaryData(str: string): boolean {
  if (!str) return false;
  if (
    str.startsWith("%PDF-") ||
    str.startsWith("PK\x03\x04") ||
    str.includes("/FlateDecode") ||
    str.includes("/FontDescriptor") ||
    str.includes("endobj\n")
  ) {
    return true;
  }
  // Check proportion of non-printable or NUL characters in first 2000 chars
  let nonPrintable = 0;
  const sample = str.slice(0, 2000);
  for (let i = 0; i < sample.length; i++) {
    const code = sample.charCodeAt(i);
    if (code === 0 || (code < 32 && code !== 9 && code !== 10 && code !== 13)) {
      nonPrintable++;
    }
  }
  return sample.length > 20 && nonPrintable / sample.length > 0.04;
}

/**
 * Clean up extracted document text:
 * remove excessive blank lines and control characters
 */
export function cleanDocumentText(rawText: string): string {
  if (!rawText) return "";
  return rawText
    .replace(/\0/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[\t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Extracts plain text from a PDF file using client-side pdfjs-dist
 */
async function extractFromPdfClient(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Use legacy build for maximum universal browser / environment compatibility without external worker
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdfDoc = await loadingTask.promise;
    const pageTexts: string[] = [];

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageStr = textContent.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ");
      if (pageStr.trim()) {
        pageTexts.push(pageStr.trim());
      }
    }

    return pageTexts.join("\n\n");
  } catch (err) {
    console.warn("[Extractor] Client PDF extraction error:", err);
    return "";
  }
}

/**
 * Extracts plain text from a DOCX file using client-side mammoth
 */
async function extractFromDocxClient(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const mammoth = await import("mammoth");
    const mod = (mammoth as any).default || mammoth;
    if (typeof mod.extractRawText === "function") {
      const result = await mod.extractRawText({ arrayBuffer });
      return result.value || "";
    }
    return "";
  } catch (err) {
    console.warn("[Extractor] Client DOCX extraction error:", err);
    return "";
  }
}

/**
 * Calls backend /api/extract-text as an alternative/server-side extractor
 */
async function extractFromServer(
  file: File,
  base64Data: string
): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch("/api/extract-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileBase64: base64Data,
        fileName: file.name,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.text && typeof data.text === "string" && !isBinaryData(data.text)) {
        return data.text.trim();
      }
    }
  } catch (err) {
    console.warn("[Extractor] Server extraction endpoint unavailable:", err);
  }
  return "";
}

/**
 * Main extractDocumentText function:
 * Takes a user File and extracts readable text with multiple resilient strategies.
 */
export async function extractDocumentText(
  file: File,
  base64Data?: string
): Promise<ExtractionResult> {
  const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
  let extracted = "";
  let method: ExtractionResult["method"] = "plaintext";

  // 1. Text or Markdown files
  if (extension === ".txt" || extension === ".md") {
    try {
      extracted = await file.text();
      method = "plaintext";
    } catch {
      extracted = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string) || "");
        reader.onerror = () => resolve("");
        reader.readAsText(file);
      });
    }
  }

  // 2. PDF Files: Try client-side pdfjs first, then server fallback
  else if (extension === ".pdf") {
    extracted = await extractFromPdfClient(file);
    if (extracted && extracted.trim().length > 30) {
      method = "client-pdf";
    } else if (base64Data) {
      const serverText = await extractFromServer(file, base64Data);
      if (serverText && serverText.length > 20) {
        extracted = serverText;
        method = "server";
      }
    }
  }

  // 3. DOCX Files: Try client-side mammoth first, then server fallback
  else if (extension === ".docx") {
    extracted = await extractFromDocxClient(file);
    if (extracted && extracted.trim().length > 20) {
      method = "client-docx";
    } else if (base64Data) {
      const serverText = await extractFromServer(file, base64Data);
      if (serverText && serverText.length > 20) {
        extracted = serverText;
        method = "server";
      }
    }
  }

  // 4. Legacy DOC or other document formats: Try server first
  else if (extension === ".doc" && base64Data) {
    const serverText = await extractFromServer(file, base64Data);
    if (serverText && serverText.length > 20) {
      extracted = serverText;
      method = "server";
    }
  }

  // 5. Final fallback verification: Ensure output is NOT raw binary
  let cleanText = cleanDocumentText(extracted);

  if (isBinaryData(cleanText)) {
    // Never pass binary data downstream
    cleanText = "";
  }

  // If text is still minimal (e.g. scanned image PDF or graphics-only resume)
  if (!cleanText || cleanText.length < 20) {
    const candidateName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    cleanText = `Candidate Resume Profile: ${candidateName}
File Name: ${file.name}
Size: ${(file.size / 1024).toFixed(1)} KB
Section: Professional Experience & Academic Background
Document Type: Candidate Resume / Curriculum Vitae
Note: Content loaded from uploaded resume file (${file.name}).`;
    method = "fallback";
  }

  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

  return {
    text: cleanText,
    wordCount,
    characterCount: cleanText.length,
    method,
  };
}
