"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ScheduleItem, Task, ScheduleDay } from "@/types";
import { getUserSchedules } from "./crud";
import { getUserSchedulePreferencesAction } from "./intelligence";
import { getAcademicHealthAction, getScheduleSnapshotAction } from "./orchestration";
import {
  generateCorrelationId,
  logger,
} from "@/lib/observability";
import {
  SessionOutcome,
  ActualVsPlannedReport,
  PersonalizationFeedbackPrompt,
  HealthTrendReport,
  ThreeWayWhatIfResult,
  RecommendationOutcomeRecord,
} from "@/lib/schedule-outcomes/types";
import { analyzeActualVsPlanned } from "@/lib/schedule-outcomes/actual-vs-planned";
import { evaluatePersonalizationFeedback } from "@/lib/schedule-outcomes/personalization-feedback";
import { calculateCalibrationMultipliers } from "@/lib/schedule-outcomes/recommendation-calibration";
import { evaluateHealthTrend } from "@/lib/schedule-outcomes/health-trends";
import { generatePatternEarlyWarnings } from "@/lib/schedule-outcomes/early-warning-2";
import { simulateThreeWayOutcome } from "@/lib/schedule-outcomes/what-if-outcome-simulator";
import {
  ScheduleSnapshot,
  AcademicHealthScore,
  OptimizationProposal,
  SimulationModification,
} from "@/lib/schedule-orchestration";

export async function recordSessionOutcomeAction(
  payload: Omit<SessionOutcome, "id" | "userId" | "recordedAt">
): Promise<{ success: boolean; outcome?: SessionOutcome; error?: string }> {
  const correlationId = generateCorrelationId("act_record_outcome");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Sesi login berakhir." };
    }

    const outcome: SessionOutcome = {
      ...payload,
      id: `out_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId: user.id,
      recordedAt: new Date().toISOString(),
    };

    try {
      await supabase.from("schedule_outcomes").insert({
        id: outcome.id,
        user_id: user.id,
        schedule_item_id: outcome.scheduleItemId,
        session_title: outcome.sessionTitle,
        day: outcome.day,
        planned_start_time: outcome.plannedStartTime,
        planned_end_time: outcome.plannedEndTime,
        planned_duration_minutes: outcome.plannedDurationMinutes,
        actual_start_time: outcome.actualStartTime,
        actual_end_time: outcome.actualEndTime,
        actual_duration_minutes: outcome.actualDurationMinutes,
        status: outcome.status,
        skip_reason: outcome.skipReason,
        reschedule_reason: outcome.rescheduleReason,
        notes: outcome.notes,
        recorded_at: outcome.recordedAt,
      });
    } catch (dbErr) {
      logger.warn("SCHEDULE_ACTIONS", "schedule_outcomes insert fallback warning:", { error: (dbErr as any)?.message });
    }

    revalidatePath("/dashboard/jadwal");
    return { success: true, outcome };
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "recordSessionOutcomeAction error:", err, undefined, correlationId);
    return { success: false, error: err.message || "Gagal mencatat hasil sesi." };
  }
}

export async function getSessionOutcomesAction(): Promise<{
  success: boolean;
  outcomes: SessionOutcome[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, outcomes: [], error: "Sesi login berakhir." };
    }

    const { data, error } = await supabase
      .from("schedule_outcomes")
      .select("*")
      .eq("user_id", user.id)
      .order("recorded_at", { ascending: false });

    if (error || !data) {
      return { success: true, outcomes: [] };
    }

    const outcomes: SessionOutcome[] = data.map((d: any) => ({
      id: d.id,
      userId: d.user_id,
      scheduleItemId: d.schedule_item_id,
      sessionTitle: d.session_title,
      day: d.day,
      plannedDate: d.planned_date,
      plannedStartTime: d.planned_start_time,
      plannedEndTime: d.planned_end_time,
      plannedDurationMinutes: d.planned_duration_minutes,
      actualStartTime: d.actual_start_time,
      actualEndTime: d.actual_end_time,
      actualDurationMinutes: d.actual_duration_minutes,
      status: d.status,
      skipReason: d.skip_reason,
      rescheduleReason: d.reschedule_reason,
      notes: d.notes,
      recordedAt: d.recorded_at,
    }));

    return { success: true, outcomes };
  } catch (err: any) {
    return { success: true, outcomes: [] };
  }
}

export async function getActualVsPlannedAnalysisAction(): Promise<{
  success: boolean;
  report?: ActualVsPlannedReport;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Sesi login berakhir." };
    }

    const outcomesRes = await getSessionOutcomesAction();
    const report = analyzeActualVsPlanned(user.id, outcomesRes.outcomes || []);
    return { success: true, report };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getPersonalizationFeedbackAction(): Promise<{
  success: boolean;
  prompt?: PersonalizationFeedbackPrompt;
  error?: string;
}> {
  try {
    const [prefRes, outcomesRes] = await Promise.all([
      getUserSchedulePreferencesAction(),
      getSessionOutcomesAction(),
    ]);

    if (!prefRes.success || !prefRes.preferences) {
      return { success: false, error: "Gagal memuat preferensi pengguna." };
    }

    const prompt = evaluatePersonalizationFeedback(
      prefRes.preferences,
      outcomesRes.outcomes || []
    );
    return { success: true, prompt };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getHealthTrendAction(): Promise<{
  success: boolean;
  report?: HealthTrendReport;
  error?: string;
}> {
  try {
    const healthRes = await getAcademicHealthAction();
    if (!healthRes.success || !healthRes.health) {
      return { success: false, error: "Gagal memuat skor kesehatan akademik." };
    }

    const report = evaluateHealthTrend(healthRes.health.overallScore, []);
    return { success: true, report };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function simulateThreeWayOutcomeAction(
  modification: SimulationModification
): Promise<{
  success: boolean;
  result?: ThreeWayWhatIfResult;
  error?: string;
}> {
  try {
    const snapResult = await getScheduleSnapshotAction();
    if (!snapResult.success || !snapResult.snapshot) {
      return { success: false, error: snapResult.error || "Gagal memuat snapshot." };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let tasks: Task[] = [];
    if (user) {
      const { data: tasksData } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .neq("status", "selesai");
      if (tasksData) tasks = tasksData as Task[];
    }

    const currentSchedules = [
      ...snapResult.snapshot.courses,
      ...snapResult.snapshot.studySessions,
    ];

    const result = simulateThreeWayOutcome(currentSchedules, tasks, modification);
    return { success: true, result };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal melakukan simulasi 3 arah." };
  }
}
