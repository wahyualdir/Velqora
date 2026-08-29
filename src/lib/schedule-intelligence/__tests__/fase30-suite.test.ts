import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  analyzeWorkload,
  classifyWorkloadLevel,
  calculateItemDurationMinutes,
} from "../workload-analyzer";
import {
  analyzeTaskDeadlines,
  classifyDeadlineUrgency,
} from "../deadline-analyzer";
import {
  analyzeFreeTimeSlots,
  minutesToTimeStr,
} from "../free-time-analyzer";
import {
  generateDailyPlan,
  generateWeeklyPlan,
  detectRescheduleImpact,
  getDayFromDateString,
} from "../recommendation-engine";
import {
  calculatePriorityScore,
} from "../priority-engine";
import {
  buildRecommendationExplanation,
} from "../explanation-engine";
import {
  validateDailyStudyLimit,
  validateTimeRangeSafety,
  validatePlanRequestSafety,
} from "../safety-rules";
import {
  buildScheduleIntelligenceContext,
} from "../context-builder";
import {
  inspectPdfStructure,
} from "../../schedule/ocr/pdf-renderer";
import {
  preprocessOcrImage,
} from "../../schedule/ocr/image-preprocessor";
import {
  ArchitectureReadyOCRProvider,
} from "../../schedule/ocr/local-provider";
import { ScheduleItem, Task } from "@/types";

describe("FASE 30 — Production Intelligence & Autonomous Schedule Assistant (50 Scenarios)", () => {
  // ==========================================
  // SECTION A: WORKLOAD ENGINE (1 to 6)
  // ==========================================

  it("Scenario 1: A1 Hari Ringan correctly categorized for <= 180 minutes of activity", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Review Kuliah", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const res = analyzeWorkload(schedules, []);
    assert.equal(res.dailyBreakdown.Senin.level, "RINGAN");
    assert.equal(res.dailyBreakdown.Senin.totalMinutes, 120);
    assert.equal(res.dailyBreakdown.Senin.totalHours, 2);
  });

  it("Scenario 2: A2 Hari Normal correctly categorized for 181 to 300 minutes", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Kuliah 1", day: "Selasa", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Kuliah 2", day: "Selasa", start_time: "10:30", end_time: "12:30", time: "10:30 - 12:30", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const res = analyzeWorkload(schedules, []);
    assert.equal(res.dailyBreakdown.Selasa.level, "NORMAL");
    assert.equal(res.dailyBreakdown.Selasa.totalMinutes, 240);
  });

  it("Scenario 3: A3 Hari Padat correctly categorized for 301 to 420 minutes", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Kuliah 1", day: "Rabu", start_time: "08:00", end_time: "11:00", time: "08:00 - 11:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Kuliah 2", day: "Rabu", start_time: "13:00", end_time: "16:00", time: "13:00 - 16:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const res = analyzeWorkload(schedules, []);
    assert.equal(res.dailyBreakdown.Rabu.level, "PADAT");
    assert.equal(res.dailyBreakdown.Rabu.totalMinutes, 360);
  });

  it("Scenario 4: A4 Overload correctly flags isOverloaded for > 360 minutes", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Kuliah Pagi", day: "Kamis", start_time: "07:30", end_time: "11:30", time: "07:30 - 11:30", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Kuliah Siang", day: "Kamis", start_time: "12:30", end_time: "16:30", time: "12:30 - 16:30", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const res = analyzeWorkload(schedules, []);
    assert.equal(res.dailyBreakdown.Kamis.isOverloaded, true);
    assert.equal(res.overloadedDaysCount, 1);
  });

  it("Scenario 5: A5 Missing Data returns isSufficientData false with natural Indonesian message", () => {
    const res = analyzeWorkload([], []);
    assert.equal(res.isSufficientData, false);
    assert.ok(res.evidenceSummary[0].includes("Data belum cukup"));
  });

  it("Scenario 6: Workload item duration calculation correctly handles start/end and time strings", () => {
    const dur1 = calculateItemDurationMinutes({ start_time: "08:00", end_time: "10:30" });
    assert.equal(dur1, 150);
    const dur2 = calculateItemDurationMinutes({ time: "13.00 - 15.00" });
    assert.equal(dur2, 120);
  });

  // ==========================================
  // SECTION B: DEADLINE INTELLIGENCE (7 to 12)
  // ==========================================

  it("Scenario 7: B1 Critical Deadline classified when < 24 hours remaining", () => {
    const ref = new Date("2026-09-01T08:00:00Z");
    const tasks: Task[] = [
      { id: "t1", user_id: "u1", subject: "Praktikum", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Laporan Praktikum", deadline: "2026-09-01T20:00:00Z", status: "belum_dikerjakan", priority: "tinggi" },
    ];
    const analyzed = analyzeTaskDeadlines(tasks, ref);
    assert.equal(analyzed.length, 1);
    assert.equal(analyzed[0].urgency, "CRITICAL");
    assert.ok(analyzed[0].hoursRemaining <= 24);
  });

  it("Scenario 8: B2 Urgent Deadline classified when 24 to 72 hours remaining", () => {
    const ref = new Date("2026-09-01T08:00:00Z");
    const tasks: Task[] = [
      { id: "t1", user_id: "u1", subject: "AI", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Makalah AI", deadline: "2026-09-03T08:00:00Z", status: "belum_dikerjakan", priority: "sedang" },
    ];
    const analyzed = analyzeTaskDeadlines(tasks, ref);
    assert.equal(analyzed[0].urgency, "URGENT");
  });

  it("Scenario 9: B3 Upcoming Deadline classified when 72 to 168 hours remaining", () => {
    const ref = new Date("2026-09-01T08:00:00Z");
    const tasks: Task[] = [
      { id: "t1", user_id: "u1", subject: "Kelompok", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Presentasi Kelompok", deadline: "2026-09-06T08:00:00Z", status: "belum_dikerjakan", priority: "sedang" },
    ];
    const analyzed = analyzeTaskDeadlines(tasks, ref);
    assert.equal(analyzed[0].urgency, "UPCOMING");
  });

  it("Scenario 10: B4 Safe Deadline classified when > 168 hours remaining", () => {
    const ref = new Date("2026-09-01T08:00:00Z");
    const tasks: Task[] = [
      { id: "t1", user_id: "u1", subject: "Skripsi", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Tugas Akhir Semester", deadline: "2026-09-25T08:00:00Z", status: "belum_dikerjakan", priority: "rendah" },
    ];
    const analyzed = analyzeTaskDeadlines(tasks, ref);
    assert.equal(analyzed[0].urgency, "SAFE");
  });

  it("Scenario 11: B5 Overdue Deadline classified when deadline has passed (T < 0)", () => {
    const ref = new Date("2026-09-02T08:00:00Z");
    const tasks: Task[] = [
      { id: "t1", user_id: "u1", subject: "Tugas", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Tugas Kemarin", deadline: "2026-09-01T08:00:00Z", status: "belum_dikerjakan", priority: "tinggi" },
    ];
    const analyzed = analyzeTaskDeadlines(tasks, ref);
    assert.equal(analyzed[0].urgency, "OVERDUE");
    assert.equal(analyzed[0].isOverdue, true);
  });

  it("Scenario 12: Multiple Deadlines sorted deterministically by urgency order", () => {
    const ref = new Date("2026-09-01T08:00:00Z");
    const tasks: Task[] = [
      { id: "t1", user_id: "u1", subject: "T1", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Tugas 1 Minggu Lagi", deadline: "2026-09-07T08:00:00Z", status: "belum_dikerjakan", priority: "rendah" },
      { id: "t2", user_id: "u1", subject: "T2", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Tugas Besok", deadline: "2026-09-02T08:00:00Z", status: "belum_dikerjakan", priority: "tinggi" },
      { id: "t3", user_id: "u1", subject: "T3", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Tugas 2 Hari Lagi", deadline: "2026-09-03T08:00:00Z", status: "belum_dikerjakan", priority: "sedang" },
    ];
    const analyzed = analyzeTaskDeadlines(tasks, ref);
    assert.equal(analyzed[0].taskId, "t2"); // CRITICAL / 24h first
    assert.equal(analyzed[1].taskId, "t3"); // URGENT second
    assert.equal(analyzed[2].taskId, "t1"); // UPCOMING third
  });

  // ==========================================
  // SECTION C: FREE-TIME ANALYZER (13 to 18)
  // ==========================================

  it("Scenario 13: C1 Free time slots on empty day returns full day window", () => {
    const slots = analyzeFreeTimeSlots("Senin", []);
    assert.ok(slots.length >= 1);
    assert.equal(slots[0].startTime, "07:00");
    assert.equal(slots[0].endTime, "22:30");
  });

  it("Scenario 14: C2 Busy day with morning and afternoon lectures produces gap slot", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Kuliah Pagi", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Kuliah Siang", day: "Senin", start_time: "13:00", end_time: "15:00", time: "13:00 - 15:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    // With 30 min break buffer: 10:00 + 30m = 10:30; 13:00 - 30m = 12:30 -> free slot 10:30 to 12:30 (120 mins)
    const slots = analyzeFreeTimeSlots("Senin", schedules, { minBreakMinutes: 30 });
    const middleSlot = slots.find((s) => s.startTime === "10:30" && s.endTime === "12:30");
    assert.ok(middleSlot);
    assert.equal(middleSlot.durationMinutes, 120);
  });

  it("Scenario 15: C3 Fully packed day produces zero free slots", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Kuliah Nonstop", day: "Senin", start_time: "07:00", end_time: "22:30", time: "07:00 - 22:30", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const slots = analyzeFreeTimeSlots("Senin", schedules);
    assert.equal(slots.length, 0);
  });

  it("Scenario 16: C4 Touching boundary intervals (08:00-10:00 and 10:00-12:00) treated properly", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Kuliah A", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Kuliah B", day: "Senin", start_time: "10:00", end_time: "12:00", time: "10:00 - 12:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const slots = analyzeFreeTimeSlots("Senin", schedules, { minBreakMinutes: 0 });
    // After 12:00, slot starts immediately
    const afterSlot = slots.find((s) => s.startTime === "12:00");
    assert.ok(afterSlot);
  });

  it("Scenario 17: C5 Minimum break buffer applied before and after lectures", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Kuliah", day: "Selasa", start_time: "09:00", end_time: "11:00", time: "09:00 - 11:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const slots = analyzeFreeTimeSlots("Selasa", schedules, { minBreakMinutes: 30 });
    // Morning slot ends at 08:30 (09:00 - 30m)
    const morningSlot = slots.find((s) => s.endTime === "08:30");
    assert.ok(morningSlot);
    // Afternoon slot starts at 11:30 (11:00 + 30m)
    const afternoonSlot = slots.find((s) => s.startTime === "11:30");
    assert.ok(afternoonSlot);
  });

  it("Scenario 18: Gaps smaller than minSlotDurationMinutes are filtered out", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Kuliah 1", day: "Rabu", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Kuliah 2", day: "Rabu", start_time: "10:40", end_time: "12:00", time: "10:40 - 12:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    // Gap is 10:00 to 10:40 (40 mins), with minSlotDurationMinutes=45 it must be excluded
    const slots = analyzeFreeTimeSlots("Rabu", schedules, { minBreakMinutes: 0, minSlotDurationMinutes: 45 });
    const tinySlot = slots.find((s) => s.startTime === "10:00" && s.endTime === "10:40");
    assert.equal(tinySlot, undefined);
  });

  // ==========================================
  // SECTION D: DAILY & WEEKLY PLANNER (19 to 27)
  // ==========================================

  it("Scenario 19: D1 Single task daily plan generation selects optimal slot", () => {
    const plan = generateDailyPlan({ date: "2026-09-01", targetStudyHours: 2 }, [], []);
    assert.equal(plan.success, true);
    assert.ok(plan.recommendedSessions.length >= 1);
    assert.ok(plan.totalMinutesPlanned > 0);
  });

  it("Scenario 20: D2 Priority tasks provided in request are matched into sessions", () => {
    const tasks: Task[] = [
      { id: "t_ai", user_id: "u1", subject: "AI", lecturer: null, description: null, file_url: null, file_name: null, external_url: null, notes: null, created_at: "2026-01-01", updated_at: "2026-01-01", title: "Tugas Kecerdasan Buatan", priority: "tinggi", deadline: "2026-09-02T10:00:00Z", status: "belum_dikerjakan" },
    ];
    const plan = generateDailyPlan({ date: "2026-09-01", targetStudyHours: 2, priorityTaskIds: ["t_ai"] }, [], tasks);
    assert.equal(plan.success, true);
    assert.ok(plan.recommendedSessions[0].activity.includes("Kecerdasan Buatan"));
  });

  it("Scenario 21: D3 Deadline priority boosts session suitability score", () => {
    const scoreUrgent = calculatePriorityScore({ deadlineUrgency: "CRITICAL", taskPriority: "tinggi" });
    const scoreNormal = calculatePriorityScore({ deadlineUrgency: "SAFE", taskPriority: "rendah" });
    assert.ok(scoreUrgent.score > scoreNormal.score);
  });

  it("Scenario 22: D4 Daily study limit cap prevents exceeding maxDailyStudyMinutes", () => {
    const existing: ScheduleItem[] = [
      { id: "1", title: "Sesi Belajar 1", day: "Senin", start_time: "08:00", end_time: "11:00", time: "08:00 - 11:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    // Already 180 mins study on Monday, maxDailyStudyMinutes = 240, requesting 3 hours (180 mins) -> should cap
    const plan = generateDailyPlan({ date: "2026-09-07", day: "Senin", targetStudyHours: 3, maxDailyStudyMinutes: 240 }, existing, []);
    assert.ok(plan.totalMinutesPlanned <= 60); // only 60m remaining to reach 240m
  });

  it("Scenario 23: D5 Minimum break buffer applied to scheduled session start time", () => {
    const existing: ScheduleItem[] = [
      { id: "1", title: "Kuliah", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const plan = generateDailyPlan({ date: "2026-09-07", day: "Senin", targetStudyHours: 1, minBreakMinutes: 30 }, existing, []);
    assert.equal(plan.success, true);
    const session = plan.recommendedSessions[0];
    assert.ok(session.startTime >= "10:30");
  });

  it("Scenario 24: D6 Session duration capped at max 90 minutes per individual block", () => {
    const plan = generateDailyPlan({ date: "2026-09-01", targetStudyHours: 4 }, [], []);
    assert.equal(plan.success, true);
    for (const s of plan.recommendedSessions) {
      assert.ok(s.durationMinutes <= 90);
    }
  });

  it("Scenario 25: D7 Impossible plan on full day returns clear warning message without crashing", () => {
    const packedSchedules: ScheduleItem[] = [
      { id: "1", title: "Kuliah Pagi Sampai Malam", day: "Senin", start_time: "07:00", end_time: "22:30", time: "07:00 - 22:30", type: "jadwal", priority: "tinggi", is_completed: false },
    ];
    const plan = generateDailyPlan({ date: "2026-09-07", day: "Senin", targetStudyHours: 2 }, packedSchedules, []);
    assert.equal(plan.success, false);
    assert.ok(plan.error);
    assert.ok(plan.warnings.length > 0);
  });

  it("Scenario 26: Weekly plan distributes sessions across preferred days", () => {
    const plan = generateWeeklyPlan({
      targetStudyHoursTotal: 6,
      preferredDays: ["Senin", "Rabu", "Jumat"],
    }, [], []);
    assert.equal(plan.success, true);
    assert.ok(plan.recommendedSessionsCount >= 3);
    assert.equal(plan.dailyBreakdown.Senin.sessions.length >= 1, true);
    assert.equal(plan.dailyBreakdown.Rabu.sessions.length >= 1, true);
    assert.equal(plan.dailyBreakdown.Jumat.sessions.length >= 1, true);
  });

  it("Scenario 27: Weekly plan skips overloaded days and logs warning", () => {
    const heavySchedules: ScheduleItem[] = [
      { id: "1", title: "Kuliah Penuh", day: "Senin", start_time: "08:00", end_time: "15:00", time: "08:00 - 15:00", type: "jadwal", priority: "tinggi", is_completed: false },
    ];
    const plan = generateWeeklyPlan({
      targetStudyHoursTotal: 4,
      preferredDays: ["Senin", "Selasa"],
    }, heavySchedules, []);

    assert.equal(plan.success, true);
    assert.ok(plan.overloadedDays.includes("Senin"));
  });

  // ==========================================
  // SECTION E: INTELLIGENT RESCHEDULING (28 to 33)
  // ==========================================

  it("Scenario 28: E1 Moved lecture schedule detects impacted study session", () => {
    const existing: ScheduleItem[] = [
      { id: "study_1", title: "Belajar Algoritma", day: "Selasa", start_time: "14:00", end_time: "16:00", time: "14:00 - 16:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    // Lecture moved to 14:00 - 16:00 on Tuesday
    const impact = detectRescheduleImpact(
      { title: "Kuliah Pengganti", day: "Selasa", newStartTime: "14:00", newEndTime: "16:00" },
      existing,
      []
    );
    assert.equal(impact.hasImpact, true);
    assert.equal(impact.impactedSessionsCount, 1);
    assert.equal(impact.proposals[0].impactedSessionId, "study_1");
  });

  it("Scenario 29: E2 Non-overlapping lecture shift produces zero impact", () => {
    const existing: ScheduleItem[] = [
      { id: "study_1", title: "Belajar Malam", day: "Selasa", start_time: "19:00", end_time: "21:00", time: "19:00 - 21:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    // Lecture moved to morning (08:00 - 10:00)
    const impact = detectRescheduleImpact(
      { title: "Kuliah Pagi", day: "Selasa", newStartTime: "08:00", newEndTime: "10:00" },
      existing,
      []
    );
    assert.equal(impact.hasImpact, false);
    assert.equal(impact.impactedSessionsCount, 0);
  });

  it("Scenario 30: E3 Reschedule proposes valid alternative free slot on the same day", () => {
    const existing: ScheduleItem[] = [
      { id: "study_1", title: "Belajar Basis Data", day: "Rabu", start_time: "09:00", end_time: "11:00", time: "09:00 - 11:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const impact = detectRescheduleImpact(
      { title: "Kuliah Baru", day: "Rabu", newStartTime: "09:00", newEndTime: "11:00" },
      existing,
      []
    );
    assert.equal(impact.hasImpact, true);
    assert.ok(impact.proposals[0].proposedSlot);
    // Proposed slot must not overlap with new lecture (09:00 - 11:00)
    assert.ok(impact.proposals[0].proposedSlot.startTime !== "09:00");
  });

  it("Scenario 31: E4 Multiple overlapping sessions detected and itemized", () => {
    const existing: ScheduleItem[] = [
      { id: "study_1", title: "Sesi 1", day: "Kamis", start_time: "13:00", end_time: "14:30", time: "13:00 - 14:30", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "study_2", title: "Sesi 2", day: "Kamis", start_time: "14:30", end_time: "16:00", time: "14:30 - 16:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const impact = detectRescheduleImpact(
      { title: "Seminar Panjang", day: "Kamis", newStartTime: "13:00", newEndTime: "16:00" },
      existing,
      []
    );
    assert.equal(impact.impactedSessionsCount, 2);
  });

  it("Scenario 32: E5 Date string conversion maps correctly to ScheduleDay", () => {
    // 2026-08-31 is Monday
    assert.equal(getDayFromDateString("2026-08-31"), "Senin");
    // 2026-09-01 is Tuesday
    assert.equal(getDayFromDateString("2026-09-01"), "Selasa");
  });

  it("Scenario 33: Reschedule proposal includes human-readable reason", () => {
    const existing: ScheduleItem[] = [
      { id: "study_1", title: "Belajar Jaringan", day: "Jumat", start_time: "13:00", end_time: "15:00", time: "13:00 - 15:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const impact = detectRescheduleImpact(
      { title: "Praktikum Jaringan", day: "Jumat", newStartTime: "13:00", newEndTime: "15:00" },
      existing,
      []
    );
    assert.ok(impact.proposals[0].reason.includes("bentrok dengan jadwal baru"));
  });

  // ==========================================
  // SECTION F: SECURITY & MULTI-TENANT ISOLATION (34 to 38)
  // ==========================================

  it("Scenario 34: F1 Context builder isolates user schedules strictly by user", () => {
    const ctx = buildScheduleIntelligenceContext("user_abc", [], []);
    assert.equal(ctx.userId, "user_abc");
    assert.equal(ctx.schedules.length, 0);
  });

  it("Scenario 35: F2 Cross-user schedules not mixed in workload analysis", () => {
    const user1Schedules: ScheduleItem[] = [
      { id: "1", user_id: "user_1", title: "Matkul User 1", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const workload = analyzeWorkload(user1Schedules, []);
    assert.equal(workload.dailyBreakdown.Senin.totalMinutes, 120);
    // User 2 context with empty schedules has 0 minutes
    const user2Workload = analyzeWorkload([], []);
    assert.equal(user2Workload.dailyBreakdown.Senin.totalMinutes, 0);
  });

  it("Scenario 36: F3 Plan request safety validator catches negative target hours", () => {
    const check = validatePlanRequestSafety({ targetHours: -5 });
    assert.equal(check.isValid, false);
    assert.ok(check.violations[0].includes("antara 1 sampai 40 jam"));
  });

  it("Scenario 37: F4 Plan request safety validator catches excessive durations (>360m)", () => {
    const check = validatePlanRequestSafety({ durationMinutes: 500 });
    assert.equal(check.isValid, false);
    assert.ok(check.violations[0].includes("antara 15 sampai 360 menit"));
  });

  it("Scenario 38: F5 Time range safety catches inverted times (endTime <= startTime)", () => {
    const check = validateTimeRangeSafety("14:00", "12:00");
    assert.equal(check.isValid, false);
    assert.ok(check.violations[0].includes("lebih besar"));
  });

  // ==========================================
  // SECTION G: OCR ARCHITECTURE & SAFETY (39 to 43)
  // ==========================================

  it("Scenario 39: G1 Native text PDF identified and parsed cleanly", () => {
    const buffer = Buffer.from("%PDF-1.4\n/Type /Page\n%%EOF");
    const res = inspectPdfStructure(buffer, "Senin 08:00 Kalkulus Ruang 101");
    assert.equal(res.hasTextLayer, true);
    assert.equal(res.isScannedPdf, false);
  });

  it("Scenario 40: G2 Scanned PDF correctly flagged by inspector", () => {
    const buffer = Buffer.from("%PDF-1.4\n/Type /Page\n%%EOF");
    const res = inspectPdfStructure(buffer, "");
    assert.equal(res.hasTextLayer, false);
    assert.equal(res.isScannedPdf, true);
  });

  it("Scenario 41: G3 Mixed PDF handles both scanned and text content", () => {
    const buffer = Buffer.from("%PDF-1.4\n/Type /Page\n/Type /Page");
    const res = inspectPdfStructure(buffer, "Short Text Snippet");
    assert.equal(res.isPdf, true);
  });

  it("Scenario 42: G4 Unconfigured cloud OCR safely defaults without fabricating text", async () => {
    const provider = new ArchitectureReadyOCRProvider();
    const result = await provider.processImage(Buffer.from("dummy"));
    assert.equal(result.text, "");
    assert.equal(result.confidence, 0);
  });

  it("Scenario 43: G5 Corrupt binary image handled with safe fallback", async () => {
    const corrupt = Buffer.from("not_a_valid_image");
    const res = await preprocessOcrImage(corrupt);
    assert.ok(res.appliedSteps.includes("raw_binary_pass_through"));
  });

  // ==========================================
  // SECTION H: EXPLAINABILITY ENGINE (44 to 47)
  // ==========================================

  it("Scenario 44: H1 Natural Indonesian summary generation", () => {
    const exp = buildRecommendationExplanation({
      activity: "Belajar Kecerdasan Buatan",
      day: "Senin",
      startTime: "09:00",
      endTime: "10:30",
      durationMinutes: 90,
      factors: ["Waktu luang optimal"],
      checkedSchedulesCount: 5,
      maxDailyMinutes: 240,
      minBreakMinutes: 30,
    });
    assert.ok(exp.summary.includes("Disarankan mempelajari Belajar Kecerdasan Buatan"));
    assert.ok(exp.summary.includes("Senin pukul 09:00–10:30"));
  });

  it("Scenario 45: H2 Factors list includes deadline urgency and workload balance", () => {
    const scoreRes = calculatePriorityScore({
      deadlineUrgency: "CRITICAL",
      taskPriority: "tinggi",
      dayWorkloadLevel: "RINGAN",
    });
    assert.ok(scoreRes.factors.some((f) => f.includes("kritis")));
    assert.ok(scoreRes.factors.some((f) => f.includes("tinggi")));
  });

  it("Scenario 46: H3 Evidence array lists verified database checks", () => {
    const exp = buildRecommendationExplanation({
      activity: "Sesi Belajar",
      day: "Rabu",
      startTime: "13:00",
      endTime: "14:30",
      durationMinutes: 90,
      factors: [],
      checkedSchedulesCount: 8,
      maxDailyMinutes: 240,
      minBreakMinutes: 30,
    });
    assert.ok(exp.evidence[0].includes("8 jadwal dan tugas aktif"));
  });

  it("Scenario 47: H4 Constraints applied explicitly document break buffer and study limits", () => {
    const exp = buildRecommendationExplanation({
      activity: "Sesi Belajar",
      day: "Kamis",
      startTime: "15:00",
      endTime: "16:30",
      durationMinutes: 90,
      factors: [],
      checkedSchedulesCount: 3,
      maxDailyMinutes: 240,
      minBreakMinutes: 30,
    });
    assert.ok(exp.constraintsApplied.some((c) => c.includes("4 jam")));
    assert.ok(exp.constraintsApplied.some((c) => c.includes("30 menit")));
  });

  // ==========================================
  // SECTION I: ATOMIC PERSISTENCE & LIVE CONFLICTS (48 to 50)
  // ==========================================

  it("Scenario 48: I1 Daily study limit validation returns valid true within bounds", () => {
    const check = validateDailyStudyLimit(60, 90, 240); // 150 <= 240
    assert.equal(check.isValid, true);
    assert.equal(check.violations.length, 0);
  });

  it("Scenario 49: I2 Daily study limit validation returns invalid when exceeding maxDailyMinutes", () => {
    const check = validateDailyStudyLimit(180, 90, 240); // 270 > 240
    assert.equal(check.isValid, false);
    assert.ok(check.violations[0].includes("melebihi batas aman"));
  });

  it("Scenario 50: I3 Time formatting helper minutesToTimeStr formats standard clock strings", () => {
    assert.equal(minutesToTimeStr(480), "08:00");
    assert.equal(minutesToTimeStr(630), "10:30");
    assert.equal(minutesToTimeStr(1350), "22:30");
  });
});
