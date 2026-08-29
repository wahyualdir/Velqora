import { RawDocumentExtraction } from "./types";

/**
 * PDF Document (.pdf) Parser
 * Extracts text and pages from text-based PDFs.
 * Detects scanned/empty PDFs safely.
 */
export async function parsePdfDocument(
  buffer: Buffer,
  fileName: string
): Promise<RawDocumentExtraction> {
  try {
    if (!buffer || buffer.length < 4 || buffer.toString("ascii", 0, 4) !== "%PDF") {
      throw new Error("Berkas PDF tidak valid atau rusak (format PDF header tidak ditemukan).");
    }

    // Dynamic import to handle diverse bundle environments
    let PDFParseClass: any = null;
    const pdfModule = await import("pdf-parse");
    PDFParseClass = (pdfModule as any).PDFParse || (pdfModule as any).default || pdfModule;

    let rawText = "";
    let pageCount = 1;
    const fragments: Array<{ pageOrRow: string; text: string }> = [];

    if (typeof PDFParseClass === "function") {
      try {
        const parser = new PDFParseClass({ data: buffer });
        const parsed = await parser.getText();

        if (parsed && typeof parsed === "object" && parsed.pages) {
          rawText = parsed.text || "";
          pageCount = parsed.total || parsed.pages.length || 1;

          parsed.pages.forEach((p: { text?: string; num?: number }, idx: number) => {
            const pageText = (p.text || "").trim();
            if (pageText) {
              fragments.push({
                pageOrRow: `Halaman ${p.num || idx + 1}`,
                text: pageText,
              });
            }
          });
        } else if (typeof parsed === "string") {
          rawText = parsed;
        }
      } catch {
        // Fallback to calling as function if class invocation differs
        const parsed = await PDFParseClass(buffer);
        rawText = parsed?.text || "";
        pageCount = parsed?.numpages || 1;
      }
    }

    // Clean text and check if scanned
    const cleanText = rawText
      .replace(/\u0000/g, "")
      .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .trim();

    const isScanned = cleanText.length < 15;

    if (!isScanned && fragments.length === 0) {
      const pages = cleanText.split(/\n\s*\n\s*\n/);
      pages.forEach((p, idx) => {
        const trimmed = p.trim();
        if (trimmed) {
          fragments.push({
            pageOrRow: `Halaman ${idx + 1}`,
            text: trimmed,
          });
        }
      });
    }

    return {
      fileName,
      mimeType: "application/pdf",
      size: buffer.length,
      extractedText: cleanText,
      pageCount,
      isScanned,
      fragments,
    };
  } catch (err: any) {
    throw new Error(`Gagal membaca berkas PDF: ${err.message || String(err)}`);
  }
}
