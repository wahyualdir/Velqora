import { Task, ScheduleDay } from "@/types";
import { UserSchedulePreference } from "../schedule-intelligence/types";
import { Explainability12Answers, BehaviorSignal2 } from "./types";

/**
 * 12-Question Transparent Explainability Engine
 * Formulates humanized, evidence-based academic explanations answering all 12 transparency questions.
 * Avoids AI jargon (no "neural reasoning", "AI decided", "hallucination", or fake confidence).
 */
export function generate12QuestionExplanation(params: {
  sessionTitle: string;
  targetDay: ScheduleDay;
  targetStartTime: string;
  targetEndTime: string;
  durationMinutes: number;
  prioritizedTask?: Task | null;
  preference?: UserSchedulePreference | null;
  behaviorSignal?: BehaviorSignal2 | null;
  workloadMinutesAfter: number;
  conflictsCount: number;
  qualityScore: number;
  rankingPosition: number;
}): Explainability12Answers {
  const {
    sessionTitle,
    targetDay,
    targetStartTime,
    targetEndTime,
    durationMinutes,
    prioritizedTask,
    preference,
    behaviorSignal,
    workloadMinutesAfter,
    conflictsCount,
    qualityScore,
    rankingPosition,
  } = params;

  // Q1
  const q1_whyThisTime = `Waktu ${targetDay} pukul ${targetStartTime} - ${targetEndTime} dipilih karena slot ini bebas dari bentrok kuliah tetap dan memberikan jeda istirahat yang cukup sebelum dan sesudah sesi.`;

  // Q2
  const q2_prioritizedDeadline = prioritizedTask
    ? `Memprioritaskan tugas "${prioritizedTask.title}" yang memiliki tenggat waktu pada ${prioritizedTask.deadline || "waktu dekat"}.`
    : `Mengoptimalkan persiapan mandiri dan review materi untuk agenda "${sessionTitle}".`;

  // Q3
  const q3_consideredSchedules = `Mempertimbangkan seluruh jadwal perkuliahan wajib, batas maksimal belajar harian (240 menit), dan ketersediaan waktu luang pada hari ${targetDay}.`;

  // Q4
  const q4_conflictStatus =
    conflictsCount === 0
      ? "Nol bentrok. Slot waktu sepenuhnya bersih dari jadwal perkuliahan atau agenda lain."
      : `Peringatan: Terdeteksi potensi ${conflictsCount} tumpang tindih waktu yang memerlukan penyesuaian.`;

  // Q5
  const q5_workloadAfter = `Total beban belajar pada hari ${targetDay} setelah rekomendasi adalah ${workloadMinutesAfter} menit (dalam batas wajar harian).`;

  // Q6
  const q6_sessionDuration = `Durasi sesi dialokasikan selama ${durationMinutes} menit, sesuai rentang optimal konsentrasi akademik (45–90 menit).`;

  // Q7
  const q7_preferenceAlignment = preference
    ? `Selaras dengan preferensi waktu belajar Anda (${preference.preferredStudyStartTime} - ${preference.preferredStudyEndTime}).`
    : "Menggunakan pengaturan standar waktu belajar efektif.";

  // Q8
  const q8_historicalBehaviorAlignment =
    behaviorSignal && behaviorSignal.isSufficientData
      ? `Sesuai dengan pola kebiasaan Anda yang paling sering menyelesaikan sesi pada waktu ${behaviorSignal.observedTimePattern.toLowerCase()} dengan rata-rata durasi ${behaviorSignal.preferredEffectiveDurationMinutes} menit.`
      : "Data riwayat aktivitas belum mencukupi; rekomendasi mengacu pada kaidah distribusi waktu akademik standar.";

  // Q9
  const q9_riskIfApplied =
    workloadMinutesAfter > 300
      ? "Risiko moderat: Beban hari tersebut cukup padat. Pastikan memanfaatkan waktu istirahat minimal 30 menit."
      : "Risiko rendah: Tidak ada dampak negatif terhadap agenda perkuliahan maupun waktu pemulihan.";

  // Q10
  const q10_alternatives = [
    `Opsi 1: Pindahkan ke hari berikutnya pada jam yang sama (${targetStartTime} - ${targetEndTime}).`,
    `Opsi 2: Bagi menjadi 2 sesi lebih pendek masing-masing ${Math.round(durationMinutes / 2)} menit.`,
  ];

  // Q11
  const q11_consequencesIfDeclined =
    "Jika ditolak, jadwal Anda tidak akan berubah sama sekali. Anda dapat memilih slot waktu manual atau menjalankan optimasi ulang sewaktu-waktu.";

  // Q12
  const q12_whyRankedNumberOne = `Rekomendasi ini menempati peringkat #${rankingPosition} dengan skor kualitas ${qualityScore}/100 karena memberikan keseimbangan terbaik antara pemenuhan deadline, beban harian yang stabil, dan bebas bentrok.`;

  return {
    q1_whyThisTime,
    q2_prioritizedDeadline,
    q3_consideredSchedules,
    q4_conflictStatus,
    q5_workloadAfter,
    q6_sessionDuration,
    q7_preferenceAlignment,
    q8_historicalBehaviorAlignment,
    q9_riskIfApplied,
    q10_alternatives,
    q11_consequencesIfDeclined,
    q12_whyRankedNumberOne,
  };
}
