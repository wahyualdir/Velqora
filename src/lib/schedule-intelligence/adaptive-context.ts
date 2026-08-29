import { ScheduleItem, Task, ScheduleDay } from "@/types";
import {
  AdaptiveScheduleContext,
  DayWorkloadBreakdown,
  DeadlineAnalysisItem,
  FreeTimeSlot,
} from "./types";
import { analyzeWorkload } from "./workload-analyzer";
import { analyzeTaskDeadlines } from "./deadline-analyzer";
import { analyzeFreeTimeSlots } from "./free-time-analyzer";
import { getDayFromDateString } from "./recommendation-engine";
import { detectAllScheduleConflicts } from "../schedule-import/conflict-engine";

/**
 * Builds a dynamic, real-time snapshot of the user's academic and schedule state
 */
export function buildAdaptiveScheduleContext(
  userId: string,
  schedules: ScheduleItem[] = [],
  tasks: Task[] = [],
  referenceDate: Date = new Date()
): AdaptiveScheduleContext {
  const currentDateIso = referenceDate.toISOString().split("T")[0];
  const currentDay = getDayFromDateString(currentDateIso);

  // 1. Group schedules by type and day
  const todayLectures: ScheduleItem[] = [];
  const weekLectures: ScheduleItem[] = [];
  const activeStudySessions: ScheduleItem[] = [];

  for (const s of schedules) {
    const isToday = s.day === currentDay;
    const typeStr = ((s.type as string) || "").toLowerCase();
    const titleLower = (s.title || "").toLowerCase();

    const isStudy =
      typeStr === "tugas" ||
      typeStr === "belajar" ||
      typeStr === "reminder" ||
      titleLower.includes("belajar") ||
      titleLower.includes("tugas") ||
      titleLower.includes("mandiri");

    if (isStudy) {
      activeStudySessions.push(s);
    } else {
      weekLectures.push(s);
      if (isToday) {
        todayLectures.push(s);
      }
    }
  }

  // 2. Compute Workload & Deadlines
  const weeklyWorkload = analyzeWorkload(schedules, tasks);
  const todayWorkload = weeklyWorkload.dailyBreakdown[currentDay];
  const deadlines = analyzeTaskDeadlines(tasks, referenceDate);
  const criticalDeadlines = deadlines.filter(
    (d) => d.urgency === "CRITICAL" || d.urgency === "URGENT" || d.urgency === "OVERDUE"
  );

  // 3. Compute Today's Free Slots (07:00 - 22:30 with 30m break buffer)
  const todayFreeSlots = analyzeFreeTimeSlots(currentDay, schedules, {
    date: currentDateIso,
    minBreakMinutes: 30,
    minSlotDurationMinutes: 45,
  });

  // 4. Conflicts & Recovery Status
  const conflictResults = detectAllScheduleConflicts(
    schedules.map((s, idx) => ({
      id: s.id || `sched_${idx}`,
      title: s.title,
      day: s.day as ScheduleDay,
      startTime: s.start_time || (s.time ? s.time.split("-")[0]?.trim() : ""),
      endTime: s.end_time || (s.time ? s.time.split("-")[1]?.trim() : ""),
      confidence: "verified" as const,
    }))
  );
  const activeConflicts = conflictResults.filter((c) => c.hasConflict);

  const isOverloaded = todayWorkload.isOverloaded || todayWorkload.level === "SANGAT_PADAT";
  const recoveryModeActive = isOverloaded || activeConflicts.length > 0;
  const incompleteTasks = tasks.filter((t) => t.status !== "selesai");

  return {
    userId,
    currentDateIso,
    currentDay,
    todayLectures,
    weekLectures,
    activeStudySessions,
    activeTasks: incompleteTasks,
    criticalDeadlines,
    todayFreeSlots,
    todayWorkload,
    weeklyWorkload,
    isOverloaded,
    recoveryModeActive,
    activeConflictsCount: activeConflicts.length,
    incompleteTasksCount: incompleteTasks.length,
  };
}
