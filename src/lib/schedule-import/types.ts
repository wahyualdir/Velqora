/**
 * Schedule Import & Extraction Type Definitions
 * Velqora Academic Workspace — FASE 26
 */

export type ScheduleConfidence = "verified" | "needs_review" | "invalid" | "low_confidence";

export type ConfidenceTier = "HIGH_CONFIDENCE" | "REVIEW_REQUIRED" | "LOW_CONFIDENCE" | "INVALID";

export type DocumentClassification =
  | "academic_schedule"
  | "course_schedule"
  | "exam_schedule"
  | "event_schedule"
  | "unrelated_document"
  | "unknown";

export interface DocumentClassificationResult {
  category: DocumentClassification;
  isSchedule: boolean;
  confidence: number;
  reason: string;
  detectedKeywords: string[];
}

export type ScheduleDayName =
  | "Senin"
  | "Selasa"
  | "Rabu"
  | "Kamis"
  | "Jumat"
  | "Sabtu"
  | "Minggu";

export interface FieldEvidence {
  field: string;
  value: string;
  sourceSnippet: string;
  confidence: number;
  pageOrRow?: string | number;
}

export type ConflictCategory =
  | "exact_duplicate"
  | "possible_duplicate"
  | "time_overlap"
  | "same_course_overlap"
  | "same_room_overlap"
  | "same_day_overlap"
  | "invalid_time"
  | "date_mismatch";

export interface ExtractedScheduleItem {
  id: string;
  title: string;
  subject?: string;
  courseCode?: string;
  day?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
  timeIncomplete?: boolean;
  isEstimatedEndTime?: boolean;
  endTimeEstimated?: boolean;
  location?: string;
  rawLocationSnippet?: string;
  instructor?: string;
  lecturer?: string;
  multiLecturers?: string[];
  multiRooms?: string[];
  description?: string;
  category?: string;
  priority?: "tinggi" | "sedang" | "rendah";
  type?: "jadwal" | "reminder";
  sourceText?: string;
  sourceTrace?: string; // e.g. "Halaman 2 PDF", "Baris 14 Excel", "Teks Baris 5"
  sourceRow?: number;
  sourceColumn?: number | string;
  sourcePage?: number;
  extractionMethod?: "ai_gemini" | "deterministic_table" | "deterministic_heuristic";
  confidence: ScheduleConfidence;
  confidenceTier?: ConfidenceTier;
  confidenceReason?: string;
  confidenceScore?: number;
  confidenceLevel?: "sangat_yakin" | "perlu_pemeriksaan_ringan" | "perlu_pemeriksaan" | "tidak_yakin";
  fieldEvidence?: FieldEvidence[];
  dayDateMismatch?: boolean;
  dayDateMismatchReason?: string;
  expectedDayFromDate?: string;
  isDuplicate?: boolean;
  duplicateResolution?: "skip" | "keep" | "update";
  duplicateReason?: string;
  hasConflict?: boolean;
  conflictDetails?: string[];
  conflictCategories?: ConflictCategory[];
  selected?: boolean;
}

export interface RawDocumentExtraction {
  fileName: string;
  mimeType: string;
  size: number;
  extractedText: string;
  pageCount?: number;
  rowCount?: number;
  isScanned?: boolean;
  metadata?: Record<string, unknown>;
  fragments?: Array<{
    pageOrRow: number | string;
    text: string;
  }>;
}

export interface ConflictAnalysisResult {
  hasConflict: boolean;
  conflictType?: ConflictCategory;
  conflictCategories?: ConflictCategory[];
  conflictingItemTitle?: string;
  conflictingItemTime?: string;
  conflictingItemDay?: string;
  message: string;
}

export interface FileValidationResult {
  isValid: boolean;
  sanitizedFileName: string;
  fileExtension: string;
  mimeType: string;
  fileSize: number;
  error?: string;
}

export interface ImportPipelineResult {
  success: boolean;
  correlationId: string;
  fileName: string;
  classification?: DocumentClassificationResult;
  totalFound: number;
  verifiedCount: number;
  needsReviewCount: number;
  invalidCount: number;
  conflictCount: number;
  items: ExtractedScheduleItem[];
  rawTextPreview?: string;
  isScannedDocument?: boolean;
  warnings?: string[];
  error?: string;
}
