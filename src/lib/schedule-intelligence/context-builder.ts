import { ScheduleItem, Task } from "@/types";
import { ScheduleIntelligenceContext } from "./types";
import { analyzeWorkload } from "./workload-analyzer";
import { analyzeTaskDeadlines } from "./deadline-analyzer";
import { analyzeFreeTimeSlots } from "./free-time-analyzer";

/**
 * Builds deterministic context of user's academic schedule, workload, and deadlines
 */
export function buildScheduleIntelligenceContext(
  userId: string,
  schedules: ScheduleItem[] = [],
  tasks: Task[] = []
): ScheduleIntelligenceContext {
  const workload = analyzeWorkload(schedules, tasks);
  const deadlines = analyzeTaskDeadlines(tasks);

  // Count available free slots across all active days
  let totalAvailableSlots = 0;
  const days: Array<"Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | "Sabtu" | "Minggu"> = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];

  for (const day of days) {
    const slots = analyzeFreeTimeSlots(day, schedules, {
      minSlotDurationMinutes: 45,
    });
    totalAvailableSlots += slots.length;
  }

  return {
    userId,
    generatedAt: new Date().toISOString(),
    schedules,
    tasks,
    workload,
    deadlines,
    availableSlotsCount: totalAvailableSlots,
  };
}
