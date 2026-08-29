import { ScheduleItem, Task, ScheduleDay } from "@/types";
import {
  WorkloadLevel,
  DayWorkloadBreakdown,
  WorkloadSummary,
  WorkloadActivityEvidence,
} from "./types";
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

/**
 * Calculates duration in minutes from time range strings (e.g. "08:00 - 10:00")
 */
export function calculateItemDurationMinutes(item: {
  start_time?: string | null;
  end_time?: string | null;
  time?: string | null;
}): number {
  if (item.start_time && item.end_time) {
    const s = timeToMinutes(item.start_time);
    const e = timeToMinutes(item.end_time);
    if (s !== null && e !== null && e > s) {
      return e - s;
    }
  }

  if (item.time) {
    const parts = item.time.split("-");
    if (parts.length >= 2) {
      const match1 = parts[0].match(/(\d{1,2})[:.](\d{2})/);
      const match2 = parts[1].match(/(\d{1,2})[:.](\d{2})/);
      if (match1 && match2) {
        const s = parseInt(match1[1], 10) * 60 + parseInt(match1[2], 10);
        const e = parseInt(match2[1], 10) * 60 + parseInt(match2[2], 10);
        if (e > s) {
          return e - s;
        }
      }
    }
  }

  // Default fallback if time is not explicit: standard 90 mins
  return 90;
}

/**
 * Classifies numeric total minutes into canonical WorkloadLevel
 * RINGAN: <= 180m (<= 3h)
 * NORMAL: 181m - 300m (3h - 5h)
 * PADAT: 301m - 420m (5h - 7h)
 * SANGAT_PADAT: > 420m (> 7h)
 */
export function classifyWorkloadLevel(totalMinutes: number): WorkloadLevel {
  if (totalMinutes <= 180) return "RINGAN";
  if (totalMinutes <= 300) return "NORMAL";
  if (totalMinutes <= 420) return "PADAT";
  return "SANGAT_PADAT";
}

/**
 * Master Workload Analyzer
 * Calculates daily and weekly workload with explicit evidence breakdown
 */
export function analyzeWorkload(
  schedules: ScheduleItem[] = [],
  tasks: Task[] = []
): WorkloadSummary {
  const dailyBreakdown: Record<ScheduleDay, DayWorkloadBreakdown> = {
    Senin: createEmptyDayBreakdown("Senin"),
    Selasa: createEmptyDayBreakdown("Selasa"),
    Rabu: createEmptyDayBreakdown("Rabu"),
    Kamis: createEmptyDayBreakdown("Kamis"),
    Jumat: createEmptyDayBreakdown("Jumat"),
    Sabtu: createEmptyDayBreakdown("Sabtu"),
    Minggu: createEmptyDayBreakdown("Minggu"),
  };

  let hasAnyActivity = false;

  // 1. Process Schedules
  for (const s of schedules) {
    const day = s.day as ScheduleDay;
    if (!ALL_DAYS.includes(day)) continue;

    hasAnyActivity = true;
    const dur = calculateItemDurationMinutes(s);
    const timeSnippet = s.time || (s.start_time && s.end_time ? `${s.start_time} - ${s.end_time}` : "--:--");
    
    const typeStr = ((s.type as string) || "").toLowerCase();
    const titleLower = (s.title || "").toLowerCase();
    const isStudy =
      typeStr === "tugas" ||
      typeStr === "belajar" ||
      typeStr === "reminder" ||
      titleLower.includes("belajar") ||
      titleLower.includes("tugas") ||
      titleLower.includes("mandiri");
    const isLecture = !isStudy;

    const evidence: WorkloadActivityEvidence = {
      category: isLecture ? "kuliah" : "belajar",
      title: s.title,
      durationMinutes: dur,
      timeSnippet,
    };

    if (isLecture) {
      dailyBreakdown[day].lecturesMinutes += dur;
    } else {
      dailyBreakdown[day].studyMinutes += dur;
    }

    dailyBreakdown[day].totalMinutes += dur;
    dailyBreakdown[day].activities.push(evidence);
  }

  // 2. Finalize Day Statistics
  let totalWeeklyMinutes = 0;
  let overloadedDaysCount = 0;
  const evidenceSummary: string[] = [];

  for (const day of ALL_DAYS) {
    const dayStat = dailyBreakdown[day];
    dayStat.totalHours = parseFloat((dayStat.totalMinutes / 60).toFixed(1));
    dayStat.level = classifyWorkloadLevel(dayStat.totalMinutes);
    dayStat.isOverloaded = dayStat.totalMinutes > 360; // Over 6 hours in a single day

    if (dayStat.isOverloaded) {
      overloadedDaysCount++;
    }

    totalWeeklyMinutes += dayStat.totalMinutes;

    if (dayStat.totalMinutes > 0) {
      const summaryText = `${day}: ${dayStat.totalHours} jam (${dayStat.level}) - ${dayStat.activities.length} agenda`;
      evidenceSummary.push(summaryText);
    }
  }

  const isSufficientData = hasAnyActivity;
  const totalWeeklyHours = parseFloat((totalWeeklyMinutes / 60).toFixed(1));
  const activeDaysCount = ALL_DAYS.filter((d) => dailyBreakdown[d].totalMinutes > 0).length || 1;
  const averageDailyMinutes = Math.round(totalWeeklyMinutes / 7);
  const averageDailyHours = parseFloat((averageDailyMinutes / 60).toFixed(1));
  const overallLevel = classifyWorkloadLevel(Math.round(totalWeeklyMinutes / activeDaysCount));

  return {
    isSufficientData,
    totalWeeklyMinutes,
    totalWeeklyHours,
    averageDailyMinutes,
    averageDailyHours,
    overallLevel,
    dailyBreakdown,
    overloadedDaysCount,
    evidenceSummary: isSufficientData ? evidenceSummary : ["Data belum cukup untuk menghitung beban secara akurat."],
  };
}

function createEmptyDayBreakdown(day: ScheduleDay): DayWorkloadBreakdown {
  return {
    day,
    lecturesMinutes: 0,
    studyMinutes: 0,
    taskMinutes: 0,
    totalMinutes: 0,
    totalHours: 0,
    level: "RINGAN",
    activities: [],
    isOverloaded: false,
  };
}
