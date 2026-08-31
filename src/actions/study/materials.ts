"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { MaterialFormData } from "@/lib/validations";

export async function getMaterials(search?: string, categoryId?: string, type?: string, status?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("materials")
    .select("*, category:categories(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (categoryId) query = query.eq("category_id", categoryId);
  if (type) query = query.eq("type", type);
  if (status) query = query.eq("status", status);
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,subject.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching materials:", error);
    return [];
  }
  return data || [];
}

export async function getMaterialById(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("materials")
    .select("*, category:categories(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;

  // Catat recent view secara opsional
  await supabase.from("recent_views").upsert(
    { user_id: user.id, material_id: id, viewed_at: new Date().toISOString() },
    { onConflict: "user_id,material_id" }
  );

  return data;
}

export async function createMaterial(data: MaterialFormData, fileInfo?: { url: string; name: string; size: number; mime: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const payload: any = {
    user_id: user.id,
    title: data.title,
    description: data.description || "",
    category_id: data.category_id || null,
    subject: data.subject || "",
    type: data.type,
    status: data.status,
    external_url: data.external_url || null,
    notes: data.notes || "",
  };

  if (fileInfo) {
    payload.file_url = fileInfo.url;
    payload.file_name = fileInfo.name;
    payload.file_size = fileInfo.size;
    payload.file_type = fileInfo.mime;
  }

  const { data: created, error } = await supabase.from("materials").insert(payload).select().single();
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/materi");
  return created;
}

export async function updateMaterial(id: string, data: MaterialFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("materials")
    .update({
      title: data.title,
      description: data.description || "",
      category_id: data.category_id || null,
      subject: data.subject || "",
      type: data.type,
      status: data.status,
      external_url: data.external_url || null,
      notes: data.notes || "",
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/materi");
  revalidatePath(`/dashboard/materi/${id}`);
}

export async function deleteMaterial(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("materials").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/materi");
}

// ==========================================
// TASK ACTIONS
// ==========================================
