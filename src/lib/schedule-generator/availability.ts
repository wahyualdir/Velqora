import { ScheduleDay, ScheduleItem, Task } from "@/types";
import { TimeSlotWindow, TimeOfDayPreference } from "./types";
import { timeToMinutes, minutesToTime } from "../schedule-import/normalizer";

export const PREFERENCE_HOUR_RANGES: Record<TimeOfDayPreference, { start: number; end: number }> = {
  pagi: { start: 7 * 60, end: 12 * 60 }, // 07:00 - 12:00
  siang: { start: 12 * 60, end: 16 * 60 }, // 12:00 - 16:00
  sore: { start: 15 * 60 + 30, end: 18 * 60 + 30 }, // 15:30 - 18:30
  malam: { start: 18 * 60 + 30, end: 22 * 60 + 30 }, // 18:30 - 22:30
  fleksibel: { start: 7 * 60 + 30, end: 22 * 60 }, // 07:30 - 22:00
};

export const ALL_DAYS: ScheduleDay[] = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

/**
 * Computes free time windows for each day, taking into account existing schedules and pending tasks
 */
export function computeAvailabilityWindows(
  days: ScheduleDay[],
  preference: TimeOfDayPreference,
  existingSchedules: ScheduleItem[] = [],
  _existingTasks: Task[] = [],
  bufferMinutes: number = 15
): Record<ScheduleDay, TimeSlotWindow[]> {
  const result: Record<ScheduleDay, TimeSlotWindow[]> = {
    Senin: [],
    Selasa: [],
    Rabu: [],
    Kamis: [],
    Jumat: [],
    Sabtu: [],
    Minggu: [],
  };

  const prefRange = PREFERENCE_HOUR_RANGES[preference] || PREFERENCE_HOUR_RANGES.fleksibel;

  days.forEach((day) => {
    // 1. Gather busy intervals on this day
    const busyIntervals: Array<{ start: number; end: number }> = [];

    // From existing schedules on this day
    existingSchedules
      .filter((s) => s.day === day)
      .forEach((s) => {
        const start = s.start_time ? timeToMinutes(s.start_time) : parseStartMinutes(s.time);
        const end = s.end_time ? timeToMinutes(s.end_time) : parseEndMinutes(s.time);

        if (start !== null && end !== null && start < end) {
          busyIntervals.push({
            start: Math.max(0, start - bufferMinutes),
            end: Math.min(24 * 60, end + bufferMinutes),
          });
        }
      });

    // 2. Merge overlapping busy intervals
    busyIntervals.sort((a, b) => a.start - b.start);
    const mergedBusy: Array<{ start: number; end: number }> = [];

    for (const b of busyIntervals) {
      if (mergedBusy.length === 0) {
        mergedBusy.push(b);
      } else {
        const last = mergedBusy[mergedBusy.length - 1];
        if (b.start <= last.end) {
          last.end = Math.max(last.end, b.end);
        } else {
          mergedBusy.push(b);
        }
      }
    }

    // 3. Subtract merged busy intervals from preference window
    let currentCursor = prefRange.start;
    const dayFreeWindows: TimeSlotWindow[] = [];

    for (const busy of mergedBusy) {
      if (busy.end <= currentCursor) continue;
      if (busy.start >= prefRange.end) break;

      if (busy.start > currentCursor) {
        const freeStart = currentCursor;
        const freeEnd = Math.min(busy.start, prefRange.end);
        if (freeEnd - freeStart >= 30) {
          dayFreeWindows.push({
            day,
            startMinutes: freeStart,
            endMinutes: freeEnd,
            startTime: minutesToTime(freeStart),
            endTime: minutesToTime(freeEnd),
          });
        }
      }

      currentCursor = Math.max(currentCursor, busy.end);
    }

    if (currentCursor < prefRange.end && prefRange.end - currentCursor >= 30) {
      dayFreeWindows.push({
        day,
        startMinutes: currentCursor,
        endMinutes: prefRange.end,
        startTime: minutesToTime(currentCursor),
        endTime: minutesToTime(prefRange.end),
      });
    }

    result[day] = dayFreeWindows;
  });

  return result;
}

function parseStartMinutes(timeStr?: string): number | null {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{1,2})[:.](\d{2})/);
  if (!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}

function parseEndMinutes(timeStr?: string): number | null {
  if (!timeStr) return null;
  const parts = timeStr.split("-");
  if (parts.length >= 2) {
    return parseStartMinutes(parts[1]);
  }
  return null;
}
