import { ScheduleItem, Task } from "@/types";
import { SessionOutcome } from "../schedule-outcomes/types";
import { ScheduleSnapshot } from "../schedule-orchestration/types";

export interface DataIntegrityIssue {
  code:
    | "DUPLICATE_SESSION"
    | "INVALID_TIME_INTERVAL"
    | "NEGATIVE_DURATION"
    | "ORPHANED_OUTCOME"
    | "STALE_PROPOSAL_HASH"
    | "SENSITIVE_METADATA_LEAK"
    | "BROKEN_LIFECYCLE_SEQUENCE";
  severity: "CRITICAL" | "WARNING" | "INFO";
  entityId: string;
  description: string;
}

export interface DataIntegrityReport {
  isValid: boolean;
  totalIssuesCount: number;
  criticalIssuesCount: number;
  issues: DataIntegrityIssue[];
  checkedEntities: {
    schedulesCount: number;
    tasksCount: number;
    outcomesCount: number;
    telemetryEventsCount: number;
  };
}

function parseTimeToMinutes(timeStr?: string | null): number {
  if (!timeStr || !timeStr.includes(":")) return -1;
  const [h, m] = timeStr.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return -1;
  return h * 60 + m;
}

const SENSITIVE_KEY_PATTERNS = [
  "password",
  "token",
  "secret",
  "authorization",
  "bearer",
  "cookie",
  "apikey",
  "api_key",
  "private_key",
];

/**
 * Data Integrity Checker (FASE 38)
 * Pure, read-only diagnostic utility that checks consistency, orphans, timestamp validity,
 * and security sanitization across schedule datasets.
 */
export function checkScheduleDataIntegrity(params: {
  schedules?: ScheduleItem[];
  tasks?: Task[];
  outcomes?: SessionOutcome[];
  telemetryEvents?: Array<{ name: string; metadata?: Record<string, any>; timestamp: string }>;
  currentSnapshot?: ScheduleSnapshot;
  parentSnapshotHash?: string;
}): DataIntegrityReport {
  const issues: DataIntegrityIssue[] = [];
  const schedules = params.schedules || [];
  const tasks = params.tasks || [];
  const outcomes = params.outcomes || [];
  const telemetryEvents = params.telemetryEvents || [];

  // 1. Check Schedule Duplicates & Intervals
  const seenTimeSlots = new Map<string, string>(); // "day-start-end" -> id

  for (const s of schedules) {
    const startM = parseTimeToMinutes(s.start_time);
    const endM = parseTimeToMinutes(s.end_time);

    // Interval validity
    if (startM < 0 || endM < 0) {
      issues.push({
        code: "INVALID_TIME_INTERVAL",
        severity: "CRITICAL",
        entityId: s.id,
        description: `Format waktu tidak valid pada sesi "${s.title}" (${s.start_time} - ${s.end_time}).`,
      });
    } else if (startM >= endM) {
      issues.push({
        code: "NEGATIVE_DURATION",
        severity: "CRITICAL",
        entityId: s.id,
        description: `Durasi nol atau terbalik pada sesi "${s.title}" (${s.start_time} >= ${s.end_time}).`,
      });
    }

    // Exact duplicate slot on the same day
    if (s.day && s.start_time && s.end_time) {
      const slotKey = `${s.day}_${s.start_time}_${s.end_time}_${(s.title || "").toLowerCase().trim()}`;
      if (seenTimeSlots.has(slotKey)) {
        issues.push({
          code: "DUPLICATE_SESSION",
          severity: "WARNING",
          entityId: s.id,
          description: `Duplikasi sesi terdeteksi dengan id ${seenTimeSlots.get(slotKey)} pada slot ${s.day} ${s.start_time}–${s.end_time}.`,
        });
      } else {
        seenTimeSlots.set(slotKey, s.id);
      }
    }
  }

  // 2. Check Orphaned Outcomes
  const scheduleIds = new Set(schedules.map((s) => s.id));
  for (const o of outcomes) {
    if (o.scheduleItemId && !scheduleIds.has(o.scheduleItemId)) {
      issues.push({
        code: "ORPHANED_OUTCOME",
        severity: "WARNING",
        entityId: o.id,
        description: `Outcome mereferensikan schedule item id "${o.scheduleItemId}" yang tidak ditemukan pada dataset aktif.`,
      });
    }
  }

  // 3. Stale Proposal Snapshot Hash Check
  if (params.parentSnapshotHash && params.currentSnapshot) {
    if (params.parentSnapshotHash !== params.currentSnapshot.snapshotHash) {
      issues.push({
        code: "STALE_PROPOSAL_HASH",
        severity: "CRITICAL",
        entityId: params.currentSnapshot.snapshotHash,
        description: `Parent snapshot hash "${params.parentSnapshotHash}" tidak cocok dengan hash aktif "${params.currentSnapshot.snapshotHash}". Proposal telah kedaluwarsa.`,
      });
    }
  }

  // 4. Telemetry Sanitization & Lifecycle Checks
  for (const evt of telemetryEvents) {
    if (evt.metadata && typeof evt.metadata === "object") {
      for (const key of Object.keys(evt.metadata)) {
        const lowerKey = key.toLowerCase();
        if (SENSITIVE_KEY_PATTERNS.some((pattern) => lowerKey.includes(pattern))) {
          issues.push({
            code: "SENSITIVE_METADATA_LEAK",
            severity: "CRITICAL",
            entityId: evt.name,
            description: `Metadata telemetri mengandung kunci sensitif terlarang: "${key}".`,
          });
        }
      }
    }
  }

  const criticalCount = issues.filter((i) => i.severity === "CRITICAL").length;

  return {
    isValid: criticalCount === 0,
    totalIssuesCount: issues.length,
    criticalIssuesCount: criticalCount,
    issues,
    checkedEntities: {
      schedulesCount: schedules.length,
      tasksCount: tasks.length,
      outcomesCount: outcomes.length,
      telemetryEventsCount: telemetryEvents.length,
    },
  };
}
