import { ScheduleItem, Task, ScheduleDay } from "@/types";
import {
  ThreeWayWhatIfResult,
  ScenarioMetrics,
  SimulationModification,
} from "./types";
import { detectAllScheduleConflicts } from "../schedule-import/conflict-engine";
import { analyzeWorkload } from "../schedule-intelligence/workload-analyzer";
import { analyzeDeadlineCoverage } from "../schedule-intelligence/deadline-coverage";
import { analyzeScheduleRealism } from "../schedule-intelligence/schedule-realism";
import { analyzeFreeTimeSlots } from "../schedule-intelligence/free-time-analyzer";
import { calculateAcademicHealthScore } from "../schedule-orchestration/academic-health";

const ALL_DAYS: ScheduleDay[] = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

function buildScenarioMetrics(
  scenarioName: "SCENARIO_A_CURRENT" | "SCENARIO_B_PROPOSED" | "SCENARIO_C_RECOVERY",
  title: string,
  schedules: ScheduleItem[],
  tasks: Task[]
): ScenarioMetrics {
  const conflicts = detectAllScheduleConflicts(schedules as any).filter(
    (s) => s.hasConflict
  );
  const workload = analyzeWorkload(schedules);
  const realism = analyzeScheduleRealism(schedules);
  const health = calculateAcademicHealthScore(schedules, tasks);

  const taskReports = tasks.map((t) => analyzeDeadlineCoverage(t, schedules));
  const coveredCount = taskReports.filter(
    (r) => r.status !== "INSUFFICIENT_TIME" && r.status !== "OVERDUE"
  ).length;
  const deadlineCoverageRate =
    tasks.length > 0
      ? Math.round((coveredCount / tasks.length) * 100)
      : 100;

  const freeSlots = ALL_DAYS.flatMap((d) => analyzeFreeTimeSlots(d, schedules));
  const totalFreeMinutes = freeSlots.reduce((acc, s) => acc + s.durationMinutes, 0);
  const freeTimeHours = Math.round((totalFreeMinutes / 60) * 10) / 10;

  let riskLevel: "RENDAH" | "SEDANG" | "TINGGI" | "KRITIS" = "RENDAH";
  if (conflicts.length > 0) riskLevel = "KRITIS";
  else if (workload.overloadedDaysCount > 1 || deadlineCoverageRate < 50) riskLevel = "TINGGI";
  else if (workload.overloadedDaysCount === 1 || deadlineCoverageRate < 80) riskLevel = "SEDANG";

  return {
    scenarioName,
    title,
    conflictsCount: conflicts.length,
    totalWorkloadMinutes: workload.totalWeeklyMinutes,
    overloadedDaysCount: workload.overloadedDaysCount,
    deadlineCoverageRate,
    freeTimeHours,
    healthScore: health.overallScore,
    realismScore: realism.overallRealismScore,
    riskLevel,
  };
}

/**
 * 3-Way What-If Outcome Simulator
 * Evaluates Scenario A (Current) vs Scenario B (Proposed Modification) vs Scenario C (Balanced Recovery Plan)
 * Completely side-effect free and memory-safe.
 */
export function simulateThreeWayOutcome(
  originalSchedules: ScheduleItem[],
  tasks: Task[] = [],
  modification: SimulationModification
): ThreeWayWhatIfResult {
  const simulationId = `sim3_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  // 1. Build Scenario A (Current Schedule)
  const scenarioA = buildScenarioMetrics(
    "SCENARIO_A_CURRENT",
    "Jadwal Saat Ini",
    originalSchedules,
    tasks
  );

  // 2. Build Scenario B (Proposed Modification)
  let proposedSchedules: ScheduleItem[] = originalSchedules.map((s) => ({ ...s }));

  if (modification.action === "MOVE_ITEM" && modification.itemId) {
    proposedSchedules = proposedSchedules.map((s) => {
      if (s.id === modification.itemId) {
        const newDay = modification.targetDay || s.day;
        const newStart = modification.targetStartTime || s.start_time;
        const newEnd = modification.targetEndTime || s.end_time;
        return {
          ...s,
          day: newDay,
          start_time: newStart,
          end_time: newEnd,
          time: `${newStart} - ${newEnd}`,
        };
      }
      return s;
    });
  } else if (modification.action === "ADD_ITEM" && modification.item) {
    proposedSchedules.push({ ...modification.item });
  } else if (modification.action === "DELETE_ITEM" && modification.itemId) {
    proposedSchedules = proposedSchedules.filter((s) => s.id !== modification.itemId);
  }

  const scenarioB = buildScenarioMetrics(
    "SCENARIO_B_PROPOSED",
    "Jadwal Setelah Perubahan",
    proposedSchedules,
    tasks
  );

  // 3. Build Scenario C (Recovery / Balanced Plan)
  // Relocate overloaded study sessions to lighter days
  const recoverySchedules: ScheduleItem[] = proposedSchedules.map((s) => {
    // If proposed item still has heavy hours, distribute to Friday / weekend if free
    if (s.id === modification.itemId && scenarioB.conflictsCount > 0) {
      return {
        ...s,
        day: "Jumat" as ScheduleDay,
        start_time: "16:00",
        end_time: "17:30",
        time: "16:00 - 17:30",
      };
    }
    return { ...s };
  });

  const scenarioC = buildScenarioMetrics(
    "SCENARIO_C_RECOVERY",
    "Rencana Pemulihan Seimbang",
    recoverySchedules,
    tasks
  );

  // Determine Best Scenario
  let bestScenario: "SCENARIO_A_CURRENT" | "SCENARIO_B_PROPOSED" | "SCENARIO_C_RECOVERY" = "SCENARIO_A_CURRENT";

  if (scenarioB.conflictsCount === 0 && scenarioB.healthScore >= scenarioA.healthScore) {
    bestScenario = "SCENARIO_B_PROPOSED";
  } else if (scenarioC.conflictsCount === 0 && scenarioC.healthScore >= scenarioA.healthScore) {
    bestScenario = "SCENARIO_C_RECOVERY";
  } else if (scenarioA.conflictsCount === 0) {
    bestScenario = "SCENARIO_A_CURRENT";
  } else {
    bestScenario = "SCENARIO_C_RECOVERY";
  }

  const isSafeToApply = scenarioB.conflictsCount === 0;

  const tradeOffSummary = `Perbandingan 3 Skenario: Skenario A (Skor ${scenarioA.healthScore}), Skenario B (Skor ${scenarioB.healthScore}), Skenario C (Skor ${scenarioC.healthScore}). Skenario terbaik adalah ${bestScenario === "SCENARIO_B_PROPOSED" ? "Skenario B (Usulan Baru)" : bestScenario === "SCENARIO_C_RECOVERY" ? "Skenario C (Pemulihan Beban)" : "Skenario A (Pertahankan Jadwal)"}.`;

  return {
    simulationId,
    scenarioA,
    scenarioB,
    scenarioC,
    bestScenario,
    tradeOffSummary,
    isSafeToApply,
  };
}
