import { RawDocumentExtraction, FileValidationResult } from "./types";
import { parseTextDocument } from "./text-parser";
import { parseCsvDocument } from "./csv-parser";
import { parseDocxDocument } from "./docx-parser";
import { parseXlsxDocument } from "./xlsx-parser";
import { parsePdfDocument } from "./pdf-parser";
import { parseImageDocument } from "./image-parser";

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

const ALLOWED_EXTENSIONS = new Set([
  "pdf",
  "docx",
  "doc",
  "xlsx",
  "xls",
  "csv",
  "tsv",
  "txt",
  "jpg",
  "jpeg",
  "png",
  "webp",
]);

/**
 * Validates uploaded schedule document before parsing
 */
export function validateScheduleFile(
  fileName: string,
  mimeType: string,
  fileSizeBytes: number
): FileValidationResult {
  const sanitized = sanitizeFileName(fileName);
  const ext = (sanitized.split(".").pop() || "").toLowerCase();

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      isValid: false,
      sanitizedFileName: sanitized,
      fileExtension: ext,
      mimeType,
      fileSize: fileSizeBytes,
      error: `Format berkas (.${ext}) tidak didukung. Silakan gunakan PDF, DOCX, XLSX, CSV, TXT, JPG, atau PNG.`,
    };
  }

  if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      sanitizedFileName: sanitized,
      fileExtension: ext,
      mimeType,
      fileSize: fileSizeBytes,
      error: `Ukuran berkas (${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimal 15 MB.`,
    };
  }

  if (fileSizeBytes <= 0) {
    return {
      isValid: false,
      sanitizedFileName: sanitized,
      fileExtension: ext,
      mimeType,
      fileSize: fileSizeBytes,
      error: "Berkas kosong (0 bytes). Silakan unggah dokumen yang valid.",
    };
  }

  return {
    isValid: true,
    sanitizedFileName: sanitized,
    fileExtension: ext,
    mimeType,
    fileSize: fileSizeBytes,
  };
}

/**
 * Parses any supported document type into RawDocumentExtraction
 */
export async function parseScheduleDocument(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<RawDocumentExtraction> {
  const validation = validateScheduleFile(fileName, mimeType, buffer.length);
  if (!validation.isValid) {
    throw new Error(validation.error || "Berkas tidak valid.");
  }

  const ext = validation.fileExtension;

  switch (ext) {
    case "txt":
      return parseTextDocument(buffer, validation.sanitizedFileName);

    case "csv":
    case "tsv":
      return parseCsvDocument(buffer, validation.sanitizedFileName);

    case "docx":
    case "doc":
      return parseDocxDocument(buffer, validation.sanitizedFileName);

    case "xlsx":
    case "xls":
      return parseXlsxDocument(buffer, validation.sanitizedFileName);

    case "pdf":
      return parsePdfDocument(buffer, validation.sanitizedFileName);

    case "jpg":
    case "jpeg":
    case "png":
    case "webp":
      return parseImageDocument(buffer, validation.sanitizedFileName, mimeType);

    default:
      throw new Error(`Ekstensi berkas .${ext} belum didukung.`);
  }
}

/**
 * Sanitizes filename preventing directory traversal and null bytes
 */
export function sanitizeFileName(name: string): string {
  // Extract pure basename
  const basename = name.split(/[/\\]/).pop() || name;
  return basename
    .replace(/\0/g, "")
    .replace(/[\\/:\*\?"<>\|]/g, "_")
    .replace(/\.\.+/g, ".")
    .trim();
}

