"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { TagFormData } from "@/lib/validations";

export async function getTags() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase.from("tags").select("*").eq("user_id", user.id).order("name");
  return data || [];
}

export async function createTag(data: TagFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("tags").insert({
    user_id: user.id,
    name: data.name,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/tag");
}

export async function deleteTag(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("tags").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/tag");
}

// ==========================================
// FILES ACTION
// ==========================================
