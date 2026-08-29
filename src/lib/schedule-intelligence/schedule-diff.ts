import { ScheduleItem, ScheduleDay } from "@/types";
import {
  ScheduleDiffItem,
  ScheduleDiffResult,
  ScheduleDiffType,
} from "./types";

/**
 * Normalizes title string into a clean matching token
 */
export function normalizeTitleKey(title: string): string {
  return (title || "")
    .toLowerCase()
    .replace(/^(mk|mata\s*kuliah|praktikum|kuliah|kelas)\b/i, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Generates a stable identity key for a schedule event
 */
export function generateScheduleIdentityKey(
  item: {
    title: string;
    subject?: string;
    day: ScheduleDay | string;
    courseCode?: string;
  },
  occurrenceIndex: number = 0
): string {
  const normTitle = normalizeTitleKey(item.title);
  const normSubject = item.subject ? normalizeTitleKey(item.subject) : "";
  const code = item.courseCode ? item.courseCode.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const dayStr = (item.day || "senin").toLowerCase();

  const coreKey = code || normTitle || normSubject || "agenda";
  return `${coreKey}_${dayStr}_${occurrenceIndex}`;
}

/**
 * Compares two versions of schedules (existing vs incoming) and produces a granular diff report
 */
export function diffScheduleCollections(
  existingSchedules: ScheduleItem[] = [],
  incomingSchedules: Array<Partial<ScheduleItem> & { courseCode?: string }> = []
): ScheduleDiffResult {
  const diffItems: ScheduleDiffItem[] = [];
  const existingMatchedKeys = new Set<string>();

  // Count occurrences per day to handle multiple sessions of the same course
  const incomingOccurrences: Record<string, number> = {};
  const existingOccurrences: Record<string, number> = {};

  // Build map of existing items
  const existingMap = new Map<string, ScheduleItem>();
  for (const ex of existingSchedules) {
    const rawKey = `${normalizeTitleKey(ex.title)}_${(ex.day || "senin").toLowerCase()}`;
    const occ = existingOccurrences[rawKey] || 0;
    existingOccurrences[rawKey] = occ + 1;
    const idKey = generateScheduleIdentityKey(ex, occ);
    existingMap.set(idKey, ex);
  }

  // 1. Check all incoming items against existing
  for (const inc of incomingSchedules) {
    const title = inc.title || "";
    const day = (inc.day || "Senin") as ScheduleDay;
    const rawKey = `${normalizeTitleKey(title)}_${day.toLowerCase()}`;
    const occ = incomingOccurrences[rawKey] || 0;
    incomingOccurrences[rawKey] = occ + 1;

    const idKey = generateScheduleIdentityKey(
      { title, subject: inc.subject, day, courseCode: inc.courseCode },
      occ
    );

    const existingMatch = existingMap.get(idKey);

    if (!existingMatch) {
      // ADDED
      diffItems.push({
        identityKey: idKey,
        diffType: "ADDED",
        description: `Jadwal baru '${title}' pada hari ${day} (${inc.time || `${inc.start_time} - ${inc.end_time}`}).`,
        incomingItem: inc,
        changes: [
          { field: "title", previousValue: null, newValue: title },
          { field: "day", previousValue: null, newValue: day },
          { field: "time", previousValue: null, newValue: inc.time || `${inc.start_time} - ${inc.end_time}` },
        ],
        selectedAction: "ADD",
      });
    } else {
      existingMatchedKeys.add(idKey);

      // Check field changes
      const changes: Array<{ field: string; previousValue: any; newValue: any }> = [];

      const incStart = inc.start_time || (inc.time ? inc.time.split("-")[0]?.trim() : "");
      const incEnd = inc.end_time || (inc.time ? inc.time.split("-")[1]?.trim() : "");
      const exStart = existingMatch.start_time || (existingMatch.time ? existingMatch.time.split("-")[0]?.trim() : "");
      const exEnd = existingMatch.end_time || (existingMatch.time ? existingMatch.time.split("-")[1]?.trim() : "");

      const timeChanged = (incStart && exStart && incStart !== exStart) || (incEnd && exEnd && incEnd !== exEnd);
      if (timeChanged) {
        changes.push({
          field: "time",
          previousValue: existingMatch.time || `${exStart} - ${exEnd}`,
          newValue: inc.time || `${incStart} - ${incEnd}`,
        });
      }

      const roomChanged = inc.location && existingMatch.location && inc.location.trim() !== existingMatch.location.trim();
      if (roomChanged) {
        changes.push({
          field: "location",
          previousValue: existingMatch.location,
          newValue: inc.location,
        });
      }

      const lecturerChanged = inc.lecturer && existingMatch.lecturer && inc.lecturer.trim() !== existingMatch.lecturer.trim();
      if (lecturerChanged) {
        changes.push({
          field: "lecturer",
          previousValue: existingMatch.lecturer,
          newValue: inc.lecturer,
        });
      }

      let diffType: ScheduleDiffType = "UNCHANGED";
      let desc = `Jadwal '${title}' identik tanpa perubahan.`;

      if (timeChanged) {
        diffType = "TIME_CHANGED";
        desc = `Jam kuliah '${title}' berubah dari ${existingMatch.time || `${exStart}-${exEnd}`} menjadi ${inc.time || `${incStart}-${incEnd}`}.`;
      } else if (roomChanged) {
        diffType = "ROOM_CHANGED";
        desc = `Ruangan '${title}' berpindah dari '${existingMatch.location}' ke '${inc.location}'.`;
      } else if (lecturerChanged) {
        diffType = "LECTURER_CHANGED";
        desc = `Dosen pengampu '${title}' diperbarui menjadi '${inc.lecturer}'.`;
      }

      diffItems.push({
        identityKey: idKey,
        diffType,
        description: desc,
        previousItem: existingMatch,
        incomingItem: inc,
        changes,
        selectedAction: diffType === "UNCHANGED" ? "KEEP_OLD" : "UPDATE",
      });
    }
  }

  // 2. Identify REMOVED items (in existing but not in incoming)
  for (const [idKey, ex] of existingMap.entries()) {
    if (!existingMatchedKeys.has(idKey)) {
      diffItems.push({
        identityKey: idKey,
        diffType: "REMOVED",
        description: `Jadwal lama '${ex.title}' (${ex.day} ${ex.time || `${ex.start_time}-${ex.end_time}`}) tidak ditemukan pada dokumen baru.`,
        previousItem: ex,
        changes: [{ field: "status", previousValue: "active", newValue: "removed" }],
        selectedAction: "KEEP_OLD",
      });
    }
  }

  const added = diffItems.filter((i) => i.diffType === "ADDED");
  const changed = diffItems.filter(
    (i) =>
      i.diffType === "TIME_CHANGED" ||
      i.diffType === "ROOM_CHANGED" ||
      i.diffType === "LECTURER_CHANGED" ||
      i.diffType === "DATE_CHANGED" ||
      i.diffType === "TITLE_CHANGED"
  );
  const unchanged = diffItems.filter((i) => i.diffType === "UNCHANGED");
  const removed = diffItems.filter((i) => i.diffType === "REMOVED");

  const summary = `Perbandingan jadwal: ${added.length} baru, ${changed.length} berubah, ${unchanged.length} tetap, ${removed.length} tidak ditemukan.`;

  return {
    totalIncoming: incomingSchedules.length,
    totalExisting: existingSchedules.length,
    addedCount: added.length,
    removedCount: removed.length,
    changedCount: changed.length,
    unchangedCount: unchanged.length,
    items: diffItems,
    categorized: {
      added,
      changed,
      unchanged,
      removed,
    },
    summary,
  };
}
