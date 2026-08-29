import { ScheduleItem } from "@/types";
import { ImportPipelineResult, ExtractedScheduleItem } from "./types";
import { parseScheduleDocument } from "./parser";
import { classifyScheduleDocument } from "./classifier";
import { structureScheduleWithAI } from "./ai-structuring";
import { normalizeExtractedScheduleItem } from "./normalizer";
import { detectAllScheduleConflicts } from "./conflict-engine";
import { generateCorrelationId, logger } from "@/lib/observability";

export * from "./types";
export * from "./schema";
export * from "./parser";
export * from "./classifier";
export * from "./ocr-provider";
export * from "./table-structuring";
export * from "./evidence";
export * from "./confidence-engine";
export * from "./normalizer";
export * from "./conflict-engine";
export * from "./ai-structuring";

import { defaultOCRProvider } from "./ocr-provider";

/**
 * Full End-to-End Schedule Import Pipeline (FASE 28)
 * FLOW: Uploaded Buffer -> Parser -> OCR Check -> Classifier -> AI/Table Structuring -> Normalization -> Conflict Engine -> Review Payload
 */
export async function processScheduleDocumentImport(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  existingSchedules: ScheduleItem[] = [],
  providedCorrelationId?: string
): Promise<ImportPipelineResult> {
  const correlationId = providedCorrelationId || generateCorrelationId("sched_imp");
  const startTime = Date.now();

  logger.info(
    "SCHEDULE_IMPORT_PIPELINE",
    `Starting schedule import for "${fileName}" (${mimeType}, ${fileBuffer.length} bytes)`,
    { fileName, size: fileBuffer.length },
    correlationId
  );

  try {
    // 1. Parse raw document
    const rawDoc = await parseScheduleDocument(fileBuffer, fileName, mimeType);

    if (rawDoc.isScanned && !process.env.GEMINI_API_KEY && !rawDoc.metadata?.isImage) {
      if (!defaultOCRProvider.isAvailable()) {
        return {
          success: false,
          correlationId,
          fileName,
          totalFound: 0,
          verifiedCount: 0,
          needsReviewCount: 0,
          invalidCount: 0,
          conflictCount: 0,
          items: [],
          isScannedDocument: true,
          error: "PDF ini berupa hasil scan. Teks jadwal belum dapat dibaca secara langsung tanpa OCR.",
        };
      }
    }

    // 2. Classify Document (Classification 2.0)
    const classification = classifyScheduleDocument(rawDoc.extractedText, fileName);

    if (
      !classification.isSchedule &&
      (classification.canonicalCategory === "NON_SCHEDULE" ||
        classification.canonicalCategory === "EMPTY_DOCUMENT" ||
        classification.category === "unrelated_document" ||
        classification.category === "EMPTY_DOCUMENT")
    ) {
      logger.warn(
        "SCHEDULE_IMPORT_PIPELINE",
        `Document classified as non-schedule: ${classification.reason}`,
        { fileName, classification },
        correlationId
      );

      return {
        success: true,
        correlationId,
        fileName,
        classification,
        totalFound: 0,
        verifiedCount: 0,
        needsReviewCount: 0,
        invalidCount: 0,
        conflictCount: 0,
        items: [],
        rawTextPreview: rawDoc.extractedText.slice(0, 500),
        warnings: [
          classification.canonicalCategory === "EMPTY_DOCUMENT"
            ? "Dokumen kosong atau tidak memiliki teks yang cukup untuk dianalisis."
            : "Dokumen ini belum dapat dikenali sebagai jadwal akademik.",
          classification.reason,
        ],
      };
    }

    // 3. AI / Structural Table Structuring
    const structured = await structureScheduleWithAI(rawDoc, correlationId);

    if (!structured.items || structured.items.length === 0) {
      return {
        success: true,
        correlationId,
        fileName,
        classification,
        totalFound: 0,
        verifiedCount: 0,
        needsReviewCount: 0,
        invalidCount: 0,
        conflictCount: 0,
        items: [],
        rawTextPreview: rawDoc.extractedText.slice(0, 500),
        warnings: ["Dokumen berhasil dibaca, tetapi tidak ditemukan pola jadwal yang cukup kuat."],
      };
    }

    // 4. Deterministic Normalization & Evidence Generation
    const normalizedItems: ExtractedScheduleItem[] = structured.items.map((rawItem, idx) => {
      const fragmentTrace = rawDoc.fragments?.[idx]?.pageOrRow;
      const trace = (fragmentTrace !== undefined ? String(fragmentTrace) : undefined) || rawItem.sourceTrace || `Baris ${idx + 1}`;
      const itemWithTrace = { ...rawItem, sourceTrace: trace };
      return normalizeExtractedScheduleItem(itemWithTrace, idx);
    });

    // 5. Deterministic Conflict and Duplicate Detection
    const analyzedItems = detectAllScheduleConflicts(normalizedItems, existingSchedules);

    // 6. Compute Statistics
    const verifiedCount = analyzedItems.filter((i) => i.confidence === "verified" && !i.hasConflict && !i.isDuplicate).length;
    const needsReviewCount = analyzedItems.filter((i) => (i.confidence === "needs_review" || i.hasConflict || i.isDuplicate) && i.confidence !== "invalid").length;
    const invalidCount = analyzedItems.filter((i) => i.confidence === "invalid").length;
    const conflictCount = analyzedItems.filter((i) => i.hasConflict || i.isDuplicate).length;

    const durationMs = Date.now() - startTime;
    logger.info(
      "SCHEDULE_IMPORT_PIPELINE",
      `Schedule import completed in ${durationMs}ms: ${analyzedItems.length} found, ${verifiedCount} verified, ${conflictCount} conflicts.`,
      { total: analyzedItems.length, verifiedCount, conflictCount, classification: classification.category },
      correlationId
    );

    return {
      success: true,
      correlationId,
      fileName,
      classification,
      totalFound: analyzedItems.length,
      verifiedCount,
      needsReviewCount,
      invalidCount,
      conflictCount,
      items: analyzedItems,
      rawTextPreview: rawDoc.extractedText.slice(0, 500),
    };
  } catch (err: any) {
    logger.error(
      "SCHEDULE_IMPORT_PIPELINE",
      `Schedule import failed: ${err.message || String(err)}`,
      err,
      { fileName },
      correlationId
    );

    return {
      success: false,
      correlationId,
      fileName,
      totalFound: 0,
      verifiedCount: 0,
      needsReviewCount: 0,
      invalidCount: 0,
      conflictCount: 0,
      items: [],
      error: err.message || "Terjadi kesalahan saat memproses dokumen jadwal.",
    };
  }
}
