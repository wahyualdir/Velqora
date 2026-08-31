import { ScheduleItem, Task, ScheduleDay } from "@/types";
import {
  DailyPlanRequest,
  DailyPlanResult,
  WeeklyPlanRequest,
  WeeklyPlanResult,
  ScheduleRecommendation,
  RescheduleImpact,
  RescheduleProposal,
} from "./types";
import { analyzeWorkload } from "./workload-analyzer";
import { analyzeTaskDeadlines } from "./deadline-analyzer";
import { analyzeFreeTimeSlots, minutesToTimeStr } from "./free-time-analyzer";
import { calculatePriorityScore } from "./priority-engine";
import { buildRecommendationExplanation } from "./explanation-engine";
import {
  DEFAULT_MAX_DAILY_STUDY_MINUTES,
  DEFAULT_MIN_BREAK_MINUTES,
  validateDailyStudyLimit,
} from "./safety-rules";
import { timeToMinutes } from "../schedule-import/normalizer";
import { checkIntervalOverlap } from "../schedule-import/conflict-engine";

/**
 * Maps date string (YYYY-MM-DD) to Indonesian ScheduleDay
 */
export function getDayFromDateString(dateStr: string): ScheduleDay {
  const parts = dateStr.split("T")[0].split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const parsed = new Date(year, month, day, 12, 0, 0);
    const dayIdx = parsed.getDay();
    const map: Record<number, ScheduleDay> = {
      0: "Minggu",
      1: "Senin",
      2: "Selasa",
      3: "Rabu",
      4: "Kamis",
      5: "Jumat",
      6: "Sabtu",
    };
    return map[dayIdx] || "Senin";
  }
  return "Senin";
}

/**
 * Generates Smart Daily Study Plan ("Susun Hari Saya")
 */
export function generateDailyPlan(
  req: DailyPlanRequest,
  existingSchedules: ScheduleItem[] = [],
  tasks: Task[] = []
): DailyPlanResult {
  const targetDay = req.day || (req.date ? getDayFromDateString(req.date) : "Senin");
  const targetHours = req.targetStudyHours || 3;
  const targetMinutes = Math.round(targetHours * 60);
  const maxDailyMinutes = req.maxDailyStudyMinutes || DEFAULT_MAX_DAILY_STUDY_MINUTES;
  const minBreakMinutes = req.minBreakMinutes || DEFAULT_MIN_BREAK_MINUTES;

  const warnings: string[] = [];

  // 1. Analyze existing workload for this day
  const workloadSummary = analyzeWorkload(existingSchedules, tasks);
  const dayWorkload = workloadSummary.dailyBreakdown[targetDay];

  // 2. Analyze deadlines
  const deadlines = analyzeTaskDeadlines(tasks);

  // 3. Find available free time slots
  const freeSlots = analyzeFreeTimeSlots(targetDay, existingSchedules, {
    date: req.date,
    minBreakMinutes,
    minSlotDurationMinutes: 45,
  });

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
      warnings: ["Tidak ada slot waktu luang yang mencukupi pada hari ini karena jadwal perkuliahan yang padat."],
      error: "Tidak ditemukan slot waktu luang yang tersedia.",
    };
  }

  // 4. Determine tasks to schedule
  const tasksToSchedule: Array<{ title: string; subject?: string; taskId?: string; urgency?: any; priority: any }> = [];

  if (req.priorityTaskIds && req.priorityTaskIds.length > 0) {
    for (const taskId of req.priorityTaskIds) {
      const taskObj = tasks.find((t) => t.id === taskId);
      const deadlineObj = deadlines.find((d) => d.taskId === taskId);
      if (taskObj) {
        tasksToSchedule.push({
          title: `Belajar & Mengerjakan: ${taskObj.title}`,
          subject: taskObj.subject || undefined,
          taskId: taskObj.id,
          urgency: deadlineObj?.urgency,
          priority: taskObj.priority || "sedang",
        });
      }
    }
  }

  // Fallback if no specific priority tasks selected: take top urgent deadlines
  if (tasksToSchedule.length === 0) {
    const topUrgent = deadlines.slice(0, 3);
    for (const d of topUrgent) {
      tasksToSchedule.push({
        title: `Persiapan: ${d.title}`,
        subject: d.subject,
        taskId: d.taskId,
        urgency: d.urgency,
        priority: d.priority,
      });
    }
  }

  if (tasksToSchedule.length === 0) {
    tasksToSchedule.push({
      title: "Sesi Belajar Mandiri & Eksplorasi Akademik",
      subject: "Fokus Mandiri",
      priority: "sedang",
    });
  }

  // 5. Fill free slots with study sessions up to target or daily limit
  const recommendedSessions: ScheduleRecommendation[] = [];
  let currentPlannedMinutes = 0;
  let taskIndex = 0;

  for (const slot of freeSlots) {
    if (currentPlannedMinutes >= targetMinutes) break;

    const remainingToTarget = targetMinutes - currentPlannedMinutes;
    // Session duration: between 60 to 90 mins, capped by slot duration and remaining target
    const sessionDuration = Math.min(slot.durationMinutes, remainingToTarget, 90);

    if (sessionDuration < 45) continue;

    // Safety check: workload limit
    const safety = validateDailyStudyLimit(
      dayWorkload.studyMinutes + currentPlannedMinutes,
      sessionDuration,
      maxDailyMinutes
    );

    if (!safety.isValid) {
      warnings.push(`Sesi dibatasi agar tidak melampaui batas belajar harian (${maxDailyMinutes} menit).`);
      break;
    }

    const currentTask = tasksToSchedule[taskIndex % tasksToSchedule.length];
    taskIndex++;

    const slotStartMin = timeToMinutes(slot.startTime)!;
    const sessionEndMin = slotStartMin + sessionDuration;
    const sessionEndTime = minutesToTimeStr(sessionEndMin);

    const deadlineInfo = deadlines.find((d) => d.taskId === currentTask.taskId);

    const scoreRes = calculatePriorityScore({
      deadlineUrgency: currentTask.urgency,
      taskPriority: currentTask.priority,
      timePreferenceMatch: true,
      dayWorkloadLevel: dayWorkload.level,
      slotDurationMinutes: slot.durationMinutes,
      targetDurationMinutes: sessionDuration,
    });

    const explanation = buildRecommendationExplanation({
      activity: currentTask.title,
      day: targetDay,
      startTime: slot.startTime,
      endTime: sessionEndTime,
      durationMinutes: sessionDuration,
      deadlineUrgencyLabel: deadlineInfo?.urgencyLabel,
      deadlineDaysRemaining: deadlineInfo?.daysRemaining,
      factors: scoreRes.factors,
      checkedSchedulesCount: existingSchedules.length,
      maxDailyMinutes,
      minBreakMinutes,
    });

    recommendedSessions.push({
      id: `rec_day_${Date.now()}_${recommendedSessions.length + 1}`,
      activity: currentTask.title,
      subject: currentTask.subject || "Akademik",
      day: targetDay,
      date: req.date,
      startTime: slot.startTime,
      endTime: sessionEndTime,
      durationMinutes: sessionDuration,
      priority: currentTask.priority,
      reason: explanation.summary,
      evidence: explanation.evidence,
      conflictStatus: "VERIFIED_NO_CONFLICT",
      confidence: scoreRes.score / 100,
      explanation,
      taskId: currentTask.taskId,
      selected: true,
    });

    currentPlannedMinutes += sessionDuration;
  }

  const targetMet = currentPlannedMinutes >= targetMinutes;
  if (!targetMet && recommendedSessions.length > 0) {
    warnings.push(
      `Slot waktu luang pada hari ini hanya mencukupi untuk ${parseFloat((currentPlannedMinutes / 60).toFixed(1))} jam dari target ${targetHours} jam.`
    );
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
  };
}

/**
 * Generates Smart Weekly Study Plan ("Susun Minggu Saya")
 */
export function generateWeeklyPlan(
  req: WeeklyPlanRequest,
  existingSchedules: ScheduleItem[] = [],
  tasks: Task[] = []
): WeeklyPlanResult {
  const preferredDays = req.preferredDays && req.preferredDays.length > 0
    ? req.preferredDays
    : (["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] as ScheduleDay[]);

  const targetTotalMinutes = Math.round(req.targetStudyHoursTotal * 60);
  const maxDailyMinutes = req.maxDailyStudyMinutes || DEFAULT_MAX_DAILY_STUDY_MINUTES;
  const minBreakMinutes = req.minBreakMinutes || DEFAULT_MIN_BREAK_MINUTES;

  const warnings: string[] = [];
  const allSessions: ScheduleRecommendation[] = [];
  const dailyBreakdown: Record<ScheduleDay, { sessions: ScheduleRecommendation[]; totalMinutes: number; level: any }> = {
    Senin: { sessions: [], totalMinutes: 0, level: "RINGAN" },
    Selasa: { sessions: [], totalMinutes: 0, level: "RINGAN" },
    Rabu: { sessions: [], totalMinutes: 0, level: "RINGAN" },
    Kamis: { sessions: [], totalMinutes: 0, level: "RINGAN" },
    Jumat: { sessions: [], totalMinutes: 0, level: "RINGAN" },
    Sabtu: { sessions: [], totalMinutes: 0, level: "RINGAN" },
    Minggu: { sessions: [], totalMinutes: 0, level: "RINGAN" },
  };

  const overloadedDays: ScheduleDay[] = [];
  const workloadSummary = analyzeWorkload(existingSchedules, tasks);
  const deadlines = analyzeTaskDeadlines(tasks);

  let totalWeeklyPlannedMinutes = 0;
  const minutesPerDayTarget = Math.ceil(targetTotalMinutes / preferredDays.length);

  // Distribute sessions across preferred days
  for (const day of preferredDays) {
    if (totalWeeklyPlannedMinutes >= targetTotalMinutes) break;

    const dayWorkload = workloadSummary.dailyBreakdown[day];
    if (dayWorkload.isOverloaded) {
      overloadedDays.push(day);
      warnings.push(`Hari ${day} dilewati karena beban perkuliahan sudah padat (${dayWorkload.totalHours} jam).`);
      continue;
    }

    const freeSlots = analyzeFreeTimeSlots(day, existingSchedules, {
      minBreakMinutes,
      minSlotDurationMinutes: 45,
    });

    let dayPlannedMinutes = 0;

    for (const slot of freeSlots) {
      if (dayPlannedMinutes >= minutesPerDayTarget || totalWeeklyPlannedMinutes >= targetTotalMinutes) {
        break;
      }

      const sessionDuration = Math.min(slot.durationMinutes, minutesPerDayTarget - dayPlannedMinutes, 90);
      if (sessionDuration < 45) continue;

      const safety = validateDailyStudyLimit(
        dayWorkload.studyMinutes + dayPlannedMinutes,
        sessionDuration,
        maxDailyMinutes
      );

      if (!safety.isValid) break;

      const slotStartMin = timeToMinutes(slot.startTime)!;
      const sessionEndTime = minutesToTimeStr(slotStartMin + sessionDuration);

      const topTask = deadlines[0];

      const explanation = buildRecommendationExplanation({
        activity: topTask ? `Persiapan: ${topTask.title}` : "Sesi Belajar Mandiri Mingguan",
        day,
        startTime: slot.startTime,
        endTime: sessionEndTime,
        durationMinutes: sessionDuration,
        factors: ["Waktu luang mingguan optimal", "Penyeimbangan beban belajar harian"],
        checkedSchedulesCount: existingSchedules.length,
        maxDailyMinutes,
        minBreakMinutes,
      });

      const rec: ScheduleRecommendation = {
        id: `rec_week_${day}_${Date.now()}_${allSessions.length + 1}`,
        activity: topTask ? `Persiapan: ${topTask.title}` : "Sesi Belajar Mandiri Mingguan",
        subject: topTask?.subject || "Akademik",
        day,
        startTime: slot.startTime,
        endTime: sessionEndTime,
        durationMinutes: sessionDuration,
        priority: topTask?.priority || "sedang",
        reason: explanation.summary,
        evidence: explanation.evidence,
        conflictStatus: "VERIFIED_NO_CONFLICT",
        confidence: 0.9,
        explanation,
        taskId: topTask?.taskId,
        selected: true,
      };

      allSessions.push(rec);
      dailyBreakdown[day].sessions.push(rec);
      dailyBreakdown[day].totalMinutes += sessionDuration;
      dayPlannedMinutes += sessionDuration;
      totalWeeklyPlannedMinutes += sessionDuration;
    }
  }

  return {
    success: allSessions.length > 0,
    totalWeeklyMinutesPlanned: totalWeeklyPlannedMinutes,
    totalWeeklyHoursPlanned: parseFloat((totalWeeklyPlannedMinutes / 60).toFixed(1)),
    recommendedSessionsCount: allSessions.length,
    sessions: allSessions,
    dailyBreakdown,
    overloadedDays,
    warnings,
  };
}

/**
 * Analyzes impact when a schedule event moves or changes, and finds alternative slots
 */
export function detectRescheduleImpact(
  changedEvent: {
    id?: string;
    title: string;
    day: ScheduleDay;
    newStartTime: string;
    newEndTime: string;
  },
  existingSchedules: ScheduleItem[] = [],
  _tasks: Task[] = []
): RescheduleImpact {
  const proposals: RescheduleProposal[] = [];
  const warnings: string[] = [];

  // Find other schedules on the same day that overlap with changed event
  for (const s of existingSchedules) {
    if (s.id !== changedEvent.id && s.day === changedEvent.day) {
      const sStart = s.start_time || (s.time ? s.time.split("-")[0].trim() : "");
      const sEnd = s.end_time || (s.time ? s.time.split("-")[1]?.trim() : "");

      if (sStart && sEnd) {
        if (checkIntervalOverlap(changedEvent.newStartTime, changedEvent.newEndTime, sStart, sEnd)) {
          // Find alternative free slot on the same day or next days
          const freeSlots = analyzeFreeTimeSlots(changedEvent.day, existingSchedules, {
            minSlotDurationMinutes: 60,
          });

          const availableAlternative = freeSlots.find(
            (f) => !checkIntervalOverlap(changedEvent.newStartTime, changedEvent.newEndTime, f.startTime, f.endTime)
          );

          if (availableAlternative) {
            proposals.push({
              impactedSessionId: s.id,
              originalDay: s.day as ScheduleDay,
              originalStartTime: sStart,
              originalEndTime: sEnd,
              title: s.title,
              proposedSlot: availableAlternative,
              reason: `Sesi '${s.title}' bentrok dengan jadwal baru '${changedEvent.title}' (${changedEvent.newStartTime}–${changedEvent.newEndTime}).`,
            });
          } else {
            warnings.push(`Tidak ditemukan slot alternatif bebas bentrok pada hari ${changedEvent.day} untuk sesi '${s.title}'.`);
          }
        }
      }
    }
  }

  return {
    hasImpact: proposals.length > 0,
    changedEvent,
    impactedSessionsCount: proposals.length,
    proposals,
    warnings,
  };
}
