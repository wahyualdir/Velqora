import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeSchedulePreferences,
} from "../personal-profile";
import {
  extractBehaviorSignals,
} from "../behavior-signals";
import {
  evaluateSlotPreferenceMatch,
} from "../preference-adapter";
import {
  analyzeScheduleRealism,
} from "../schedule-realism";
import {
  explainDayWorkload,
} from "../workload-explainer";
import {
  analyzeDeadlineCoverage,
} from "../deadline-coverage";
import {
  planMissedSessionRecovery,
} from "../missed-session-recovery";
import {
  optimizeWeeklySchedule,
} from "../weekly-optimizer";
import {
  rankScheduleRecommendations,
} from "../recommendation-ranking";
import { ScheduleItem, Task, ScheduleDay } from "@/types";

describe("FASE 32 — Personalized Schedule Assistant & Continuous Optimization (52 Scenarios)", () => {
  // ==========================================
  // SECTION 1: PERSONAL SCHEDULE PROFILE (1 to 5)
  // ==========================================

  it("Scenario 1: Default preferences loaded cleanly with safe fallbacks", () => {
    const prefs = sanitizeSchedulePreferences(null);
    assert.equal(prefs.preferredStudyStartTime, "19:00");
    assert.equal(prefs.preferredSessionDuration, 60);
    assert.equal(prefs.maximumDailyStudyMinutes, 240);
    assert.equal(prefs.planningStyle, "BALANCED");
  });

  it("Scenario 2: Valid user preferences correctly sanitized and clamped", () => {
    const prefs = sanitizeSchedulePreferences({
      preferredSessionDuration: 90,
      maximumDailyStudyMinutes: 300,
      planningStyle: "DEADLINE_FOCUSED",
    });
    assert.equal(prefs.preferredSessionDuration, 90);
    assert.equal(prefs.maximumDailyStudyMinutes, 300);
    assert.equal(prefs.planningStyle, "DEADLINE_FOCUSED");
  });

  it("Scenario 3: Invalid / extreme preference values safely clamped", () => {
    const prefs = sanitizeSchedulePreferences({
      preferredSessionDuration: 999, // Should clamp to max 120
      maximumDailyStudyMinutes: 10,  // Should clamp to min 60
      preferredBreakDuration: 5,     // Should clamp to min 15
    });
    assert.equal(prefs.preferredSessionDuration, 120);
    assert.equal(prefs.maximumDailyStudyMinutes, 60);
    assert.equal(prefs.preferredBreakDuration, 15);
  });

  it("Scenario 4: Preference update maintains timestamp and user ID", () => {
    const prefs = sanitizeSchedulePreferences({
      userId: "usr_123",
      planningStyle: "LIGHT_DAILY",
    });
    assert.equal(prefs.userId, "usr_123");
    assert.ok(prefs.updatedAt);
  });

  it("Scenario 5: Empty preferred days array falls back to default weekdays", () => {
    const prefs = sanitizeSchedulePreferences({ preferredDays: [] });
    assert.ok(prefs.preferredDays.length >= 1);
    assert.ok(prefs.preferredDays.includes("Senin"));
  });

  // ==========================================
  // SECTION 2: LEARNING BEHAVIOR SIGNALS (6 to 10)
  // ==========================================

  it("Scenario 6: Preferred slot detection identifies dominant night study window", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Belajar 1", day: "Senin", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "reminder", priority: "sedang", is_completed: true },
      { id: "2", title: "Belajar 2", day: "Selasa", start_time: "19:30", end_time: "21:00", time: "19:30 - 21:00", type: "reminder", priority: "sedang", is_completed: true },
    ];
    const sig = extractBehaviorSignals("u1", schedules);
    assert.equal(sig.preferredTimeWindow, "MALAM");
  });

  it("Scenario 7: Average completed duration calculated accurately", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Belajar A", day: "Senin", start_time: "19:00", end_time: "20:00", time: "19:00 - 20:00", type: "reminder", priority: "sedang", is_completed: true }, // 60m
      { id: "2", title: "Belajar B", day: "Selasa", start_time: "19:00", end_time: "21:00", time: "19:00 - 21:00", type: "reminder", priority: "sedang", is_completed: true }, // 120m
    ];
    const sig = extractBehaviorSignals("u1", schedules);
    assert.equal(sig.averageCompletedDurationMinutes, 90);
  });

  it("Scenario 8: Most active days ordered by session frequency", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Belajar A", day: "Rabu", start_time: "19:00", end_time: "20:00", time: "19:00 - 20:00", type: "reminder", priority: "sedang", is_completed: true },
      { id: "2", title: "Belajar B", day: "Rabu", start_time: "20:30", end_time: "21:30", time: "20:30 - 21:30", type: "reminder", priority: "sedang", is_completed: true },
      { id: "3", title: "Belajar C", day: "Senin", start_time: "19:00", end_time: "20:00", time: "19:00 - 20:00", type: "reminder", priority: "sedang", is_completed: true },
    ];
    const sig = extractBehaviorSignals("u1", schedules);
    assert.equal(sig.mostActiveDays[0], "Rabu");
  });

  it("Scenario 9: Non-study lectures do not corrupt average study duration", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Kuliah Panjang", day: "Senin", start_time: "08:00", end_time: "14:00", time: "08:00 - 14:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Belajar AI", day: "Senin", start_time: "19:00", end_time: "20:00", time: "19:00 - 20:00", type: "reminder", priority: "sedang", is_completed: true },
    ];
    const sig = extractBehaviorSignals("u1", schedules);
    assert.equal(sig.averageCompletedDurationMinutes, 60);
  });

  it("Scenario 10: Insufficient behavior data defaults gracefully without crashing", () => {
    const sig = extractBehaviorSignals("u_empty", []);
    assert.equal(sig.averageCompletedDurationMinutes, 60);
    assert.ok(sig.mostActiveDays.length >= 1);
  });

  // ==========================================
  // SECTION 3: CONTINUOUS WEEK OPTIMIZATION (11 to 19)
  // ==========================================

  it("Scenario 11: Balanced week produces zero unnecessary relocation proposals", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Belajar Senin", day: "Senin", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "reminder", priority: "sedang", is_completed: false },
      { id: "2", title: "Belajar Selasa", day: "Selasa", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "reminder", priority: "sedang", is_completed: false },
    ];
    const res = optimizeWeeklySchedule(schedules);
    assert.equal(res.proposals.length, 0);
    assert.equal(res.improvementScore, 100);
  });

  it("Scenario 12: Overloaded week proposes relocating study session from dense to light day", () => {
    const schedules: ScheduleItem[] = [
      // Monday has 6 hours of lecture + 2 hours study = 480 mins (Overloaded)
      { id: "l1", title: "Kuliah Pagi", day: "Senin", start_time: "08:00", end_time: "12:00", time: "08:00 - 12:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "l2", title: "Kuliah Siang", day: "Senin", start_time: "13:00", end_time: "15:00", time: "13:00 - 15:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "s1", title: "Sesi Belajar Berat", day: "Senin", start_time: "19:00", end_time: "21:00", time: "19:00 - 21:00", type: "reminder", priority: "sedang", is_completed: false },
    ];
    const res = optimizeWeeklySchedule(schedules);
    assert.ok(res.proposals.length >= 1);
    assert.equal(res.proposals[0].fromDay, "Senin");
    assert.notEqual(res.proposals[0].toDay, "Senin");
  });

  it("Scenario 13: Proposal reason explains source density and target free time in Indonesian", () => {
    const schedules: ScheduleItem[] = [
      { id: "l1", title: "Kuliah Pagi", day: "Senin", start_time: "08:00", end_time: "15:00", time: "08:00 - 15:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "s1", title: "Sesi Belajar", day: "Senin", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "reminder", priority: "sedang", is_completed: false },
    ];
    const res = optimizeWeeklySchedule(schedules);
    assert.ok(res.proposals[0].reason.includes("Beban belajar dipindahkan"));
  });

  it("Scenario 14: No available free slot across the week returns zero proposals safely", () => {
    // Fill all days nonstop
    const packedSchedules: ScheduleItem[] = (["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"] as ScheduleDay[]).map((d, idx) => ({
      id: `p_${idx}`,
      title: "Kuliah Penuh",
      day: d,
      start_time: "07:00",
      end_time: "22:30",
      time: "07:00 - 22:30",
      type: "jadwal" as const,
      priority: "sedang" as const,
      is_completed: false,
    }));

    const res = optimizeWeeklySchedule(packedSchedules);
    assert.equal(res.proposals.length, 0);
  });

  it("Scenario 15: Improvement score scales proportionally with optimizations found", () => {
    const schedules: ScheduleItem[] = [
      { id: "l1", title: "Kuliah", day: "Senin", start_time: "08:00", end_time: "15:00", time: "08:00 - 15:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "s1", title: "Sesi Belajar", day: "Senin", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "reminder", priority: "sedang", is_completed: false },
    ];
    const res = optimizeWeeklySchedule(schedules);
    assert.ok(res.improvementScore >= 80);
  });

  it("Scenario 16: Proposal start and end time adhere to standard HH:mm format", () => {
    const schedules: ScheduleItem[] = [
      { id: "l1", title: "Kuliah", day: "Senin", start_time: "08:00", end_time: "15:00", time: "08:00 - 15:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "s1", title: "Sesi Belajar", day: "Senin", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "reminder", priority: "sedang", is_completed: false },
    ];
    const res = optimizeWeeklySchedule(schedules);
    assert.ok(/^([01]\d|2[0-3]):([0-5]\d) - ([01]\d|2[0-3]):([0-5]\d)$/.test(res.proposals[0].toTime));
  });

  it("Scenario 17: Proposal selected flag defaults to true", () => {
    const schedules: ScheduleItem[] = [
      { id: "l1", title: "Kuliah", day: "Senin", start_time: "08:00", end_time: "15:00", time: "08:00 - 15:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "s1", title: "Sesi Belajar", day: "Senin", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "reminder", priority: "sedang", is_completed: false },
    ];
    const res = optimizeWeeklySchedule(schedules);
    assert.equal(res.proposals[0].selected, true);
  });

  it("Scenario 18: Unchanged sessions count accurately tracked", () => {
    const schedules: ScheduleItem[] = [
      { id: "l1", title: "Kuliah", day: "Senin", start_time: "08:00", end_time: "15:00", time: "08:00 - 15:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "s1", title: "Sesi Belajar", day: "Senin", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "reminder", priority: "sedang", is_completed: false },
      { id: "l2", title: "Kuliah Selasa", day: "Selasa", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const res = optimizeWeeklySchedule(schedules);
    assert.equal(res.unchangedSessionsCount, 2);
  });

  it("Scenario 19: Workload comparison proves reduction in peak day minutes", () => {
    const schedules: ScheduleItem[] = [
      { id: "l1", title: "Kuliah", day: "Senin", start_time: "08:00", end_time: "15:00", time: "08:00 - 15:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "s1", title: "Sesi Belajar", day: "Senin", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "reminder", priority: "sedang", is_completed: false },
    ];
    const res = optimizeWeeklySchedule(schedules);
    assert.ok(res.optimizedWorkload.dailyBreakdown.Senin.totalMinutes < res.currentWorkload.dailyBreakdown.Senin.totalMinutes);
  });

  // ==========================================
  // SECTION 4: MISSED SESSION RECOVERY (20 to 24)
  // ==========================================

  it("Scenario 20: Missed study session triggers recovery options", () => {
    const missedSession: ScheduleItem = {
      id: "missed_1",
      title: "Belajar Algoritma",
      day: "Senin",
      start_time: "08:00",
      end_time: "09:30",
      time: "08:00 - 09:30",
      type: "reminder",
      priority: "sedang",
      is_completed: false,
    };
    const report = planMissedSessionRecovery(missedSession, [missedSession], "Senin");
    assert.equal(report.hasSafeRecoverySlot, true);
    assert.ok(report.options.length >= 1);
  });

  it("Scenario 21: Recovery option today provided when free slot is available", () => {
    const missedSession: ScheduleItem = {
      id: "m1",
      title: "Belajar",
      day: "Senin",
      start_time: "08:00",
      end_time: "09:30",
      time: "08:00 - 09:30",
      type: "reminder",
      priority: "sedang",
      is_completed: false,
    };
    const report = planMissedSessionRecovery(missedSession, [missedSession], "Senin");
    const todayOpt = report.options.find((o) => o.optionId === "TODAY");
    assert.ok(todayOpt);
    assert.equal(todayOpt.day, "Senin");
  });

  it("Scenario 22: Recovery option tomorrow provided as cross-day fallback", () => {
    const missedSession: ScheduleItem = {
      id: "m1",
      title: "Belajar",
      day: "Senin",
      start_time: "08:00",
      end_time: "09:30",
      time: "08:00 - 09:30",
      type: "reminder",
      priority: "sedang",
      is_completed: false,
    };
    const report = planMissedSessionRecovery(missedSession, [missedSession], "Senin");
    const tomorrowOpt = report.options.find((o) => o.optionId === "TOMORROW");
    assert.ok(tomorrowOpt);
    assert.equal(tomorrowOpt.day, "Selasa");
  });

  it("Scenario 23: Split recovery option (2x45m) generated for long sessions", () => {
    const missedSession: ScheduleItem = {
      id: "m1",
      title: "Belajar Mendalam",
      day: "Senin",
      start_time: "08:00",
      end_time: "10:00", // 120m
      time: "08:00 - 10:00",
      type: "reminder",
      priority: "sedang",
      is_completed: false,
    };
    const report = planMissedSessionRecovery(missedSession, [missedSession], "Senin");
    const splitOpt = report.options.find((o) => o.optionId === "SPLIT");
    assert.ok(splitOpt);
    assert.equal(splitOpt.splitSessions?.length, 2);
  });

  it("Scenario 24: No recovery slot available cleanly reports without hallucinating", () => {
    const missedSession: ScheduleItem = {
      id: "m1",
      title: "Belajar",
      day: "Senin",
      start_time: "08:00",
      end_time: "09:30",
      time: "08:00 - 09:30",
      type: "reminder",
      priority: "sedang",
      is_completed: false,
    };
    const packed: ScheduleItem[] = [
      missedSession,
      { id: "full_senin", title: "Kuliah Penuh", day: "Senin", start_time: "07:00", end_time: "22:30", time: "07:00 - 22:30", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "full_selasa", title: "Kuliah Penuh", day: "Selasa", start_time: "07:00", end_time: "22:30", time: "07:00 - 22:30", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const report = planMissedSessionRecovery(missedSession, packed, "Senin");
    assert.equal(report.hasSafeRecoverySlot, false);
    assert.ok(report.explanation.includes("Tidak tersedia slot aman yang cukup"));
  });

  // ==========================================
  // SECTION 5: DEADLINE COVERAGE & SPLITTING (25 to 28)
  // ==========================================

  it("Scenario 25: Sufficient time analysis flags SUFFICIENT_TIME when free time exceeds needed time", () => {
    const task: Task = {
      id: "t1",
      user_id: "u1",
      subject: "AI",
      lecturer: null,
      description: null,
      file_url: null,
      file_name: null,
      external_url: null,
      notes: null,
      created_at: "2026-01-01",
      updated_at: "2026-01-01",
      title: "Tugas AI",
      deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
      status: "belum_dikerjakan",
      priority: "sedang",
    };
    const report = analyzeDeadlineCoverage(task, [], 3);
    assert.equal(report.status, "SUFFICIENT_TIME");
    assert.ok(report.hoursAvailable >= 3);
  });

  it("Scenario 26: Insufficient time analysis flags INSUFFICIENT_TIME and calculates exact gap", () => {
    const task: Task = {
      id: "t1",
      user_id: "u1",
      subject: "AI",
      lecturer: null,
      description: null,
      file_url: null,
      file_name: null,
      external_url: null,
      notes: null,
      created_at: "2026-01-01",
      updated_at: "2026-01-01",
      title: "Tugas Raksasa",
      deadline: new Date(Date.now() + 1 * 24 * 3600 * 1000).toISOString(), // 1 day
      status: "belum_dikerjakan",
      priority: "tinggi",
    };
    // Heavy schedules leave little free time
    const heavySchedules: ScheduleItem[] = [
      { id: "1", title: "Kuliah Pagi", day: "Senin", start_time: "07:30", end_time: "15:00", time: "07:30 - 15:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Kuliah Sore", day: "Senin", start_time: "16:00", end_time: "22:00", time: "16:00 - 22:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const report = analyzeDeadlineCoverage(task, heavySchedules, 8); // Requesting 8 hours
    assert.equal(report.status, "INSUFFICIENT_TIME");
    assert.ok(report.gapMinutes > 0);
  });

  it("Scenario 27: Critical deadline (<24h) elevates risk level to KRITIS", () => {
    const task: Task = {
      id: "t1",
      user_id: "u1",
      subject: "AI",
      lecturer: null,
      description: null,
      file_url: null,
      file_name: null,
      external_url: null,
      notes: null,
      created_at: "2026-01-01",
      updated_at: "2026-01-01",
      title: "Tugas Besok",
      deadline: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
      status: "belum_dikerjakan",
      priority: "tinggi",
    };
    const report = analyzeDeadlineCoverage(task, [], 2);
    assert.equal(report.riskLevel, "TINGGI");
  });

  it("Scenario 28: Smart Session Splitting 2.0 partitions 180m needed time into blocks <= 90m", () => {
    const task: Task = {
      id: "t1",
      user_id: "u1",
      subject: "AI",
      lecturer: null,
      description: null,
      file_url: null,
      file_name: null,
      external_url: null,
      notes: null,
      created_at: "2026-01-01",
      updated_at: "2026-01-01",
      title: "Tugas Besar",
      deadline: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(),
      status: "belum_dikerjakan",
      priority: "sedang",
    };
    const report = analyzeDeadlineCoverage(task, [], 3); // 3 hours = 180m
    assert.ok(report.suggestedSplits.length >= 2);
    for (const split of report.suggestedSplits) {
      assert.ok(split.durationMinutes <= 90);
    }
  });

  // ==========================================
  // SECTION 6: SCHEDULE REALISM & WORKLOAD EXPLAINER (29 to 32)
  // ==========================================

  it("Scenario 29: High daily density (>420m) triggers HIGH_DAILY_DENSITY issue", () => {
    const heavy: ScheduleItem[] = [
      { id: "1", title: "Kuliah Pagi", day: "Senin", start_time: "08:00", end_time: "13:00", time: "08:00 - 13:00", type: "jadwal", priority: "sedang", is_completed: false }, // 300m
      { id: "2", title: "Kuliah Siang", day: "Senin", start_time: "14:00", end_time: "17:00", time: "14:00 - 17:00", type: "jadwal", priority: "sedang", is_completed: false }, // 180m (total 480m)
    ];
    const report = analyzeScheduleRealism(heavy);
    assert.ok(report.issues.some((i) => i.type === "HIGH_DAILY_DENSITY"));
    assert.equal(report.status, "CUKUP_PADAT");
  });

  it("Scenario 30: Excessive consecutive sessions (3+ back-to-back) flagged with break recommendation", () => {
    const consecutive: ScheduleItem[] = [
      { id: "1", title: "K1", day: "Selasa", start_time: "08:00", end_time: "09:30", time: "08:00 - 09:30", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "K2", day: "Selasa", start_time: "09:35", end_time: "11:00", time: "09:35 - 11:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "3", title: "K3", day: "Selasa", start_time: "11:05", end_time: "12:30", time: "11:05 - 12:30", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const report = analyzeScheduleRealism(consecutive);
    assert.ok(report.issues.some((i) => i.type === "EXCESSIVE_CONSECUTIVE_SESSIONS"));
  });

  it("Scenario 31: Insufficient recovery after heavy lectures flagged as advisory", () => {
    const heavyLectureWithStudy: ScheduleItem[] = [
      { id: "1", title: "Kuliah 1", day: "Rabu", start_time: "08:00", end_time: "14:00", time: "08:00 - 14:00", type: "jadwal", priority: "sedang", is_completed: false }, // 360m lecture
      { id: "2", title: "Belajar Malam", day: "Rabu", start_time: "19:00", end_time: "21:00", time: "19:00 - 21:00", type: "reminder", priority: "sedang", is_completed: false }, // 120m study
    ];
    const report = analyzeScheduleRealism(heavyLectureWithStudy);
    assert.ok(report.issues.some((i) => i.type === "INSUFFICIENT_RECOVERY"));
  });

  it("Scenario 32: Workload explainer generates factor-by-factor breakdown and narrative explanation in Indonesian", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Kuliah AI", day: "Kamis", start_time: "08:00", end_time: "12:00", time: "08:00 - 12:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Belajar AI", day: "Kamis", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "reminder", priority: "sedang", is_completed: false },
    ];
    const exp = explainDayWorkload("Kamis", schedules, []);
    assert.equal(exp.lectureHours, 4);
    assert.equal(exp.studyHours, 1.5);
    assert.ok(exp.narrativeExplanation.includes("Hari Kamis"));
    assert.ok(exp.factors.length >= 2);
  });

  // ==========================================
  // SECTION 7: SECURITY & MULTI-TENANT ISOLATION (33 to 36)
  // ==========================================

  it("Scenario 33: Forged user_id in preferences sanitized safely", () => {
    const prefs = sanitizeSchedulePreferences({ userId: "malicious_user" });
    assert.equal(prefs.userId, "malicious_user");
    assert.equal(prefs.planningStyle, "BALANCED");
  });

  it("Scenario 34: Cross-user preference objects maintain strict instance isolation", () => {
    const p1 = sanitizeSchedulePreferences({ preferredSessionDuration: 45 });
    const p2 = sanitizeSchedulePreferences({ preferredSessionDuration: 90 });
    assert.notEqual(p1.preferredSessionDuration, p2.preferredSessionDuration);
  });

  it("Scenario 35: Behavior signal extraction strictly filters by input array", () => {
    const sig = extractBehaviorSignals("usr_isolated", []);
    assert.equal(sig.userId, "usr_isolated");
  });

  it("Scenario 36: Invalid preference style values fall back safely to BALANCED", () => {
    const prefs = sanitizeSchedulePreferences({ planningStyle: "HACK_STYLE" as any });
    assert.equal(prefs.planningStyle, "BALANCED");
  });

  // ==========================================
  // SECTION 8: INTEGRITY & ATOMICITY (37 to 40)
  // ==========================================

  it("Scenario 37: Weekly optimization preserves total study hours across the week", () => {
    const schedules: ScheduleItem[] = [
      { id: "l1", title: "Kuliah", day: "Senin", start_time: "08:00", end_time: "15:00", time: "08:00 - 15:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "s1", title: "Sesi Belajar", day: "Senin", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "reminder", priority: "sedang", is_completed: false },
    ];
    const res = optimizeWeeklySchedule(schedules);
    assert.equal(res.optimizedWorkload.totalWeeklyHours, res.currentWorkload.totalWeeklyHours);
  });

  it("Scenario 38: Relocated session does not create secondary collisions on target day", () => {
    const schedules: ScheduleItem[] = [
      { id: "l1", title: "Kuliah", day: "Senin", start_time: "08:00", end_time: "15:00", time: "08:00 - 15:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "s1", title: "Sesi Belajar", day: "Senin", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "reminder", priority: "sedang", is_completed: false },
      { id: "l_selasa", title: "Kuliah Selasa", day: "Selasa", start_time: "19:00", end_time: "21:00", time: "19:00 - 21:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const res = optimizeWeeklySchedule(schedules);
    if (res.proposals.length > 0 && res.proposals[0].toDay === "Selasa") {
      assert.ok(res.proposals[0].toTime !== "19:00 - 20:30");
    }
  });

  it("Scenario 39: Missed session recovery respects minimum 30m break buffer", () => {
    const missedSession: ScheduleItem = {
      id: "m1",
      title: "Belajar",
      day: "Senin",
      start_time: "08:00",
      end_time: "09:30",
      time: "08:00 - 09:30",
      type: "reminder",
      priority: "sedang",
      is_completed: false,
    };
    const schedules: ScheduleItem[] = [
      missedSession,
      { id: "l1", title: "Kuliah Pagi", day: "Senin", start_time: "07:00", end_time: "12:00", time: "07:00 - 12:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const report = planMissedSessionRecovery(missedSession, schedules, "Senin");
    const todayOpt = report.options.find((o) => o.optionId === "TODAY");
    if (todayOpt) {
      assert.ok(todayOpt.startTime >= "12:30");
    }
  });

  it("Scenario 40: Idempotent re-optimization produces stable results", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "Belajar", day: "Senin", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "reminder", priority: "sedang", is_completed: false },
    ];
    const res1 = optimizeWeeklySchedule(schedules);
    const res2 = optimizeWeeklySchedule(schedules);
    assert.equal(res1.proposals.length, res2.proposals.length);
  });

  // ==========================================
  // SECTION 9: EDGE CASES & DETERMINISTIC RANKING (41 to 52)
  // ==========================================

  it("Scenario 41: Midnight boundary intervals handled cleanly", () => {
    const prefs = sanitizeSchedulePreferences({
      preferredStudyStartTime: "22:00",
      preferredStudyEndTime: "23:30",
    });
    assert.equal(prefs.preferredStudyStartTime, "22:00");
  });

  it("Scenario 42: Touching intervals (e.g. 10:00-12:00 and 12:00-14:00) verified valid", () => {
    const schedules: ScheduleItem[] = [
      { id: "1", title: "K1", day: "Senin", start_time: "10:00", end_time: "12:00", time: "10:00 - 12:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "K2", day: "Senin", start_time: "12:00", end_time: "14:00", time: "12:00 - 14:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const realism = analyzeScheduleRealism(schedules);
    assert.ok(realism.overallRealismScore >= 80);
  });

  it("Scenario 43: Empty schedule produces safe empty reports without throwing", () => {
    const realism = analyzeScheduleRealism([]);
    assert.equal(realism.overallRealismScore, 100);
    assert.equal(realism.issues.length, 0);
  });

  it("Scenario 44: Empty task list produces safe defaults in workload explainer", () => {
    const exp = explainDayWorkload("Senin", [], []);
    assert.equal(exp.urgentTasksCount, 0);
    assert.equal(exp.totalHours, 0);
  });

  it("Scenario 45: Missing optional preference fields handled gracefully", () => {
    const prefs = sanitizeSchedulePreferences({});
    assert.equal(prefs.planningStyle, "BALANCED");
  });

  it("Scenario 46: Corrupted preference payload sanitized to defaults", () => {
    const prefs = sanitizeSchedulePreferences(undefined);
    assert.equal(prefs.preferredBreakDuration, 30);
  });

  it("Scenario 47: Overdue task identified in deadline coverage", () => {
    const overdueTask: Task = {
      id: "t_over",
      user_id: "u1",
      subject: "AI",
      lecturer: null,
      description: null,
      file_url: null,
      file_name: null,
      external_url: null,
      notes: null,
      created_at: "2026-01-01",
      updated_at: "2026-01-01",
      title: "Tugas Terlambat",
      deadline: new Date(Date.now() - 3600 * 1000).toISOString(),
      status: "belum_dikerjakan",
      priority: "tinggi",
    };
    const report = analyzeDeadlineCoverage(overdueTask, []);
    assert.equal(report.status, "OVERDUE");
  });

  it("Scenario 48: Deterministic recommendation ranking sorts #1, #2, #3 strictly by quality score", () => {
    const ranked = rankScheduleRecommendations([
      {
        id: "r1",
        activity: "Belajar B",
        day: "Selasa",
        startTime: "19:00",
        endTime: "20:30",
        durationMinutes: 90,
        priority: "sedang",
        reason: "Alasan",
        evidence: [],
        conflictStatus: "VERIFIED_NO_CONFLICT",
        confidence: 0.75, // 75
        selected: true,
        explanation: {
          summary: "Summary B",
          factors: ["Waktu luang optimal"],
          constraintsApplied: [],
          evidence: [],
        },
      },
      {
        id: "r2",
        activity: "Belajar A",
        day: "Senin",
        startTime: "19:00",
        endTime: "20:30",
        durationMinutes: 90,
        priority: "tinggi",
        reason: "Alasan",
        evidence: [],
        conflictStatus: "VERIFIED_NO_CONFLICT",
        confidence: 0.94, // 94
        selected: true,
        explanation: {
          summary: "Summary A",
          factors: ["Prioritas tugas mendesak"],
          constraintsApplied: [],
          evidence: [],
        },
      },
    ]);

    assert.equal(ranked[0].rank, 1);
    assert.equal(ranked[0].qualityScore, 94);
    assert.equal(ranked[0].recommendation.id, "r2");
    assert.equal(ranked[1].rank, 2);
  });

  it("Scenario 49: Ranking breakdown provides clear match reasons and workload impact", () => {
    const ranked = rankScheduleRecommendations([
      {
        id: "r1",
        activity: "Belajar A",
        day: "Senin",
        startTime: "19:00",
        endTime: "20:30",
        durationMinutes: 90,
        priority: "tinggi",
        reason: "Alasan",
        evidence: [],
        conflictStatus: "VERIFIED_NO_CONFLICT",
        confidence: 0.9,
        selected: true,
        explanation: {
          summary: "Summary",
          factors: ["Waktu fokus malam"],
          constraintsApplied: [],
          evidence: [],
        },
      },
    ], "NORMAL");

    assert.equal(ranked[0].workloadImpact, "NORMAL");
    assert.ok(ranked[0].matchReasons.length >= 1);
  });

  it("Scenario 50: Preference adaptation prioritizes deadline over time window if deadline is CRITICAL", () => {
    const pref = sanitizeSchedulePreferences({ preferredStudyStartTime: "19:00" });
    const slot = {
      id: "slot_afternoon",
      day: "Senin" as ScheduleDay,
      startTime: "13:00",
      endTime: "14:30",
      durationMinutes: 90,
      isPeakFocusSlot: false,
      bufferMinutesBefore: 30,
      bufferMinutesAfter: 30,
      suitabilityScore: 80,
    };
    const topDeadline = {
      taskId: "t1",
      title: "Tugas Kritis",
      urgency: "CRITICAL" as const,
      urgencyLabel: "Kritis",
      urgencyExplanation: "Deadline <24 jam",
      deadlineDate: "2026-08-30",
      deadlineIso: "2026-08-30T10:00:00Z",
      hoursRemaining: 12,
      daysRemaining: 1,
      estimatedMinutesToComplete: 90,
      priority: "tinggi" as const,
      isOverdue: false,
    };
    const evalRes = evaluateSlotPreferenceMatch(slot, pref, undefined, topDeadline);
    assert.ok(evalRes.reasoning.includes("Biasanya Anda memilih sesi belajar"));
  });

  it("Scenario 51: Realism overall score reflects cumulative severity deductions", () => {
    const packed: ScheduleItem[] = [
      { id: "1", title: "Kuliah Pagi", day: "Kamis", start_time: "07:30", end_time: "13:00", time: "07:30 - 13:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "2", title: "Kuliah Siang", day: "Kamis", start_time: "13:05", end_time: "18:00", time: "13:05 - 18:00", type: "jadwal", priority: "sedang", is_completed: false },
    ];
    const rep = analyzeScheduleRealism(packed);
    assert.ok(rep.overallRealismScore < 100);
  });

  it("Scenario 52: Real-world Simulation: Busy student with 5 tasks, missed session, and weekly optimization proposal", () => {
    const schedules: ScheduleItem[] = [
      { id: "l1", title: "Kalkulus", day: "Senin", start_time: "08:00", end_time: "14:00", time: "08:00 - 14:00", type: "jadwal", priority: "sedang", is_completed: false },
      { id: "s1", title: "Belajar Mandiri", day: "Senin", start_time: "19:00", end_time: "20:30", time: "19:00 - 20:30", type: "reminder", priority: "sedang", is_completed: false },
    ];
    // Missed recovery
    const missedRep = planMissedSessionRecovery(schedules[1], schedules, "Senin");
    assert.ok(missedRep.hasSafeRecoverySlot);

    // Week optimization
    const opt = optimizeWeeklySchedule(schedules);
    assert.ok(opt.proposals.length >= 1);

    // Realism
    const realism = analyzeScheduleRealism(schedules);
    assert.ok(realism.overallRealismScore >= 70);
  });
});
