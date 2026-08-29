import { Task } from "@/types";
import { DeadlineUrgency, DeadlineAnalysisItem } from "./types";

/**
 * Classifies deadline urgency deterministically based on hours remaining
 */
export function classifyDeadlineUrgency(hoursRemaining: number): {
  urgency: DeadlineUrgency;
  label: string;
  explanation: string;
} {
  if (hoursRemaining < 0) {
    return {
      urgency: "OVERDUE",
      label: "Terlewat",
      explanation: "Tugas ini telah melewati batas waktu pengerjaan.",
    };
  }

  if (hoursRemaining < 24) {
    return {
      urgency: "CRITICAL",
      label: "Kritis (<24 Jam)",
      explanation: "Tugas ini diprioritaskan utama karena tenggatnya kurang dari 24 jam.",
    };
  }

  if (hoursRemaining <= 72) {
    return {
      urgency: "URGENT",
      label: "Mendesak (1-3 Hari)",
      explanation: "Tugas ini mendesak untuk segera diselesaikan dalam 1-3 hari ke depan.",
    };
  }

  if (hoursRemaining <= 168) {
    return {
      urgency: "UPCOMING",
      label: "Mendatang (Dalam 7 Hari)",
      explanation: "Tugas akademik terjadwal dengan tenggat waktu dalam minggu ini.",
    };
  }

  return {
    urgency: "SAFE",
    label: "Aman (>7 Hari)",
    explanation: "Tenggat waktu masih relatif aman (lebih dari 7 hari).",
  };
}

/**
 * Analyzes pending tasks and generates structured deadline intelligence
 */
export function analyzeTaskDeadlines(
  tasks: Task[] = [],
  referenceDate: Date = new Date()
): DeadlineAnalysisItem[] {
  const activeTasks = tasks.filter(
    (t) => t.status !== "selesai" && (t.deadline || (t as any).due_date)
  );
  const results: DeadlineAnalysisItem[] = [];

  for (const t of activeTasks) {
    const rawDeadline = t.deadline || (t as any).due_date || "";
    const parsedDate = new Date(rawDeadline);

    if (isNaN(parsedDate.getTime())) {
      continue;
    }

    const diffMs = parsedDate.getTime() - referenceDate.getTime();
    const hoursRemaining = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(1));
    const daysRemaining = parseFloat((hoursRemaining / 24).toFixed(1));

    const { urgency, label, explanation } = classifyDeadlineUrgency(hoursRemaining);

    // Estimated duration from task or default by priority
    const estimatedMinutes = t.priority === "tinggi" ? 120 : t.priority === "sedang" ? 90 : 60;

    results.push({
      taskId: t.id,
      title: t.title,
      subject: t.subject || undefined,
      deadlineDate: rawDeadline.split("T")[0],
      deadlineIso: parsedDate.toISOString(),
      hoursRemaining,
      daysRemaining,
      urgency,
      urgencyLabel: label,
      urgencyExplanation: explanation,
      estimatedMinutesToComplete: estimatedMinutes,
      priority: (t.priority as any) || "sedang",
      isOverdue: hoursRemaining < 0,
    });
  }

  // Sort by urgency: OVERDUE, CRITICAL, URGENT, UPCOMING, SAFE
  const urgencyWeight: Record<DeadlineUrgency, number> = {
    CRITICAL: 1,
    URGENT: 2,
    OVERDUE: 3,
    UPCOMING: 4,
    SAFE: 5,
  };

  return results.sort((a, b) => {
    const weightDiff = urgencyWeight[a.urgency] - urgencyWeight[b.urgency];
    if (weightDiff !== 0) return weightDiff;
    return a.hoursRemaining - b.hoursRemaining;
  });
}
