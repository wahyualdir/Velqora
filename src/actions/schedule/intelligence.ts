"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ScheduleItem, Task, type ScheduleDay } from "@/types";
import {
  generateCorrelationId,
  logger,
  logIntelligenceEvent,
  type IntelligenceEvent,
} from "@/lib/observability";
import { getUserSchedules } from "./crud";
import { generate12QuestionExplanation } from "@/lib/schedule-outcomes/explanation-engine-4";
import { Explainability12Answers } from "@/lib/schedule-outcomes/types";

const userPreferencesMemoryStore = new Map<string, UserSchedulePreference>();
import {
  buildScheduleIntelligenceContext,
  detectRescheduleImpact,
  persistApprovedRecommendations,
  buildAdaptiveScheduleContext,
  diffScheduleCollections,
  planSmartReschedule,
  sanitizeSchedulePreferences,
  analyzeScheduleRealism,
  explainDayWorkload,
  planMissedSessionRecovery,
  optimizeWeeklySchedule,
  ScheduleIntelligenceContext,
  AdaptiveScheduleContext,
  ScheduleDiffResult,
  RescheduleImpactReport,
  UserSchedulePreference,
  ScheduleRealismReport,
  WeeklyOptimizationResult,
  MissedSessionRecoveryReport,
  WorkloadExplanation,
  type RescheduleImpact,
  type ScheduleRecommendation,
  type PersistenceResult,
  type WeeklyOptimizationProposal,
} from "@/lib/schedule-intelligence";

export async function getScheduleIntelligenceContextAction(): Promise<{
  success: boolean;
  context?: ScheduleIntelligenceContext;
  error?: string;
}> {
  const correlationId = generateCorrelationId("act_intel_ctx");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Silakan login terlebih dahulu." };
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

    const context = buildScheduleIntelligenceContext(user.id, schedules, tasks);
    return { success: true, context };
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "getScheduleIntelligenceContextAction error:", err, undefined, correlationId);
    return { success: false, error: err.message || "Gagal memuat analisis jadwal cerdas." };
  }
}

/**
 * Generates Smart Daily Study Plan ("Susun Hari Saya")
 */

export async function detectRescheduleImpactAction(
  changedEvent: {
    id?: string;
    title: string;
    day: any;
    newStartTime: string;
    newEndTime: string;
  }
): Promise<RescheduleImpact> {
  const schedules = await getUserSchedules();
  return detectRescheduleImpact(changedEvent, schedules, []);
}

/**
 * Confirms and persists approved recommendations atomically with revalidation
 */

export async function confirmScheduleRecommendationsAction(
  recommendations: ScheduleRecommendation[]
): Promise<PersistenceResult> {
  const correlationId = generateCorrelationId("act_rec_confirm");
  const res = await persistApprovedRecommendations(recommendations, correlationId);
  if (res.success) {
    revalidatePath("/dashboard/jadwal");
  }
  return res;
}

// ==========================================
// 8. FASE 31: ADAPTIVE SCHEDULE & DIFF ACTIONS
// ==========================================

/**
 * Fetches real-time Adaptive Schedule Context
 */

export async function getAdaptiveScheduleContextAction(): Promise<{
  success: boolean;
  context?: AdaptiveScheduleContext;
  error?: string;
}> {
  const correlationId = generateCorrelationId("act_adapt_ctx");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Silakan login terlebih dahulu." };
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

    const context = buildAdaptiveScheduleContext(user.id, schedules, tasks);
    return { success: true, context };
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "getAdaptiveScheduleContextAction error:", err, undefined, correlationId);
    return { success: false, error: err.message || "Gagal memuat konteks adaptif jadwal." };
  }
}

/**
 * Compares incoming schedules against user's current schedule collection
 */

export async function diffScheduleVersionsAction(
  incomingItems: Array<Partial<ScheduleItem> & { courseCode?: string }>
): Promise<{
  success: boolean;
  diff?: ScheduleDiffResult;
  error?: string;
}> {
  const correlationId = generateCorrelationId("act_sched_diff");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Silakan login terlebih dahulu." };
    }

    const existing = await getUserSchedules();
    const diff = diffScheduleCollections(existing, incomingItems);

    return { success: true, diff };
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "diffScheduleVersionsAction error:", err, undefined, correlationId);
    return { success: false, error: err.message || "Gagal membandingkan versi jadwal." };
  }
}

/**
 * Analyzes complete ripple effects and discovers alternative slots when an event shifts
 */

export async function analyzeRescheduleImpactAction(
  changedEvent: {
    id?: string;
    title: string;
    day: any;
    previousTime?: string;
    newStartTime: string;
    newEndTime: string;
  }
): Promise<{
  success: boolean;
  impactReport?: RescheduleImpactReport;
  error?: string;
}> {
  const correlationId = generateCorrelationId("act_resched_impact");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Silakan login terlebih dahulu." };
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

    const impactReport = planSmartReschedule({
      changedEvent,
      existingSchedules: schedules,
      tasks,
    });

    return { success: true, impactReport };
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "analyzeRescheduleImpactAction error:", err, undefined, correlationId);
    return { success: false, error: err.message || "Gagal menganalisis dampak perubahan jadwal." };
  }
}

/**
 * Applies a reschedule proposal by updating the changed event and relocating affected study session
 */

export async function applyRescheduleProposalAction(payload: {
  changedEvent: {
    id: string;
    title: string;
    day: any;
    startTime: string;
    endTime: string;
  };
  relocatedSession?: {
    id: string;
    day: any;
    startTime: string;
    endTime: string;
  };
}): Promise<{
  success: boolean;
  error?: string;
}> {
  const correlationId = generateCorrelationId("act_apply_resched");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Silakan login terlebih dahulu." };
    }

    // 1. Update changed lecture event
    const { error: updateMainErr } = await supabase
      .from("schedules")
      .update({
        day: payload.changedEvent.day,
        start_time: payload.changedEvent.startTime,
        end_time: payload.changedEvent.endTime,
        time: `${payload.changedEvent.startTime} - ${payload.changedEvent.endTime}`,
      })
      .eq("id", payload.changedEvent.id)
      .eq("user_id", user.id);

    if (updateMainErr) {
      return { success: false, error: updateMainErr.message || "Gagal memperbarui jadwal." };
    }

    // 2. If an affected study session is relocated, update its slot
    if (payload.relocatedSession) {
      const { error: updateRelocErr } = await supabase
        .from("schedules")
        .update({
          day: payload.relocatedSession.day,
          start_time: payload.relocatedSession.startTime,
          end_time: payload.relocatedSession.endTime,
          time: `${payload.relocatedSession.startTime} - ${payload.relocatedSession.endTime}`,
        })
        .eq("id", payload.relocatedSession.id)
        .eq("user_id", user.id);

      if (updateRelocErr) {
        return { success: false, error: updateRelocErr.message || "Gagal memindahkan sesi belajar." };
      }
    }

    revalidatePath("/dashboard/jadwal");
    return { success: true };
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "applyRescheduleProposalAction error:", err, undefined, correlationId);
    return { success: false, error: err.message || "Gagal menerapkan perubahan jadwal." };
  }
}

/**
 * Imports schedules using Update Mode ("Perbarui Jadwal")
 */

export async function getUserSchedulePreferencesAction(): Promise<{
  success: boolean;
  preferences: UserSchedulePreference;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || "guest";
    const stored = userPreferencesMemoryStore.get(userId);
    const sanitized = sanitizeSchedulePreferences(stored);
    return { success: true, preferences: sanitized };
  } catch {
    return { success: true, preferences: sanitizeSchedulePreferences(null) };
  }
}

export async function saveUserSchedulePreferencesAction(
  prefs: Partial<UserSchedulePreference>
): Promise<{
  success: boolean;
  preferences: UserSchedulePreference;
  error?: string;
}> {
  const correlationId = generateCorrelationId("act_save_prefs");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, preferences: sanitizeSchedulePreferences(null), error: "Silakan login terlebih dahulu." };
    }

    const sanitized = sanitizeSchedulePreferences({ ...prefs, userId: user.id });
    userPreferencesMemoryStore.set(user.id, sanitized);

    revalidatePath("/dashboard/jadwal");
    return { success: true, preferences: sanitized };
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "saveUserSchedulePreferencesAction error:", err, undefined, correlationId);
    return {
      success: false,
      preferences: sanitizeSchedulePreferences(null),
      error: err.message || "Gagal menyimpan preferensi jadwal.",
    };
  }
}

export async function getWeeklyOptimizationProposalAction(): Promise<{
  success: boolean;
  result?: WeeklyOptimizationResult;
  error?: string;
}> {
  const correlationId = generateCorrelationId("act_opt_week");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Silakan login terlebih dahulu." };
    }

    const schedules = await getUserSchedules();
    const prefsRes = await getUserSchedulePreferencesAction();

    let tasks: Task[] = [];
    const { data: tasksData } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .neq("status", "selesai");

    if (tasksData) {
      tasks = tasksData as Task[];
    }

    const result = optimizeWeeklySchedule(schedules, {
      preference: prefsRes.preferences,
      tasks,
    });

    return { success: true, result };
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "getWeeklyOptimizationProposalAction error:", err, undefined, correlationId);
    return { success: false, error: err.message || "Gagal menyusun optimasi mingguan." };
  }
}

export async function applyWeeklyOptimizationAction(
  proposals: WeeklyOptimizationProposal[]
): Promise<{
  success: boolean;
  appliedCount: number;
  error?: string;
}> {
  const correlationId = generateCorrelationId("act_apply_opt");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, appliedCount: 0, error: "Silakan login terlebih dahulu." };
    }

    let appliedCount = 0;
    for (const p of proposals) {
      if (p.selected && p.sessionId) {
        const timeParts = p.toTime.split("-");
        const sStart = timeParts[0]?.trim() || "";
        const sEnd = timeParts[1]?.trim() || "";

        const { error: upErr } = await supabase
          .from("schedules")
          .update({
            day: p.toDay,
            start_time: sStart,
            end_time: sEnd,
            time: p.toTime,
          })
          .eq("id", p.sessionId)
          .eq("user_id", user.id);

        if (!upErr) appliedCount++;
      }
    }

    revalidatePath("/dashboard/jadwal");
    return { success: true, appliedCount };
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "applyWeeklyOptimizationAction error:", err, undefined, correlationId);
    return { success: false, appliedCount: 0, error: err.message || "Gagal menerapkan optimasi." };
  }
}

export async function getMissedSessionRecoveryAction(
  sessionId: string
): Promise<{
  success: boolean;
  report?: MissedSessionRecoveryReport;
  error?: string;
}> {
  const correlationId = generateCorrelationId("act_missed_rec");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Silakan login terlebih dahulu." };
    }

    const schedules = await getUserSchedules();
    const targetSession = schedules.find((s) => s.id === sessionId);

    if (!targetSession) {
      return { success: false, error: "Sesi belajar tidak ditemukan." };
    }

    const report = planMissedSessionRecovery(targetSession, schedules, "Senin");
    return { success: true, report };
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "getMissedSessionRecoveryAction error:", err, undefined, correlationId);
    return { success: false, error: err.message || "Gagal mencari pemulihan sesi terlewat." };
  }
}

export async function applyMissedSessionRecoveryAction(payload: {
  sessionId: string;
  targetDay: any;
  startTime: string;
  endTime: string;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  const correlationId = generateCorrelationId("act_apply_missed");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Silakan login terlebih dahulu." };
    }

    const { error: upErr } = await supabase
      .from("schedules")
      .update({
        day: payload.targetDay,
        start_time: payload.startTime,
        end_time: payload.endTime,
        time: `${payload.startTime} - ${payload.endTime}`,
      })
      .eq("id", payload.sessionId)
      .eq("user_id", user.id);

    if (upErr) {
      return { success: false, error: upErr.message || "Gagal memulihkan sesi." };
    }

    revalidatePath("/dashboard/jadwal");
    return { success: true };
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "applyMissedSessionRecoveryAction error:", err, undefined, correlationId);
    return { success: false, error: err.message || "Gagal memulihkan sesi belajar." };
  }
}

export async function getWorkloadExplanationAction(
  day: any
): Promise<{
  success: boolean;
  explanation?: WorkloadExplanation;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const schedules = await getUserSchedules();
    let tasks: Task[] = [];

    if (user) {
      const { data: tasksData } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .neq("status", "selesai");
      if (tasksData) tasks = tasksData as Task[];
    }

    const explanation = explainDayWorkload(day, schedules, tasks);
    return { success: true, explanation };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memuat penjelasan beban." };
  }
}

export async function getScheduleRealismReportAction(): Promise<{
  success: boolean;
  report?: ScheduleRealismReport;
  error?: string;
}> {
  try {
    const schedules = await getUserSchedules();
    const report = analyzeScheduleRealism(schedules);
    return { success: true, report };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menganalisis realisme jadwal." };
  }
}

// ==========================================
// 10. FASE 33: AUTONOMOUS ORCHESTRATION ACTIONS
// ==========================================

export async function getRecommendationExplanationAction(params: {
  sessionTitle: string;
  targetDay: ScheduleDay;
  targetStartTime: string;
  targetEndTime: string;
  durationMinutes: number;
  workloadMinutesAfter: number;
  conflictsCount: number;
  qualityScore: number;
  rankingPosition?: number;
}): Promise<{
  success: boolean;
  explanation?: Explainability12Answers;
  error?: string;
}> {
  try {
    const explanation = generate12QuestionExplanation({
      ...params,
      rankingPosition: params.rankingPosition || 1,
    });
    return { success: true, explanation };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menghasilkan penjelasan." };
  }
}

export async function logClientIntelligenceEventAction(
  event: IntelligenceEvent,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    logIntelligenceEvent(event, {
      userId: user?.id,
      ...metadata,
    });
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function recordRecommendationFeedbackAction(
  recommendationId: string,
  wasAccepted: boolean,
  proposalTitle = "OPTIMASI_MINGGUAN"
): Promise<{ success: boolean; error?: string }> {
  const correlationId = generateCorrelationId("act_rec_feedback");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Sesi login berakhir." };
    }

    const outcomeScore = wasAccepted ? 90 : 30;

    try {
      await supabase.from("recommendation_outcomes").insert({
        id: `rec_out_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        user_id: user.id,
        recommendation_id: recommendationId,
        proposal_title: proposalTitle,
        was_accepted: wasAccepted,
        was_executed: wasAccepted,
        conflicts_occurred: 0,
        outcome_score: outcomeScore,
        recorded_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      logger.warn("SCHEDULE_ACTIONS", "recommendation_outcomes insert warning:", { error: (dbErr as any)?.message });
    }

    logIntelligenceEvent(
      wasAccepted ? "recommendation_accepted" : "recommendation_rejected",
      { userId: user.id, recommendationId, wasAccepted },
      correlationId
    );

    revalidatePath("/dashboard/jadwal");
    revalidatePath("/dashboard/jadwal/intelligence");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
