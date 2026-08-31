"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ScheduleItem, Task } from "@/types";
import { getUserSchedules } from "./crud";
import {
  generateCorrelationId,
  logger,
  logIntelligenceEvent,
} from "@/lib/observability";
import {
  generateScheduleSnapshot,
  generateContinuousOptimizationProposal,
  simulateScheduleModification,
  evaluateApprovalGate,
  applyProposalWithRollback,
  rollbackAppliedProposal,
  calculateAcademicHealthScore,
  generateEarlyWarnings,
  ScheduleSnapshot,
  OptimizationProposal,
  WhatIfSimulationResult,
  AcademicHealthScore,
  EarlyWarningItem,
  SimulationModification,
} from "@/lib/schedule-orchestration";
import {
  sanitizeSchedulePreferences,
  DEFAULT_SCHEDULE_PREFERENCE,
  analyzeDeadlineCoverage,
  type UserSchedulePreference,
} from "@/lib/schedule-intelligence";
import { type AcademicIntelligenceCenterData } from "./types";
import { getUserSchedulePreferencesAction } from "./intelligence";
import { generate12QuestionExplanation } from "@/lib/schedule-outcomes/explanation-engine-4";
import { evaluateHistoricalRecommendations } from "@/lib/schedule-outcomes/recommendation-outcome";
import { evaluateHealthTrend } from "@/lib/schedule-outcomes/health-trends";
import { generatePatternEarlyWarnings } from "@/lib/schedule-outcomes/early-warning-2";
import { analyzeActualVsPlanned } from "@/lib/schedule-outcomes/actual-vs-planned";
import {
  RecommendationOutcomeRecord,
  SessionOutcome,
} from "@/lib/schedule-outcomes/types";
import { calculateRecommendationQuality } from "@/lib/schedule-intelligence/recommendation-quality";
import { extractBehaviorSignals2 } from "@/lib/schedule-intelligence/behavior-signals";
import { analyzeWorkload } from "@/lib/schedule-intelligence/workload-analyzer";
import { analyzeTaskDeadlines } from "@/lib/schedule-intelligence/deadline-analyzer";
import { ACADEMIC_CONSTANTS } from "@/lib/schedule/academic-constants";

export async function getScheduleSnapshotAction(): Promise<{
  success: boolean;
  snapshot?: ScheduleSnapshot;
  error?: string;
}> {
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
    if (tasksData) tasks = tasksData as Task[];

    const prefResult = await getUserSchedulePreferencesAction();
    const snapshot = generateScheduleSnapshot(
      user.id,
      schedules,
      tasks,
      prefResult.preferences
    );

    return { success: true, snapshot };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal membuat snapshot jadwal." };
  }
}

export async function getAcademicHealthAction(): Promise<{
  success: boolean;
  health?: AcademicHealthScore;
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

    const health = calculateAcademicHealthScore(schedules, tasks);
    return { success: true, health };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menganalisis skor kesehatan akademik." };
  }
}

export async function getEarlyWarningsAction(): Promise<{
  success: boolean;
  warnings: EarlyWarningItem[];
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

    const warnings = generateEarlyWarnings(schedules, tasks);
    return { success: true, warnings };
  } catch (err: any) {
    return { success: false, warnings: [], error: err.message || "Gagal menganalisis peringatan dini." };
  }
}

export async function simulateWhatIfAction(
  modification: SimulationModification
): Promise<{
  success: boolean;
  simulation?: WhatIfSimulationResult;
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

    const simulation = simulateScheduleModification(schedules, tasks, modification);
    return { success: true, simulation };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menjalankan simulasi what-if." };
  }
}

export async function generateOrchestrationProposalAction(): Promise<{
  success: boolean;
  proposal?: OptimizationProposal;
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

    const proposal = generateContinuousOptimizationProposal(
      snapResult.snapshot.userId,
      snapResult.snapshot,
      tasks
    );

    return { success: true, proposal };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menghasilkan usulan optimasi." };
  }
}

export async function applyOrchestratedProposalAction(
  proposal: OptimizationProposal
): Promise<{
  success: boolean;
  appliedProposal?: OptimizationProposal;
  error?: string;
}> {
  const correlationId = generateCorrelationId("act_orchestrate_apply");
  try {
    const snapResult = await getScheduleSnapshotAction();
    if (!snapResult.success || !snapResult.snapshot) {
      return { success: false, error: "Gagal memuat kondisi kalender terbaru." };
    }

    const gate = evaluateApprovalGate(
      "APPLY_OPTIMIZATION",
      {
        userId: snapResult.snapshot.userId,
        parentSnapshotHash: proposal.parentSnapshotHash,
      },
      snapResult.snapshot
    );

    if (!gate.allowed) {
      return { success: false, error: gate.reason };
    }

    const applyRes = applyProposalWithRollback(proposal, snapResult.snapshot);
    if (!applyRes.success) {
      return { success: false, error: applyRes.error };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Sesi login berakhir." };
    }

    // Persist affected schedule updates atomically
    for (const item of proposal.affectedSessions) {
      const startTime = item.toTime.split(" - ")[0];
      const endTime = item.toTime.split(" - ")[1];

      await supabase
        .from("schedules")
        .update({
          day: item.toDay,
          start_time: startTime,
          end_time: endTime,
          time: item.toTime,
        })
        .eq("id", item.id)
        .eq("user_id", user.id);
    }

    revalidatePath("/dashboard/jadwal");
    return { success: true, appliedProposal: applyRes.updatedProposal };
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "applyOrchestratedProposalAction error:", err, undefined, correlationId);
    return { success: false, error: err.message || "Gagal menerapkan usulan optimasi." };
  }
}

export async function rollbackProposalAction(
  proposal: OptimizationProposal
): Promise<{
  success: boolean;
  restoredProposal?: OptimizationProposal;
  error?: string;
}> {
  const correlationId = generateCorrelationId("act_orchestrate_rollback");
  try {
    const snapResult = await getScheduleSnapshotAction();
    if (!snapResult.success || !snapResult.snapshot) {
      return { success: false, error: "Gagal memuat kondisi kalender terbaru." };
    }

    const rollbackRes = rollbackAppliedProposal(proposal, snapResult.snapshot);
    if (!rollbackRes.success || !proposal.previousSchedulesBackup) {
      return { success: false, error: rollbackRes.error || "Pencadangan rollback tidak tersedia." };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Sesi login berakhir." };
    }

    // Restore affected items to original positions
    for (const item of proposal.affectedSessions) {
      const origItem = proposal.previousSchedulesBackup.find((s) => s.id === item.id);
      if (origItem) {
        await supabase
          .from("schedules")
          .update({
            day: origItem.day,
            start_time: origItem.start_time,
            end_time: origItem.end_time,
            time: origItem.time,
          })
          .eq("id", origItem.id)
          .eq("user_id", user.id);
      }
    }

    revalidatePath("/dashboard/jadwal");
    return { success: true, restoredProposal: rollbackRes.updatedProposal };
  } catch (err: any) {
    logger.error("SCHEDULE_ACTIONS", "rollbackProposalAction error:", err, undefined, correlationId);
    return { success: false, error: err.message || "Gagal membatalkan usulan optimasi." };
  }
}

export async function getAcademicIntelligenceCenterDataAction(): Promise<{
  success: boolean;
  data?: AcademicIntelligenceCenterData;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized: Silakan login terlebih dahulu." };
    }

    // 1. Fetch live schedules, tasks, preferences, and session outcomes in parallel
    const [schedulesRes, tasksRes, prefRes, outcomesRes, recOutcomesRes] = await Promise.all([
      supabase.from("schedules").select("*").eq("user_id", user.id),
      supabase.from("tasks").select("*").eq("user_id", user.id),
      supabase.from("schedule_preferences").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("schedule_outcomes").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      supabase.from("recommendation_outcomes").select("*").eq("user_id", user.id).order("recorded_at", { ascending: false }).limit(20),
    ]);

    const schedules: ScheduleItem[] = schedulesRes.data || [];
    const tasks: Task[] = tasksRes.data || [];
    const preferences: UserSchedulePreference = prefRes.data
      ? sanitizeSchedulePreferences({
          preferredStudyStartTime: prefRes.data.preferred_study_start_time,
          preferredStudyEndTime: prefRes.data.preferred_study_end_time,
          preferredDays: prefRes.data.preferred_study_days,
          maximumDailyStudyMinutes: prefRes.data.maximum_daily_study_minutes,
          preferredBreakDuration: prefRes.data.break_duration_minutes,
        })
      : DEFAULT_SCHEDULE_PREFERENCE;

    const sessionOutcomes: SessionOutcome[] = (outcomesRes.data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      scheduleItemId: row.schedule_item_id,
      sessionTitle: row.session_title,
      day: row.day,
      plannedStartTime: row.planned_start_time,
      plannedEndTime: row.planned_end_time,
      plannedDurationMinutes: row.planned_duration_minutes,
      actualStartTime: row.actual_start_time,
      actualEndTime: row.actual_end_time,
      actualDurationMinutes: row.actual_duration_minutes,
      status: row.status,
      skipReason: row.skip_reason,
      notes: row.notes,
      recordedAt: row.created_at || row.recorded_at,
    }));

    const recOutcomes: RecommendationOutcomeRecord[] = (recOutcomesRes.data || []).map((row: any) => ({
      recommendationId: row.recommendation_id,
      userId: row.user_id,
      proposalTitle: row.proposal_title,
      wasAccepted: row.was_accepted,
      wasExecuted: row.was_executed,
      affectedSessionsOutcomes: row.affected_sessions_outcomes || [],
      conflictsOccurred: row.conflicts_occurred || 0,
      outcomeScore: row.outcome_score,
      recordedAt: row.recorded_at || row.created_at,
    }));

    // 2. Compute Core Deterministic Intelligence
    const snapshot = generateScheduleSnapshot(user.id, schedules, tasks, preferences);
    const health = calculateAcademicHealthScore(schedules, tasks);
    const healthTrend = evaluateHealthTrend(health.overallScore, []);
    const workload = analyzeWorkload(schedules, tasks);
    const deadlines = analyzeTaskDeadlines(tasks);
    const deadlineCoverage = tasks.map((t) => analyzeDeadlineCoverage(t, schedules));
    const behaviorSignals = extractBehaviorSignals2(user.id, schedules, sessionOutcomes);
    const earlyWarnings = generatePatternEarlyWarnings(schedules, tasks, sessionOutcomes, recOutcomes);
    const adherenceReport = analyzeActualVsPlanned(user.id, sessionOutcomes);
    const proposal = generateContinuousOptimizationProposal(user.id, snapshot, tasks, sessionOutcomes, recOutcomes);

    // 3. Format Top 3 Recommendations
    const topRecommendations = proposal.affectedSessions.slice(0, 3).map((item, idx) => {
      const qScore = calculateRecommendationQuality({
        deadlineUrgency: "UPCOMING",
        slotDurationMinutes: item.durationMinutes || 90,
        targetDurationMinutes: item.durationMinutes || 90,
        hasConflict: false,
        dayWorkloadLevel: workload.dailyBreakdown[item.toDay]?.level || "NORMAL",
        hasSufficientBreak: true,
        isPreferredTimeMatch: true,
      });

      const explanation = generate12QuestionExplanation({
        sessionTitle: item.title,
        targetDay: item.toDay,
        targetStartTime: item.toTime.split(" - ")[0] || "14:00",
        targetEndTime: item.toTime.split(" - ")[1] || "15:30",
        durationMinutes: item.durationMinutes || 90,
        workloadMinutesAfter: workload.dailyBreakdown[item.toDay]?.totalMinutes || 120,
        conflictsCount: 0,
        qualityScore: qScore.score,
        rankingPosition: idx + 1,
      });

      return {
        id: `rec_${item.id}_${idx}`,
        sessionId: item.id,
        title: item.title,
        fromDay: item.fromDay,
        fromTime: item.fromTime,
        toDay: item.toDay,
        toTime: item.toTime,
        durationMinutes: item.durationMinutes || 90,
        qualityScore: qScore.score,
        qualityLabel: qScore.label,
        impactSummary: [
          `Mengurangi beban pada ${item.fromDay} dan mendistribusikan ke ${item.toDay}`,
          "Bebas bentrok jadwal dengan kuliah dan sesi belajar lain",
          `Menjaga batas aman beban belajar harian (${ACADEMIC_CONSTANTS.DAILY_WORKLOAD_HARD_CAP_MINUTES} menit)`,
        ],
        explanationAnswers: explanation as any,
      };
    });

    const recEvaluation = evaluateHistoricalRecommendations(recOutcomes);

    // Log structured telemetry safely
    logIntelligenceEvent("recommendation_generated", {
      userId: user.id,
      recommendationsCount: topRecommendations.length,
      healthScore: health.overallScore,
    });

    return {
      success: true,
      data: {
        schedules,
        tasks,
        snapshot,
        health,
        healthTrend,
        workload,
        deadlines,
        deadlineCoverage,
        behaviorSignals,
        topRecommendations,
        earlyWarnings,
        adherenceReport,
        recommendationHistory: recOutcomes,
        recommendationSummary: {
          totalRecommendations: recEvaluation.totalRecommendations,
          acceptedCount: recEvaluation.acceptedCount,
          acceptanceRate: recEvaluation.acceptanceRate,
          averageOutcomeScore: recEvaluation.averageOutcomeScore,
          effectivenessRating: recEvaluation.effectivenessRating,
          summary: recEvaluation.summary,
        },
        proposal,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Gagal mengagregasi data pusat intelijen akademik.",
    };
  }
}
