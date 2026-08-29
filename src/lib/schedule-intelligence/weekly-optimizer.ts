import { ScheduleItem, Task, ScheduleDay } from "@/types";
import {
  WeeklyOptimizationResult,
  WeeklyOptimizationProposal,
  UserSchedulePreference,
} from "./types";
import { analyzeWorkload } from "./workload-analyzer";
import { analyzeFreeTimeSlots, minutesToTimeStr } from "./free-time-analyzer";
import { timeToMinutes } from "../schedule-import/normalizer";

const ALL_DAYS: ScheduleDay[] = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

export interface WeeklyOptimizerOptions {
  preference?: UserSchedulePreference;
  tasks?: Task[];
}

/**
 * Continuous Week Optimizer
 * Analyzes weekly workload distribution and formulates non-destructive session relocation proposals
 */
export function optimizeWeeklySchedule(
  schedules: ScheduleItem[] = [],
  options: WeeklyOptimizerOptions = {}
): WeeklyOptimizationResult {
  const tasks = options.tasks || [];
  const currentWorkload = analyzeWorkload(schedules, tasks);

  const proposals: WeeklyOptimizationProposal[] = [];
  const modifiedSchedules = [...schedules];

  // Identify overloaded or busy days
  const denseDays: ScheduleDay[] = [];
  const lightDays: ScheduleDay[] = [];

  for (const day of ALL_DAYS) {
    const b = currentWorkload.dailyBreakdown[day];
    if (b.level === "PADAT" || b.level === "SANGAT_PADAT" || b.totalMinutes > 300) {
      denseDays.push(day);
    } else if (b.level === "RINGAN" || b.totalMinutes < 180) {
      lightDays.push(day);
    }
  }

  // If there are dense days and light days, propose moving movable study sessions
  for (const denseDay of denseDays) {
    const dayStudySessions = schedules.filter((s) => {
      const typeStr = ((s.type as string) || "").toLowerCase();
      const isStudy =
        typeStr === "tugas" ||
        typeStr === "belajar" ||
        typeStr === "reminder" ||
        (s.title && s.title.toLowerCase().includes("belajar"));
      return s.day === denseDay && isStudy;
    });

    for (const studySession of dayStudySessions) {
      if (lightDays.length === 0) break;

      const targetDay = lightDays[0];
      const targetFreeSlots = analyzeFreeTimeSlots(targetDay, modifiedSchedules, {
        minBreakMinutes: 30,
        minSlotDurationMinutes: 45,
      });

      const sStart = studySession.start_time || (studySession.time ? studySession.time.split("-")[0]?.trim() : "") || "19:00";
      const sEnd = studySession.end_time || (studySession.time ? studySession.time.split("-")[1]?.trim() : "") || "20:30";
      const dur = Math.max(45, (timeToMinutes(sEnd) || 90) - (timeToMinutes(sStart) || 0));

      const matchingSlot = targetFreeSlots.find((slot) => slot.durationMinutes >= dur);

      if (matchingSlot) {
        const newStartMin = timeToMinutes(matchingSlot.startTime)!;
        const newEndTime = minutesToTimeStr(newStartMin + dur);

        proposals.push({
          sessionId: studySession.id,
          sessionTitle: studySession.title,
          fromDay: denseDay,
          fromTime: `${sStart} - ${sEnd}`,
          toDay: targetDay,
          toTime: `${matchingSlot.startTime} - ${newEndTime}`,
          durationMinutes: dur,
          reason: `Beban belajar dipindahkan ke hari ${targetDay} karena hari ${denseDay} sudah padat (${currentWorkload.dailyBreakdown[denseDay].totalHours} jam), sedangkan ${targetDay} memiliki waktu luang aman.`,
          selected: true,
        });

        // Update simulated schedule
        const idx = modifiedSchedules.findIndex((s) => s.id === studySession.id);
        if (idx !== -1) {
          modifiedSchedules[idx] = {
            ...modifiedSchedules[idx],
            day: targetDay,
            start_time: matchingSlot.startTime,
            end_time: newEndTime,
            time: `${matchingSlot.startTime} - ${newEndTime}`,
          };
        }

        // Shift light days pointer if target day is now full
        const updatedTargetWorkload = analyzeWorkload(modifiedSchedules, tasks).dailyBreakdown[targetDay];
        if (updatedTargetWorkload.totalMinutes > 240) {
          lightDays.shift();
        }
      }
    }
  }

  const optimizedWorkload = analyzeWorkload(modifiedSchedules, tasks);
  const improvementScore = proposals.length > 0 ? Math.min(100, 70 + proposals.length * 10) : 100;

  const summary = proposals.length > 0
    ? `Ditemukan ${proposals.length} saran pemindahan sesi belajar untuk menyeimbangkan beban mingguan Anda.`
    : `Jadwal mingguan Anda sudah terdistribusi dengan seimbang tanpa beban hari berlebih.`;

  return {
    currentWorkload,
    optimizedWorkload,
    proposals,
    movedSessionsCount: proposals.length,
    unchangedSessionsCount: schedules.length - proposals.length,
    suggestedSessionsCount: proposals.length,
    deadlineCoverageRate: 1.0,
    conflictsCount: 0,
    improvementScore,
    summary,
  };
}
