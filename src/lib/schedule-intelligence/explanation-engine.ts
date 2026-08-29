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
  workloadStatus?: string;
  alternativesCount?: number;
}

export interface DetailedExplanationAnswers {
  whyChosen: string;
  whatPrioritized: string;
  schedulesConsidered: string;
  conflictStatusText: string;
  deadlineImpactText: string;
  workloadSafetyText: string;
  alternativesAvailableText: string;
}

/**
 * Builds structured, explainable 2.0 reasoning for schedule recommendations
 */
export function buildRecommendationExplanation(params: ExplanationParams): RecommendationExplanation & { answers?: DetailedExplanationAnswers } {
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
    workloadStatus = "Optimal",
    alternativesCount = 0,
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

  const answers: DetailedExplanationAnswers = {
    whyChosen: `Slot ${day} ${startTime}–${endTime} dipilih karena tersedia penuh selama ${durationMinutes} menit tanpa bertabrakan dengan jadwal perkuliahan.`,
    whatPrioritized: deadlineUrgencyLabel ? `Mata kuliah/tugas '${activity}' dengan urgensi ${deadlineUrgencyLabel}.` : `Sesi fokus terencana '${activity}'.`,
    schedulesConsidered: `Mempertimbangkan ${checkedSchedulesCount} agenda akademik aktif di database.`,
    conflictStatusText: `Bebas konflik terverifikasi, menjaga jeda istirahat minimal ${minBreakMinutes} menit.`,
    deadlineImpactText: deadlineUrgencyLabel ? `Mempersiapkan tugas sebelum batas akhir pengumpulan (${deadlineUrgencyLabel}).` : `Tidak ada deadline mendesak yang terancam.`,
    workloadSafetyText: `Beban belajar harian tetap aman dalam batas maksimal ${maxDailyMinutes} menit (status: ${workloadStatus}).`,
    alternativesAvailableText: alternativesCount > 0 ? `Tersedia ${alternativesCount} alternatif slot waktu luang lainnya.` : `Ini merupakan slot waktu luang terbaik yang tersedia.`,
  };

  return {
    summary,
    factors: factors.length > 0 ? factors : ["Waktu luang optimal", "Bebas bentrok jadwal kuliah"],
    evidence,
    constraintsApplied,
    answers,
  };
}
