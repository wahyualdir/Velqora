/**
 * PDF Renderer & Scanned Document Inspector
 * Velqora Intelligent Schedule Automation — FASE 29
 */

export interface PdfInspectionResult {
  isPdf: boolean;
  pageCount: number;
  hasTextLayer: boolean;
  isScannedPdf: boolean;
  isMixedPdf: boolean;
  extractedTextLength: number;
  pageTextSummary: Array<{ pageNumber: number; characterCount: number; isScanned: boolean }>;
}

/**
 * Inspects a PDF buffer to determine if it possesses a native text layer
 * or is an image-only scanned document.
 */
export function inspectPdfStructure(buffer: Buffer, extractedText: string = ""): PdfInspectionResult {
  if (!buffer || buffer.length < 5) {
    return {
      isPdf: false,
      pageCount: 0,
      hasTextLayer: false,
      isScannedPdf: false,
      isMixedPdf: false,
      extractedTextLength: 0,
      pageTextSummary: [],
    };
  }

  const isPdf = buffer.slice(0, 5).toString("ascii") === "%PDF-";
  if (!isPdf) {
    return {
      isPdf: false,
      pageCount: 0,
      hasTextLayer: false,
      isScannedPdf: false,
      isMixedPdf: false,
      extractedTextLength: 0,
      pageTextSummary: [],
    };
  }

  // Count page markers in binary stream
  const rawString = buffer.toString("binary");
  const matches = rawString.match(/\/Type\s*\/Page\b/g);
  const estimatedPages = matches ? Math.max(1, matches.length) : 1;

  const textLength = extractedText.trim().length;
  const isScanned = textLength < 15;
  const hasTextLayer = textLength >= 15;

  const pageSummary: Array<{ pageNumber: number; characterCount: number; isScanned: boolean }> = [];
  const textPerPage = Math.floor(textLength / estimatedPages);

  for (let i = 1; i <= estimatedPages; i++) {
    pageSummary.push({
      pageNumber: i,
      characterCount: textPerPage,
      isScanned: textPerPage < 15,
    });
  }

  const scannedPagesCount = pageSummary.filter((p) => p.isScanned).length;
  const isMixed = scannedPagesCount > 0 && scannedPagesCount < estimatedPages;

  return {
    isPdf: true,
    pageCount: estimatedPages,
    hasTextLayer,
    isScannedPdf: isScanned,
    isMixedPdf: isMixed,
    extractedTextLength: textLength,
    pageTextSummary: pageSummary,
  };
}
