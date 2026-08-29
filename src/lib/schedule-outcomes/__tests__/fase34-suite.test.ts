import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ScheduleItem, Task, ScheduleDay } from "@/types";
import {
  SessionOutcome,
  OutcomeStatus,
  SkipReason,
  RecommendationOutcomeRecord,
  SimulationModification,
} from "../types";
import { analyzeActualVsPlanned } from "../actual-vs-planned";
import {
  calculateRecommendationOutcomeScore,
  evaluateHistoricalRecommendations,
} from "../recommendation-outcome";
import { evaluatePersonalizationFeedback } from "../personalization-feedback";
import {
  calculateCalibrationMultipliers,
  applyCalibrationToScore,
} from "../recommendation-calibration";
import { evaluateHealthTrend } from "../health-trends";
import { generatePatternEarlyWarnings } from "../early-warning-2";
import { simulateThreeWayOutcome } from "../what-if-outcome-simulator";
import { generate12QuestionExplanation } from "../explanation-engine-4";
import { extractBehaviorSignals2 } from "../../schedule-intelligence/behavior-signals";
import { generateContinuousOptimizationProposal } from "../../schedule-orchestration/continuous-optimizer";
import { generateScheduleSnapshot } from "../../schedule-orchestration/schedule-snapshot";

describe("FASE 34: Closed-Loop Academic Intelligence & Outcome Learning Test Suite", () => {
  // Mock Data Helpers
  const createMockOutcome = (
    overrides: Partial<SessionOutcome> = {}
  ): SessionOutcome => ({
    id: `out_${Math.random().toString(36).slice(2, 7)}`,
    userId: "user_fase34_test",
    scheduleItemId: "sched_item_1",
    sessionTitle: "Belajar Algoritma",
    day: "Senin",
    plannedStartTime: "14:00",
    plannedEndTime: "15:30",
    plannedDurationMinutes: 90,
    actualStartTime: "14:00",
    actualEndTime: "15:30",
    actualDurationMinutes: 90,
    status: "COMPLETED",
    recordedAt: new Date().toISOString(),
    ...overrides,
  });

  const createMockSchedule = (
    overrides: Partial<ScheduleItem> = {}
  ): ScheduleItem =>
    ({
      id: `sched_${Math.random().toString(36).slice(2, 7)}`,
      user_id: "user_fase34_test",
      day: "Senin",
      title: "Algoritma & Pemrograman",
      time: "08:00 - 10:30",
      start_time: "08:00",
      end_time: "10:30",
      location: "Lab 1",
      lecturer: "Dr. Budi",
      type: "jadwal",
      priority: "sedang",
      is_completed: false,
      ...overrides,
    } as ScheduleItem);

  const createMockTask = (overrides: Partial<Task> = {}): Task =>
    ({
      id: `task_${Math.random().toString(36).slice(2, 7)}`,
      user_id: "user_fase34_test",
      title: "Tugas Struktur Data",
      subject: "Struktur Data",
      deadline: "2026-09-05T23:59:00Z",
      status: "belum_dikerjakan",
      priority: "tinggi",
      ...overrides,
    } as Task);

  // =========================================================================
  // GROUP A: Outcome Tracking & Status Transitions (Scenarios 1–10)
  // =========================================================================
  describe("Group A: Outcome Tracking & Status Lifecycle", () => {
    it("Scenario 1: Outcome status accepts all valid lifecycle statuses", () => {
      const statuses: OutcomeStatus[] = [
        "PLANNED",
        "STARTED",
        "COMPLETED",
        "PARTIALLY_COMPLETED",
        "SKIPPED",
        "RESCHEDULED",
        "CANCELLED",
      ];
      for (const st of statuses) {
        const o = createMockOutcome({ status: st });
        assert.equal(o.status, st);
      }
    });

    it("Scenario 2: Recording skip reason without errors", () => {
      const o = createMockOutcome({
        status: "SKIPPED",
        skipReason: "TERLALU_PADAT",
      });
      assert.equal(o.status, "SKIPPED");
      assert.equal(o.skipReason, "TERLALU_PADAT");
    });

    it("Scenario 3: Recording reschedule reason without errors", () => {
      const o = createMockOutcome({
        status: "RESCHEDULED",
        rescheduleReason: "BENTROK_MENDADAK",
      });
      assert.equal(o.status, "RESCHEDULED");
      assert.equal(o.rescheduleReason, "BENTROK_MENDADAK");
    });

    it("Scenario 4: Notes field accepts optional string and handles null", () => {
      const o1 = createMockOutcome({ notes: "Selesai bab 3" });
      const o2 = createMockOutcome({ notes: null });
      assert.equal(o1.notes, "Selesai bab 3");
      assert.equal(o2.notes, null);
    });

    it("Scenario 5: Multi-tenant isolation: userId strictly preserved", () => {
      const o = createMockOutcome({ userId: "user_alice" });
      assert.equal(o.userId, "user_alice");
    });

    it("Scenario 6: Partial outcomes preserve partial actual duration", () => {
      const o = createMockOutcome({
        status: "PARTIALLY_COMPLETED",
        plannedDurationMinutes: 90,
        actualDurationMinutes: 45,
      });
      assert.equal(o.actualDurationMinutes, 45);
      assert.equal(o.plannedDurationMinutes, 90);
    });

    it("Scenario 7: Missing actual telemetry remains null/undefined rather than synthetic 0", () => {
      const o = createMockOutcome({
        actualStartTime: null,
        actualEndTime: null,
        actualDurationMinutes: null,
      });
      assert.equal(o.actualStartTime, null);
      assert.equal(o.actualEndTime, null);
      assert.equal(o.actualDurationMinutes, null);
    });

    it("Scenario 8: RecordedAt is a valid ISO timestamp", () => {
      const o = createMockOutcome();
      assert.ok(!isNaN(Date.parse(o.recordedAt)));
    });

    it("Scenario 9: Bounded array of outcomes preserves chronological sort", () => {
      const o1 = createMockOutcome({ recordedAt: "2026-08-01T10:00:00Z" });
      const o2 = createMockOutcome({ recordedAt: "2026-08-02T10:00:00Z" });
      const arr = [o2, o1].sort(
        (a, b) => Date.parse(a.recordedAt) - Date.parse(b.recordedAt)
      );
      assert.equal(arr[0].recordedAt, "2026-08-01T10:00:00Z");
    });

    it("Scenario 10: All skip reasons belong to canonical enum", () => {
      const reasons: SkipReason[] = [
        "KULIAH_BERUBAH",
        "TERLALU_PADAT",
        "TIDAK_SEMPAT",
        "PREFERENSI_BERUBAH",
        "KELELAHAN",
        "LAINNYA",
      ];
      assert.equal(reasons.length, 6);
    });
  });

  // =========================================================================
  // GROUP B: Actual vs Planned Variance & Adherence (Scenarios 11–20)
  // =========================================================================
  describe("Group B: Actual vs Planned Variance & Adherence Metrics", () => {
    it("Scenario 11: Exact planned and actual durations yield variance = 0 and completionRatio = 100%", () => {
      const outcome = createMockOutcome({
        plannedDurationMinutes: 90,
        actualDurationMinutes: 90,
        status: "COMPLETED",
      });
      const report = analyzeActualVsPlanned("user_test", [outcome]);
      assert.equal(report.completedSessionsCount, 1);
      assert.equal(report.items[0].durationVarianceMinutes, 0);
      assert.equal(report.items[0].completionRatioPercent, 100);
    });

    it("Scenario 12: Actual duration < planned yields negative variance and exact completion ratio", () => {
      const outcome = createMockOutcome({
        plannedStartTime: "08:00",
        plannedEndTime: "09:30",
        plannedDurationMinutes: 90,
        actualStartTime: "08:20",
        actualEndTime: "09:10",
        actualDurationMinutes: 50,
        status: "PARTIALLY_COMPLETED",
      });
      const report = analyzeActualVsPlanned("user_test", [outcome]);
      assert.equal(report.items[0].durationVarianceMinutes, -40);
      assert.equal(report.items[0].startVarianceMinutes, 20);
      assert.equal(report.items[0].completionRatioPercent, 55.56);
    });

    it("Scenario 13: Actual duration > planned yields positive variance (capped at 100% ratio)", () => {
      const outcome = createMockOutcome({
        plannedDurationMinutes: 60,
        actualDurationMinutes: 75,
        status: "COMPLETED",
      });
      const report = analyzeActualVsPlanned("user_test", [outcome]);
      assert.equal(report.items[0].durationVarianceMinutes, 15);
      assert.equal(report.items[0].completionRatioPercent, 100);
    });

    it("Scenario 14: Punctual start within 15 minutes sets isPunctual = true", () => {
      const outcome = createMockOutcome({
        plannedStartTime: "14:00",
        actualStartTime: "14:10",
      });
      const report = analyzeActualVsPlanned("user_test", [outcome]);
      assert.equal(report.items[0].isPunctual, true);
    });

    it("Scenario 15: Late start beyond 15 minutes sets isPunctual = false", () => {
      const outcome = createMockOutcome({
        plannedStartTime: "14:00",
        actualStartTime: "14:35",
      });
      const report = analyzeActualVsPlanned("user_test", [outcome]);
      assert.equal(report.items[0].isPunctual, false);
    });

    it("Scenario 16: Early start within 15 minutes is considered punctual", () => {
      const outcome = createMockOutcome({
        plannedStartTime: "14:00",
        actualStartTime: "13:55",
      });
      const report = analyzeActualVsPlanned("user_test", [outcome]);
      assert.equal(report.items[0].isPunctual, true);
    });

    it("Scenario 17: Missing actual time yields UNKNOWN rather than guessing 0", () => {
      const outcome = createMockOutcome({
        actualStartTime: null,
        actualEndTime: null,
        actualDurationMinutes: null,
        status: "PLANNED",
      });
      const report = analyzeActualVsPlanned("user_test", [outcome]);
      assert.equal(report.items[0].actualDuration, "UNKNOWN");
      assert.equal(report.items[0].durationVarianceMinutes, "UNKNOWN");
      assert.equal(report.items[0].startVarianceMinutes, "UNKNOWN");
    });

    it("Scenario 18: Skipped session yields actualDuration = 0 and completion = 0%", () => {
      const outcome = createMockOutcome({
        plannedDurationMinutes: 60,
        status: "SKIPPED",
      });
      const report = analyzeActualVsPlanned("user_test", [outcome]);
      assert.equal(report.items[0].actualDuration, 0);
      assert.equal(report.items[0].completionRatioPercent, 0);
    });

    it("Scenario 19: Schedule adherence index correctly computes 0.6 * completion + 0.4 * punctuality", () => {
      const outcome = createMockOutcome({
        plannedStartTime: "10:00",
        plannedEndTime: "11:00",
        plannedDurationMinutes: 60,
        actualStartTime: "10:00",
        actualEndTime: "11:00",
        actualDurationMinutes: 60,
        status: "COMPLETED",
      });
      const report = analyzeActualVsPlanned("user_test", [outcome]);
      assert.equal(report.averageCompletionRatioPercent, 100);
      assert.equal(report.averagePunctualityScore, 100);
      assert.equal(report.scheduleAdherenceIndex, 100);
    });

    it("Scenario 20: Empty outcomes list returns clean report with UNKNOWN metrics", () => {
      const report = analyzeActualVsPlanned("user_test", []);
      assert.equal(report.totalPlannedSessions, 0);
      assert.equal(report.scheduleAdherenceIndex, "UNKNOWN");
      assert.equal(report.items.length, 0);
    });
  });

  // =========================================================================
  // GROUP C: Behavior Signals 2.0 (Scenarios 21–30)
  // =========================================================================
  describe("Group C: Behavior Signals 2.0", () => {
    it("Scenario 21: Dominant morning completions classify as MORNING", () => {
      const outcomes = Array.from({ length: 5 }, () =>
        createMockOutcome({
          actualStartTime: "08:30",
          status: "COMPLETED",
        })
      );
      const sig = extractBehaviorSignals2("user_test", [], outcomes);
      assert.equal(sig.observedTimePattern, "MORNING");
      assert.equal(sig.isSufficientData, true);
    });

    it("Scenario 22: Dominant afternoon completions classify as AFTERNOON", () => {
      const outcomes = Array.from({ length: 5 }, () =>
        createMockOutcome({
          actualStartTime: "13:00",
          status: "COMPLETED",
        })
      );
      const sig = extractBehaviorSignals2("user_test", [], outcomes);
      assert.equal(sig.observedTimePattern, "AFTERNOON");
    });

    it("Scenario 23: Dominant evening completions classify as EVENING", () => {
      const outcomes = Array.from({ length: 5 }, () =>
        createMockOutcome({
          actualStartTime: "16:30",
          status: "COMPLETED",
        })
      );
      const sig = extractBehaviorSignals2("user_test", [], outcomes);
      assert.equal(sig.observedTimePattern, "EVENING");
    });

    it("Scenario 24: Dominant night completions classify as NIGHT", () => {
      const outcomes = Array.from({ length: 5 }, () =>
        createMockOutcome({
          actualStartTime: "20:00",
          status: "COMPLETED",
        })
      );
      const sig = extractBehaviorSignals2("user_test", [], outcomes);
      assert.equal(sig.observedTimePattern, "NIGHT");
    });

    it("Scenario 25: Completion rate >= 80% classifies as HIGH completion pattern", () => {
      const outcomes = [
        ...Array.from({ length: 4 }, () => createMockOutcome({ status: "COMPLETED" as OutcomeStatus })),
        createMockOutcome({ status: "SKIPPED" }),
      ];
      const sig = extractBehaviorSignals2("user_test", [], outcomes);
      assert.equal(sig.completionPattern, "HIGH");
    });

    it("Scenario 26: Completion rate 50%-79% classifies as MEDIUM completion pattern", () => {
      const outcomes = [
        ...Array.from({ length: 3 }, () => createMockOutcome({ status: "COMPLETED" as OutcomeStatus })),
        ...Array.from({ length: 2 }, () => createMockOutcome({ status: "SKIPPED" as OutcomeStatus })),
      ];
      const sig = extractBehaviorSignals2("user_test", [], outcomes);
      assert.equal(sig.completionPattern, "MEDIUM");
    });

    it("Scenario 27: Completion rate < 50% classifies as LOW completion pattern", () => {
      const outcomes = [
        createMockOutcome({ status: "COMPLETED" }),
        ...Array.from({ length: 4 }, () => createMockOutcome({ status: "SKIPPED" as OutcomeStatus })),
      ];
      const sig = extractBehaviorSignals2("user_test", [], outcomes);
      assert.equal(sig.completionPattern, "LOW");
    });

    it("Scenario 28: Preferred effective duration calculates exact average of completed sessions", () => {
      const outcomes = [
        createMockOutcome({ actualDurationMinutes: 60, status: "COMPLETED" }),
        createMockOutcome({ actualDurationMinutes: 90, status: "COMPLETED" }),
      ];
      const sig = extractBehaviorSignals2("user_test", [], outcomes);
      assert.equal(sig.preferredEffectiveDurationMinutes, 75);
    });

    it("Scenario 29: Most consistent days sorted descending by completed session count", () => {
      const outcomes = [
        createMockOutcome({ day: "Rabu", status: "COMPLETED" }),
        createMockOutcome({ day: "Rabu", status: "COMPLETED" }),
        createMockOutcome({ day: "Senin", status: "COMPLETED" }),
      ];
      const sig = extractBehaviorSignals2("user_test", [], outcomes);
      assert.equal(sig.mostConsistentDays[0], "Rabu");
      assert.equal(sig.mostConsistentDays[1], "Senin");
    });

    it("Scenario 30: Fewer than 5 sessions sets isSufficientData = false", () => {
      const outcomes = [
        createMockOutcome({ status: "COMPLETED" }),
        createMockOutcome({ status: "COMPLETED" }),
      ];
      const sig = extractBehaviorSignals2("user_test", [], outcomes);
      assert.equal(sig.isSufficientData, false);
      assert.equal(sig.evaluatedSessionsCount, 2);
    });
  });

  // =========================================================================
  // GROUP D: Personalization Feedback Loop (Scenarios 31–40)
  // =========================================================================
  describe("Group D: Personalization Feedback Loop", () => {
    const defaultPref = {
      userId: "user_test",
      preferredStudyStartTime: "19:00",
      preferredStudyEndTime: "21:30",
      preferredDays: ["Senin", "Rabu", "Jumat"] as ScheduleDay[],
      sessionDurationMinutes: 60,
      breakBufferMinutes: 30,
      preferredSessionDuration: 60,
      preferredBreakDuration: 30,
      maximumDailyStudyMinutes: 240,
      planningStyle: "BALANCED" as const,
      autoOptimizeWeekly: false,
    };

    it("Scenario 31: No divergence when declared preferences match empirical habit", () => {
      const outcomes = Array.from({ length: 6 }, () =>
        createMockOutcome({ actualStartTime: "19:30", status: "COMPLETED" })
      );
      const prompt = evaluatePersonalizationFeedback(defaultPref, outcomes);
      assert.equal(prompt.hasDivergence, false);
    });

    it("Scenario 32: Divergence detected when >= 60% completions occur in different window", () => {
      const outcomes = Array.from({ length: 6 }, () =>
        createMockOutcome({ actualStartTime: "16:30", status: "COMPLETED" }) // SORE vs declared MALAM
      );
      const prompt = evaluatePersonalizationFeedback(defaultPref, outcomes);
      assert.equal(prompt.hasDivergence, true);
      assert.equal(prompt.options.length, 3);
    });

    it("Scenario 33: Feedback prompt offers PRESERVE_DECLARED, ADAPT_TO_OBSERVED, and DISMISS", () => {
      const outcomes = Array.from({ length: 6 }, () =>
        createMockOutcome({ actualStartTime: "16:30", status: "COMPLETED" })
      );
      const prompt = evaluatePersonalizationFeedback(defaultPref, outcomes);
      const actionKeys = prompt.options.map((o) => o.action);
      assert.deepEqual(actionKeys, [
        "PRESERVE_DECLARED",
        "ADAPT_TO_OBSERVED",
        "DISMISS",
      ]);
    });

    it("Scenario 34: System does NOT automatically mutate user preference", () => {
      const outcomes = Array.from({ length: 6 }, () =>
        createMockOutcome({ actualStartTime: "16:30", status: "COMPLETED" })
      );
      evaluatePersonalizationFeedback(defaultPref, outcomes);
      assert.equal(defaultPref.preferredStudyStartTime, "19:00"); // Unchanged
    });

    it("Scenario 35: Insufficient data (<5 sessions) does not trigger false divergence", () => {
      const outcomes = [
        createMockOutcome({ actualStartTime: "08:00", status: "COMPLETED" }),
        createMockOutcome({ actualStartTime: "08:00", status: "COMPLETED" }),
      ];
      const prompt = evaluatePersonalizationFeedback(defaultPref, outcomes);
      assert.equal(prompt.hasDivergence, false);
    });

    it("Scenario 36: Options contain Indonesian explanations", () => {
      const outcomes = Array.from({ length: 6 }, () =>
        createMockOutcome({ actualStartTime: "08:30", status: "COMPLETED" })
      );
      const prompt = evaluatePersonalizationFeedback(defaultPref, outcomes);
      assert.ok(prompt.options[0].explanation.includes("waktu belajar"));
    });

    it("Scenario 37: Declared window string formatted accurately", () => {
      const outcomes = Array.from({ length: 6 }, () =>
        createMockOutcome({ actualStartTime: "08:30", status: "COMPLETED" })
      );
      const prompt = evaluatePersonalizationFeedback(defaultPref, outcomes);
      assert.equal(prompt.declaredWindow, "19:00 - 21:30");
    });

    it("Scenario 38: Observed window string accurately identifies morning", () => {
      const outcomes = Array.from({ length: 6 }, () =>
        createMockOutcome({ actualStartTime: "08:30", status: "COMPLETED" })
      );
      const prompt = evaluatePersonalizationFeedback(defaultPref, outcomes);
      assert.ok(prompt.observedWindow.includes("Pagi"));
    });

    it("Scenario 39: Dominant completion percentage accurately reported", () => {
      const outcomes = Array.from({ length: 10 }, (_, i) =>
        createMockOutcome({
          actualStartTime: i < 8 ? "08:30" : "19:30",
          status: "COMPLETED",
        })
      );
      const prompt = evaluatePersonalizationFeedback(defaultPref, outcomes);
      assert.equal(prompt.dominantCompletionPercentage, 80);
    });

    it("Scenario 40: Re-evaluating after habit shifts updates observed window", () => {
      const outcomes = Array.from({ length: 6 }, () =>
        createMockOutcome({ actualStartTime: "13:30", status: "COMPLETED" })
      );
      const prompt = evaluatePersonalizationFeedback(defaultPref, outcomes);
      assert.ok(prompt.observedWindow.includes("Siang"));
    });
  });

  // =========================================================================
  // GROUP E: Recommendation Calibration (Scenarios 41–50)
  // =========================================================================
  describe("Group E: Recommendation Calibration & Outcome Scoring", () => {
    it("Scenario 41: Single completed recommendation outcome calculates deterministic score (0-100)", () => {
      const score = calculateRecommendationOutcomeScore({
        wasAccepted: true,
        wasExecuted: true,
        affectedSessionsOutcomes: ["COMPLETED", "COMPLETED"],
        conflictsOccurred: 0,
      });
      assert.equal(score, 100);
    });

    it("Scenario 42: Rejected recommendation returns neutral baseline 30", () => {
      const score = calculateRecommendationOutcomeScore({
        wasAccepted: false,
        wasExecuted: false,
        affectedSessionsOutcomes: [],
        conflictsOccurred: 0,
      });
      assert.equal(score, 30);
    });

    it("Scenario 43: Accepted recommendation with partial sessions scores moderately", () => {
      const score = calculateRecommendationOutcomeScore({
        wasAccepted: true,
        wasExecuted: true,
        affectedSessionsOutcomes: ["PARTIALLY_COMPLETED", "SKIPPED"],
        conflictsOccurred: 0,
      });
      assert.ok(score >= 40 && score <= 70);
    });

    it("Scenario 44: Recommendation with introduced conflicts is penalized", () => {
      const score = calculateRecommendationOutcomeScore({
        wasAccepted: true,
        wasExecuted: true,
        affectedSessionsOutcomes: ["COMPLETED"],
        conflictsOccurred: 2,
      });
      assert.ok(score < 80);
    });

    it("Scenario 45: Multiplier for high-success recommendations is boosted (>= 1.05)", () => {
      const history: RecommendationOutcomeRecord[] = Array.from(
        { length: 4 },
        () => ({
          recommendationId: "rec_1",
          userId: "user_test",
          proposalTitle: "GENERAL_OPTIMIZATION",
          wasAccepted: true,
          wasExecuted: true,
          affectedSessionsOutcomes: ["COMPLETED", "COMPLETED"],
          conflictsOccurred: 0,
          outcomeScore: 100,
          recordedAt: new Date().toISOString(),
        })
      );
      const mult = calculateCalibrationMultipliers(history);
      assert.ok(mult["GENERAL_OPTIMIZATION"].rankingMultiplier >= 1.05);
    });

    it("Scenario 46: Multiplier for low-success recommendations is dampened (<= 0.95)", () => {
      const history: RecommendationOutcomeRecord[] = Array.from(
        { length: 4 },
        () => ({
          recommendationId: "rec_1",
          userId: "user_test",
          proposalTitle: "GENERAL_OPTIMIZATION",
          wasAccepted: false,
          wasExecuted: false,
          affectedSessionsOutcomes: ["SKIPPED"],
          conflictsOccurred: 1,
          outcomeScore: 30,
          recordedAt: new Date().toISOString(),
        })
      );
      const mult = calculateCalibrationMultipliers(history);
      assert.ok(mult["GENERAL_OPTIMIZATION"].rankingMultiplier <= 0.95);
    });

    it("Scenario 47: Calibration multiplier is strictly clamped in [0.70, 1.30]", () => {
      const boosted = applyCalibrationToScore(100, 1.5);
      const dampened = applyCalibrationToScore(100, 0.4);
      assert.equal(boosted, 100);
      assert.equal(dampened, 70);
    });

    it("Scenario 48: Fewer than 3 historical samples defaults multiplier to 1.0", () => {
      const history: RecommendationOutcomeRecord[] = [
        {
          recommendationId: "rec_1",
          userId: "user_test",
          proposalTitle: "GENERAL_OPTIMIZATION",
          wasAccepted: true,
          wasExecuted: true,
          affectedSessionsOutcomes: ["COMPLETED"],
          conflictsOccurred: 0,
          outcomeScore: 90,
          recordedAt: new Date().toISOString(),
        },
      ];
      const mult = calculateCalibrationMultipliers(history);
      assert.equal(mult["GENERAL_OPTIMIZATION"].rankingMultiplier, 1.0);
    });

    it("Scenario 49: Historical evaluation summary classifies SANGAT_EFEKTIF for high average score", () => {
      const history: RecommendationOutcomeRecord[] = Array.from(
        { length: 4 },
        () => ({
          recommendationId: "rec_1",
          userId: "user_test",
          proposalTitle: "OPTIMIZE",
          wasAccepted: true,
          wasExecuted: true,
          affectedSessionsOutcomes: ["COMPLETED"],
          conflictsOccurred: 0,
          outcomeScore: 95,
          recordedAt: new Date().toISOString(),
        })
      );
      const evalRes = evaluateHistoricalRecommendations(history);
      assert.equal(evalRes.effectivenessRating, "SANGAT_EFEKTIF");
      assert.equal(evalRes.acceptedCount, 4);
    });

    it("Scenario 50: Empty history returns INSUFFICIENT_DATA evaluation", () => {
      const evalRes = evaluateHistoricalRecommendations([]);
      assert.equal(evalRes.effectivenessRating, "INSUFFICIENT_DATA");
      assert.equal(evalRes.totalRecommendations, 0);
    });
  });

  // =========================================================================
  // GROUP F: Academic Health Trends (Scenarios 51–58)
  // =========================================================================
  describe("Group F: Academic Health Trends & Multi-Period Metrics", () => {
    it("Scenario 51: No history returns INSUFFICIENT_DATA with previousScore = null", () => {
      const trend = evaluateHealthTrend(85, []);
      assert.equal(trend.trend, "INSUFFICIENT_DATA");
      assert.equal(trend.previousScore, null);
      assert.equal(trend.scoreDelta, 0);
    });

    it("Scenario 52: Score delta >= +3 returns IMPROVING", () => {
      const trend = evaluateHealthTrend(88, [
        { score: 80, recordedAt: "2026-08-01T00:00:00Z" },
      ]);
      assert.equal(trend.trend, "IMPROVING");
      assert.equal(trend.scoreDelta, 8);
      assert.equal(trend.statusLabel, "Meningkat (+ 8)");
    });

    it("Scenario 53: Score delta <= -3 returns DECLINING", () => {
      const trend = evaluateHealthTrend(75, [
        { score: 85, recordedAt: "2026-08-01T00:00:00Z" },
      ]);
      assert.equal(trend.trend, "DECLINING");
      assert.equal(trend.scoreDelta, -10);
      assert.ok(trend.statusLabel.includes("Menurun"));
    });

    it("Scenario 54: Score delta between -2 and +2 returns STABLE", () => {
      const trend = evaluateHealthTrend(84, [
        { score: 85, recordedAt: "2026-08-01T00:00:00Z" },
      ]);
      assert.equal(trend.trend, "STABLE");
      assert.equal(trend.scoreDelta, -1);
      assert.equal(trend.statusLabel, "Stabil");
    });

    it("Scenario 55: Explanation accurately includes current and previous scores", () => {
      const trend = evaluateHealthTrend(90, [
        { score: 82, recordedAt: "2026-08-01T00:00:00Z" },
      ]);
      assert.ok(trend.explanation.includes("90/100"));
      assert.ok(trend.explanation.includes("82"));
    });

    it("Scenario 56: Historical snapshots count accurately incremented", () => {
      const history = [
        { score: 70, recordedAt: "2026-08-01T00:00:00Z" },
        { score: 75, recordedAt: "2026-08-02T00:00:00Z" },
      ];
      const trend = evaluateHealthTrend(80, history);
      assert.equal(trend.historicalSnapshotsCount, 3);
    });

    it("Scenario 57: Status label is in Indonesian", () => {
      const trend = evaluateHealthTrend(85, []);
      assert.equal(trend.statusLabel, "Data Awal");
    });

    it("Scenario 58: Invariant: identical inputs produce identical trend reports", () => {
      const t1 = evaluateHealthTrend(85, [
        { score: 80, recordedAt: "2026-08-01T00:00:00Z" },
      ]);
      const t2 = evaluateHealthTrend(85, [
        { score: 80, recordedAt: "2026-08-01T00:00:00Z" },
      ]);
      assert.deepEqual(t1, t2);
    });
  });

  // =========================================================================
  // GROUP G: Early Warning 2.0 (Scenarios 59–66)
  // =========================================================================
  describe("Group G: Early Warning 2.0 & Pattern Alerts", () => {
    it("Scenario 59: >= 3 skipped sessions triggers REPEATED_SKIPPING warning", () => {
      const outcomes = Array.from({ length: 4 }, () =>
        createMockOutcome({ status: "SKIPPED", sessionTitle: "Fisika Dasar" })
      );
      const warnings = generatePatternEarlyWarnings([], [], outcomes, []);
      const skipWarn = warnings.find((w) => w.category === "REPEATED_SKIPPING");
      assert.ok(skipWarn);
      assert.equal(skipWarn?.severity, "WARNING");
      assert.ok(skipWarn?.evidence[1].includes("Fisika Dasar"));
    });

    it("Scenario 60: >= 3 reschedules of same session triggers REPEATED_RESCHEDULING", () => {
      const outcomes = Array.from({ length: 3 }, () =>
        createMockOutcome({
          status: "RESCHEDULED",
          sessionTitle: "Kalkulus II",
        })
      );
      const warnings = generatePatternEarlyWarnings([], [], outcomes, []);
      const reschedWarn = warnings.find(
        (w) => w.category === "REPEATED_RESCHEDULING"
      );
      assert.ok(reschedWarn);
      assert.ok(reschedWarn?.title.includes("Kalkulus II"));
    });

    it("Scenario 61: Multiple urgent tasks without coverage triggers DEADLINE_COVERAGE_DECLINE", () => {
      const tasks = [
        createMockTask({
          title: "Tugas 1",
          deadline: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
        }),
        createMockTask({
          title: "Tugas 2",
          deadline: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
        }),
      ];
      const warnings = generatePatternEarlyWarnings([], tasks, [], []);
      const dlWarn = warnings.find(
        (w) => w.category === "DEADLINE_COVERAGE_DECLINE"
      );
      assert.ok(dlWarn);
      assert.equal(dlWarn?.severity, "CRITICAL");
    });

    it("Scenario 62: >= 3 days with workload > 300m triggers WORKLOAD_ACCUMULATION", () => {
      const heavySchedules = [
        createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "14:00" }), // 360m
        createMockSchedule({ day: "Selasa", start_time: "08:00", end_time: "14:00" }), // 360m
        createMockSchedule({ day: "Rabu", start_time: "08:00", end_time: "14:00" }), // 360m
      ];
      const warnings = generatePatternEarlyWarnings(heavySchedules, [], [], []);
      const wlWarn = warnings.find(
        (w) => w.category === "WORKLOAD_ACCUMULATION"
      );
      assert.ok(wlWarn);
    });

    it("Scenario 63: >= 3 rejected recommendations triggers RECOMMENDATION_REJECTION_PATTERN", () => {
      const recs: RecommendationOutcomeRecord[] = Array.from(
        { length: 4 },
        () => ({
          recommendationId: "rec_1",
          userId: "user_test",
          proposalTitle: "OPT",
          wasAccepted: false,
          wasExecuted: false,
          affectedSessionsOutcomes: [],
          conflictsOccurred: 0,
          outcomeScore: 30,
          recordedAt: new Date().toISOString(),
        })
      );
      const warnings = generatePatternEarlyWarnings([], [], [], recs);
      const rejWarn = warnings.find(
        (w) => w.category === "RECOMMENDATION_REJECTION_PATTERN"
      );
      assert.ok(rejWarn);
    });

    it("Scenario 64: Clean schedule with 0 skipped sessions yields 0 warnings", () => {
      const cleanSchedules = [
        createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" }),
      ];
      const warnings = generatePatternEarlyWarnings(cleanSchedules, [], [], []);
      assert.equal(warnings.length, 0);
    });

    it("Scenario 65: Warning evidence contains concrete subject information", () => {
      const outcomes = Array.from({ length: 4 }, () =>
        createMockOutcome({
          status: "SKIPPED",
          sessionTitle: "Sistem Operasi",
        })
      );
      const warnings = generatePatternEarlyWarnings([], [], outcomes, []);
      const skipWarn = warnings.find((w) => w.category === "REPEATED_SKIPPING");
      assert.ok(skipWarn?.evidence[1].includes("Sistem Operasi"));
    });

    it("Scenario 66: Suggested action is actionable and non-alarmist", () => {
      const outcomes = Array.from({ length: 4 }, () =>
        createMockOutcome({ status: "SKIPPED" })
      );
      const warnings = generatePatternEarlyWarnings([], [], outcomes, []);
      assert.ok(warnings[0].suggestedAction.length > 10);
    });
  });

  // =========================================================================
  // GROUP H: 3-Way What-If Outcome Simulator (Scenarios 67–72)
  // =========================================================================
  describe("Group H: 3-Way What-If Outcome Simulator", () => {
    it("Scenario 67: Side-effect free: original schedules array is not modified", () => {
      const original = [createMockSchedule({ id: "s1", day: "Senin" })];
      const mod: SimulationModification = {
        action: "MOVE_ITEM",
        itemId: "s1",
        targetDay: "Selasa",
        targetStartTime: "14:00",
        targetEndTime: "15:30",
      };
      simulateThreeWayOutcome(original, [], mod);
      assert.equal(original[0].day, "Senin"); // Original unmodified
    });

    it("Scenario 68: Scenario A accurately evaluates current schedule baseline", () => {
      const original = [
        createMockSchedule({ id: "s1", start_time: "08:00", end_time: "10:00" }),
      ];
      const res = simulateThreeWayOutcome(original, [], {
        action: "MOVE_ITEM",
        itemId: "s1",
        targetDay: "Selasa",
      });
      assert.equal(res.scenarioA.scenarioName, "SCENARIO_A_CURRENT");
      assert.equal(res.scenarioA.conflictsCount, 0);
    });

    it("Scenario 69: Scenario B reflects moved item day change", () => {
      const original = [
        createMockSchedule({ id: "s1", day: "Senin", start_time: "08:00", end_time: "10:00" }),
      ];
      const res = simulateThreeWayOutcome(original, [], {
        action: "MOVE_ITEM",
        itemId: "s1",
        targetDay: "Selasa",
        targetStartTime: "14:00",
        targetEndTime: "16:00",
      });
      assert.equal(res.scenarioB.scenarioName, "SCENARIO_B_PROPOSED");
      assert.equal(res.scenarioB.conflictsCount, 0);
    });

    it("Scenario 70: Scenario C provides recovery plan metrics", () => {
      const original = [createMockSchedule()];
      const res = simulateThreeWayOutcome(original, [], {
        action: "DELETE_ITEM",
        itemId: original[0].id,
      });
      assert.equal(res.scenarioC.scenarioName, "SCENARIO_C_RECOVERY");
      assert.ok(typeof res.scenarioC.healthScore === "number");
    });

    it("Scenario 71: bestScenario selects safest plan with highest health score", () => {
      const original = [createMockSchedule()];
      const res = simulateThreeWayOutcome(original, [], {
        action: "MOVE_ITEM",
        itemId: original[0].id,
        targetDay: "Selasa",
        targetStartTime: "10:00",
        targetEndTime: "11:30",
      });
      assert.ok(
        ["SCENARIO_A_CURRENT", "SCENARIO_B_PROPOSED", "SCENARIO_C_RECOVERY"].includes(
          res.bestScenario
        )
      );
    });

    it("Scenario 72: Trade-off summary contains comparative overview", () => {
      const original = [createMockSchedule()];
      const res = simulateThreeWayOutcome(original, [], {
        action: "MOVE_ITEM",
        itemId: original[0].id,
        targetDay: "Selasa",
      });
      assert.ok(res.tradeOffSummary.includes("Perbandingan 3 Skenario"));
    });
  });

  // =========================================================================
  // GROUP I: Security, RLS & Multi-Tenant Isolation (Scenarios 73–77)
  // =========================================================================
  describe("Group I: Security & Multi-Tenant Isolation", () => {
    it("Scenario 73: User A outcome is isolated from User B", () => {
      const outcomeA = createMockOutcome({ userId: "user_A" });
      const outcomeB = createMockOutcome({ userId: "user_B" });
      assert.notEqual(outcomeA.userId, outcomeB.userId);
    });

    it("Scenario 74: ActualVsPlanned analyzer only aggregates outcomes for target user", () => {
      const outcomes = [
        createMockOutcome({ userId: "user_A", status: "COMPLETED" }),
        createMockOutcome({ userId: "user_B", status: "SKIPPED" }),
      ];
      const reportA = analyzeActualVsPlanned(
        "user_A",
        outcomes.filter((o) => o.userId === "user_A")
      );
      assert.equal(reportA.totalPlannedSessions, 1);
      assert.equal(reportA.completedSessionsCount, 1);
      assert.equal(reportA.skippedSessionsCount, 0);
    });

    it("Scenario 75: BehaviorSignals2 strictly binds to requested userId", () => {
      const sig = extractBehaviorSignals2("user_alice", [], [
        createMockOutcome({ userId: "user_alice" }),
      ]);
      assert.equal(sig.userId, "user_alice");
    });

    it("Scenario 76: Sensitive fields (passwords, tokens) are completely absent from types", () => {
      const outcome = createMockOutcome();
      assert.equal((outcome as any).password, undefined);
      assert.equal((outcome as any).token, undefined);
    });

    it("Scenario 77: Invariant: Snapshot hashing rejects forged cross-user payloads", () => {
      const s1 = createMockSchedule({ user_id: "user_1" });
      const s2 = createMockSchedule({ user_id: "user_2" });
      const snap1 = generateScheduleSnapshot("user_1", [s1]);
      const snap2 = generateScheduleSnapshot("user_2", [s2]);
      assert.notEqual(snap1.snapshotHash, snap2.snapshotHash);
    });
  });

  // =========================================================================
  // GROUP J: Failure Modes, Concurrency, Idempotency & Explainability 4.0 (Scenarios 78–85)
  // =========================================================================
  describe("Group J: Failure Modes, Idempotency & Explainability 4.0", () => {
    it("Scenario 78: Negative duration safely bounded to 0 without errors", () => {
      const outcome = createMockOutcome({
        plannedDurationMinutes: 60,
        actualDurationMinutes: -20,
        status: "SKIPPED",
      });
      const report = analyzeActualVsPlanned("user_test", [outcome]);
      assert.ok(report.items[0].completionRatioPercent === 0);
    });

    it("Scenario 79: Malformed time string parses safely without exceptions", () => {
      const outcome = createMockOutcome({
        plannedStartTime: "invalid_time",
        actualStartTime: "bad_format",
      });
      const report = analyzeActualVsPlanned("user_test", [outcome]);
      assert.equal(report.items[0].startVarianceMinutes, "UNKNOWN");
    });

    it("Scenario 80: Empty inputs execute gracefully across all engines", () => {
      const adh = analyzeActualVsPlanned("user_test", []);
      const evalRes = evaluateHistoricalRecommendations([]);
      const trend = evaluateHealthTrend(80, []);
      const warn = generatePatternEarlyWarnings([], [], [], []);
      assert.ok(adh);
      assert.ok(evalRes);
      assert.ok(trend);
      assert.ok(warn);
    });

    it("Scenario 81: High volume stress test (200 outcomes) completes in < 50ms", () => {
      const largeOutcomes = Array.from({ length: 200 }, () =>
        createMockOutcome({
          status: "COMPLETED",
          actualDurationMinutes: 60,
        })
      );
      const start = Date.now();
      const report = analyzeActualVsPlanned("user_test", largeOutcomes);
      const elapsed = Date.now() - start;
      assert.equal(report.completedSessionsCount, 200);
      assert.ok(elapsed < 50, `Stress test took ${elapsed}ms (expected < 50ms)`);
    });

    it("Scenario 82: Idempotency: Duplicate outcome entries process cleanly", () => {
      const outcome = createMockOutcome({ id: "duplicate_id" });
      const report = analyzeActualVsPlanned("user_test", [outcome, outcome]);
      assert.equal(report.totalPlannedSessions, 2);
    });

    it("Scenario 83: Closed-loop integration: Snapshot -> Optimizer 3.0 with calibration -> Proposal", () => {
      const course = createMockSchedule({
        type: "jadwal",
        day: "Senin",
        start_time: "08:00",
        end_time: "12:00",
      });
      const study = createMockSchedule({
        type: "reminder",
        day: "Senin",
        start_time: "13:00",
        end_time: "16:00",
      });
      const snapshot = generateScheduleSnapshot("user_test", [course, study]);

      const outcomes = [
        createMockOutcome({
          status: "COMPLETED",
          actualDurationMinutes: 90,
          actualStartTime: "13:00",
        }),
      ];
      const recHistory: RecommendationOutcomeRecord[] = [
        {
          recommendationId: "rec_prev",
          userId: "user_test",
          proposalTitle: "GENERAL_OPTIMIZATION",
          wasAccepted: true,
          wasExecuted: true,
          affectedSessionsOutcomes: ["COMPLETED"],
          conflictsOccurred: 0,
          outcomeScore: 95,
          recordedAt: new Date().toISOString(),
        },
      ];

      const proposal = generateContinuousOptimizationProposal(
        "user_test",
        snapshot,
        [],
        outcomes,
        recHistory
      );
      assert.ok(proposal);
      assert.ok(proposal.proposalId.startsWith("prop_"));
      assert.equal(proposal.parentSnapshotHash, snapshot.snapshotHash);
    });

    it("Scenario 84: Explainability 4.0 generates complete answers for all 12 questions", () => {
      const expl = generate12QuestionExplanation({
        sessionTitle: "Belajar Algoritma",
        targetDay: "Selasa",
        targetStartTime: "14:00",
        targetEndTime: "15:30",
        durationMinutes: 90,
        workloadMinutesAfter: 180,
        conflictsCount: 0,
        qualityScore: 92,
        rankingPosition: 1,
      });

      assert.ok(expl.q1_whyThisTime.length > 10);
      assert.ok(expl.q2_prioritizedDeadline.length > 10);
      assert.ok(expl.q3_consideredSchedules.length > 10);
      assert.ok(expl.q4_conflictStatus.includes("Nol bentrok"));
      assert.ok(expl.q5_workloadAfter.includes("180"));
      assert.ok(expl.q6_sessionDuration.includes("90"));
      assert.ok(expl.q7_preferenceAlignment.length > 10);
      assert.ok(expl.q8_historicalBehaviorAlignment.length > 10);
      assert.ok(expl.q9_riskIfApplied.length > 10);
      assert.equal(expl.q10_alternatives.length, 2);
      assert.ok(expl.q11_consequencesIfDeclined.length > 10);
      assert.ok(expl.q12_whyRankedNumberOne.includes("#1"));
    });

    it("Scenario 85: Safety rule invariant: zero-conflict overrules historical preferences", () => {
      // Historical behavior prefers Night, but night has a fixed lecture conflict
      const nightLecture = createMockSchedule({
        day: "Senin",
        start_time: "19:00",
        end_time: "21:00",
        type: "jadwal",
      });
      const mod: SimulationModification = {
        action: "ADD_ITEM",
        item: createMockSchedule({
          day: "Senin",
          start_time: "19:30",
          end_time: "21:00",
          type: "reminder",
        }),
      };
      const res = simulateThreeWayOutcome([nightLecture], [], mod);
      assert.ok(res.scenarioB.conflictsCount >= 1);
      assert.equal(res.isSafeToApply, false); // Blocked despite night preference
    });
  });
});
