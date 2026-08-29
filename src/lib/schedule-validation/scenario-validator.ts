import { ValidationScenario, ScenarioValidationResult, RecommendationValidationReport } from "./types";
import { validateScheduleInvariants } from "./schedule-invariant-validator";
import { validateRecommendation } from "./recommendation-validator";
import {
  generateScheduleSnapshot,
  calculateAcademicHealthScore,
  generateContinuousOptimizationProposal,
} from "../schedule-orchestration";
import { analyzeWorkload } from "../schedule-intelligence/workload-analyzer";
import { analyzeTaskDeadlines } from "../schedule-intelligence/deadline-analyzer";
import { analyzeDeadlineCoverage } from "../schedule-intelligence/deadline-coverage";
import { extractBehaviorSignals2 } from "../schedule-intelligence/behavior-signals";
import { generatePatternEarlyWarnings } from "../schedule-outcomes";
import {
  sanitizeSchedulePreferences,
  DEFAULT_SCHEDULE_PREFERENCE,
} from "../schedule-intelligence";

/**
 * Scenario Validator
 * Executes a validation scenario end-to-end through the schedule intelligence pipelines.
 */
export function validateScenario(scenario: ValidationScenario): ScenarioValidationResult {
  const startTime = Date.now();
  const errors: string[] = [];
  const findings: string[] = [];

  const userId = "scenario_validator_user";
  const userPreferences = sanitizeSchedulePreferences(scenario.preferences || DEFAULT_SCHEDULE_PREFERENCE);

  // 1. Snapshot and Baseline Calculations
  const snapshot = generateScheduleSnapshot(userId, scenario.initialSchedules, scenario.tasks, userPreferences);
  const health = calculateAcademicHealthScore(scenario.initialSchedules, scenario.tasks);
  const workload = analyzeWorkload(scenario.initialSchedules, scenario.tasks);
  const deadlines = analyzeTaskDeadlines(scenario.tasks);
  const deadlineCoverages = scenario.tasks.map((t) => analyzeDeadlineCoverage(t, scenario.initialSchedules));
  const behaviorSignals = extractBehaviorSignals2(userId, scenario.initialSchedules, scenario.outcomes || []);
  const earlyWarnings = generatePatternEarlyWarnings(
    scenario.initialSchedules,
    scenario.tasks,
    scenario.outcomes || [],
    scenario.recommendationHistory || []
  );

  // 2. Continuous Optimization Proposal
  const proposal = generateContinuousOptimizationProposal(
    userId,
    snapshot,
    scenario.tasks,
    scenario.outcomes || [],
    scenario.recommendationHistory || []
  );

  // 3. Evaluate Invariants
  const invariantChecks = validateScheduleInvariants(
    scenario.initialSchedules,
    userPreferences,
    userPreferences,
    [...scenario.initialSchedules]
  );

  // Check expected health score bounds if specified
  if (scenario.expectedOutcome.healthScoreMin !== undefined) {
    if (health.overallScore < scenario.expectedOutcome.healthScoreMin) {
      errors.push(
        `Health score ${health.overallScore} kurang dari batas minimal yang diharapkan (${scenario.expectedOutcome.healthScoreMin}).`
      );
    }
  }

  // Check expected urgency if specified
  if (scenario.expectedOutcome.expectedUrgency && deadlines.length > 0) {
    const hasUrgency = deadlines.some((d) => d.urgency === scenario.expectedOutcome.expectedUrgency);
    if (!hasUrgency) {
      findings.push(
        `Urgensi ${scenario.expectedOutcome.expectedUrgency} tidak terdeteksi pada tugas yang dianalisis.`
      );
    }
  }

  // 4. Recommendation Realism Validation
  const recommendationValidations: RecommendationValidationReport[] = [];
  for (const item of proposal.affectedSessions) {
    const recReport = validateRecommendation(
      {
        id: item.id,
        activity: item.title,
        day: item.toDay,
        startTime: item.toTime.split(" - ")[0] || "14:00",
        endTime: item.toTime.split(" - ")[1] || "15:30",
        durationMinutes: item.durationMinutes,
        priority: "sedang",
        reason: "Optimasi distribusi beban akademik",
        evidence: ["Jadwal bebas bentrok", "Menjaga batas aman beban harian"],
        conflictStatus: "VERIFIED_NO_CONFLICT",
        confidence: 0.9,
        explanation: {
          summary: "Pemindahan sesi untuk meratakan beban.",
          factors: ["Beban belajar", "Jeda waktu"],
          evidence: ["Slot tersedia"],
          constraintsApplied: ["Batas 360 menit"],
        },
      },
      scenario.initialSchedules,
      scenario.tasks,
      workload,
      snapshot.snapshotHash,
      scenario.expectedOutcome.expectStaleProposal ? "mutated_hash_xyz" : snapshot.snapshotHash
    );
    recommendationValidations.push(recReport);
  }

  // Determine overall pass
  const invariantsPassed = invariantChecks.every((c) => c.passed);
  const passed = invariantsPassed && errors.length === 0;

  const durationMs = Date.now() - startTime;

  return {
    scenarioId: scenario.id,
    scenarioTitle: scenario.title,
    category: scenario.category,
    passed,
    executionDurationMs: durationMs,
    invariants: invariantChecks,
    recommendationValidations,
    findings,
    errors,
  };
}
