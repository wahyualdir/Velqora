import { ScheduleItem } from "@/types";
import { OptimizationProposal, ProposalStatus, ScheduleSnapshot } from "./types";
import { assertProposalFreshness } from "./staleness-engine";

export interface ProposalVersionRecord {
  proposalId: string;
  version: number;
  parentSnapshotHash: string;
  status: ProposalStatus;
  createdAt: string;
  appliedAt?: string;
  rollbackAvailable: boolean;
}

/**
 * Applies an optimization proposal to current schedules while preserving rollback backup.
 * Validates freshness and prevents concurrent stale overrides.
 */
export function applyProposalWithRollback(
  proposal: OptimizationProposal,
  currentSnapshot: ScheduleSnapshot
): {
  success: boolean;
  updatedSchedules: ScheduleItem[];
  updatedProposal: OptimizationProposal;
  error?: string;
} {
  // Concurrency and freshness verification
  const freshness = assertProposalFreshness(
    proposal.parentSnapshotHash,
    currentSnapshot.snapshotHash
  );

  if (!freshness.canApply) {
    return {
      success: false,
      updatedSchedules: [],
      updatedProposal: { ...proposal, status: "EXPIRED" },
      error: freshness.reason,
    };
  }

  const currentSchedules = [
    ...currentSnapshot.courses,
    ...currentSnapshot.studySessions,
  ];

  // Apply affected session updates
  const updatedSchedules: ScheduleItem[] = currentSchedules.map((s) => {
    const change = proposal.affectedSessions.find((aff) => aff.id === s.id);
    if (change) {
      return {
        ...s,
        day: change.toDay,
        start_time: change.toTime.split(" - ")[0],
        end_time: change.toTime.split(" - ")[1],
        time: change.toTime,
      };
    }
    return { ...s };
  });

  const updatedProposal: OptimizationProposal = {
    ...proposal,
    status: "APPLIED",
    appliedAt: new Date().toISOString(),
    rollbackAvailable: true,
    previousSchedulesBackup: currentSchedules,
  };

  return {
    success: true,
    updatedSchedules,
    updatedProposal,
  };
}

/**
 * Rolls back an applied optimization proposal restoring the previous schedule state.
 */
export function rollbackAppliedProposal(
  proposal: OptimizationProposal,
  currentSnapshot: ScheduleSnapshot
): {
  success: boolean;
  restoredSchedules: ScheduleItem[];
  updatedProposal: OptimizationProposal;
  error?: string;
} {
  if (proposal.status !== "APPLIED" || !proposal.previousSchedulesBackup) {
    return {
      success: false,
      restoredSchedules: [],
      updatedProposal: proposal,
      error: "Usulan ini tidak berada dalam status APPLIED atau data pencadangan tidak ditemukan.",
    };
  }

  const restoredSchedules = [...proposal.previousSchedulesBackup];

  const updatedProposal: OptimizationProposal = {
    ...proposal,
    status: "ROLLED_BACK",
    rollbackAvailable: false,
  };

  return {
    success: true,
    restoredSchedules,
    updatedProposal,
  };
}
