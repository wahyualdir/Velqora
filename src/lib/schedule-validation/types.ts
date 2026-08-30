import { ScheduleItem, Task } from "@/types";
import { UserSchedulePreference } from "../schedule-intelligence/types";
import { SessionOutcome, RecommendationOutcomeRecord } from "../schedule-outcomes/types";

// =========================================================================
// 1. SCENARIO DEFINITIONS & CATEGORIES
// =========================================================================

export type ScenarioCategory =
  | "NORMAL_ACADEMIC_WEEK"
  | "HIGH_WORKLOAD"
  | "DEADLINE_PRESSURE"
  | "MISSED_SESSION"
  | "SCHEDULE_CHANGE"
  | "EXTREME_BUT_VALID"
  | "DATA_QUALITY"
  | "CONCURRENCY"
  | "USER_BEHAVIOR"
  | "LONG_TERM_ADAPTATION"
  | "PERFORMANCE_INVARIANTS"
  | "REGRESSION_PROTECTION";

export interface ValidationScenario {
  id: string;
  category: ScenarioCategory;
  title: string;
  description: string;
  initialSchedules: ScheduleItem[];
  tasks: Task[];
  preferences?: Partial<UserSchedulePreference>;
  outcomes?: SessionOutcome[];
  recommendationHistory?: RecommendationOutcomeRecord[];
  mutationsToApply?: Array<{
    action: "MOVE" | "ADD" | "DELETE" | "MUTATE_COURSE" | "UPDATE_PREFERENCE" | "RECORD_OUTCOME";
    payload: any;
  }>;
  expectedOutcome: {
    shouldHaveConflict: boolean;
    maxDailyWorkloadMinutes?: number;
    healthScoreMin?: number;
    healthScoreMax?: number;
    proposalAllowed?: boolean;
    recommendationCountMin?: number;
    expectedUrgency?: string;
    expectStaleProposal?: boolean;
    expectSufficientData?: boolean;
  };
}

// =========================================================================
// 2. INVARIANT & PIPELINE VALIDATION TYPES
// =========================================================================

export type InvariantCheckName =
  | "ZERO_UNRESOLVED_CONFLICT"
  | "TOUCHING_INTERVAL_INTEGRITY"
  | "SESSION_DURATION_SAFETY"
  | "DAILY_WORKLOAD_HARD_CAP"
  | "BREAK_BUFFER_ADEQUACY"
  | "TARGET_STUDY_FLEXIBILITY"
  | "IMMUTABLE_PREFERENCES"
  | "SNAPSHOT_HASH_VALIDITY"
  | "SIDE_EFFECT_FREE_SIMULATION"
  | "DETERMINISTIC_EXPLAINABILITY"
  | "NO_PSYCHOLOGICAL_PROFILING"
  | "MULTI_TENANT_ISOLATION";

export interface InvariantValidationCheck {
  name: InvariantCheckName;
  passed: boolean;
  score: number; // 0 - 100
  evidence: string;
  violationDetails?: string;
}

export type RecommendationValidationVerdict = "APPROVED" | "BLOCKED" | "ADJUSTMENT_REQUIRED";

export interface RecommendationValidationReport {
  recommendationId: string;
  verdict: RecommendationValidationVerdict;
  checks: {
    conflictCheckPassed: boolean;
    deadlineCoverageMaintained: boolean;
    dailyWorkloadWithinCap: boolean;
    breakBufferSufficient: boolean;
    realismScoreAcceptable: boolean;
    evidenceSupported: boolean;
    explainabilityComplete: boolean;
    approvalGatePassed: boolean;
  };
  blockReasons: string[];
  passedChecksCount: number;
  totalChecksCount: number;
  validatedAt: string;
}

// =========================================================================
// 3. MASTER SCENARIO VALIDATION RESULT & SUMMARY
// =========================================================================

export interface ScenarioValidationResult {
  scenarioId: string;
  scenarioTitle: string;
  category: ScenarioCategory;
  passed: boolean;
  executionDurationMs: number;
  invariants: InvariantValidationCheck[];
  recommendationValidations: RecommendationValidationReport[];
  findings: string[];
  errors: string[];
}

export interface MultiWeekSimulationResult {
  userId: string;
  totalWeeksSimulated: number;
  weeklyHealthScores: number[];
  calibrationMultipliers: Record<string, number>;
  runawayAdaptationDetected: boolean;
  averageExecutionDurationMs: number;
  summary: string;
}

export interface ValidationMasterReport {
  totalScenariosEvaluated: number;
  totalPassed: number;
  totalFailed: number;
  passRatePercentage: number;
  categoryBreakdown: Record<
    ScenarioCategory,
    { total: number; passed: number; failed: number; averageDurationMs: number }
  >;
  invariantsIntegrityRate: number; // Percentage of 100% invariant compliance
  blockedUnsafeRecommendationsCount: number;
  totalExecutionTimeMs: number;
  isProductionReady: boolean;
  generatedAt: string;
}
