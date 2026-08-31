import {
  EarlyWarning2Item,
  SessionOutcome,
  RecommendationOutcomeRecord,
} from "./types";
import { ScheduleItem, Task, ScheduleDay } from "@/types";
import { analyzeWorkload } from "../schedule-intelligence/workload-analyzer";
import { analyzeDeadlineCoverage } from "../schedule-intelligence/deadline-coverage";

/**
 * Pattern Early Warning System
 * Evaluates chronological patterns of behavior, workload accumulation, and deadline risks.
 * Tone: Calm, supportive, evidence-based, actionable, never judgmental or alarmist.
 */
export function generatePatternEarlyWarnings(
  schedules: ScheduleItem[] = [],
  tasks: Task[] = [],
  outcomes: SessionOutcome[] = [],
  recommendationHistory: RecommendationOutcomeRecord[] = []
): EarlyWarning2Item[] {
  const warnings: EarlyWarning2Item[] = [];
  const nowIso = new Date().toISOString();

  // 1. Repeated Skipping Pattern
  const recentOutcomes = outcomes.slice(-14); // Last 14 session outcomes
  const skippedCount = recentOutcomes.filter((o) => o.status === "SKIPPED").length;

  if (skippedCount >= 3) {
    const skippedSubjects = Array.from(
      new Set(
        recentOutcomes
          .filter((o) => o.status === "SKIPPED")
          .map((o) => o.sessionTitle)
      )
    );

    warnings.push({
      id: `warn_pattern_skip_${Date.now()}`,
      category: "REPEATED_SKIPPING",
      severity: skippedCount >= 5 ? "CRITICAL" : "WARNING",
      title: `${skippedCount} Sesi Belajar Terlewat dalam Periode Terakhir`,
      evidence: [
        `Tercatat ${skippedCount} sesi berstatus terlewat dari ${recentOutcomes.length} sesi yang dijadwalkan.`,
        `Agenda yang terlewat: ${skippedSubjects.slice(0, 3).join(", ")}.`,
      ],
      explanation:
        "Melewatkan sesi belajar secara berulang dapat menumpuk materi sebelum ujian atau deadline tugas.",
      suggestedAction:
        "Pertimbangkan untuk memperpendek durasi sesi atau menjadwalkan ulang ke hari dengan beban lebih lengang.",
      detectedAt: nowIso,
    });
  }

  // 2. Repeated Rescheduling Pattern
  const rescheduleCountsByTitle: Record<string, number> = {};
  outcomes.forEach((o) => {
    if (o.status === "RESCHEDULED") {
      rescheduleCountsByTitle[o.sessionTitle] =
        (rescheduleCountsByTitle[o.sessionTitle] || 0) + 1;
    }
  });

  for (const [title, count] of Object.entries(rescheduleCountsByTitle)) {
    if (count >= 3) {
      warnings.push({
        id: `warn_pattern_resched_${Date.now()}_${title}`,
        category: "REPEATED_RESCHEDULING",
        severity: "WARNING",
        title: `Sesi "${title}" Telah Dipindahkan ${count} Kali`,
        evidence: [
          `Agenda "${title}" dipindahkan sebanyak ${count} kali dari jadwal rencana awalnya.`,
        ],
        explanation:
          "Sesi yang sering digeser menandakan slot waktu yang dipilih kurang realistis untuk dieksekusi secara konsisten.",
        suggestedAction:
          "Pindahkan sesi ke slot waktu permanen yang lebih luang melalui menu preferensi.",
        detectedAt: nowIso,
      });
      break; // Limit to 1 warning for repeated reschedule
    }
  }

  // 3. Chronic Deadline Coverage Decline
  const urgentTasks = tasks.filter((t) => t.status !== "selesai" && t.deadline);
  const taskReports = urgentTasks.map((t) =>
    analyzeDeadlineCoverage(t, schedules)
  );
  const urgentWithoutCoverage = taskReports.filter(
    (r) =>
      r.status === "INSUFFICIENT_TIME" ||
      r.riskLevel === "KRITIS" ||
      r.riskLevel === "TINGGI"
  );

  if (urgentWithoutCoverage.length >= 2) {
    const totalGap = urgentWithoutCoverage.reduce(
      (acc, r) => acc + r.gapMinutes,
      0
    );
    warnings.push({
      id: `warn_pattern_deadline_${Date.now()}`,
      category: "DEADLINE_COVERAGE_DECLINE",
      severity: "CRITICAL",
      title: `${urgentWithoutCoverage.length} Tugas Mendesak Tanpa Alokasi Waktu yang Memadai`,
      evidence: [
        `Terdapat ${urgentWithoutCoverage.length} tugas berstatus mendesak yang membutuhkan waktu belajar tambahan total ${totalGap} menit.`,
        `Tugas terdampak: ${urgentWithoutCoverage.map((r) => r.taskTitle).slice(0, 3).join(", ")}.`,
      ],
      explanation:
        "Tenggat waktu semakin mendekat namun belum ada sesi belajar mandiri yang terjadwal sebelum batas akhir pengumpulan.",
      suggestedAction:
        "Gunakan fitur Susun Hari Saya untuk menempatkan sesi fokus belajar sebelum deadline.",
      detectedAt: nowIso,
    });
  }

  // 4. Workload Accumulation Across Consecutive Days
  const workload = analyzeWorkload(schedules);
  const denseDays: ScheduleDay[] = [];
  (Object.keys(workload.dailyBreakdown) as ScheduleDay[]).forEach((d) => {
    if (workload.dailyBreakdown[d].totalMinutes > 300) {
      denseDays.push(d);
    }
  });

  if (denseDays.length >= 3) {
    warnings.push({
      id: `warn_pattern_workload_${Date.now()}`,
      category: "WORKLOAD_ACCUMULATION",
      severity: "WARNING",
      title: `Akumulasi Beban Padat Terdeteksi (${denseDays.length} Hari > 300m)`,
      evidence: [
        `Hari dengan beban tinggi: ${denseDays.join(", ")}.`,
        `Rata-rata beban harian: ${workload.averageDailyMinutes} menit/hari.`,
      ],
      explanation:
        "Menjalani hari-hari padat berturut-turut meningkatkan risiko kejenuhan belajar dan penurunan konsentrasi.",
      suggestedAction:
        "Jalankan Optimasi Mingguan untuk membagi sesi belajar mandiri ke hari yang lebih lengang.",
      detectedAt: nowIso,
    });
  }

  // 5. Recommendation Rejection Pattern
  if (recommendationHistory.length >= 4) {
    const recentRecs = recommendationHistory.slice(-5);
    const rejectedCount = recentRecs.filter((r) => !r.wasAccepted).length;
    if (rejectedCount >= 3) {
      warnings.push({
        id: `warn_pattern_rejection_${Date.now()}`,
        category: "RECOMMENDATION_REJECTION_PATTERN",
        severity: "INFO",
        title: "Penyesuaian Karakter Usulan Diperlukan",
        evidence: [
          `${rejectedCount} dari ${recentRecs.length} usulan optimasi terakhir ditolak.`,
        ],
        explanation:
          "Sistem mendeteksi bahwa beberapa usulan waktu belajar kurang sesuai dengan preferensi riil Anda saat ini.",
        suggestedAction:
          "Perbarui jam belajar yang Anda sukai di pengaturan preferensi untuk mendapatkan usulan yang lebih akurat.",
        detectedAt: nowIso,
      });
    }
  }

  return warnings;
}
