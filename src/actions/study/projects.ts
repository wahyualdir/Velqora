"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isOwnerUser } from "@/lib/utils";
import { Project } from "@/types";

export interface ProjectFormData {
  title: string;
  description?: string;
  category_id?: string;
  level?: "pemula" | "menengah" | "lanjutan";
  repository_url?: string;
  demo_url?: string;
  tech_stack?: string[];
  author_name?: string;
  cover_url?: string;
  notes?: string;
}

/**
 * 1. GET ALL PROJECTS (Independen dari Modules)
 */
export async function getProjects(
  search?: string,
  categoryId?: string,
  level?: string,
  tech?: string,
  scope: "all" | "mine" = "all"
): Promise<Project[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Primary Query: Coba query tabel projects mandiri
  try {
    let query = supabase
      .from("projects")
      .select("*, category:categories!category_id(*)")
      .order("created_at", { ascending: false });

    if (scope === "mine" && user) {
      query = query.eq("user_id", user.id);
    }

    if (categoryId) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId);
      if (isUuid) {
        const { data: subcats } = await supabase
          .from("categories")
          .select("id")
          .eq("parent_id", categoryId);

        if (subcats && subcats.length > 0) {
          const allCatIds = [categoryId, ...subcats.map((s) => s.id)];
          query = query.in("category_id", allCatIds);
        } else {
          query = query.eq("category_id", categoryId);
        }
      } else {
        const cleanName = decodeURIComponent(categoryId).trim().replace(/-/g, " ");
        const { data: matchedCats } = await supabase
          .from("categories")
          .select("id")
          .or(`name.ilike.%${cleanName}%,name.ilike.%${categoryId}%`);

        if (matchedCats && matchedCats.length > 0) {
          query = query.in("category_id", matchedCats.map((c) => c.id));
        }
      }
    }

    if (level) {
      query = query.eq("level", level);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,notes.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (!error && data) {
      let filtered = data as Project[];
      if (tech) {
        const targetTech = tech.toLowerCase().trim();
        filtered = filtered.filter((p) =>
          (p.tech_stack || []).some((t) => t.toLowerCase().includes(targetTech))
        );
      }
      return filtered;
    }
  } catch (err) {
    console.warn("Primary projects table query error, attempting fallback:", err);
  }

  // Graceful Fallback: Jika tabel projects belum dimigrasi di Supabase, baca dari modules WHERE content_type = 'project'
  try {
    let fallbackQuery = supabase
      .from("modules")
      .select("*, category:categories!category_id(*)")
      .eq("content_type", "project")
      .order("created_at", { ascending: false });

    if (scope === "mine" && user) {
      fallbackQuery = fallbackQuery.eq("user_id", user.id);
    }
    if (categoryId) {
      fallbackQuery = fallbackQuery.eq("category_id", categoryId);
    }
    if (level) {
      fallbackQuery = fallbackQuery.eq("level", level);
    }
    if (search) {
      fallbackQuery = fallbackQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: fbData } = await fallbackQuery;
    if (fbData) {
      let mapped = fbData.map((m: any) => ({
        id: m.id,
        user_id: m.user_id,
        title: m.title,
        description: m.description,
        category_id: m.category_id,
        level: m.level || "pemula",
        repository_url: m.repository_url,
        demo_url: m.demo_url,
        tech_stack: m.tech_stack || [],
        author_name: m.author_name,
        cover_url: m.cover_url,
        notes: m.notes,
        created_at: m.created_at,
        updated_at: m.updated_at,
        category: m.category,
      })) as Project[];

      if (tech) {
        const targetTech = tech.toLowerCase().trim();
        mapped = mapped.filter((p) =>
          (p.tech_stack || []).some((t) => t.toLowerCase().includes(targetTech))
        );
      }
      return mapped;
    }
  } catch (fbErr) {
    console.error("Fallback projects query error:", fbErr);
  }

  return [];
}

/**
 * 2. GET PROJECT BY ID
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*, category:categories!category_id(*)")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return data as Project;
    }
  } catch (err) {
    console.warn("Error fetching from projects table:", err);
  }

  // Fallback ke modules
  try {
    const { data: fbData } = await supabase
      .from("modules")
      .select("*, category:categories!category_id(*)")
      .eq("id", id)
      .maybeSingle();

    if (fbData) {
      return {
        id: fbData.id,
        user_id: fbData.user_id,
        title: fbData.title,
        description: fbData.description,
        category_id: fbData.category_id,
        level: fbData.level || "pemula",
        repository_url: fbData.repository_url,
        demo_url: fbData.demo_url,
        tech_stack: fbData.tech_stack || [],
        author_name: fbData.author_name,
        cover_url: fbData.cover_url,
        notes: fbData.notes,
        created_at: fbData.created_at,
        updated_at: fbData.updated_at,
        category: fbData.category,
      } as Project;
    }
  } catch {}

  return null;
}

/**
 * 3. CREATE PROJECT
 */
export async function createProject(data: ProjectFormData): Promise<{ success: boolean; data?: any; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Harus masuk untuk menambahkan proyek." };
  }

  const payload = {
    user_id: user.id,
    title: data.title.trim(),
    description: data.description?.trim() || "",
    category_id: data.category_id || null,
    level: data.level || "pemula",
    repository_url: data.repository_url?.trim() || null,
    demo_url: data.demo_url?.trim() || null,
    tech_stack: data.tech_stack || [],
    author_name: data.author_name?.trim() || user.user_metadata?.full_name || user.email?.split("@")[0] || "Pengembang",
    cover_url: data.cover_url || null,
    notes: data.notes || "",
  };

  try {
    const { data: inserted, error } = await supabase
      .from("projects")
      .insert(payload)
      .select()
      .single();

    if (!error && inserted) {
      revalidatePath("/dashboard/project");
      return { success: true, data: inserted };
    }

    // Jika error tabel tidak ada, coba fallback ke modules
    if (error && error.code === "42P01") {
      const { data: fbInserted, error: fbError } = await supabase
        .from("modules")
        .insert({
          ...payload,
          content_type: "project",
        })
        .select()
        .single();

      if (fbError) {
        return { success: false, error: fbError.message };
      }
      revalidatePath("/dashboard/project");
      return { success: true, data: fbInserted };
    }

    return { success: false, error: error?.message || "Gagal menyimpan proyek." };
  } catch (err: any) {
    return { success: false, error: err.message || "Terjadi kesalahan sistem." };
  }
}

/**
 * 4. UPDATE PROJECT
 */
export async function updateProject(
  id: string,
  data: Partial<ProjectFormData>
): Promise<{ success: boolean; data?: any; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Harus masuk untuk memperbarui proyek." };
  }

  const payload: any = {
    updated_at: new Date().toISOString(),
  };

  if (data.title !== undefined) payload.title = data.title.trim();
  if (data.description !== undefined) payload.description = data.description.trim();
  if (data.category_id !== undefined) payload.category_id = data.category_id || null;
  if (data.level !== undefined) payload.level = data.level;
  if (data.repository_url !== undefined) payload.repository_url = data.repository_url.trim() || null;
  if (data.demo_url !== undefined) payload.demo_url = data.demo_url.trim() || null;
  if (data.tech_stack !== undefined) payload.tech_stack = data.tech_stack;
  if (data.author_name !== undefined) payload.author_name = data.author_name.trim();
  if (data.cover_url !== undefined) payload.cover_url = data.cover_url;
  if (data.notes !== undefined) payload.notes = data.notes;

  try {
    const { data: updated, error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (!error && updated) {
      revalidatePath("/dashboard/project");
      revalidatePath(`/dashboard/project/${id}`);
      return { success: true, data: updated };
    }

    // Fallback update to modules
    const { data: fbUpdated, error: fbError } = await supabase
      .from("modules")
      .update(payload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (fbError) {
      return { success: false, error: fbError.message };
    }

    revalidatePath("/dashboard/project");
    revalidatePath(`/dashboard/project/${id}`);
    return { success: true, data: fbUpdated };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memperbarui proyek." };
  }
}

/**
 * 5. DELETE PROJECT
 */
export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Harus masuk untuk menghapus proyek." };
  }

  try {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) {
      revalidatePath("/dashboard/project");
      return { success: true };
    }
  } catch {}

  // Fallback ke modules
  try {
    const { error: fbErr } = await supabase.from("modules").delete().eq("id", id);
    if (!fbErr) {
      revalidatePath("/dashboard/project");
      return { success: true };
    }
    return { success: false, error: fbErr.message };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
