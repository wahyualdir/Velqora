import { ScheduleItem, Task, ScheduleDay } from "@/types";
import { UserSchedulePreference, WorkloadLevel } from "../schedule-intelligence/types";

// ==========================================
// 1. SCHEDULE SNAPSHOT & DIFF TYPES
// ==========================================

export interface ScheduleSnapshot {
  snapshotId: string;
  userId: string;
  version: number;
  generatedAt: string;
  snapshotHash: string;
  coursesCount: number;
  studySessionsCount: number;
  assignmentsCount: number;
  deadlinesCount: number;
  urgentDeadlinesCount: number;
  totalWeeklyMinutes: number;
  overloadedDaysCount: number;
  conflictsCount: number;
  missedSessionsCount: number;
  courses: ScheduleItem[];
  studySessions: ScheduleItem[];
  tasks: Task[];
  userPreferences: UserSchedulePreference;
}

export type SnapshotDiffCategory =
  | "NO_CHANGE"
  | "SCHEDULE_CHANGED"
  | "DEADLINE_CHANGED"
  | "WORKLOAD_CHANGED"
  | "USER_PREFERENCE_CHANGED"
  | "SESSION_MISSED"
  | "CONFLICT_INTRODUCED"
  | "CONFLICT_RESOLVED"
  | "CONTEXT_STALE";

export interface SnapshotDiff {
  category: SnapshotDiffCategory;
  previousHash: string;
  currentHash: string;
  changes: string[];
  isStale: boolean;
  summary: string;
}

// ==========================================
// 2. CONTEXT STALENESS TYPES
// ==========================================

export type ValidityStatus =
  | "FRESH"
  | "REVALIDATION_REQUIRED"
  | "STALE"
  | "INVALIDATED";

export interface StalenessReport {
  validityStatus: ValidityStatus;
  basedOnSnapshotHash: string;
  currentSnapshotHash: string;
  invalidationReasons: string[];
  recommendationId?: string;
  isActionable: boolean;
}

// ==========================================
// 3. REGRESSION DETECTION TYPES
// ==========================================

export type RegressionSeverity =
  | "IMPROVEMENT"
  | "NEUTRAL"
  | "REGRESSION"
  | "CRITICAL_REGRESSION";

export interface TradeOffItem {
  factor: string;
  before: string;
  after: string;
  impact: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
}

export interface RegressionAnalysis {
  severity: RegressionSeverity;
  scoreDelta: number;
  isAcceptable: boolean;
  reasons: string[];
  tradeOffs: TradeOffItem[];
}

// ==========================================
// 4. APPROVAL GATE & PROPOSAL VERSIONING
// ==========================================

export type ApprovalLevel =
  | "SAFE_AUTOMATIC"
  | "USER_CONFIRMATION"
  | "EXPLICIT_CONFIRMATION"
  | "BLOCKED";

export type ProposalStatus =
  | "DRAFT"
  | "READY_FOR_REVIEW"
  | "APPROVED"
  | "APPLIED"
  | "REJECTED"
  | "EXPIRED"
  | "ROLLED_BACK";

export interface AffectedSessionItem {
  id: string;
  title: string;
  fromDay: ScheduleDay;
  fromTime: string;
  toDay: ScheduleDay;
  toTime: string;
  durationMinutes: number;
}

export interface OptimizationProposal {
  proposalId: string;
  userId: string;
  parentSnapshotHash: string;
  currentStateScore: number;
  proposedStateScore: number;
  improvementScore: number;
  affectedSessions: AffectedSessionItem[];
  affectedAssignments: string[];
  conflictsIntroduced: number;
  conflictsResolved: number;
  workloadBefore: Record<ScheduleDay, number>;
  workloadAfter: Record<ScheduleDay, number>;
  deadlineCoverageBefore: number;
  deadlineCoverageAfter: number;
  explanation: string;
  risks: string[];
  alternatives: string[];
  approvalLevel: ApprovalLevel;
  status: ProposalStatus;
  createdAt: string;
  appliedAt?: string;
  rollbackAvailable: boolean;
  previousSchedulesBackup?: ScheduleItem[];
}

// ==========================================
// 5. WHAT-IF SIMULATION TYPES
// ==========================================

export interface SimulationModification {
  action: "MOVE_ITEM" | "ADD_ITEM" | "DELETE_ITEM";
  itemId?: string;
  item?: ScheduleItem;
  targetDay?: ScheduleDay;
  targetStartTime?: string;
  targetEndTime?: string;
}

export interface SimulationChange {
  description: string;
  impactType: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
}

export interface WhatIfSimulationResult {
  simulationId: string;
  originalHash: string;
  simulatedHash: string;
  conflictsBefore: number;
  conflictsAfter: number;
  workloadBeforeTotalMinutes: number;
  workloadAfterTotalMinutes: number;
  deadlineRiskBefore: string;
  deadlineRiskAfter: string;
  freeTimeBeforeHours: number;
  freeTimeAfterHours: number;
  isSafe: boolean;
  changes: SimulationChange[];
  summary: string;
}

// ==========================================
// 6. ACADEMIC HEALTH SCORE TYPES
// ==========================================

export type HealthCategory =
  | "HEALTHY"
  | "STABLE"
  | "ATTENTION"
  | "HIGH_RISK"
  | "CRITICAL";

export interface HealthFactor {
  name: string;
  score: number;
  maxScore: number;
  status: "BAIK" | "CUKUP" | "PERLU_PERHATIAN";
  note: string;
}

export interface AcademicHealthScore {
  overallScore: number;
  category: HealthCategory;
  factors: HealthFactor[];
  summary: string;
}

// ==========================================
// 7. EARLY WARNING TYPES
// ==========================================

export type WarningSeverity = "INFO" | "WARNING" | "CRITICAL";

export type EarlyWarningType =
  | "DEADLINE_APPROACHING"
  | "WORKLOAD_ACCUMULATION"
  | "REPEATED_MISSED_SESSIONS"
  | "CONSECUTIVE_OVERLOAD"
  | "INSUFFICIENT_RECOVERY"
  | "RAPID_SCHEDULE_CHANGE"
  | "DECLINING_COVERAGE"
  | "STALE_RECOMMENDATIONS";

export interface EarlyWarningItem {
  warningId: string;
  type: EarlyWarningType;
  severity: WarningSeverity;
  title: string;
  evidence: string[];
  explanation: string;
  suggestedAction: string;
}
