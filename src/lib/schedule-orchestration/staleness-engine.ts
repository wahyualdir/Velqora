import { ScheduleSnapshot, StalenessReport, ValidityStatus } from "./types";
import { diffScheduleSnapshots } from "./schedule-snapshot";

/**
 * Evaluates whether a previously generated proposal / recommendation
 * is still fresh, requires revalidation, or has become stale/invalidated.
 */
export function evaluateContextStaleness(
  basedOnSnapshot: ScheduleSnapshot,
  currentSnapshot: ScheduleSnapshot,
  recommendationId?: string
): StalenessReport {
  // Exact match -> FRESH
  if (basedOnSnapshot.snapshotHash === currentSnapshot.snapshotHash) {
    return {
      validityStatus: "FRESH",
      basedOnSnapshotHash: basedOnSnapshot.snapshotHash,
      currentSnapshotHash: currentSnapshot.snapshotHash,
      invalidationReasons: [],
      recommendationId,
      isActionable: true,
    };
  }

  const diff = diffScheduleSnapshots(basedOnSnapshot, currentSnapshot);
  const invalidationReasons: string[] = [...diff.changes];

  let status: ValidityStatus = "STALE";

  // Critical conditions that completely INVALIDATE the proposal
  if (currentSnapshot.conflictsCount > basedOnSnapshot.conflictsCount) {
    status = "INVALIDATED";
    invalidationReasons.push(
      "Kondisi kalender saat ini memiliki bentrok jadwal baru sehingga usulan lama tidak dapat diterapkan."
    );
  } else if (
    currentSnapshot.coursesCount !== basedOnSnapshot.coursesCount ||
    diff.category === "SCHEDULE_CHANGED"
  ) {
    status = "STALE";
    invalidationReasons.push(
      "Mata kuliah atau waktu perkuliahan telah bergeser setelah usulan ini dibuat."
    );
  } else if (
    diff.category === "USER_PREFERENCE_CHANGED" ||
    diff.category === "DEADLINE_CHANGED"
  ) {
    status = "REVALIDATION_REQUIRED";
    invalidationReasons.push(
      "Preferensi belajar atau tenggat waktu tugas telah berubah, usulan perlu disinkronkan kembali."
    );
  }

  const isActionable = (status as string) === "FRESH";

  return {
    validityStatus: status,
    basedOnSnapshotHash: basedOnSnapshot.snapshotHash,
    currentSnapshotHash: currentSnapshot.snapshotHash,
    invalidationReasons: Array.from(new Set(invalidationReasons)),
    recommendationId,
    isActionable,
  };
}

/**
 * Checks if a proposal can safely proceed to atomic apply
 */
export function assertProposalFreshness(
  parentSnapshotHash: string,
  currentSnapshotHash: string
): { canApply: boolean; reason?: string } {
  if (parentSnapshotHash !== currentSnapshotHash) {
    return {
      canApply: false,
      reason:
        "Usulan telah kedaluwarsa (STALE) karena kondisi jadwal di database telah berubah sejak usulan dibuat. Silakan muat ulang usulan terbaru.",
    };
  }
  return { canApply: true };
}
