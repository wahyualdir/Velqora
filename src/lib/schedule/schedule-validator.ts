import { ExtractedSchedule, ScheduleValidationResult } from "./types";
import { normalizeDayName, normalizeTimeRange, normalizeDate } from "../schedule-import/normalizer";

/**
 * Schedule Validator Engine
 * Validates extracted items deterministically before database insertion.
 */
export function validateSchedule(item: Partial<ExtractedSchedule>): ScheduleValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Validate Title
  if (!item.title || item.title.trim().length === 0) {
    errors.push("Mata kuliah atau judul kegiatan wajib diisi.");
  } else if (item.title.length > 250) {
    errors.push("Judul kegiatan melebihi batas wajar (maksimal 250 karakter).");
  }

  // 2. Validate Day & Date
  const validDay = item.day ? normalizeDayName(item.day) : null;
  const validDate = item.date ? normalizeDate(item.date) : null;

  if (!validDay && !validDate) {
    errors.push("Hari atau tanggal kegiatan wajib ditentukan.");
  }

  if (item.date && !validDate) {
    errors.push("Format tanggal tidak valid (gunakan format YYYY-MM-DD atau DD/MM/YYYY).");
  }

  // 3. Validate Time Range
  if (!item.startTime || !item.endTime) {
    errors.push("Jam mulai dan jam selesai wajib diisi.");
  } else {
    const timeCheck = normalizeTimeRange(`${item.startTime} - ${item.endTime}`);
    if (!timeCheck.isValid) {
      errors.push(timeCheck.reason || "Rentang jam tidak valid.");
    } else {
      if (item.startTime >= item.endTime) {
        errors.push("Jam selesai harus lebih akhir dari jam mulai.");
      }
    }
  }

  // 4. Validate Location / Room
  if (item.location && item.location.length > 150) {
    warnings.push("Keterangan lokasi/ruangan terlalu panjang (maksimal 150 karakter disarankan).");
  }

  // 5. Validate Instructor / Dosen
  if (item.instructor && item.instructor.length > 150) {
    warnings.push("Nama pengajar/dosen terlalu panjang.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate an array of schedules, ensuring no duplicates within the list.
 */
export function validateBatchSchedules(items: ExtractedSchedule[]): {
  validCount: number;
  invalidCount: number;
  results: { item: ExtractedSchedule; validation: ScheduleValidationResult }[];
} {
  const seenKeys = new Set<string>();
  let validCount = 0;
  let invalidCount = 0;

  const results = items.map((item) => {
    const validation = validateSchedule(item);
    const key = `${(item.day || item.date || "").toLowerCase()}_${item.startTime}_${item.endTime}_${item.title.toLowerCase().trim()}`;

    if (seenKeys.has(key)) {
      validation.valid = false;
      validation.errors.push("Duplikasi internal: Jadwal dengan waktu dan judul yang sama ditemukan lebih dari sekali dalam file.");
    } else {
      seenKeys.add(key);
    }

    if (validation.valid) {
      validCount++;
    } else {
      invalidCount++;
    }

    return { item, validation };
  });

  return {
    validCount,
    invalidCount,
    results,
  };
}
