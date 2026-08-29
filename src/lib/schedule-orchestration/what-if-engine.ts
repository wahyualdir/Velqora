import { ScheduleItem, Task, ScheduleDay } from "@/types";
import { detectAllScheduleConflicts } from "../schedule-import/conflict-engine";
import { analyzeWorkload, calculateItemDurationMinutes } from "../schedule-intelligence/workload-analyzer";
import { analyzeDeadlineCoverage } from "../schedule-intelligence/deadline-coverage";
import { analyzeFreeTimeSlots } from "../schedule-intelligence/free-time-analyzer";
import { computeStableSnapshotHash } from "./schedule-snapshot";
import { sanitizeSchedulePreferences } from "../schedule-intelligence/personal-profile";
import {
  SimulationChange,
  WhatIfSimulationResult,
  SimulationModification,
} from "./types";

export type { SimulationModification };

/**
 * Simulates the academic impact of moving, adding, or deleting a schedule event.
 * Purely functional and side-effect free (never mutates database or active state).
 */
export function simulateScheduleModification(
  originalSchedules: ScheduleItem[],
  tasks: Task[] = [],
  modification: SimulationModification
): WhatIfSimulationResult {
  const simulationId = `sim_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const preferences = sanitizeSchedulePreferences({});

  const ALL_DAYS: ScheduleDay[] = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];

  // 1. Build Original State Metrics
  const origConflicts = detectAllScheduleConflicts(
    originalSchedules as any
  ).filter((s) => s.hasConflict);
  const origWorkload = analyzeWorkload(originalSchedules);
  const origCoverageReports = tasks.map((t) =>
    analyzeDeadlineCoverage(t, originalSchedules)
  );
  const origFreeSlots = ALL_DAYS.flatMap((d) =>
    analyzeFreeTimeSlots(d, originalSchedules)
  );
  const origFreeTimeMinutes = origFreeSlots.reduce(
    (acc, slot) => acc + slot.durationMinutes,
    0
  );

  const origHash = computeStableSnapshotHash({
    userId: "sim_user",
    courses: originalSchedules.filter((s) => s.type === "jadwal"),
    studySessions: originalSchedules.filter((s) => s.type !== "jadwal"),
    tasks,
    preferences,
  });

  // 2. Generate Simulated Schedule Array
  let simulatedSchedules: ScheduleItem[] = originalSchedules.map((s) => ({ ...s }));
  const changes: SimulationChange[] = [];

  if (modification.action === "MOVE_ITEM" && modification.itemId) {
    simulatedSchedules = simulatedSchedules.map((s) => {
      if (s.id === modification.itemId) {
        const newDay = modification.targetDay || s.day;
        const newStart = modification.targetStartTime || s.start_time;
        const newEnd = modification.targetEndTime || s.end_time;
        const newTime = `${newStart} - ${newEnd}`;

        changes.push({
          description: `Agenda "${s.title}" dipindahkan dari ${s.day} (${s.time}) ke ${newDay} (${newTime}).`,
          impactType: "NEUTRAL",
        });

        return {
          ...s,
          day: newDay,
          start_time: newStart,
          end_time: newEnd,
          time: newTime,
        };
      }
      return s;
    });
  } else if (modification.action === "ADD_ITEM" && modification.item) {
    simulatedSchedules.push({ ...modification.item });
    changes.push({
      description: `Menambahkan agenda baru "${modification.item.title}" pada ${modification.item.day} (${modification.item.time}).`,
      impactType: "NEUTRAL",
    });
  } else if (modification.action === "DELETE_ITEM" && modification.itemId) {
    const target = simulatedSchedules.find((s) => s.id === modification.itemId);
    simulatedSchedules = simulatedSchedules.filter((s) => s.id !== modification.itemId);
    if (target) {
      changes.push({
        description: `Menghapus agenda "${target.title}" pada ${target.day} (${target.time}).`,
        impactType: "NEUTRAL",
      });
    }
  }

  // 3. Build Simulated State Metrics
  const simConflicts = detectAllScheduleConflicts(
    simulatedSchedules as any
  ).filter((s) => s.hasConflict);
  const simWorkload = analyzeWorkload(simulatedSchedules);
  const simCoverageReports = tasks.map((t) =>
    analyzeDeadlineCoverage(t, simulatedSchedules)
  );
  const simFreeSlots = ALL_DAYS.flatMap((d) =>
    analyzeFreeTimeSlots(d, simulatedSchedules)
  );
  const simFreeTimeMinutes = simFreeSlots.reduce(
    (acc, slot) => acc + slot.durationMinutes,
    0
  );

  const simHash = computeStableSnapshotHash({
    userId: "sim_user",
    courses: simulatedSchedules.filter((s) => s.type === "jadwal"),
    studySessions: simulatedSchedules.filter((s) => s.type !== "jadwal"),
    tasks,
    preferences,
  });

  // Evaluate impacts
  if (simConflicts.length > origConflicts.length) {
    changes.push({
      description: `Perubahan ini menciptakan ${simConflicts.length - origConflicts.length} bentrok jadwal baru!`,
      impactType: "NEGATIVE",
    });
  } else if (simConflicts.length < origConflicts.length) {
    changes.push({
      description: `Perubahan ini menyelesaikan ${origConflicts.length - simConflicts.length} bentrok jadwal.`,
      impactType: "POSITIVE",
    });
  }

  const isSafe = simConflicts.length <= origConflicts.length;

  const freeTimeBeforeHours = Math.round((origFreeTimeMinutes / 60) * 10) / 10;
  const freeTimeAfterHours = Math.round((simFreeTimeMinutes / 60) * 10) / 10;

  const origUrgentRisk = origCoverageReports.filter(
    (r) => r.status === "INSUFFICIENT_TIME" || r.riskLevel === "KRITIS" || r.riskLevel === "TINGGI"
  ).length;
  const simUrgentRisk = simCoverageReports.filter(
    (r) => r.status === "INSUFFICIENT_TIME" || r.riskLevel === "KRITIS" || r.riskLevel === "TINGGI"
  ).length;

  const deadlineRiskBefore =
    origUrgentRisk > 0 ? `${origUrgentRisk} tugas berisiko` : "Aman";
  const deadlineRiskAfter =
    simUrgentRisk > 0 ? `${simUrgentRisk} tugas berisiko` : "Aman";

  const summary = isSafe
    ? `Simulasi selesai: Perubahan aman diterapkan tanpa memicu bentrok jadwal baru.`
    : `Peringatan Simulasi: Perubahan ini berisiko memicu bentrok jadwal atau menurunkan keselamatan akademik.`;

  return {
    simulationId,
    originalHash: origHash,
    simulatedHash: simHash,
    conflictsBefore: origConflicts.length,
    conflictsAfter: simConflicts.length,
    workloadBeforeTotalMinutes: origWorkload.totalWeeklyMinutes,
    workloadAfterTotalMinutes: simWorkload.totalWeeklyMinutes,
    deadlineRiskBefore,
    deadlineRiskAfter,
    freeTimeBeforeHours,
    freeTimeAfterHours,
    isSafe,
    changes,
    summary,
  };
}
