import { RawDocumentExtraction } from "./types";

/**
 * Text Document Parser (.txt)
 * Handles character encoding, removes binary null bytes, splits lines & fragments.
 */
export async function parseTextDocument(
  buffer: Buffer,
  fileName: string
): Promise<RawDocumentExtraction> {
  // Decode text safely
  let text = "";
  try {
    text = buffer.toString("utf-8");
  } catch {
    text = buffer.toString("latin1");
  }

  // Sanitize null bytes & control chars (except standard newlines/tabs)
  const sanitized = text
    .replace(/\u0000/g, "")
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();

  const lines = sanitized.split(/\r?\n/).filter((l) => l.trim().length > 0);

  const fragments = lines.map((line, idx) => ({
    pageOrRow: `Baris ${idx + 1}`,
    text: line.trim(),
  }));

  return {
    fileName,
    mimeType: "text/plain",
    size: buffer.length,
    extractedText: sanitized,
    rowCount: lines.length,
    isScanned: false,
    fragments,
  };
}
