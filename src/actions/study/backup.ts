"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function exportUserData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const [materi, tugas, modul, kategori, tags] = await Promise.all([
    supabase.from("materials").select("*").eq("user_id", user.id),
    supabase.from("tasks").select("*").eq("user_id", user.id),
    supabase.from("modules").select("*, chapters:module_chapters(*)").eq("user_id", user.id),
    supabase.from("categories").select("*").eq("user_id", user.id),
    supabase.from("tags").select("*").eq("user_id", user.id),
  ]);

  return {
    version: "1.0",
    exported_at: new Date().toISOString(),
    user_id: user.id,
    categories: kategori.data || [],
    tags: tags.data || [],
    materials: materi.data || [],
    tasks: tugas.data || [],
    modules: modul.data || [],
  };
}

export async function importUserData(payload: {
  categories?: any[];
  tags?: any[];
  materials?: any[];
  tasks?: any[];
  modules?: any[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  let importedCategories = 0;
  let importedTags = 0;
  let importedMaterials = 0;
  let importedTasks = 0;
  let importedModules = 0;

  // 1. Import Categories
  if (payload.categories && Array.isArray(payload.categories)) {
    for (const c of payload.categories) {
      if (!c.name) continue;
      const { error } = await supabase.from("categories").upsert({
        id: c.id,
        name: c.name,
        color: c.color || "#3b82f6",
        icon: c.icon || "code",
        parent_id: c.parent_id || null,
        user_id: user.id,
      });
      if (!error) importedCategories++;
    }
  }

  // 2. Import Tags
  if (payload.tags && Array.isArray(payload.tags)) {
    for (const t of payload.tags) {
      if (!t.name) continue;
      const { error } = await supabase.from("tags").upsert({
        id: t.id,
        name: t.name,
        user_id: user.id,
      });
      if (!error) importedTags++;
    }
  }

  // 3. Import Tasks
  if (payload.tasks && Array.isArray(payload.tasks)) {
    for (const task of payload.tasks) {
      if (!task.title) continue;
      const { error } = await supabase.from("tasks").upsert({
        id: task.id,
        user_id: user.id,
        title: task.title,
        subject: task.subject || null,
        lecturer: task.lecturer || null,
        description: task.description || null,
        deadline: task.deadline || new Date().toISOString(),
        priority: task.priority || "sedang",
        status: task.status || "belum_mulai",
        notes: task.notes || null,
      });
      if (!error) importedTasks++;
    }
  }

  // 4. Import Modules & Chapters
  if (payload.modules && Array.isArray(payload.modules)) {
    for (const mod of payload.modules) {
      if (!mod.title) continue;
      const { data: insertedMod, error: modErr } = await supabase.from("modules").upsert({
        id: mod.id,
        user_id: user.id,
        title: mod.title,
        description: mod.description || null,
        category_id: mod.category_id || null,
        level: mod.level || "pemula",
        progress: mod.progress || 0,
        notes: mod.notes || null,
      }).select("id").single();

      if (!modErr && insertedMod) {
        importedModules++;
        if (mod.chapters && Array.isArray(mod.chapters)) {
          for (const chap of mod.chapters) {
            if (!chap.title) continue;
            await supabase.from("module_chapters").upsert({
              id: chap.id,
              module_id: insertedMod.id,
              title: chap.title,
              is_completed: Boolean(chap.is_completed),
              order_index: chap.order_index || 0,
            });
          }
        }
      }
    }
  }

  // 5. Import Materials
  if (payload.materials && Array.isArray(payload.materials)) {
    for (const m of payload.materials) {
      if (!m.title) continue;
      const { error } = await supabase.from("materials").upsert({
        id: m.id,
        user_id: user.id,
        title: m.title,
        subject: m.subject || null,
        description: m.description || null,
        category_id: m.category_id || null,
        notes: m.notes || null,
      });
      if (!error) importedMaterials++;
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/modul");
  revalidatePath("/dashboard/materi");
  revalidatePath("/dashboard/tugas");

  return {
    importedCategories,
    importedTags,
    importedTasks,
    importedModules,
    importedMaterials,
  };
}
