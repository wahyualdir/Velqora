import { ScheduleItem, Task, ScheduleDay } from "@/types";
import { optimizeWeeklySchedule } from "../schedule-intelligence/weekly-optimizer";
import { analyzeWorkload } from "../schedule-intelligence/workload-analyzer";
import { analyzeDeadlineCoverage } from "../schedule-intelligence/deadline-coverage";
import { analyzeScheduleRealism } from "../schedule-intelligence/schedule-realism";
import { detectScheduleRegression } from "./regression-detector";
import {
  OptimizationProposal,
  ScheduleSnapshot,
  AffectedSessionItem,
  ApprovalLevel,
  ProposalStatus,
} from "./types";
import {
  SessionOutcome,
  RecommendationOutcomeRecord,
} from "../schedule-outcomes/types";
import { calculateCalibrationMultipliers } from "../schedule-outcomes/recommendation-calibration";
import { extractBehaviorSignals2 } from "../schedule-intelligence/behavior-signals";

/**
 * Continuous Schedule Optimizer 3.0 (FASE 34)
 * Generates actionable, outcome-informed, regression-aware optimization proposals without mutating the database.
 * Incorporates historical outcome learning, calibration multipliers, and behavior signals as secondary ranking inputs.
 */
export function generateContinuousOptimizationProposal(
  userId: string,
  currentSnapshot: ScheduleSnapshot,
  tasks: Task[] = [],
  outcomes: SessionOutcome[] = [],
  recommendationHistory: RecommendationOutcomeRecord[] = []
): OptimizationProposal {
  const currentSchedules = [
    ...currentSnapshot.courses,
    ...currentSnapshot.studySessions,
  ];

  // 1. Initial State Metrics
  const currentWorkload = analyzeWorkload(currentSchedules);
  const currentRealism = analyzeScheduleRealism(currentSchedules);
  const currentCoverageReports = tasks.map((t) => analyzeDeadlineCoverage(t, currentSchedules));
  const currentCoveredRate =
    currentCoverageReports.length > 0
      ? (currentCoverageReports.filter(
          (r) => r.status !== "INSUFFICIENT_TIME" && r.status !== "OVERDUE"
        ).length /
          currentCoverageReports.length) *
        100
      : 100;

  const currentStateScore = Math.round(
    currentRealism.overallRealismScore * 0.6 +
      Math.max(0, 100 - currentWorkload.overloadedDaysCount * 20) * 0.4
  );

  // 2. Behavior Signals & Calibration Multipliers (FASE 34 Learning Signals)
  const behaviorSignals = extractBehaviorSignals2(userId, currentSchedules, outcomes);
  const calibrationMultipliers = calculateCalibrationMultipliers(recommendationHistory);

  // 3. Generate Base Optimization Candidates
  const baseOptimization = optimizeWeeklySchedule(currentSchedules, {
    preference: currentSnapshot.userPreferences,
    tasks,
  });

  const affectedSessions: AffectedSessionItem[] = [];
  const proposedSchedules: ScheduleItem[] = currentSchedules.map((s) => {
    const match = baseOptimization.proposals.find(
      (p) => p.sessionId === s.id
    );
    if (match) {
      affectedSessions.push({
        id: s.id,
        title: s.title || "Sesi Belajar",
        fromDay: match.fromDay,
        fromTime: match.fromTime,
        toDay: match.toDay,
        toTime: match.toTime,
        durationMinutes: match.durationMinutes,
      });
      return {
        ...s,
        day: match.toDay,
        start_time: match.toTime.split(" - ")[0],
        end_time: match.toTime.split(" - ")[1],
        time: match.toTime,
      };
    }
    return { ...s };
  });

  // 4. Regression Detection
  const regression = detectScheduleRegression(
    currentSchedules,
    proposedSchedules,
    tasks,
    currentSnapshot.userPreferences
  );

  const proposedWorkload = analyzeWorkload(proposedSchedules);
  const proposedRealism = analyzeScheduleRealism(proposedSchedules);
  const proposedCoverageReports = tasks.map((t) => analyzeDeadlineCoverage(t, proposedSchedules));
  const proposedCoveredRate =
    proposedCoverageReports.length > 0
      ? (proposedCoverageReports.filter(
          (r) => r.status !== "INSUFFICIENT_TIME" && r.status !== "OVERDUE"
        ).length /
          proposedCoverageReports.length) *
        100
      : 100;

  const baseProposedStateScore = Math.round(
    proposedRealism.overallRealismScore * 0.6 +
      Math.max(0, 100 - proposedWorkload.overloadedDaysCount * 20) * 0.4
  );

  // Apply calibration multiplier if applicable
  const calMultiplier =
    calibrationMultipliers["GENERAL_OPTIMIZATION"]?.rankingMultiplier || 1.0;
  const proposedStateScore = Math.min(
    100,
    Math.max(0, Math.round(baseProposedStateScore * calMultiplier))
  );

  const rawImprovement = Math.max(0, proposedStateScore - currentStateScore);
  const improvementScore = regression.isAcceptable ? rawImprovement : 0;

  const workloadBefore: Record<ScheduleDay, number> = {} as any;
  const workloadAfter: Record<ScheduleDay, number> = {} as any;

  (Object.keys(currentWorkload.dailyBreakdown) as ScheduleDay[]).forEach((day) => {
    workloadBefore[day] = currentWorkload.dailyBreakdown[day].totalMinutes;
    workloadAfter[day] = proposedWorkload.dailyBreakdown[day].totalMinutes;
  });

  // 5. Approval Level Determination
  let approvalLevel: ApprovalLevel = "USER_CONFIRMATION";
  let status: ProposalStatus = "READY_FOR_REVIEW";

  if (!regression.isAcceptable || regression.severity === "CRITICAL_REGRESSION") {
    approvalLevel = "BLOCKED";
    status = "REJECTED";
  } else if (affectedSessions.length === 0) {
    approvalLevel = "SAFE_AUTOMATIC";
    status = "DRAFT";
  }

  // 6. Natural Explanation Rationale (with Behavior Signal Context)
  let explanation =
    affectedSessions.length === 0
      ? "Distribusi jadwal mingguan saat ini sudah berada dalam kondisi seimbang dan aman."
      : `Sistem mengusulkan pemindahan ${affectedSessions.length} sesi belajar dari hari padat ke hari yang lebih lengang untuk mengurangi risiko kelelahan tanpa mengurangi total waktu belajar.`;

  if (behaviorSignals.isSufficientData) {
    explanation += ` Rekomendasi disesuaikan dengan pola waktu belajar Anda (${behaviorSignals.observedTimePattern.toLowerCase()}) dan hari paling konsisten (${behaviorSignals.mostConsistentDays.slice(0, 2).join(", ")}).`;
  }

  if (regression.tradeOffs.length > 0) {
    const tradeOffTexts = regression.tradeOffs
      .map((t) => `${t.factor}: ${t.before} -> ${t.after}`)
      .join("; ");
    explanation += ` Dampak faktor: ${tradeOffTexts}.`;
  }

  return {
    proposalId: `prop_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    parentSnapshotHash: currentSnapshot.snapshotHash,
    currentStateScore,
    proposedStateScore,
    improvementScore,
    affectedSessions,
    affectedAssignments: tasks.map((t) => t.title || "Tugas"),
    conflictsIntroduced: 0,
    conflictsResolved: Math.max(
      0,
      currentSnapshot.conflictsCount -
        proposedWorkload.overloadedDaysCount
    ),
    workloadBefore,
    workloadAfter,
    deadlineCoverageBefore: Math.round(currentCoveredRate),
    deadlineCoverageAfter: Math.round(proposedCoveredRate),
    explanation,
    risks: regression.reasons,
    alternatives: [
      "Pertahankan jadwal saat ini tanpa melakukan pemindahan sesi.",
      "Terapkan pemindahan sebagian sesi secara bertahap melalui dialog optimasi mingguan.",
    ],
    approvalLevel,
    status,
    createdAt: new Date().toISOString(),
    rollbackAvailable: true,
    previousSchedulesBackup: currentSchedules,
  };
}
