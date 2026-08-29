import { ScheduleItem, Task, ScheduleDay } from "@/types";
import { createMockScheduleItem, createMockTask } from "./scenario-generator";
import { SessionOutcome } from "../schedule-outcomes/types";

export type ProductExperienceCategory =
  | "FIRST_TIME_USER"
  | "RETURNING_USER"
  | "NO_SCHEDULE"
  | "NO_DEADLINE"
  | "MANY_DEADLINES"
  | "HEAVY_WORKLOAD"
  | "MISSED_SESSIONS"
  | "SCHEDULE_MUTATION"
  | "STALE_PROPOSAL"
  | "CONCURRENT_UPDATE"
  | "EMPTY_INTELLIGENCE"
  | "PARTIAL_DATA"
  | "NETWORK_FAILURE"
  | "DATABASE_FAILURE"
  | "MOBILE_INTERACTION"
  | "RECOMMENDATION_ACCEPTANCE"
  | "RECOMMENDATION_REJECTION"
  | "RECOMMENDATION_ROLLBACK"
  | "EXPLAINABILITY"
  | "EARLY_WARNING"
  | "OUTCOME_RECORDING"
  | "MULTI_WEEK_BEHAVIOR"
  | "CROSS_ENGINE_REGRESSION"
  | "SECURITY_REGRESSION"
  | "PERFORMANCE_REGRESSION";

export interface ProductExperienceScenario {
  id: string;
  category: ProductExperienceCategory;
  title: string;
  description: string;
  userId: string;
  schedules: ScheduleItem[];
  tasks: Task[];
  outcomes?: SessionOutcome[];
  parentSnapshotHash?: string;
  expectedBehavior: {
    canGenerateIntelligence: boolean;
    expectedHealthScoreMin?: number;
    expectedHealthScoreMax?: number;
    shouldBlockApproval?: boolean;
    expectedAlertSeverity?: "INFO" | "WARNING" | "CRITICAL";
    expectedMaxLatencyMs?: number;
  };
}

const DAYS: ScheduleDay[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export function generateProductExperienceScenarios(): ProductExperienceScenario[] {
  const scenarios: ProductExperienceScenario[] = [];

  const CATEGORIES: ProductExperienceCategory[] = [
    "FIRST_TIME_USER",
    "RETURNING_USER",
    "NO_SCHEDULE",
    "NO_DEADLINE",
    "MANY_DEADLINES",
    "HEAVY_WORKLOAD",
    "MISSED_SESSIONS",
    "SCHEDULE_MUTATION",
    "STALE_PROPOSAL",
    "CONCURRENT_UPDATE",
    "EMPTY_INTELLIGENCE",
    "PARTIAL_DATA",
    "NETWORK_FAILURE",
    "DATABASE_FAILURE",
    "MOBILE_INTERACTION",
    "RECOMMENDATION_ACCEPTANCE",
    "RECOMMENDATION_REJECTION",
    "RECOMMENDATION_ROLLBACK",
    "EXPLAINABILITY",
    "EARLY_WARNING",
    "OUTCOME_RECORDING",
    "MULTI_WEEK_BEHAVIOR",
    "CROSS_ENGINE_REGRESSION",
    "SECURITY_REGRESSION",
    "PERFORMANCE_REGRESSION",
  ];

  for (const cat of CATEGORIES) {
    for (let i = 1; i <= 6; i++) {
      const id = `EXP_${cat}_${i}`;
      const day = DAYS[(i - 1) % 5];
      const userId = `user_exp_${cat.toLowerCase()}_${i}`;

      let schedules: ScheduleItem[] = [];
      let tasks: Task[] = [];
      let outcomes: SessionOutcome[] = [];
      let parentSnapshotHash: string | undefined = undefined;
      let expectedBehavior: ProductExperienceScenario["expectedBehavior"] = {
        canGenerateIntelligence: true,
        expectedHealthScoreMin: 60,
        expectedMaxLatencyMs: 25,
      };

      switch (cat) {
        case "FIRST_TIME_USER":
          schedules = [];
          tasks = [];
          expectedBehavior = {
            canGenerateIntelligence: true,
            expectedHealthScoreMin: 100, // clean state
            expectedMaxLatencyMs: 15,
          };
          break;

        case "RETURNING_USER":
          schedules = [
            createMockScheduleItem({ id: `${id}_s1`, user_id: userId, day, start_time: "08:00", end_time: "10:00" }),
            createMockScheduleItem({ id: `${id}_s2`, user_id: userId, day, start_time: "13:00", end_time: "15:00" }),
          ];
          tasks = [
            createMockTask({ id: `${id}_t1`, user_id: userId, deadline: new Date(Date.now() + 86400000 * 4).toISOString() }),
          ];
          outcomes = [
            {
              id: `${id}_out1`,
              userId,
              scheduleItemId: `${id}_s1`,
              sessionTitle: "Belajar Mandiri",
              day,
              plannedStartTime: "19:00",
              plannedEndTime: "20:00",
              plannedDurationMinutes: 60,
              status: "COMPLETED",
              recordedAt: new Date().toISOString(),
            },
          ];
          expectedBehavior = {
            canGenerateIntelligence: true,
            expectedHealthScoreMin: 75,
            expectedMaxLatencyMs: 20,
          };
          break;

        case "NO_SCHEDULE":
          schedules = [];
          tasks = [createMockTask({ id: `${id}_t1`, user_id: userId })];
          expectedBehavior = {
            canGenerateIntelligence: true,
            expectedHealthScoreMin: 80,
            expectedMaxLatencyMs: 15,
          };
          break;

        case "NO_DEADLINE":
          schedules = [
            createMockScheduleItem({ id: `${id}_s1`, user_id: userId, day, start_time: "09:00", end_time: "11:00" }),
          ];
          tasks = [];
          expectedBehavior = {
            canGenerateIntelligence: true,
            expectedHealthScoreMin: 85,
            expectedMaxLatencyMs: 15,
          };
          break;

        case "MANY_DEADLINES":
          schedules = [
            createMockScheduleItem({ id: `${id}_s1`, user_id: userId, day, start_time: "08:00", end_time: "10:00" }),
          ];
          tasks = Array.from({ length: 5 }, (_, tIdx) =>
            createMockTask({
              id: `${id}_t_${tIdx}`,
              user_id: userId,
              title: `Tugas Ke-${tIdx + 1}`,
              deadline: new Date(Date.now() + 3600000 * (12 + tIdx * 18)).toISOString(),
              priority: tIdx === 0 ? "tinggi" : "sedang",
            })
          );
          expectedBehavior = {
            canGenerateIntelligence: true,
            expectedHealthScoreMin: 50,
            expectedAlertSeverity: "WARNING",
            expectedMaxLatencyMs: 30,
          };
          break;

        case "HEAVY_WORKLOAD":
          schedules = [
            createMockScheduleItem({ id: `${id}_s1`, user_id: userId, day, start_time: "08:00", end_time: "10:00" }), // 120m
            createMockScheduleItem({ id: `${id}_s2`, user_id: userId, day, start_time: "10:30", end_time: "12:30" }), // 120m
            createMockScheduleItem({ id: `${id}_s3`, user_id: userId, day, start_time: "13:30", end_time: "15:30" }), // 120m = 360m total
          ];
          tasks = [createMockTask({ id: `${id}_t1`, user_id: userId })];
          expectedBehavior = {
            canGenerateIntelligence: true,
            expectedHealthScoreMin: 40,
            expectedAlertSeverity: "CRITICAL",
            expectedMaxLatencyMs: 25,
          };
          break;

        case "MISSED_SESSIONS":
          schedules = [
            createMockScheduleItem({ id: `${id}_s1`, user_id: userId, day, start_time: "10:00", end_time: "12:00" }),
          ];
          outcomes = [
            {
              id: `${id}_out1`,
              userId,
              scheduleItemId: `${id}_s1`,
              sessionTitle: "Belajar Terlewat",
              day,
              plannedStartTime: "19:00",
              plannedEndTime: "20:30",
              plannedDurationMinutes: 90,
              status: "SKIPPED",
              skipReason: "KELELAHAN",
              recordedAt: new Date().toISOString(),
            },
          ];
          expectedBehavior = {
            canGenerateIntelligence: true,
            expectedHealthScoreMin: 60,
            expectedMaxLatencyMs: 20,
          };
          break;

        case "SCHEDULE_MUTATION":
          schedules = [
            createMockScheduleItem({ id: `${id}_s1`, user_id: userId, day: "Senin", start_time: "08:00", end_time: "10:00" }),
          ];
          expectedBehavior = {
            canGenerateIntelligence: true,
            expectedHealthScoreMin: 70,
            expectedMaxLatencyMs: 20,
          };
          break;

        case "STALE_PROPOSAL":
          schedules = [
            createMockScheduleItem({ id: `${id}_s1`, user_id: userId, day: "Selasa", start_time: "08:00", end_time: "10:00" }),
          ];
          parentSnapshotHash = "mutated_stale_hash_xyz";
          expectedBehavior = {
            canGenerateIntelligence: true,
            shouldBlockApproval: true,
            expectedMaxLatencyMs: 20,
          };
          break;

        case "CONCURRENT_UPDATE":
          schedules = [
            createMockScheduleItem({ id: `${id}_s1`, user_id: userId, day: "Rabu", start_time: "10:00", end_time: "12:00" }),
          ];
          parentSnapshotHash = "competing_version_abc";
          expectedBehavior = {
            canGenerateIntelligence: true,
            shouldBlockApproval: true,
            expectedMaxLatencyMs: 20,
          };
          break;

        default:
          schedules = [
            createMockScheduleItem({ id: `${id}_s1`, user_id: userId, day, start_time: "08:00", end_time: "10:00" }),
            createMockScheduleItem({ id: `${id}_s2`, user_id: userId, day, start_time: "14:00", end_time: "15:30" }),
          ];
          tasks = [createMockTask({ id: `${id}_t1`, user_id: userId })];
          expectedBehavior = {
            canGenerateIntelligence: true,
            expectedHealthScoreMin: 70,
            expectedMaxLatencyMs: 25,
          };
          break;
      }

      scenarios.push({
        id,
        category: cat,
        title: `Product Experience ${cat} #${i}`,
        description: `Evaluasi pengalaman produk kategori ${cat} skenario ke-${i}.`,
        userId,
        schedules,
        tasks,
        outcomes,
        parentSnapshotHash,
        expectedBehavior,
      });
    }
  }

  return scenarios;
}
