import { RecommendationExplanation } from "./types";
import { ScheduleDay } from "@/types";

export interface ExplanationParams {
  activity: string;
  day: ScheduleDay;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  deadlineUrgencyLabel?: string;
  deadlineDaysRemaining?: number;
  factors: string[];
  checkedSchedulesCount: number;
  maxDailyMinutes: number;
  minBreakMinutes: number;
}

/**
 * Builds structured and explainable reasoning for schedule recommendations
 */
export function buildRecommendationExplanation(params: ExplanationParams): RecommendationExplanation {
  const {
    activity,
    day,
    startTime,
    endTime,
    durationMinutes,
    deadlineUrgencyLabel,
    deadlineDaysRemaining,
    factors,
    checkedSchedulesCount,
    maxDailyMinutes,
    minBreakMinutes,
  } = params;

  let summary = `Disarankan mempelajari ${activity} pada hari ${day} pukul ${startTime}–${endTime} (${durationMinutes} menit).`;

  if (deadlineUrgencyLabel) {
    summary += ` Prioritas didasarkan pada urgensi tenggat tugas (${deadlineUrgencyLabel}${
      typeof deadlineDaysRemaining === "number" ? `, sisa ${deadlineDaysRemaining} hari` : ""
    }) tanpa bentrok jadwal kuliah.`;
  } else {
    summary += ` Slot ini dipilih karena merupakan waktu luang optimal bebas bentrok.`;
  }

  const evidence = [
    `Memeriksa ${checkedSchedulesCount} jadwal dan tugas aktif pada database.`,
    `Slot waktu ${day} ${startTime}–${endTime} terverifikasi bebas dari agenda kuliah dan kegiatan lainnya.`,
  ];

  const constraintsApplied = [
    `Batas beban belajar harian maksimum ${Math.round(maxDailyMinutes / 60)} jam (${maxDailyMinutes} menit).`,
    `Jeda istirahat minimum ${minBreakMinutes} menit sebelum dan sesudah sesi.`,
    `Zero-hallucination: Menggunakan data mata kuliah dan tenggat tugas nyata.`,
  ];

  return {
    summary,
    factors: factors.length > 0 ? factors : ["Waktu luang optimal", "Bebas bentrok jadwal kuliah"],
    evidence,
    constraintsApplied,
  };
}
