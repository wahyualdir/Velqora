"use server";

import { assertAdminAccess } from "@/actions/study/notes-bulk-import";
import {
  convertFileBufferToMarkdown,
  type ConversionResult,
} from "@/lib/import/file-to-markdown";

export type { ConversionResult };

/**
 * Server Action: Konversi berkas non-markdown (.ipynb, .docx, .pptx, .pdf)
 * menjadi format Markdown murni secara deterministik tanpa AI/LLM.
 * Akses dibatasi secara ketat hanya untuk Admin/Owner.
 */
export async function convertUploadedFileToMarkdown(input: {
  filename: string;
  base64: string;
}): Promise<ConversionResult> {
  await assertAdminAccess();

  if (!input || !input.filename || typeof input.base64 !== "string") {
    throw new Error("Parameter berkas atau data base64 tidak valid.");
  }

  // Sanitize filename to prevent directory traversal
  const cleanFilename = input.filename.replace(/[/\\?%*:|"<>]/g, "").trim() || "document";

  const buffer = Buffer.from(input.base64, "base64");
  return convertFileBufferToMarkdown(cleanFilename, buffer);
}
