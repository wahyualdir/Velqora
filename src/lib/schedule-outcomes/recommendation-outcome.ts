import {
  RecommendationOutcomeRecord,
  OutcomeStatus,
} from "./types";

/**
 * Calculates a deterministic Outcome Score (0-100) for a given recommendation record.
 */
export function calculateRecommendationOutcomeScore(record: {
  wasAccepted: boolean;
  wasExecuted: boolean;
  affectedSessionsOutcomes: OutcomeStatus[];
  conflictsOccurred: number;
}): number {
  // If recommendation was rejected by user
  if (!record.wasAccepted) {
    return 30; // Neutral baseline for rejected proposals
  }

  // If accepted but never executed
  if (!record.wasExecuted) {
    return 40;
  }

  const outcomes = record.affectedSessionsOutcomes;
  if (!outcomes || outcomes.length === 0) {
    return 70; // Accepted and executed without specific session feedback
  }

  // Factor 1: Execution & Acceptance Bonus (Max: 20)
  let score = 20;

  // Factor 2: Completion Rate of Affected Sessions (Max: 40)
  const completedCount = outcomes.filter((s) => s === "COMPLETED").length;
  const partialCount = outcomes.filter((s) => s === "PARTIALLY_COMPLETED").length;
  const completionRate =
    (completedCount + 0.5 * partialCount) / outcomes.length;
  score += Math.round(completionRate * 40);

  // Factor 3: Conflict Invariant Preservation (Max: 25)
  if (record.conflictsOccurred === 0) {
    score += 25;
  } else if (record.conflictsOccurred === 1) {
    score += 10;
  }

  // Factor 4: Stability / Non-Reschedule Bonus (Max: 15)
  const rescheduledCount = outcomes.filter((s) => s === "RESCHEDULED").length;
  const skippedCount = outcomes.filter((s) => s === "SKIPPED").length;

  if (rescheduledCount === 0 && skippedCount === 0) {
    score += 15;
  } else if (rescheduledCount === 1 || skippedCount === 1) {
    score += 5;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Evaluates the historical success and effectiveness of past recommendations.
 */
export function evaluateHistoricalRecommendations(
  records: RecommendationOutcomeRecord[] = []
): {
  totalRecommendations: number;
  acceptedCount: number;
  acceptanceRate: number; // 0.0 - 1.0
  averageOutcomeScore: number;
  effectivenessRating: "SANGAT_EFEKTIF" | "EFEKTIF" | "MODERAT" | "PERLU_PENYESUAIAN" | "INSUFFICIENT_DATA";
  summary: string;
} {
  if (!records || records.length === 0) {
    return {
      totalRecommendations: 0,
      acceptedCount: 0,
      acceptanceRate: 0,
      averageOutcomeScore: 0,
      effectivenessRating: "INSUFFICIENT_DATA",
      summary: "Belum ada riwayat evaluasi rekomendasi sebelumnya.",
    };
  }

  const accepted = records.filter((r) => r.wasAccepted).length;
  const acceptanceRate = Math.round((accepted / records.length) * 100) / 100;
  const totalScore = records.reduce((acc, r) => acc + r.outcomeScore, 0);
  const avgScore = Math.round((totalScore / records.length) * 10) / 10;

  let effectivenessRating: "SANGAT_EFEKTIF" | "EFEKTIF" | "MODERAT" | "PERLU_PENYESUAIAN" | "INSUFFICIENT_DATA" = "MODERAT";
  if (avgScore >= 85) effectivenessRating = "SANGAT_EFEKTIF";
  else if (avgScore >= 70) effectivenessRating = "EFEKTIF";
  else if (avgScore >= 50) effectivenessRating = "MODERAT";
  else effectivenessRating = "PERLU_PENYESUAIAN";

  const summary = `Evaluasi ${records.length} rekomendasi: Tingkat penerimaan ${Math.round(acceptanceRate * 100)}%, rata-rata efektivitas ${avgScore}/100 (${effectivenessRating.replace("_", " ")}).`;

  return {
    totalRecommendations: records.length,
    acceptedCount: accepted,
    acceptanceRate,
    averageOutcomeScore: avgScore,
    effectivenessRating,
    summary,
  };
}
