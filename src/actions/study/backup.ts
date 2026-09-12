"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function exportUserData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const [materi, tugas, modul, kategori, tags, notes] = await Promise.all([
    supabase.from("materials").select("*").eq("user_id", user.id),
    supabase.from("tasks").select("*").eq("user_id", user.id),
    supabase.from("modules").select("*, chapters:module_chapters(*)").eq("user_id", user.id),
    supabase.from("categories").select("*").eq("user_id", user.id),
    supabase.from("tags").select("*").eq("user_id", user.id),
    supabase
      .from("notes")
      .select("*")
      .or(`created_by.eq.${user.id},created_by.is.null`)
      .order("order_index", { ascending: true }),
  ]);

  const notesData = notes.data || [];
  const noteIds = notesData.map((n) => n.id);

  let noteLinksData: any[] = [];
  let noteTagsData: any[] = [];

  if (noteIds.length > 0) {
    const [linksRes, tagsRes] = await Promise.all([
      supabase.from("note_links").select("*").in("source_note_id", noteIds),
      supabase.from("note_tags").select("*").in("note_id", noteIds),
    ]);
    noteLinksData = linksRes.data || [];
    noteTagsData = tagsRes.data || [];
  }

  return {
    version: "1.1",
    exported_at: new Date().toISOString(),
    user_id: user.id,
    categories: kategori.data || [],
    tags: tags.data || [],
    materials: materi.data || [],
    tasks: tugas.data || [],
    modules: modul.data || [],
    notes: notesData,
    noteLinks: noteLinksData,
    noteTags: noteTagsData,
  };
}

export async function importUserData(payload: {
  categories?: any[];
  tags?: any[];
  materials?: any[];
  tasks?: any[];
  modules?: any[];
  notes?: any[];
  noteLinks?: any[];
  noteTags?: any[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  let importedCategories = 0;
  let importedTags = 0;
  let importedMaterials = 0;
  let importedTasks = 0;
  let importedModules = 0;
  let importedNotes = 0;
  let importedNoteLinks = 0;
  let importedNoteTags = 0;

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

  // 6. Import Notes (Vault)
  if (payload.notes && Array.isArray(payload.notes)) {
    for (const n of payload.notes) {
      if (!n.slug || !n.title) continue;
      try {
        const { data: insertedNote, error: noteErr } = await supabase
          .from("notes")
          .upsert(
            {
              id: n.id,
              slug: n.slug,
              title: n.title,
              content_markdown: n.content_markdown || "",
              category_id: n.category_id || null,
              parent_note_id: n.parent_note_id || null,
              icon: n.icon || null,
              order_index: n.order_index ?? 0,
              is_folder: Boolean(n.is_folder),
              created_by: n.created_by || user.id,
            },
            { onConflict: "slug" }
          )
          .select("id")
          .single();

        if (!noteErr && insertedNote) {
          importedNotes++;
        } else if (noteErr) {
          // Fallback if category_id or parent_note_id causes FK constraint error
          const { data: retryNote, error: retryErr } = await supabase
            .from("notes")
            .upsert(
              {
                id: n.id,
                slug: n.slug,
                title: n.title,
                content_markdown: n.content_markdown || "",
                category_id: null,
                parent_note_id: null,
                icon: n.icon || null,
                order_index: n.order_index ?? 0,
                is_folder: Boolean(n.is_folder),
                created_by: n.created_by || user.id,
              },
              { onConflict: "slug" }
            )
            .select("id")
            .single();

          if (!retryErr && retryNote) {
            importedNotes++;
          }
        }
      } catch {
        // Ignore single item error and continue
      }
    }
  }

  // 7. Import Note Links
  if (payload.noteLinks && Array.isArray(payload.noteLinks)) {
    for (const link of payload.noteLinks) {
      if (!link.source_note_id || !link.target_title_raw) continue;
      try {
        const { error } = await supabase.from("note_links").upsert(
          {
            id: link.id,
            source_note_id: link.source_note_id,
            target_note_id: link.target_note_id || null,
            target_title_raw: link.target_title_raw,
          },
          { onConflict: "source_note_id, target_title_raw", ignoreDuplicates: true }
        );
        if (!error) importedNoteLinks++;
      } catch {
        // Ignore single item error and continue
      }
    }
  }

  // 8. Import Note Tags
  if (payload.noteTags && Array.isArray(payload.noteTags)) {
    for (const t of payload.noteTags) {
      if (!t.note_id || !t.tag) continue;
      try {
        const { error } = await supabase.from("note_tags").upsert(
          {
            note_id: t.note_id,
            tag: t.tag,
          },
          { onConflict: "note_id, tag", ignoreDuplicates: true }
        );
        if (!error) importedNoteTags++;
      } catch {
        // Ignore single item error and continue
      }
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/modul");
  revalidatePath("/dashboard/materi");
  revalidatePath("/dashboard/tugas");
  revalidatePath("/dashboard/catatan");
  revalidatePath("/dashboard/catatan/graph");

  return {
    importedCategories,
    importedTags,
    importedTasks,
    importedModules,
    importedMaterials,
    importedNotes,
    importedNoteLinks,
    importedNoteTags,
  };
}
