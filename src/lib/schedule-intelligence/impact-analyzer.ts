import { ScheduleItem, Task, ScheduleDay } from "@/types";
import { RescheduleImpactReport, RescheduleAlternative } from "./types";
import { checkIntervalOverlap } from "../schedule-import/conflict-engine";
import { timeToMinutes } from "../schedule-import/normalizer";
import { analyzeWorkload } from "./workload-analyzer";
import { analyzeTaskDeadlines } from "./deadline-analyzer";

export interface ImpactAnalysisInput {
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
  proposedAlternatives?: RescheduleAlternative[];
}

/**
 * Quantifies and explains the complete ripple effects of a schedule change
 */
export function analyzeRescheduleImpact(input: ImpactAnalysisInput): RescheduleImpactReport {
  const { changedEvent, existingSchedules, tasks = [], proposedAlternatives = [] } = input;

  const affectedSchedules: ScheduleItem[] = [];
  const affectedStudySessions: ScheduleItem[] = [];
  const affectedTasks: Task[] = [];

  // Workload before change
  const workloadBeforeSummary = analyzeWorkload(existingSchedules, tasks);
  const workloadBefore = workloadBeforeSummary.dailyBreakdown[changedEvent.day].level;

  // Detect collisions on the target day
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
            // Check if there is a corresponding task (by title substring, subject, or token match)
            const sKeywords = titleLower.split(/[\s_:-]+/).filter((w) => w.length > 1);
            const matchingTask = tasks.find((t) => {
              const tTitle = t.title.toLowerCase();
              const tSubject = (t.subject || "").toLowerCase();
              return (
                titleLower.includes(tTitle) ||
                tTitle.includes(titleLower) ||
                (tSubject && titleLower.includes(tSubject)) ||
                sKeywords.some((w) => tTitle.includes(w) || tSubject.includes(w))
              );
            });
            if (matchingTask) {
              affectedTasks.push(matchingTask);
            }
          } else {
            affectedSchedules.push(s);
          }
        }
      }
    }
  }

  // Gained / Lost Free-Time Estimation
  const newStartMin = timeToMinutes(changedEvent.newStartTime) || 0;
  const newEndMin = timeToMinutes(changedEvent.newEndTime) || 0;
  const newDuration = Math.max(0, newEndMin - newStartMin);

  let prevDuration = 0;
  if (changedEvent.previousTime) {
    const prevParts = changedEvent.previousTime.split("-");
    if (prevParts.length >= 2) {
      const pStart = timeToMinutes(prevParts[0].trim()) || 0;
      const pEnd = timeToMinutes(prevParts[1].trim()) || 0;
      prevDuration = Math.max(0, pEnd - pStart);
    }
  }

  const lostFreeTimeMinutes = newDuration;
  const gainedFreeTimeMinutes = prevDuration;

  // Check deadline risk
  const deadlines = analyzeTaskDeadlines(tasks);
  const urgentTaskIds = new Set(
    deadlines.filter((d) => d.urgency === "CRITICAL" || d.urgency === "URGENT").map((d) => d.taskId)
  );
  const deadlineRiskIncreased = affectedTasks.some((t) => urgentTaskIds.has(t.id));

  // Simulated Workload After
  const simulatedSchedules: ScheduleItem[] = existingSchedules
    .filter((s) => s.id !== changedEvent.id && !affectedStudySessions.some((a) => a.id === s.id))
    .concat([
      {
        id: changedEvent.id || "temp_changed",
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

  const workloadAfterSummary = analyzeWorkload(simulatedSchedules, tasks);
  const workloadAfter = workloadAfterSummary.dailyBreakdown[changedEvent.day].level;

  const totalCollisions = affectedSchedules.length + affectedStudySessions.length;
  const hasImpact = totalCollisions > 0 || deadlineRiskIncreased;

  // Build natural human-readable summary
  let humanSummary = "";
  if (!hasImpact) {
    humanSummary = `Perubahan jadwal '${changedEvent.title}' ke pukul ${changedEvent.newStartTime}–${changedEvent.newEndTime} aman dan tidak bertabrakan dengan agenda lain.`;
  } else {
    const parts: string[] = [];
    if (affectedStudySessions.length > 0) {
      parts.push(
        `memindahkan ${affectedStudySessions.length} sesi belajar (${affectedStudySessions.map((s) => `'${s.title}'`).join(", ")})`
      );
    }
    if (affectedSchedules.length > 0) {
      parts.push(
        `bertubrukan dengan ${affectedSchedules.length} kuliah lain (${affectedSchedules.map((s) => `'${s.title}'`).join(", ")})`
      );
    }
    if (deadlineRiskIncreased) {
      parts.push(`berpotensi menggeser persiapan tugas dengan tenggat mendesak`);
    }

    humanSummary = `Perubahan jadwal '${changedEvent.title}' (${changedEvent.day} ${changedEvent.newStartTime}–${changedEvent.newEndTime}) ${parts.join(" dan ")}.`;
  }

  return {
    hasImpact,
    eventChanged: changedEvent,
    affectedSchedules,
    affectedStudySessions,
    affectedTasks,
    lostFreeTimeMinutes,
    gainedFreeTimeMinutes,
    newConflictsCount: affectedSchedules.length,
    resolvedConflictsCount: 0,
    workloadBefore,
    workloadAfter,
    deadlineRiskIncreased,
    recommendedAlternatives: proposedAlternatives,
    humanSummary,
  };
}
