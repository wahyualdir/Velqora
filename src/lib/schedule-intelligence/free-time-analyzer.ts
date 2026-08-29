import { ScheduleItem, ScheduleDay } from "@/types";
import { FreeTimeSlot } from "./types";
import { timeToMinutes } from "../schedule-import/normalizer";
import { checkIntervalOverlap } from "../schedule-import/conflict-engine";

export interface TimeInterval {
  start: number; // minutes from 00:00
  end: number;
}

/**
 * Converts minutes from midnight into "HH:mm"
 */
export function minutesToTimeStr(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/**
 * Analyzes non-conflicting free time slots for a given day
 * Operating day window: 07:00 (420m) to 22:30 (1350m)
 */
export function analyzeFreeTimeSlots(
  day: ScheduleDay,
  existingSchedules: ScheduleItem[] = [],
  options: {
    date?: string;
    minSlotDurationMinutes?: number;
    minBreakMinutes?: number;
    operatingStartMinutes?: number;
    operatingEndMinutes?: number;
  } = {}
): FreeTimeSlot[] {
  const {
    date,
    minSlotDurationMinutes = 45,
    minBreakMinutes = 30,
    operatingStartMinutes = 7 * 60, // 07:00
    operatingEndMinutes = 22 * 60 + 30, // 22:30
  } = options;

  // 1. Extract busy intervals for this day
  const busyIntervals: TimeInterval[] = [];

  for (const s of existingSchedules) {
    if (s.day === day) {
      const sStart = s.start_time ? timeToMinutes(s.start_time) : parseFirstMinutes(s.time);
      const sEnd = s.end_time ? timeToMinutes(s.end_time) : parseSecondMinutes(s.time);

      if (sStart !== null && sEnd !== null && sEnd > sStart) {
        // Expand busy interval with buffer
        busyIntervals.push({
          start: Math.max(0, sStart - minBreakMinutes),
          end: Math.min(24 * 60, sEnd + minBreakMinutes),
        });
      }
    }
  }

  // 2. Merge overlapping busy intervals
  busyIntervals.sort((a, b) => a.start - b.start);
  const mergedBusy: TimeInterval[] = [];

  for (const interval of busyIntervals) {
    if (mergedBusy.length === 0) {
      mergedBusy.push({ ...interval });
    } else {
      const last = mergedBusy[mergedBusy.length - 1];
      if (interval.start <= last.end) {
        last.end = Math.max(last.end, interval.end);
      } else {
        mergedBusy.push({ ...interval });
      }
    }
  }

  // 3. Invert busy intervals to find free intervals within operating window
  const freeSlots: FreeTimeSlot[] = [];
  let currentPointer = operatingStartMinutes;

  for (const busy of mergedBusy) {
    if (busy.start > currentPointer) {
      const freeStart = currentPointer;
      const freeEnd = Math.min(busy.start, operatingEndMinutes);
      const duration = freeEnd - freeStart;

      if (duration >= minSlotDurationMinutes) {
        freeSlots.push(
          createFreeSlot(day, freeStart, freeEnd, duration, minBreakMinutes, date)
        );
      }
    }
    currentPointer = Math.max(currentPointer, busy.end);
  }

  // Final gap after last busy interval
  if (currentPointer < operatingEndMinutes) {
    const freeStart = currentPointer;
    const freeEnd = operatingEndMinutes;
    const duration = freeEnd - freeStart;

    if (duration >= minSlotDurationMinutes) {
      freeSlots.push(
        createFreeSlot(day, freeStart, freeEnd, duration, minBreakMinutes, date)
      );
    }
  }

  return freeSlots;
}

function createFreeSlot(
  day: ScheduleDay,
  startMinutes: number,
  endMinutes: number,
  durationMinutes: number,
  bufferMinutes: number,
  date?: string
): FreeTimeSlot {
  const startTime = minutesToTimeStr(startMinutes);
  const endTime = minutesToTimeStr(endMinutes);
  
  // Peak focus slot: morning (08:30 - 11:30) or evening (19:00 - 21:30)
  const isMorningPeak = startMinutes >= 8 * 60 + 30 && endMinutes <= 12 * 60;
  const isEveningPeak = startMinutes >= 19 * 60 && endMinutes <= 22 * 60;
  const isPeakFocusSlot = isMorningPeak || isEveningPeak;

  let suitabilityScore = 80;
  if (isPeakFocusSlot) suitabilityScore += 15;
  if (durationMinutes >= 90) suitabilityScore += 5;

  return {
    id: `free_${day}_${startTime.replace(":", "")}_${endTime.replace(":", "")}`,
    day,
    date,
    startTime,
    endTime,
    durationMinutes,
    bufferMinutesBefore: bufferMinutes,
    bufferMinutesAfter: bufferMinutes,
    suitabilityScore: Math.min(100, suitabilityScore),
    isPeakFocusSlot,
  };
}

function parseFirstMinutes(timeStr?: string): number | null {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{1,2})[:.](\d{2})/);
  if (!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}

function parseSecondMinutes(timeStr?: string): number | null {
  if (!timeStr) return null;
  const parts = timeStr.split("-");
  if (parts.length >= 2) {
    return parseFirstMinutes(parts[1]);
  }
  return null;
}
