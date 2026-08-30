import { ScheduleItem, Task } from "@/types";
import { detectAllScheduleConflicts } from "../schedule-import/conflict-engine";
import { analyzeWorkload } from "../schedule-intelligence/workload-analyzer";
import { analyzeDeadlineCoverage } from "../schedule-intelligence/deadline-coverage";
import { analyzeScheduleRealism } from "../schedule-intelligence/schedule-realism";
import { UserSchedulePreference } from "../schedule-intelligence/types";
import { ACADEMIC_CONSTANTS } from "../schedule/academic-constants";
import {
  RegressionAnalysis,
  RegressionSeverity,
  TradeOffItem,
} from "./types";

/**
 * Analyzes whether a proposed schedule state introduces any academic regressions
 * compared to the original schedule state.
 */
export function detectScheduleRegression(
  originalSchedules: ScheduleItem[],
  proposedSchedules: ScheduleItem[],
  tasks: Task[] = [],
  _preferences?: UserSchedulePreference
): RegressionAnalysis {
  const reasons: string[] = [];
  const tradeOffs: TradeOffItem[] = [];

  // 1. Conflict Invariant Check
  const origConflicts = detectAllScheduleConflicts(
    originalSchedules as any
  ).filter((s) => s.hasConflict);
  const propConflicts = detectAllScheduleConflicts(
    proposedSchedules as any
  ).filter((s) => s.hasConflict);

  if (propConflicts.length > origConflicts.length) {
    reasons.push(
      `Usulan menciptakan ${propConflicts.length - origConflicts.length} bentrok jadwal baru.`
    );
    return {
      severity: "CRITICAL_REGRESSION",
      scoreDelta: -50,
      isAcceptable: false,
      reasons,
      tradeOffs: [
        {
          factor: "Bentrok Jadwal",
          before: `${origConflicts.length} bentrok`,
          after: `${propConflicts.length} bentrok`,
          impact: "NEGATIVE",
        },
      ],
    };
  }

  // 2. Deadline Coverage Check
  const origCoverageReports = tasks.map((t) => analyzeDeadlineCoverage(t, originalSchedules));
  const propCoverageReports = tasks.map((t) => analyzeDeadlineCoverage(t, proposedSchedules));
  const origUrgentWithoutCoverage = origCoverageReports.filter(
    (r) => r.status === "INSUFFICIENT_TIME" || r.riskLevel === "KRITIS" || r.riskLevel === "TINGGI"
  ).length;
  const propUrgentWithoutCoverage = propCoverageReports.filter(
    (r) => r.status === "INSUFFICIENT_TIME" || r.riskLevel === "KRITIS" || r.riskLevel === "TINGGI"
  ).length;
  const origTotalGap = origCoverageReports.reduce((acc, r) => acc + r.gapMinutes, 0);
  const propTotalGap = propCoverageReports.reduce((acc, r) => acc + r.gapMinutes, 0);

  if (
    propTotalGap > origTotalGap &&
    propUrgentWithoutCoverage > origUrgentWithoutCoverage
  ) {
    reasons.push(
      `Usulan mengurangi coverage waktu belajar sebelum tenggat tugas mendesak.`
    );
    return {
      severity: "CRITICAL_REGRESSION",
      scoreDelta: -30,
      isAcceptable: false,
      reasons,
      tradeOffs: [
        {
          factor: "Kesiapan Deadline",
          before: `${origUrgentWithoutCoverage} tugas tanpa coverage`,
          after: `${propUrgentWithoutCoverage} tugas tanpa coverage`,
          impact: "NEGATIVE",
        },
      ],
    };
  }

  // 3. Workload and Overload Check
  const origWorkload = analyzeWorkload(originalSchedules);
  const propWorkload = analyzeWorkload(proposedSchedules);

  const origRealism = analyzeScheduleRealism(originalSchedules);
  const propRealism = analyzeScheduleRealism(proposedSchedules);

  // Check if daily hard cap (>360m) is violated
  const origDailyMinutes = Object.values(origWorkload.dailyBreakdown).map(
    (d) => d.totalMinutes
  );
  const propDailyMinutes = Object.values(propWorkload.dailyBreakdown).map(
    (d) => d.totalMinutes
  );
  const propMaxDay = Math.max(...propDailyMinutes, 0);
  const origMaxDay = Math.max(...origDailyMinutes, 0);

  if (
    propMaxDay > ACADEMIC_CONSTANTS.DAILY_WORKLOAD_HARD_CAP_MINUTES &&
    propMaxDay > origMaxDay
  ) {
    reasons.push(
      `Usulan membebani satu hari melebihi batas keras ${ACADEMIC_CONSTANTS.DAILY_WORKLOAD_HARD_CAP_MINUTES} menit (${propMaxDay} menit).`
    );
    return {
      severity: "CRITICAL_REGRESSION",
      scoreDelta: -25,
      isAcceptable: false,
      reasons,
      tradeOffs: [
        {
          factor: "Beban Harian Maksimum",
          before: `${origMaxDay} menit`,
          after: `${propMaxDay} menit`,
          impact: "NEGATIVE",
        },
      ],
    };
  }

  // Check trade-offs
  if (propWorkload.overloadedDaysCount < origWorkload.overloadedDaysCount) {
    tradeOffs.push({
      factor: "Hari Overload",
      before: `${origWorkload.overloadedDaysCount} hari`,
      after: `${propWorkload.overloadedDaysCount} hari`,
      impact: "POSITIVE",
    });
  } else if (
    propWorkload.overloadedDaysCount > origWorkload.overloadedDaysCount
  ) {
    tradeOffs.push({
      factor: "Hari Overload",
      before: `${origWorkload.overloadedDaysCount} hari`,
      after: `${propWorkload.overloadedDaysCount} hari`,
      impact: "NEGATIVE",
    });
    reasons.push("Jumlah hari dengan beban berlebih bertambah.");
  }

  if (propRealism.overallRealismScore > origRealism.overallRealismScore) {
    tradeOffs.push({
      factor: "Skor Realisme Jadwal",
      before: `${origRealism.overallRealismScore}/100`,
      after: `${propRealism.overallRealismScore}/100`,
      impact: "POSITIVE",
    });
  } else if (propRealism.overallRealismScore < origRealism.overallRealismScore) {
    tradeOffs.push({
      factor: "Skor Realisme Jadwal",
      before: `${origRealism.overallRealismScore}/100`,
      after: `${propRealism.overallRealismScore}/100`,
      impact: "NEGATIVE",
    });
    reasons.push("Realisme jadwal mengalami penurunan.");
  }

  const scoreDelta =
    propRealism.overallRealismScore -
    origRealism.overallRealismScore +
    (origWorkload.overloadedDaysCount - propWorkload.overloadedDaysCount) * 10;

  let severity: RegressionSeverity = "IMPROVEMENT";
  if (reasons.length > 0 && scoreDelta < 0) {
    severity = "REGRESSION";
  } else if (Math.abs(scoreDelta) <= 2 && reasons.length === 0) {
    severity = "NEUTRAL";
  }

  return {
    severity,
    scoreDelta,
    isAcceptable: severity === "IMPROVEMENT" || severity === "NEUTRAL",
    reasons,
    tradeOffs,
  };
}
