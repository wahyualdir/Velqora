import {
  UserSchedulePreference,
  ScheduleBehaviorSignal,
  FreeTimeSlot,
  DeadlineAnalysisItem,
} from "./types";
import { timeToMinutes } from "../schedule-import/normalizer";

export interface PreferenceAdaptationResult {
  isPreferredMatch: boolean;
  scoreBoost: number;
  reasoning: string;
}

/**
 * Evaluates how well a candidate slot matches the user's explicit preferences and behavioral patterns
 */
export function evaluateSlotPreferenceMatch(
  slot: FreeTimeSlot,
  preference: UserSchedulePreference,
  behavior?: ScheduleBehaviorSignal,
  topDeadline?: DeadlineAnalysisItem
): PreferenceAdaptationResult {
  let scoreBoost = 0;
  const matchReasons: string[] = [];

  const slotStartMin = timeToMinutes(slot.startTime) || 0;
  const prefStartMin = timeToMinutes(preference.preferredStudyStartTime) || 1140; // 19:00 default
  const prefEndMin = timeToMinutes(preference.preferredStudyEndTime) || 1290; // 21:30 default

  // 1. Time Window Matching
  const isWithinPreferredWindow = slotStartMin >= prefStartMin - 30 && slotStartMin <= prefEndMin;
  if (isWithinPreferredWindow) {
    scoreBoost += 10;
    matchReasons.push(`Sesuai rentang waktu belajar pilihan (${preference.preferredStudyStartTime}–${preference.preferredStudyEndTime})`);
  }

  // 2. Preferred Days Matching
  const isPreferredDay = preference.preferredDays.includes(slot.day);
  if (isPreferredDay) {
    scoreBoost += 5;
  }

  // 3. Planning Style Matching
  if (preference.planningStyle === "DEADLINE_FOCUSED" && topDeadline?.urgency === "CRITICAL") {
    scoreBoost += 15;
    matchReasons.push("Gaya perencanaan fokus deadline memprioritaskan slot tercepat sebelum tenggat");
  } else if (preference.planningStyle === "INTENSIVE_WEEKEND" && (slot.day === "Sabtu" || slot.day === "Minggu")) {
    scoreBoost += 10;
    matchReasons.push("Prioritas slot akhir pekan sesuai preferensi intensif");
  } else if (preference.planningStyle === "LIGHT_DAILY") {
    scoreBoost += 5;
  }

  // 4. Behavioral Alignment vs Deadline Urgency explanation
  let reasoning = matchReasons.join(". ");
  if (topDeadline?.urgency === "CRITICAL" && !isWithinPreferredWindow) {
    reasoning = `Biasanya Anda memilih sesi belajar pada pukul ${preference.preferredStudyStartTime}. Namun karena tugas memiliki tenggat mendesak (${topDeadline.daysRemaining} hari), slot ini diprioritaskan agar pengerjaan selesai lebih awal.`;
  } else if (!reasoning) {
    reasoning = `Slot waktu luang ${slot.day} ${slot.startTime}–${slot.endTime} bebas dari bentrok perkuliahan.`;
  }

  return {
    isPreferredMatch: isWithinPreferredWindow || isPreferredDay,
    scoreBoost,
    reasoning,
  };
}
