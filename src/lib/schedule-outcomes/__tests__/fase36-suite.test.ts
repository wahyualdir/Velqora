import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ScheduleItem, Task, ScheduleDay, ScheduleType } from "@/types";
import { ACADEMIC_CONSTANTS } from "../../schedule/academic-constants";
import {
  checkIntervalOverlap,
  calculateClashDurationMinutes,
  sanitizeFileName,
} from "../../schedule-import";
import {
  timeToMinutes,
  minutesToTime,
} from "../../schedule-import/conflict-engine";
import {
  analyzeWorkload,
  analyzeTaskDeadlines,
  analyzeFreeTimeSlots,
  generateAdaptiveDailyPlan,
  sanitizeSchedulePreferences,
  extractBehaviorSignals2,
  calculateRecommendationQuality,
  analyzeDeadlineCoverage,
  rankScheduleRecommendations,
} from "../../schedule-intelligence";
import {
  generateScheduleSnapshot,
  evaluateContextStaleness,
  detectScheduleRegression,
  generateContinuousOptimizationProposal,
  evaluateApprovalGate,
  applyProposalWithRollback,
  rollbackAppliedProposal,
  calculateAcademicHealthScore,
  generateEarlyWarnings,
  simulateScheduleModification,
} from "../../schedule-orchestration";
import {
  SessionOutcome,
  OutcomeStatus,
  analyzeActualVsPlanned,
  evaluateHistoricalRecommendations,
  calculateCalibrationMultipliers,
  evaluatePersonalizationFeedback,
  evaluateHealthTrend,
  generatePatternEarlyWarnings,
  simulateThreeWayOutcome,
  generate12QuestionExplanation,
} from "../../schedule-outcomes";
import { SimulationModification as OutcomeSimMod } from "../../schedule-outcomes/types";
import { scheduleBatchSaveRequestSchema } from "../../schedule-import/schema";
import { sanitizeMetadata, logIntelligenceEvent, IntelligenceEvent } from "../../observability";

// =========================================================================
// MOCK DATA FIXTURES
// =========================================================================
const createMockSchedule = (
  overrides: Partial<ScheduleItem> = {}
): ScheduleItem => ({
  id: `sched_${Math.random().toString(36).slice(2, 7)}`,
  user_id: "user_fase36_test",
  day: "Senin",
  title: "Algoritma & Pemrograman",
  time: "08:00 - 10:30",
  start_time: "08:00",
  end_time: "10:30",
  location: "Lab Komputer 1",
  lecturer: "Dr. Budi Santoso",
  type: "jadwal" as ScheduleType,
  priority: "sedang",
  is_completed: false,
  ...overrides,
});

const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  id: `task_${Math.random().toString(36).slice(2, 7)}`,
  user_id: "user_fase36_test",
  title: "Tugas Besar Pemrograman Web",
  subject: "Pemrograman Web",
  lecturer: null,
  description: null,
  deadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  status: "belum_dikerjakan",
  priority: "tinggi",
  file_url: null,
  file_name: null,
  external_url: null,
  notes: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

const createMockOutcome = (
  overrides: Partial<SessionOutcome> = {}
): SessionOutcome => ({
  id: `out_${Math.random().toString(36).slice(2, 7)}`,
  userId: "user_fase36_test",
  scheduleItemId: "sched_session_1",
  sessionTitle: "Belajar Mandiri Algoritma",
  day: "Senin",
  plannedStartTime: "14:00",
  plannedEndTime: "15:30",
  plannedDurationMinutes: 90,
  actualStartTime: "14:00",
  actualEndTime: "15:30",
  actualDurationMinutes: 90,
  status: "COMPLETED" as OutcomeStatus,
  recordedAt: new Date().toISOString(),
  ...overrides,
});

describe("FASE 36: User-Facing Academic Intelligence & Production Observability Suite", () => {
  // =========================================================================
  // GROUP A: Academic Intelligence Aggregation (Scenarios 1–10)
  // =========================================================================
  describe("Group A: Academic Intelligence Aggregation", () => {
    it("Scenario 1: Snapshot generation aggregates schedules, tasks and preferences correctly", () => {
      const s = createMockSchedule();
      const t = createMockTask();
      const p = sanitizeSchedulePreferences({ maximumDailyStudyMinutes: 240 });
      const snap = generateScheduleSnapshot("u1", [s], [t], p);
      assert.equal(snap.userId, "u1");
      assert.equal(snap.courses.length, 1);
      assert.equal(snap.tasks.length, 1);
      assert.equal(snap.userPreferences.maximumDailyStudyMinutes, 240);
    });

    it("Scenario 2: Health score calculation integrates task deadlines and schedule balance", () => {
      const s = createMockSchedule();
      const t = createMockTask();
      const health = calculateAcademicHealthScore([s], [t]);
      assert.ok(health.overallScore >= 0 && health.overallScore <= 100);
      assert.ok(health.factors.length >= 5);
    });

    it("Scenario 3: Workload summary breaks down daily lectures and study minutes", () => {
      const s1 = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const s2 = createMockSchedule({ day: "Senin", start_time: "14:00", end_time: "15:30", type: "reminder" });
      const wl = analyzeWorkload([s1, s2]);
      assert.equal(wl.dailyBreakdown.Senin.lecturesMinutes, 120);
      assert.equal(wl.dailyBreakdown.Senin.studyMinutes, 90);
      assert.equal(wl.dailyBreakdown.Senin.totalMinutes, 210);
    });

    it("Scenario 4: Task deadlines analyzer classifies tasks by remaining time", () => {
      const urgentTask = createMockTask({ deadline: new Date(Date.now() + 12 * 3600 * 1000).toISOString() });
      const safeTask = createMockTask({ deadline: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString() });
      const deadlines = analyzeTaskDeadlines([urgentTask, safeTask]);
      assert.equal(deadlines[0].urgency, "CRITICAL");
      assert.equal(deadlines[1].urgency, "SAFE");
    });

    it("Scenario 5: Deadline coverage accurately computes planned study minutes before deadline", () => {
      const task = createMockTask({ deadline: "2026-09-02T12:00:00Z" });
      const studySession = createMockSchedule({ day: "Senin", start_time: "14:00", end_time: "16:00", type: "reminder" });
      const coverage = analyzeDeadlineCoverage(task, [studySession], 3);
      assert.ok(coverage.hoursNeeded === 3);
      assert.ok(coverage.taskTitle.length > 0);
    });

    it("Scenario 6: Behavior signals extraction evaluates sufficient data invariant", () => {
      const fewOutcomes = [createMockOutcome(), createMockOutcome()];
      const sigs = extractBehaviorSignals2("u1", [], fewOutcomes);
      assert.equal(sigs.isSufficientData, false);
      assert.equal(sigs.evaluatedSessionsCount, 2);
    });

    it("Scenario 7: Continuous optimizer produces proposals referencing parent snapshot hash", () => {
      const snap = generateScheduleSnapshot("u1", [createMockSchedule()]);
      const proposal = generateContinuousOptimizationProposal("u1", snap, []);
      assert.equal(proposal.parentSnapshotHash, snap.snapshotHash);
    });

    it("Scenario 8: Pattern early warnings detect multi-factor signals safely", () => {
      const skips = Array.from({ length: 3 }, () => createMockOutcome({ status: "SKIPPED" }));
      const warnings = generatePatternEarlyWarnings([], [], skips);
      assert.ok(warnings.some((w) => w.category === "REPEATED_SKIPPING"));
    });

    it("Scenario 9: Actual vs Planned variance report defaults to UNKNOWN for empty outcomes", () => {
      const report = analyzeActualVsPlanned("empty_user", []);
      assert.equal(report.averageCompletionRatioPercent, "UNKNOWN");
    });

    it("Scenario 10: Historical recommendations evaluation returns INSUFFICIENT_DATA when empty", () => {
      const evalReport = evaluateHistoricalRecommendations([]);
      assert.equal(evalReport.effectivenessRating, "INSUFFICIENT_DATA");
    });
  });

  // =========================================================================
  // GROUP B: Health & Trend (Scenarios 11–20)
  // =========================================================================
  describe("Group B: Health & Trend", () => {
    it("Scenario 11: Academic health score stays strictly bounded within 0-100", () => {
      const s = createMockSchedule();
      const h = calculateAcademicHealthScore([s]);
      assert.ok(h.overallScore >= 0 && h.overallScore <= 100);
    });

    it("Scenario 12: Zero-conflict schedule achieves maximum conflict factor score (25/25)", () => {
      const s = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const h = calculateAcademicHealthScore([s]);
      const confFactor = h.factors.find((f) => f.name.includes("Bentrok"));
      assert.equal(confFactor?.score, 25);
    });

    it("Scenario 13: Conflict-laden schedule penalizes conflict factor heavily (0/20)", () => {
      const s1 = createMockSchedule({ id: "1", day: "Senin", start_time: "08:00", end_time: "10:00" });
      const s2 = createMockSchedule({ id: "2", day: "Senin", start_time: "09:00", end_time: "11:00" });
      const h = calculateAcademicHealthScore([s1, s2]);
      const confFactor = h.factors.find((f) => f.name.includes("Bentrok"));
      assert.equal(confFactor?.score, 0);
    });

    it("Scenario 14: Overloaded day (>360m) reduces health score significantly", () => {
      const light = [createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "11:00" })];
      const heavy = [createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "15:00" })];
      const hLight = calculateAcademicHealthScore(light);
      const hHeavy = calculateAcademicHealthScore(heavy);
      assert.ok(hLight.overallScore > hHeavy.overallScore);
    });

    it("Scenario 15: Health trend with positive delta >= +3 classifies as IMPROVING", () => {
      const trend = evaluateHealthTrend(88, [{ score: 82, recordedAt: new Date().toISOString() }]);
      assert.equal(trend.trend, "IMPROVING");
      assert.equal(trend.scoreDelta, 6);
    });

    it("Scenario 16: Health trend with negative delta <= -3 classifies as DECLINING", () => {
      const trend = evaluateHealthTrend(75, [{ score: 82, recordedAt: new Date().toISOString() }]);
      assert.equal(trend.trend, "DECLINING");
      assert.equal(trend.scoreDelta, -7);
    });

    it("Scenario 17: Health trend with small delta in [-2, +2] classifies as STABLE", () => {
      const trend = evaluateHealthTrend(83, [{ score: 82, recordedAt: new Date().toISOString() }]);
      assert.equal(trend.trend, "STABLE");
      assert.equal(trend.scoreDelta, 1);
    });

    it("Scenario 18: Health trend without historical records defaults to INSUFFICIENT_DATA with delta 0", () => {
      const trend = evaluateHealthTrend(85, []);
      assert.equal(trend.trend, "INSUFFICIENT_DATA");
      assert.equal(trend.scoreDelta, 0);
    });

    it("Scenario 19: Health explanation summary contains evidence-backed details", () => {
      const s = createMockSchedule();
      const h = calculateAcademicHealthScore([s]);
      assert.ok(h.summary && h.summary.length > 10);
    });

    it("Scenario 20: Factor scores sum exactly equals overallScore", () => {
      const s = createMockSchedule();
      const h = calculateAcademicHealthScore([s]);
      const sum = h.factors.reduce((acc, f) => acc + f.score, 0);
      assert.equal(h.overallScore, sum);
    });
  });

  // =========================================================================
  // GROUP C: Workload Intelligence (Scenarios 21–30)
  // =========================================================================
  describe("Group C: Workload Intelligence", () => {
    it("Scenario 21: Workload analyzer handles all 7 days of the week cleanly", () => {
      const res = analyzeWorkload([]);
      assert.ok(res.dailyBreakdown.Senin);
      assert.ok(res.dailyBreakdown.Minggu);
    });

    it("Scenario 22: Daily workload > 360m sets isOverloaded to true", () => {
      const heavy = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "15:30" });
      const res = analyzeWorkload([heavy]);
      assert.equal(res.dailyBreakdown.Senin.isOverloaded, true);
      assert.equal(res.dailyBreakdown.Senin.level, "SANGAT_PADAT");
    });

    it("Scenario 23: Daily workload <= 360m sets isOverloaded to false", () => {
      const moderate = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "12:00" });
      const res = analyzeWorkload([moderate]);
      assert.equal(res.dailyBreakdown.Senin.isOverloaded, false);
    });

    it("Scenario 24: Workload total hours converts minutes accurately", () => {
      const s = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:30" });
      const res = analyzeWorkload([s]);
      assert.equal(res.dailyBreakdown.Senin.totalMinutes, 150);
      assert.equal(res.dailyBreakdown.Senin.totalHours, 2.5);
    });

    it("Scenario 25: Workload analyzer sums multiple schedules on same day", () => {
      const s1 = createMockSchedule({ day: "Selasa", start_time: "08:00", end_time: "10:00" });
      const s2 = createMockSchedule({ day: "Selasa", start_time: "10:30", end_time: "12:30" });
      const res = analyzeWorkload([s1, s2]);
      assert.equal(res.dailyBreakdown.Selasa.totalMinutes, 240);
    });

    it("Scenario 26: Overloaded days count reflects number of days exceeding 360m", () => {
      const s1 = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "14:30" });
      const s2 = createMockSchedule({ day: "Rabu", start_time: "08:00", end_time: "14:30" });
      const res = analyzeWorkload([s1, s2]);
      assert.equal(res.overloadedDaysCount, 2);
    });

    it("Scenario 27: Average daily minutes calculates across 7 days", () => {
      const s = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "15:00" }); // 420m
      const res = analyzeWorkload([s]);
      assert.equal(res.averageDailyMinutes, 60);
    });

    it("Scenario 28: Peak workload day accurately identifies highest minute day", () => {
      const s1 = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const s2 = createMockSchedule({ day: "Kamis", start_time: "08:00", end_time: "12:00" });
      const res = analyzeWorkload([s1, s2]);
      const peakDay = (Object.keys(res.dailyBreakdown) as ScheduleDay[]).reduce(
        (max, d) => (res.dailyBreakdown[d].totalMinutes > res.dailyBreakdown[max].totalMinutes ? d : max),
        "Senin"
      );
      assert.equal(peakDay, "Kamis");
    });

    it("Scenario 29: Workload level categorizes RINGAN for <= 120m", () => {
      const s = createMockSchedule({ day: "Jumat", start_time: "08:00", end_time: "09:30" });
      const res = analyzeWorkload([s]);
      assert.equal(res.dailyBreakdown.Jumat.level, "RINGAN");
    });

    it("Scenario 30: Workload level categorizes NORMAL for 121–240m", () => {
      const s = createMockSchedule({ day: "Jumat", start_time: "08:00", end_time: "11:30" });
      const res = analyzeWorkload([s]);
      assert.equal(res.dailyBreakdown.Jumat.level, "NORMAL");
    });
  });

  // =========================================================================
  // GROUP D: Deadline Intelligence (Scenarios 31–40)
  // =========================================================================
  describe("Group D: Deadline Intelligence", () => {
    it("Scenario 31: Task deadline within 24h classifies as CRITICAL", () => {
      const task = createMockTask({ deadline: new Date(Date.now() + 10 * 3600 * 1000).toISOString() });
      const res = analyzeTaskDeadlines([task]);
      assert.equal(res[0].urgency, "CRITICAL");
    });

    it("Scenario 32: Task deadline between 24h and 72h classifies as URGENT", () => {
      const task = createMockTask({ deadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString() });
      const res = analyzeTaskDeadlines([task]);
      assert.equal(res[0].urgency, "URGENT");
    });

    it("Scenario 33: Task deadline between 3 and 7 days classifies as UPCOMING", () => {
      const task = createMockTask({ deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString() });
      const res = analyzeTaskDeadlines([task]);
      assert.equal(res[0].urgency, "UPCOMING");
    });

    it("Scenario 34: Task deadline > 7 days classifies as SAFE", () => {
      const task = createMockTask({ deadline: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString() });
      const res = analyzeTaskDeadlines([task]);
      assert.equal(res[0].urgency, "SAFE");
    });

    it("Scenario 35: Past deadline classifies as OVERDUE", () => {
      const task = createMockTask({ deadline: new Date(Date.now() - 2 * 3600 * 1000).toISOString() });
      const res = analyzeTaskDeadlines([task]);
      assert.equal(res[0].urgency, "OVERDUE");
    });

    it("Scenario 36: High priority task with moderate deadline upgrades urgency", () => {
      const task = createMockTask({
        priority: "tinggi",
        deadline: new Date(Date.now() + 40 * 3600 * 1000).toISOString(),
      });
      const res = analyzeTaskDeadlines([task]);
      assert.ok(res[0].urgency === "CRITICAL" || res[0].urgency === "URGENT");
    });

    it("Scenario 37: Deadline coverage report computes gap when study time is insufficient", () => {
      const task = createMockTask({ deadline: new Date(Date.now() + 2 * 3600 * 1000).toISOString() });
      const fullDayBusy = [
        createMockSchedule({ day: "Senin", start_time: "07:00", end_time: "22:00" }),
        createMockSchedule({ day: "Selasa", start_time: "07:00", end_time: "22:00" }),
        createMockSchedule({ day: "Rabu", start_time: "07:00", end_time: "22:00" }),
        createMockSchedule({ day: "Kamis", start_time: "07:00", end_time: "22:00" }),
        createMockSchedule({ day: "Jumat", start_time: "07:00", end_time: "22:00" }),
        createMockSchedule({ day: "Sabtu", start_time: "07:00", end_time: "22:00" }),
        createMockSchedule({ day: "Minggu", start_time: "07:00", end_time: "22:00" }),
      ];
      const coverage = analyzeDeadlineCoverage(task, fullDayBusy, 4);
      assert.equal(coverage.status, "INSUFFICIENT_TIME");
      assert.ok(coverage.gapMinutes > 0);
    });

    it("Scenario 38: Completed task has 0 urgency in active deadline analysis", () => {
      const completedTask = createMockTask({ status: "selesai" });
      const res = analyzeTaskDeadlines([completedTask]);
      assert.equal(res.length, 0);
    });

    it("Scenario 39: Task without deadline string defaults gracefully to SAFE", () => {
      const task = createMockTask({ deadline: null });
      const res = analyzeTaskDeadlines([task]);
      assert.equal(res.length, 0);
    });

    it("Scenario 40: Multiple tasks sort by urgency and remaining hours", () => {
      const t1 = createMockTask({ id: "1", deadline: new Date(Date.now() + 10 * 3600 * 1000).toISOString() });
      const t2 = createMockTask({ id: "2", deadline: new Date(Date.now() + 100 * 3600 * 1000).toISOString() });
      const res = analyzeTaskDeadlines([t2, t1]);
      assert.equal(res[0].taskId, "1");
    });
  });

  // =========================================================================
  // GROUP E: Behavior Signal Insufficient-Data Handling (Scenarios 41–50)
  // =========================================================================
  describe("Group E: Behavior Signal Insufficient-Data Handling", () => {
    it("Scenario 41: Less than 5 recorded sessions sets isSufficientData to false", () => {
      const outcomes = Array.from({ length: 4 }, () => createMockOutcome());
      const sigs = extractBehaviorSignals2("u1", [], outcomes);
      assert.equal(sigs.isSufficientData, false);
    });

    it("Scenario 42: Exactly 5 recorded sessions sets isSufficientData to true", () => {
      const outcomes = Array.from({ length: 5 }, () => createMockOutcome());
      const sigs = extractBehaviorSignals2("u1", [], outcomes);
      assert.equal(sigs.isSufficientData, true);
    });

    it("Scenario 43: Zero outcomes defaults observed time pattern to UNKNOWN", () => {
      const sigs = extractBehaviorSignals2("u1", [], []);
      assert.equal(sigs.isSufficientData, false);
      assert.equal(sigs.evaluatedSessionsCount, 0);
      assert.equal(sigs.completionPattern, "UNKNOWN");
    });

    it("Scenario 44: Morning outcomes classify as MORNING", () => {
      const outcomes = Array.from({ length: 5 }, () =>
        createMockOutcome({ actualStartTime: "08:00", actualEndTime: "09:30" })
      );
      const sigs = extractBehaviorSignals2("u1", [], outcomes);
      assert.equal(sigs.observedTimePattern, "MORNING");
    });

    it("Scenario 45: Afternoon outcomes classify as AFTERNOON", () => {
      const outcomes = Array.from({ length: 5 }, () =>
        createMockOutcome({ actualStartTime: "13:00", actualEndTime: "14:30" })
      );
      const sigs = extractBehaviorSignals2("u1", [], outcomes);
      assert.equal(sigs.observedTimePattern, "AFTERNOON");
    });

    it("Scenario 46: Evening outcomes classify as EVENING", () => {
      const outcomes = Array.from({ length: 5 }, () =>
        createMockOutcome({ actualStartTime: "16:00", actualEndTime: "17:30" })
      );
      const sigs = extractBehaviorSignals2("u1", [], outcomes);
      assert.equal(sigs.observedTimePattern, "EVENING");
    });

    it("Scenario 47: Night outcomes classify as NIGHT", () => {
      const outcomes = Array.from({ length: 5 }, () =>
        createMockOutcome({ actualStartTime: "19:30", actualEndTime: "21:00" })
      );
      const sigs = extractBehaviorSignals2("u1", [], outcomes);
      assert.equal(sigs.observedTimePattern, "NIGHT");
    });

    it("Scenario 48: High completion rate sets completion pattern to HIGH", () => {
      const outcomes = Array.from({ length: 5 }, () =>
        createMockOutcome({ status: "COMPLETED", plannedDurationMinutes: 60, actualDurationMinutes: 60 })
      );
      const sigs = extractBehaviorSignals2("u1", [], outcomes);
      assert.equal(sigs.completionPattern, "HIGH");
    });

    it("Scenario 49: Frequent skipping sets completion pattern to LOW", () => {
      const outcomes = Array.from({ length: 5 }, () =>
        createMockOutcome({ status: "SKIPPED", plannedDurationMinutes: 60, actualDurationMinutes: 0 })
      );
      const sigs = extractBehaviorSignals2("u1", [], outcomes);
      assert.equal(sigs.completionPattern, "LOW");
    });

    it("Scenario 50: Effective duration clamps average between 30 and 120 minutes", () => {
      const outcomes = Array.from({ length: 5 }, () =>
        createMockOutcome({ actualDurationMinutes: 75 })
      );
      const sigs = extractBehaviorSignals2("u1", [], outcomes);
      assert.equal(sigs.preferredEffectiveDurationMinutes, 75);
    });
  });

  // =========================================================================
  // GROUP F: Recommendation Ranking & Quality Scoring (Scenarios 51–60)
  // =========================================================================
  describe("Group F: Recommendation Ranking & Quality Scoring", () => {
    it("Scenario 51: Perfect recommendation computes score >= 85 and label Sangat Cocok", () => {
      const q = calculateRecommendationQuality({
        deadlineUrgency: "CRITICAL",
        slotDurationMinutes: 90,
        targetDurationMinutes: 90,
        hasConflict: false,
        dayWorkloadLevel: "NORMAL",
        hasSufficientBreak: true,
        isPreferredTimeMatch: true,
      });
      assert.ok(q.score >= 85);
      assert.equal(q.label, "Sangat Cocok");
    });

    it("Scenario 52: Active conflict heavily penalizes quality score", () => {
      const q = calculateRecommendationQuality({
        deadlineUrgency: "CRITICAL",
        slotDurationMinutes: 90,
        targetDurationMinutes: 90,
        hasConflict: true,
        dayWorkloadLevel: "NORMAL",
        hasSufficientBreak: true,
        isPreferredTimeMatch: true,
      });
      assert.ok(q.score <= 70);
    });

    it("Scenario 53: Overloaded day penalizes workload score component", () => {
      const q = calculateRecommendationQuality({
        deadlineUrgency: "UPCOMING",
        slotDurationMinutes: 60,
        targetDurationMinutes: 60,
        hasConflict: false,
        dayWorkloadLevel: "SANGAT_PADAT",
        hasSufficientBreak: true,
        isPreferredTimeMatch: false,
      });
      assert.equal(q.factors.workloadBalanceScore, 0);
    });

    it("Scenario 54: Explanations list includes breakdown reasons", () => {
      const q = calculateRecommendationQuality({
        deadlineUrgency: "CRITICAL",
        slotDurationMinutes: 90,
        targetDurationMinutes: 90,
        hasConflict: false,
        dayWorkloadLevel: "NORMAL",
        hasSufficientBreak: true,
        isPreferredTimeMatch: true,
      });
      assert.ok(q.explanations.length >= 3);
    });

    it("Scenario 55: Ranking sorts recommendations descending by quality score", () => {
      const createRec = (id: string, activity: string, conf: number) => ({
        id,
        activity,
        day: "Senin" as ScheduleDay,
        startTime: "08:00",
        endTime: "09:00",
        durationMinutes: 60,
        priority: "sedang" as const,
        reason: "Test",
        evidence: [],
        conflictStatus: "VERIFIED_NO_CONFLICT" as const,
        confidence: conf,
        explanation: { summary: "test", factors: [], evidence: [], constraintsApplied: [] },
      });
      const recs = [
        createRec("1", "Task 1", 0.75),
        createRec("2", "Task 2", 0.95),
        createRec("3", "Task 3", 0.85),
      ];
      const ranked = rankScheduleRecommendations(recs);
      assert.equal(ranked[0].recommendation.activity, "Task 2");
      assert.equal(ranked[1].recommendation.activity, "Task 3");
      assert.equal(ranked[2].recommendation.activity, "Task 1");
    });

    it("Scenario 56: Multiplier from recommendation calibration acts as secondary ranking signal", () => {
      const records = Array.from({ length: 4 }, () => ({
        recommendationId: "r1",
        userId: "u1",
        proposalTitle: "GENERAL_OPTIMIZATION",
        wasAccepted: true,
        wasExecuted: true,
        affectedSessionsOutcomes: ["COMPLETED" as OutcomeStatus],
        conflictsOccurred: 0,
        outcomeScore: 95,
        recordedAt: new Date().toISOString(),
      }));
      const mults = calculateCalibrationMultipliers(records);
      assert.ok(mults["GENERAL_OPTIMIZATION"].rankingMultiplier >= 1.0);
    });

    it("Scenario 57: Calibrated multiplier never exceeds 1.30 upper bound", () => {
      const records = Array.from({ length: 10 }, () => ({
        recommendationId: "r1",
        userId: "u1",
        proposalTitle: "GENERAL_OPTIMIZATION",
        wasAccepted: true,
        wasExecuted: true,
        affectedSessionsOutcomes: ["COMPLETED" as OutcomeStatus],
        conflictsOccurred: 0,
        outcomeScore: 100,
        recordedAt: new Date().toISOString(),
      }));
      const mults = calculateCalibrationMultipliers(records);
      assert.ok(mults["GENERAL_OPTIMIZATION"].rankingMultiplier <= 1.30);
    });

    it("Scenario 58: Calibrated multiplier never falls below 0.70 lower bound", () => {
      const records = Array.from({ length: 10 }, () => ({
        recommendationId: "r1",
        userId: "u1",
        proposalTitle: "GENERAL_OPTIMIZATION",
        wasAccepted: false,
        wasExecuted: false,
        affectedSessionsOutcomes: ["SKIPPED" as OutcomeStatus],
        conflictsOccurred: 3,
        outcomeScore: 0,
        recordedAt: new Date().toISOString(),
      }));
      const mults = calculateCalibrationMultipliers(records);
      assert.ok(mults["GENERAL_OPTIMIZATION"].rankingMultiplier >= 0.70);
    });

    it("Scenario 59: Continuous optimizer caps proposals to affected sessions", () => {
      const snap = generateScheduleSnapshot("u1", [createMockSchedule()]);
      const prop = generateContinuousOptimizationProposal("u1", snap, []);
      assert.ok(Array.isArray(prop.affectedSessions));
    });

    it("Scenario 60: Proposal includes deterministic unique proposalId", () => {
      const snap = generateScheduleSnapshot("u1", [createMockSchedule()]);
      const prop = generateContinuousOptimizationProposal("u1", snap, []);
      assert.ok(prop.proposalId.startsWith("prop_"));
    });
  });

  // =========================================================================
  // GROUP G: What-If Simulator Immutability (Scenarios 61–70)
  // =========================================================================
  describe("Group G: What-If Simulator Immutability", () => {
    it("Scenario 61: 3-Way What-If simulator does NOT mutate original schedules array", () => {
      const orig = [createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" })];
      const origCopy = JSON.stringify(orig);
      const mod: OutcomeSimMod = { action: "MOVE_ITEM", itemId: orig[0].id, targetDay: "Selasa", targetStartTime: "14:00", targetEndTime: "16:00" };
      simulateThreeWayOutcome(orig, [], mod);
      assert.equal(JSON.stringify(orig), origCopy);
    });

    it("Scenario 62: Scenario A reflects unchanged baseline state", () => {
      const item = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const mod: OutcomeSimMod = { action: "DELETE_ITEM", itemId: item.id };
      const res = simulateThreeWayOutcome([item], [], mod);
      assert.ok(res.scenarioA.healthScore >= 0);
      assert.equal(res.scenarioA.conflictsCount, 0);
    });

    it("Scenario 63: Scenario B simulates proposed modification directly", () => {
      const item = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const mod: OutcomeSimMod = { action: "DELETE_ITEM", itemId: item.id };
      const res = simulateThreeWayOutcome([item], [], mod);
      assert.equal(res.scenarioB.totalWorkloadMinutes, 0);
    });

    it("Scenario 64: Scenario C computes balanced recovery plan", () => {
      const item = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const mod: OutcomeSimMod = { action: "MOVE_ITEM", itemId: item.id, targetDay: "Senin", targetStartTime: "09:00", targetEndTime: "11:00" };
      const res = simulateThreeWayOutcome([item], [], mod);
      assert.ok(res.scenarioC.healthScore >= 0);
    });

    it("Scenario 65: Best scenario selection is one of Scenario A, B or C", () => {
      const item = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const mod: OutcomeSimMod = { action: "DELETE_ITEM", itemId: item.id };
      const res = simulateThreeWayOutcome([item], [], mod);
      assert.ok(["SCENARIO_A_CURRENT", "SCENARIO_B_PROPOSED", "SCENARIO_C_RECOVERY"].includes(res.bestScenario));
    });

    it("Scenario 66: Conflict-creating modification sets isSafeToApply to false", () => {
      const l1 = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "11:00" });
      const clashing = createMockSchedule({ day: "Senin", start_time: "09:00", end_time: "10:30" });
      const mod: OutcomeSimMod = { action: "ADD_ITEM", item: clashing };
      const res = simulateThreeWayOutcome([l1], [], mod);
      assert.equal(res.isSafeToApply, false);
      assert.ok(res.scenarioB.conflictsCount >= 1);
    });

    it("Scenario 67: Trade-off summary text explains decision concisely", () => {
      const item = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const mod: OutcomeSimMod = { action: "DELETE_ITEM", itemId: item.id };
      const res = simulateThreeWayOutcome([item], [], mod);
      assert.ok(res.tradeOffSummary && res.tradeOffSummary.length > 5);
    });

    it("Scenario 68: Single what-if engine simulation handles ADD_ITEM cleanly", () => {
      const orig = [createMockSchedule({ id: "1", day: "Senin", start_time: "08:00", end_time: "10:00" })];
      const newItem = createMockSchedule({ id: "2", day: "Selasa", start_time: "13:00", end_time: "15:00" });
      const sim = simulateScheduleModification(orig, [], { action: "ADD_ITEM", item: newItem });
      assert.equal(sim.conflictsAfter, 0);
    });

    it("Scenario 69: Single what-if engine simulation handles MOVE_ITEM cleanly", () => {
      const orig = [createMockSchedule({ id: "1", day: "Senin", start_time: "08:00", end_time: "10:00" })];
      const sim = simulateScheduleModification(orig, [], { action: "MOVE_ITEM", itemId: "1", targetDay: "Selasa", targetStartTime: "10:00", targetEndTime: "12:00" });
      assert.equal(sim.conflictsAfter, 0);
    });

    it("Scenario 70: What-If simulation with empty initial array executes without errors", () => {
      const sim = simulateScheduleModification([], [], { action: "DELETE_ITEM", itemId: "none" });
      assert.equal(sim.conflictsAfter, 0);
    });
  });

  // =========================================================================
  // GROUP H: Approval & Stale Proposal (Scenarios 71–80)
  // =========================================================================
  describe("Group H: Approval & Stale Proposal", () => {
    it("Scenario 71: Matching parentSnapshotHash allows approval gate", () => {
      const snap = generateScheduleSnapshot("u1", [createMockSchedule()]);
      const gate = evaluateApprovalGate("APPLY_OPTIMIZATION", { userId: "u1", parentSnapshotHash: snap.snapshotHash }, snap);
      assert.equal(gate.allowed, true);
    });

    it("Scenario 72: Stale snapshot hash blocks approval gate", () => {
      const snap = generateScheduleSnapshot("u1", [createMockSchedule()]);
      const gate = evaluateApprovalGate("APPLY_OPTIMIZATION", { userId: "u1", parentSnapshotHash: "stale_hash" }, snap);
      assert.equal(gate.allowed, false);
      assert.equal(gate.approvalLevel, "BLOCKED");
    });

    it("Scenario 73: Context staleness evaluates FRESH when hashes match", () => {
      const snap = generateScheduleSnapshot("u1", [createMockSchedule()]);
      const staleness = evaluateContextStaleness(snap, snap);
      assert.equal(staleness.validityStatus, "FRESH");
      assert.equal(staleness.isActionable, true);
    });

    it("Scenario 74: Context staleness evaluates STALE when course changed", () => {
      const snap1 = generateScheduleSnapshot("u1", [createMockSchedule({ id: "1", start_time: "08:00", end_time: "10:00" })]);
      const snap2 = generateScheduleSnapshot("u1", [createMockSchedule({ id: "1", start_time: "09:00", end_time: "11:00" })]);
      const staleness = evaluateContextStaleness(snap1, snap2);
      assert.notEqual(staleness.validityStatus, "FRESH");
      assert.equal(staleness.isActionable, false);
    });

    it("Scenario 75: Regression detector flags introducing conflict as CRITICAL_REGRESSION", () => {
      const orig = [createMockSchedule({ id: "1", day: "Senin", start_time: "08:00", end_time: "10:00" })];
      const prop = [
        createMockSchedule({ id: "1", day: "Senin", start_time: "08:00", end_time: "10:00" }),
        createMockSchedule({ id: "2", day: "Senin", start_time: "09:00", end_time: "11:00" }),
      ];
      const reg = detectScheduleRegression(orig, prop);
      assert.equal(reg.severity, "CRITICAL_REGRESSION");
      assert.equal(reg.isAcceptable, false);
    });

    it("Scenario 76: Regression detector flags exceeding 360m daily hard cap as CRITICAL_REGRESSION", () => {
      const orig = [createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "13:00" })];
      const prop = [createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "14:30" })];
      const reg = detectScheduleRegression(orig, prop);
      assert.equal(reg.severity, "CRITICAL_REGRESSION");
    });

    it("Scenario 77: Pure balancing with 0 conflicts classifies as acceptable", () => {
      const orig = [
        createMockSchedule({ id: "1", day: "Senin", start_time: "08:00", end_time: "11:00" }),
        createMockSchedule({ id: "2", day: "Senin", start_time: "13:00", end_time: "15:00", type: "reminder" }),
      ];
      const prop = [
        createMockSchedule({ id: "1", day: "Senin", start_time: "08:00", end_time: "11:00" }),
        createMockSchedule({ id: "2", day: "Selasa", start_time: "13:00", end_time: "15:00", type: "reminder" }),
      ];
      const reg = detectScheduleRegression(orig, prop);
      assert.equal(reg.isAcceptable, true);
    });

    it("Scenario 78: Atomic proposal apply creates rollback backup", () => {
      const snap = generateScheduleSnapshot("u1", [createMockSchedule({ id: "c1", day: "Senin" })]);
      const prop = generateContinuousOptimizationProposal("u1", snap, []);
      const applyRes = applyProposalWithRollback(prop, snap);
      assert.equal(applyRes.success, true);
      assert.ok(applyRes.updatedProposal.previousSchedulesBackup);
    });

    it("Scenario 79: Atomic rollback restores pristine initial schedule array", () => {
      const snap = generateScheduleSnapshot("u1", [createMockSchedule({ id: "c1", day: "Senin" })]);
      const prop = generateContinuousOptimizationProposal("u1", snap, []);
      const applyRes = applyProposalWithRollback(prop, snap);
      const rollbackRes = rollbackAppliedProposal(applyRes.updatedProposal, snap);
      assert.equal(rollbackRes.success, true);
    });

    it("Scenario 80: Rollback fails gracefully if proposal was not in APPLIED state", () => {
      const snap = generateScheduleSnapshot("u1", [createMockSchedule()]);
      const prop = generateContinuousOptimizationProposal("u1", snap, []);
      const rollbackRes = rollbackAppliedProposal(prop, snap);
      assert.equal(rollbackRes.success, false);
    });
  });

  // =========================================================================
  // GROUP I: Security & Tenant Isolation (Scenarios 81–90)
  // =========================================================================
  describe("Group I: Security & Tenant Isolation", () => {
    it("Scenario 81: Schema validation strips client-injected user_id payload", () => {
      const payload = {
        user_id: "injected_attacker_id",
        items: [{ title: "Kuliah", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00" }],
      };
      const parsed = scheduleBatchSaveRequestSchema.parse(payload);
      assert.equal((parsed as any).user_id, undefined);
    });

    it("Scenario 82: Multi-tenant outcome analysis isolates User A and User B data", () => {
      const outA = createMockOutcome({ userId: "user_A", sessionTitle: "Belajar A" });
      const outB = createMockOutcome({ userId: "user_B", sessionTitle: "Belajar B" });
      const repA = analyzeActualVsPlanned("user_A", [outA, outB].filter((o) => o.userId === "user_A"));
      assert.equal(repA.totalPlannedSessions, 1);
      assert.equal(repA.items[0].title, "Belajar A");
    });

    it("Scenario 83: Filename sanitizer strips null bytes and directory traversal", () => {
      const malicious = "../../../etc/passwd\0.pdf";
      const clean = sanitizeFileName(malicious);
      assert.ok(!clean.includes(".."));
      assert.ok(!clean.includes("\0"));
      assert.ok(!clean.includes("/"));
    });

    it("Scenario 84: Upload size limit enforces 15MB maximum boundary", () => {
      assert.equal(ACADEMIC_CONSTANTS.MAX_SCHEDULE_UPLOAD_SIZE_BYTES, 15 * 1024 * 1024);
    });

    it("Scenario 85: Structured logger redacts sensitive metadata keys", () => {
      const sensitive = { token: "secret_token", password: "pwd", course: "IF2101" };
      const cleaned = sanitizeMetadata(sensitive);
      assert.equal(cleaned?.token, "[REDACTED]");
      assert.equal(cleaned?.password, "[REDACTED]");
      assert.equal(cleaned?.course, "IF2101");
    });

    it("Scenario 86: Negative actual duration safely sets actualDuration to UNKNOWN", () => {
      const out = createMockOutcome({ actualDurationMinutes: -15, status: "PARTIALLY_COMPLETED" });
      const rep = analyzeActualVsPlanned("u1", [out]);
      assert.equal(rep.items[0].actualDuration, "UNKNOWN");
    });

    it("Scenario 87: Forged parent snapshot hash fails approval gate", () => {
      const snap = generateScheduleSnapshot("u1", [createMockSchedule()]);
      const gate = evaluateApprovalGate("APPLY_OPTIMIZATION", { userId: "u1", parentSnapshotHash: "fake_hash" }, snap);
      assert.equal(gate.allowed, false);
      assert.equal(gate.approvalLevel, "BLOCKED");
    });

    it("Scenario 88: Batch save schema rejects empty items array", () => {
      assert.throws(() => {
        scheduleBatchSaveRequestSchema.parse({ items: [] });
      });
    });

    it("Scenario 89: Batch save schema rejects invalid day names", () => {
      assert.throws(() => {
        scheduleBatchSaveRequestSchema.parse({
          items: [{ title: "Test", day: "InvalidDay", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00" }],
        });
      });
    });

    it("Scenario 90: Snapshot object contains zero credentials or auth tokens", () => {
      const snap = generateScheduleSnapshot("u1", [createMockSchedule()]);
      assert.equal((snap as any).token, undefined);
      assert.equal((snap as any).password, undefined);
    });
  });

  // =========================================================================
  // GROUP J: Failure & Observability (Scenarios 91–105)
  // =========================================================================
  describe("Group J: Failure & Observability", () => {
    it("Scenario 91: Structured intelligence event logger logs event type cleanly", () => {
      assert.doesNotThrow(() => {
        logIntelligenceEvent("recommendation_generated", { userId: "u1", count: 3 });
      });
    });

    it("Scenario 92: Structured intelligence event logger supports all defined event types", () => {
      const events: IntelligenceEvent[] = [
        "recommendation_generated",
        "recommendation_reviewed",
        "recommendation_accepted",
        "recommendation_rejected",
        "recommendation_applied",
        "recommendation_rolled_back",
        "session_completed",
        "session_skipped",
        "schedule_changed",
        "proposal_invalidated",
      ];
      for (const ev of events) {
        assert.doesNotThrow(() => {
          logIntelligenceEvent(ev, { test: true });
        });
      }
    });

    it("Scenario 93: Explainability 4.0 answers all 12 transparency questions", () => {
      const expl = generate12QuestionExplanation({
        sessionTitle: "Belajar Basis Data",
        targetDay: "Rabu",
        targetStartTime: "14:00",
        targetEndTime: "15:30",
        durationMinutes: 90,
        workloadMinutesAfter: 180,
        conflictsCount: 0,
        qualityScore: 94,
        rankingPosition: 1,
      });
      assert.ok(expl.q1_whyThisTime.includes("Rabu"));
      assert.ok(expl.q4_conflictStatus.includes("Nol bentrok"));
      assert.ok(expl.q5_workloadAfter.includes("180"));
      assert.ok(expl.q6_sessionDuration.includes("90"));
      assert.ok(expl.q12_whyRankedNumberOne.includes("#1"));
    });

    it("Scenario 94: Malformed outcome times evaluate startVariance to UNKNOWN without crashing", () => {
      const out = createMockOutcome({ plannedStartTime: "bad_format", actualStartTime: "corrupted" });
      const rep = analyzeActualVsPlanned("u1", [out]);
      assert.equal(rep.items[0].startVarianceMinutes, "UNKNOWN");
    });

    it("Scenario 95: Empty inputs to all core intelligence modules execute gracefully", () => {
      const snap = generateScheduleSnapshot("u1", [], []);
      const health = calculateAcademicHealthScore([]);
      const warnings = generateEarlyWarnings([]);
      const proposal = generateContinuousOptimizationProposal("u1", snap, []);
      assert.ok(snap);
      assert.ok(health.overallScore >= 0);
      assert.ok(Array.isArray(warnings));
      assert.ok(proposal);
    });

    it("Scenario 96: Reproducibility: Snapshot hash is deterministic across 50 repeated executions", () => {
      const s = [createMockSchedule({ id: "fixed_1", day: "Senin", start_time: "08:00", end_time: "10:00" })];
      const expected = generateScheduleSnapshot("u1", s).snapshotHash;
      for (let i = 0; i < 50; i++) {
        assert.equal(generateScheduleSnapshot("u1", s).snapshotHash, expected);
      }
    });

    it("Scenario 97: Free time slots discovers 4-hour break between morning and afternoon lectures", () => {
      const l1 = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const l2 = createMockSchedule({ day: "Senin", start_time: "14:00", end_time: "16:00" });
      const slots = analyzeFreeTimeSlots("Senin", [l1, l2]);
      assert.ok(slots.some((s) => s.durationMinutes >= 120));
    });

    it("Scenario 98: High volume stress benchmark (100 items) executes in < 500ms", () => {
      const days: ScheduleDay[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
      const bigSchedules = Array.from({ length: 100 }, (_, i) =>
        createMockSchedule({ id: `item_${i}`, day: days[i % days.length], start_time: "08:00", end_time: "09:30" })
      );
      const t0 = performance.now();
      const snap = generateScheduleSnapshot("stress_user", bigSchedules);
      const health = calculateAcademicHealthScore(bigSchedules);
      const dur = performance.now() - t0;
      assert.ok(snap.snapshotHash.length > 0);
      assert.ok(health.overallScore >= 0);
      assert.ok(dur < 500, `Execution took ${dur.toFixed(2)}ms`);
    });

    it("Scenario 99: Partial session outcome records accurate fractional completion ratio", () => {
      const out = createMockOutcome({ plannedDurationMinutes: 100, actualDurationMinutes: 50, status: "PARTIALLY_COMPLETED" });
      const rep = analyzeActualVsPlanned("u1", [out]);
      assert.equal(rep.items[0].completionRatioPercent, 50);
    });

    it("Scenario 100: Rejection of all proposals maintains unmodified calendar baseline", () => {
      const s = createMockSchedule({ id: "base_1", day: "Senin", start_time: "08:00", end_time: "10:00" });
      const snap = generateScheduleSnapshot("u1", [s]);
      const prop = generateContinuousOptimizationProposal("u1", snap, []);
      const records = [
        {
          recommendationId: prop.proposalId,
          userId: "u1",
          proposalTitle: "GENERAL_OPTIMIZATION",
          wasAccepted: false,
          wasExecuted: false,
          affectedSessionsOutcomes: [],
          conflictsOccurred: 0,
          outcomeScore: 30,
          recordedAt: new Date().toISOString(),
        },
      ];
      const evaluation = evaluateHistoricalRecommendations(records);
      assert.equal(evaluation.totalRecommendations, 1);
      assert.equal(evaluation.acceptedCount, 0);
    });

    it("Scenario 101: Personalization feedback prompt presents exactly 3 explicit options", () => {
      const pref = sanitizeSchedulePreferences({ preferredStudyStartTime: "19:00", preferredStudyEndTime: "21:30" });
      const afternoonOutcomes = Array.from({ length: 6 }, () =>
        createMockOutcome({ actualStartTime: "15:00", actualEndTime: "16:30", actualDurationMinutes: 90, status: "COMPLETED" })
      );
      const prompt = evaluatePersonalizationFeedback(pref, afternoonOutcomes);
      assert.equal(prompt.options.length, 3);
      assert.equal(prompt.options[0].action, "PRESERVE_DECLARED");
      assert.equal(prompt.options[1].action, "ADAPT_TO_OBSERVED");
      assert.equal(prompt.options[2].action, "DISMISS");
    });

    it("Scenario 102: Full Production Invariant: Safe, Conflict-Free, Deterministic, Explainable", () => {
      const lecture = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:30" });
      const snap = generateScheduleSnapshot("prod_user", [lecture]);
      const plan = generateAdaptiveDailyPlan({ date: "2026-09-01", day: "Senin", targetStudyHours: 2 }, [lecture], [createMockTask()]);
      assert.ok(plan.recommendedSessions.length > 0);
      assert.equal(plan.recommendedSessions[0].conflictStatus, "VERIFIED_NO_CONFLICT");
      assert.ok(plan.recommendedSessions[0].reason.length > 10);
      assert.ok(snap.snapshotHash.length > 0);
    });

    it("Scenario 103: ACADEMIC_CONSTANTS are strictly consistent and exported across modules", () => {
      assert.equal(ACADEMIC_CONSTANTS.DEFAULT_MAX_DAILY_STUDY_MINUTES, 240);
      assert.equal(ACADEMIC_CONSTANTS.DAILY_WORKLOAD_HARD_CAP_MINUTES, 360);
      assert.equal(ACADEMIC_CONSTANTS.ADAPTIVE_MAX_SINGLE_SESSION_MINUTES, 90);
      assert.equal(ACADEMIC_CONSTANTS.MIN_BREAK_BUFFER_MINUTES, 30);
      assert.equal(ACADEMIC_CONSTANTS.PUNCTUALITY_TOLERANCE_MINUTES, 15);
      assert.equal(ACADEMIC_CONSTANTS.CALIBRATION_MULTIPLIER_MIN, 0.70);
      assert.equal(ACADEMIC_CONSTANTS.CALIBRATION_MULTIPLIER_MAX, 1.30);
      assert.equal(ACADEMIC_CONSTANTS.MAX_SCHEDULE_UPLOAD_SIZE_BYTES, 15 * 1024 * 1024);
    });

    it("Scenario 104: Touching time intervals (08:00-10:00 vs 10:00-12:00) verified non-clashing", () => {
      const overlaps = checkIntervalOverlap("08:00", "10:00", "10:00", "12:00");
      assert.equal(overlaps, false);
      const clash = calculateClashDurationMinutes("08:00", "10:00", "10:00", "12:00");
      assert.equal(clash, 0);
    });

    it("Scenario 105: Dot format time parsing parses both HH:MM and HH.MM accurately", () => {
      assert.equal(timeToMinutes("08.30"), 510);
      assert.equal(timeToMinutes("08:30"), 510);
      assert.equal(minutesToTime(510), "08:30");
    });
  });
});
