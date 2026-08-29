import { ExtractedSchedule } from "./types";
import { ScheduleItem } from "@/types";
import { analyzeItemConflict } from "../schedule-import/conflict-engine";
import { ExtractedScheduleItem } from "../schedule-import/types";

/**
 * Conflict & Duplicate Detector for Academic Schedules
 * Responsibilities:
 * 1. Time overlap mathematical calculation: (A_start < B_end) && (B_start < A_end)
 * 2. Boundary-touching tolerance: 08:00-10:00 vs 10:00-12:00 -> NO CONFLICT
 * 3. Exact & similar duplicate detection
 * 4. Cross-comparison with existing database records
 */
export function detectConflicts(
  candidates: ExtractedSchedule[],
  existingSchedules: ScheduleItem[] = []
): ExtractedSchedule[] {
  return candidates.map((item, index) => {
    let hasConflict = false;
    let conflictType: string = "none";
    let conflictDetails: string | undefined;
    let conflictingItemTitle: string | undefined;

    // Convert item to ExtractedScheduleItem format for conflict engine
    const itemAsScheduleItem: ExtractedScheduleItem = {
      id: item.id || `candidate_${index}`,
      title: item.title,
      day: item.day || "Senin",
      time: `${item.startTime} - ${item.endTime}`,
      startTime: item.startTime,
      endTime: item.endTime,
      confidence: "verified",
      selected: item.selected ?? true,
      hasConflict: false,
    };

    // 1. Check against existing database schedules
    for (const existing of existingSchedules) {
      const conflictRes = analyzeItemConflict(itemAsScheduleItem, existing);
      if (conflictRes.hasConflict) {
        hasConflict = true;
        conflictType = conflictRes.conflictType || "time_overlap";
        conflictDetails = conflictRes.message;
        conflictingItemTitle = conflictRes.conflictingItemTitle;
        break;
      }
    }

    // 2. Intra-file conflict check (among candidate items prior in the list)
    if (!hasConflict) {
      for (let j = 0; j < index; j++) {
        const prev = candidates[j];
        const prevAsScheduleItem: ExtractedScheduleItem = {
          id: prev.id || `candidate_${j}`,
          title: prev.title,
          day: prev.day || "Senin",
          time: `${prev.startTime} - ${prev.endTime}`,
          startTime: prev.startTime,
          endTime: prev.endTime,
          confidence: "verified",
          selected: prev.selected ?? true,
          hasConflict: false,
        };

        const conflictRes = analyzeItemConflict(itemAsScheduleItem, prevAsScheduleItem);
        if (conflictRes.hasConflict) {
          hasConflict = true;
          conflictType = conflictRes.conflictType || "time_overlap";
          conflictDetails = `Konflik di dalam dokumen dengan baris #${j + 1}: ${conflictRes.message || ""}`;
          conflictingItemTitle = prev.title;
          break;
        }
      }
    }

    return {
      ...item,
      hasConflict,
      conflictType,
      conflictDetails,
      conflictingItemTitle,
      selected: hasConflict && conflictType === "duplicate_exact" ? false : item.selected ?? !hasConflict,
    };
  });
}
