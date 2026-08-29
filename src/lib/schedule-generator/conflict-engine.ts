import { ScheduleItem } from "@/types";
import { GeneratedScheduleCandidate } from "./types";
import { checkIntervalOverlap } from "../schedule-import/conflict-engine";

/**
 * Validates whether a candidate slot conflicts with any existing schedules
 */
export function isCandidateSlotConflicting(
  candidate: { day: string; startTime: string; endTime: string },
  existingSchedules: ScheduleItem[] = [],
  alreadyPickedCandidates: GeneratedScheduleCandidate[] = []
): boolean {
  // Check against existing schedules
  for (const s of existingSchedules) {
    if (s.day === candidate.day) {
      const sStart = s.start_time || parseFirstTime(s.time);
      const sEnd = s.end_time || parseSecondTime(s.time);
      if (sStart && sEnd) {
        if (checkIntervalOverlap(candidate.startTime, candidate.endTime, sStart, sEnd)) {
          return true;
        }
      }
    }
  }

  // Check against already picked candidate slots
  for (const picked of alreadyPickedCandidates) {
    if (picked.day === candidate.day) {
      if (checkIntervalOverlap(candidate.startTime, candidate.endTime, picked.startTime, picked.endTime)) {
        return true;
      }
    }
  }

  return false;
}

function parseFirstTime(timeStr?: string): string | null {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{1,2})[:.](\d{2})/);
  if (!match) return null;
  return `${match[1].padStart(2, "0")}:${match[2].padStart(2, "0")}`;
}

function parseSecondTime(timeStr?: string): string | null {
  if (!timeStr) return null;
  const parts = timeStr.split("-");
  if (parts.length >= 2) {
    return parseFirstTime(parts[1]);
  }
  return null;
}
