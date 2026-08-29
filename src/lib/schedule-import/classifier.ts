import { DocumentClassificationResult } from "./types";

const ACADEMIC_KEYWORDS = [
  "jadwal",
  "kuliah",
  "semester",
  "mata kuliah",
  "matkul",
  "dosen",
  "ruang",
  "ruangan",
  "sks",
  "krs",
  "kelas",
  "praktikum",
  "prodi",
  "fakultas",
  "kurikulum",
  "course",
  "schedule",
  "lecturer",
  "instructor",
  "classroom",
  "academic",
];

const EXAM_KEYWORDS = [
  "ujian",
  "uts",
  "uas",
  "evaluasi akhir",
  "evaluasi tengah",
  "midterm",
  "final exam",
  "jadwal ujian",
  "pengawas",
];

const EVENT_KEYWORDS = [
  "rundown",
  "agenda acara",
  "susunan acara",
  "seminar",
  "workshop",
  "webinar",
  "kegiatan",
  "rundown acara",
];

const DAYS_KEYWORDS = [
  "senin",
  "selasa",
  "rabu",
  "kamis",
  "jumat",
  "jum'at",
  "sabtu",
  "minggu",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const UNRELATED_STRONG_INDICATORS = [
  "laporan keuangan",
  "neraca saldo",
  "invoice",
  "faktur tagihan",
  "kuitansi",
  "surat perjanjian",
  "bab i pendahuluan",
  "daftar pustaka",
  "abstrak",
  "abstract",
  "latar belakang penelitian",
  "metodologi penelitian",
  "source code",
  "import react from",
  "function main()",
  "public static void main",
  "resep masakan",
];

const TIME_PATTERN = /\b\d{1,2}[:.]\d{2}\s*(?:-|–|—|s\.?d\.?|sampai|hingga|\/)\s*\d{1,2}[:.]\d{2}\b/i;
const SINGLE_TIME_PATTERN = /\b\d{1,2}[:.]\d{2}\b/;

/**
 * Classifies document to determine if it is an academic schedule, possible schedule, partial schedule, non-schedule, or empty document (Classification 3.0).
 */
export function classifyScheduleDocument(
  text: string,
  fileName: string = "",
  metadata?: { isPartial?: boolean; failedPagesCount?: number }
): DocumentClassificationResult {
  const normalized = text.toLowerCase();
  const nameNorm = fileName.toLowerCase();

  // 1. Check for empty or near-empty text
  if (normalized.trim().length < 10) {
    return {
      category: "unknown",
      canonicalCategory: "EMPTY_DOCUMENT",
      isSchedule: false,
      confidence: 0.1,
      reason: "Dokumen kosong atau tidak memiliki teks yang cukup untuk dianalisis.",
      detectedKeywords: [],
    };
  }

  // Check for partial page failure flag
  if (metadata?.isPartial || (metadata?.failedPagesCount && metadata.failedPagesCount > 0)) {
    return {
      category: "course_schedule",
      canonicalCategory: "PARTIAL_SCHEDULE",
      isSchedule: true,
      confidence: 0.7,
      reason: "Dokumen jadwal berhasil dibaca sebagian. Beberapa halaman memerlukan pemeriksaan mandiri.",
      detectedKeywords: [],
    };
  }

  // 2. Count keyword hits
  const detectedAcademic = ACADEMIC_KEYWORDS.filter((k) => normalized.includes(k) || nameNorm.includes(k));
  const detectedExam = EXAM_KEYWORDS.filter((k) => normalized.includes(k) || nameNorm.includes(k));
  const detectedEvent = EVENT_KEYWORDS.filter((k) => normalized.includes(k) || nameNorm.includes(k));
  const detectedDays = DAYS_KEYWORDS.filter((k) => normalized.includes(k));
  const detectedUnrelated = UNRELATED_STRONG_INDICATORS.filter((k) => normalized.includes(k));

  const hasTimeRange = TIME_PATTERN.test(text);
  const hasSingleTime = SINGLE_TIME_PATTERN.test(text);

  // 3. Unrelated document detection (NON_SCHEDULE)
  if (detectedUnrelated.length >= 1 && detectedDays.length === 0 && !hasTimeRange) {
    return {
      category: "unrelated_document",
      canonicalCategory: "NON_SCHEDULE",
      isSchedule: false,
      confidence: 0.95,
      reason: "Dokumen ini belum dapat dikenali sebagai jadwal akademik.",
      detectedKeywords: detectedUnrelated,
    };
  }

  // 4. Exam schedule detection (ACADEMIC_SCHEDULE)
  if (detectedExam.length >= 2 && (detectedDays.length >= 1 || hasTimeRange)) {
    return {
      category: "exam_schedule",
      canonicalCategory: "ACADEMIC_SCHEDULE",
      isSchedule: true,
      confidence: 0.92,
      reason: "Dokumen teridentifikasi sebagai jadwal ujian / evaluasi akademik.",
      detectedKeywords: [...detectedExam, ...detectedDays],
    };
  }

  // 5. Academic course schedule detection (ACADEMIC_SCHEDULE)
  if (detectedAcademic.length >= 2 || (detectedAcademic.length >= 1 && (detectedDays.length >= 1 || hasTimeRange))) {
    return {
      category: "academic_schedule",
      canonicalCategory: "ACADEMIC_SCHEDULE",
      isSchedule: true,
      confidence: 0.95,
      reason: "Dokumen teridentifikasi secara valid sebagai jadwal perkuliahan / akademik.",
      detectedKeywords: [...detectedAcademic, ...detectedDays],
    };
  }

  // 6. Event schedule / Rundown detection (ACADEMIC_SCHEDULE)
  if (detectedEvent.length >= 1 && (hasTimeRange || hasSingleTime)) {
    return {
      category: "event_schedule",
      canonicalCategory: "ACADEMIC_SCHEDULE",
      isSchedule: true,
      confidence: 0.85,
      reason: "Dokumen teridentifikasi sebagai susunan acara / agenda kegiatan.",
      detectedKeywords: [...detectedEvent, ...detectedDays],
    };
  }

  // 7. General schedule if days & time patterns are clearly present (ACADEMIC_SCHEDULE)
  if (detectedDays.length >= 1 && hasTimeRange) {
    return {
      category: "course_schedule",
      canonicalCategory: "ACADEMIC_SCHEDULE",
      isSchedule: true,
      confidence: 0.88,
      reason: "Dokumen memiliki pola hari dan rentang waktu kegiatan yang terstruktur.",
      detectedKeywords: detectedDays,
    };
  }

  // 8. Possible schedule if single day or single time is found (POSSIBLE_SCHEDULE - must enter Human Review)
  if (detectedDays.length >= 1 || hasSingleTime || detectedAcademic.length >= 1) {
    return {
      category: "course_schedule",
      canonicalCategory: "POSSIBLE_SCHEDULE",
      isSchedule: true,
      confidence: 0.55,
      reason: "Dokumen memiliki sebagian pola jadwal. Silakan periksa hasil ekstraksi pada tabel review.",
      detectedKeywords: [...detectedAcademic, ...detectedDays],
    };
  }

  // 9. Default: Non-schedule (NON_SCHEDULE)
  return {
    category: "unrelated_document",
    canonicalCategory: "NON_SCHEDULE",
    isSchedule: false,
    confidence: 0.75,
    reason: "Dokumen ini belum dapat dikenali sebagai jadwal akademik.",
    detectedKeywords: [...detectedAcademic, ...detectedDays],
  };
}
