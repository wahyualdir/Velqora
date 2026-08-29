import { ScheduleItem } from "@/types";
import { ApprovalLevel, ScheduleSnapshot } from "./types";
import { assertProposalFreshness } from "./staleness-engine";

export interface ApprovalEvaluationResult {
  allowed: boolean;
  approvalLevel: ApprovalLevel;
  reason: string;
}

/**
 * Gatekeeper enforcing the strict safety hierarchy before any schedule mutation.
 */
export function evaluateApprovalGate(
  action: "READ_RECOMMENDATION" | "MOVE_STUDY_SESSION" | "MODIFY_LECTURE" | "APPLY_OPTIMIZATION" | "ROLLBACK",
  payload: {
    userId: string;
    parentSnapshotHash?: string;
    affectedItems?: ScheduleItem[];
    isCriticalRegression?: boolean;
  },
  currentSnapshot: ScheduleSnapshot
): ApprovalEvaluationResult {
  // 1. User Isolation & Security Check
  if (payload.userId !== currentSnapshot.userId) {
    return {
      allowed: false,
      approvalLevel: "BLOCKED",
      reason: "Akses ditolak: User ID tidak sesuai dengan pemilik jadwal.",
    };
  }

  // 2. Critical Regression Check
  if (payload.isCriticalRegression) {
    return {
      allowed: false,
      approvalLevel: "BLOCKED",
      reason: "Tindakan diblokir: Usulan menyebabkan penurunan keselamatan akademik (Critical Regression).",
    };
  }

  // 3. Freshness & Optimistic Concurrency Check for Mutations
  if (
    payload.parentSnapshotHash &&
    (action === "APPLY_OPTIMIZATION" || action === "MOVE_STUDY_SESSION")
  ) {
    const freshness = assertProposalFreshness(
      payload.parentSnapshotHash,
      currentSnapshot.snapshotHash
    );
    if (!freshness.canApply) {
      return {
        allowed: false,
        approvalLevel: "BLOCKED",
        reason: freshness.reason || "Kondisi jadwal di database telah kedaluwarsa.",
      };
    }
  }

  // 4. Categorize Approval Level
  switch (action) {
    case "READ_RECOMMENDATION":
      return {
        allowed: true,
        approvalLevel: "SAFE_AUTOMATIC",
        reason: "Operasi pembacaan rekomendasi aman dan tidak mengubah jadwal.",
      };

    case "MOVE_STUDY_SESSION":
    case "APPLY_OPTIMIZATION":
    case "ROLLBACK":
      return {
        allowed: true,
        approvalLevel: "USER_CONFIRMATION",
        reason: "Operasi memindahkan sesi belajar mandiri dan memerlukan konfirmasi pengguna.",
      };

    case "MODIFY_LECTURE":
      return {
        allowed: true,
        approvalLevel: "EXPLICIT_CONFIRMATION",
        reason: "Operasi mengubah data mata kuliah resmi dan membutuhkan konfirmasi eksplisit dari pengguna.",
      };

    default:
      return {
        allowed: false,
        approvalLevel: "BLOCKED",
        reason: "Tindakan tidak dikenali.",
      };
  }
}
