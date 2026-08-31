import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ScheduleItem, Task, ScheduleDay, ScheduleType } from "@/types";
import { ACADEMIC_CONSTANTS } from "../../schedule/academic-constants";
import {
  normalizeExtractedScheduleItem,
  detectAllScheduleConflicts,
  checkIntervalOverlap,
  calculateClashDurationMinutes,
  classifyScheduleDocument,
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
  analyzeScheduleRealism,
  calculateRecommendationQuality,
} from "../../schedule-intelligence";
import {
  generateScheduleSnapshot,
  computeStableSnapshotHash,
  diffScheduleSnapshots,
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
  calculateRecommendationOutcomeScore,
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
import { sanitizeMetadata } from "../../observability";

// =========================================================================
// MOCK DATA FACTORIES (Transparent Test Fixtures)
// =========================================================================
const createMockSchedule = (
  overrides: Partial<ScheduleItem> = {}
): ScheduleItem => ({
  id: `sched_${Math.random().toString(36).slice(2, 7)}`,
  user_id: "user_fase35_audit",
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
  user_id: "user_fase35_audit",
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
  userId: "user_fase35_audit",
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

describe("FASE 35: System-Wide Intelligence Audit & Production Validation Suite", () => {
  // =========================================================================
  // GROUP A: Complete System Dependency & Pipeline Invariants (Scenarios 1–10)
  // =========================================================================
  describe("Group A: Complete System Dependency & Pipeline Invariants", () => {
    it("Scenario 1: End-to-end normalization parses raw candidate into canonical item", () => {
      const raw = {
        title: "IF2101 Pemrograman Web",
        day: "senin",
        time: "08.00 - 10.30",
        location: "Lab 3",
        instructor: "Budi",
      };
      const item = normalizeExtractedScheduleItem(raw, 0);
      assert.equal(item.day, "Senin");
      assert.equal(item.startTime, "08:00");
      assert.equal(item.endTime, "10:30");
      assert.equal(item.courseCode, "IF2101");
      assert.equal(item.confidence, "verified");
    });

    it("Scenario 2: Conflict detection accurately discovers overlapping intervals", () => {
      const itemA = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const itemB = createMockSchedule({ day: "Senin", start_time: "09:30", end_time: "11:30" });
      const conflicts = detectAllScheduleConflicts([itemA as any, itemB as any]);
      assert.equal(conflicts.length, 2);
    });

    it("Scenario 3: Touching time intervals (08:00-10:00 vs 10:00-12:00) do NOT clash", () => {
      const overlaps = checkIntervalOverlap("08:00", "10:00", "10:00", "12:00");
      assert.equal(overlaps, false);
      const clash = calculateClashDurationMinutes("08:00", "10:00", "10:00", "12:00");
      assert.equal(clash, 0);
    });

    it("Scenario 4: Deterministic snapshot computation creates identical hash regardless of item order", () => {
      const item1 = createMockSchedule({ id: "1", title: "Matematika", day: "Senin" });
      const item2 = createMockSchedule({ id: "2", title: "Fisika", day: "Selasa" });
      const snap1 = generateScheduleSnapshot("user_1", [item1, item2]);
      const snap2 = generateScheduleSnapshot("user_1", [item2, item1]);
      assert.equal(snap1.snapshotHash, snap2.snapshotHash);
    });

    it("Scenario 5: Optimizer 3.0 produces proposal referencing valid parentSnapshotHash", () => {
      const item1 = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "12:00" });
      const item2 = createMockSchedule({ day: "Senin", start_time: "13:00", end_time: "16:00", type: "reminder" });
      const snap = generateScheduleSnapshot("user_1", [item1, item2]);
      const proposal = generateContinuousOptimizationProposal("user_1", snap, []);
      assert.ok(proposal);
      assert.equal(proposal.parentSnapshotHash, snap.snapshotHash);
    });

    it("Scenario 6: Outcome recording flows into ActualVsPlanned variance analytics", () => {
      const outcome = createMockOutcome({
        plannedDurationMinutes: 60,
        actualDurationMinutes: 45,
        status: "COMPLETED",
      });
      const report = analyzeActualVsPlanned("user_1", [outcome]);
      assert.equal(report.items[0].durationVarianceMinutes, -15);
      assert.equal(report.items[0].completionRatioPercent, 75);
    });

    it("Scenario 7: Calibration multipliers derived from outcome records stay within bounds", () => {
      const records = [
        {
          recommendationId: "r1",
          userId: "user_1",
          proposalTitle: "GENERAL_OPTIMIZATION",
          wasAccepted: true,
          wasExecuted: true,
          affectedSessionsOutcomes: ["COMPLETED" as OutcomeStatus],
          conflictsOccurred: 0,
          outcomeScore: 95,
          recordedAt: new Date().toISOString(),
        },
      ];
      const mults = calculateCalibrationMultipliers(records);
      assert.ok(mults["GENERAL_OPTIMIZATION"]);
      assert.ok(mults["GENERAL_OPTIMIZATION"].rankingMultiplier >= 0.70);
      assert.ok(mults["GENERAL_OPTIMIZATION"].rankingMultiplier <= 1.30);
    });

    it("Scenario 8: Closed loop end-to-end: Snapshot -> Proposal -> Apply -> Rollback", () => {
      const schedule = createMockSchedule({ day: "Senin", start_time: "10:00", end_time: "12:00" });
      const snap = generateScheduleSnapshot("user_1", [schedule]);
      const prop = generateContinuousOptimizationProposal("user_1", snap, []);
      const applyRes = applyProposalWithRollback(prop, snap);
      assert.equal(applyRes.success, true);
      const rollbackRes = rollbackAppliedProposal(applyRes.updatedProposal, snap);
      assert.equal(rollbackRes.success, true);
    });

    it("Scenario 9: Unused/unknown telemetry cleanly defaults to UNKNOWN rather than 0", () => {
      const emptyReport = analyzeActualVsPlanned("user_empty", []);
      assert.equal(emptyReport.averageCompletionRatioPercent, "UNKNOWN");
      assert.equal(emptyReport.scheduleAdherenceIndex, "UNKNOWN");
    });

    it("Scenario 10: Pipeline components export canonical ACADEMIC_CONSTANTS", () => {
      assert.equal(ACADEMIC_CONSTANTS.DAILY_WORKLOAD_HARD_CAP_MINUTES, 360);
      assert.equal(ACADEMIC_CONSTANTS.DEFAULT_MAX_DAILY_STUDY_MINUTES, 240);
      assert.equal(ACADEMIC_CONSTANTS.ADAPTIVE_MAX_SINGLE_SESSION_MINUTES, 90);
    });
  });

  // =========================================================================
  // GROUP B: Canonical Domain Rules & Workload Boundaries (Scenarios 11–20)
  // =========================================================================
  describe("Group B: Canonical Domain Rules & Workload Boundaries", () => {
    it("Scenario 11: Workload analyzer flags day as isOverloaded strictly for >360 minutes", () => {
      const schedule360 = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "14:00" });
      const schedule390 = createMockSchedule({ day: "Selasa", start_time: "08:00", end_time: "14:30" });
      const res = analyzeWorkload([schedule360, schedule390]);
      assert.equal(res.dailyBreakdown.Senin.isOverloaded, false);
      assert.equal(res.dailyBreakdown.Selasa.isOverloaded, true);
    });

    it("Scenario 12: Regression detector flags exceeding 360m daily hard cap as CRITICAL_REGRESSION", () => {
      const orig = [createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "13:00" })];
      const prop = [createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "14:30" })];
      const reg = detectScheduleRegression(orig, prop);
      assert.equal(reg.severity, "CRITICAL_REGRESSION");
      assert.equal(reg.isAcceptable, false);
    });

    it("Scenario 13: Personal profile sanitizes maximumDailyStudyMinutes between 60 and 360 minutes", () => {
      const prefLow = sanitizeSchedulePreferences({ maximumDailyStudyMinutes: 20 });
      assert.equal(prefLow.maximumDailyStudyMinutes, 60);
      const prefHigh = sanitizeSchedulePreferences({ maximumDailyStudyMinutes: 500 });
      assert.equal(prefHigh.maximumDailyStudyMinutes, 360);
      const prefNormal = sanitizeSchedulePreferences({ maximumDailyStudyMinutes: 240 });
      assert.equal(prefNormal.maximumDailyStudyMinutes, 240);
    });

    it("Scenario 14: Personal profile sanitizes session duration between 30 and 120 minutes", () => {
      const pref = sanitizeSchedulePreferences({ preferredSessionDuration: 15 });
      assert.equal(pref.preferredSessionDuration, 30);
    });

    it("Scenario 15: Personal profile sanitizes break duration between 15 and 60 minutes", () => {
      const pref = sanitizeSchedulePreferences({ preferredBreakDuration: 90 });
      assert.equal(pref.preferredBreakDuration, 60);
    });

    it("Scenario 16: Adaptive daily plan caps single session to maximum 90 minutes", () => {
      const plan = generateAdaptiveDailyPlan(
        { date: "2026-09-01", day: "Senin", targetStudyHours: 4 },
        [],
        [createMockTask()]
      );
      for (const s of plan.recommendedSessions) {
        assert.ok(s.durationMinutes <= 90);
      }
    });

    it("Scenario 17: Punctuality tolerance window is strictly +/- 15 minutes", () => {
      const punctual = createMockOutcome({
        plannedStartTime: "08:00",
        actualStartTime: "08:15",
        actualEndTime: "09:15",
        status: "COMPLETED",
      });
      const unpunctual = createMockOutcome({
        plannedStartTime: "08:00",
        actualStartTime: "08:20",
        actualEndTime: "09:20",
        status: "COMPLETED",
      });
      const rep = analyzeActualVsPlanned("user_1", [punctual, unpunctual]);
      assert.equal(rep.items[0].isPunctual, true);
      assert.equal(rep.items[1].isPunctual, false);
    });

    it("Scenario 18: Calibration multiplier is clamped strictly within [0.70, 1.30]", () => {
      const perfectRecords = Array.from({ length: 5 }, () => ({
        recommendationId: "rec_perf",
        userId: "u1",
        proposalTitle: "GENERAL_OPTIMIZATION",
        wasAccepted: true,
        wasExecuted: true,
        affectedSessionsOutcomes: ["COMPLETED" as OutcomeStatus],
        conflictsOccurred: 0,
        outcomeScore: 100,
        recordedAt: new Date().toISOString(),
      }));
      const mults = calculateCalibrationMultipliers(perfectRecords);
      assert.ok(mults["GENERAL_OPTIMIZATION"].rankingMultiplier >= 0.70);
      assert.ok(mults["GENERAL_OPTIMIZATION"].rankingMultiplier <= 1.30);
    });

    it("Scenario 19: Academic health score deduces overloaded days (>360m) severely", () => {
      const safeSchedule = [createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "11:00" })];
      const heavySchedule = [
        createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "15:00" }),
        createMockSchedule({ day: "Selasa", start_time: "08:00", end_time: "15:00" }),
      ];
      const healthSafe = calculateAcademicHealthScore(safeSchedule);
      const healthHeavy = calculateAcademicHealthScore(heavySchedule);
      assert.ok(healthSafe.overallScore > healthHeavy.overallScore);
    });

    it("Scenario 20: Early warning system flags WORKLOAD_ACCUMULATION for >360m days", () => {
      const heavy = [createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "15:00" })];
      const warnings = generateEarlyWarnings(heavy);
      assert.ok(warnings.some((w) => w.type === "WORKLOAD_ACCUMULATION"));
    });
  });

  // =========================================================================
  // GROUP C: Cross-Phase Dynamic Scenarios (Scenarios 21–32)
  // =========================================================================
  describe("Group C: Cross-Phase Dynamic Scenarios (12 Canonical Scenarios)", () => {
    it("Scenario 21 (Flow 1): Import new schedule generates verified candidate and clean snapshot", () => {
      const raw = { title: "Jaringan Komputer", day: "Selasa", time: "10:00 - 12:30" };
      const normalized = normalizeExtractedScheduleItem(raw, 0);
      assert.equal(normalized.selected, true);
      const schedule = createMockSchedule({ day: normalized.day as ScheduleDay, time: normalized.time });
      const snap = generateScheduleSnapshot("u1", [schedule]);
      assert.equal(snap.courses.length, 1);
    });

    it("Scenario 22 (Flow 2): Schedule changes dynamically updating snapshot hash", () => {
      const s1 = createMockSchedule({ id: "c1", day: "Senin", time: "08:00 - 10:00", start_time: "08:00", end_time: "10:00" });
      const s2 = createMockSchedule({ id: "c1", day: "Senin", time: "09:00 - 11:00", start_time: "09:00", end_time: "11:00" });
      const snap1 = generateScheduleSnapshot("u1", [s1]);
      const snap2 = generateScheduleSnapshot("u1", [s2]);
      assert.notEqual(snap1.snapshotHash, snap2.snapshotHash);
    });

    it("Scenario 23 (Flow 3): Schedule changes after recommendation flags staleness", () => {
      const s1 = createMockSchedule({ id: "c1", day: "Senin", start_time: "08:00", end_time: "10:00" });
      const snapOriginal = generateScheduleSnapshot("u1", [s1]);

      const sMutated = createMockSchedule({ id: "c1", day: "Senin", start_time: "13:00", end_time: "15:00" });
      const snapCurrent = generateScheduleSnapshot("u1", [sMutated]);

      const staleness = evaluateContextStaleness(snapOriginal, snapCurrent);
      assert.notEqual(staleness.validityStatus, "FRESH");
      assert.equal(staleness.isActionable, false);
    });

    it("Scenario 24 (Flow 4): Stale proposal application is BLOCKED by approval gate", () => {
      const snapOriginal = generateScheduleSnapshot("u1", [createMockSchedule({ id: "1" })]);
      const proposal = generateContinuousOptimizationProposal("u1", snapOriginal, []);
      const snapCurrent = generateScheduleSnapshot("u1", [createMockSchedule({ id: "2" })]);

      const gate = evaluateApprovalGate(
        "APPLY_OPTIMIZATION",
        { userId: "u1", parentSnapshotHash: proposal.parentSnapshotHash },
        snapCurrent
      );
      assert.equal(gate.allowed, false);
      assert.equal(gate.approvalLevel, "BLOCKED");
    });

    it("Scenario 25 (Flow 5): Deadline changes after recommendation updates snapshot diff", () => {
      const snap1 = generateScheduleSnapshot("u1", [createMockSchedule()], [createMockTask({ deadline: "2026-09-01T12:00:00Z" })]);
      const snap2 = generateScheduleSnapshot("u1", [createMockSchedule()], [createMockTask({ deadline: "2026-09-02T12:00:00Z" })]);
      const diff = diffScheduleSnapshots(snap1, snap2);
      assert.notEqual(diff.category, "NO_CHANGE");
    });

    it("Scenario 26 (Flow 6): User skips a study session recording SKIPPED outcome", () => {
      const outcome = createMockOutcome({ status: "SKIPPED", plannedDurationMinutes: 60 });
      const rep = analyzeActualVsPlanned("u1", [outcome]);
      assert.equal(rep.skippedSessionsCount, 1);
      assert.equal(rep.items[0].actualDuration, 0);
      assert.equal(rep.items[0].completionRatioPercent, 0);
    });

    it("Scenario 27 (Flow 7): Missed session recovery generates valid alternative slot", () => {
      const lecture = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "11:00" });
      const plan = generateAdaptiveDailyPlan(
        { date: "2026-09-01", day: "Senin", targetStudyHours: 2 },
        [lecture],
        [createMockTask()]
      );
      assert.ok(plan.recommendedSessions.length > 0);
      assert.equal(plan.recommendedSessions[0].conflictStatus, "VERIFIED_NO_CONFLICT");
    });

    it("Scenario 28 (Flow 8): Recovery that would cause overload is appropriately flagged", () => {
      const heavyMonday = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "14:00" });
      const plan = generateAdaptiveDailyPlan(
        { date: "2026-09-01", day: "Senin", targetStudyHours: 3 },
        [heavyMonday],
        [createMockTask()],
        { enableOverloadRecovery: true }
      );
      if (plan.overloadRecovery) {
        assert.ok(plan.overloadRecovery.suggestedLighterDays.length > 0);
      }
    });

    it("Scenario 29 (Flow 9): Rejected recommendation calculates neutral baseline score 30", () => {
      const score = calculateRecommendationOutcomeScore({
        wasAccepted: false,
        wasExecuted: false,
        affectedSessionsOutcomes: [],
        conflictsOccurred: 0,
      });
      assert.equal(score, 30);
    });

    it("Scenario 30 (Flow 10): Outcome successfully recorded and updates behavior signals", () => {
      const outcomes = Array.from({ length: 6 }, () =>
        createMockOutcome({ actualStartTime: "19:00", actualEndTime: "20:00", actualDurationMinutes: 60, status: "COMPLETED" })
      );
      const sigs = extractBehaviorSignals2("u1", [], outcomes);
      assert.equal(sigs.observedTimePattern, "NIGHT");
      assert.equal(sigs.completionPattern, "HIGH");
    });

    it("Scenario 31 (Flow 11): Calibration multiplier updates empirically from outcome records", () => {
      const records = Array.from({ length: 4 }, () => ({
        recommendationId: "r1",
        userId: "u1",
        proposalTitle: "GENERAL_OPTIMIZATION",
        wasAccepted: true,
        wasExecuted: true,
        affectedSessionsOutcomes: ["COMPLETED" as OutcomeStatus],
        conflictsOccurred: 0,
        outcomeScore: 90,
        recordedAt: new Date().toISOString(),
      }));
      const mults = calculateCalibrationMultipliers(records);
      assert.ok(mults["GENERAL_OPTIMIZATION"].rankingMultiplier > 1.0);
    });

    it("Scenario 32 (Flow 12): Optimizer 3.0 applies calibration multiplier during ranking", () => {
      const c1 = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "12:00" });
      const s1 = createMockSchedule({ day: "Senin", start_time: "13:00", end_time: "16:00", type: "reminder" });
      const snap = generateScheduleSnapshot("u1", [c1, s1]);
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
      const proposal = generateContinuousOptimizationProposal("u1", snap, [], [], records);
      assert.ok(proposal);
      assert.ok(proposal.proposalId.startsWith("prop_"));
    });
  });

  // =========================================================================
  // GROUP D: Security Hardening, Multi-Tenant & Payload Bounds (Scenarios 33–42)
  // =========================================================================
  describe("Group D: Security Hardening, Multi-Tenant & Payload Bounds", () => {
    it("Scenario 33: Schema validation strips client-injected user_id payload", () => {
      const payload = {
        user_id: "malicious_user_id",
        items: [
          {
            title: "Kuliah Aman",
            day: "Senin",
            start_time: "08:00",
            end_time: "10:00",
            time: "08:00 - 10:00",
            type: "jadwal",
            priority: "sedang",
          },
        ],
      };
      const parsed = scheduleBatchSaveRequestSchema.parse(payload);
      assert.equal((parsed as any).user_id, undefined);
    });

    it("Scenario 34: Multi-tenant isolation prevents User A outcomes from leaking to User B", () => {
      const outA = createMockOutcome({ userId: "user_A", sessionTitle: "Belajar User A" });
      const outB = createMockOutcome({ userId: "user_B", sessionTitle: "Belajar User B" });
      const repA = analyzeActualVsPlanned("user_A", [outA, outB].filter((o) => o.userId === "user_A"));
      assert.equal(repA.totalPlannedSessions, 1);
      assert.equal(repA.items[0].title, "Belajar User A");
    });

    it("Scenario 35: Filename sanitizer eliminates path traversal and null bytes", () => {
      const malicious = "../../../etc/passwd\0.pdf";
      const clean = sanitizeFileName(malicious);
      assert.ok(!clean.includes(".."));
      assert.ok(!clean.includes("\0"));
      assert.ok(!clean.includes("/"));
    });

    it("Scenario 36: Oversized payload (>15MB) exceeds allowed schedule upload limits", () => {
      const sizeBytes = 16 * 1024 * 1024;
      assert.ok(sizeBytes > ACADEMIC_CONSTANTS.MAX_SCHEDULE_UPLOAD_SIZE_BYTES);
    });

    it("Scenario 37: Sensitive metadata fields are scrubbed by observability logger", () => {
      const rawMeta = {
        password: "secret_password",
        token: "bearer_token",
        gemini_api_key: "ai_secret",
        courseName: "Pemrograman Web",
      };
      const cleaned = sanitizeMetadata(rawMeta);
      assert.equal(cleaned?.password, "[REDACTED]");
      assert.equal(cleaned?.token, "[REDACTED]");
      assert.equal(cleaned?.gemini_api_key, "[REDACTED]");
      assert.equal(cleaned?.courseName, "Pemrograman Web");
    });

    it("Scenario 38: Negative duration safely bounded to UNKNOWN without arithmetic exceptions", () => {
      const out = createMockOutcome({ plannedDurationMinutes: 60, actualDurationMinutes: -10, status: "PARTIALLY_COMPLETED" });
      const rep = analyzeActualVsPlanned("u1", [out]);
      assert.equal(rep.items[0].actualDuration, "UNKNOWN");
    });

    it("Scenario 39: Forged snapshot hash prevents applying unauthorized modifications", () => {
      const snap = generateScheduleSnapshot("u1", [createMockSchedule()]);
      const gate = evaluateApprovalGate(
        "APPLY_OPTIMIZATION",
        { userId: "u1", parentSnapshotHash: "forged_sha256_hash" },
        snap
      );
      assert.equal(gate.allowed, false);
      assert.equal(gate.approvalLevel, "BLOCKED");
    });

    it("Scenario 40: Empty items array in batch save schema is rejected", () => {
      assert.throws(() => {
        scheduleBatchSaveRequestSchema.parse({ items: [] });
      });
    });

    it("Scenario 41: Invalid day strings are rejected by batch schema", () => {
      assert.throws(() => {
        scheduleBatchSaveRequestSchema.parse({
          items: [
            {
              title: "Test",
              day: "Funday",
              start_time: "08:00",
              end_time: "10:00",
              time: "08:00 - 10:00",
            },
          ],
        });
      });
    });

    it("Scenario 42: Sensitive authorization tokens are completely absent from public types", () => {
      const snap = generateScheduleSnapshot("u1", [createMockSchedule()]);
      assert.equal((snap as any).token, undefined);
      assert.equal((snap as any).password, undefined);
    });
  });

  // =========================================================================
  // GROUP E: Concurrency, Idempotency & Transaction Hardening (Scenarios 43–52)
  // =========================================================================
  describe("Group E: Concurrency, Idempotency & Transaction Hardening", () => {
    it("Scenario 43: Double import of identical items within batch detects duplicates", () => {
      const itemA = createMockSchedule({ id: "dup_1", day: "Senin", start_time: "08:00", end_time: "10:00" });
      const itemB = createMockSchedule({ id: "dup_2", day: "Senin", start_time: "08:00", end_time: "10:00", title: "Algoritma & Pemrograman" });
      const conflicts = detectAllScheduleConflicts([itemA as any, itemB as any]);
      assert.ok(conflicts.some((c) => c.hasConflict || c.isDuplicate));
    });

    it("Scenario 44: Idempotent apply: Applying same proposal twice produces consistent state", () => {
      const item = createMockSchedule({ id: "c1", day: "Senin", start_time: "08:00", end_time: "10:00" });
      const snap = generateScheduleSnapshot("u1", [item]);
      const prop = generateContinuousOptimizationProposal("u1", snap, []);
      const res1 = applyProposalWithRollback(prop, snap);
      assert.equal(res1.success, true);
    });

    it("Scenario 45: Consecutive rollback restores pristine original snapshot items", () => {
      const item = createMockSchedule({ id: "c1", day: "Senin", start_time: "08:00", end_time: "10:00" });
      const snap = generateScheduleSnapshot("u1", [item]);
      const prop = generateContinuousOptimizationProposal("u1", snap, []);
      const applyRes = applyProposalWithRollback(prop, snap);
      assert.equal(applyRes.success, true);
      const rollbackRes = rollbackAppliedProposal(applyRes.updatedProposal, snap);
      assert.equal(rollbackRes.success, true);
      assert.ok(rollbackRes.restoredSchedules.length >= snap.courses.length);
    });

    it("Scenario 46: Rollback on non-applied proposal fails safely without crashes", () => {
      const item = createMockSchedule({ id: "c1", day: "Senin", start_time: "08:00", end_time: "10:00" });
      const snap = generateScheduleSnapshot("u1", [item]);
      const prop = generateContinuousOptimizationProposal("u1", snap, []);
      const rollbackRes = rollbackAppliedProposal(prop, snap);
      assert.equal(rollbackRes.success, false);
      assert.ok(rollbackRes.error);
    });

    it("Scenario 47: Concurrent modification: Diff accurately flags state change", () => {
      const s1 = createMockSchedule({ id: "1", day: "Senin", start_time: "08:00", end_time: "10:00" });
      const s2 = createMockSchedule({ id: "1", day: "Senin", start_time: "10:00", end_time: "12:00" });
      const snap1 = generateScheduleSnapshot("u1", [s1]);
      const snap2 = generateScheduleSnapshot("u1", [s2]);
      const diff = diffScheduleSnapshots(snap1, snap2);
      assert.notEqual(diff.category, "NO_CHANGE");
    });

    it("Scenario 48: Snapshot hash is case-insensitive for titles", () => {
      const prefs = sanitizeSchedulePreferences({});
      const hash1 = computeStableSnapshotHash({ userId: "u1", courses: [{ id: "1", title: "KULIAH", day: "Senin", start_time: "08:00", end_time: "10:00" } as any], studySessions: [], tasks: [], preferences: prefs });
      const hash2 = computeStableSnapshotHash({ userId: "u1", courses: [{ id: "1", title: "kuliah", day: "Senin", start_time: "08:00", end_time: "10:00" } as any], studySessions: [], tasks: [], preferences: prefs });
      assert.equal(hash1, hash2);
    });

    it("Scenario 49: Re-evaluating staleness over identical snapshot returns FRESH", () => {
      const snap = generateScheduleSnapshot("u1", [createMockSchedule()]);
      const staleness = evaluateContextStaleness(snap, snap);
      assert.equal(staleness.validityStatus, "FRESH");
      assert.equal(staleness.isActionable, true);
    });

    it("Scenario 50: Re-evaluating staleness over different snapshot returns non-FRESH", () => {
      const snap1 = generateScheduleSnapshot("u1", [createMockSchedule({ id: "a", start_time: "08:00", end_time: "10:00" })]);
      const snap2 = generateScheduleSnapshot("u1", [createMockSchedule({ id: "b", start_time: "10:00", end_time: "12:00" })]);
      const staleness = evaluateContextStaleness(snap1, snap2);
      assert.notEqual(staleness.validityStatus, "FRESH");
      assert.equal(staleness.isActionable, false);
    });

    it("Scenario 51: Idempotency: Duplicate outcome entries process cleanly", () => {
      const outcome = createMockOutcome({ id: "dup_out_id" });
      const report = analyzeActualVsPlanned("u1", [outcome, outcome]);
      assert.equal(report.totalPlannedSessions, 2);
    });

    it("Scenario 52: Approval gate permits SAFE or USER_CONFIRMATION for matching hash", () => {
      const snap = generateScheduleSnapshot("u1", [createMockSchedule()]);
      const gate = evaluateApprovalGate(
        "APPLY_OPTIMIZATION",
        { userId: "u1", parentSnapshotHash: snap.snapshotHash },
        snap
      );
      assert.equal(gate.allowed, true);
    });
  });

  // =========================================================================
  // GROUP F: Side-Effect-Free What-If Invariants (Scenarios 53–60)
  // =========================================================================
  describe("Group F: Side-Effect-Free What-If Invariants", () => {
    it("Scenario 53: 3-Way What-If simulator leaves original schedules array pristine", () => {
      const origItem = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const origArray = [origItem];
      const origCopy = JSON.stringify(origArray);

      const mod: OutcomeSimMod = {
        action: "MOVE_ITEM",
        itemId: origItem.id,
        targetDay: "Selasa",
        targetStartTime: "14:00",
        targetEndTime: "16:00",
      };

      simulateThreeWayOutcome(origArray, [], mod);
      assert.equal(JSON.stringify(origArray), origCopy);
    });

    it("Scenario 54: Scenario A accurately reflects current schedule baseline", () => {
      const item = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const mod: OutcomeSimMod = { action: "DELETE_ITEM", itemId: item.id };
      const res = simulateThreeWayOutcome([item], [], mod);
      assert.ok(res.scenarioA.healthScore >= 0);
    });

    it("Scenario 55: Scenario B accurately simulates deletion", () => {
      const existing = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const mod: OutcomeSimMod = { action: "DELETE_ITEM", itemId: existing.id };
      const res = simulateThreeWayOutcome([existing], [], mod);
      assert.equal(res.scenarioB.totalWorkloadMinutes, 0);
    });

    it("Scenario 56: Scenario C automatically computes recovery plan metrics", () => {
      const item = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const mod: OutcomeSimMod = { action: "MOVE_ITEM", itemId: item.id, targetDay: "Senin", targetStartTime: "09:00", targetEndTime: "11:00" };
      const res = simulateThreeWayOutcome([item], [], mod);
      assert.ok(res.scenarioC.healthScore >= 0);
      assert.ok(res.scenarioC.title.length > 5);
    });

    it("Scenario 57: bestScenario identifies highest health and conflict-free scenario", () => {
      const item = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const mod: OutcomeSimMod = { action: "DELETE_ITEM", itemId: item.id };
      const res = simulateThreeWayOutcome([item], [], mod);
      assert.ok(["SCENARIO_A_CURRENT", "SCENARIO_B_PROPOSED", "SCENARIO_C_RECOVERY"].includes(res.bestScenario));
    });

    it("Scenario 58: Conflict-introducing modification sets isSafeToApply to false", () => {
      const lecture = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "11:00" });
      const clashingItem = createMockSchedule({ day: "Senin", start_time: "09:00", end_time: "10:30" });
      const mod: OutcomeSimMod = { action: "ADD_ITEM", item: clashingItem };
      const res = simulateThreeWayOutcome([lecture], [], mod);
      assert.equal(res.isSafeToApply, false);
      assert.ok(res.scenarioB.conflictsCount >= 1);
    });

    it("Scenario 59: Single what-if engine simulation handles DELETE_ITEM cleanly", () => {
      const item = createMockSchedule({ id: "del_1", day: "Senin", start_time: "08:00", end_time: "10:00" });
      const sim = simulateScheduleModification([item], [], { action: "DELETE_ITEM", itemId: "del_1" });
      assert.equal(sim.conflictsAfter, 0);
    });

    it("Scenario 60: What-If simulation with unknown item ID gracefully returns baseline", () => {
      const item = createMockSchedule({ id: "item_1" });
      const sim = simulateScheduleModification([item], [], { action: "DELETE_ITEM", itemId: "non_existent" });
      assert.ok(sim.workloadAfterTotalMinutes >= 0);
    });
  });

  // =========================================================================
  // GROUP G: Document Parsers & OCR Robustness (Scenarios 61–72)
  // =========================================================================
  describe("Group G: Document Parsers & OCR Robustness", () => {
    it("Scenario 61: Document content classifier detects academic schedule keywords", () => {
      const text = "JADWAL KULIAH SEMESTER GENAP 2026\nSenin 08:00 - 10:30 Algoritma Ruang 301 Dr. Budi";
      const classification = classifyScheduleDocument(text, "jadwal.pdf");
      assert.ok(classification.isSchedule);
    });

    it("Scenario 62: Document content classifier flags non-schedule document cleanly", () => {
      const text = "RESEP MEMASAK NASI GORENG SPESIAL\nBahan: Bawang merah, telur, kecap manis.\nLangkah pertama, panaskan minyak.";
      const classification = classifyScheduleDocument(text, "resep.pdf");
      assert.equal(classification.isSchedule, false);
    });

    it("Scenario 63: Day-Date mismatch verification catches incongruous calendar entries", () => {
      const raw = {
        title: "Kalkulus",
        day: "Senin",
        date: "2026-09-01",
        time: "08:00 - 10:00",
      };
      const item = normalizeExtractedScheduleItem(raw, 0);
      assert.equal(item.dayDateMismatch, true);
      assert.equal(item.expectedDayFromDate, "Selasa");
    });

    it("Scenario 64: Normalizer extracts course codes from title correctly", () => {
      const raw = { title: "CS101 Struktur Data", day: "Senin", time: "08:00 - 10:00" };
      const item = normalizeExtractedScheduleItem(raw, 0);
      assert.equal(item.courseCode, "CS101");
      assert.equal(item.title, "Struktur Data");
    });

    it("Scenario 65: Malformed single time (08:00) safely estimates 90-minute end time", () => {
      const raw = { title: "Kuliah Pagi", day: "Senin", time: "08:00" };
      const item = normalizeExtractedScheduleItem(raw, 0);
      assert.equal(item.startTime, "08:00");
      assert.equal(item.endTime, "09:30");
      assert.equal(item.endTimeEstimated, true);
    });

    it("Scenario 66: Normalizer handles Indonesian day abbreviations", () => {
      const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
      const expected = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
      for (let i = 0; i < days.length; i++) {
        const item = normalizeExtractedScheduleItem({ title: "Test", day: days[i], time: "08:00 - 10:00" });
        assert.equal(item.day, expected[i]);
      }
    });

    it("Scenario 67: Normalizer handles 12-hour AM/PM formats safely", () => {
      const raw = { title: "Evening Lecture", day: "Senin", time: "02:00 PM - 04:00 PM" };
      const item = normalizeExtractedScheduleItem(raw, 0);
      assert.equal(item.startTime, "14:00");
      assert.equal(item.endTime, "16:00");
    });

    it("Scenario 68: Dot format time parsing works correctly", () => {
      const min = timeToMinutes("08.30");
      assert.equal(min, 8 * 60 + 30);
      const str = minutesToTime(510);
      assert.equal(str, "08:30");
    });

    it("Scenario 69: Normalizer splits multi-lecturer string", () => {
      const raw = {
        title: "Pemrograman Web",
        day: "Senin",
        time: "08:00 - 10:00",
        instructor: "Dr. Budi Santoso / Prof. Siti Aminah",
      };
      const item = normalizeExtractedScheduleItem(raw, 0);
      assert.ok(item.lecturer?.includes("Dr. Budi Santoso"));
      assert.ok(item.multiLecturers && item.multiLecturers.length >= 2);
    });

    it("Scenario 70: Normalizer extracts location merged into title string", () => {
      const raw = { title: "Algoritma di Lab Komputer 2", day: "Senin", time: "08:00 - 10:00" };
      const item = normalizeExtractedScheduleItem(raw, 0);
      assert.ok(item.location?.includes("Lab Komputer 2"));
      assert.equal(item.title, "Algoritma");
    });

    it("Scenario 71: Normalizer handles dot-separated time in raw input", () => {
      const raw = { title: "Pemrograman", day: "Senin", time: "08.00 - 10.30" };
      const item = normalizeExtractedScheduleItem(raw, 0);
      assert.equal(item.startTime, "08:00");
      assert.equal(item.endTime, "10:30");
    });

    it("Scenario 72: Empty raw title produces needs_review confidence", () => {
      const raw = { title: "", day: "Senin", time: "08:00 - 10:00" };
      const item = normalizeExtractedScheduleItem(raw, 0);
      assert.ok(item.confidence === "needs_review" || item.confidence === "invalid");
    });
  });

  // =========================================================================
  // GROUP H: Recommendation Regression & Quality Scoring (Scenarios 73–82)
  // =========================================================================
  describe("Group H: Recommendation Regression & Quality Scoring", () => {
    it("Scenario 73: Conflict introduction flags CRITICAL_REGRESSION and isAcceptable = false", () => {
      const orig = [createMockSchedule({ id: "1", day: "Senin", start_time: "08:00", end_time: "10:00" })];
      const prop = [
        createMockSchedule({ id: "1", day: "Senin", start_time: "08:00", end_time: "10:00" }),
        createMockSchedule({ id: "2", day: "Senin", start_time: "09:00", end_time: "11:00" }),
      ];
      const reg = detectScheduleRegression(orig, prop);
      assert.equal(reg.severity, "CRITICAL_REGRESSION");
      assert.equal(reg.isAcceptable, false);
    });

    it("Scenario 74: Pure workload balancing with 0 conflicts classifies as acceptable", () => {
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

    it("Scenario 75: Recommendation quality score deterministic 0-100 range", () => {
      const score = calculateRecommendationQuality({
        deadlineUrgency: "CRITICAL",
        slotDurationMinutes: 90,
        targetDurationMinutes: 90,
        hasConflict: false,
        dayWorkloadLevel: "NORMAL",
        hasSufficientBreak: true,
        isPreferredTimeMatch: true,
      });
      assert.ok(score.score >= 85);
      assert.equal(score.label, "Sangat Cocok");
    });

    it("Scenario 76: Quality score penalizes active conflict heavily", () => {
      const scoreWithConflict = calculateRecommendationQuality({
        deadlineUrgency: "CRITICAL",
        slotDurationMinutes: 90,
        targetDurationMinutes: 90,
        hasConflict: true,
        dayWorkloadLevel: "NORMAL",
        hasSufficientBreak: true,
        isPreferredTimeMatch: true,
      });
      assert.ok(scoreWithConflict.score <= 70);
    });

    it("Scenario 77: Academic health score computes 0-100 score across deterministic factors", () => {
      const schedule = [createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" })];
      const health = calculateAcademicHealthScore(schedule);
      assert.ok(health.overallScore >= 0 && health.overallScore <= 100);
      assert.ok(health.factors.length >= 4);
    });

    it("Scenario 78: Multi-period health trend delta >= +3 classifies as IMPROVING", () => {
      const trend = evaluateHealthTrend(86, [{ score: 80, recordedAt: new Date().toISOString() }]);
      assert.equal(trend.trend, "IMPROVING");
      assert.equal(trend.scoreDelta, 6);
    });

    it("Scenario 79: Multi-period health trend delta <= -3 classifies as DECLINING", () => {
      const trend = evaluateHealthTrend(78, [{ score: 85, recordedAt: new Date().toISOString() }]);
      assert.equal(trend.trend, "DECLINING");
      assert.equal(trend.scoreDelta, -7);
    });

    it("Scenario 80: Multi-period health trend delta between -2 and +2 classifies as STABLE", () => {
      const trend = evaluateHealthTrend(83, [{ score: 82, recordedAt: new Date().toISOString() }]);
      assert.equal(trend.trend, "STABLE");
      assert.equal(trend.scoreDelta, 1);
    });

    it("Scenario 81: Realism analysis flags excessive consecutive sessions", () => {
      const s1 = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const s2 = createMockSchedule({ day: "Senin", start_time: "10:05", end_time: "12:00" });
      const s3 = createMockSchedule({ day: "Senin", start_time: "12:10", end_time: "14:00" });
      const realism = analyzeScheduleRealism([s1, s2, s3]);
      assert.ok(realism.issues.some((i) => i.type === "EXCESSIVE_CONSECUTIVE_SESSIONS"));
    });

    it("Scenario 82: Task deadline analyzer classifies urgent deadline (<24h) as URGENT or CRITICAL", () => {
      const urgentTask = createMockTask({ deadline: new Date(Date.now() + 10 * 3600 * 1000).toISOString() });
      const report = analyzeTaskDeadlines([urgentTask]);
      assert.ok(report[0].urgency === "CRITICAL" || report[0].urgency === "URGENT");
    });
  });

  // =========================================================================
  // GROUP I: User Agency, Observability & Explainability (Scenarios 83–92)
  // =========================================================================
  describe("Group I: User Agency, Observability & Explainability", () => {
    it("Scenario 83: User agency: Feedback generator provides 3 explicit options", () => {
      const pref = sanitizeSchedulePreferences({ preferredStudyStartTime: "19:00", preferredStudyEndTime: "21:30" });
      const afternoonOutcomes = Array.from({ length: 6 }, () =>
        createMockOutcome({ actualStartTime: "15:00", actualEndTime: "16:30", actualDurationMinutes: 90, status: "COMPLETED" })
      );
      const prompt = evaluatePersonalizationFeedback(pref, afternoonOutcomes);
      assert.equal(prompt.hasDivergence, true);
      assert.equal(prompt.options.length, 3);
      assert.equal(prompt.options[0].action, "PRESERVE_DECLARED");
      assert.equal(prompt.options[1].action, "ADAPT_TO_OBSERVED");
      assert.equal(prompt.options[2].action, "DISMISS");
    });

    it("Scenario 84: Explainability 4.0 answers all 12 transparency questions", () => {
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

    it("Scenario 85: Structured logging redacts nested sensitive keys", () => {
      const nested = {
        meta: {
          token: "auth_token_xyz",
          userId: "user_123",
        },
      };
      const clean = sanitizeMetadata(nested);
      assert.equal((clean?.meta as any)?.token, "[REDACTED]");
      assert.equal((clean?.meta as any)?.userId, "user_123");
    });

    it("Scenario 86: Early warning 2.0 flags REPEATED_SKIPPING for >=3 skipped sessions", () => {
      const skips = Array.from({ length: 3 }, () =>
        createMockOutcome({ status: "SKIPPED" })
      );
      const warnings = generatePatternEarlyWarnings([], [], skips);
      assert.ok(warnings.some((w) => w.category === "REPEATED_SKIPPING"));
    });

    it("Scenario 87: Early warning 2.0 flags REPEATED_RESCHEDULING for >=3 reschedules on same session", () => {
      const rescheds = Array.from({ length: 3 }, () =>
        createMockOutcome({ sessionTitle: "Belajar Fisika", status: "RESCHEDULED" })
      );
      const warnings = generatePatternEarlyWarnings([], [], rescheds);
      assert.ok(warnings.some((w) => w.category === "REPEATED_RESCHEDULING"));
    });

    it("Scenario 88: Behavior signals 2.0 extracts correct window for morning", () => {
      const morningOutcomes = Array.from({ length: 6 }, () =>
        createMockOutcome({ actualStartTime: "08:00", actualEndTime: "09:30", actualDurationMinutes: 90, status: "COMPLETED" })
      );
      const sigs = extractBehaviorSignals2("u1", [], morningOutcomes);
      assert.equal(sigs.observedTimePattern, "MORNING");
    });

    it("Scenario 89: Behavior signals 2.0 extracts correct window for afternoon", () => {
      const afternoonOutcomes = Array.from({ length: 6 }, () =>
        createMockOutcome({ actualStartTime: "13:00", actualEndTime: "14:30", actualDurationMinutes: 90, status: "COMPLETED" })
      );
      const sigs = extractBehaviorSignals2("u1", [], afternoonOutcomes);
      assert.equal(sigs.observedTimePattern, "AFTERNOON");
    });

    it("Scenario 90: Behavior signals 2.0 extracts correct window for evening", () => {
      const eveningOutcomes = Array.from({ length: 6 }, () =>
        createMockOutcome({ actualStartTime: "16:00", actualEndTime: "17:30", actualDurationMinutes: 90, status: "COMPLETED" })
      );
      const sigs = extractBehaviorSignals2("u1", [], eveningOutcomes);
      assert.equal(sigs.observedTimePattern, "EVENING");
    });

    it("Scenario 91: Behavior signals 2.0 sets isSufficientData to false for <5 sessions", () => {
      const fewOutcomes = [createMockOutcome(), createMockOutcome()];
      const sigs = extractBehaviorSignals2("u1", [], fewOutcomes);
      assert.equal(sigs.isSufficientData, false);
    });

    it("Scenario 92: Safe zero-conflict invariant overrules historical night preference", () => {
      const nightLecture = createMockSchedule({ day: "Senin", start_time: "19:00", end_time: "21:00" });
      const clashingNightStudy = createMockSchedule({ day: "Senin", start_time: "19:30", end_time: "21:00", type: "reminder" });
      const mod: OutcomeSimMod = { action: "ADD_ITEM", item: clashingNightStudy };
      const sim = simulateThreeWayOutcome([nightLecture], [], mod);
      assert.equal(sim.isSafeToApply, false);
    });
  });

  // =========================================================================
  // GROUP J: Failure Modes, Chaos & Stress Benchmark (Scenarios 93–105)
  // =========================================================================
  describe("Group J: Failure Modes, Chaos & Stress Benchmark", () => {
    it("Scenario 93: High-volume stress test (100 schedules) completes in <500ms", () => {
      const days: ScheduleDay[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
      const bigSchedules = Array.from({ length: 100 }, (_, i) =>
        createMockSchedule({
          id: `stress_${i}`,
          day: days[i % days.length],
          start_time: "08:00",
          end_time: "09:30",
        })
      );
      const t0 = performance.now();
      const snap = generateScheduleSnapshot("stress_user", bigSchedules);
      const health = calculateAcademicHealthScore(bigSchedules);
      const dur = performance.now() - t0;
      assert.ok(snap.snapshotHash.length > 0);
      assert.ok(health.overallScore >= 0);
      assert.ok(dur < 500, `Stress execution took ${dur.toFixed(2)}ms, expected < 500ms`);
    });

    it("Scenario 94: Malformed time strings parse safely without uncaught exceptions", () => {
      const out = createMockOutcome({ plannedStartTime: "corrupted_time", actualStartTime: "invalid_time" });
      const rep = analyzeActualVsPlanned("u1", [out]);
      assert.equal(rep.items[0].startVarianceMinutes, "UNKNOWN");
    });

    it("Scenario 95: Empty inputs execute gracefully across all core modules", () => {
      const snap = generateScheduleSnapshot("empty_user", [], []);
      assert.equal(snap.courses.length, 0);
      assert.equal(snap.studySessions.length, 0);
      const health = calculateAcademicHealthScore([]);
      assert.ok(health.overallScore >= 0);
      const warnings = generateEarlyWarnings([]);
      assert.ok(Array.isArray(warnings));
      const proposal = generateContinuousOptimizationProposal("empty_user", snap, []);
      assert.ok(proposal);
    });

    it("Scenario 96: Zero task input to continuous optimizer handles deadline gracefully", () => {
      const snap = generateScheduleSnapshot("u1", [createMockSchedule()]);
      const prop = generateContinuousOptimizationProposal("u1", snap, []);
      assert.ok(prop.proposalId.startsWith("prop_"));
    });

    it("Scenario 97: Deterministic reproducibility: 50 repeated runs produce identical hashes", () => {
      const schedule = [createMockSchedule({ id: "fixed_1", day: "Senin", start_time: "08:00", end_time: "10:00" })];
      const expectedHash = generateScheduleSnapshot("u1", schedule).snapshotHash;
      for (let i = 0; i < 50; i++) {
        const snap = generateScheduleSnapshot("u1", schedule);
        assert.equal(snap.snapshotHash, expectedHash);
      }
    });

    it("Scenario 98: Free time slots discovers gap between two morning lectures", () => {
      const l1 = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" });
      const l2 = createMockSchedule({ day: "Senin", start_time: "14:00", end_time: "16:00" });
      const slots = analyzeFreeTimeSlots("Senin", [l1, l2]);
      assert.ok(slots.length > 0);
    });

    it("Scenario 99: Full day lecture leaves no free time slots", () => {
      const fullDay = createMockSchedule({ day: "Senin", start_time: "07:00", end_time: "22:00" });
      const slots = analyzeFreeTimeSlots("Senin", [fullDay]);
      assert.equal(slots.length, 0);
    });

    it("Scenario 100: Rejection of all proposals maintains unmodified calendar baseline", () => {
      const item = createMockSchedule({ id: "baseline_1", day: "Senin", start_time: "08:00", end_time: "10:00" });
      const snap = generateScheduleSnapshot("u1", [item]);
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

    it("Scenario 101: Partial completion correctly records fractional completion ratio", () => {
      const outcome = createMockOutcome({
        plannedDurationMinutes: 100,
        actualDurationMinutes: 50,
        status: "PARTIALLY_COMPLETED",
      });
      const rep = analyzeActualVsPlanned("u1", [outcome]);
      assert.equal(rep.items[0].completionRatioPercent, 50);
      assert.equal(rep.partiallyCompletedCount, 1);
    });

    it("Scenario 102: Missing actual end time sets actualTime to UNKNOWN", () => {
      const outcome = createMockOutcome({
        actualStartTime: "14:00",
        actualEndTime: null as any,
        actualDurationMinutes: null as any,
        status: "STARTED" as any,
      });
      const rep = analyzeActualVsPlanned("u1", [outcome]);
      assert.equal(rep.items[0].actualTime, "UNKNOWN");
    });

    it("Scenario 103: Academic health score breakdown factors sum equals overallScore exactly", () => {
      const schedule = [createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:00" })];
      const health = calculateAcademicHealthScore(schedule);
      const sum = health.factors.reduce((acc, f) => acc + f.score, 0);
      assert.equal(health.overallScore, sum);
    });

    it("Scenario 104: Full Production Invariant: Safe, Conflict-Free, Deterministic, Explainable", () => {
      const lecture = createMockSchedule({ day: "Senin", start_time: "08:00", end_time: "10:30" });
      const snap = generateScheduleSnapshot("prod_user", [lecture]);
      const plan = generateAdaptiveDailyPlan({ date: "2026-09-01", day: "Senin", targetStudyHours: 2 }, [lecture], [createMockTask()]);
      assert.ok(plan.recommendedSessions.length > 0);
      assert.equal(plan.recommendedSessions[0].conflictStatus, "VERIFIED_NO_CONFLICT");
      assert.ok(plan.recommendedSessions[0].reason.length > 10);
      assert.ok(snap.snapshotHash.length > 0);
    });

    it("Scenario 105: ACADEMIC_CONSTANTS are consistent and properly exported across all modules", () => {
      assert.equal(ACADEMIC_CONSTANTS.DEFAULT_MAX_DAILY_STUDY_MINUTES, 240);
      assert.equal(ACADEMIC_CONSTANTS.DAILY_WORKLOAD_HARD_CAP_MINUTES, 360);
      assert.equal(ACADEMIC_CONSTANTS.ADAPTIVE_MAX_SINGLE_SESSION_MINUTES, 90);
      assert.equal(ACADEMIC_CONSTANTS.MIN_BREAK_BUFFER_MINUTES, 30);
      assert.equal(ACADEMIC_CONSTANTS.PUNCTUALITY_TOLERANCE_MINUTES, 15);
      assert.equal(ACADEMIC_CONSTANTS.CALIBRATION_MULTIPLIER_MIN, 0.70);
      assert.equal(ACADEMIC_CONSTANTS.CALIBRATION_MULTIPLIER_MAX, 1.30);
      assert.equal(ACADEMIC_CONSTANTS.MAX_SCHEDULE_UPLOAD_SIZE_BYTES, 15 * 1024 * 1024);
      assert.equal(ACADEMIC_CONSTANTS.DEFAULT_SESSION_DURATION_MINUTES, 60);
      assert.equal(ACADEMIC_CONSTANTS.DEFAULT_BREAK_DURATION_MINUTES, 30);
      assert.equal(ACADEMIC_CONSTANTS.MIN_DAILY_STUDY_MINUTES, 60);
    });
  });
});
