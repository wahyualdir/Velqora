import { ParsedDocumentOutput } from "./types";
import { parsePdfDocument } from "../schedule-import/pdf-parser";
import { parseDocxDocument } from "../schedule-import/docx-parser";
import { parseCsvDocument } from "../schedule-import/csv-parser";
import { parseTextDocument } from "../schedule-import/text-parser";
import { parseXlsxDocument } from "../schedule-import/xlsx-parser";
import { parseImageDocument } from "../schedule-import/image-parser";
import { validateScheduleFile, sanitizeFileName } from "../schedule-import/parser";

/**
 * Universal Document Parser for Academic Schedule Engine
 * Responsibilities: File format validation, secure text extraction, scanned PDF detection, stream safety.
 */
export async function parseDocument(
  fileInput: Buffer | ArrayBuffer | Uint8Array,
  fileName: string,
  mimeType?: string
): Promise<ParsedDocumentOutput> {
  const sanitizedName = sanitizeFileName(fileName);
  const buffer = Buffer.isBuffer(fileInput)
    ? fileInput
    : Buffer.from(fileInput as ArrayBuffer);

  const ext = (sanitizedName.split(".").pop() || "").toLowerCase();
  const effectiveMime = mimeType || "application/octet-stream";

  // 1. Validate File
  const validation = validateScheduleFile(sanitizedName, effectiveMime, buffer.length);
  if (!validation.isValid) {
    throw new Error(validation.error || "File tidak valid untuk pemrosesan jadwal.");
  }

  const warnings: string[] = [];

  // 2. Dispatch based on file type
  if (ext === "pdf" || effectiveMime === "application/pdf") {
    const parsed = await parsePdfDocument(buffer, sanitizedName);
    if (parsed.isScanned) {
      warnings.push("Dokumen PDF tampaknya merupakan hasil scan/gambar tanpa text layer.");
    }
    return {
      text: parsed.extractedText,
      sourceType: "pdf",
      pageCount: parsed.pageCount,
      isScanned: parsed.isScanned,
      warnings,
      metadata: parsed.metadata,
    };
  }

  if (ext === "docx" || effectiveMime.includes("wordprocessingml")) {
    const parsed = await parseDocxDocument(buffer, sanitizedName);
    return {
      text: parsed.extractedText,
      sourceType: "docx",
      warnings,
      metadata: parsed.metadata,
    };
  }

  if (ext === "xlsx" || ext === "xls" || effectiveMime.includes("spreadsheetml") || effectiveMime.includes("ms-excel")) {
    const parsed = await parseXlsxDocument(buffer, sanitizedName);
    return {
      text: parsed.extractedText,
      sourceType: "xlsx",
      pageCount: parsed.rowCount,
      warnings,
      metadata: parsed.metadata,
    };
  }

  if (ext === "csv" || ext === "tsv" || effectiveMime.includes("csv")) {
    const parsed = await parseCsvDocument(buffer, sanitizedName);
    return {
      text: parsed.extractedText,
      sourceType: "csv",
      pageCount: parsed.rowCount,
      warnings,
      metadata: parsed.metadata,
    };
  }

  if (["png", "jpg", "jpeg", "webp"].includes(ext) || effectiveMime.startsWith("image/")) {
    const parsed = await parseImageDocument(buffer, sanitizedName, effectiveMime);
    return {
      text: parsed.extractedText,
      sourceType: "image",
      warnings,
      metadata: parsed.metadata,
    };
  }

  // Default Plain Text
  const parsed = await parseTextDocument(buffer, sanitizedName);
  return {
    text: parsed.extractedText,
    sourceType: "txt",
    warnings,
    metadata: parsed.metadata,
  };
}
