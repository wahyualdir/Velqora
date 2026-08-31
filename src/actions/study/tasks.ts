"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { TaskFormData } from "@/lib/validations";

export async function getTasks(search?: string, status?: string, priority?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase.from("tasks").select("*").eq("user_id", user.id).order("deadline", { ascending: true, nullsFirst: false });

  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (search) {
    query = query.or(`title.ilike.%${search}%,subject.ilike.%${search}%,lecturer.ilike.%${search}%`);
  }

  const { data } = await query;
  return data || [];
}

export async function createTask(data: TaskFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: created, error } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      title: data.title,
      subject: data.subject || "",
      lecturer: data.lecturer || "",
      description: data.description || "",
      deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      priority: data.priority,
      status: data.status,
      external_url: data.external_url || null,
      notes: data.notes || "",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/tugas");
  return created;
}

export async function updateTask(id: string, data: TaskFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("tasks")
    .update({
      title: data.title,
      subject: data.subject || "",
      lecturer: data.lecturer || "",
      description: data.description || "",
      deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      priority: data.priority,
      status: data.status,
      external_url: data.external_url || null,
      notes: data.notes || "",
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/tugas");
}

export async function deleteTask(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/tugas");
}

// ==========================================
// MODULE & PROJECT ACTIONS (Community Feed & Shared Repositories)
// ==========================================
