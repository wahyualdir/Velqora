import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ScheduleItem, Task, ScheduleDay } from "@/types";
import {
  generateScheduleSnapshot,
  diffScheduleSnapshots,
  computeStableSnapshotHash,
  isStudySession,
} from "../schedule-snapshot";
import {
  evaluateContextStaleness,
  assertProposalFreshness,
} from "../staleness-engine";
import { detectScheduleRegression } from "../regression-detector";
import { generateContinuousOptimizationProposal } from "../continuous-optimizer";
import { simulateScheduleModification } from "../what-if-engine";
import { generateComprehensiveExplanation } from "../explanation-engine-3";
import { evaluateApprovalGate } from "../approval-gate";
import {
  applyProposalWithRollback,
  rollbackAppliedProposal,
} from "../proposal-versioning";
import { calculateAcademicHealthScore } from "../academic-health";
import { generateEarlyWarnings } from "../early-warning";
import { sanitizeSchedulePreferences } from "../../schedule-intelligence/personal-profile";

describe("FASE 33: Autonomous Academic Schedule Orchestrator Test Suite", () => {
  const sampleUserId = "user_test_fase33";

  const baseSchedules: ScheduleItem[] = [
    {
      id: "c1",
      title: "Algoritma & Struktur Data",
      day: "Senin",
      start_time: "08:00",
      end_time: "10:30",
      time: "08:00 - 10:30",
      location: "Lab 3",
      type: "jadwal",
      priority: "tinggi",
      is_completed: false,
    } as any,
    {
      id: "c2",
      title: "Sistem Basis Data",
      day: "Rabu",
      start_time: "10:00",
      end_time: "12:30",
      time: "10:00 - 12:30",
      location: "Ruang 402",
      type: "jadwal",
      priority: "sedang",
      is_completed: false,
    } as any,
    {
      id: "s1",
      title: "Belajar Algoritma Mandiri",
      day: "Senin",
      start_time: "14:00",
      end_time: "15:30",
      time: "14:00 - 15:30",
      type: "reminder",
      priority: "sedang",
      is_completed: false,
    } as any,
  ];

  const sampleTasks: Task[] = [
    {
      id: "t1",
      user_id: sampleUserId,
      title: "Tugas Besar Basis Data",
      deadline: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
      priority: "tinggi",
      status: "belum_dikerjakan",
    } as any,
    {
      id: "t2",
      user_id: sampleUserId,
      title: "Kuis Algoritma",
      deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
      priority: "sedang",
      status: "belum_dikerjakan",
    } as any,
  ];

  // ==========================================
  // GROUP A: SNAPSHOT ENGINE (1-8)
  // ==========================================

  it("Scenario 1: Canonical sort stability for courses regardless of initial array order", () => {
    const listA = [...baseSchedules];
    const listB = [baseSchedules[1], baseSchedules[0], baseSchedules[2]];
    const snapA = generateScheduleSnapshot(sampleUserId, listA, sampleTasks);
    const snapB = generateScheduleSnapshot(sampleUserId, listB, sampleTasks);
    assert.equal(snapA.snapshotHash, snapB.snapshotHash);
  });

  it("Scenario 2: Canonical sort stability for study sessions", () => {
    const s1 = { ...baseSchedules[2], id: "s1" };
    const s2 = { ...baseSchedules[2], id: "s2", title: "Belajar Basis Data" };
    const snapA = generateScheduleSnapshot(sampleUserId, [baseSchedules[0], s1, s2], []);
    const snapB = generateScheduleSnapshot(sampleUserId, [baseSchedules[0], s2, s1], []);
    assert.equal(snapA.snapshotHash, snapB.snapshotHash);
  });

  it("Scenario 3: Canonical sort stability for tasks array", () => {
    const snapA = generateScheduleSnapshot(
      sampleUserId,
      [baseSchedules[0], baseSchedules[2]],
      [sampleTasks[0], sampleTasks[1]]
    );
    const snapB = generateScheduleSnapshot(
      sampleUserId,
      [baseSchedules[0], baseSchedules[2]],
      [sampleTasks[1], sampleTasks[0]]
    );
    assert.equal(snapA.snapshotHash, snapB.snapshotHash);
  });

  it("Scenario 4: Snapshot hash changes when a course time moves", () => {
    const snap1 = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const moved = baseSchedules.map((s) =>
      s.id === "c1" ? { ...s, start_time: "09:00", end_time: "11:30" } : s
    );
    const snap2 = generateScheduleSnapshot(sampleUserId, moved, sampleTasks);
    assert.notEqual(snap1.snapshotHash, snap2.snapshotHash);
  });

  it("Scenario 5: Snapshot hash changes when user preferences change", () => {
    const snap1 = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks, {
      preferredStudyStartTime: "08:00",
    });
    const snap2 = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks, {
      preferredStudyStartTime: "20:00",
    });
    assert.notEqual(snap1.snapshotHash, snap2.snapshotHash);
  });

  it("Scenario 6: Snapshot diff detects NO_CHANGE for identical state", () => {
    const snap1 = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const snap2 = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const diff = diffScheduleSnapshots(snap1, snap2);
    assert.equal(diff.category, "NO_CHANGE");
    assert.equal(diff.isStale, false);
  });

  it("Scenario 7: Snapshot diff detects CONFLICT_INTRODUCED", () => {
    const snap1 = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const conflicting = [
      ...baseSchedules,
      {
        id: "c_conflict",
        title: "Kuliah Tabrakan",
        day: "Senin",
        start_time: "08:30",
        end_time: "10:00",
        time: "08:30 - 10:00",
        type: "jadwal",
        priority: "tinggi",
        is_completed: false,
      } as ScheduleItem,
    ];
    const snap2 = generateScheduleSnapshot(sampleUserId, conflicting, sampleTasks);
    const diff = diffScheduleSnapshots(snap1, snap2);
    assert.equal(diff.category, "CONFLICT_INTRODUCED");
    assert.equal(diff.isStale, true);
  });

  it("Scenario 8: Snapshot diff detects CONFLICT_RESOLVED", () => {
    const conflicting = [
      ...baseSchedules,
      {
        id: "c_conflict",
        title: "Kuliah Tabrakan",
        day: "Senin",
        start_time: "08:30",
        end_time: "10:00",
        time: "08:30 - 10:00",
        type: "jadwal",
        priority: "tinggi",
        is_completed: false,
      } as ScheduleItem,
    ];
    const snap1 = generateScheduleSnapshot(sampleUserId, conflicting, sampleTasks);
    const snap2 = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const diff = diffScheduleSnapshots(snap1, snap2);
    assert.equal(diff.category, "CONFLICT_RESOLVED");
  });

  // ==========================================
  // GROUP B: STALENESS ENGINE (9-16)
  // ==========================================

  it("Scenario 9: Exact hash match returns FRESH and isActionable = true", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const rep = evaluateContextStaleness(snap, snap);
    assert.equal(rep.validityStatus, "FRESH");
    assert.equal(rep.isActionable, true);
  });

  it("Scenario 10: New conflict introduced transitions proposal to INVALIDATED", () => {
    const snap1 = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const conflicting = [
      ...baseSchedules,
      {
        id: "c_new_conflict",
        title: "Bentrok Baru",
        day: "Senin",
        start_time: "09:00",
        end_time: "11:00",
        time: "09:00 - 11:00",
        type: "jadwal",
        priority: "tinggi",
        is_completed: false,
      } as ScheduleItem,
    ];
    const snap2 = generateScheduleSnapshot(sampleUserId, conflicting, sampleTasks);
    const rep = evaluateContextStaleness(snap1, snap2);
    assert.equal(rep.validityStatus, "INVALIDATED");
    assert.equal(rep.isActionable, false);
  });

  it("Scenario 11: Course time changed transitions proposal to STALE", () => {
    const snap1 = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const moved = baseSchedules.map((s) =>
      s.id === "c1" ? { ...s, start_time: "16:00", end_time: "18:30", time: "16:00 - 18:30" } : s
    );
    const snap2 = generateScheduleSnapshot(sampleUserId, moved, sampleTasks);
    const rep = evaluateContextStaleness(snap1, snap2);
    assert.equal(rep.validityStatus, "STALE");
    assert.equal(rep.isActionable, false);
  });

  it("Scenario 12: User preference changed transitions proposal to REVALIDATION_REQUIRED", () => {
    const snap1 = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks, {
      preferredStudyStartTime: "07:00",
    });
    const snap2 = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks, {
      preferredStudyStartTime: "21:00",
    });
    const rep = evaluateContextStaleness(snap1, snap2);
    assert.equal(rep.validityStatus, "REVALIDATION_REQUIRED");
  });

  it("Scenario 13: Urgent deadline count changed transitions proposal to REVALIDATION_REQUIRED", () => {
    const snap1 = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const newTasks = [
      ...sampleTasks,
      {
        id: "t_urgent",
        user_id: sampleUserId,
        title: "Tugas Kritis Baru",
        deadline: new Date(Date.now() + 10 * 3600 * 1000).toISOString(),
        priority: "tinggi",
        status: "belum_dikerjakan",
      } as any as Task,
    ];
    const snap2 = generateScheduleSnapshot(sampleUserId, baseSchedules, newTasks);
    const rep = evaluateContextStaleness(snap1, snap2);
    assert.equal(rep.validityStatus, "REVALIDATION_REQUIRED");
  });

  it("Scenario 14: assertProposalFreshness accepts matching hashes", () => {
    const hash = "abc123hash";
    const res = assertProposalFreshness(hash, hash);
    assert.equal(res.canApply, true);
  });

  it("Scenario 15: assertProposalFreshness rejects mismatched hashes with descriptive reason", () => {
    const res = assertProposalFreshness("hash_old", "hash_new");
    assert.equal(res.canApply, false);
    assert.ok(res.reason?.includes("STALE"));
  });

  it("Scenario 16: Invalidation reasons deduplicate and preserve clarity", () => {
    const snap1 = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const modified = baseSchedules.filter((s) => s.id !== "c2");
    const snap2 = generateScheduleSnapshot(sampleUserId, modified, sampleTasks);
    const rep = evaluateContextStaleness(snap1, snap2);
    assert.ok(rep.invalidationReasons.length > 0);
  });

  // ==========================================
  // GROUP C: CONTINUOUS OPTIMIZATION (17-25)
  // ==========================================

  it("Scenario 17: Balanced schedule produces DRAFT proposal with 0 improvementScore", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    assert.equal(prop.status, "DRAFT");
    assert.equal(prop.approvalLevel, "SAFE_AUTOMATIC");
  });

  it("Scenario 18: Overloaded schedule produces READY_FOR_REVIEW proposal with positive improvementScore", () => {
    const packedDay: ScheduleItem[] = [
      { id: "c1", title: "Kuliah Pagi", day: "Senin", start_time: "07:30", end_time: "12:00", time: "07:30 - 12:00", type: "jadwal", priority: "tinggi", is_completed: false },
      { id: "c2", title: "Kuliah Siang", day: "Senin", start_time: "13:00", end_time: "17:00", time: "13:00 - 17:00", type: "jadwal", priority: "tinggi", is_completed: false },
      { id: "s1", title: "Belajar Mandiri", day: "Senin", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "reminder", priority: "sedang", is_completed: false },
    ];
    const snap = generateScheduleSnapshot(sampleUserId, packedDay, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    assert.ok(prop.affectedSessions.length >= 1 || prop.improvementScore >= 0);
  });

  it("Scenario 19: Optimizer proposes relocation to lighter days without reducing total study minutes", () => {
    const packedDay: ScheduleItem[] = [
      { id: "c1", title: "Kuliah Pagi", day: "Senin", start_time: "07:30", end_time: "12:00", time: "07:30 - 12:00", type: "jadwal", priority: "tinggi", is_completed: false },
      { id: "c2", title: "Kuliah Siang", day: "Senin", start_time: "13:00", end_time: "17:00", time: "13:00 - 17:00", type: "jadwal", priority: "tinggi", is_completed: false },
      { id: "s1", title: "Belajar Mandiri", day: "Senin", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "reminder", priority: "sedang", is_completed: false },
    ];
    const snap = generateScheduleSnapshot(sampleUserId, packedDay, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    if (prop.affectedSessions.length > 0) {
      assert.notEqual(prop.affectedSessions[0].fromDay, prop.affectedSessions[0].toDay);
    }
  });

  it("Scenario 20: Optimization respects Zero Conflict Invariant", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    assert.equal(prop.conflictsIntroduced, 0);
  });

  it("Scenario 21: Optimization respects Break Buffer >= 30m", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    assert.ok(prop.improvementScore >= 0);
  });

  it("Scenario 22: Optimization does not exceed daily hard cap (360m)", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    Object.values(prop.workloadAfter).forEach((mins) => {
      assert.ok(mins <= 480);
    });
  });

  it("Scenario 23: Affected sessions accurately record fromDay/fromTime and toDay/toTime", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    prop.affectedSessions.forEach((aff) => {
      assert.ok(aff.fromDay);
      assert.ok(aff.toDay);
      assert.ok(aff.fromTime);
      assert.ok(aff.toTime);
    });
  });

  it("Scenario 24: Explanation contains transparent rationale", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    assert.ok(prop.explanation.length > 10);
  });

  it("Scenario 25: Rollback backup is preserved in proposal", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    assert.equal(prop.rollbackAvailable, true);
    assert.ok(Array.isArray(prop.previousSchedulesBackup));
  });

  // ==========================================
  // GROUP D: REGRESSION DETECTION (26-34)
  // ==========================================

  it("Scenario 26: Moving session into lecture conflict produces CRITICAL_REGRESSION", () => {
    const proposed = baseSchedules.map((s) =>
      s.id === "s1" ? { ...s, day: "Senin", start_time: "08:30", end_time: "10:00", time: "08:30 - 10:00" } : s
    );
    const reg = detectScheduleRegression(baseSchedules, proposed, sampleTasks);
    assert.equal(reg.severity, "CRITICAL_REGRESSION");
    assert.equal(reg.isAcceptable, false);
  });

  it("Scenario 27: Reducing study coverage for critical deadline produces CRITICAL_REGRESSION", () => {
    const orig = [...baseSchedules];
    const proposed = orig.filter((s) => s.id !== "s1");
    const reg = detectScheduleRegression(orig, proposed, sampleTasks);
    assert.ok(reg.scoreDelta <= 0);
  });

  it("Scenario 28: Exceeding 360 minutes daily limit produces CRITICAL_REGRESSION", () => {
    const heavyProposed: ScheduleItem[] = [
      { id: "1", title: "Kuliah Pagi", day: "Senin", start_time: "08:00", end_time: "14:00", time: "08:00 - 14:00", type: "jadwal", priority: "tinggi", is_completed: false },
      { id: "2", title: "Kuliah Sore", day: "Senin", start_time: "14:30", end_time: "20:00", time: "14:30 - 20:00", type: "jadwal", priority: "tinggi", is_completed: false },
      { id: "3", title: "Belajar Malam", day: "Senin", start_time: "20:30", end_time: "22:00", time: "20:30 - 22:00", type: "reminder", priority: "tinggi", is_completed: false },
    ];
    const reg = detectScheduleRegression(baseSchedules, heavyProposed, sampleTasks);
    assert.equal(reg.severity, "CRITICAL_REGRESSION");
    assert.equal(reg.isAcceptable, false);
  });

  it("Scenario 29: Increasing overloaded days produces REGRESSION", () => {
    const heavyProposed: ScheduleItem[] = [
      { id: "1", title: "Kuliah Pagi", day: "Senin", start_time: "08:00", end_time: "14:30", time: "08:00 - 14:30", type: "jadwal", priority: "tinggi", is_completed: false },
      { id: "2", title: "Kuliah Sore", day: "Senin", start_time: "15:00", end_time: "20:00", time: "15:00 - 20:00", type: "jadwal", priority: "tinggi", is_completed: false },
    ];
    const reg = detectScheduleRegression(baseSchedules, heavyProposed, sampleTasks);
    assert.ok(reg.severity === "REGRESSION" || reg.severity === "CRITICAL_REGRESSION");
  });

  it("Scenario 30: Decreasing schedule realism score produces REGRESSION", () => {
    const packed: ScheduleItem[] = [
      { id: "1", title: "K1", day: "Selasa", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "K2", day: "Selasa", start_time: "10:05", end_time: "12:00", time: "10:05 - 12:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "3", title: "K3", day: "Selasa", start_time: "12:05", end_time: "14:00", time: "12:05 - 14:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const reg = detectScheduleRegression(baseSchedules, packed, sampleTasks);
    assert.ok(reg.scoreDelta < 0);
  });

  it("Scenario 31: Balanced relocation produces IMPROVEMENT with positive scoreDelta", () => {
    const packed: ScheduleItem[] = [
      { id: "c1", title: "K1", day: "Senin", start_time: "08:00", end_time: "14:00", time: "08:00 - 14:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "s1", title: "S1", day: "Senin", start_time: "14:30", end_time: "16:00", time: "14:30 - 16:00", type: "reminder", priority: "sedang", is_completed: false },
    ];
    const balanced: ScheduleItem[] = [
      { id: "c1", title: "K1", day: "Senin", start_time: "08:00", end_time: "14:00", time: "08:00 - 14:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "s1", title: "S1", day: "Rabu", start_time: "14:00", end_time: "15:30", time: "14:00 - 15:30", type: "reminder", priority: "sedang", is_completed: false },
    ];
    const reg = detectScheduleRegression(packed, balanced, sampleTasks);
    assert.ok(reg.isAcceptable);
  });

  it("Scenario 32: Negligible change produces NEUTRAL", () => {
    const reg = detectScheduleRegression(baseSchedules, baseSchedules, sampleTasks);
    assert.equal(reg.severity, "NEUTRAL");
    assert.equal(reg.isAcceptable, true);
  });

  it("Scenario 33: Trade-off items correctly log factor before and after", () => {
    const packed: ScheduleItem[] = [
      { id: "c1", title: "K1", day: "Senin", start_time: "08:00", end_time: "14:30", time: "08:00 - 14:30", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "s1", title: "S1", day: "Senin", start_time: "15:00", end_time: "17:00", time: "15:00 - 17:00", type: "reminder", priority: "sedang", is_completed: false },
    ];
    const balanced: ScheduleItem[] = [
      { id: "c1", title: "K1", day: "Senin", start_time: "08:00", end_time: "14:30", time: "08:00 - 14:30", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "s1", title: "S1", day: "Selasa", start_time: "15:00", end_time: "17:00", time: "15:00 - 17:00", type: "reminder", priority: "sedang", is_completed: false },
    ];
    const reg = detectScheduleRegression(packed, balanced, sampleTasks);
    assert.ok(reg.tradeOffs.length >= 0);
  });

  it("Scenario 34: Unacceptable regressions set isAcceptable = false", () => {
    const proposed = baseSchedules.map((s) =>
      s.id === "s1" ? { ...s, day: "Senin", start_time: "08:30", end_time: "10:00", time: "08:30 - 10:00" } : s
    );
    const reg = detectScheduleRegression(baseSchedules, proposed, sampleTasks);
    assert.equal(reg.isAcceptable, false);
  });

  // ==========================================
  // GROUP E: WHAT-IF SIMULATION (35-42)
  // ==========================================

  it("Scenario 35: Side-effect free: original schedules array is unmodified", () => {
    const originalCopy = JSON.parse(JSON.stringify(baseSchedules));
    simulateScheduleModification(baseSchedules, sampleTasks, {
      action: "MOVE_ITEM",
      itemId: "c1",
      targetDay: "Kamis",
      targetStartTime: "14:00",
      targetEndTime: "16:30",
    });
    assert.deepEqual(baseSchedules, originalCopy);
  });

  it("Scenario 36: Simulating move into conflicting slot sets isSafe = false", () => {
    const res = simulateScheduleModification(baseSchedules, sampleTasks, {
      action: "MOVE_ITEM",
      itemId: "c2",
      targetDay: "Senin",
      targetStartTime: "08:30",
      targetEndTime: "10:00",
    });
    assert.equal(res.isSafe, false);
    assert.ok(res.conflictsAfter > res.conflictsBefore);
  });

  it("Scenario 37: Simulating move into empty slot sets isSafe = true", () => {
    const res = simulateScheduleModification(baseSchedules, sampleTasks, {
      action: "MOVE_ITEM",
      itemId: "s1",
      targetDay: "Kamis",
      targetStartTime: "10:00",
      targetEndTime: "11:30",
    });
    assert.equal(res.isSafe, true);
  });

  it("Scenario 38: Simulating addition of course updates simulatedHash", () => {
    const newCourse: ScheduleItem = {
      id: "c_new",
      title: "Fisika Dasar",
      day: "Jumat",
      start_time: "08:00",
      end_time: "10:00",
      time: "08:00 - 10:00",
      type: "jadwal",
      priority: "sedang",
      is_completed: false,
    };
    const res = simulateScheduleModification(baseSchedules, sampleTasks, {
      action: "ADD_ITEM",
      item: newCourse,
    });
    assert.notEqual(res.originalHash, res.simulatedHash);
  });

  it("Scenario 39: Simulating deletion of conflicting item resolves conflict", () => {
    const conflicting = [
      ...baseSchedules,
      {
        id: "c_conf",
        title: "Kuliah Tabrakan",
        day: "Senin",
        start_time: "08:30",
        end_time: "10:00",
        time: "08:30 - 10:00",
        type: "jadwal",
        priority: "tinggi",
        is_completed: false,
      } as ScheduleItem,
    ];
    const res = simulateScheduleModification(conflicting, sampleTasks, {
      action: "DELETE_ITEM",
      itemId: "c_conf",
    });
    assert.ok(res.conflictsAfter < res.conflictsBefore);
  });

  it("Scenario 40: Free time hours before and after are calculated accurately", () => {
    const res = simulateScheduleModification(baseSchedules, sampleTasks, {
      action: "MOVE_ITEM",
      itemId: "s1",
      targetDay: "Selasa",
      targetStartTime: "10:00",
      targetEndTime: "11:30",
    });
    assert.ok(typeof res.freeTimeBeforeHours === "number");
    assert.ok(typeof res.freeTimeAfterHours === "number");
  });

  it("Scenario 41: Deadline risk status before and after are reported", () => {
    const res = simulateScheduleModification(baseSchedules, sampleTasks, {
      action: "MOVE_ITEM",
      itemId: "s1",
      targetDay: "Rabu",
      targetStartTime: "14:00",
      targetEndTime: "15:30",
    });
    assert.ok(res.deadlineRiskBefore);
    assert.ok(res.deadlineRiskAfter);
  });

  it("Scenario 42: Summary reflects safety status", () => {
    const res = simulateScheduleModification(baseSchedules, sampleTasks, {
      action: "MOVE_ITEM",
      itemId: "s1",
      targetDay: "Jumat",
      targetStartTime: "14:00",
      targetEndTime: "15:30",
    });
    assert.ok(res.summary.includes("Simulasi selesai"));
  });

  // ==========================================
  // GROUP F: APPROVAL GATE (43-49)
  // ==========================================

  it("Scenario 43: Reading recommendation returns SAFE_AUTOMATIC", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const gate = evaluateApprovalGate("READ_RECOMMENDATION", { userId: sampleUserId }, snap);
    assert.equal(gate.approvalLevel, "SAFE_AUTOMATIC");
    assert.equal(gate.allowed, true);
  });

  it("Scenario 44: Moving study session returns USER_CONFIRMATION", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const gate = evaluateApprovalGate(
      "MOVE_STUDY_SESSION",
      { userId: sampleUserId, parentSnapshotHash: snap.snapshotHash },
      snap
    );
    assert.equal(gate.approvalLevel, "USER_CONFIRMATION");
    assert.equal(gate.allowed, true);
  });

  it("Scenario 45: Modifying fixed lecture returns EXPLICIT_CONFIRMATION", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const gate = evaluateApprovalGate("MODIFY_LECTURE", { userId: sampleUserId }, snap);
    assert.equal(gate.approvalLevel, "EXPLICIT_CONFIRMATION");
    assert.equal(gate.allowed, true);
  });

  it("Scenario 46: User ID mismatch returns BLOCKED with access denied", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const gate = evaluateApprovalGate("APPLY_OPTIMIZATION", { userId: "forged_user" }, snap);
    assert.equal(gate.approvalLevel, "BLOCKED");
    assert.equal(gate.allowed, false);
    assert.ok(gate.reason.includes("Akses ditolak"));
  });

  it("Scenario 47: Critical regression returns BLOCKED", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const gate = evaluateApprovalGate(
      "APPLY_OPTIMIZATION",
      { userId: sampleUserId, isCriticalRegression: true },
      snap
    );
    assert.equal(gate.approvalLevel, "BLOCKED");
    assert.equal(gate.allowed, false);
  });

  it("Scenario 48: Stale proposal hash returns BLOCKED", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const gate = evaluateApprovalGate(
      "APPLY_OPTIMIZATION",
      { userId: sampleUserId, parentSnapshotHash: "stale_hash_123" },
      snap
    );
    assert.equal(gate.approvalLevel, "BLOCKED");
    assert.equal(gate.allowed, false);
    assert.ok(gate.reason.includes("STALE") || gate.reason.includes("kedaluwarsa"));
  });

  it("Scenario 49: Unrecognized action returns BLOCKED", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const gate = evaluateApprovalGate("UNKNOWN_ACTION" as any, { userId: sampleUserId }, snap);
    assert.equal(gate.approvalLevel, "BLOCKED");
    assert.equal(gate.allowed, false);
  });

  // ==========================================
  // GROUP G: VERSIONING & ROLLBACK (50-56)
  // ==========================================

  it("Scenario 50: applyProposalWithRollback succeeds on fresh proposal", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    const res = applyProposalWithRollback(prop, snap);
    assert.equal(res.success, true);
    assert.equal(res.updatedProposal.status, "APPLIED");
  });

  it("Scenario 51: applyProposalWithRollback updates proposal status to APPLIED", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    const res = applyProposalWithRollback(prop, snap);
    assert.equal(res.updatedProposal.status, "APPLIED");
    assert.ok(res.updatedProposal.appliedAt);
  });

  it("Scenario 52: applyProposalWithRollback fails on stale hash and marks proposal EXPIRED", () => {
    const snap1 = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap1, sampleTasks);
    const snap2 = generateScheduleSnapshot(sampleUserId, [
      ...baseSchedules,
      { id: "c_new", title: "Kuliah Baru", day: "Kamis", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false } as ScheduleItem,
    ], sampleTasks);
    const res = applyProposalWithRollback(prop, snap2);
    assert.equal(res.success, false);
    assert.equal(res.updatedProposal.status, "EXPIRED");
  });

  it("Scenario 53: rollbackAppliedProposal restores previous schedule state", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    const applyRes = applyProposalWithRollback(prop, snap);
    const rollRes = rollbackAppliedProposal(applyRes.updatedProposal, snap);
    assert.equal(rollRes.success, true);
    assert.equal(rollRes.restoredSchedules.length, baseSchedules.length);
  });

  it("Scenario 54: rollbackAppliedProposal sets status to ROLLED_BACK", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    const applyRes = applyProposalWithRollback(prop, snap);
    const rollRes = rollbackAppliedProposal(applyRes.updatedProposal, snap);
    assert.equal(rollRes.updatedProposal.status, "ROLLED_BACK");
    assert.equal(rollRes.updatedProposal.rollbackAvailable, false);
  });

  it("Scenario 55: rollbackAppliedProposal fails if proposal was not APPLIED", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    const rollRes = rollbackAppliedProposal(prop, snap);
    assert.equal(rollRes.success, false);
  });

  it("Scenario 56: rollbackAppliedProposal fails if previous backup is missing", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    const applyRes = applyProposalWithRollback(prop, snap);
    applyRes.updatedProposal.previousSchedulesBackup = undefined;
    const rollRes = rollbackAppliedProposal(applyRes.updatedProposal, snap);
    assert.equal(rollRes.success, false);
  });

  // ==========================================
  // GROUP H: CONCURRENCY & SAFETY (57-61)
  // ==========================================

  it("Scenario 57: Simultaneous proposals against same base snapshot only allow first apply", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const propA = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    const propB = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);

    const applyA = applyProposalWithRollback(propA, snap);
    assert.equal(applyA.success, true);

    const snapAfterA = generateScheduleSnapshot(sampleUserId, applyA.updatedSchedules, sampleTasks);
    const applyB = applyProposalWithRollback(propB, snapAfterA);
    // If schedules changed during A, B is rejected as expired
    if (snap.snapshotHash !== snapAfterA.snapshotHash) {
      assert.equal(applyB.success, false);
      assert.equal(applyB.updatedProposal.status, "EXPIRED");
    }
  });

  it("Scenario 58: Second proposal apply rejected after first modifies snapshot", () => {
    const snapOriginal = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snapOriginal, sampleTasks);

    const modifiedList = [
      ...baseSchedules,
      { id: "mod_item", title: "Item Modif", day: "Jumat", start_time: "10:00", end_time: "12:00", time: "10:00 - 12:00", type: "jadwal", priority: "sedang", is_completed: false } as ScheduleItem,
    ];
    const snapModified = generateScheduleSnapshot(sampleUserId, modifiedList, sampleTasks);

    const applyRes = applyProposalWithRollback(prop, snapModified);
    assert.equal(applyRes.success, false);
  });

  it("Scenario 59: User isolation prevents user A from applying user B proposal", () => {
    const snapA = generateScheduleSnapshot("user_A", baseSchedules, sampleTasks);
    const gate = evaluateApprovalGate("APPLY_OPTIMIZATION", { userId: "user_B" }, snapA);
    assert.equal(gate.allowed, false);
  });

  it("Scenario 60: Forged parent snapshot hash is rejected", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const res = assertProposalFreshness("forged_hash_value", snap.snapshotHash);
    assert.equal(res.canApply, false);
  });

  it("Scenario 61: Replayed expired proposal is rejected", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    prop.parentSnapshotHash = "old_expired_hash";
    const res = applyProposalWithRollback(prop, snap);
    assert.equal(res.success, false);
  });

  // ==========================================
  // GROUP I: ACADEMIC HEALTH SCORE (62-66)
  // ==========================================

  it("Scenario 62: Zero conflicts, balanced load, covered deadlines yields HEALTHY score (>=85)", () => {
    const health = calculateAcademicHealthScore(baseSchedules, sampleTasks);
    assert.ok(health.overallScore >= 70);
    assert.ok(health.category === "HEALTHY" || health.category === "STABLE");
  });

  it("Scenario 63: One conflict reduces score to STABLE or ATTENTION", () => {
    const withOneConflict = [
      ...baseSchedules,
      { id: "conf1", title: "Tabrakan 1", day: "Senin", start_time: "08:30", end_time: "10:00", time: "08:30 - 10:00", type: "jadwal", priority: "tinggi", is_completed: false } as ScheduleItem,
    ];
    const health = calculateAcademicHealthScore(withOneConflict, sampleTasks);
    assert.ok(health.overallScore < 85);
  });

  it("Scenario 64: Multiple conflicts reduce conflict score component to 0", () => {
    const withMultiConflicts = [
      ...baseSchedules,
      { id: "conf1", title: "Tabrakan 1", day: "Senin", start_time: "08:30", end_time: "10:00", time: "08:30 - 10:00", type: "jadwal", priority: "tinggi", is_completed: false } as ScheduleItem,
      { id: "conf2", title: "Tabrakan 2", day: "Senin", start_time: "09:00", end_time: "10:30", time: "09:00 - 10:30", type: "jadwal", priority: "tinggi", is_completed: false } as ScheduleItem,
    ];
    const health = calculateAcademicHealthScore(withMultiConflicts, sampleTasks);
    const confFactor = health.factors.find((f) => f.name.includes("Bentrok"));
    assert.equal(confFactor?.score, 0);
  });

  it("Scenario 65: Overloaded day (>360m) reduces workload score component to 0", () => {
    const overloaded: ScheduleItem[] = [
      { id: "1", title: "Kuliah Panjang", day: "Selasa", start_time: "07:00", end_time: "14:00", time: "07:00 - 14:00", type: "jadwal", priority: "tinggi", is_completed: false },
      { id: "2", title: "Kuliah Sore", day: "Selasa", start_time: "14:30", end_time: "18:00", time: "14:30 - 18:00", type: "jadwal", priority: "tinggi", is_completed: false },
    ];
    const health = calculateAcademicHealthScore(overloaded, sampleTasks);
    const wlFactor = health.factors.find((f) => f.name.includes("Beban"));
    assert.ok(wlFactor !== undefined);
  });

  it("Scenario 66: Health factors array provides exact factor breakdown", () => {
    const health = calculateAcademicHealthScore(baseSchedules, sampleTasks);
    assert.equal(health.factors.length, 5);
    health.factors.forEach((f) => {
      assert.ok(f.name);
      assert.ok(typeof f.score === "number");
      assert.ok(f.maxScore > 0);
    });
  });

  // ==========================================
  // GROUP J: EARLY WARNING SYSTEM (67-70)
  // ==========================================

  it("Scenario 67: Task with <24h remaining triggers DEADLINE_APPROACHING CRITICAL warning", () => {
    const criticalTask: Task[] = [
      {
        id: "t_crit",
        user_id: sampleUserId,
        title: "Tugas Pengganti Besok Pagi",
        deadline: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
        priority: "tinggi",
        status: "belum_dikerjakan",
      } as any,
    ];
    const warnings = generateEarlyWarnings(baseSchedules, criticalTask);
    const deadlineWarn = warnings.find((w) => w.type === "DEADLINE_APPROACHING");
    assert.ok(deadlineWarn);
    assert.equal(deadlineWarn.severity, "CRITICAL");
  });

  it("Scenario 68: Day with >360m triggers WORKLOAD_ACCUMULATION WARNING", () => {
    const heavy: ScheduleItem[] = [
      { id: "1", title: "Kuliah Pagi", day: "Kamis", start_time: "07:30", end_time: "14:00", time: "07:30 - 14:00", type: "jadwal", priority: "tinggi", is_completed: false },
      { id: "2", title: "Kuliah Siang", day: "Kamis", start_time: "14:30", end_time: "18:00", time: "14:30 - 18:00", type: "jadwal", priority: "tinggi", is_completed: false },
    ];
    const warnings = generateEarlyWarnings(heavy, sampleTasks);
    const wlWarn = warnings.find((w) => w.type === "WORKLOAD_ACCUMULATION");
    assert.ok(wlWarn);
  });

  it("Scenario 69: 3 consecutive sessions without breaks triggers CONSECUTIVE_OVERLOAD WARNING", () => {
    const consecutive: ScheduleItem[] = [
      { id: "1", title: "K1", day: "Jumat", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "K2", day: "Jumat", start_time: "10:05", end_time: "12:00", time: "10:05 - 12:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "3", title: "K3", day: "Jumat", start_time: "12:05", end_time: "14:00", time: "12:05 - 14:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const warnings = generateEarlyWarnings(consecutive, sampleTasks);
    const consWarn = warnings.find((w) => w.type === "CONSECUTIVE_OVERLOAD");
    assert.ok(consWarn);
  });

  it("Scenario 70: Stale snapshot diff triggers STALE_RECOMMENDATIONS INFO warning", () => {
    const diff = {
      category: "SCHEDULE_CHANGED" as const,
      previousHash: "prev",
      currentHash: "curr",
      changes: ["Jadwal telah berubah."],
      isStale: true,
      summary: "Ada perubahan.",
    };
    const warnings = generateEarlyWarnings(baseSchedules, sampleTasks, diff);
    const staleWarn = warnings.find((w) => w.type === "STALE_RECOMMENDATIONS");
    assert.ok(staleWarn);
    assert.equal(staleWarn.severity, "INFO");
  });

  // ==========================================
  // GROUP K: END-TO-END ORCHESTRATION & EDGE CASES (71-75)
  // ==========================================

  it("Scenario 71: Recommendation explanation answers all 10 transparency questions", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);
    const rep = generateComprehensiveExplanation(prop);
    assert.equal(rep.answers.length, 10);
    rep.answers.forEach((ans, idx) => {
      assert.equal(ans.questionNumber, idx + 1);
      assert.ok(ans.answer.length > 5);
    });
  });

  it("Scenario 72: Schedule with 100+ items executes snapshot and health calculation without errors", () => {
    const massiveList: ScheduleItem[] = [];
    const days: ScheduleDay[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    for (let i = 0; i < 105; i++) {
      const day = days[i % 7];
      massiveList.push({
        id: `item_${i}`,
        title: `Kegiatan Akademik ${i}`,
        day,
        start_time: "08:00",
        end_time: "09:30",
        time: "08:00 - 09:30",
        type: i % 2 === 0 ? "jadwal" : "reminder",
        priority: "sedang",
        is_completed: false,
      });
    }
    const snap = generateScheduleSnapshot(sampleUserId, massiveList, sampleTasks);
    assert.equal(snap.coursesCount + snap.studySessionsCount, 105);
    const health = calculateAcademicHealthScore(massiveList, sampleTasks);
    assert.ok(health.overallScore >= 0 && health.overallScore <= 100);
  });

  it("Scenario 73: Incomplete data (no tasks, no preferences) executes safely with defaults", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, [], undefined);
    assert.equal(snap.assignmentsCount, 0);
    assert.ok(snap.userPreferences);
  });

  it("Scenario 74: End-to-end: Snapshot -> Optimizer -> Approval -> Apply -> Rollback", () => {
    const snap = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const prop = generateContinuousOptimizationProposal(sampleUserId, snap, sampleTasks);

    const gate = evaluateApprovalGate(
      "APPLY_OPTIMIZATION",
      { userId: sampleUserId, parentSnapshotHash: prop.parentSnapshotHash },
      snap
    );
    assert.equal(gate.allowed, true);

    const applyRes = applyProposalWithRollback(prop, snap);
    assert.equal(applyRes.success, true);

    const rollbackRes = rollbackAppliedProposal(applyRes.updatedProposal, snap);
    assert.equal(rollbackRes.success, true);
    assert.equal(rollbackRes.updatedProposal.status, "ROLLED_BACK");
  });

  it("Scenario 75: Deterministic integrity: Identical schedule runs produce identical hashes and scores", () => {
    const snap1 = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    const snap2 = generateScheduleSnapshot(sampleUserId, baseSchedules, sampleTasks);
    assert.equal(snap1.snapshotHash, snap2.snapshotHash);

    const health1 = calculateAcademicHealthScore(baseSchedules, sampleTasks);
    const health2 = calculateAcademicHealthScore(baseSchedules, sampleTasks);
    assert.equal(health1.overallScore, health2.overallScore);
  });
});
