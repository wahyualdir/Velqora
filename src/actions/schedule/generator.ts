"use server";

import { createClient } from "@/lib/supabase/server";
import { Task } from "@/types";
import { getUserSchedules } from "./crud";
import {
  generateAcademicSchedulePlan,
  AutoScheduleGoalRequest,
  AutoSchedulePlanResult,
} from "@/lib/schedule-generator";
import {
  generateCorrelationId,
  logger,
} from "@/lib/observability";
import {
  generateDailyPlan,
  generateWeeklyPlan,
  DailyPlanResult,
  WeeklyPlanResult,
  type DailyPlanRequest,
  type WeeklyPlanRequest,
} from "@/lib/schedule-intelligence";

export async function generateAutoScheduleAction(
  goalData: AutoScheduleGoalRequest
): Promise<AutoSchedulePlanResult> {
  const correlationId = generateCorrelationId("act_gen");

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        goal: goalData,
        totalCandidateSlots: 0,
        recommendedSessionsCount: 0,
        totalStudyHours: 0,
        workloadLevel: "optimal",
        candidates: [],
        availabilityOverview: {
          Senin: [],
          Selasa: [],
          Rabu: [],
          Kamis: [],
          Jumat: [],
          Sabtu: [],
          Minggu: [],
        },
        error: "Silakan login terlebih dahulu untuk menyusun jadwal otomatis.",
      };
    }

    // 1. Fetch user's existing schedules
    const existingSchedules = await getUserSchedules();

    // 2. Fetch pending tasks to avoid scheduling over urgent deadlines
    let existingTasks: Task[] = [];
    const { data: tasksData } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .neq("status", "selesai");

    if (tasksData) {
      existingTasks = tasksData as Task[];
    }

    // 3. Run deterministic generator
    const plan = await generateAcademicSchedulePlan(
      goalData,
      existingSchedules,
      existingTasks,
      correlationId
    );

    return plan;
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "generateAutoScheduleAction error:", err, undefined, correlationId);
    return {
      success: false,
      goal: goalData,
      totalCandidateSlots: 0,
      recommendedSessionsCount: 0,
      totalStudyHours: 0,
      workloadLevel: "optimal",
      candidates: [],
      availabilityOverview: {
        Senin: [],
        Selasa: [],
        Rabu: [],
        Kamis: [],
        Jumat: [],
        Sabtu: [],
        Minggu: [],
      },
      error: err.message || "Gagal menyusun rekomendasi jadwal otomatis.",
    };
  }
}

// ==========================================
// 5. CRUD SCHEDULE ACTIONS
// ==========================================

export async function generateDailyPlanAction(
  request: DailyPlanRequest
): Promise<DailyPlanResult> {
  const correlationId = generateCorrelationId("act_daily_plan");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        date: request.date,
        day: request.day || "Senin",
        totalMinutesPlanned: 0,
        totalHoursPlanned: 0,
        targetMet: false,
        recommendedSessions: [],
        freeSlotsRemaining: [],
        workloadStatus: "RINGAN",
        warnings: [],
        error: "Silakan login terlebih dahulu.",
      };
    }

    const schedules = await getUserSchedules();

    let tasks: Task[] = [];
    const { data: tasksData } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .neq("status", "selesai");

    if (tasksData) {
      tasks = tasksData as Task[];
    }

    return generateDailyPlan(request, schedules, tasks);
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "generateDailyPlanAction error:", err, undefined, correlationId);
    return {
      success: false,
      date: request.date,
      day: request.day || "Senin",
      totalMinutesPlanned: 0,
      totalHoursPlanned: 0,
      targetMet: false,
      recommendedSessions: [],
      freeSlotsRemaining: [],
      workloadStatus: "RINGAN",
      warnings: [],
      error: err.message || "Gagal menyusun rencana harian.",
    };
  }
}

/**
 * Generates Smart Weekly Study Plan ("Susun Minggu Saya")
 */

export async function generateWeeklyPlanAction(
  request: WeeklyPlanRequest
): Promise<WeeklyPlanResult> {
  const correlationId = generateCorrelationId("act_weekly_plan");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        totalWeeklyMinutesPlanned: 0,
        totalWeeklyHoursPlanned: 0,
        recommendedSessionsCount: 0,
        sessions: [],
        dailyBreakdown: {
          Senin: { sessions: [], totalMinutes: 0, level: "RINGAN" },
          Selasa: { sessions: [], totalMinutes: 0, level: "RINGAN" },
          Rabu: { sessions: [], totalMinutes: 0, level: "RINGAN" },
          Kamis: { sessions: [], totalMinutes: 0, level: "RINGAN" },
          Jumat: { sessions: [], totalMinutes: 0, level: "RINGAN" },
          Sabtu: { sessions: [], totalMinutes: 0, level: "RINGAN" },
          Minggu: { sessions: [], totalMinutes: 0, level: "RINGAN" },
        },
        overloadedDays: [],
        warnings: [],
        error: "Silakan login terlebih dahulu.",
      };
    }

    const schedules = await getUserSchedules();

    let tasks: Task[] = [];
    const { data: tasksData } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .neq("status", "selesai");

    if (tasksData) {
      tasks = tasksData as Task[];
    }

    return generateWeeklyPlan(request, schedules, tasks);
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "generateWeeklyPlanAction error:", err, undefined, correlationId);
    return {
      success: false,
      totalWeeklyMinutesPlanned: 0,
      totalWeeklyHoursPlanned: 0,
      recommendedSessionsCount: 0,
      sessions: [],
      dailyBreakdown: {
        Senin: { sessions: [], totalMinutes: 0, level: "RINGAN" },
        Selasa: { sessions: [], totalMinutes: 0, level: "RINGAN" },
        Rabu: { sessions: [], totalMinutes: 0, level: "RINGAN" },
        Kamis: { sessions: [], totalMinutes: 0, level: "RINGAN" },
        Jumat: { sessions: [], totalMinutes: 0, level: "RINGAN" },
        Sabtu: { sessions: [], totalMinutes: 0, level: "RINGAN" },
        Minggu: { sessions: [], totalMinutes: 0, level: "RINGAN" },
      },
      overloadedDays: [],
      warnings: [],
      error: err.message || "Gagal menyusun rencana mingguan.",
    };
  }
}

/**
 * Detects rescheduling impact when an event moves
 */
