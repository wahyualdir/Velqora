import { ParsedDocumentOutput, ExtractedSchedule } from "./types";
import { structureScheduleWithAI, heuristicTextScheduleExtractor } from "../schedule-import/ai-structuring";
import {
  normalizeDayName,
  normalizeTimeRange,
  normalizeDate,
  validateDayDateMatch,
  evaluateConfidence,
} from "../schedule-import/normalizer";

/**
 * Schedule Extractor Engine
 * Hierarchical approach:
 * 1. AI Structuring (Gemini 2.0 Flash structured JSON) with prompt limits & timeout
 * 2. Deterministic Heuristic Regex / Pattern Matcher Fallback
 * 3. Strict Normalization (Day, Time, Date, Day-Date Mismatch)
 * 4. Evidence-based confidence scoring (0.0 - 1.0)
 */
export async function extractSchedules(
  parsedDoc: ParsedDocumentOutput,
  correlationId?: string
): Promise<ExtractedSchedule[]> {
  const rawText = parsedDoc.text;
  if (!rawText || rawText.trim().length === 0) {
    return [];
  }

  // 1. Extract raw items from AI or fallback heuristic
  let rawItems: any[] = [];
  try {
    const aiResult = await structureScheduleWithAI(
      {
        fileName: "document",
        mimeType: "text/plain",
        size: rawText.length,
        extractedText: rawText,
        isScanned: parsedDoc.isScanned,
      },
      correlationId || "sched_ext"
    );
    rawItems = aiResult.items || [];
  } catch {
    // Graceful fallback to heuristic
    const fallbackResult = heuristicTextScheduleExtractor(rawText);
    rawItems = fallbackResult.items || [];
  }

  if (rawItems.length === 0) {
    const fallbackResult = heuristicTextScheduleExtractor(rawText);
    rawItems = fallbackResult.items || [];
  }

  // 2. Normalize and compute deterministic confidence for each item
  const extractedSchedules: ExtractedSchedule[] = rawItems.map((item, idx) => {
    const rawTitle = (item.title || item.subject || item.kegiatan || item.mataKuliah || "").trim();
    const rawDay = item.day || item.hari || "";
    const rawTime = item.time || item.waktu || `${item.start_time || item.startTime || ""} - ${item.end_time || item.endTime || ""}`;
    const rawDate = item.date || item.tanggal || undefined;

    const normalizedDay = normalizeDayName(rawDay);
    const timeNorm = normalizeTimeRange(rawTime);
    const normalizedDate = normalizeDate(rawDate);

    const isTitleValid = !!rawTitle && rawTitle.length >= 2;
    const isDayRecognized = !!normalizedDay;
    const hasLocation = !!(item.location || item.ruang || item.ruangan);
    const hasInstructor = !!(item.instructor || item.dosen || item.pengajar);

    const errors: string[] = [];
    const warnings: string[] = [];

    // Title validation
    if (!isTitleValid) {
      errors.push("Nama kegiatan/mata kuliah tidak boleh kosong.");
    }

    // Day & Date validation
    if (!isDayRecognized && !normalizedDate) {
      errors.push("Hari atau tanggal kegiatan tidak terdeteksi.");
    }

    let dayDateMismatch = false;
    if (normalizedDay && normalizedDate) {
      const matchCheck = validateDayDateMatch(normalizedDay, normalizedDate);
      if (matchCheck.dayDateMismatch) {
        dayDateMismatch = true;
        warnings.push(`Ketidaksesuaian Hari-Tanggal: ${normalizedDate} sebenarnya adalah hari ${matchCheck.actualDay}, bukan ${normalizedDay}.`);
      }
    }

    // Time validation
    if (!timeNorm.isValid) {
      errors.push(timeNorm.reason || "Format jam tidak valid.");
    }

    // Evidence-based confidence evaluation
    const { score, legacyConfidence } = evaluateConfidence(
      isTitleValid,
      isDayRecognized,
      timeNorm.isValid,
      !!timeNorm.isEstimatedEndTime,
      dayDateMismatch,
      hasInstructor,
      hasLocation
    );

    return {
      id: `ext_${idx + 1}_${Date.now().toString(36)}`,
      title: rawTitle || "Jadwal Tanpa Judul",
      day: normalizedDay || undefined,
      date: normalizedDate || undefined,
      startTime: timeNorm.startTime || "08:00",
      endTime: timeNorm.endTime || "10:00",
      location: item.location || item.ruang || item.ruangan || undefined,
      instructor: item.instructor || item.dosen || item.pengajar || undefined,
      className: item.className || item.kelas || undefined,
      description: item.description || undefined,
      sourcePage: item.sourcePage || parsedDoc.pageCount || 1,
      confidence: score,
      isValid: errors.length === 0,
      validationErrors: errors.length > 0 ? errors : undefined,
      validationWarnings: warnings.length > 0 ? warnings : undefined,
      selected: errors.length === 0 && legacyConfidence === "verified" && !dayDateMismatch,
    };
  });

  return extractedSchedules;
}
