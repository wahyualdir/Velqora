import { ScheduleItem, Task, ScheduleDay } from "@/types";
import {
  AutoScheduleGoalRequest,
  AutoSchedulePlanResult,
  GeneratedScheduleCandidate,
  WorkloadLevel,
} from "./types";
import { computeAvailabilityWindows } from "./availability";
import { validateGoalRequest, alignToSlotStep, DEFAULT_ACADEMIC_CONSTRAINTS } from "./constraints";
import { isCandidateSlotConflicting } from "./conflict-engine";
import { minutesToTime } from "../schedule-import/normalizer";

const DAY_ORDER: ScheduleDay[] = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

/**
 * Deterministic Multi-Criteria Academic Schedule Planner 2.0
 * Includes Workload Protection, Deadline Proximity, Session Splitting, and Explainable Rationale.
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
      totalStudyHours: 0,
      workloadLevel: "optimal",
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

  // 1. Check deadline proximity if task or deadline provided
  let deadlineInfo: { deadlineDate: string; daysRemaining: number; isUrgent: boolean } | undefined;
  if (sanitized.deadline) {
    const targetDate = new Date(sanitized.deadline);
    if (!isNaN(targetDate.getTime())) {
      const now = new Date();
      const diffMs = targetDate.getTime() - now.getTime();
      const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      deadlineInfo = {
        deadlineDate: sanitized.deadline,
        daysRemaining,
        isUrgent: daysRemaining <= 3,
      };
    }
  }

  // 2. Compute availability windows
  const availability = computeAvailabilityWindows(
    sanitized.preferredDays,
    sanitized.timePreference,
    existingSchedules,
    existingTasks,
    sanitized.minBreakMinutes || DEFAULT_ACADEMIC_CONSTRAINTS.minBufferMinutes
  );

  // 3. Generate candidate slots
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

        // Check conflict with existing schedules
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
            sanitized,
            deadlineInfo?.daysRemaining
          );

          const explanation = buildExplainableReasoning(
            day,
            startTimeStr,
            endTimeStr,
            sanitized,
            deadlineInfo
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
            explanation,
            deadlineProximityDays: deadlineInfo?.daysRemaining,
            selected: false,
          });
        }

        cursor += DEFAULT_ACADEMIC_CONSTRAINTS.slotStepMinutes;
      }
    });
  });

  // 4. Sort candidates by score descending
  allCandidates.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  // 5. Select top candidates with Workload Protection
  const maxDailyMinutes = sanitized.maxDailyStudyMinutes || DEFAULT_ACADEMIC_CONSTRAINTS.maxDailyStudyMinutes;
  const pickedCandidates: GeneratedScheduleCandidate[] = [];
  const dailyStudyMinutesMap: Record<ScheduleDay, number> = {
    Senin: 0,
    Selasa: 0,
    Rabu: 0,
    Kamis: 0,
    Jumat: 0,
    Sabtu: 0,
    Minggu: 0,
  };

  // Pass 1: pick highest scoring slot from distinct days without exceeding daily limit
  for (const candidate of allCandidates) {
    if (pickedCandidates.length >= sanitized.targetSessionsPerWeek) break;

    const currentDaily = dailyStudyMinutesMap[candidate.day] || 0;
    if (currentDaily === 0 && currentDaily + duration <= maxDailyMinutes) {
      if (!isCandidateSlotConflicting(candidate, existingSchedules, pickedCandidates)) {
        candidate.selected = true;
        pickedCandidates.push(candidate);
        dailyStudyMinutesMap[candidate.day] += duration;
      }
    }
  }

  // Pass 2: if target sessions not met, pick remaining top scoring non-conflicting slots within daily workload limits
  if (pickedCandidates.length < sanitized.targetSessionsPerWeek) {
    for (const candidate of allCandidates) {
      if (pickedCandidates.length >= sanitized.targetSessionsPerWeek) break;

      if (!candidate.selected) {
        const currentDaily = dailyStudyMinutesMap[candidate.day] || 0;
        if (currentDaily + duration <= maxDailyMinutes) {
          if (!isCandidateSlotConflicting(candidate, existingSchedules, pickedCandidates)) {
            candidate.selected = true;
            pickedCandidates.push(candidate);
            dailyStudyMinutesMap[candidate.day] += duration;
          }
        }
      }
    }
  }

  // Sort picked candidates chronologically (Senin -> Minggu, then startTime)
  pickedCandidates.sort((a, b) => {
    const dayDiff = DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return a.startTime.localeCompare(b.startTime);
  });

  const totalStudyMinutes = pickedCandidates.length * duration;
  const totalStudyHours = Number((totalStudyMinutes / 60).toFixed(1));

  let workloadLevel: WorkloadLevel = "optimal";
  if (totalStudyHours <= 3) {
    workloadLevel = "ringan";
  } else if (totalStudyHours > 6) {
    workloadLevel = "padat";
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
    totalStudyHours,
    workloadLevel,
    candidates: allCandidates,
    availabilityOverview: availability,
    deadlineInfo,
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
  goal: AutoScheduleGoalRequest,
  daysUntilDeadline?: number
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
    reasons.push("Jeda waktu lapang (≥30m) sebelum & sesudah sesi");
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
    reasons.push("Jam produktif malam hari");
  } else if (goal.timePreference === "sore" && slotStart >= 16 * 60 && slotStart <= 18 * 60) {
    score += 10;
    reasons.push("Jam produktif sore hari");
  }

  // 5. Deadline urgency bonus
  if (daysUntilDeadline !== undefined && daysUntilDeadline <= 3) {
    score += 15;
    reasons.push(`Prioritas tenggat waktu dekat (${daysUntilDeadline} hari lagi)`);
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    reasons,
  };
}

/**
 * Builds deterministic human-readable explainable reasoning for a recommended study session
 */
function buildExplainableReasoning(
  day: ScheduleDay,
  startTime: string,
  endTime: string,
  goal: AutoScheduleGoalRequest,
  deadlineInfo?: { deadlineDate: string; daysRemaining: number }
): string {
  const duration = goal.durationMinutes;
  const prefText = goal.timePreference === "fleksibel" ? "waktu luang" : `preferensi ${goal.timePreference}`;

  if (deadlineInfo && deadlineInfo.daysRemaining <= 3) {
    return `Dipilih karena merupakan slot luang ${duration} menit pada hari ${day} (${startTime} - ${endTime}) sebelum tenggat tugas (${deadlineInfo.daysRemaining} hari lagi) tanpa bentrok jadwal kuliah.`;
  }

  return `Dipilih karena merupakan slot ${duration} menit yang optimal pada hari ${day} (${startTime} - ${endTime}) sesuai ${prefText} dan berjarak aman dari agenda akademik lain.`;
}
