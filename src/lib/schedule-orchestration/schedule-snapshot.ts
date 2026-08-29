import { ScheduleItem, Task, ScheduleDay } from "@/types";
import { UserSchedulePreference } from "../schedule-intelligence/types";
import { sanitizeSchedulePreferences } from "../schedule-intelligence/personal-profile";
import { analyzeWorkload, calculateItemDurationMinutes } from "../schedule-intelligence/workload-analyzer";
import { detectAllScheduleConflicts } from "../schedule-import/conflict-engine";
import { analyzeTaskDeadlines } from "../schedule-intelligence/deadline-analyzer";
import { ScheduleSnapshot, SnapshotDiff, SnapshotDiffCategory } from "./types";
import crypto from "crypto";

/**
 * Checks if a schedule item is a self-study / task session rather than a fixed lecture
 */
export function isStudySession(item: ScheduleItem): boolean {
  const typeStr = ((item.type as string) || "").toLowerCase();
  const titleStr = (item.title || "").toLowerCase();
  return (
    typeStr === "reminder" ||
    typeStr === "tugas" ||
    typeStr === "belajar" ||
    typeStr === "study" ||
    titleStr.includes("belajar") ||
    titleStr.includes("tugas") ||
    titleStr.includes("mandiri")
  );
}

/**
 * Computes a deterministic SHA-256 hash from canonical representation
 */
export function computeStableSnapshotHash(data: {
  userId: string;
  courses: ScheduleItem[];
  studySessions: ScheduleItem[];
  tasks: Task[];
  preferences: UserSchedulePreference;
}): string {
  // Sort courses canonically
  const canonicalCourses = [...data.courses]
    .map((c) => ({
      id: c.id,
      title: (c.title || "").trim().toLowerCase(),
      day: c.day,
      start: c.start_time,
      end: c.end_time,
      room: ((c as any).room || c.location || "").trim().toLowerCase(),
    }))
    .sort((a, b) => (a.id || "").localeCompare(b.id || ""));

  // Sort study sessions canonically
  const canonicalStudy = [...data.studySessions]
    .map((s) => ({
      id: s.id,
      title: (s.title || "").trim().toLowerCase(),
      day: s.day,
      start: s.start_time,
      end: s.end_time,
      completed: (s as any).status === "selesai" || !!(s as any).is_completed,
    }))
    .sort((a, b) => (a.id || "").localeCompare(b.id || ""));

  // Sort tasks canonically
  const canonicalTasks = [...data.tasks]
    .map((t) => ({
      id: t.id,
      title: (t.title || "").trim().toLowerCase(),
      dueDate: t.deadline || (t as any).due_date || "",
      priority: t.priority,
      completed: t.status === "selesai" || !!(t as any).is_completed,
    }))
    .sort((a, b) => (a.id || "").localeCompare(b.id || ""));

  const canonicalPreferences = data.preferences
    ? Object.keys(data.preferences)
        .sort()
        .reduce((obj: any, key: string) => {
          obj[key] = (data.preferences as any)[key];
          return obj;
        }, {})
    : {};

  const payload = JSON.stringify({
    userId: data.userId,
    courses: canonicalCourses,
    study: canonicalStudy,
    tasks: canonicalTasks,
    preferences: canonicalPreferences,
  });

  return crypto.createHash("sha256").update(payload).digest("hex").slice(0, 32);
}

/**
 * Builds a comprehensive point-in-time schedule snapshot
 */
export function generateScheduleSnapshot(
  userId: string,
  schedules: ScheduleItem[],
  tasks: Task[] = [],
  rawPreferences?: Partial<UserSchedulePreference>,
  version = 1
): ScheduleSnapshot {
  const preferences = sanitizeSchedulePreferences(rawPreferences);
  const courses = schedules.filter((s) => !isStudySession(s));
  const studySessions = schedules.filter((s) => isStudySession(s));

  const totalWeeklyMinutes = schedules.reduce(
    (acc, s) => acc + calculateItemDurationMinutes(s),
    0
  );

  const workload = analyzeWorkload(schedules);
  const conflicts = detectAllScheduleConflicts(schedules as any).filter(
    (s) => s.hasConflict
  );
  const deadlines = analyzeTaskDeadlines(tasks);
  const urgentDeadlines = deadlines.filter(
    (d) => d.urgency === "CRITICAL" || d.urgency === "URGENT"
  );

  const missedSessions = studySessions.filter((s) => !s.is_completed);

  const snapshotHash = computeStableSnapshotHash({
    userId,
    courses,
    studySessions,
    tasks,
    preferences,
  });

  return {
    snapshotId: `snap_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    version,
    generatedAt: new Date().toISOString(),
    snapshotHash,
    coursesCount: courses.length,
    studySessionsCount: studySessions.length,
    assignmentsCount: tasks.length,
    deadlinesCount: deadlines.length,
    urgentDeadlinesCount: urgentDeadlines.length,
    totalWeeklyMinutes,
    overloadedDaysCount: workload.overloadedDaysCount,
    conflictsCount: conflicts.length,
    missedSessionsCount: missedSessions.length,
    courses,
    studySessions,
    tasks,
    userPreferences: preferences,
  };
}

/**
 * Compares two snapshots and categorizes state differences
 */
export function diffScheduleSnapshots(
  prev: ScheduleSnapshot,
  current: ScheduleSnapshot
): SnapshotDiff {
  if (prev.snapshotHash === current.snapshotHash) {
    return {
      category: "NO_CHANGE",
      previousHash: prev.snapshotHash,
      currentHash: current.snapshotHash,
      changes: [],
      isStale: false,
      summary: "Tidak ada perubahan pada kondisi jadwal.",
    };
  }

  const changes: string[] = [];

  if (current.conflictsCount > prev.conflictsCount) {
    changes.push(
      `Terjadi penambahan ${current.conflictsCount - prev.conflictsCount} bentrok jadwal baru.`
    );
  } else if (current.conflictsCount < prev.conflictsCount) {
    changes.push(
      `${prev.conflictsCount - current.conflictsCount} bentrok jadwal telah teratasi.`
    );
  }

  if (current.coursesCount !== prev.coursesCount) {
    changes.push(
      `Jumlah mata kuliah berubah dari ${prev.coursesCount} menjadi ${current.coursesCount}.`
    );
  }

  if (current.studySessionsCount !== prev.studySessionsCount) {
    changes.push(
      `Jumlah sesi belajar mandiri berubah dari ${prev.studySessionsCount} menjadi ${current.studySessionsCount}.`
    );
  }

  if (current.urgentDeadlinesCount !== prev.urgentDeadlinesCount) {
    changes.push(
      `Tugas mendesak berubah dari ${prev.urgentDeadlinesCount} menjadi ${current.urgentDeadlinesCount}.`
    );
  }

  if (current.overloadedDaysCount !== prev.overloadedDaysCount) {
    changes.push(
      `Hari berbeban lebih (overload) berubah dari ${prev.overloadedDaysCount} menjadi ${current.overloadedDaysCount}.`
    );
  }

  if (current.missedSessionsCount !== prev.missedSessionsCount) {
    changes.push(
      `Sesi belajar aktif yang belum selesai berubah dari ${prev.missedSessionsCount} menjadi ${current.missedSessionsCount}.`
    );
  }

  // Determine dominant category
  let category: SnapshotDiffCategory = "SCHEDULE_CHANGED";
  if (current.conflictsCount > prev.conflictsCount) {
    category = "CONFLICT_INTRODUCED";
  } else if (current.conflictsCount < prev.conflictsCount) {
    category = "CONFLICT_RESOLVED";
  } else if (current.urgentDeadlinesCount !== prev.urgentDeadlinesCount) {
    category = "DEADLINE_CHANGED";
  } else if (current.overloadedDaysCount !== prev.overloadedDaysCount) {
    category = "WORKLOAD_CHANGED";
  } else if (
    JSON.stringify(prev.userPreferences) !== JSON.stringify(current.userPreferences)
  ) {
    category = "USER_PREFERENCE_CHANGED";
    changes.push("Preferensi waktu atau gaya perencanaan belajar diperbarui.");
  }

  return {
    category,
    previousHash: prev.snapshotHash,
    currentHash: current.snapshotHash,
    changes,
    isStale: true,
    summary:
      changes.length > 0
        ? changes.join(" ")
        : "Terjadi pembaruan data akademik pada kalender.",
  };
}
