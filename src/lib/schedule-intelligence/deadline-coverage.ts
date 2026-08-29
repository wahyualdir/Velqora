import { Task, ScheduleItem, ScheduleDay } from "@/types";
import { DeadlineCoverageReport, FreeTimeSlot } from "./types";
import { analyzeFreeTimeSlots, minutesToTimeStr } from "./free-time-analyzer";
import { timeToMinutes } from "../schedule-import/normalizer";

const ALL_DAYS: ScheduleDay[] = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

/**
 * Evaluates whether required study hours can realistically fit into available free time before the deadline
 */
export function analyzeDeadlineCoverage(
  task: Task,
  existingSchedules: ScheduleItem[] = [],
  hoursNeeded: number = 3,
  referenceDate: Date = new Date()
): DeadlineCoverageReport {
  const targetMinutesNeeded = Math.round(hoursNeeded * 60);

  if (!task.deadline) {
    return {
      status: "SUFFICIENT_TIME",
      taskTitle: task.title,
      deadline: "Tidak ada tenggat",
      daysRemaining: 14,
      hoursNeeded,
      hoursAvailable: 20,
      gapMinutes: 0,
      riskLevel: "RENDAH",
      suggestedSplits: [],
      summary: `Tugas '${task.title}' tidak memiliki tenggat waktu ketat. Waktu belajar sangat fleksibel.`,
    };
  }

  const deadlineDate = new Date(task.deadline);
  const diffMs = deadlineDate.getTime() - referenceDate.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  if (diffMs < 0) {
    return {
      status: "OVERDUE",
      taskTitle: task.title,
      deadline: task.deadline,
      daysRemaining: 0,
      hoursNeeded,
      hoursAvailable: 0,
      gapMinutes: targetMinutesNeeded,
      riskLevel: "KRITIS",
      suggestedSplits: [],
      summary: `Tenggat tugas '${task.title}' telah terlewati (${task.deadline}). Prioritaskan penyelesaian segera.`,
    };
  }

  // Discover free slots across remaining days before deadline
  let totalFreeMinutes = 0;
  const candidateSlots: FreeTimeSlot[] = [];

  const candidateDays = ALL_DAYS.slice(0, Math.min(ALL_DAYS.length, Math.max(1, daysRemaining)));

  for (const day of candidateDays) {
    const freeSlots = analyzeFreeTimeSlots(day, existingSchedules, {
      minBreakMinutes: 30,
      minSlotDurationMinutes: 45,
    });

    for (const slot of freeSlots) {
      candidateSlots.push(slot);
      totalFreeMinutes += slot.durationMinutes;
    }
  }

  const hoursAvailable = parseFloat((totalFreeMinutes / 60).toFixed(1));
  const isSufficient = totalFreeMinutes >= targetMinutesNeeded;
  const gapMinutes = Math.max(0, targetMinutesNeeded - totalFreeMinutes);

  // Smart Session Splitting 2.0 (partitioning needed time into optimal 45-90m blocks)
  const suggestedSplits: Array<{
    day: ScheduleDay;
    startTime: string;
    endTime: string;
    durationMinutes: number;
  }> = [];

  let allocatedMinutes = 0;
  for (const slot of candidateSlots) {
    if (allocatedMinutes >= targetMinutesNeeded) break;

    const remaining = targetMinutesNeeded - allocatedMinutes;
    const splitDur = Math.min(slot.durationMinutes, remaining, 90);

    if (splitDur >= 45) {
      const slotStartMin = timeToMinutes(slot.startTime)!;
      const splitEnd = minutesToTimeStr(slotStartMin + splitDur);

      suggestedSplits.push({
        day: slot.day,
        startTime: slot.startTime,
        endTime: splitEnd,
        durationMinutes: splitDur,
      });

      allocatedMinutes += splitDur;
    }
  }

  let riskLevel: "RENDAH" | "SEDANG" | "TINGGI" | "KRITIS" = "RENDAH";
  if (!isSufficient) {
    riskLevel = daysRemaining <= 2 ? "KRITIS" : "TINGGI";
  } else if (daysRemaining <= 1) {
    riskLevel = "TINGGI";
  } else if (daysRemaining <= 3) {
    riskLevel = "SEDANG";
  }

  const summary = isSufficient
    ? `Tersedia ${hoursAvailable} jam waktu luang aman sebelum tenggat (${daysRemaining} hari lagi), mencukupi kebutuhan target ${hoursNeeded} jam.`
    : `Waktu luang aman sebelum tenggat hanya ${hoursAvailable} jam (kurang ${Math.round(gapMinutes / 60)} jam dari target ${hoursNeeded} jam). Perlu penyesuaian beban tugas.`;

  return {
    status: isSufficient ? "SUFFICIENT_TIME" : "INSUFFICIENT_TIME",
    taskTitle: task.title,
    deadline: task.deadline,
    daysRemaining,
    hoursNeeded,
    hoursAvailable,
    gapMinutes,
    riskLevel,
    suggestedSplits,
    summary,
  };
}
