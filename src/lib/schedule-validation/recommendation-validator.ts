import { ScheduleItem, Task } from "@/types";
import { ScheduleRecommendation, WorkloadSummary } from "../schedule-intelligence/types";
import { ACADEMIC_CONSTANTS } from "../schedule/academic-constants";
import { RecommendationValidationReport, RecommendationValidationVerdict } from "./types";

/**
 * Recommendation Realism Validator
 * Validates each schedule recommendation through the 8-stage gatekeeper pipeline.
 * If any critical stage fails, the recommendation is marked as BLOCKED rather than forced upon the user.
 */

function parseTimeToMinutes(timeStr?: string | null): number {
  if (!timeStr || !timeStr.includes(":")) return -1;
  const [h, m] = timeStr.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return -1;
  return h * 60 + m;
}

export function validateRecommendation(
  rec: ScheduleRecommendation,
  existingSchedules: ScheduleItem[],
  tasks: Task[] = [],
  _workload: WorkloadSummary | null = null,
  parentSnapshotHash?: string,
  currentSnapshotHash?: string
): RecommendationValidationReport {
  const blockReasons: string[] = [];

  // Stage 1: Conflict Check
  const recStart = parseTimeToMinutes(rec.startTime);
  const recEnd = parseTimeToMinutes(rec.endTime);
  let conflictFound = false;

  if (recStart < 0 || recEnd < 0 || recStart >= recEnd) {
    conflictFound = true;
    blockReasons.push("Waktu rekomendasi tidak valid (start >= end atau format salah).");
  } else {
    for (const item of existingSchedules) {
      if (item.id === rec.id) continue; // skip self if modifying existing session
      if (item.day !== rec.day) continue;

      const itemStart = parseTimeToMinutes(item.start_time);
      const itemEnd = parseTimeToMinutes(item.end_time);
      if (itemStart < 0 || itemEnd < 0) continue;

      // Conflict condition: recStart < itemEnd && itemStart < recEnd
      if (recStart < itemEnd && itemStart < recEnd) {
        conflictFound = true;
        blockReasons.push(
          `Rekomendasi berbentrok dengan "${item.title}" (${item.start_time}–${item.end_time}) pada hari ${rec.day}.`
        );
        break;
      }
    }
  }
  const conflictCheckPassed = !conflictFound;

  // Stage 2: Deadline Check
  // If recommendation is associated with a task, ensure the proposed time is BEFORE the deadline.
  let deadlineCoverageMaintained = true;
  if (rec.taskId) {
    const task = tasks.find((t) => t.id === rec.taskId);
    if (task && task.deadline) {
      const deadlineDate = new Date(task.deadline);
      if (!isNaN(deadlineDate.getTime())) {
        // If deadline is already in the past, flag warning but don't crash
        const now = new Date();
        if (deadlineDate < now) {
          deadlineCoverageMaintained = false;
          blockReasons.push("Tugas terkait telah melewati batas waktu tenggat (overdue).");
        }
      }
    }
  }

  // Stage 3: Workload Check (360 min hard cap)
  let dailyWorkloadWithinCap = true;
  let currentDayMinutes = 0;
  for (const item of existingSchedules) {
    if (item.id === rec.id) continue;
    if (item.day === rec.day) {
      const s = parseTimeToMinutes(item.start_time);
      const e = parseTimeToMinutes(item.end_time);
      if (s >= 0 && e > s) {
        currentDayMinutes += e - s;
      }
    }
  }
  const proposedDayTotal = currentDayMinutes + (recEnd - recStart);
  if (proposedDayTotal > ACADEMIC_CONSTANTS.DAILY_WORKLOAD_HARD_CAP_MINUTES) {
    dailyWorkloadWithinCap = false;
    blockReasons.push(
      `Penambahan sesi pada ${rec.day} membuat total beban menjadi ${proposedDayTotal} menit (melebihi batas maksimal ${ACADEMIC_CONSTANTS.DAILY_WORKLOAD_HARD_CAP_MINUTES} menit / 6 jam).`
    );
  }

  // Stage 4: Break Check
  let breakBufferSufficient = true;
  const dayStudyItems = existingSchedules
    .filter((i) => {
      const isStudy = (i.type as string) === "tugas" || (i.type as string) === "reminder" || (i.title && i.title.toLowerCase().includes("belajar"));
      return i.day === rec.day && isStudy && i.id !== rec.id;
    })
    .concat([
      {
        id: rec.id,
        title: rec.activity,
        day: rec.day,
        start_time: rec.startTime,
        end_time: rec.endTime,
        time: `${rec.startTime} - ${rec.endTime}`,
        type: "reminder",
        priority: "sedang",
        user_id: "",
        created_at: "",
        updated_at: "",
      },
    ])
    .sort((a, b) => parseTimeToMinutes(a.start_time) - parseTimeToMinutes(b.start_time));

  for (let i = 0; i < dayStudyItems.length - 1; i++) {
    const end1 = parseTimeToMinutes(dayStudyItems[i].end_time);
    const start2 = parseTimeToMinutes(dayStudyItems[i + 1].start_time);
    const gap = start2 - end1;
    if (gap >= 0 && gap < ACADEMIC_CONSTANTS.MIN_BREAK_BUFFER_MINUTES) {
      breakBufferSufficient = false;
      blockReasons.push(
        `Jeda istirahat antara sesi belajar mandiri pada ${rec.day} kurang dari ${ACADEMIC_CONSTANTS.MIN_BREAK_BUFFER_MINUTES} menit.`
      );
      break;
    }
  }

  // Stage 5: Realism Check (Duration between 15m and 90m)
  const durationMinutes = recEnd - recStart;
  const realismScoreAcceptable =
    durationMinutes >= 15 && durationMinutes <= ACADEMIC_CONSTANTS.ADAPTIVE_MAX_SINGLE_SESSION_MINUTES;
  if (!realismScoreAcceptable) {
    blockReasons.push(
      `Durasi sesi (${durationMinutes} menit) berada di luar batas realistis (15–${ACADEMIC_CONSTANTS.ADAPTIVE_MAX_SINGLE_SESSION_MINUTES} menit).`
    );
  }

  // Stage 6: Evidence Check
  const evidenceSupported =
    Array.isArray(rec.evidence) && rec.evidence.length > 0 && typeof rec.reason === "string" && rec.reason.length > 0;
  if (!evidenceSupported) {
    blockReasons.push("Rekomendasi tidak memiliki bukti atau alasan yang dapat diverifikasi.");
  }

  // Stage 7: Explainability Complete
  const explainabilityComplete =
    !!rec.explanation &&
    typeof rec.explanation.summary === "string" &&
    rec.explanation.summary.length > 0 &&
    Array.isArray(rec.explanation.factors);
  if (!explainabilityComplete) {
    blockReasons.push("Rekomendasi tidak menyediakan struktur penjelasan transparansi.");
  }

  // Stage 8: Approval Gate Check (Snapshot hash check)
  let approvalGatePassed = true;
  if (parentSnapshotHash && currentSnapshotHash && parentSnapshotHash !== currentSnapshotHash) {
    approvalGatePassed = false;
    blockReasons.push("Snapshot kalender telah berubah (stale proposal), diperlukan re-evaluasi.");
  }

  const checks = {
    conflictCheckPassed,
    deadlineCoverageMaintained,
    dailyWorkloadWithinCap,
    breakBufferSufficient,
    realismScoreAcceptable,
    evidenceSupported,
    explainabilityComplete,
    approvalGatePassed,
  };

  const passedChecksCount = Object.values(checks).filter(Boolean).length;
  const totalChecksCount = Object.keys(checks).length;

  let verdict: RecommendationValidationVerdict = "APPROVED";
  if (!conflictCheckPassed || !dailyWorkloadWithinCap || !realismScoreAcceptable || !approvalGatePassed) {
    verdict = "BLOCKED";
  } else if (!breakBufferSufficient || !deadlineCoverageMaintained || !evidenceSupported) {
    verdict = "ADJUSTMENT_REQUIRED";
  }

  return {
    recommendationId: rec.id,
    verdict,
    checks,
    blockReasons,
    passedChecksCount,
    totalChecksCount,
    validatedAt: new Date().toISOString(),
  };
}
