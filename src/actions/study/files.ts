"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getFiles() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase.from("files").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  return data || [];
}

export async function deleteFile(id: string, storagePath: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify file in DB belongs to user
  const { data: fileRecord } = await supabase
    .from("files")
    .select("id, path")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!fileRecord) {
    throw new Error("Berkas tidak ditemukan atau Anda tidak memiliki hak akses.");
  }

  // Hapus dari Storage hanya path milik user
  const pathToDelete = fileRecord.path || (storagePath.startsWith(`${user.id}/`) ? storagePath : `${user.id}/${storagePath}`);
  await supabase.storage.from("studyvault-files").remove([pathToDelete]);

  // Hapus dari DB
  const { error } = await supabase.from("files").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/file");
}

export async function uploadDirectFileAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Silakan masuk (login) terlebih dahulu");

  const file = formData.get("file") as File | null;
  if (!file) throw new Error("Tidak ada file yang dipilih");

  const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storagePath = `${user.id}/${timestamp}-${sanitizedName}`;

  const { error: uploadError } = await supabase.storage
    .from("studyvault-files")
    .upload(storagePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) throw new Error("Gagal mengunggah file: " + uploadError.message);

  const { data: urlData } = supabase.storage
    .from("studyvault-files")
    .getPublicUrl(storagePath);

  const { data: insertedFile, error: dbError } = await supabase
    .from("files")
    .insert({
      user_id: user.id,
      name: file.name,
      storage_path: storagePath,
      size: file.size,
      mime_type: file.type || ext,
      url: urlData?.publicUrl || "",
    })
    .select()
    .single();

  if (dbError) throw new Error("Gagal menyimpan metadata file: " + dbError.message);

  revalidatePath("/dashboard/file");
  return insertedFile;
}

// ==========================================
// EXPORT & IMPORT BACKUP
// ==========================================
