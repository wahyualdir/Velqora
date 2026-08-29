import { AutoScheduleGoalRequest } from "./types";

export interface AcademicConstraintRules {
  minDurationMinutes: number;
  maxDurationMinutes: number;
  slotStepMinutes: number; // Interval alignment, e.g. every 15 or 30 mins
  minBufferMinutes: number;
  maxSessionsPerDay: number;
}

export const DEFAULT_ACADEMIC_CONSTRAINTS: AcademicConstraintRules = {
  minDurationMinutes: 30,
  maxDurationMinutes: 180,
  slotStepMinutes: 30, // Prefer clean 08:00, 08:30, 10:00 slots
  minBufferMinutes: 15,
  maxSessionsPerDay: 2,
};

/**
 * Validates goal request parameters against academic constraints
 */
export function validateGoalRequest(
  req: AutoScheduleGoalRequest
): { isValid: boolean; error?: string; sanitized: AutoScheduleGoalRequest } {
  const goalTitle = (req.goalTitle || "").trim();
  if (!goalTitle || goalTitle.length < 2) {
    return {
      isValid: false,
      error: "Nama tujuan belajar / topik kegiatan wajib diisi.",
      sanitized: req,
    };
  }

  const duration = Math.max(30, Math.min(240, req.durationMinutes || 90));
  const targetSessions = Math.max(1, Math.min(7, req.targetSessionsPerWeek || 3));
  const preferredDays = req.preferredDays && req.preferredDays.length > 0
    ? req.preferredDays
    : ["Senin", "Rabu", "Jumat"];

  const timePref = req.timePreference || "fleksibel";

  return {
    isValid: true,
    sanitized: {
      ...req,
      goalTitle,
      subject: req.subject?.trim() || "Fokus Akademik",
      durationMinutes: duration,
      targetSessionsPerWeek: targetSessions,
      preferredDays: preferredDays as any,
      timePreference: timePref,
      priority: req.priority || "sedang",
    },
  };
}

/**
 * Aligns minute value to closest slot step (e.g. rounds 485 mins (08:05) -> 480 mins (08:00) or 510 mins (08:30))
 */
export function alignToSlotStep(minutes: number, stepMinutes: number = 30): number {
  return Math.ceil(minutes / stepMinutes) * stepMinutes;
}
