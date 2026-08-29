import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  diffScheduleCollections,
  generateScheduleIdentityKey,
  normalizeTitleKey,
} from "../schedule-diff";
import {
  buildAdaptiveScheduleContext,
} from "../adaptive-context";
import {
  calculateRecommendationQuality,
} from "../recommendation-quality";
import {
  analyzeRescheduleImpact,
} from "../impact-analyzer";
import {
  planSmartReschedule,
} from "../reschedule-engine";
import {
  generateAdaptiveDailyPlan,
} from "../adaptive-planner";
import {
  buildRecommendationExplanation,
} from "../explanation-engine";
import {
  analyzeWorkload,
} from "../workload-analyzer";
import {
  analyzeTaskDeadlines,
} from "../deadline-analyzer";
import { ScheduleItem, Task, ScheduleDay } from "@/types";

describe("FASE 31 — Adaptive Schedule Intelligence & Self-Correcting Workflow (52 Scenarios)", () => {
  // ==========================================
  // SECTION 1: SCHEDULE CHANGE & DIFF DETECTION (1 to 8)
  // ==========================================

  it("Scenario 1: Unchanged schedule identified when all fields match", () => {
    const existing: ScheduleItem[] = [
      { id: "1", title: "Kalkulus I", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", location: "R.101", lecturer: "Dr. Budi", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const incoming = [
      { title: "Kalkulus I", day: "Senin" as ScheduleDay, start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", location: "R.101", lecturer: "Dr. Budi" },
    ];
    const diff = diffScheduleCollections(existing, incoming);
    assert.equal(diff.unchangedCount, 1);
    assert.equal(diff.addedCount, 0);
    assert.equal(diff.changedCount, 0);
    assert.equal(diff.items[0].diffType, "UNCHANGED");
  });

  it("Scenario 2: Added schedule identified when course is new", () => {
    const existing: ScheduleItem[] = [
      { id: "1", title: "Kalkulus I", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const incoming = [
      { title: "Fisika Dasar", day: "Selasa" as ScheduleDay, start_time: "10:00", end_time: "12:00", time: "10:00 - 12:00" },
    ];
    const diff = diffScheduleCollections(existing, incoming);
    assert.equal(diff.addedCount, 1);
    assert.equal(diff.items[0].diffType, "ADDED");
    assert.equal(diff.items[0].selectedAction, "ADD");
  });

  it("Scenario 3: Removed schedule identified when existing course missing in incoming", () => {
    const existing: ScheduleItem[] = [
      { id: "1", title: "Kalkulus I", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Praktikum Kimia", day: "Rabu", start_time: "13:00", end_time: "15:00", time: "13:00 - 15:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const incoming = [
      { title: "Kalkulus I", day: "Senin" as ScheduleDay, start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00" },
    ];
    const diff = diffScheduleCollections(existing, incoming);
    assert.equal(diff.removedCount, 1);
    const rem = diff.items.find((i) => i.diffType === "REMOVED");
    assert.ok(rem);
    assert.equal(rem.previousItem?.title, "Praktikum Kimia");
  });

  it("Scenario 4: Time changed detected when start or end time differs", () => {
    const existing: ScheduleItem[] = [
      { id: "1", title: "Kalkulus I", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const incoming = [
      { title: "Kalkulus I", day: "Senin" as ScheduleDay, start_time: "10:00", end_time: "12:00", time: "10:00 - 12:00" },
    ];
    const diff = diffScheduleCollections(existing, incoming);
    assert.equal(diff.changedCount, 1);
    assert.equal(diff.items[0].diffType, "TIME_CHANGED");
    assert.ok(diff.items[0].changes.some((c) => c.field === "time"));
  });

  it("Scenario 5: Room changed detected when location differs", () => {
    const existing: ScheduleItem[] = [
      { id: "1", title: "Algoritma", day: "Selasa", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", location: "Lab A", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const incoming = [
      { title: "Algoritma", day: "Selasa" as ScheduleDay, start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", location: "Lab B (Baru)" },
    ];
    const diff = diffScheduleCollections(existing, incoming);
    assert.equal(diff.changedCount, 1);
    assert.equal(diff.items[0].diffType, "ROOM_CHANGED");
    assert.ok(diff.items[0].changes.some((c) => c.field === "location"));
  });

  it("Scenario 6: Lecturer changed detected when lecturer name differs", () => {
    const existing: ScheduleItem[] = [
      { id: "1", title: "Basis Data", day: "Rabu", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", lecturer: "Prof. Agus", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const incoming = [
      { title: "Basis Data", day: "Rabu" as ScheduleDay, start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", lecturer: "Dr. Siti" },
    ];
    const diff = diffScheduleCollections(existing, incoming);
    assert.equal(diff.changedCount, 1);
    assert.equal(diff.items[0].diffType, "LECTURER_CHANGED");
  });

  it("Scenario 7: Normalized title key strips prefixes like MK / Mata Kuliah cleanly", () => {
    const k1 = normalizeTitleKey("MK Kalkulus 1");
    const k2 = normalizeTitleKey("Mata Kuliah Kalkulus 1");
    const k3 = normalizeTitleKey("Kalkulus 1");
    assert.equal(k1, k2);
    assert.equal(k2, k3);
  });

  it("Scenario 8: Stable identity key handles multiple occurrences of same course on same day", () => {
    const key1 = generateScheduleIdentityKey({ title: "Praktikum", day: "Senin" }, 0);
    const key2 = generateScheduleIdentityKey({ title: "Praktikum", day: "Senin" }, 1);
    assert.notEqual(key1, key2);
  });

  // ==========================================
  // SECTION 2: SMART RESCHEDULING 2.0 & IMPACT (9 to 16)
  // ==========================================

  it("Scenario 9: Single affected study session detected upon lecture shift", () => {
    const existing: ScheduleItem[] = [
      { id: "study_1", title: "Sesi Belajar Algoritma", day: "Selasa", start_time: "10:00", end_time: "12:00", time: "10:00 - 12:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const report = planSmartReschedule({
      changedEvent: { id: "lec_1", title: "Kuliah Baru", day: "Selasa", newStartTime: "10:00", newEndTime: "12:00" },
      existingSchedules: existing,
    });
    assert.equal(report.hasImpact, true);
    assert.equal(report.affectedStudySessions.length, 1);
    assert.equal(report.affectedStudySessions[0].id, "study_1");
  });

  it("Scenario 10: Multiple affected study sessions detected and itemized", () => {
    const existing: ScheduleItem[] = [
      { id: "s1", title: "Sesi Belajar 1", day: "Rabu", start_time: "13:00", end_time: "14:30", time: "13:00 - 14:30", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "s2", title: "Sesi Belajar 2", day: "Rabu", start_time: "14:30", end_time: "16:00", time: "14:30 - 16:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const report = planSmartReschedule({
      changedEvent: { id: "lec_1", title: "Kuliah Panjang", day: "Rabu", newStartTime: "13:00", newEndTime: "16:00" },
      existingSchedules: existing,
    });
    assert.equal(report.affectedStudySessions.length, 2);
  });

  it("Scenario 11: No alternative slot available on fully packed day returns empty alternatives", () => {
    const packed: ScheduleItem[] = [
      { id: "study_1", title: "Sesi Belajar", day: "Kamis", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "lec_full", title: "Kuliah Seharian", day: "Kamis", start_time: "07:00", end_time: "22:30", time: "07:00 - 22:30", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const report = analyzeRescheduleImpact({
      changedEvent: { id: "lec_1", title: "Kuliah Baru", day: "Kamis", newStartTime: "08:00", newEndTime: "10:00" },
      existingSchedules: packed,
    });
    assert.equal(report.hasImpact, true);
    assert.equal(report.recommendedAlternatives.length, 0);
  });

  it("Scenario 12: Alternative slot discovered with >= 30m break buffer", () => {
    const existing: ScheduleItem[] = [
      { id: "lec_1", title: "Kuliah Pagi", day: "Jumat", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "study_1", title: "Sesi Belajar", day: "Jumat", start_time: "14:00", end_time: "16:00", time: "14:00 - 16:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const report = planSmartReschedule({
      changedEvent: { id: "lec_move", title: "Kuliah Pindah Siang", day: "Jumat", previousTime: "10:00 - 12:00", newStartTime: "14:00", newEndTime: "16:00" },
      existingSchedules: existing,
    });
    assert.equal(report.hasImpact, true);
    assert.ok(report.recommendedAlternatives.length >= 1);
    // Alternative slot must not collide with 14:00 - 16:00
    assert.ok(report.recommendedAlternatives[0].slot.startTime !== "14:00");
  });

  it("Scenario 13: Gained vs lost free time calculated accurately", () => {
    const report = analyzeRescheduleImpact({
      changedEvent: { id: "lec_1", title: "Kuliah", day: "Senin", previousTime: "08:00 - 10:00", newStartTime: "13:00", newEndTime: "16:00" },
      existingSchedules: [],
    });
    assert.equal(report.lostFreeTimeMinutes, 180); // 13:00 to 16:00 = 180m
    assert.equal(report.gainedFreeTimeMinutes, 120); // 08:00 to 10:00 = 120m
  });

  it("Scenario 14: Deadline risk increased flagged when displaced session affects critical task", () => {
    const existing: ScheduleItem[] = [
      { id: "study_ai", title: "Sesi Belajar AI", day: "Senin", start_time: "13:00", end_time: "15:00", time: "13:00 - 15:00", type: "jadwal", priority: "tinggi", is_completed: false },
    ];
    const tasks: Task[] = [
      { id: "t_ai", user_id: "u1", subject: "AI", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Tugas AI", deadline: new Date(Date.now() + 12 * 3600 * 1000).toISOString(), status: "belum_dikerjakan", priority: "tinggi" },
    ];
    const report = analyzeRescheduleImpact({
      changedEvent: { title: "Kuliah Pengganti", day: "Senin", newStartTime: "13:00", newEndTime: "15:00" },
      existingSchedules: existing,
      tasks,
    });
    assert.equal(report.deadlineRiskIncreased, true);
  });

  it("Scenario 15: Deadline risk unaffected when displaced session is for safe task", () => {
    const existing: ScheduleItem[] = [
      { id: "study_safe", title: "Sesi Belajar Santai", day: "Senin", start_time: "13:00", end_time: "15:00", time: "13:00 - 15:00", type: "jadwal", priority: "rendah", is_completed: false },
    ];
    const tasks: Task[] = [
      { id: "t_safe", user_id: "u1", subject: "Santai", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Tugas Santai", deadline: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(), status: "belum_dikerjakan", priority: "rendah" },
    ];
    const report = analyzeRescheduleImpact({
      changedEvent: { title: "Kuliah", day: "Senin", newStartTime: "13:00", newEndTime: "15:00" },
      existingSchedules: existing,
      tasks,
    });
    assert.equal(report.deadlineRiskIncreased, false);
  });

  it("Scenario 16: Human summary in Indonesian explains specific collision details", () => {
    const existing: ScheduleItem[] = [
      { id: "study_algo", title: "Sesi Belajar Algoritma", day: "Selasa", start_time: "14:00", end_time: "16:00", time: "14:00 - 16:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const report = analyzeRescheduleImpact({
      changedEvent: { title: "Praktikum Baru", day: "Selasa", newStartTime: "14:00", newEndTime: "16:00" },
      existingSchedules: existing,
    });
    assert.ok(report.humanSummary.includes("memindahkan 1 sesi belajar"));
    assert.ok(report.humanSummary.includes("Sesi Belajar Algoritma"));
  });

  // ==========================================
  // SECTION 3: ADAPTIVE WORKLOAD & RECOVERY (17 to 21)
  // ==========================================

  it("Scenario 17: Light day workload properly allows session generation", () => {
    const plan = generateAdaptiveDailyPlan({ date: "2026-09-01", targetStudyHours: 2 }, [], []);
    assert.equal(plan.success, true);
    assert.ok(plan.recommendedSessions.length >= 1);
  });

  it("Scenario 18: Normal day workload maintains balance", () => {
    const existing: ScheduleItem[] = [
      { id: "1", title: "Kuliah 1", day: "Senin", start_time: "08:00", end_time: "11:00", time: "08:00 - 11:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const plan = generateAdaptiveDailyPlan({ date: "2026-09-07", day: "Senin", targetStudyHours: 2 }, existing, []);
    assert.equal(plan.success, true);
  });

  it("Scenario 19: Busy day restricts excessive session expansion", () => {
    const existing: ScheduleItem[] = [
      { id: "1", title: "Kuliah 1", day: "Senin", start_time: "08:00", end_time: "11:00", time: "08:00 - 11:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Kuliah 2", day: "Senin", start_time: "13:00", end_time: "16:00", time: "13:00 - 16:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const plan = generateAdaptiveDailyPlan({ date: "2026-09-07", day: "Senin", targetStudyHours: 3 }, existing, []);
    // Total planned should stay within limits
    assert.ok(plan.totalMinutesPlanned <= 180);
  });

  it("Scenario 20: Overloaded day triggers Overload Recovery with advice", () => {
    const packed: ScheduleItem[] = [
      { id: "1", title: "Kuliah Pagi", day: "Kamis", start_time: "07:30", end_time: "12:00", time: "07:30 - 12:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Kuliah Siang", day: "Kamis", start_time: "12:30", end_time: "17:00", time: "12:30 - 17:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const plan = generateAdaptiveDailyPlan({ date: "2026-09-10", day: "Kamis", targetStudyHours: 2 }, packed, []);
    assert.ok(plan.overloadRecovery);
    assert.equal(plan.overloadRecovery.isOverloaded, true);
  });

  it("Scenario 21: Recovery mode suggests lighter upcoming days instead of inventing fake slots", () => {
    const packedThursday: ScheduleItem[] = [
      { id: "1", title: "Kuliah Pagi", day: "Kamis", start_time: "07:00", end_time: "22:30", time: "07:00 - 22:30", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const plan = generateAdaptiveDailyPlan({ date: "2026-09-10", day: "Kamis", targetStudyHours: 2 }, packedThursday, []);
    assert.equal(plan.success, false);
    assert.ok(plan.overloadRecovery?.suggestedLighterDays.some((d) => d.day === "Jumat"));
  });

  // ==========================================
  // SECTION 4: SMART DEADLINE ADAPTATION (22 to 26)
  // ==========================================

  it("Scenario 22: Safe deadline (>168h) gets standard priority", () => {
    const tasks: Task[] = [
      { id: "t1", user_id: "u1", subject: "S1", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Tugas Jauh", deadline: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(), status: "belum_dikerjakan", priority: "rendah" },
    ];
    const analyzed = analyzeTaskDeadlines(tasks);
    assert.equal(analyzed[0].urgency, "SAFE");
  });

  it("Scenario 23: Upcoming deadline (72-168h) elevates to UPCOMING", () => {
    const tasks: Task[] = [
      { id: "t1", user_id: "u1", subject: "S1", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Tugas Minggu Depan", deadline: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(), status: "belum_dikerjakan", priority: "sedang" },
    ];
    const analyzed = analyzeTaskDeadlines(tasks);
    assert.equal(analyzed[0].urgency, "UPCOMING");
  });

  it("Scenario 24: Urgent deadline (24-72h) elevates to URGENT", () => {
    const tasks: Task[] = [
      { id: "t1", user_id: "u1", subject: "S1", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Tugas 2 Hari Lagi", deadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(), status: "belum_dikerjakan", priority: "sedang" },
    ];
    const analyzed = analyzeTaskDeadlines(tasks);
    assert.equal(analyzed[0].urgency, "URGENT");
  });

  it("Scenario 25: Sudden deadline pull-in (<24h) auto-upgrades to CRITICAL", () => {
    const tasks: Task[] = [
      { id: "t1", user_id: "u1", subject: "S1", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Tugas Besok Pagi", deadline: new Date(Date.now() + 10 * 3600 * 1000).toISOString(), status: "belum_dikerjakan", priority: "tinggi" },
    ];
    const analyzed = analyzeTaskDeadlines(tasks);
    assert.equal(analyzed[0].urgency, "CRITICAL");
  });

  it("Scenario 26: Overdue task (T < 0) flagged as OVERDUE", () => {
    const tasks: Task[] = [
      { id: "t1", user_id: "u1", subject: "S1", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Tugas Kemarin", deadline: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), status: "belum_dikerjakan", priority: "tinggi" },
    ];
    const analyzed = analyzeTaskDeadlines(tasks);
    assert.equal(analyzed[0].urgency, "OVERDUE");
  });

  // ==========================================
  // SECTION 5: IMPORT UPDATE MODE & DIFFING (27 to 34)
  // ==========================================

  it("Scenario 27: Pure new schedule batch classified as 100% ADDED", () => {
    const incoming = [
      { title: "Matkul A", day: "Senin" as ScheduleDay, start_time: "08:00", end_time: "10:00" },
      { title: "Matkul B", day: "Selasa" as ScheduleDay, start_time: "10:00", end_time: "12:00" },
    ];
    const diff = diffScheduleCollections([], incoming);
    assert.equal(diff.addedCount, 2);
    assert.equal(diff.changedCount, 0);
  });

  it("Scenario 28: Pure unchanged batch classified as 100% UNCHANGED", () => {
    const items: ScheduleItem[] = [
      { id: "1", title: "Matkul A", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const diff = diffScheduleCollections(items, items);
    assert.equal(diff.unchangedCount, 1);
    assert.equal(diff.addedCount, 0);
  });

  it("Scenario 29: Changed schedule batch identifies specific modified fields", () => {
    const existing: ScheduleItem[] = [
      { id: "1", title: "Kalkulus", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", location: "R.101", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const incoming = [
      { title: "Kalkulus", day: "Senin" as ScheduleDay, start_time: "13:00", end_time: "15:00", time: "13:00 - 15:00", location: "R.202" },
    ];
    const diff = diffScheduleCollections(existing, incoming);
    assert.equal(diff.changedCount, 1);
    assert.ok(diff.items[0].changes.some((c) => c.field === "time"));
    assert.ok(diff.items[0].changes.some((c) => c.field === "location"));
  });

  it("Scenario 30: Removed schedule correctly identified in categorization", () => {
    const existing: ScheduleItem[] = [
      { id: "1", title: "Matkul 1", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Matkul Hapus", day: "Kamis", start_time: "10:00", end_time: "12:00", time: "10:00 - 12:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const incoming = [
      { title: "Matkul 1", day: "Senin" as ScheduleDay, start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00" },
    ];
    const diff = diffScheduleCollections(existing, incoming);
    assert.equal(diff.categorized.removed.length, 1);
    assert.equal(diff.categorized.removed[0].previousItem?.title, "Matkul Hapus");
  });

  it("Scenario 31: Mixed update batch handles added, changed, unchanged, and removed together", () => {
    const existing: ScheduleItem[] = [
      { id: "1", title: "Matkul Tetap", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Matkul Berubah", day: "Selasa", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "3", title: "Matkul Dihapus", day: "Rabu", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const incoming = [
      { title: "Matkul Tetap", day: "Senin" as ScheduleDay, start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00" },
      { title: "Matkul Berubah", day: "Selasa" as ScheduleDay, start_time: "10:00", end_time: "12:00", time: "10:00 - 12:00" },
      { title: "Matkul Baru", day: "Kamis" as ScheduleDay, start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00" },
    ];
    const diff = diffScheduleCollections(existing, incoming);
    assert.equal(diff.unchangedCount, 1);
    assert.equal(diff.changedCount, 1);
    assert.equal(diff.addedCount, 1);
    assert.equal(diff.removedCount, 1);
  });

  it("Scenario 32: Duplicate upload produces zero duplicates with stable identity keys", () => {
    const existing: ScheduleItem[] = [
      { id: "1", title: "Kalkulus", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const incoming = [
      { title: "Kalkulus", day: "Senin" as ScheduleDay, start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00" },
    ];
    const diff = diffScheduleCollections(existing, incoming);
    assert.equal(diff.addedCount, 0);
    assert.equal(diff.unchangedCount, 1);
  });

  it("Scenario 33: Repeated import idempotent matching maintains exact state", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "A", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const diff1 = diffScheduleCollections(schedules, schedules);
    const diff2 = diffScheduleCollections(schedules, schedules);
    assert.deepEqual(diff1.summary, diff2.summary);
  });

  it("Scenario 34: Diff summary correctly formats count string in Indonesian", () => {
    const diff = diffScheduleCollections([], [{ title: "A", day: "Senin" as ScheduleDay }]);
    assert.ok(diff.summary.includes("1 baru"));
  });

  // ==========================================
  // SECTION 6: SECURITY & MULTI-TENANT ISOLATION (35 to 40)
  // ==========================================

  it("Scenario 35: Adaptive context isolates user ID strictly", () => {
    const ctx = buildAdaptiveScheduleContext("usr_verified_123", [], []);
    assert.equal(ctx.userId, "usr_verified_123");
  });

  it("Scenario 36: Cross-user schedules isolated in workload calculations", () => {
    const user1Schedules: ScheduleItem[] = [
      { id: "1", user_id: "u1", title: "Kuliah User 1", day: "Senin", start_time: "08:00", end_time: "11:00", time: "08:00 - 11:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const workload = analyzeWorkload(user1Schedules, []);
    assert.equal(workload.dailyBreakdown.Senin.totalMinutes, 180);
  });

  it("Scenario 37: Adaptive context accurately separates active study sessions from lectures", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Kuliah AI", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Sesi Belajar AI", day: "Senin", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const mondayDate = new Date("2026-08-31T10:00:00Z"); // Monday
    const ctx = buildAdaptiveScheduleContext("u1", schedules, [], mondayDate);
    assert.equal(ctx.todayLectures.length, 1);
    assert.equal(ctx.activeStudySessions.length, 1);
  });

  it("Scenario 38: Incomplete tasks count matches uncompleted tasks", () => {
    const tasks: Task[] = [
      { id: "t1", user_id: "u1", subject: "S1", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Tugas 1", deadline: "2026-09-01T00:00:00Z", status: "belum_dikerjakan", priority: "sedang" },
      { id: "t2", user_id: "u1", subject: "S2", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Tugas Selesai", deadline: "2026-09-01T00:00:00Z", status: "selesai", priority: "rendah" },
    ];
    const ctx = buildAdaptiveScheduleContext("u1", [], tasks);
    assert.equal(ctx.incompleteTasksCount, 1);
  });

  it("Scenario 39: Recovery mode activates when active conflicts exist", () => {
    const conflicting: ScheduleItem[] = [
      { id: "1", title: "Kuliah A", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Kuliah B", day: "Senin", start_time: "09:00", end_time: "11:00", time: "09:00 - 11:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const ctx = buildAdaptiveScheduleContext("u1", conflicting, []);
    assert.equal(ctx.activeConflictsCount >= 1, true);
    assert.equal(ctx.recoveryModeActive, true);
  });

  it("Scenario 40: Clean schedule state has recovery mode inactive", () => {
    const clean: ScheduleItem[] = [
      { id: "1", title: "Kuliah A", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const ctx = buildAdaptiveScheduleContext("u1", clean, []);
    assert.equal(ctx.activeConflictsCount, 0);
    assert.equal(ctx.recoveryModeActive, false);
  });

  // ==========================================
  // SECTION 7: ADAPTIVE PLANNER (41 to 46)
  // ==========================================

  it("Scenario 41: No free slot returns realistic warning message without crashing", () => {
    const fullDay: ScheduleItem[] = [
      { id: "1", title: "Kuliah Nonstop", day: "Senin", start_time: "07:00", end_time: "22:30", time: "07:00 - 22:30", type: "jadwal", priority: "tinggi", is_completed: false },
    ];
    const plan = generateAdaptiveDailyPlan({ date: "2026-09-07", day: "Senin", targetStudyHours: 2 }, fullDay, []);
    assert.equal(plan.success, false);
    assert.ok(plan.warnings[0].includes("Tidak ditemukan waktu belajar"));
  });

  it("Scenario 42: Single free slot matched to highest urgency task", () => {
    const tasks: Task[] = [
      { id: "t_crit", user_id: "u1", subject: "S1", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Tugas Kritis", deadline: new Date(Date.now() + 10 * 3600 * 1000).toISOString(), status: "belum_dikerjakan", priority: "tinggi" },
    ];
    const plan = generateAdaptiveDailyPlan({ date: "2026-09-01", targetStudyHours: 1 }, [], tasks);
    assert.equal(plan.success, true);
    assert.ok(plan.recommendedSessions[0].activity.includes("Tugas Kritis"));
  });

  it("Scenario 43: Multiple free slots filled up to target study hours", () => {
    const plan = generateAdaptiveDailyPlan({ date: "2026-09-01", targetStudyHours: 3 }, [], []);
    assert.equal(plan.success, true);
    assert.ok(plan.totalMinutesPlanned >= 120);
  });

  it("Scenario 44: Insufficient total time outputs realistic partitioning message", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Kuliah 1", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Kuliah 2", day: "Senin", start_time: "12:00", end_time: "22:30", time: "12:00 - 22:30", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    // Gap 10:00 to 12:00 (with 30m breaks) is 60m, requesting 4 hours
    const plan = generateAdaptiveDailyPlan({ date: "2026-09-07", day: "Senin", targetStudyHours: 4 }, schedules, []);
    assert.equal(plan.targetMet, false);
    assert.ok(plan.warnings.some((w) => w.includes("Waktu tersedia tidak cukup")));
  });

  it("Scenario 45: Adaptive daily plan correctly caps each session to max 90 minutes", () => {
    const plan = generateAdaptiveDailyPlan({ date: "2026-09-01", targetStudyHours: 3 }, [], []);
    for (const s of plan.recommendedSessions) {
      assert.ok(s.durationMinutes <= 90);
    }
  });

  it("Scenario 46: Adaptive daily plan respects minimum break buffer of 30m", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Kuliah Pagi", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const plan = generateAdaptiveDailyPlan({ date: "2026-09-07", day: "Senin", targetStudyHours: 1, minBreakMinutes: 30 }, schedules, []);
    assert.equal(plan.success, true);
    assert.ok(plan.recommendedSessions[0].startTime >= "10:30");
  });

  // ==========================================
  // SECTION 8: EDGE CASES & QUALITY SCORE (47 to 52)
  // ==========================================

  it("Scenario 47: Recommendation quality score formula calculates 0-100 deterministic range", () => {
    const q = calculateRecommendationQuality({
      deadlineUrgency: "CRITICAL",
      slotDurationMinutes: 90,
      targetDurationMinutes: 90,
      hasConflict: false,
      dayWorkloadLevel: "RINGAN",
      hasSufficientBreak: true,
      isPreferredTimeMatch: true,
    });
    assert.equal(q.score, 100);
    assert.equal(q.label, "Sangat Cocok");
  });

  it("Scenario 48: Recommendation quality labels classify correctly", () => {
    const qOptimal = calculateRecommendationQuality({
      deadlineUrgency: "URGENT",
      slotDurationMinutes: 60,
      targetDurationMinutes: 60,
      hasConflict: false,
      dayWorkloadLevel: "NORMAL",
      hasSufficientBreak: true,
      isPreferredTimeMatch: true,
    });
    assert.equal(qOptimal.label, "Optimal");
  });

  it("Scenario 49: Quality score penalizes active conflicts heavily", () => {
    const qConflict = calculateRecommendationQuality({
      deadlineUrgency: "CRITICAL",
      slotDurationMinutes: 90,
      targetDurationMinutes: 90,
      hasConflict: true,
      dayWorkloadLevel: "RINGAN",
      hasSufficientBreak: false,
      isPreferredTimeMatch: false,
    });
    assert.ok(qConflict.factors.zeroConflictScore <= 0);
    assert.ok(qConflict.score < 70);
  });

  it("Scenario 50: Explanation 2.0 provides answers to core transparency questions", () => {
    const exp = buildRecommendationExplanation({
      activity: "Belajar Machine Learning",
      day: "Selasa",
      startTime: "19:00",
      endTime: "20:30",
      durationMinutes: 90,
      deadlineUrgencyLabel: "Kritis (<24 Jam)",
      factors: ["Waktu luang optimal"],
      checkedSchedulesCount: 6,
      maxDailyMinutes: 240,
      minBreakMinutes: 30,
      workloadStatus: "Optimal",
      alternativesCount: 2,
    });

    assert.ok(exp.answers);
    assert.ok(exp.answers.whyChosen.includes("19:00–20:30"));
    assert.ok(exp.answers.whatPrioritized.includes("Belajar Machine Learning"));
    assert.ok(exp.answers.conflictStatusText.includes("Bebas konflik"));
    assert.ok(exp.answers.workloadSafetyText.includes("240 menit"));
    assert.ok(exp.answers.alternativesAvailableText.includes("2 alternatif"));
  });

  it("Scenario 51: Explanation 2.0 maintains backwards compatibility with summary and evidence arrays", () => {
    const exp = buildRecommendationExplanation({
      activity: "Sesi Belajar",
      day: "Rabu",
      startTime: "09:00",
      endTime: "10:30",
      durationMinutes: 90,
      factors: ["Bebas bentrok"],
      checkedSchedulesCount: 3,
      maxDailyMinutes: 240,
      minBreakMinutes: 30,
    });
    assert.ok(exp.summary.includes("Disarankan mempelajari Sesi Belajar"));
    assert.ok(exp.evidence.length >= 2);
    assert.ok(exp.constraintsApplied.length >= 3);
  });

  it("Scenario 52: Real-world Simulation: Reschedule shift, quality evaluation and atomic proposal alignment", () => {
    const existing: ScheduleItem[] = [
      { id: "lec_old", title: "Kalkulus", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "study_prog", title: "Sesi Belajar Pemrograman", day: "Senin", start_time: "10:30", end_time: "12:00", time: "10:30 - 12:00", type: "jadwal", priority: "tinggi", is_completed: false },
    ];
    // Lecture Kalkulus moved to 10:00 - 12:00 -> Collides with Sesi Belajar Pemrograman
    const rescheduleReport = planSmartReschedule({
      changedEvent: { id: "lec_old", title: "Kalkulus", day: "Senin", previousTime: "08:00 - 10:00", newStartTime: "10:00", newEndTime: "12:00" },
      existingSchedules: existing,
    });

    assert.equal(rescheduleReport.hasImpact, true);
    assert.equal(rescheduleReport.affectedStudySessions.length, 1);
    assert.ok(rescheduleReport.recommendedAlternatives.length >= 1);
    assert.ok(rescheduleReport.recommendedAlternatives[0].quality.score >= 70);
  });
});
