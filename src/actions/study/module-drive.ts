"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { extractModuleDriveFromNotes, injectModuleDriveIntoNotes } from "@/types/module-drive";
import { isOwnerUser } from "@/lib/utils";
import { sanitizePgText } from "./helpers";

export async function getModuleDrive(moduleId: string): Promise<{
  folders: import("@/types/module-drive").ModuleDriveFolder[];
  files: import("@/types/module-drive").ModuleDriveFile[];
}> {
  const supabase = await createClient();
  const { data: mod } = await supabase
    .from("modules")
    .select("id, notes")
    .eq("id", moduleId)
    .single();

  if (!mod) return { folders: [], files: [] };
  return extractModuleDriveFromNotes(mod.notes);
}

export async function saveModuleDrive(
  moduleId: string,
  folders: import("@/types/module-drive").ModuleDriveFolder[],
  files: import("@/types/module-drive").ModuleDriveFile[]
): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Silakan masuk (login) terlebih dahulu");

  const { data: mod } = await supabase
    .from("modules")
    .select("notes, user_id")
    .eq("id", moduleId)
    .single();

  if (!mod) throw new Error("Modul tidak ditemukan");

  const isOwner = isOwnerUser(user.email);
  const isCreator = mod.user_id === user.id;

  if (!isCreator && !isOwner) {
    throw new Error("Hanya pembuat modul dan Owner yang memiliki izin untuk mengubah atau mengunggah berkas di folder modul ini.");
  }

  const updatedNotes = injectModuleDriveIntoNotes(mod.notes, folders, files);

  const { error } = await supabase
    .from("modules")
    .update({
      notes: updatedNotes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", moduleId);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/modul");
  return true;
}

export async function createModuleDriveFolder(
  moduleId: string,
  name: string,
  parentId: string | null = null,
  color?: string
) {
  const drive = await getModuleDrive(moduleId);
  const cleanName = sanitizePgText(name);
  if (!cleanName) throw new Error("Nama folder tidak boleh kosong");

  const newFolder: import("@/types/module-drive").ModuleDriveFolder = {
    id: `folder_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    parentId: parentId || null,
    color: color || "#3b82f6",
    createdAt: new Date().toISOString(),
  };

  drive.folders.push(newFolder);
  await saveModuleDrive(moduleId, drive.folders, drive.files);
  return newFolder;
}

export async function deleteModuleDriveFolder(moduleId: string, folderId: string) {
  const drive = await getModuleDrive(moduleId);

  // Recursively find all child folder IDs to delete
  const folderIdsToDelete = new Set<string>([folderId]);
  let added = true;
  while (added) {
    added = false;
    for (const f of drive.folders) {
      if (f.parentId && folderIdsToDelete.has(f.parentId) && !folderIdsToDelete.has(f.id)) {
        folderIdsToDelete.add(f.id);
        added = true;
      }
    }
  }

  // Filter out deleted folders
  const remainingFolders = drive.folders.filter((f) => !folderIdsToDelete.has(f.id));

  // Files in deleted folders are moved to parent of the deleted folder or root
  const targetFolder = drive.folders.find((f) => f.id === folderId);
  const fallbackParentId = targetFolder?.parentId || null;

  const updatedFiles = drive.files.map((file) => {
    if (file.folderId && folderIdsToDelete.has(file.folderId)) {
      return { ...file, folderId: fallbackParentId };
    }
    return file;
  });

  await saveModuleDrive(moduleId, remainingFolders, updatedFiles);
  return true;
}

export async function deleteModuleDriveFile(
  moduleId: string,
  fileId: string,
  storagePath?: string
) {
  const supabase = await createClient();
  const drive = await getModuleDrive(moduleId);

  // 1. If storage path is given, remove from Supabase Storage
  if (storagePath) {
    try {
      await supabase.storage.from("studyvault-files").remove([storagePath]);
    } catch (err) {
      console.warn("Storage removal warning:", err);
    }
  }

  // 2. Remove from drive files list
  const remainingFiles = drive.files.filter((f) => f.id !== fileId);
  await saveModuleDrive(moduleId, drive.folders, remainingFiles);
  return true;
}

export async function renameModuleDriveItem(
  moduleId: string,
  itemId: string,
  newName: string,
  isFolder: boolean
) {
  const drive = await getModuleDrive(moduleId);
  const cleanName = sanitizePgText(newName);
  if (!cleanName) throw new Error("Nama tidak boleh kosong");

  if (isFolder) {
    drive.folders = drive.folders.map((f) => (f.id === itemId ? { ...f, name: cleanName, updatedAt: new Date().toISOString() } : f));
  } else {
    drive.files = drive.files.map((f) => (f.id === itemId ? { ...f, name: cleanName } : f));
  }

  await saveModuleDrive(moduleId, drive.folders, drive.files);
  return true;
}

export async function moveModuleDriveFile(
  moduleId: string,
  fileId: string,
  targetFolderId: string | null
) {
  const drive = await getModuleDrive(moduleId);
  drive.files = drive.files.map((f) => (f.id === fileId ? { ...f, folderId: targetFolderId } : f));
  await saveModuleDrive(moduleId, drive.folders, drive.files);
  return true;
}

// ==========================================
// MODULE REACTIONS & COMMENTS (DISKUSI & LIKE/DISLIKE)
// ==========================================
