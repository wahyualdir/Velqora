"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ScheduleItem } from "@/types";
import { logger } from "@/lib/observability";

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
