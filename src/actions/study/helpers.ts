"use server";

import { createClient } from "@/lib/supabase/server";

export function sanitizePgText(str?: string | null): string {
  if (!str) return "";
  return str
    .replace(/\u0000/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
    .trim();
}

export async function recalculateModuleProgress(moduleId: string) {
  const supabase = await createClient();
  const { data: chapters } = await supabase
    .from("module_chapters")
    .select("is_completed")
    .eq("module_id", moduleId);

  if (!chapters || chapters.length === 0) {
    await supabase.from("modules").update({ progress: 0 }).eq("id", moduleId);
    return;
  }

  const completedCount = chapters.filter((c: any) => c.is_completed).length;
  const progressPercent = Math.round((completedCount / chapters.length) * 100);

  await supabase
    .from("modules")
    .update({ progress: progressPercent })
    .eq("id", moduleId);
}
