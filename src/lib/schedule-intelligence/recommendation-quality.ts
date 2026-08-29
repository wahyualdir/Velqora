import { DeadlineUrgency, WorkloadLevel, RecommendationQualityBreakdown } from "./types";

export interface QualityEvaluationParams {
  deadlineUrgency?: DeadlineUrgency;
  slotDurationMinutes: number;
  targetDurationMinutes: number;
  hasConflict: boolean;
  dayWorkloadLevel?: WorkloadLevel;
  hasSufficientBreak: boolean;
  isPreferredTimeMatch: boolean;
}

/**
 * Calculates a multi-factor deterministic recommendation quality score (0 - 100)
 */
export function calculateRecommendationQuality(
  params: QualityEvaluationParams
): RecommendationQualityBreakdown {
  const {
    deadlineUrgency,
    slotDurationMinutes,
    targetDurationMinutes,
    hasConflict,
    dayWorkloadLevel,
    hasSufficientBreak,
    isPreferredTimeMatch,
  } = params;

  const explanations: string[] = [];

  // 1. Deadline Urgency Score (max 30)
  let deadlineScore = 10;
  if (deadlineUrgency === "CRITICAL") {
    deadlineScore = 30;
    explanations.push("Prioritas utama untuk deadline sangat kritis (<24 jam) (+30)");
  } else if (deadlineUrgency === "URGENT") {
    deadlineScore = 22;
    explanations.push("Prioritas mendesak untuk tugas 1-3 hari (+22)");
  } else if (deadlineUrgency === "UPCOMING") {
    deadlineScore = 14;
    explanations.push("Tenggat tugas dalam 7 hari mendatang (+14)");
  } else if (deadlineUrgency === "SAFE") {
    deadlineScore = 8;
  }

  // 2. Free-Time Duration Adequacy (max 20)
  let durationScore = 10;
  if (slotDurationMinutes >= targetDurationMinutes && slotDurationMinutes >= 90) {
    durationScore = 20;
    explanations.push("Durasi waktu luang sangat leluasa (≥90 menit) (+20)");
  } else if (slotDurationMinutes >= targetDurationMinutes) {
    durationScore = 16;
    explanations.push("Durasi waktu luang mencukupi target belajar (+16)");
  } else {
    durationScore = 8;
    explanations.push("Durasi waktu luang lebih pendek dari target ideal (+8)");
  }

  // 3. Zero Conflict Score (max 15, penalty -20 if conflict exists)
  let conflictScore = 15;
  if (hasConflict) {
    conflictScore = -20;
    explanations.push("Terdeteksi potensi tumpang tindih dengan agenda lain (-20)");
  } else {
    explanations.push("Terverifikasi bebas dari bentrok jadwal kuliah (+15)");
  }

  // 4. Workload Balance Score (max 15)
  let workloadScore = 10;
  if (dayWorkloadLevel === "RINGAN") {
    workloadScore = 15;
    explanations.push("Hari masih memiliki beban kuliah ringan (+15)");
  } else if (dayWorkloadLevel === "NORMAL") {
    workloadScore = 12;
    explanations.push("Beban harian seimbang dan terdistribusi optimal (+12)");
  } else if (dayWorkloadLevel === "PADAT") {
    workloadScore = 5;
    explanations.push("Beban kuliah hari ini sudah padat (+5)");
  } else if (dayWorkloadLevel === "SANGAT_PADAT") {
    workloadScore = 0;
    explanations.push("Hari sangat padat, penambahan sesi diminimalkan (0)");
  }

  // 5. Break Compliance Score (max 10)
  let breakScore = 5;
  if (hasSufficientBreak) {
    breakScore = 10;
    explanations.push("Memiliki jeda istirahat aman ≥30 menit sebelum/sesudah (+10)");
  } else {
    explanations.push("Jeda istirahat dari kuliah terdekat kurang dari 30 menit (+5)");
  }

  // 6. Preferred Time Match (max 10)
  let preferredScore = 5;
  if (isPreferredTimeMatch) {
    preferredScore = 10;
    explanations.push("Sesuai dengan jam fokus belajar yang dipilih (+10)");
  }

  const rawScore = deadlineScore + durationScore + conflictScore + workloadScore + breakScore + preferredScore;
  const totalScore = Math.min(100, Math.max(0, rawScore));

  let label: "Sangat Cocok" | "Optimal" | "Cukup" | "Perlu Penyesuaian" = "Cukup";
  if (totalScore >= 90) {
    label = "Sangat Cocok";
  } else if (totalScore >= 75) {
    label = "Optimal";
  } else if (totalScore >= 60) {
    label = "Cukup";
  } else {
    label = "Perlu Penyesuaian";
  }

  return {
    score: totalScore,
    label,
    factors: {
      deadlineUrgencyScore: deadlineScore,
      freeTimeAdequacyScore: durationScore,
      zeroConflictScore: conflictScore,
      workloadBalanceScore: workloadScore,
      breakComplianceScore: breakScore,
      preferredTimeScore: preferredScore,
    },
    explanations,
  };
}
