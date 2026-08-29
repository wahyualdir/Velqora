import { ScheduleDay } from "@/types";
import { timeToMinutes } from "../schedule-import/normalizer";

export const DEFAULT_MAX_DAILY_STUDY_MINUTES = 240; // 4 hours
export const DEFAULT_MIN_BREAK_MINUTES = 30; // 30 mins buffer

export interface SafetyCheckResult {
  isValid: boolean;
  violations: string[];
}

/**
 * Validates whether proposed study sessions violate daily study limits
 */
export function validateDailyStudyLimit(
  currentStudyMinutes: number,
  additionalMinutes: number,
  maxDailyMinutes: number = DEFAULT_MAX_DAILY_STUDY_MINUTES
): SafetyCheckResult {
  const projectedTotal = currentStudyMinutes + additionalMinutes;
  const violations: string[] = [];

  if (projectedTotal > maxDailyMinutes) {
    violations.push(
      `Alokasi total belajar harian (${projectedTotal} menit) melebihi batas aman maksimal (${maxDailyMinutes} menit / ${Math.round(maxDailyMinutes / 60)} jam).`
    );
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
}

/**
 * Validates time validity (startTime must be before endTime, format HH:mm)
 */
export function validateTimeRangeSafety(startTime: string, endTime: string): SafetyCheckResult {
  const violations: string[] = [];
  const s = timeToMinutes(startTime);
  const e = timeToMinutes(endTime);

  if (s === null) {
    violations.push(`Format waktu mulai '${startTime}' tidak valid.`);
  }
  if (e === null) {
    violations.push(`Format waktu selesai '${endTime}' tidak valid.`);
  }
  if (s !== null && e !== null && e <= s) {
    violations.push(`Waktu selesai (${endTime}) harus lebih besar dari waktu mulai (${startTime}).`);
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
}

/**
 * Validates payload parameters to prevent malicious or malformed plan requests
 */
export function validatePlanRequestSafety(req: {
  targetHours?: number;
  durationMinutes?: number;
}): SafetyCheckResult {
  const violations: string[] = [];

  if (req.targetHours !== undefined && (req.targetHours <= 0 || req.targetHours > 40)) {
    violations.push("Target total belajar harus antara 1 sampai 40 jam.");
  }

  if (req.durationMinutes !== undefined && (req.durationMinutes < 15 || req.durationMinutes > 360)) {
    violations.push("Durasi sesi belajar harus antara 15 sampai 360 menit.");
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
}
