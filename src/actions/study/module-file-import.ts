"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { assertAdminAccess } from "@/actions/study/notes-bulk-import";
import { convertFileBufferToMarkdown } from "@/lib/import/file-to-markdown";
import { createModule, addModuleChapters } from "@/actions/study/modules";
import { createNote } from "@/actions/study/notes";
import { createCategory, getCategories } from "@/actions/study/categories";
import type { ModuleLevel } from "@/types";
import {
  parseMarkdownToModuleStructure,
  type ParsedModuleStructure,
} from "@/lib/import/module-parser";

export type { ParsedModuleStructure };

export interface ImportModuleFileInput {
  filename: string;
  base64: string;
  title?: string;
  description?: string;
  categoryId?: string | null;
  newCategoryName?: string;
  newCategoryColor?: string;
  level?: ModuleLevel;
  chapters?: string[];
  createLinkedNote?: boolean;
}

export interface ImportModuleFileResult {
  moduleId: string;
  moduleTitle: string;
  chapterCount: number;
  categoryName: string;
  noteId?: string | null;
}


/**
 * Server Action: Mengekstrak berkas (.pdf, .docx, .pptx, .ipynb, .md) menjadi pratinjau struktur Modul.
 * Dibatasi ketat hanya untuk Owner / Admin.
 */
export async function previewModuleFromFileAction(input: {
  filename: string;
  base64: string;
}): Promise<ParsedModuleStructure> {
  await assertAdminAccess();

  if (!input || !input.filename || typeof input.base64 !== "string") {
    throw new Error("Parameter berkas atau data base64 tidak valid.");
  }

  const cleanFilename = input.filename.replace(/[/\\?%*:|"<>]/g, "").trim() || "document";
  const buffer = Buffer.from(input.base64, "base64");

  // 1. Konversi berkas ke Markdown
  const conversion = await convertFileBufferToMarkdown(cleanFilename, buffer);

  // 2. Ambil daftar kategori yang ada untuk klasifikasi otomatis
  const categories = await getCategories();

  // 3. Parsing struktur modul & bab
  const parsed = parseMarkdownToModuleStructure(
    conversion.markdownBody,
    conversion.suggestedTitle || cleanFilename,
    categories
  );

  return {
    ...parsed,
    warning: conversion.warning,
  };
}

/**
 * Server Action: Mengonversi berkas dan langsung menyimpannya ke database
 * menjadi Modul (tabel `modules`), Bab-Bab Materi (tabel `module_chapters`),
 * dan Catatan Kategori (tabel `notes`).
 *
 * Khusus diperuntukkan bagi Owner / Admin.
 */
export async function importModuleFromFileAction(
  input: ImportModuleFileInput
): Promise<ImportModuleFileResult> {
  await assertAdminAccess();

  if (!input || !input.filename || typeof input.base64 !== "string") {
    throw new Error("Berkas modul tidak valid.");
  }

  const cleanFilename = input.filename.replace(/[/\\?%*:|"<>]/g, "").trim() || "document";
  const buffer = Buffer.from(input.base64, "base64");

  // 1. Ekstraksi Markdown dari buffer berkas
  const conversion = await convertFileBufferToMarkdown(cleanFilename, buffer);
  const categories = await getCategories();

  // 2. Parse struktur modul
  const parsed = parseMarkdownToModuleStructure(
    conversion.markdownBody,
    conversion.suggestedTitle || cleanFilename,
    categories
  );

  const finalTitle = (input.title || parsed.suggestedTitle).trim();
  const finalDescription = (input.description || parsed.suggestedDescription).trim();
  const finalLevel: ModuleLevel = input.level || parsed.suggestedLevel || "pemula";
  const finalChapters = input.chapters && input.chapters.length > 0
    ? input.chapters
    : parsed.detectedChapters;

  // 3. Resolusi Kategori / Topik (Buat Topik Baru jika diisi oleh Owner)
  let targetCategoryId: string | null = input.categoryId || parsed.suggestedCategoryId || null;
  let targetCategoryName: string = parsed.suggestedCategoryName || "Tanpa Kategori";

  if (input.newCategoryName && input.newCategoryName.trim()) {
    const trimmedCatName = input.newCategoryName.trim();
    // Cek apakah kategori sudah ada
    const existing = categories.find(
      (c: any) => c.name.toLowerCase() === trimmedCatName.toLowerCase()
    );

    if (existing) {
      targetCategoryId = existing.id;
      targetCategoryName = existing.name;
    } else {
      // Buat topik baru
      const newCat = await createCategory({
        name: trimmedCatName,
        color: input.newCategoryColor || "#3b82f6",
        icon: "code",
      });
      if (newCat) {
        targetCategoryId = newCat.id;
        targetCategoryName = newCat.name;
      }
    }
  } else if (targetCategoryId) {
    const matched = categories.find((c: any) => c.id === targetCategoryId);
    if (matched) targetCategoryName = matched.name;
  }

  // 4. Simpan Modul ke tabel `modules`
  const createdModule = await createModule({
    title: finalTitle,
    description: finalDescription,
    category_id: targetCategoryId || undefined,
    level: finalLevel,
    kind: "module",
    tech_stack: [targetCategoryName, "Modul Akademik"],
  });

  if (!createdModule || !createdModule.id) {
    throw new Error("Gagal membuat record modul pada database.");
  }

  // Update notes/materi lengkap ke field `notes` modul
  const supabase = await createClient();
  const formattedModuleNotes = `## Materi Lengkap Modul: ${finalTitle}\n\n*Diimpor secara otomatis oleh Owner dari berkas: \`${cleanFilename}\`*\n\n---\n\n${conversion.markdownBody}`;

  await supabase
    .from("modules")
    .update({ notes: formattedModuleNotes })
    .eq("id", createdModule.id);

  // 5. Tambahkan Bab-Bab Materi ke tabel `module_chapters`
  if (finalChapters.length > 0) {
    await addModuleChapters(createdModule.id, finalChapters);
  }

  // 6. Buat Catatan Terkait di tabel `notes` (jika tidak dinonaktifkan)
  let createdNoteId: string | null = null;
  if (input.createLinkedNote !== false) {
    try {
      const createdNote = await createNote({
        title: finalTitle,
        content_markdown: `# ${finalTitle}\n\n${formattedModuleNotes}`,
        categoryId: targetCategoryId,
        icon: "BookOpen",
      });
      createdNoteId = createdNote?.id || null;
    } catch (noteErr) {
      console.warn("Gagal membuat salinan di notes (diabaikan):", noteErr);
    }
  }

  // 7. Revalidasi halaman
  revalidatePath("/dashboard/modul");
  revalidatePath("/dashboard/kategori");
  revalidatePath("/dashboard/catatan");

  return {
    moduleId: createdModule.id,
    moduleTitle: finalTitle,
    chapterCount: finalChapters.length,
    categoryName: targetCategoryName,
    noteId: createdNoteId,
  };
}
