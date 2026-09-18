"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { assertAdminAccess } from "@/actions/study/notes-bulk-import";
import { convertFileBufferToMarkdown } from "@/lib/import/file-to-markdown";
import { createModule, addModuleChapters } from "@/actions/study/modules";
import { createNote } from "@/actions/study/notes";
import { createCategory, getCategories } from "@/actions/study/categories";
import { classifyViaLocalNLP } from "@/lib/module-classifier-engine";
import { cleanMarkdownExcerpt } from "@/lib/utils";
import type { ModuleLevel } from "@/types";

export interface ParsedModuleStructure {
  suggestedTitle: string;
  suggestedDescription: string;
  detectedChapters: string[];
  suggestedCategoryId: string | null;
  suggestedCategoryName: string | null;
  suggestedLevel: ModuleLevel;
  markdownBody: string;
  warning?: string;
}

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
 * Parser lokal: memecah teks Markdown hasil konversi berkas menjadi struktur Modul dan Bab-Bab Materi
 */
export function parseMarkdownToModuleStructure(
  markdown: string,
  fallbackFilename: string,
  existingCategories: any[] = []
): ParsedModuleStructure {
  const cleanFallbackTitle = fallbackFilename
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim() || "Modul Pembelajaran";

  // 1. Ekstraksi Judul (# Heading 1)
  const h1Match = markdown.match(/^#\s+([^\r\n#]+)/m);
  const suggestedTitle = h1Match && h1Match[1]?.trim()
    ? h1Match[1].trim()
    : cleanFallbackTitle;

  // 2. Ekstraksi Daftar Bab (## Heading 2 atau ### Heading 3)
  const h2Matches = [...markdown.matchAll(/^##\s+([^\r\n#]+)/gm)];
  let detectedChapters: string[] = [];

  if (h2Matches.length > 0) {
    detectedChapters = h2Matches
      .map((m) => m[1]?.trim())
      .filter(Boolean);
  } else {
    // Cek ### Heading 3 jika tidak ada H2
    const h3Matches = [...markdown.matchAll(/^###\s+([^\r\n#]+)/gm)];
    if (h3Matches.length > 0) {
      detectedChapters = h3Matches
        .map((m) => m[1]?.trim())
        .filter(Boolean);
    }
  }

  // Bersihkan duplikasi dan batasi panjang nama bab
  detectedChapters = Array.from(new Set(detectedChapters))
    .map((c) => c.replace(/[*_`]/g, "").trim())
    .filter((c) => c.length > 0 && c.length <= 120);

  // Jika dokumen tidak memiliki sub-heading terstruktur, buat bab default agar tetap menjadi modul berstruktur
  if (detectedChapters.length === 0) {
    detectedChapters = [
      "Pendahuluan & Konsep Utama",
      "Pembahasan Materi Inti",
      "Rangkuman & Praktikum",
    ];
  }

  // 3. Ekstraksi Deskripsi / Ringkasan Awal
  let bodyWithoutTitle = markdown;
  if (h1Match && h1Match.index !== undefined) {
    bodyWithoutTitle = markdown.slice(h1Match.index + h1Match[0].length);
  }

  // Cari paragraf pertama yang bukan heading
  const paragraphs = bodyWithoutTitle
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !p.startsWith("#") && !p.startsWith("---"));

  const rawFirstParagraph = paragraphs[0] || "";
  const suggestedDescription =
    cleanMarkdownExcerpt(rawFirstParagraph, suggestedTitle, 240) ||
    `Materi pembelajaran modul ${suggestedTitle}, mencakup ${detectedChapters.length} bab pembahasan mendalam.`;

  // 4. Klasifikasi Kategori via Local NLP
  let suggestedCategoryId: string | null = null;
  let suggestedCategoryName: string | null = null;
  let suggestedLevel: ModuleLevel = "pemula";

  if (existingCategories.length > 0) {
    const classification = classifyViaLocalNLP(
      `${suggestedTitle}\n${suggestedDescription}\n${detectedChapters.join("\n")}`,
      suggestedTitle,
      existingCategories
    );
    suggestedCategoryId = classification.categoryId;
    suggestedCategoryName = classification.categoryName;
    suggestedLevel = classification.suggestedLevel;
  }

  return {
    suggestedTitle,
    suggestedDescription,
    detectedChapters,
    suggestedCategoryId,
    suggestedCategoryName,
    suggestedLevel,
    markdownBody: markdown,
  };
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
