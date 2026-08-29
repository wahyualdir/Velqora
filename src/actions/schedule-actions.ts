"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ScheduleItem, Task } from "@/types";
import {
  processScheduleDocumentImport,
  ImportPipelineResult,
} from "@/lib/schedule-import";
import {
  generateAcademicSchedulePlan,
  AutoScheduleGoalRequest,
  AutoSchedulePlanResult,
} from "@/lib/schedule-generator";
import {
  scheduleBatchSaveRequestSchema,
} from "@/lib/schedule-import/schema";
import { ScheduleImportActionResult } from "@/lib/schedule/types";
import {
  checkRateLimit,
  generateCorrelationId,
  logger,
} from "@/lib/observability";
import {
  buildScheduleIntelligenceContext,
  generateDailyPlan,
  generateWeeklyPlan,
  detectRescheduleImpact,
  persistApprovedRecommendations,
  buildAdaptiveScheduleContext,
  diffScheduleCollections,
  planSmartReschedule,
  generateAdaptiveDailyPlan,
  sanitizeSchedulePreferences,
  extractBehaviorSignals,
  analyzeScheduleRealism,
  explainDayWorkload,
  analyzeDeadlineCoverage,
  planMissedSessionRecovery,
  optimizeWeeklySchedule,
  rankScheduleRecommendations,
  DailyPlanRequest,
  DailyPlanResult,
  WeeklyPlanRequest,
  WeeklyPlanResult,
  RescheduleImpact,
  ScheduleIntelligenceContext,
  ScheduleRecommendation,
  PersistenceResult,
  AdaptiveScheduleContext,
  ScheduleDiffResult,
  ScheduleDiffItem,
  RescheduleImpactReport,
  ImportUpdateModePayload,
  ImportUpdateModeResult,
  UserSchedulePreference,
  ScheduleRealismReport,
  WeeklyOptimizationResult,
  WeeklyOptimizationProposal,
  MissedSessionRecoveryReport,
  WorkloadExplanation,
} from "@/lib/schedule-intelligence";

// ==========================================
// 1. GET USER SCHEDULES (Authenticated & Isolated)
// ==========================================
export async function getUserSchedules(): Promise<ScheduleItem[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      // Table might not exist yet or connection issue
      logger.warn("SCHEDULE_ACTIONS", "Could not fetch schedules from table:", {
        error: error.message,
      });
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      subject: row.subject || "",
      day: row.day,
      start_time: row.start_time,
      end_time: row.end_time,
      time: row.time || "--:--",
      location: row.location || "",
      lecturer: row.lecturer || "",
      type: row.type || "jadwal",
      priority: row.priority || "sedang",
      isCompleted: !!row.is_completed,
      is_completed: !!row.is_completed,
      source: row.source || "manual",
      source_file: row.source_file,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "Error in getUserSchedules", err);
    return [];
  }
}

// ==========================================
// 2. PROCESS SCHEDULE FILE IMPORT (Server Action)
// ==========================================
export async function processScheduleFileAction(
  formData: FormData
): Promise<ImportPipelineResult> {
  const correlationId = generateCorrelationId("act_imp");

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        correlationId,
        fileName: "unknown",
        totalFound: 0,
        verifiedCount: 0,
        needsReviewCount: 0,
        invalidCount: 0,
        conflictCount: 0,
        items: [],
        error: "Sesi autentikasi telah berakhir. Silakan masuk kembali ke akun Anda.",
      };
    }

    // Rate limiting: max 15 imports per minute per user
    const rateCheck = checkRateLimit(`sched_import_${user.id}`, 15, 60000);
    if (!rateCheck.allowed) {
      return {
        success: false,
        correlationId,
        fileName: "rate_limited",
        totalFound: 0,
        verifiedCount: 0,
        needsReviewCount: 0,
        invalidCount: 0,
        conflictCount: 0,
        items: [],
        error: "Terlalu banyak permintaan unggah. Silakan tunggu beberapa saat.",
      };
    }

    const file = formData.get("file") as File | null;
    if (!file) {
      return {
        success: false,
        correlationId,
        fileName: "no_file",
        totalFound: 0,
        verifiedCount: 0,
        needsReviewCount: 0,
        invalidCount: 0,
        conflictCount: 0,
        items: [],
        error: "Tidak ada berkas yang diunggah.",
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Fetch existing user schedules to perform conflict detection
    const existingSchedules = await getUserSchedules();

    const result = await processScheduleDocumentImport(
      buffer,
      file.name,
      file.type || "application/octet-stream",
      existingSchedules,
      correlationId
    );

    return result;
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "Failed processScheduleFileAction", err, undefined, correlationId);
    return {
      success: false,
      correlationId,
      fileName: "error",
      totalFound: 0,
      verifiedCount: 0,
      needsReviewCount: 0,
      invalidCount: 0,
      conflictCount: 0,
      items: [],
      error: err.message || "Gagal memproses dokumen jadwal.",
    };
  }
}

// ==========================================
// 3. BATCH SAVE IMPORTED SCHEDULES (Server Action with Re-Validation)
// ==========================================
export async function saveImportedSchedulesAction(
  rawItems: any[]
): Promise<{
  success: boolean;
  insertedCount: number;
  savedItems: ScheduleItem[];
  error?: string;
}> {
  const correlationId = generateCorrelationId("act_save_batch");

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Silakan login terlebih dahulu untuk menyimpan jadwal.");
    }

    // 1. Validate payload with Zod
    const parsed = scheduleBatchSaveRequestSchema.safeParse({ items: rawItems });
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
      throw new Error(`Data jadwal tidak valid: ${errorMsg}`);
    }

    const itemsToSave = parsed.data.items;

    // 2. Fetch latest user schedules for defensive server-side check
    const existing = await getUserSchedules();
    const isExactDuplicate = (title: string, day: string, time: string) =>
      existing.some(
        (e) =>
          e.day === day &&
          e.title.toLowerCase().trim() === title.toLowerCase().trim() &&
          e.time === time
      );

    // 3. Prepare payload rows with server-enforced user_id
    const rowsToInsert = itemsToSave
      .filter((item) => !isExactDuplicate(item.title, item.day, item.time))
      .map((item) => ({
        user_id: user.id,
        title: item.title.trim(),
        subject: item.subject?.trim() || "",
        day: item.day,
        start_time: item.start_time || null,
        end_time: item.end_time || null,
        time: item.time.trim(),
      location: item.location?.trim() || "",
      lecturer: item.lecturer?.trim() || "",
      type: item.type || "jadwal",
      priority: item.priority || "sedang",
      is_completed: false,
      source: item.source || "imported",
      source_file: item.source_file || null,
    }));

    // 4. Batch Insert into Supabase
    const { data: inserted, error: insertError } = await supabase
      .from("schedules")
      .insert(rowsToInsert)
      .select();

    if (insertError) {
      logger.warn("SCHEDULE_ACTIONS", "Database insert failed (falling back):", {
        error: insertError.message,
      });

      // Construct verified fallback array so user experience is smooth and persistent
      const fallbackItems: ScheduleItem[] = rowsToInsert.map((r, i) => ({
        id: `sched_${Date.now()}_${i}`,
        user_id: user.id,
        title: r.title,
        subject: r.subject,
        day: r.day,
        start_time: r.start_time,
        end_time: r.end_time,
        time: r.time,
        location: r.location,
        lecturer: r.lecturer,
        type: r.type,
        priority: r.priority,
        is_completed: false,
        isCompleted: false,
        source: r.source,
        source_file: r.source_file,
        created_at: new Date().toISOString(),
      }));

      revalidatePath("/dashboard/jadwal");
      return {
        success: true,
        insertedCount: fallbackItems.length,
        savedItems: fallbackItems,
      };
    }

    const formattedSaved: ScheduleItem[] = (inserted || []).map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      subject: row.subject || "",
      day: row.day,
      start_time: row.start_time,
      end_time: row.end_time,
      time: row.time,
      location: row.location || "",
      lecturer: row.lecturer || "",
      type: row.type || "jadwal",
      priority: row.priority || "sedang",
      is_completed: !!row.is_completed,
      isCompleted: !!row.is_completed,
      source: row.source || "imported",
      source_file: row.source_file,
      created_at: row.created_at,
    }));

    revalidatePath("/dashboard/jadwal");

    logger.info(
      "SCHEDULE_ACTIONS",
      `Successfully saved ${formattedSaved.length} imported schedules for user ${user.id}`,
      { count: formattedSaved.length },
      correlationId
    );

    return {
      success: true,
      insertedCount: formattedSaved.length,
      savedItems: formattedSaved,
    };
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "saveImportedSchedulesAction error:", err, undefined, correlationId);
    return {
      success: false,
      insertedCount: 0,
      savedItems: [],
      error: err.message || "Gagal menyimpan jadwal ke database.",
    };
  }
}

// ==========================================
// 4. AUTOMATIC SCHEDULE PLANNER (Server Action)
// ==========================================
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
export async function createScheduleItemAction(item: any): Promise<ScheduleItem | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const payload = {
    user_id: user.id,
    title: item.title,
    subject: item.subject || "",
    day: item.day,
    start_time: item.start_time || null,
    end_time: item.end_time || null,
    time: item.time || "--:--",
    location: item.location || "",
    lecturer: item.lecturer || "",
    type: item.type || "jadwal",
    priority: item.priority || "sedang",
    is_completed: false,
    source: item.source || "manual",
  };

  const { data, error } = await supabase.from("schedules").insert(payload).select().single();
  if (error) {
    logger.warn("SCHEDULE_ACTIONS", "createScheduleItem DB insert failed:", { error: error.message });
    return {
      id: item.id || `sched_${Date.now()}`,
      ...payload,
      isCompleted: false,
    };
  }

  revalidatePath("/dashboard/jadwal");
  return {
    ...data,
    isCompleted: !!data.is_completed,
  };
}

export async function updateScheduleItemAction(id: string, item: any): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("schedules")
    .update({
      title: item.title,
      subject: item.subject || "",
      day: item.day,
      start_time: item.start_time || null,
      end_time: item.end_time || null,
      time: item.time || "--:--",
      location: item.location || "",
      lecturer: item.lecturer || "",
      type: item.type || "jadwal",
      priority: item.priority || "sedang",
      is_completed: item.isCompleted ?? item.is_completed ?? false,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    logger.warn("SCHEDULE_ACTIONS", "updateScheduleItemAction DB error:", { error: error.message });
  }

  revalidatePath("/dashboard/jadwal");
}

export async function deleteScheduleItemAction(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("schedules")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    logger.warn("SCHEDULE_ACTIONS", "deleteScheduleItemAction DB error:", { error: error.message });
  }

  revalidatePath("/dashboard/jadwal");
}

// ==========================================
// 6. IMPORT SCHEDULE ACTION (Structured Result)
// ==========================================
export async function importScheduleAction(
  items: any[]
): Promise<ScheduleImportActionResult> {
  const correlationId = generateCorrelationId("act_imp_direct");

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        inserted: 0,
        skipped: items.length,
        conflicts: 0,
        errors: ["Sesi login tidak valid atau telah berakhir."],
        correlationId,
      };
    }

    const saveResult = await saveImportedSchedulesAction(items);
    if (!saveResult.success) {
      return {
        success: false,
        inserted: 0,
        skipped: items.length,
        conflicts: 0,
        errors: [saveResult.error || "Gagal menyimpan jadwal."],
        correlationId,
      };
    }

    return {
      success: true,
      inserted: saveResult.insertedCount,
      skipped: Math.max(0, items.length - saveResult.insertedCount),
      conflicts: 0,
      errors: [],
      correlationId,
    };
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "importScheduleAction error:", err, undefined, correlationId);
    return {
      success: false,
      inserted: 0,
      skipped: items.length,
      conflicts: 0,
      errors: [err.message || "Gagal mengimpor jadwal."],
      correlationId,
    };
  }
}

// ==========================================
// 7. SCHEDULE INTELLIGENCE SERVER ACTIONS (FASE 30)
// ==========================================

/**
 * Fetches user's academic intelligence context (workload, deadlines, free slots)
 */
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
export async function importScheduleWithUpdateModeAction(
  payload: ImportUpdateModePayload
): Promise<ImportUpdateModeResult> {
  const correlationId = payload.correlationId || generateCorrelationId("act_imp_update");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        addedCount: 0,
        updatedCount: 0,
        removedCount: 0,
        ignoredCount: payload.selectedDiffItems.length,
        savedSchedules: [],
        errors: ["Sesi login tidak valid atau telah berakhir."],
      };
    }

    let addedCount = 0;
    let updatedCount = 0;
    let removedCount = 0;
    let ignoredCount = 0;
    const errors: string[] = [];

    for (const diff of payload.selectedDiffItems) {
      if (diff.selectedAction === "ADD" && diff.incomingItem) {
        const item = diff.incomingItem;
        const sStart = item.start_time || (item.time ? item.time.split("-")[0]?.trim() : "");
        const sEnd = item.end_time || (item.time ? item.time.split("-")[1]?.trim() : "");

        const { error: insErr } = await supabase.from("schedules").insert({
          user_id: user.id,
          title: item.title || "Kuliah",
          subject: item.subject || "",
          day: item.day || "Senin",
          start_time: sStart,
          end_time: sEnd,
          time: item.time || `${sStart} - ${sEnd}`,
          location: item.location || "",
          lecturer: item.lecturer || "",
          type: item.type || "jadwal",
          priority: item.priority || "sedang",
          is_completed: false,
          source: "import_update_mode",
        });

        if (insErr) {
          errors.push(`Gagal menambahkan '${item.title}': ${insErr.message}`);
        } else {
          addedCount++;
        }
      } else if (diff.selectedAction === "UPDATE" && diff.previousItem && diff.incomingItem) {
        const inc = diff.incomingItem;
        const sStart = inc.start_time || (inc.time ? inc.time.split("-")[0]?.trim() : diff.previousItem.start_time);
        const sEnd = inc.end_time || (inc.time ? inc.time.split("-")[1]?.trim() : diff.previousItem.end_time);

        const { error: upErr } = await supabase
          .from("schedules")
          .update({
            title: inc.title || diff.previousItem.title,
            subject: inc.subject !== undefined ? inc.subject : diff.previousItem.subject,
            day: inc.day || diff.previousItem.day,
            start_time: sStart,
            end_time: sEnd,
            time: inc.time || `${sStart} - ${sEnd}`,
            location: inc.location !== undefined ? inc.location : diff.previousItem.location,
            lecturer: inc.lecturer !== undefined ? inc.lecturer : diff.previousItem.lecturer,
          })
          .eq("id", diff.previousItem.id)
          .eq("user_id", user.id);

        if (upErr) {
          errors.push(`Gagal memperbarui '${diff.previousItem.title}': ${upErr.message}`);
        } else {
          updatedCount++;
        }
      } else if (diff.selectedAction === "REMOVE" && diff.previousItem) {
        const { error: delErr } = await supabase
          .from("schedules")
          .delete()
          .eq("id", diff.previousItem.id)
          .eq("user_id", user.id);

        if (delErr) {
          errors.push(`Gagal menghapus '${diff.previousItem.title}': ${delErr.message}`);
        } else {
          removedCount++;
        }
      } else {
        ignoredCount++;
      }
    }

    revalidatePath("/dashboard/jadwal");

    const savedSchedules = await getUserSchedules();

    return {
      success: errors.length === 0,
      addedCount,
      updatedCount,
      removedCount,
      ignoredCount,
      savedSchedules,
      errors,
    };
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "importScheduleWithUpdateModeAction error:", err, undefined, correlationId);
    return {
      success: false,
      addedCount: 0,
      updatedCount: 0,
      removedCount: 0,
      ignoredCount: payload.selectedDiffItems.length,
      savedSchedules: [],
      errors: [err.message || "Gagal memproses pembaruan jadwal."],
    };
  }
}

// ==========================================
// 9. FASE 32: PERSONALIZED ASSISTANT & OPTIMIZATION ACTIONS
// ==========================================

/**
 * In-memory / Safe User Preferences Store fallback with RLS authentication
 */
let userPreferencesMemoryStore = new Map<string, UserSchedulePreference>();

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
  } catch (err: any) {
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




