import { ScheduleDay } from "@/types";
import { UserSchedulePreference, PlanningStyle } from "./types";

export const DEFAULT_SCHEDULE_PREFERENCE: UserSchedulePreference = {
  preferredStudyStartTime: "19:00",
  preferredStudyEndTime: "21:30",
  preferredSessionDuration: 60,
  preferredDays: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
  preferredBreakDuration: 30,
  maximumDailyStudyMinutes: 240,
  planningStyle: "BALANCED",
};

/**
 * Validates and sanitizes user schedule preferences ensuring safety constraints
 */
export function sanitizeSchedulePreferences(
  input?: Partial<UserSchedulePreference> | null
): UserSchedulePreference {
  if (!input) return { ...DEFAULT_SCHEDULE_PREFERENCE };

  const validStyles: PlanningStyle[] = [
    "BALANCED",
    "DEADLINE_FOCUSED",
    "LIGHT_DAILY",
    "INTENSIVE_WEEKEND",
  ];

  const planningStyle: PlanningStyle = validStyles.includes(input.planningStyle as any)
    ? (input.planningStyle as PlanningStyle)
    : DEFAULT_SCHEDULE_PREFERENCE.planningStyle;

  // Session duration clamped between 30 and 120 minutes
  let sessionDuration = Number(input.preferredSessionDuration) || DEFAULT_SCHEDULE_PREFERENCE.preferredSessionDuration;
  sessionDuration = Math.min(120, Math.max(30, sessionDuration));

  // Max daily study minutes clamped between 60 and 360 minutes
  let maxDailyStudy = Number(input.maximumDailyStudyMinutes) || DEFAULT_SCHEDULE_PREFERENCE.maximumDailyStudyMinutes;
  maxDailyStudy = Math.min(360, Math.max(60, maxDailyStudy));

  // Break duration clamped between 15 and 60 minutes
  let breakDuration = Number(input.preferredBreakDuration) || DEFAULT_SCHEDULE_PREFERENCE.preferredBreakDuration;
  breakDuration = Math.min(60, Math.max(15, breakDuration));

  // Valid days
  const validDaysList: ScheduleDay[] = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];

  let preferredDays: ScheduleDay[] = Array.isArray(input.preferredDays)
    ? input.preferredDays.filter((d) => validDaysList.includes(d as ScheduleDay))
    : DEFAULT_SCHEDULE_PREFERENCE.preferredDays;

  if (preferredDays.length === 0) {
    preferredDays = [...DEFAULT_SCHEDULE_PREFERENCE.preferredDays];
  }

  // Time format regex check (HH:mm)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  const startTime = timeRegex.test(input.preferredStudyStartTime || "")
    ? input.preferredStudyStartTime!
    : DEFAULT_SCHEDULE_PREFERENCE.preferredStudyStartTime;

  const endTime = timeRegex.test(input.preferredStudyEndTime || "")
    ? input.preferredStudyEndTime!
    : DEFAULT_SCHEDULE_PREFERENCE.preferredStudyEndTime;

  return {
    userId: input.userId,
    preferredStudyStartTime: startTime,
    preferredStudyEndTime: endTime,
    preferredSessionDuration: sessionDuration,
    preferredDays,
    preferredBreakDuration: breakDuration,
    maximumDailyStudyMinutes: maxDailyStudy,
    planningStyle,
    updatedAt: new Date().toISOString(),
  };
}
