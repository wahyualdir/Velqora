import { createClient } from "@/lib/supabase/server";
import { ScheduleRecommendation } from "./types";
import { ScheduleItem } from "@/types";
import { checkIntervalOverlap } from "../schedule-import/conflict-engine";
import { logger } from "../observability";

export interface PersistenceResult {
  success: boolean;
  insertedCount: number;
  skippedCount: number;
  savedItems: ScheduleItem[];
  conflictErrors: string[];
  error?: string;
}

/**
 * Atomically commits approved recommendations to database after revalidating conflicts
 */
export async function persistApprovedRecommendations(
  recommendations: ScheduleRecommendation[],
  correlationId?: string
): Promise<PersistenceResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        insertedCount: 0,
        skippedCount: recommendations.length,
        savedItems: [],
        conflictErrors: [],
        error: "Sesi login tidak valid. Silakan masuk kembali.",
      };
    }

    if (recommendations.length === 0) {
      return {
        success: true,
        insertedCount: 0,
        skippedCount: 0,
        savedItems: [],
        conflictErrors: [],
      };
    }

    // 1. Fetch current schedules from DB to perform fresh live conflict revalidation
    const { data: currentSchedulesData } = await supabase
      .from("schedules")
      .select("*")
      .eq("user_id", user.id);

    const existingSchedules = (currentSchedulesData || []) as any[];
    const safePayloads: any[] = [];
    const conflictErrors: string[] = [];

    for (const rec of recommendations) {
      let isConflicting = false;

      for (const ex of existingSchedules) {
        if (ex.day === rec.day) {
          const exStart = ex.start_time || (ex.time ? ex.time.split("-")[0]?.trim() : "");
          const exEnd = ex.end_time || (ex.time ? ex.time.split("-")[1]?.trim() : "");

          if (exStart && exEnd) {
            if (checkIntervalOverlap(rec.startTime, rec.endTime, exStart, exEnd)) {
              isConflicting = true;
              conflictErrors.push(
                `Sesi '${rec.activity}' (${rec.day} ${rec.startTime}–${rec.endTime}) bentrok dengan '${ex.title}' (${ex.time || `${exStart}–${exEnd}`}).`
              );
              break;
            }
          }
        }
      }

      if (!isConflicting) {
        safePayloads.push({
          user_id: user.id,
          title: rec.activity,
          subject: rec.subject || "Akademik",
          day: rec.day,
          start_time: rec.startTime,
          end_time: rec.endTime,
          time: `${rec.startTime} - ${rec.endTime}`,
          location: "Ruang Belajar Mandiri",
          lecturer: "Rencana Cerdas",
          type: "tugas",
          priority: rec.priority || "sedang",
          is_completed: false,
          source: "auto_generated",
        });
      }
    }

    if (safePayloads.length === 0) {
      return {
        success: false,
        insertedCount: 0,
        skippedCount: recommendations.length,
        savedItems: [],
        conflictErrors,
        error: "Semua rekomendasi dibatalkan karena bentrok dengan jadwal yang baru saja diperbarui.",
      };
    }

    // 2. Perform atomic batch insert
    const { data: insertedData, error: insertError } = await supabase
      .from("schedules")
      .insert(safePayloads)
      .select();

    if (insertError) {
      logger.error("SCHEDULE_INTELLIGENCE", "persistApprovedRecommendations error:", insertError, undefined, correlationId);
      return {
        success: false,
        insertedCount: 0,
        skippedCount: recommendations.length,
        savedItems: [],
        conflictErrors,
        error: insertError.message || "Gagal menyimpan jadwal ke database.",
      };
    }

    const savedItems: ScheduleItem[] = (insertedData || []).map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      subject: row.subject || "",
      day: row.day,
      start_time: row.start_time,
      end_time: row.end_time,
      time: row.time,
      location: row.location,
      lecturer: row.lecturer,
      type: row.type || "tugas",
      priority: row.priority || "sedang",
      isCompleted: !!row.is_completed,
      is_completed: !!row.is_completed,
      source: row.source || "auto_generated",
      created_at: row.created_at,
    }));

    return {
      success: true,
      insertedCount: savedItems.length,
      skippedCount: recommendations.length - savedItems.length,
      savedItems,
      conflictErrors,
    };
  } catch (err: any) {
    logger.error("SCHEDULE_INTELLIGENCE", "persistApprovedRecommendations exception:", err, undefined, correlationId);
    return {
      success: false,
      insertedCount: 0,
      skippedCount: recommendations.length,
      savedItems: [],
      conflictErrors: [],
      error: err.message || "Terjadi kesalahan internal saat menyimpan jadwal.",
    };
  }
}
