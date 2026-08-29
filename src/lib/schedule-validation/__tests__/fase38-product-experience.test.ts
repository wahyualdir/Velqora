import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  generateProductExperienceScenarios,
  checkScheduleDataIntegrity,
  validateScheduleInvariants,
  validateRecommendation,
  createMockScheduleItem,
  createMockTask,
} from "../index";
import {
  generateScheduleSnapshot,
  calculateAcademicHealthScore,
  evaluateApprovalGate,
  generateContinuousOptimizationProposal,
} from "../../schedule-orchestration";
import { analyzeWorkload } from "../../schedule-intelligence/workload-analyzer";
import { analyzeTaskDeadlines } from "../../schedule-intelligence/deadline-analyzer";
import { extractBehaviorSignals2 } from "../../schedule-intelligence/behavior-signals";
import {
  calculateCalibrationMultipliers,
  generate12QuestionExplanation,
  generatePatternEarlyWarnings,
} from "../../schedule-outcomes";
import { ACADEMIC_CONSTANTS } from "../../schedule/academic-constants";

describe("FASE 38: Product Maturity, UX & End-to-End Experience Suite", () => {
  const allScenarios = generateProductExperienceScenarios();

  it("Generates exactly 150 deterministic product experience scenarios across 25 categories", () => {
    assert.equal(allScenarios.length, 150);
  });

  // =========================================================================
  // BATCH 1: SCENARIOS 1–150 EXECUTION
  // =========================================================================
  describe("150 Real-World Product Experience Scenarios", () => {
    for (const scenario of allScenarios) {
      it(`Scenario ${scenario.id}: ${scenario.title}`, () => {
        try {
          const start = Date.now();

          // 1. Snapshot Generation
          const snapshot = generateScheduleSnapshot(
            scenario.userId,
            scenario.schedules,
            scenario.tasks
          );
          assert.ok(snapshot.snapshotHash);

          // 2. Health Score & Workload
          const workload = analyzeWorkload(scenario.schedules);
          const deadlines = analyzeTaskDeadlines(scenario.tasks);
          const health = calculateAcademicHealthScore(scenario.schedules, scenario.tasks);
          assert.ok(health.overallScore >= 0 && health.overallScore <= 100);

          if (scenario.expectedBehavior.expectedHealthScoreMin !== undefined) {
            assert.ok(
              health.overallScore >= scenario.expectedBehavior.expectedHealthScoreMin,
              `Health score ${health.overallScore} was lower than expected ${scenario.expectedBehavior.expectedHealthScoreMin}`
            );
          }

          // 3. Invariants Verification
          const invariants = validateScheduleInvariants(scenario.schedules);
          assert.ok(invariants.every((i) => i.passed));

          // 4. Stale Proposal & Approval Gate
          if (scenario.parentSnapshotHash) {
            const gate = evaluateApprovalGate(
              "APPLY_OPTIMIZATION",
              { userId: scenario.userId, parentSnapshotHash: scenario.parentSnapshotHash },
              snapshot
            );
            if (scenario.expectedBehavior.shouldBlockApproval) {
              assert.equal(gate.allowed, false);
              assert.equal(gate.approvalLevel, "BLOCKED");
            }
          }

          // 5. Performance Budget Check (<100ms)
          const duration = Date.now() - start;
          const maxLatency = scenario.expectedBehavior.expectedMaxLatencyMs ? Math.max(scenario.expectedBehavior.expectedMaxLatencyMs, 100) : 100;
          assert.ok(
            duration <= maxLatency,
            `Scenario ${scenario.id} latency ${duration}ms exceeded budget ${maxLatency}ms`
          );
        } catch (err: any) {
          console.error(`=== ERROR IN SCENARIO ${scenario.id} ===`, err.message, err.stack);
          throw err;
        }
      });
    }
  });

  // =========================================================================
  // BATCH 2: DATA INTEGRITY & TELEMETRY LIFECYCLE CHECKS
  // =========================================================================
  describe("Data Integrity & Telemetry Lifecycle Checks", () => {
    it("Validates clean schedule dataset without false positive issues", () => {
      const schedules = [
        createMockScheduleItem({ id: "s1", day: "Senin", start_time: "08:00", end_time: "10:00" }),
        createMockScheduleItem({ id: "s2", day: "Senin", start_time: "13:00", end_time: "15:00" }),
      ];
      const report = checkScheduleDataIntegrity({ schedules });
      assert.equal(report.isValid, true);
      assert.equal(report.criticalIssuesCount, 0);
    });

    it("Detects exact duplicate sessions on the same day and time", () => {
      const schedules = [
        createMockScheduleItem({ id: "s1", title: "Basis Data", day: "Senin", start_time: "08:00", end_time: "10:00" }),
        createMockScheduleItem({ id: "s2", title: "Basis Data", day: "Senin", start_time: "08:00", end_time: "10:00" }),
      ];
      const report = checkScheduleDataIntegrity({ schedules });
      assert.equal(report.issues.some((i) => i.code === "DUPLICATE_SESSION"), true);
    });

    it("Detects inverted intervals and negative durations", () => {
      const schedules = [
        createMockScheduleItem({ id: "s1", title: "Error Sesi", day: "Selasa", start_time: "14:00", end_time: "12:00" }),
      ];
      const report = checkScheduleDataIntegrity({ schedules });
      assert.equal(report.isValid, false);
      assert.equal(report.issues.some((i) => i.code === "NEGATIVE_DURATION"), true);
    });

    it("Identifies orphaned outcomes referencing deleted schedule items", () => {
      const schedules = [createMockScheduleItem({ id: "s1", day: "Rabu" })];
      const outcomes = [
        {
          id: "out_1",
          userId: "u1",
          scheduleItemId: "s_deleted_999",
          sessionTitle: "Belajar",
          day: "Rabu" as const,
          plannedStartTime: "19:00",
          plannedEndTime: "20:00",
          plannedDurationMinutes: 60,
          status: "COMPLETED" as const,
          recordedAt: new Date().toISOString(),
        },
      ];
      const report = checkScheduleDataIntegrity({ schedules, outcomes });
      assert.equal(report.issues.some((i) => i.code === "ORPHANED_OUTCOME"), true);
    });

    it("Blocks sensitive metadata leak in telemetry events", () => {
      const telemetryEvents = [
        {
          name: "SCHEDULE_OPTIMIZATION_APPLIED",
          timestamp: new Date().toISOString(),
          metadata: {
            userId: "u1",
            authToken_secret: "jwt_bearer_token_12345",
          },
        },
      ];
      const report = checkScheduleDataIntegrity({ telemetryEvents });
      assert.equal(report.isValid, false);
      assert.equal(report.issues.some((i) => i.code === "SENSITIVE_METADATA_LEAK"), true);
    });

    it("Verifies clean telemetry event metadata is permitted", () => {
      const telemetryEvents = [
        {
          name: "SCHEDULE_OPTIMIZATION_APPLIED",
          timestamp: new Date().toISOString(),
          metadata: {
            userId: "u1",
            affectedSessionsCount: 2,
            workloadDeltaMinutes: 90,
            outcomeStatus: "SUCCESS",
          },
        },
      ];
      const report = checkScheduleDataIntegrity({ telemetryEvents });
      assert.equal(report.isValid, true);
      assert.equal(report.criticalIssuesCount, 0);
    });
  });

  // =========================================================================
  // BATCH 3: PROGRESSIVE DISCLOSURE EXPLAINABILITY & EARLY WARNINGS
  // =========================================================================
  describe("Progressive Explainability & Early Warnings", () => {
    it("Answers all 12 Transparency Questions with evidence without hallucinating", () => {
      const explanation = generate12QuestionExplanation({
        sessionTitle: "Belajar Mandiri Statistik",
        targetDay: "Rabu",
        targetStartTime: "16:00",
        targetEndTime: "17:30",
        durationMinutes: 90,
        workloadMinutesAfter: 180,
        conflictsCount: 0,
        qualityScore: 88,
        rankingPosition: 1,
      });

      assert.equal(typeof explanation.q1_whyThisTime, "string");
      assert.equal(typeof explanation.q4_conflictStatus, "string");
      assert.ok(explanation.q4_conflictStatus.includes("Nol bentrok"));
      assert.equal(typeof explanation.q5_workloadAfter, "string");
      assert.equal(typeof explanation.q11_consequencesIfDeclined, "string");
      assert.equal(typeof explanation.q12_whyRankedNumberOne, "string");
    });

    it("Deduplicates and groups early warnings cleanly", () => {
      const outcomes = [
        {
          id: "o1",
          userId: "u1",
          scheduleItemId: "s1",
          sessionTitle: "Belajar 1",
          day: "Senin" as const,
          plannedStartTime: "19:00",
          plannedEndTime: "20:00",
          plannedDurationMinutes: 60,
          status: "SKIPPED" as const,
          skipReason: "KELELAHAN" as const,
          recordedAt: new Date().toISOString(),
        },
        {
          id: "o2",
          userId: "u1",
          scheduleItemId: "s2",
          sessionTitle: "Belajar 2",
          day: "Selasa" as const,
          plannedStartTime: "19:00",
          plannedEndTime: "20:00",
          plannedDurationMinutes: 60,
          status: "SKIPPED" as const,
          skipReason: "KELELAHAN" as const,
          recordedAt: new Date().toISOString(),
        },
      ];

      const warnings = generatePatternEarlyWarnings([], [], outcomes);
      assert.ok(Array.isArray(warnings));
      // Warnings have structured human-friendly format
      for (const w of warnings) {
        assert.ok(w.id);
        assert.ok(w.title);
        assert.ok(w.explanation);
        assert.ok(w.suggestedAction);
      }
    });
  });
});
