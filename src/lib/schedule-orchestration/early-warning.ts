import { ScheduleItem, Task, ScheduleDay } from "@/types";
import { analyzeWorkload } from "../schedule-intelligence/workload-analyzer";
import { analyzeTaskDeadlines } from "../schedule-intelligence/deadline-analyzer";
import { analyzeDeadlineCoverage } from "../schedule-intelligence/deadline-coverage";
import { analyzeScheduleRealism } from "../schedule-intelligence/schedule-realism";
import { isStudySession } from "./schedule-snapshot";
import { EarlyWarningItem, SnapshotDiff, WarningSeverity } from "./types";

/**
 * Early Warning System for Academic Schedules
 * Generates evidence-backed alerts to prevent academic overload and missed deadlines.
 */
export function generateEarlyWarnings(
  schedules: ScheduleItem[],
  tasks: Task[] = [],
  lastDiff?: SnapshotDiff
): EarlyWarningItem[] {
  const warnings: EarlyWarningItem[] = [];

  // 1. Deadline Approaching Warnings
  const deadlines = analyzeTaskDeadlines(tasks);
  const criticalDeadlines = deadlines.filter((d) => d.urgency === "CRITICAL");

  if (criticalDeadlines.length > 0) {
    warnings.push({
      warningId: `warn_deadline_${Date.now()}`,
      type: "DEADLINE_APPROACHING",
      severity: "CRITICAL",
      title: `${criticalDeadlines.length} Tugas Mendekati Tenggat (<24 Jam)`,
      evidence: criticalDeadlines.map(
        (d) => `"${d.title}" batas waktu dalam ${d.hoursRemaining} jam.`
      ),
      explanation:
        "Terdapat tugas dengan tenggat waktu sangat dekat yang memerlukan penyelesaian segera agar tidak terlambat.",
      suggestedAction:
        "Prioritaskan tugas ini hari ini atau luangkan sesi fokus terdekat.",
    });
  }

  // 2. Workload Accumulation Warnings
  const workload = analyzeWorkload(schedules);
  const overloadedDays = (
    Object.keys(workload.dailyBreakdown) as ScheduleDay[]
  ).filter((day) => workload.dailyBreakdown[day].isOverloaded);

  if (overloadedDays.length > 0) {
    warnings.push({
      warningId: `warn_workload_${Date.now()}`,
      type: "WORKLOAD_ACCUMULATION",
      severity: "WARNING",
      title: `Beban Belajar Tinggi pada ${overloadedDays.length} Hari`,
      evidence: overloadedDays.map(
        (day) =>
          `Hari ${day}: total ${workload.dailyBreakdown[day].totalMinutes} menit kegiatan.`
      ),
      explanation:
        "Akumulasi beban kegiatan melebihi ambang batas wajar harian (360 menit) yang dapat memicu kelelahan belajar.",
      suggestedAction:
        "Gunakan fitur Optimasi Mingguan untuk mendistribusikan sesi belajar ke hari lain yang lebih lengang.",
    });
  }

  // 3. Consecutive Overload and Fatigue Warnings
  const realism = analyzeScheduleRealism(schedules);
  const consecutiveIssues = realism.issues.filter(
    (i) => i.type === "EXCESSIVE_CONSECUTIVE_SESSIONS"
  );

  if (consecutiveIssues.length > 0) {
    warnings.push({
      warningId: `warn_consecutive_${Date.now()}`,
      type: "CONSECUTIVE_OVERLOAD",
      severity: "WARNING",
      title: "Sesi Akademik Beruntun Tanpa Jeda",
      evidence: consecutiveIssues.map((i) => `${i.day}: ${i.description}`),
      explanation:
        "Terdapat 3 atau lebih sesi berurutan tanpa jeda istirahat minimal 30 menit.",
      suggestedAction:
        "Sisipkan jeda istirahat minimal 30 menit di antara sesi perkuliahan dan belajar mandiri.",
    });
  }

  // 4. Declining Coverage Warnings
  const taskReports = tasks.map((t) => analyzeDeadlineCoverage(t, schedules));
  const urgentWithoutCoverage = taskReports.filter(
    (r) => r.status === "INSUFFICIENT_TIME" || r.riskLevel === "KRITIS" || r.riskLevel === "TINGGI"
  );
  const totalGapMinutes = urgentWithoutCoverage.reduce((acc, r) => acc + r.gapMinutes, 0);

  if (urgentWithoutCoverage.length > 0) {
    warnings.push({
      warningId: `warn_coverage_${Date.now()}`,
      type: "DECLINING_COVERAGE",
      severity: "CRITICAL",
      title: `${urgentWithoutCoverage.length} Tugas Mendesak Belum Terjadwal`,
      evidence: [
        `Total kekurangan waktu belajar terestimasi: ${totalGapMinutes} menit.`,
      ],
      explanation:
        "Tugas dengan tingkat urgensi tinggi belum memiliki alokasi waktu belajar mandiri sebelum tenggat waktu tiba.",
      suggestedAction:
        "Jadwalkan sesi belajar fokus sebelum tenggat melalui asisten penjadwalan.",
    });
  }

  // 5. Stale Recommendations Warning
  if (lastDiff && lastDiff.isStale && lastDiff.category !== "NO_CHANGE") {
    warnings.push({
      warningId: `warn_stale_${Date.now()}`,
      type: "STALE_RECOMMENDATIONS",
      severity: "INFO",
      title: "Jadwal Mengalami Pembaruan Terbaru",
      evidence: lastDiff.changes,
      explanation:
        "Kondisi kalender telah diperbarui. Usulan rekomendasi sebelumnya telah disinkronkan ulang.",
      suggestedAction:
        "Tinjau kondisi jadwal terbaru pada Control Center.",
    });
  }

  return warnings;
}
