export * from "./types";
export * from "./academic-constants";
export * from "./document-parser";
export * from "./schedule-extractor";
export * from "./schedule-validator";
export * from "./conflict-detector";

import { ExtractedSchedule } from "./types";
import { ScheduleItem } from "@/types";
import { parseDocument } from "./document-parser";
import { extractSchedules } from "./schedule-extractor";
import { detectConflicts } from "./conflict-detector";
import { validateBatchSchedules } from "./schedule-validator";

/**
 * End-to-End Schedule Pipeline
 * 1. Validate & Parse File
 * 2. Extract & Normalize Items (AI / Heuristic)
 * 3. Validate Each Item
 * 4. Detect Conflicts & Duplicates against Database & Batch
 */
export async function processScheduleDocument(
  fileInput: Buffer | ArrayBuffer,
  fileName: string,
  mimeType?: string,
  existingSchedules: ScheduleItem[] = [],
  correlationId?: string
): Promise<{
  success: boolean;
  fileName: string;
  sourceType: string;
  isScanned?: boolean;
  warnings: string[];
  items: ExtractedSchedule[];
  stats: {
    totalFound: number;
    validCount: number;
    invalidCount: number;
    conflictCount: number;
  };
  error?: string;
}> {
  try {
    // 1. Parse File
    const parsedDoc = await parseDocument(fileInput, fileName, mimeType);

    // 2. Extract & Normalize Schedules
    const rawCandidates = await extractSchedules(parsedDoc, correlationId);

    // 3. Validate Schedules
    const { results } = validateBatchSchedules(rawCandidates);
    const validatedCandidates = results.map((r) => ({
      ...r.item,
      isValid: r.validation.valid,
      validationErrors: r.validation.errors.length > 0 ? r.validation.errors : undefined,
      validationWarnings: r.validation.warnings.length > 0 ? r.validation.warnings : undefined,
    }));

    // 4. Detect Conflicts
    const analyzedItems = detectConflicts(validatedCandidates, existingSchedules);

    const validCount = analyzedItems.filter((i) => i.isValid && !i.hasConflict).length;
    const invalidCount = analyzedItems.filter((i) => !i.isValid).length;
    const conflictCount = analyzedItems.filter((i) => i.hasConflict).length;

    return {
      success: true,
      fileName,
      sourceType: parsedDoc.sourceType,
      isScanned: parsedDoc.isScanned,
      warnings: parsedDoc.warnings,
      items: analyzedItems,
      stats: {
        totalFound: analyzedItems.length,
        validCount,
        invalidCount,
        conflictCount,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      fileName,
      sourceType: "unknown",
      warnings: [],
      items: [],
      stats: {
        totalFound: 0,
        validCount: 0,
        invalidCount: 0,
        conflictCount: 0,
      },
      error: err.message || "Gagal memproses dokumen jadwal.",
    };
  }
}
