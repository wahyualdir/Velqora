import { ScheduleRecommendation, RankedRecommendation, WorkloadLevel } from "./types";

/**
 * Deterministically ranks multiple schedule recommendations from highest to lowest suitability
 */
export function rankScheduleRecommendations(
  recommendations: ScheduleRecommendation[],
  workloadStatus: WorkloadLevel = "NORMAL"
): RankedRecommendation[] {
  const scoredList = recommendations.map((rec) => {
    const qualityScore = Math.round((rec.confidence || 0.8) * 100);
    const matchReasons = rec.explanation?.factors || ["Waktu luang optimal bebas bentrok"];
    const deadlineImpact = rec.explanation?.factors?.[0] || "Mendukung persiapan akademik";

    return {
      recommendation: rec,
      qualityScore,
      matchReasons,
      workloadImpact: workloadStatus,
      deadlineImpact,
    };
  });

  // Sort descending by qualityScore
  scoredList.sort((a, b) => b.qualityScore - a.qualityScore);

  return scoredList.map((item, idx) => ({
    rank: idx + 1,
    recommendation: item.recommendation,
    qualityScore: item.qualityScore,
    matchReasons: item.matchReasons,
    workloadImpact: item.workloadImpact,
    deadlineImpact: item.deadlineImpact,
  }));
}
