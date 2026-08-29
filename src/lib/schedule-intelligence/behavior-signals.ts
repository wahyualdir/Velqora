import { ScheduleItem, ScheduleDay } from "@/types";
import { ScheduleBehaviorSignal } from "./types";
import { timeToMinutes } from "../schedule-import/normalizer";
import {
  BehaviorSignal2,
  SessionOutcome,
  TimePatternType,
  SessionCompletionPatternType,
} from "../schedule-outcomes/types";

/**
 * Extracts non-sensitive scheduling signals from the user's active and completed schedules (FASE 32)
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
  const movedSessionsCount = 0;
  const cancelledSessionsCount = 0;

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

/**
 * Behavior Signals 2.0 (FASE 34)
 * Extracts deterministic learning signals from actual session outcomes and historical completion patterns.
 * Never stores or infers sensitive psychological or emotional profiles.
 */
export function extractBehaviorSignals2(
  userId: string,
  schedules: ScheduleItem[] = [],
  outcomes: SessionOutcome[] = []
): BehaviorSignal2 {
  if (!outcomes || outcomes.length === 0) {
    const base = extractBehaviorSignals(userId, schedules);
    let pattern: TimePatternType = "UNKNOWN";
    if (base.preferredTimeWindow === "PAGI") pattern = "MORNING";
    else if (base.preferredTimeWindow === "SIANG") pattern = "AFTERNOON";
    else if (base.preferredTimeWindow === "SORE") pattern = "EVENING";
    else if (base.preferredTimeWindow === "MALAM") pattern = "NIGHT";

    return {
      userId,
      observedTimePattern: pattern,
      completionPattern: "UNKNOWN",
      preferredEffectiveDurationMinutes: base.averageCompletedDurationMinutes,
      mostConsistentDays: base.mostActiveDays,
      rescheduleFrequency: 0,
      skipFrequency: 0,
      adherenceIndex: 100,
      isSufficientData: false,
      evaluatedSessionsCount: 0,
      lastEvaluatedAt: new Date().toISOString(),
    };
  }

  let morningCompleted = 0;
  let afternoonCompleted = 0;
  let eveningCompleted = 0;
  let nightCompleted = 0;

  let completedDurationsTotal = 0;
  let completedCount = 0;
  let skippedCount = 0;
  let rescheduledCount = 0;

  const dayCompletionCounts: Record<ScheduleDay, number> = {
    Senin: 0,
    Selasa: 0,
    Rabu: 0,
    Kamis: 0,
    Jumat: 0,
    Sabtu: 0,
    Minggu: 0,
  };

  for (const o of outcomes) {
    if (o.status === "COMPLETED" || o.status === "PARTIALLY_COMPLETED") {
      completedCount++;
      if (o.day && dayCompletionCounts[o.day] !== undefined) {
        dayCompletionCounts[o.day]++;
      }

      const dur =
        typeof o.actualDurationMinutes === "number" && o.actualDurationMinutes > 0
          ? o.actualDurationMinutes
          : o.plannedDurationMinutes;
      completedDurationsTotal += dur;

      const timeStr = o.actualStartTime || o.plannedStartTime;
      const min = timeToMinutes(timeStr);
      if (min !== null) {
        if (min >= 360 && min < 660) morningCompleted++;
        else if (min >= 660 && min < 900) afternoonCompleted++;
        else if (min >= 900 && min < 1110) eveningCompleted++;
        else if (min >= 1110) nightCompleted++;
      }
    } else if (o.status === "SKIPPED") {
      skippedCount++;
    } else if (o.status === "RESCHEDULED") {
      rescheduledCount++;
    }
  }

  // Determine dominant empirical time pattern
  let observedTimePattern: TimePatternType = "UNKNOWN";
  const maxCompleted = Math.max(
    morningCompleted,
    afternoonCompleted,
    eveningCompleted,
    nightCompleted
  );

  if (maxCompleted > 0) {
    if (maxCompleted === morningCompleted) observedTimePattern = "MORNING";
    else if (maxCompleted === afternoonCompleted) observedTimePattern = "AFTERNOON";
    else if (maxCompleted === eveningCompleted) observedTimePattern = "EVENING";
    else observedTimePattern = "NIGHT";
  }

  // Completion Pattern
  let completionPattern: SessionCompletionPatternType = "UNKNOWN";
  const completionRate = outcomes.length > 0 ? (completedCount / outcomes.length) * 100 : 0;
  if (completionRate >= 80) completionPattern = "HIGH";
  else if (completionRate >= 50) completionPattern = "MEDIUM";
  else completionPattern = "LOW";

  // Preferred effective duration from actual completions
  const preferredEffectiveDuration =
    completedCount > 0
      ? Math.round(completedDurationsTotal / completedCount)
      : 60;

  // Most consistent days
  const mostConsistentDays = (Object.keys(dayCompletionCounts) as ScheduleDay[])
    .filter((d) => dayCompletionCounts[d] > 0)
    .sort((a, b) => dayCompletionCounts[b] - dayCompletionCounts[a]);

  const adherence = Math.round(completionRate);

  return {
    userId,
    observedTimePattern,
    completionPattern,
    preferredEffectiveDurationMinutes: preferredEffectiveDuration,
    mostConsistentDays:
      mostConsistentDays.length > 0
        ? mostConsistentDays
        : ["Senin", "Selasa", "Rabu"],
    rescheduleFrequency: rescheduledCount,
    skipFrequency: skippedCount,
    adherenceIndex: adherence,
    isSufficientData: outcomes.length >= 5,
    evaluatedSessionsCount: outcomes.length,
    lastEvaluatedAt: new Date().toISOString(),
  };
}
