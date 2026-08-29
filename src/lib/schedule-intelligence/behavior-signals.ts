import { ScheduleItem, ScheduleDay } from "@/types";
import { ScheduleBehaviorSignal } from "./types";
import { timeToMinutes } from "../schedule-import/normalizer";

/**
 * Extracts non-sensitive scheduling signals from the user's active and completed schedules
 */
export function extractBehaviorSignals(
  userId: string,
  schedules: ScheduleItem[] = []
): ScheduleBehaviorSignal {
  const dayCounts: Record<ScheduleDay, number> = {
    Senin: 0,
    Selasa: 0,
    Rabu: 0,
    Kamis: 0,
    Jumat: 0,
    Sabtu: 0,
    Minggu: 0,
  };

  let morningCount = 0; // 06:00 - 11:00
  let afternoonCount = 0; // 11:00 - 15:00
  let eveningCount = 0; // 15:00 - 18:30
  let nightCount = 0; // 18:30 - 23:00

  let totalStudyDuration = 0;
  let studySessionsCount = 0;
  let movedSessionsCount = 0;
  let cancelledSessionsCount = 0;

  for (const s of schedules) {
    const typeStr = ((s.type as string) || "").toLowerCase();
    const isStudy =
      typeStr === "tugas" ||
      typeStr === "belajar" ||
      typeStr === "reminder" ||
      (s.title && s.title.toLowerCase().includes("belajar"));

    if (s.day && dayCounts[s.day as ScheduleDay] !== undefined) {
      dayCounts[s.day as ScheduleDay]++;
    }

    const sStart = s.start_time || (s.time ? s.time.split("-")[0]?.trim() : "");
    const sEnd = s.end_time || (s.time ? s.time.split("-")[1]?.trim() : "");

    if (sStart && sEnd) {
      const startMin = timeToMinutes(sStart) || 0;
      const endMin = timeToMinutes(sEnd) || 0;
      const dur = Math.max(0, endMin - startMin);

      if (startMin >= 360 && startMin < 660) morningCount++;
      else if (startMin >= 660 && startMin < 900) afternoonCount++;
      else if (startMin >= 900 && startMin < 1110) eveningCount++;
      else if (startMin >= 1110) nightCount++;

      if (isStudy && dur > 0) {
        totalStudyDuration += dur;
        studySessionsCount++;
      }
    }
  }

  // Determine peak preferred time window
  let preferredTimeWindow: "PAGI" | "SIANG" | "SORE" | "MALAM" = "MALAM";
  const maxTimeCount = Math.max(morningCount, afternoonCount, eveningCount, nightCount);

  if (maxTimeCount > 0) {
    if (maxTimeCount === morningCount) preferredTimeWindow = "PAGI";
    else if (maxTimeCount === afternoonCount) preferredTimeWindow = "SIANG";
    else if (maxTimeCount === eveningCount) preferredTimeWindow = "SORE";
    else preferredTimeWindow = "MALAM";
  }

  // Determine top active days (sorted descending)
  const mostActiveDays = (Object.keys(dayCounts) as ScheduleDay[])
    .filter((d) => dayCounts[d] > 0)
    .sort((a, b) => dayCounts[b] - dayCounts[a]);

  const avgDuration = studySessionsCount > 0
    ? Math.round(totalStudyDuration / studySessionsCount)
    : 60;

  return {
    userId,
    preferredTimeWindow,
    averageCompletedDurationMinutes: avgDuration,
    mostActiveDays: mostActiveDays.length > 0 ? mostActiveDays : ["Senin", "Selasa", "Rabu"],
    movedSessionsCount,
    cancelledSessionsCount,
    skippedTimeSlots: [],
    lastEvaluatedAt: new Date().toISOString(),
  };
}
