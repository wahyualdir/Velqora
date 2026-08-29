import { ScheduleItem, Task, ScheduleDay } from "@/types";
import {
  AutoScheduleGoalRequest,
  AutoSchedulePlanResult,
  GeneratedScheduleCandidate,
} from "./types";
import { computeAvailabilityWindows } from "./availability";
import { validateGoalRequest, alignToSlotStep, DEFAULT_ACADEMIC_CONSTRAINTS } from "./constraints";
import { isCandidateSlotConflicting } from "./conflict-engine";
import { minutesToTime } from "../schedule-import/normalizer";

/**
 * Deterministic Multi-Criteria Academic Schedule Planner
 */
export function planAcademicSchedule(
  rawRequest: AutoScheduleGoalRequest,
  existingSchedules: ScheduleItem[] = [],
  existingTasks: Task[] = []
): AutoSchedulePlanResult {
  const { isValid, error, sanitized } = validateGoalRequest(rawRequest);

  if (!isValid) {
    return {
      success: false,
      goal: rawRequest,
      totalCandidateSlots: 0,
      recommendedSessionsCount: 0,
      candidates: [],
      availabilityOverview: {
        Senin: [],
        Selasa: [],
        Rabu: [],
        Kamis: [],
        Jumat: [],
        Sabtu: [],
        Minggu: [],
      },
      error,
    };
  }

  // 1. Compute availability windows
  const availability = computeAvailabilityWindows(
    sanitized.preferredDays,
    sanitized.timePreference,
    existingSchedules,
    existingTasks,
    DEFAULT_ACADEMIC_CONSTRAINTS.minBufferMinutes
  );

  // 2. Generate candidate slots
  const allCandidates: GeneratedScheduleCandidate[] = [];
  const duration = sanitized.durationMinutes;

  sanitized.preferredDays.forEach((day) => {
    const windows = availability[day] || [];

    windows.forEach((win) => {
      let cursor = alignToSlotStep(win.startMinutes, DEFAULT_ACADEMIC_CONSTRAINTS.slotStepMinutes);

      while (cursor + duration <= win.endMinutes) {
        const slotStart = cursor;
        const slotEnd = cursor + duration;
        const startTimeStr = minutesToTime(slotStart);
        const endTimeStr = minutesToTime(slotEnd);

        // Check conflict
        const isConflict = isCandidateSlotConflicting(
          { day, startTime: startTimeStr, endTime: endTimeStr },
          existingSchedules,
          []
        );

        if (!isConflict) {
          const scoreBreakdown = calculateSuitabilityScore(
            day,
            slotStart,
            slotEnd,
            win.startMinutes,
            win.endMinutes,
            sanitized
          );

          allCandidates.push({
            id: `gen_${day.toLowerCase()}_${slotStart}_${Math.random().toString(36).slice(2, 6)}`,
            title: sanitized.goalTitle,
            subject: sanitized.subject || "Belajar Terjadwal",
            day,
            startTime: startTimeStr,
            endTime: endTimeStr,
            time: `${startTimeStr} - ${endTimeStr}`,
            location: sanitized.location || "Ruang Belajar Mandiri",
            priority: sanitized.priority || "sedang",
            type: "jadwal",
            suitabilityScore: scoreBreakdown.score,
            scoreReasons: scoreBreakdown.reasons,
            selected: false,
          });
        }

        cursor += DEFAULT_ACADEMIC_CONSTRAINTS.slotStepMinutes;
      }
    });
  });

  // 3. Sort candidates by score descending
  allCandidates.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  // 4. Select top candidates evenly distributed across days up to targetSessionsPerWeek
  const pickedCandidates: GeneratedScheduleCandidate[] = [];
  const daysUsed = new Set<ScheduleDay>();

  // Pass 1: pick highest scoring slot from distinct days
  for (const candidate of allCandidates) {
    if (pickedCandidates.length >= sanitized.targetSessionsPerWeek) break;

    if (!daysUsed.has(candidate.day)) {
      if (!isCandidateSlotConflicting(candidate, existingSchedules, pickedCandidates)) {
        candidate.selected = true;
        pickedCandidates.push(candidate);
        daysUsed.add(candidate.day);
      }
    }
  }

  // Pass 2: if target sessions not met, pick remaining top scoring non-conflicting slots
  if (pickedCandidates.length < sanitized.targetSessionsPerWeek) {
    for (const candidate of allCandidates) {
      if (pickedCandidates.length >= sanitized.targetSessionsPerWeek) break;

      if (!candidate.selected) {
        if (!isCandidateSlotConflicting(candidate, existingSchedules, pickedCandidates)) {
          candidate.selected = true;
          pickedCandidates.push(candidate);
        }
      }
    }
  }

  const warnings: string[] = [];
  if (pickedCandidates.length < sanitized.targetSessionsPerWeek) {
    warnings.push(
      `Hanya ditemukan ${pickedCandidates.length} dari target ${sanitized.targetSessionsPerWeek} sesi belajar bebas bentrok pada preferensi waktu yang dipilih.`
    );
  }

  return {
    success: true,
    goal: sanitized,
    totalCandidateSlots: allCandidates.length,
    recommendedSessionsCount: pickedCandidates.length,
    candidates: allCandidates,
    availabilityOverview: availability,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Deterministic scoring function for time slot suitability
 */
function calculateSuitabilityScore(
  day: ScheduleDay,
  slotStart: number,
  slotEnd: number,
  windowStart: number,
  windowEnd: number,
  goal: AutoScheduleGoalRequest
): { score: number; reasons: string[] } {
  let score = 70; // Base score
  const reasons: string[] = ["Slot bebas bentrok"];

  // 1. Clean hour alignment (e.g. 08:00, 09:00, 14:00, 19:00)
  if (slotStart % 60 === 0) {
    score += 10;
    reasons.push("Mulai tepat di jam bulat");
  }

  // 2. Middle week spacing (Rabu/Kamis)
  if (day === "Rabu" || day === "Kamis") {
    score += 5;
    reasons.push("Distribusi hari optimal pertengahan pekan");
  }

  // 3. Generous buffer margin
  const marginBefore = slotStart - windowStart;
  const marginAfter = windowEnd - slotEnd;
  if (marginBefore >= 30 && marginAfter >= 30) {
    score += 10;
    reasons.push("Jeda waktu lapang sebelum & sesudah sesi");
  } else if (marginBefore < 15 || marginAfter < 15) {
    score -= 5;
    reasons.push("Jeda waktu mepet dengan agenda lain");
  }

  // 4. Prime time within preference
  if (goal.timePreference === "pagi" && slotStart >= 8 * 60 && slotStart <= 10 * 60) {
    score += 10;
    reasons.push("Jam produktif pagi hari");
  } else if (goal.timePreference === "malam" && slotStart >= 19 * 60 && slotStart <= 21 * 60) {
    score += 10;
    reasons.push("Jam fokus malam hari");
  }

  return {
    score: Math.min(100, Math.max(10, score)),
    reasons,
  };
}
