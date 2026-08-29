export type SourceType = "pdf" | "txt" | "csv" | "docx" | "xlsx" | "image";

export interface ParsedDocumentOutput {
  text: string;
  sourceType: SourceType;
  pageCount?: number;
  warnings: string[];
  isScanned?: boolean;
  metadata?: Record<string, any>;
}

export interface ExtractedSchedule {
  id?: string;
  date?: string;
  day?: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  location?: string;
  instructor?: string;
  className?: string;
  sourcePage?: number;
  confidence: number; // 0.0 to 1.0
  hasConflict?: boolean;
  conflictDetails?: string;
  conflictType?: "time_overlap" | "exact_duplicate" | "duplicate_exact" | "possible_duplicate" | "duplicate_similar" | "same_course_overlap" | "same_room_overlap" | "date_mismatch" | "invalid_time" | "none" | string;
  conflictingItemTitle?: string;
  isValid?: boolean;
  validationErrors?: string[];
  validationWarnings?: string[];
  selected?: boolean;
}

export interface ScheduleValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ScheduleImportActionResult {
  success: boolean;
  inserted: number;
  skipped: number;
  conflicts: number;
  errors: string[];
  correlationId?: string;
}
