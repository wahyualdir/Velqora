import { ScheduleItem, Task } from "@/types";
import { detectAllScheduleConflicts } from "../schedule-import/conflict-engine";
import { analyzeWorkload } from "../schedule-intelligence/workload-analyzer";
import { analyzeDeadlineCoverage } from "../schedule-intelligence/deadline-coverage";
import { analyzeScheduleRealism } from "../schedule-intelligence/schedule-realism";
import { isStudySession } from "./schedule-snapshot";
import {
  AcademicHealthScore,
  HealthCategory,
  HealthFactor,
} from "./types";

/**
 * Calculates a deterministic Academic Health Score (0-100) based on quantifiable academic factors.
 * Completely deterministic without random numbers or AI hallucinations.
 */
export function calculateAcademicHealthScore(
  schedules: ScheduleItem[],
  tasks: Task[] = []
): AcademicHealthScore {
  const factors: HealthFactor[] = [];

  // Factor 1: Conflict Freedom (Max: 25)
  const conflicts = detectAllScheduleConflicts(schedules as any).filter(
    (s) => s.hasConflict
  );
  let conflictScore = 25;
  if (conflicts.length === 1) conflictScore = 10;
  else if (conflicts.length > 1) conflictScore = 0;

  factors.push({
    name: "Bebas Bentrok Jadwal",
    score: conflictScore,
    maxScore: 25,
    status: conflictScore === 25 ? "BAIK" : conflictScore === 10 ? "CUKUP" : "PERLU_PERHATIAN",
    note:
      conflicts.length === 0
        ? "Tidak ada bentrok jadwal terdeteksi."
        : `Ditemukan ${conflicts.length} bentrok waktu perkuliahan.`,
  });

  // Factor 2: Workload Distribution (Max: 20)
  const workload = analyzeWorkload(schedules);
  let workloadScore = 20;
  if (workload.overloadedDaysCount === 1) workloadScore = 10;
  else if (workload.overloadedDaysCount > 1) workloadScore = 0;

  factors.push({
    name: "Keseimbangan Beban Harian",
    score: workloadScore,
    maxScore: 20,
    status: workloadScore === 20 ? "BAIK" : workloadScore === 10 ? "CUKUP" : "PERLU_PERHATIAN",
    note:
      workload.overloadedDaysCount === 0
        ? "Seluruh hari berada dalam batas beban yang wajar."
        : `Terdapat ${workload.overloadedDaysCount} hari dengan beban berlebih (>360m).`,
  });

  // Factor 3: Deadline Coverage (Max: 20)
  const taskReports = tasks.map((t) => analyzeDeadlineCoverage(t, schedules));
  const urgentTasksWithoutCoverage = taskReports.filter(
    (r) => r.status === "INSUFFICIENT_TIME" || r.riskLevel === "KRITIS" || r.riskLevel === "TINGGI"
  ).length;
  let deadlineScore = 20;
  if (urgentTasksWithoutCoverage === 1) deadlineScore = 10;
  else if (urgentTasksWithoutCoverage > 1) deadlineScore = 0;

  factors.push({
    name: "Cakupan Waktu Sebelum Deadline",
    score: deadlineScore,
    maxScore: 20,
    status: deadlineScore === 20 ? "BAIK" : deadlineScore === 10 ? "CUKUP" : "PERLU_PERHATIAN",
    note:
      urgentTasksWithoutCoverage === 0
        ? "Tugas mendesak memiliki alokasi waktu belajar yang memadai."
        : `Terdapat ${urgentTasksWithoutCoverage} tugas mendesak belum memiliki sesi belajar.`,
  });

  // Factor 4: Schedule Realism & Rest (Max: 20)
  const realism = analyzeScheduleRealism(schedules);
  const realismScore = Math.round((realism.overallRealismScore / 100) * 20);

  factors.push({
    name: "Realisme & Waktu Istirahat",
    score: realismScore,
    maxScore: 20,
    status: realismScore >= 16 ? "BAIK" : realismScore >= 10 ? "CUKUP" : "PERLU_PERHATIAN",
    note: realism.summary,
  });

  // Factor 5: Sesi Belajar & Eksekusi (Max: 15)
  const studySessions = schedules.filter((s) => isStudySession(s));
  const uncompleted = studySessions.filter((s) => !s.is_completed);
  let sessionScore = 15;
  if (uncompleted.length >= 1 && uncompleted.length <= 2) sessionScore = 10;
  else if (uncompleted.length > 2) sessionScore = 5;

  factors.push({
    name: "Status Eksekusi Belajar",
    score: sessionScore,
    maxScore: 15,
    status: sessionScore === 15 ? "BAIK" : sessionScore === 10 ? "CUKUP" : "PERLU_PERHATIAN",
    note:
      uncompleted.length === 0
        ? "Seluruh rencana sesi belajar berjalan lancar."
        : `Terdapat ${uncompleted.length} sesi belajar aktif yang perlu diselesaikan.`,
  });

  // Calculate Overall
  const overallScore = Math.min(
    100,
    Math.max(
      0,
      conflictScore + workloadScore + deadlineScore + realismScore + sessionScore
    )
  );

  let category: HealthCategory = "HEALTHY";
  if (overallScore >= 85) category = "HEALTHY";
  else if (overallScore >= 70) category = "STABLE";
  else if (overallScore >= 50) category = "ATTENTION";
  else if (overallScore >= 30) category = "HIGH_RISK";
  else category = "CRITICAL";

  const summary =
    category === "HEALTHY"
      ? "Kesehatan jadwal akademik sangat prima. Seluruh agenda terdistribusi dengan baik dan aman dari bentrok."
      : category === "STABLE"
      ? "Jadwal akademik dalam kondisi stabil dengan sedikit penyesuaian beban harian yang direkomendasikan."
      : category === "ATTENTION"
      ? "Beberapa hari memiliki beban tinggi atau tugas mendekati tenggat yang membutuhkan perhatian."
      : "Kondisi jadwal berisiko tinggi terhadap kelelahan atau bentrok akademik yang mendesak untuk diselesaikan.";

  return {
    overallScore,
    category,
    factors,
    summary,
  };
}
