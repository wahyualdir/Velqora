import { ScheduleItem, Task, ScheduleDay } from "@/types";
import {
  DailyPlanRequest,
  DailyPlanResult,
  ScheduleRecommendation,
  WorkloadLevel,
} from "./types";
import { analyzeWorkload } from "./workload-analyzer";
import { analyzeTaskDeadlines } from "./deadline-analyzer";
import { analyzeFreeTimeSlots, minutesToTimeStr } from "./free-time-analyzer";
import { calculateRecommendationQuality } from "./recommendation-quality";
import { buildRecommendationExplanation } from "./explanation-engine";
import { getDayFromDateString } from "./recommendation-engine";
import { timeToMinutes } from "../schedule-import/normalizer";
import { ACADEMIC_CONSTANTS } from "../schedule/academic-constants";

const ALL_DAYS: ScheduleDay[] = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

export interface AdaptivePlanOptions {
  enableOverloadRecovery?: boolean;
  strictDeadlinePriority?: boolean;
}

export interface OverloadRecoveryPlan {
  isOverloaded: boolean;
  currentWorkload: WorkloadLevel;
  recoveryAdvice: string;
  suggestedLighterDays: Array<{ day: ScheduleDay; level: WorkloadLevel }>;
  recommendedSessions: ScheduleRecommendation[];
}

/**
 * Adaptive Planner with Deadline Adaptation and Overload Recovery
 */
export function generateAdaptiveDailyPlan(
  req: DailyPlanRequest,
  existingSchedules: ScheduleItem[] = [],
  tasks: Task[] = [],
  options: AdaptivePlanOptions = {}
): DailyPlanResult & { overloadRecovery?: OverloadRecoveryPlan } {
  const targetDay = req.day || (req.date ? getDayFromDateString(req.date) : "Senin");
  const targetHours = req.targetStudyHours || 3;
  const targetMinutes = Math.round(targetHours * 60);
  const maxDailyMinutes = req.maxDailyStudyMinutes || ACADEMIC_CONSTANTS.DEFAULT_MAX_DAILY_STUDY_MINUTES;
  const minBreakMinutes = req.minBreakMinutes || ACADEMIC_CONSTANTS.DEFAULT_BREAK_DURATION_MINUTES;

  const warnings: string[] = [];

  // 1. Analyze existing workload and active deadlines
  const workloadSummary = analyzeWorkload(existingSchedules, tasks);
  const dayWorkload = workloadSummary.dailyBreakdown[targetDay];
  const deadlines = analyzeTaskDeadlines(tasks);

  // Check critical deadlines
  const criticalTasks = deadlines.filter(
    (d) => d.urgency === "CRITICAL" || d.urgency === "URGENT" || d.urgency === "OVERDUE"
  );

  // 2. Discover available free slots for target day
  const freeSlots = analyzeFreeTimeSlots(targetDay, existingSchedules, {
    date: req.date,
    minBreakMinutes,
    minSlotDurationMinutes: 45,
  });

  // 3. Check for Overload or Zero Free Slots -> Trigger Overload Recovery
  const isDayOverloaded = dayWorkload.isOverloaded || dayWorkload.level === "SANGAT_PADAT";

  if (freeSlots.length === 0 || (isDayOverloaded && options.enableOverloadRecovery !== false)) {
    // Find lighter upcoming days
    const suggestedLighterDays: Array<{ day: ScheduleDay; level: WorkloadLevel }> = [];
    for (const d of ALL_DAYS) {
      if (d !== targetDay && (workloadSummary.dailyBreakdown[d].level === "RINGAN" || workloadSummary.dailyBreakdown[d].level === "NORMAL")) {
        suggestedLighterDays.push({ day: d, level: workloadSummary.dailyBreakdown[d].level });
      }
    }

    const recoveryAdvice = freeSlots.length === 0
      ? "Tidak ditemukan waktu belajar yang aman pada hari ini karena jadwal perkuliahan penuh."
      : `Hari ini sudah memiliki beban kuliah sangat padat (${dayWorkload.totalHours} jam). Disarankan memindahkan sesi belajar ke hari yang lebih luang.`;

    const recoveryPlan: OverloadRecoveryPlan = {
      isOverloaded: isDayOverloaded,
      currentWorkload: dayWorkload.level,
      recoveryAdvice,
      suggestedLighterDays,
      recommendedSessions: [],
    };

    warnings.push(recoveryAdvice);

    if (freeSlots.length === 0) {
      return {
        success: false,
        date: req.date,
        day: targetDay,
        totalMinutesPlanned: 0,
        totalHoursPlanned: 0,
        targetMet: false,
        recommendedSessions: [],
        freeSlotsRemaining: [],
        workloadStatus: dayWorkload.level,
        warnings,
        error: "Tidak ditemukan slot waktu luang yang aman pada hari ini.",
        overloadRecovery: recoveryPlan,
      };
    }
  }

  // 4. Determine prioritized task sequence
  const prioritizedTasks: Array<{
    title: string;
    subject?: string;
    taskId?: string;
    urgency: any;
    priority: any;
  }> = [];

  if (criticalTasks.length > 0) {
    for (const ct of criticalTasks) {
      prioritizedTasks.push({
        title: `Pengerjaan Prioritas: ${ct.title}`,
        subject: ct.subject,
        taskId: ct.taskId,
        urgency: ct.urgency,
        priority: ct.priority,
      });
    }
  } else if (tasks.length > 0) {
    for (const t of tasks.filter((t) => t.status !== "selesai").slice(0, 3)) {
      prioritizedTasks.push({
        title: `Belajar: ${t.title}`,
        subject: t.subject || "Akademik",
        taskId: t.id,
        urgency: "SAFE",
        priority: t.priority || "sedang",
      });
    }
  } else {
    prioritizedTasks.push({
      title: "Sesi Belajar Mandiri & Pendalaman Materi",
      subject: "Fokus Akademik",
      urgency: "SAFE",
      priority: "sedang",
    });
  }

  // 5. Fit study sessions into free slots (supports multiple sessions per long slot with break buffers)
  const recommendedSessions: ScheduleRecommendation[] = [];
  let currentPlannedMinutes = 0;
  let taskIdx = 0;

  for (const slot of freeSlots) {
    if (currentPlannedMinutes >= targetMinutes) break;

    let slotCurrentStartMin = timeToMinutes(slot.startTime)!;
    const slotEndMin = timeToMinutes(slot.endTime)!;

    while (currentPlannedMinutes < targetMinutes) {
      const remainingToTarget = targetMinutes - currentPlannedMinutes;
      const availableInSlot = slotEndMin - slotCurrentStartMin;
      if (availableInSlot < 45) break;

      // Cap session to 45-90 minutes
      const sessionDuration = Math.min(
        availableInSlot,
        remainingToTarget,
        ACADEMIC_CONSTANTS.ADAPTIVE_MAX_SINGLE_SESSION_MINUTES
      );
      if (sessionDuration < 45) break;

      // Safety: check daily study limit
      if (dayWorkload.studyMinutes + currentPlannedMinutes + sessionDuration > maxDailyMinutes) {
        warnings.push(`Sesi dibatasi oleh batas belajar harian maksimal (${maxDailyMinutes} menit).`);
        break;
      }

      const curTask = prioritizedTasks[taskIdx % prioritizedTasks.length];
      taskIdx++;

      const sessionStartTime = minutesToTimeStr(slotCurrentStartMin);
      const sessionEndTime = minutesToTimeStr(slotCurrentStartMin + sessionDuration);

      const quality = calculateRecommendationQuality({
        deadlineUrgency: curTask.urgency,
        slotDurationMinutes: slot.durationMinutes,
        targetDurationMinutes: sessionDuration,
        hasConflict: false,
        dayWorkloadLevel: dayWorkload.level,
        hasSufficientBreak: true,
        isPreferredTimeMatch: slot.isPeakFocusSlot,
      });

      const explanation = buildRecommendationExplanation({
        activity: curTask.title,
        day: targetDay,
        startTime: sessionStartTime,
        endTime: sessionEndTime,
        durationMinutes: sessionDuration,
        deadlineUrgencyLabel: curTask.urgency === "CRITICAL" ? "Kritis (<24 Jam)" : undefined,
        factors: quality.explanations,
        checkedSchedulesCount: existingSchedules.length,
        maxDailyMinutes,
        minBreakMinutes,
      });

      recommendedSessions.push({
        id: `adapt_rec_${Date.now()}_${recommendedSessions.length + 1}`,
        activity: curTask.title,
        subject: curTask.subject || "Akademik",
        day: targetDay,
        date: req.date,
        startTime: sessionStartTime,
        endTime: sessionEndTime,
        durationMinutes: sessionDuration,
        priority: curTask.priority,
        reason: explanation.summary,
        evidence: explanation.evidence,
        conflictStatus: "VERIFIED_NO_CONFLICT",
        confidence: quality.score / 100,
        explanation,
        taskId: curTask.taskId,
        selected: true,
      });

      currentPlannedMinutes += sessionDuration;
      slotCurrentStartMin += sessionDuration + minBreakMinutes;
    }
  }

  const targetMet = currentPlannedMinutes >= targetMinutes;
  if (!targetMet && recommendedSessions.length > 0) {
    warnings.push(
      "Waktu tersedia tidak cukup untuk memenuhi target secara penuh sebelum tenggat. Berikut pembagian sesi yang paling realistis."
    );
  }

  let overloadRecovery: OverloadRecoveryPlan | undefined;
  if (isDayOverloaded) {
    const suggestedLighterDays: Array<{ day: ScheduleDay; level: WorkloadLevel }> = [];
    for (const d of ALL_DAYS) {
      if (d !== targetDay && (workloadSummary.dailyBreakdown[d].level === "RINGAN" || workloadSummary.dailyBreakdown[d].level === "NORMAL")) {
        suggestedLighterDays.push({ day: d, level: workloadSummary.dailyBreakdown[d].level });
      }
    }

    overloadRecovery = {
      isOverloaded: true,
      currentWorkload: dayWorkload.level,
      recoveryAdvice: `Hari ini sudah memiliki beban kuliah sangat padat (${dayWorkload.totalHours} jam). Disarankan memindahkan sesi belajar ke hari yang lebih luang.`,
      suggestedLighterDays,
      recommendedSessions,
    };
  }

  return {
    success: recommendedSessions.length > 0,
    date: req.date,
    day: targetDay,
    totalMinutesPlanned: currentPlannedMinutes,
    totalHoursPlanned: parseFloat((currentPlannedMinutes / 60).toFixed(1)),
    targetMet,
    recommendedSessions,
    freeSlotsRemaining: freeSlots.slice(recommendedSessions.length),
    workloadStatus: dayWorkload.level,
    warnings,
    overloadRecovery,
  };
}
