import { ScheduleDay, ScheduleItem } from "@/types";

// ==========================================
// 1. OUTCOME STATUSES & BASIC TYPES
// ==========================================

export type OutcomeStatus =
  | "PLANNED"
  | "STARTED"
  | "COMPLETED"
  | "PARTIALLY_COMPLETED"
  | "SKIPPED"
  | "RESCHEDULED"
  | "CANCELLED";

export type SkipReason =
  | "KULIAH_BERUBAH"
  | "TERLALU_PADAT"
  | "TIDAK_SEMPAT"
  | "PREFERENSI_BERUBAH"
  | "KELELAHAN"
  | "LAINNYA";

export type RescheduleReason =
  | "BENTROK_MENDADAK"
  | "DEADLINE_MAJU"
  | "WAKTU_LEBIH_LUANG"
  | "PERMINTAAN_PENGGUNA"
  | "LAINNYA";

export interface SessionOutcome {
  id: string;
  userId: string;
  scheduleItemId: string;
  sessionTitle: string;
  day: ScheduleDay;
  plannedDate?: string;
  plannedStartTime: string; // e.g. "14:00"
  plannedEndTime: string;   // e.g. "15:30"
  plannedDurationMinutes: number; // e.g. 90
  actualStartTime?: string | null;  // e.g. "14:20" or null if missing
  actualEndTime?: string | null;    // e.g. "15:10" or null if missing
  actualDurationMinutes?: number | null; // e.g. 50 or null if missing
  status: OutcomeStatus;
  skipReason?: SkipReason | null;
  rescheduleReason?: RescheduleReason | null;
  notes?: string | null;
  recordedAt: string;
}

// ==========================================
// 2. ACTUAL VS PLANNED TYPES
// ==========================================

export interface ActualVsPlannedItem {
  sessionId: string;
  title: string;
  day: ScheduleDay;
  plannedTime: string;
  actualTime: string; // e.g. "14:20 - 15:10" or "UNKNOWN"
  plannedDuration: number;
  actualDuration: number | "UNKNOWN";
  durationVarianceMinutes: number | "UNKNOWN";
  startVarianceMinutes: number | "UNKNOWN";
  completionRatioPercent: number | "UNKNOWN";
  status: OutcomeStatus;
  isPunctual: boolean | "UNKNOWN";
}

export interface ActualVsPlannedReport {
  userId: string;
  totalPlannedSessions: number;
  completedSessionsCount: number;
  partiallyCompletedCount: number;
  skippedSessionsCount: number;
  rescheduledSessionsCount: number;
  averageCompletionRatioPercent: number | "UNKNOWN";
  averagePunctualityScore: number | "UNKNOWN";
  scheduleAdherenceIndex: number | "UNKNOWN"; // 0 - 100
  items: ActualVsPlannedItem[];
  summary: string;
}

// ==========================================
// 3. BEHAVIOR SIGNALS 2.0 TYPES
// ==========================================

export type TimePatternType =
  | "MORNING"    // 06:00 - 11:00
  | "AFTERNOON"  // 11:00 - 15:00
  | "EVENING"    // 15:00 - 18:30
  | "NIGHT"      // 18:30 - 23:00
  | "MIXED"
  | "UNKNOWN";

export type SessionCompletionPatternType =
  | "HIGH"     // >= 80% completion
  | "MEDIUM"   // 50% - 79% completion
  | "LOW"      // < 50% completion
  | "UNKNOWN";

export interface BehaviorSignal2 {
  userId: string;
  observedTimePattern: TimePatternType;
  completionPattern: SessionCompletionPatternType;
  preferredEffectiveDurationMinutes: number;
  mostConsistentDays: ScheduleDay[];
  rescheduleFrequency: number;
  skipFrequency: number;
  adherenceIndex: number;
  isSufficientData: boolean;
  evaluatedSessionsCount: number;
  lastEvaluatedAt: string;
}

// ==========================================
// 4. PERSONALIZATION FEEDBACK LOOP TYPES
// ==========================================

export interface PersonalizationFeedbackPrompt {
  hasDivergence: boolean;
  declaredWindow: string;
  observedWindow: string;
  dominantCompletionPercentage: number;
  title: string;
  description: string;
  options: {
    action: "PRESERVE_DECLARED" | "ADAPT_TO_OBSERVED" | "DISMISS";
    label: string;
    explanation: string;
  }[];
}

// ==========================================
// 5. RECOMMENDATION CALIBRATION TYPES
// ==========================================

export interface RecommendationOutcomeRecord {
  recommendationId: string;
  userId: string;
  proposalTitle: string;
  wasAccepted: boolean;
  wasExecuted: boolean;
  affectedSessionsOutcomes: OutcomeStatus[];
  conflictsOccurred: number;
  outcomeScore: number; // 0 - 100
  recordedAt: string;
}

export interface RecommendationCalibrationMultiplier {
  recommendationType: string;
  historicalSuccessRate: number; // 0.0 - 1.0
  rankingMultiplier: number;     // 0.7 - 1.3
  sampleCount: number;
}

// ==========================================
// 6. HEALTH TREND TYPES
// ==========================================

export type HealthTrendDirection =
  | "IMPROVING"
  | "STABLE"
  | "DECLINING"
  | "INSUFFICIENT_DATA";

export interface HealthTrendReport {
  currentScore: number;
  previousScore: number | null;
  scoreDelta: number;
  trend: HealthTrendDirection;
  historicalSnapshotsCount: number;
  statusLabel: string;
  explanation: string;
}

// ==========================================
// 7. EARLY WARNING 2.0 PATTERN TYPES
// ==========================================

export type PatternWarningCategory =
  | "REPEATED_SKIPPING"
  | "REPEATED_RESCHEDULING"
  | "DEADLINE_COVERAGE_DECLINE"
  | "WORKLOAD_ACCUMULATION"
  | "RECOMMENDATION_REJECTION_PATTERN";

export interface EarlyWarning2Item {
  id: string;
  category: PatternWarningCategory;
  severity: "INFO" | "WARNING" | "CRITICAL";
  title: string;
  evidence: string[];
  explanation: string;
  suggestedAction: string;
  detectedAt: string;
}

// ==========================================
// 8. 3-WAY WHAT-IF OUTCOME SIMULATOR TYPES
// ==========================================

export interface ScenarioMetrics {
  scenarioName: "SCENARIO_A_CURRENT" | "SCENARIO_B_PROPOSED" | "SCENARIO_C_RECOVERY";
  title: string;
  conflictsCount: number;
  totalWorkloadMinutes: number;
  overloadedDaysCount: number;
  deadlineCoverageRate: number;
  freeTimeHours: number;
  healthScore: number;
  realismScore: number;
  riskLevel: "RENDAH" | "SEDANG" | "TINGGI" | "KRITIS";
}

export interface ThreeWayWhatIfResult {
  simulationId: string;
  scenarioA: ScenarioMetrics;
  scenarioB: ScenarioMetrics;
  scenarioC: ScenarioMetrics;
  bestScenario: "SCENARIO_A_CURRENT" | "SCENARIO_B_PROPOSED" | "SCENARIO_C_RECOVERY";
  tradeOffSummary: string;
  isSafeToApply: boolean;
}

// ==========================================
// 9. 12-QUESTION EXPLAINABILITY TYPES
// ==========================================

export interface Explainability12Answers {
  q1_whyThisTime: string;
  q2_prioritizedDeadline: string;
  q3_consideredSchedules: string;
  q4_conflictStatus: string;
  q5_workloadAfter: string;
  q6_sessionDuration: string;
  q7_preferenceAlignment: string;
  q8_historicalBehaviorAlignment: string;
  q9_riskIfApplied: string;
  q10_alternatives: string[];
  q11_consequencesIfDeclined: string;
  q12_whyRankedNumberOne: string;
}

// ==========================================
// 10. OBSERVABILITY TYPES
// ==========================================

export interface ObservabilityLogPayload {
  correlationId: string;
  userIdHash: string;
  operation: string;
  durationMs: number;
  result: "SUCCESS" | "FAILURE" | "REJECTED" | "BLOCKED" | "STALE";
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  proposalId?: string;
  snapshotId?: string;
  details?: Record<string, any>;
}

// ==========================================
// 11. SIMULATION MODIFICATION TYPE
// ==========================================

export interface SimulationModification {
  action: "MOVE_ITEM" | "ADD_ITEM" | "DELETE_ITEM";
  itemId?: string;
  targetDay?: ScheduleDay;
  targetStartTime?: string;
  targetEndTime?: string;
  item?: ScheduleItem;
}


