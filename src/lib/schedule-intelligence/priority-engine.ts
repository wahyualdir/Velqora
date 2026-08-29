import { DeadlineUrgency, WorkloadLevel } from "./types";

export interface PriorityScoreInput {
  deadlineUrgency?: DeadlineUrgency;
  taskPriority?: "tinggi" | "sedang" | "rendah";
  timePreferenceMatch?: boolean;
  dayWorkloadLevel?: WorkloadLevel;
  slotDurationMinutes?: number;
  targetDurationMinutes?: number;
}

export interface PriorityScoreResult {
  score: number;
  factors: string[];
}

/**
 * Calculates a multi-criteria deterministic suitability score (0 - 100)
 */
export function calculatePriorityScore(input: PriorityScoreInput): PriorityScoreResult {
  let score = 50;
  const factors: string[] = [];

  // 1. Deadline Urgency Bonus
  if (input.deadlineUrgency === "CRITICAL") {
    score += 35;
    factors.push("Tenggat tugas sangat kritis (<24 jam) (+35)");
  } else if (input.deadlineUrgency === "URGENT") {
    score += 25;
    factors.push("Tenggat tugas mendesak (1-3 hari) (+25)");
  } else if (input.deadlineUrgency === "UPCOMING") {
    score += 10;
    factors.push("Tenggat tugas dalam 7 hari (+10)");
  }

  // 2. Task Priority
  if (input.taskPriority === "tinggi") {
    score += 20;
    factors.push("Prioritas akademik tinggi (+20)");
  } else if (input.taskPriority === "sedang") {
    score += 10;
    factors.push("Prioritas sedang (+10)");
  } else if (input.taskPriority === "rendah") {
    score += 5;
  }

  // 3. Time Preference Match
  if (input.timePreferenceMatch) {
    score += 15;
    factors.push("Sesuai preferensi jam belajar pengguna (+15)");
  }

  // 4. Day Workload Balancing
  if (input.dayWorkloadLevel === "RINGAN") {
    score += 10;
    factors.push("Hari masih memiliki beban belajar ringan (+10)");
  } else if (input.dayWorkloadLevel === "NORMAL") {
    score += 5;
  } else if (input.dayWorkloadLevel === "PADAT") {
    score -= 10;
    factors.push("Hari sudah memiliki beban perkuliahan padat (-10)");
  } else if (input.dayWorkloadLevel === "SANGAT_PADAT") {
    score -= 25;
    factors.push("Beban hari sangat padat, alokasi dibatasi (-25)");
  }

  // 5. Duration match
  if (
    input.slotDurationMinutes &&
    input.targetDurationMinutes &&
    input.slotDurationMinutes >= input.targetDurationMinutes
  ) {
    score += 5;
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    factors,
  };
}
