/**
 * Centralized Schedule Types & Schemas
 * Velqora Academic Workspace - Smart Schedule Engine
 */

export type ScheduleDay =
  | "Senin"
  | "Selasa"
  | "Rabu"
  | "Kamis"
  | "Jumat"
  | "Sabtu"
  | "Minggu";

export type ScheduleType = "jadwal" | "reminder" | "classroom" | "lecture" | "lab" | "exam" | "study";
export type SchedulePriority = "tinggi" | "sedang" | "rendah";

export type ScheduleConfidenceLevel =
  | "sangat_yakin"               // 0.90 - 1.00
  | "perlu_pemeriksaan_ringan"  // 0.75 - 0.89
  | "perlu_pemeriksaan"         // 0.50 - 0.74
  | "tidak_yakin";              // < 0.50

export interface ScheduleEvent {
  id: string;
  title: string;
  subject?: string | null;
  date?: string | null;         // YYYY-MM-DD
  day: ScheduleDay | string;
  startTime: string;            // HH:mm
  endTime: string;              // HH:mm
  time: string;                 // "HH:mm - HH:mm"
  lecturer?: string | null;
  instructor?: string | null;
  room?: string | null;
  location?: string | null;
  className?: string | null;
  description?: string | null;
  category?: string | null;
  type: ScheduleType;
  priority: SchedulePriority;
  sourceFile?: string | null;
  sourceTrace?: string | null;  // e.g. "Halaman 2", "Baris 14"
  sourceText?: string | null;
  confidence: number;           // 0.00 - 1.00
  confidenceLevel: ScheduleConfidenceLevel;
  confidenceReason?: string;
  dayDateMismatch?: boolean;
  dayDateMismatchReason?: string;
  hasConflict?: boolean;
  conflictDetails?: string[];
  isDuplicate?: boolean;
  duplicateResolution?: "skip" | "keep" | "update";
  duplicateReason?: string;
  selected?: boolean;
}

export interface ScheduleConflict {
  hasConflict: boolean;
  conflictType: "time_overlap" | "duplicate_exact" | "duplicate_similar" | "day_date_mismatch" | "invalid_time";
  conflictingItemTitle?: string;
  conflictingItemTime?: string;
  conflictingItemDay?: string;
  message: string;
  severity: "error" | "warning";
}

export interface ScheduleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedEvent?: ScheduleEvent;
}

export interface ScheduleExtraction {
  events: ScheduleEvent[];
  documentSummary?: string;
  totalFound: number;
  rawTextPreview?: string;
}

export interface ScheduleImportResult {
  success: boolean;
  correlationId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  totalFound: number;
  verifiedCount: number;
  needsReviewCount: number;
  conflictCount: number;
  duplicateCount: number;
  invalidCount: number;
  items: ScheduleEvent[];
  isScannedDocument?: boolean;
  warnings?: string[];
  error?: string;
}

export interface ScheduleImportHistoryItem {
  id: string;
  sourceFileName: string;
  fileType: string;
  fileSizeFormatted: string;
  eventCount: number;
  status: "berhasil" | "gagal" | "sebagian";
  importedAt: string;
  correlationId: string;
}
