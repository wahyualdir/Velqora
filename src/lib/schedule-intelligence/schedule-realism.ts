import { ScheduleItem, ScheduleDay } from "@/types";
import {
  ScheduleRealismReport,
  ScheduleRealismIssue,
} from "./types";
import { timeToMinutes } from "../schedule-import/normalizer";

const ALL_DAYS: ScheduleDay[] = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

/**
 * Assesses realistic pacing and fatigue risks on the user's weekly academic schedule
 */
export function analyzeScheduleRealism(
  schedules: ScheduleItem[] = [],
  targetStudyMinutesPerDay: number = 180
): ScheduleRealismReport {
  const issues: ScheduleRealismIssue[] = [];

  // Group schedules by day
  const dayMap: Record<ScheduleDay, ScheduleItem[]> = {
    Senin: [],
    Selasa: [],
    Rabu: [],
    Kamis: [],
    Jumat: [],
    Sabtu: [],
    Minggu: [],
  };

  for (const s of schedules) {
    if (s.day && dayMap[s.day as ScheduleDay]) {
      dayMap[s.day as ScheduleDay].push(s);
    }
  }

  for (const day of ALL_DAYS) {
    const items = dayMap[day];
    if (items.length === 0) continue;

    // Sort items by start time
    const sorted = [...items].sort((a, b) => {
      const aStart = a.start_time || (a.time ? a.time.split("-")[0]?.trim() : "") || "00:00";
      const bStart = b.start_time || (b.time ? b.time.split("-")[0]?.trim() : "") || "00:00";
      return (timeToMinutes(aStart) || 0) - (timeToMinutes(bStart) || 0);
    });

    let totalDayMinutes = 0;
    let lectureMinutes = 0;
    let studyMinutes = 0;
    let consecutiveCount = 1;
    let maxConsecutive = 1;
    const consecutiveSessionsList: string[] = [sorted[0].title];

    for (let i = 0; i < sorted.length; i++) {
      const cur = sorted[i];
      const cStart = cur.start_time || (cur.time ? cur.time.split("-")[0]?.trim() : "");
      const cEnd = cur.end_time || (cur.time ? cur.time.split("-")[1]?.trim() : "");
      const cDur = Math.max(0, (timeToMinutes(cEnd) || 0) - (timeToMinutes(cStart) || 0));

      totalDayMinutes += cDur;

      const typeStr = ((cur.type as string) || "").toLowerCase();
      const isStudy =
        typeStr === "tugas" ||
        typeStr === "belajar" ||
        typeStr === "reminder" ||
        (cur.title && cur.title.toLowerCase().includes("belajar"));

      if (isStudy) studyMinutes += cDur;
      else lectureMinutes += cDur;

      if (i > 0) {
        const prev = sorted[i - 1];
        const prevEnd = prev.end_time || (prev.time ? prev.time.split("-")[1]?.trim() : "");
        const gap = (timeToMinutes(cStart) || 0) - (timeToMinutes(prevEnd) || 0);

        if (gap < 20) {
          consecutiveCount++;
          consecutiveSessionsList.push(cur.title);
          if (consecutiveCount > maxConsecutive) maxConsecutive = consecutiveCount;
        } else {
          consecutiveCount = 1;
        }
      }
    }

    // 1. Check HIGH_DAILY_DENSITY (> 420 minutes / 7 hours)
    if (totalDayMinutes >= 420) {
      issues.push({
        type: "HIGH_DAILY_DENSITY",
        day,
        severity: totalDayMinutes >= 540 ? "CRITICAL" : "WARNING",
        title: `Kepadatan Tinggi pada Hari ${day}`,
        description: `Hari ${day} memiliki total durasi kegiatan ${Math.round(totalDayMinutes / 60)} jam (${totalDayMinutes} menit).`,
        affectedSessions: items.map((i) => i.title),
        recommendation: `Pertimbangkan memindahkan sebagian sesi belajar mandiri ke hari lain yang lebih lengang.`,
      });
    }

    // 2. Check EXCESSIVE_CONSECUTIVE_SESSIONS (3+ sessions in a row without break)
    if (maxConsecutive >= 3) {
      issues.push({
        type: "EXCESSIVE_CONSECUTIVE_SESSIONS",
        day,
        severity: "WARNING",
        title: `Sesi Beruntun Tanpa Jeda pada Hari ${day}`,
        description: `Terdapat ${maxConsecutive} sesi berturut-turut dengan jeda istirahat kurang dari 20 menit.`,
        affectedSessions: consecutiveSessionsList.slice(0, 4),
        recommendation: `Sisipkan waktu istirahat minimal 30 menit antar sesi untuk menjaga fokus belajar optimal.`,
      });
    }

    // 3. Check INSUFFICIENT_RECOVERY (Heavy lecture >= 300m followed immediately by study)
    if (lectureMinutes >= 300 && studyMinutes >= 90) {
      issues.push({
        type: "INSUFFICIENT_RECOVERY",
        day,
        severity: "INFO",
        title: `Waktu Pemulihan Terbatas pada Hari ${day}`,
        description: `Setelah ${Math.round(lectureMinutes / 60)} jam perkuliahan, hari ini masih dijadwalkan ${studyMinutes} menit belajar mandiri.`,
        affectedSessions: items.filter((i) => (i.type as string) === "belajar" || (i.title && i.title.includes("belajar"))).map((i) => i.title),
        recommendation: `Gunakan sesi belajar mikro (30–45 menit) atau jadwalkan istirahat cukup sebelum belajar malam.`,
      });
    }
  }

  // Calculate Realism Score
  let score = 100;
  for (const issue of issues) {
    if (issue.severity === "CRITICAL") score -= 25;
    else if (issue.severity === "WARNING") score -= 15;
    else if (issue.severity === "INFO") score -= 5;
  }
  score = Math.max(0, Math.min(100, score));

  let status: "REALISTIS" | "CUKUP_PADAT" | "KURANG_REALISTIS" = "REALISTIS";
  if (score < 60) status = "KURANG_REALISTIS";
  else if (score < 90 || issues.length > 0) status = "CUKUP_PADAT";

  const summary = issues.length === 0
    ? "Jadwal mingguan Anda terstruktur secara realistis dengan ritme belajar yang seimbang."
    : `Terdeteksi ${issues.length} potensi titik kelelahan jadwal pada pekan ini. Sistem menyarankan penyesuaian jeda istirahat dan distribusi waktu.`;

  return {
    overallRealismScore: score,
    status,
    issues,
    summary,
  };
}
