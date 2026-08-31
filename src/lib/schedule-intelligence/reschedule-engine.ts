import { ScheduleItem, Task, ScheduleDay } from "@/types";
import {
  RescheduleImpactReport,
  RescheduleAlternative,
} from "./types";
import { analyzeFreeTimeSlots } from "./free-time-analyzer";
import { calculateRecommendationQuality } from "./recommendation-quality";
import { buildRecommendationExplanation } from "./explanation-engine";
import { analyzeRescheduleImpact } from "./impact-analyzer";
import { checkIntervalOverlap } from "../schedule-import/conflict-engine";
import { analyzeTaskDeadlines } from "./deadline-analyzer";
import { analyzeWorkload } from "./workload-analyzer";

const ALL_DAYS: ScheduleDay[] = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

export interface SmartRescheduleRequest {
  changedEvent: {
    id?: string;
    title: string;
    day: ScheduleDay;
    previousTime?: string;
    newStartTime: string;
    newEndTime: string;
  };
  existingSchedules: ScheduleItem[];
  tasks?: Task[];
  maxAlternatives?: number;
}

/**
 * Smart Rescheduling Engine 2.0
 * Evaluates schedule shifts, detects affected study sessions, and discovers optimal alternative slots
 */
export function planSmartReschedule(request: SmartRescheduleRequest): RescheduleImpactReport {
  const { changedEvent, existingSchedules, tasks = [], maxAlternatives = 3 } = request;

  // 1. Find collision with study sessions
  const affectedStudySessions: ScheduleItem[] = [];

  for (const s of existingSchedules) {
    if (s.id === changedEvent.id) continue;

    if (s.day === changedEvent.day) {
      const sStart = s.start_time || (s.time ? s.time.split("-")[0]?.trim() : "");
      const sEnd = s.end_time || (s.time ? s.time.split("-")[1]?.trim() : "");

      if (sStart && sEnd) {
        if (checkIntervalOverlap(changedEvent.newStartTime, changedEvent.newEndTime, sStart, sEnd)) {
          const typeStr = ((s.type as string) || "").toLowerCase();
          const titleLower = (s.title || "").toLowerCase();
          const isStudy =
            typeStr === "tugas" ||
            typeStr === "belajar" ||
            typeStr === "reminder" ||
            titleLower.includes("belajar") ||
            titleLower.includes("tugas");

          if (isStudy) {
            affectedStudySessions.push(s);
          }
        }
      }
    }
  }

  // 2. Discover alternative non-conflicting free slots for affected study sessions
  const proposedAlternatives: RescheduleAlternative[] = [];

  if (affectedStudySessions.length > 0) {
    const deadlines = analyzeTaskDeadlines(tasks);
    const workloadSummary = analyzeWorkload(existingSchedules, tasks);

    // Simulated schedule without affected study sessions but with new lecture position
    const baseSchedules: ScheduleItem[] = existingSchedules
      .filter((s) => s.id !== changedEvent.id && !affectedStudySessions.some((a) => a.id === s.id))
      .concat([
        {
          id: changedEvent.id || "temp_new_event",
          title: changedEvent.title,
          day: changedEvent.day,
          start_time: changedEvent.newStartTime,
          end_time: changedEvent.newEndTime,
          time: `${changedEvent.newStartTime} - ${changedEvent.newEndTime}`,
          type: "jadwal",
          priority: "sedang",
          is_completed: false,
        },
      ]);

    // Check same day first, then subsequent days if needed
    const candidateDays: ScheduleDay[] = [
      changedEvent.day,
      ...ALL_DAYS.filter((d) => d !== changedEvent.day),
    ];

    for (const day of candidateDays) {
      if (proposedAlternatives.length >= maxAlternatives) break;

      const freeSlots = analyzeFreeTimeSlots(day, baseSchedules, {
        minBreakMinutes: 30,
        minSlotDurationMinutes: 45,
      });

      for (const slot of freeSlots) {
        if (proposedAlternatives.length >= maxAlternatives) break;

        const dayWorkload = workloadSummary.dailyBreakdown[day];

        // Evaluate quality score
        const quality = calculateRecommendationQuality({
          deadlineUrgency: deadlines[0]?.urgency,
          slotDurationMinutes: slot.durationMinutes,
          targetDurationMinutes: 60,
          hasConflict: false,
          dayWorkloadLevel: dayWorkload.level,
          hasSufficientBreak: true,
          isPreferredTimeMatch: slot.isPeakFocusSlot,
        });

        const explanation = buildRecommendationExplanation({
          activity: affectedStudySessions[0].title,
          day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          durationMinutes: slot.durationMinutes,
          deadlineUrgencyLabel: deadlines[0]?.urgencyLabel,
          deadlineDaysRemaining: deadlines[0]?.daysRemaining,
          factors: quality.explanations,
          checkedSchedulesCount: existingSchedules.length,
          maxDailyMinutes: 240,
          minBreakMinutes: 30,
        });

        proposedAlternatives.push({
          slot,
          quality,
          explanation,
          isRecommended: proposedAlternatives.length === 0,
        });
      }
    }
  }

  // 3. Build comprehensive impact report
  return analyzeRescheduleImpact({
    changedEvent,
    existingSchedules,
    tasks,
    proposedAlternatives,
  });
}
