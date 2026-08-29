import { ExtractedScheduleItem, ConflictAnalysisResult, ConflictCategory } from "./types";
import { ScheduleItem } from "@/types";

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(":");
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Checks if two time intervals on the same day overlap.
 * Strictly checks: startA < endB && startB < endA (max(startA, startB) < min(endA, endB))
 * Touching boundaries (e.g. 08:00-10:00 and 10:00-12:00) DO NOT overlap.
 */
export function checkIntervalOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const a1 = timeToMinutes(startA);
  const a2 = timeToMinutes(endA);
  const b1 = timeToMinutes(startB);
  const b2 = timeToMinutes(endB);

  if (a1 >= a2 || b1 >= b2) return false;

  return a1 < b2 && b1 < a2;
}

/**
 * Calculates overlap duration in minutes between two intervals
 */
export function calculateClashDurationMinutes(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): number {
  const a1 = timeToMinutes(startA);
  const a2 = timeToMinutes(endA);
  const b1 = timeToMinutes(startB);
  const b2 = timeToMinutes(endB);

  const overlapStart = Math.max(a1, b1);
  const overlapEnd = Math.min(a2, b2);

  if (overlapStart < overlapEnd) {
    return overlapEnd - overlapStart;
  }
  return 0;
}

export function formatClashDuration(minutes: number): string {
  if (minutes <= 0) return "";
  if (minutes < 60) return `${minutes} menit`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) return `${hours} jam`;
  return `${hours} jam ${remainingMins} menit`;
}

/**
 * Checks if two title strings are near-duplicates (e.g. "Pemrograman Web" vs "Pemrograman Web (IF101)")
 */
export function isNearDuplicateTitle(titleA: string, titleB: string): boolean {
  const cleanA = titleA.toLowerCase().replace(/[()[\]{}_-]+/g, " ").replace(/\s+/g, " ").trim();
  const cleanB = titleB.toLowerCase().replace(/[()[\]{}_-]+/g, " ").replace(/\s+/g, " ").trim();

  if (cleanA === cleanB) return true;
  if (cleanA.length >= 5 && cleanB.length >= 5) {
    if (cleanA.startsWith(cleanB) || cleanB.startsWith(cleanA)) return true;
  }
  return false;
}

/**
 * Checks if an item conflicts with another schedule item on the same day
 */
export function analyzeItemConflict(
  target: ExtractedScheduleItem,
  other: ExtractedScheduleItem | ScheduleItem
): ConflictAnalysisResult {
  const categories: ConflictCategory[] = [];

  // 1. Day / Date Match check
  const sameDay = target.day && other.day && target.day.toLowerCase() === other.day.toLowerCase();
  const sameDate = target.date && "date" in other && other.date && target.date === other.date;

  if (!sameDay && !sameDate) {
    return { hasConflict: false, message: "Beda hari dan tanggal." };
  }

  // 2. Extract times
  const startA = target.startTime || parseStartTime(target.time);
  const endA = target.endTime || parseEndTime(target.time);
  const startB = ("start_time" in other && other.start_time) ? other.start_time : ("startTime" in other && other.startTime) ? other.startTime : parseStartTime(other.time);
  const endB = ("end_time" in other && other.end_time) ? other.end_time : ("endTime" in other && other.endTime) ? other.endTime : parseEndTime(other.time);

  const titleA = (target.title || "").trim();
  const titleB = (other.title || "").trim();
  const exactSameTitle = titleA.toLowerCase() === titleB.toLowerCase();
  const nearDuplicate = isNearDuplicateTitle(titleA, titleB);

  const locA = (target.location || "").toLowerCase().trim();
  const locB = ("location" in other && other.location ? other.location : "").toLowerCase().trim();
  const sameRoom = locA && locB && locA === locB;

  if (startA && endA && startB && endB) {
    const isOverlap = checkIntervalOverlap(startA, endA, startB, endB);

    if (isOverlap) {
      const clashMinutes = calculateClashDurationMinutes(startA, endA, startB, endB);
      const clashFormatted = formatClashDuration(clashMinutes);

      if (exactSameTitle && startA === startB && endA === endB) {
        categories.push("exact_duplicate");
        return {
          hasConflict: true,
          conflictType: "exact_duplicate",
          conflictCategories: categories,
          conflictingItemTitle: other.title,
          conflictingItemTime: `${startB} - ${endB}`,
          conflictingItemDay: other.day,
          message: `Kegiatan "${other.title}" sudah ada di jadwal Anda pada hari ${other.day} (${startB} - ${endB}).`,
        };
      }

      if (exactSameTitle || nearDuplicate) {
        categories.push("same_course_overlap");
      }

      if (sameRoom && !exactSameTitle) {
        categories.push("same_room_overlap");
      }

      categories.push("time_overlap");

      const clashNote = clashFormatted ? ` (tabrakan ${clashFormatted})` : "";
      return {
        hasConflict: true,
        conflictType: "time_overlap",
        conflictCategories: categories,
        conflictingItemTitle: other.title,
        conflictingItemTime: `${startB} - ${endB}`,
        conflictingItemDay: other.day,
        message: `Bentrok waktu${clashNote} pada hari ${other.day} dengan "${other.title}" (${startB} - ${endB}).`,
      };
    }
  }

  // Near duplicate check when times don't overlap or are missing
  if (nearDuplicate && sameDay) {
    categories.push("possible_duplicate");
    return {
      hasConflict: false,
      conflictType: "possible_duplicate",
      conflictCategories: categories,
      conflictingItemTitle: other.title,
      conflictingItemTime: other.time,
      conflictingItemDay: other.day,
      message: `Kegiatan dengan nama serupa ("${other.title}") sudah terdaftar pada hari ${other.day}.`,
    };
  }

  return { hasConflict: false, message: "Tidak ada konflik." };
}

/**
 * Runs deterministic conflict detection against existing schedule and intra-imported list
 */
export function detectAllScheduleConflicts(
  importedItems: ExtractedScheduleItem[],
  existingSchedules: ScheduleItem[] = []
): ExtractedScheduleItem[] {
  return importedItems.map((item, idx) => {
    const conflictMessages: string[] = [];
    const detectedCategories = new Set<ConflictCategory>();
    let isDuplicate = false;
    let duplicateReason: string | undefined = undefined;

    // 1. Check against existing user schedule in database
    for (const existing of existingSchedules) {
      const result = analyzeItemConflict(item, existing);
      if (result.hasConflict) {
        conflictMessages.push(result.message);
        result.conflictCategories?.forEach((c) => detectedCategories.add(c));
        if (result.conflictType === "exact_duplicate") {
          isDuplicate = true;
          duplicateReason = result.message;
        }
      } else if (result.conflictType === "possible_duplicate") {
        detectedCategories.add("possible_duplicate");
      }
    }

    // 2. Check against other items in the current import list
    for (let j = 0; j < importedItems.length; j++) {
      if (idx === j) continue;
      const otherImport = importedItems[j];
      const result = analyzeItemConflict(item, otherImport);
      if (result.hasConflict) {
        conflictMessages.push(`[Dalam Berkas] ${result.message}`);
        result.conflictCategories?.forEach((c) => detectedCategories.add(c));
        if (result.conflictType === "exact_duplicate" && j < idx) {
          isDuplicate = true;
          duplicateReason = `Duplikat di dalam berkas: ${result.message}`;
        }
      } else if (result.conflictType === "possible_duplicate") {
        detectedCategories.add("possible_duplicate");
      }
    }

    if (item.dayDateMismatch) {
      detectedCategories.add("date_mismatch");
    }

    const hasConflict = conflictMessages.length > 0;
    const catList = Array.from(detectedCategories);

    return {
      ...item,
      hasConflict,
      conflictDetails: hasConflict ? conflictMessages : undefined,
      conflictCategories: catList.length > 0 ? catList : undefined,
      isDuplicate,
      duplicateReason,
      // If item has conflict or is duplicate or is invalid/low confidence, don't pre-select
      selected: item.confidence === "verified" && !hasConflict && !isDuplicate,
    };
  });
}

function parseStartTime(timeStr?: string): string | null {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{1,2})[:.](\d{2})/);
  if (!match) return null;
  const hh = parseInt(match[1], 10).toString().padStart(2, "0");
  const mm = parseInt(match[2], 10).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

function parseEndTime(timeStr?: string): string | null {
  if (!timeStr) return null;
  const parts = timeStr.split("-").map((p) => p.trim());
  if (parts.length >= 2) {
    return parseStartTime(parts[1]);
  }
  return null;
}
