import {
  RecommendationOutcomeRecord,
  RecommendationCalibrationMultiplier,
} from "./types";
import { ACADEMIC_CONSTANTS } from "../schedule/academic-constants";

/**
 * Derives empirical calibration multipliers from historical recommendation outcome records.
 * Multipliers are strictly clamped within [0.70, 1.30] and act as secondary ranking factors.
 */
export function calculateCalibrationMultipliers(
  records: RecommendationOutcomeRecord[] = []
): Record<string, RecommendationCalibrationMultiplier> {
  const typeGroups: Record<
    string,
    { accepted: number; completed: number; total: number }
  > = {};

  for (const r of records) {
    const typeKey = r.proposalTitle || "GENERAL_OPTIMIZATION";
    if (!typeGroups[typeKey]) {
      typeGroups[typeKey] = { accepted: 0, completed: 0, total: 0 };
    }
    typeGroups[typeKey].total++;
    if (r.wasAccepted) {
      typeGroups[typeKey].accepted++;
    }

    const completed = r.affectedSessionsOutcomes.filter(
      (s) => s === "COMPLETED"
    ).length;
    if (r.affectedSessionsOutcomes.length > 0) {
      typeGroups[typeKey].completed +=
        completed / r.affectedSessionsOutcomes.length;
    }
  }

  const multipliers: Record<string, RecommendationCalibrationMultiplier> = {};

  for (const [typeKey, data] of Object.entries(typeGroups)) {
    if (data.total < 3) {
      // Not enough data -> default neutral multiplier 1.0
      multipliers[typeKey] = {
        recommendationType: typeKey,
        historicalSuccessRate: data.total > 0 ? data.accepted / data.total : 1.0,
        rankingMultiplier: 1.0,
        sampleCount: data.total,
      };
      continue;
    }

    const acceptRate = data.accepted / data.total;
    const completionRate = data.completed / data.total;
    const combinedSuccess = 0.5 * acceptRate + 0.5 * completionRate;

    // Map [0.0, 1.0] to [0.75, 1.25]
    let rawMultiplier = 0.75 + combinedSuccess * 0.5;
    rawMultiplier = Math.min(
      ACADEMIC_CONSTANTS.CALIBRATION_MULTIPLIER_MAX,
      Math.max(
        ACADEMIC_CONSTANTS.CALIBRATION_MULTIPLIER_MIN,
        Math.round(rawMultiplier * 100) / 100
      )
    );

    multipliers[typeKey] = {
      recommendationType: typeKey,
      historicalSuccessRate: Math.round(combinedSuccess * 100) / 100,
      rankingMultiplier: rawMultiplier,
      sampleCount: data.total,
    };
  }

  return multipliers;
}

/**
 * Applies empirical calibration multiplier to a base recommendation quality score (0-100).
 * Preserves deterministic 0-100 boundary.
 */
export function applyCalibrationToScore(
  baseScore: number,
  multiplier = 1.0
): number {
  const safeMultiplier = Math.min(1.3, Math.max(0.7, multiplier));
  const calibrated = Math.round(baseScore * safeMultiplier);
  return Math.min(100, Math.max(0, calibrated));
}
