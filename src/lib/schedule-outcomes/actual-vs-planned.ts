import { timeToMinutes } from "../schedule-import/normalizer";
import {
  SessionOutcome,
  ActualVsPlannedItem,
  ActualVsPlannedReport,
} from "./types";

function isValidTimeString(timeStr?: string | null): boolean {
  if (!timeStr) return false;
  return /^\d{1,2}[:.]\d{2}$/.test(timeStr.trim());
}

/**
 * Calculates deterministic planned vs actual adherence and variance metrics.
 * Safely leaves missing telemetry as UNKNOWN rather than guessing 0.
 */
export function analyzeActualVsPlanned(
  userId: string,
  outcomes: SessionOutcome[] = []
): ActualVsPlannedReport {
  if (!outcomes || outcomes.length === 0) {
    return {
      userId,
      totalPlannedSessions: 0,
      completedSessionsCount: 0,
      partiallyCompletedCount: 0,
      skippedSessionsCount: 0,
      rescheduledSessionsCount: 0,
      averageCompletionRatioPercent: "UNKNOWN",
      averagePunctualityScore: "UNKNOWN",
      scheduleAdherenceIndex: "UNKNOWN",
      items: [],
      summary: "Belum ada riwayat hasil sesi belajar yang tercatat.",
    };
  }

  let completedCount = 0;
  let partiallyCompletedCount = 0;
  let skippedCount = 0;
  let rescheduledCount = 0;

  const validCompletionRatios: number[] = [];
  const validPunctualityScores: number[] = [];

  const items: ActualVsPlannedItem[] = outcomes.map((o) => {
    // Count status
    if (o.status === "COMPLETED") completedCount++;
    else if (o.status === "PARTIALLY_COMPLETED") partiallyCompletedCount++;
    else if (o.status === "SKIPPED") skippedCount++;
    else if (o.status === "RESCHEDULED") rescheduledCount++;

    const plannedDur = o.plannedDurationMinutes;
    const hasActualTimes = isValidTimeString(o.actualStartTime) && isValidTimeString(o.actualEndTime);
    const hasActualDuration =
      typeof o.actualDurationMinutes === "number" && o.actualDurationMinutes >= 0;

    let actualDuration: number | "UNKNOWN" = "UNKNOWN";
    let durationVariance: number | "UNKNOWN" = "UNKNOWN";
    let startVariance: number | "UNKNOWN" = "UNKNOWN";
    let completionRatio: number | "UNKNOWN" = "UNKNOWN";
    let isPunctual: boolean | "UNKNOWN" = "UNKNOWN";

    if (o.status === "SKIPPED" || o.status === "CANCELLED") {
      actualDuration = 0;
      durationVariance = -plannedDur;
      completionRatio = 0;
      validCompletionRatios.push(0);
    } else if (hasActualDuration) {
      actualDuration = o.actualDurationMinutes!;
      durationVariance = actualDuration - plannedDur;
      completionRatio =
        plannedDur > 0
          ? Math.round(
              Math.min(100, Math.max(0, (actualDuration / plannedDur) * 100)) *
                100
            ) / 100
          : 0;
      validCompletionRatios.push(completionRatio);
    } else if (o.status === "COMPLETED") {
      // Completed with default planned duration
      actualDuration = plannedDur;
      durationVariance = 0;
      completionRatio = 100;
      validCompletionRatios.push(100);
    }

    if (hasActualTimes && isValidTimeString(o.plannedStartTime)) {
      const pStart = timeToMinutes(o.plannedStartTime);
      const aStart = timeToMinutes(o.actualStartTime!);
      startVariance = aStart - pStart;
      isPunctual = Math.abs(startVariance) <= 15;
      const punctualityScore = Math.max(
        0,
        100 - 2 * Math.abs(startVariance)
      );
      validPunctualityScores.push(punctualityScore);
    }

    return {
      sessionId: o.id || o.scheduleItemId,
      title: o.sessionTitle,
      day: o.day,
      plannedTime: `${o.plannedStartTime} - ${o.plannedEndTime}`,
      actualTime:
        o.actualStartTime && o.actualEndTime
          ? `${o.actualStartTime} - ${o.actualEndTime}`
          : "UNKNOWN",
      plannedDuration: plannedDur,
      actualDuration,
      durationVarianceMinutes: durationVariance,
      startVarianceMinutes: startVariance,
      completionRatioPercent: completionRatio,
      status: o.status,
      isPunctual,
    };
  });

  const avgCompletionRatio: number | "UNKNOWN" =
    validCompletionRatios.length > 0
      ? Math.round(
          (validCompletionRatios.reduce((a, b) => a + b, 0) /
            validCompletionRatios.length) *
            10
        ) / 10
      : "UNKNOWN";

  const avgPunctuality: number | "UNKNOWN" =
    validPunctualityScores.length > 0
      ? Math.round(
          (validPunctualityScores.reduce((a, b) => a + b, 0) /
            validPunctualityScores.length) *
            10
        ) / 10
      : "UNKNOWN";

  let adherenceIndex: number | "UNKNOWN" = "UNKNOWN";
  if (typeof avgCompletionRatio === "number" && typeof avgPunctuality === "number") {
    adherenceIndex = Math.round(
      0.6 * avgCompletionRatio + 0.4 * avgPunctuality
    );
  } else if (typeof avgCompletionRatio === "number") {
    adherenceIndex = Math.round(avgCompletionRatio);
  }

  const summary =
    adherenceIndex !== "UNKNOWN"
      ? `Tingkat kepatuhan jadwal: ${adherenceIndex}% (${completedCount} selesai, ${partiallyCompletedCount} sebagian, ${skippedCount} terlewat dari ${outcomes.length} sesi).`
      : `Tercatat ${completedCount} sesi selesai dan ${skippedCount} sesi terlewat.`;

  return {
    userId,
    totalPlannedSessions: outcomes.length,
    completedSessionsCount: completedCount,
    partiallyCompletedCount,
    skippedSessionsCount: skippedCount,
    rescheduledSessionsCount: rescheduledCount,
    averageCompletionRatioPercent: avgCompletionRatio,
    averagePunctualityScore: avgPunctuality,
    scheduleAdherenceIndex: adherenceIndex,
    items,
    summary,
  };
}
