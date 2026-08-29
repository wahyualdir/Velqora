export * from "./types";
export * from "./availability";
export * from "./constraints";
export * from "./conflict-engine";
export * from "./planner";

import { AutoScheduleGoalRequest, AutoSchedulePlanResult } from "./types";
import { ScheduleItem, Task } from "@/types";
import { planAcademicSchedule } from "./planner";
import { generateCorrelationId, logger } from "@/lib/observability";

/**
 * Main entry point for automatic academic schedule generation
 */
export async function generateAcademicSchedulePlan(
  request: AutoScheduleGoalRequest,
  existingSchedules: ScheduleItem[] = [],
  existingTasks: Task[] = [],
  providedCorrelationId?: string
): Promise<AutoSchedulePlanResult> {
  const correlationId = providedCorrelationId || generateCorrelationId("sched_gen");

  logger.info(
    "SCHEDULE_GENERATOR",
    `Planning schedule for goal: "${request.goalTitle}" (${request.durationMinutes}m, ${request.targetSessionsPerWeek}x/week, pref: ${request.timePreference})`,
    { goal: request.goalTitle, pref: request.timePreference },
    correlationId
  );

  const result = planAcademicSchedule(request, existingSchedules, existingTasks);

  logger.info(
    "SCHEDULE_GENERATOR",
    `Planner finished: ${result.candidates.length} candidates, ${result.recommendedSessionsCount} recommended slots`,
    { candidates: result.candidates.length, recommended: result.recommendedSessionsCount },
    correlationId
  );

  return result;
}
