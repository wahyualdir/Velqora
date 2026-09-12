"use server";

import { createClient } from "@/lib/supabase/server";
import { isAdminUser, slugify } from "@/lib/utils";
import { createNote, type NoteEntity } from "@/actions/study/notes";

export interface BulkImportInputFile {
  filename: string;
  content: string;
}

export interface BulkImportSkippedItem {
  filename: string;
  reason: string;
}

export interface BulkImportResult {
  imported: NoteEntity[];
  skipped: BulkImportSkippedItem[];
}

export interface BulkImportPreviewItem {
  filename: string;
  title: string;
  categoryInput: string;
  resolvedCategoryId: string | null;
  resolvedCategoryName: string | null;
  tags: string[];
  willSkip: boolean;
  skipReason?: string;
}

export interface BulkImportPreviewResult {
  items: BulkImportPreviewItem[];
  totalFiles: number;
  validCount: number;
  skipCount: number;
}

/**
 * Verifikasi otorisasi admin/owner sebelum operasi import massal
 */
export async function assertAdminAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Anda harus login untuk melakukan tindakan ini.");
  }

  if (isAdminUser(user.email)) {
    return { user, isAdmin: true };
  }

  try {
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("email", user.email?.toLowerCase())
      .maybeSingle();

    if (roleRow && (roleRow.role === "admin" || roleRow.role === "owner")) {
      return { user, isAdmin: true };
    }
  } catch {
    // Ignore error if user_roles does not exist
  }

  throw new Error("Akses ditolak: Hanya Admin/Owner yang dapat melakukan import catatan massal.");
}

interface ParsedMarkdown {
  title: string;
  category: string;
  tags: string[];
  body: string;
}

/**
 * Parser frontmatter YAML sederhana tanpa dependensi luar
 * Mendukung format:
 * ---
 * kategori: "Artificial Intelligence Fundamentals"
 * title: "Rational Agents & Lingkungan PEAS"
 * tags: [ai-fundamentals, agent, peas]
 * ---
 */
function parseFrontmatterAndBody(filename: string, content: string): ParsedMarkdown {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  let rawFrontmatter = "";
  let body = content;

  if (match) {
    rawFrontmatter = match[1];
    body = match[2].trim();
  }

  let title = "";
  let category = "";
  const tags: string[] = [];

  if (rawFrontmatter) {
    const lines = rawFrontmatter.split("\n");
    let parsingTagsList = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      // Check tags list: - tag1
      if (parsingTagsList) {
        if (line.startsWith("-")) {
          const t = line.replace(/^-+\s*/, "").replace(/['"]/g, "").trim();
          if (t) tags.push(t);
          continue;
        } else if (!line.includes(":")) {
          continue;
        } else {
          parsingTagsList = false;
        }
      }

      // Key-value pairs
      const colonIdx = line.indexOf(":");
      if (colonIdx === -1) continue;

      const key = line.slice(0, colonIdx).trim().toLowerCase();
      const val = line.slice(colonIdx + 1).trim();

      if (key === "title" || key === "judul") {
        title = val.replace(/^["']|["']$/g, "").trim();
      } else if (key === "kategori" || key === "category") {
        category = val.replace(/^["']|["']$/g, "").trim();
      } else if (key === "tags" || key === "tag") {
        if (val.startsWith("[") && val.endsWith("]")) {
          const bracketContent = val.slice(1, -1);
          const parsed = bracketContent
            .split(",")
            .map((s) => s.replace(/['"]/g, "").trim())
            .filter(Boolean);
          tags.push(...parsed);
        } else if (!val) {
          parsingTagsList = true;
        } else {
          const single = val.replace(/['"]/g, "").trim();
          if (single) tags.push(single);
        }
      }
    }
  }

  // Fallback title: cari heading # pertama di body markdown
  if (!title) {
    const headingMatch = body.match(/^#\s+(.+)$/m);
    if (headingMatch) {
      title = headingMatch[1].trim();
    } else {
      // Fallback nama file tanpa .md
      title = filename.replace(/\.md$/i, "").replace(/[-_]/g, " ").trim();
    }
  }

  return {
    title,
    category,
    tags: Array.from(new Set(tags)),
    body,
  };
}

/**
 * Menyiapkan body markdown yang menyertakan tag frontmatter
 * agar otomatis diproses oleh parseAndSyncTags() di createNote
 */
function prepareMarkdownContent(body: string, tags: string[]): string {
  if (!tags || tags.length === 0) return body;

  const missingTags = tags.filter((t) => {
    const clean = t.replace(/^#/, "").toLowerCase();
    const regex = new RegExp(`(?:^|\\s)#${clean}(?:\\s|$)`, "i");
    return !regex.test(body);
  });

  if (missingTags.length === 0) return body;

  const tagString = missingTags.map((t) => `#${t.replace(/^#/, "")}`).join(" ");
  return `${body}\n\n${tagString}`;
}

/**
 * PREVIEW BULK IMPORT:
 * Menganalisis file markdown sebelum dieksekusi,
 * mencocokkan kategori ke database, dan mengecek duplikasi note.
 */
export async function previewBulkImportNotes(
  files: BulkImportInputFile[]
): Promise<BulkImportPreviewResult> {
  await assertAdminAccess();
  const supabase = await createClient();

  // Fetch kategori aktif di DB
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name");

  const categoryList = categories || [];

  const items: BulkImportPreviewItem[] = [];

  for (const file of files) {
    const parsed = parseFrontmatterAndBody(file.filename, file.content);

    // Validasi 1: Judul
    if (!parsed.title) {
      items.push({
        filename: file.filename,
        title: file.filename,
        categoryInput: parsed.category,
        resolvedCategoryId: null,
        resolvedCategoryName: null,
        tags: parsed.tags,
        willSkip: true,
        skipReason: "Judul catatan tidak dapat ditentukan dari frontmatter atau konten.",
      });
      continue;
    }

    // Validasi 2: Kategori
    if (!parsed.category) {
      items.push({
        filename: file.filename,
        title: parsed.title,
        categoryInput: "",
        resolvedCategoryId: null,
        resolvedCategoryName: null,
        tags: parsed.tags,
        willSkip: true,
        skipReason: "Field 'kategori' wajib diisi di frontmatter YAML.",
      });
      continue;
    }

    const normCatInput = parsed.category.trim().toLowerCase();
    const matchedCategory = categoryList.find((c) => {
      const normCatName = c.name.trim().toLowerCase();
      return (
        normCatName === normCatInput ||
        normCatName.replace(/[-_]/g, " ") === normCatInput.replace(/[-_]/g, " ")
      );
    });

    if (!matchedCategory) {
      items.push({
        filename: file.filename,
        title: parsed.title,
        categoryInput: parsed.category,
        resolvedCategoryId: null,
        resolvedCategoryName: null,
        tags: parsed.tags,
        willSkip: true,
        skipReason: `Kategori '${parsed.category}' tidak ditemukan di database.`,
      });
      continue;
    }

    // Validasi 3: Cek duplikasi slug / title di tabel notes
    const targetSlug = slugify(parsed.title);
    const { data: existingNote } = await supabase
      .from("notes")
      .select("id, title, slug")
      .or(`slug.eq.${targetSlug},title.ilike.${parsed.title.trim()}`)
      .maybeSingle();

    if (existingNote) {
      items.push({
        filename: file.filename,
        title: parsed.title,
        categoryInput: parsed.category,
        resolvedCategoryId: matchedCategory.id,
        resolvedCategoryName: matchedCategory.name,
        tags: parsed.tags,
        willSkip: true,
        skipReason: `Catatan dengan judul/slug serupa sudah ada di database (slug: '${existingNote.slug}').`,
      });
      continue;
    }

    // Siap diimpor
    items.push({
      filename: file.filename,
      title: parsed.title,
      categoryInput: parsed.category,
      resolvedCategoryId: matchedCategory.id,
      resolvedCategoryName: matchedCategory.name,
      tags: parsed.tags,
      willSkip: false,
    });
  }

  const validCount = items.filter((i) => !i.willSkip).length;
  const skipCount = items.filter((i) => i.willSkip).length;

  return {
    items,
    totalFiles: files.length,
    validCount,
    skipCount,
  };
}

/**
 * EKSEKUSI BULK IMPORT CATATAN DARI MARKDOWN:
 * Mengimpor berkas markdown yang valid menjadi entri catatan di tabel notes
 * menggunakan createNote() existing tanpa overwrite diam-diam.
 */
export async function bulkImportNotesFromMarkdown(
  files: BulkImportInputFile[]
): Promise<BulkImportResult> {
  await assertAdminAccess();
  const supabase = await createClient();

  // Fetch kategori di DB untuk resolusi category_id
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name");

  const categoryList = categories || [];

  const imported: NoteEntity[] = [];
  const skipped: BulkImportSkippedItem[] = [];

  for (const file of files) {
    try {
      const parsed = parseFrontmatterAndBody(file.filename, file.content);

      if (!parsed.title) {
        skipped.push({
          filename: file.filename,
          reason: "Judul catatan tidak ditemukan di frontmatter YAML maupun judul heading markdown.",
        });
        continue;
      }

      if (!parsed.category) {
        skipped.push({
          filename: file.filename,
          reason: "Field 'kategori' wajib diisi di frontmatter YAML.",
        });
        continue;
      }

      // Cocokkan kategori case-insensitive
      const normCatInput = parsed.category.trim().toLowerCase();
      const matchedCategory = categoryList.find((c) => {
        const normCatName = c.name.trim().toLowerCase();
        return (
          normCatName === normCatInput ||
          normCatName.replace(/[-_]/g, " ") === normCatInput.replace(/[-_]/g, " ")
        );
      });

      if (!matchedCategory) {
        skipped.push({
          filename: file.filename,
          reason: `Kategori '${parsed.category}' tidak ditemukan di database.`,
        });
        continue;
      }

      // Cek apakah catatan sudah ada (JANGAN overwrite diam-diam)
      const targetSlug = slugify(parsed.title);
      const { data: existingNote } = await supabase
        .from("notes")
        .select("id, title, slug")
        .or(`slug.eq.${targetSlug},title.ilike.${parsed.title.trim()}`)
        .maybeSingle();

      if (existingNote) {
        skipped.push({
          filename: file.filename,
          reason: `Catatan dengan judul/slug serupa sudah ada di database (slug: '${existingNote.slug}').`,
        });
        continue;
      }

      // Siapkan markdown dengan tag yang otomatis disinkronkan
      const finalMarkdown = prepareMarkdownContent(parsed.body, parsed.tags);

      // Panggil createNote() existing yang sudah mengurus insert, slug unik,
      // parsing backlink wikilinks, tag, dan revalidatePath
      const createdNote = await createNote({
        title: parsed.title,
        content_markdown: finalMarkdown,
        categoryId: matchedCategory.id,
        isFolder: false,
      });

      imported.push(createdNote);
    } catch (err: any) {
      skipped.push({
        filename: file.filename,
        reason: `Gagal mengimpor: ${err?.message || "Kesalahan tidak diketahui"}`,
      });
    }
  }

  return {
    imported,
    skipped,
  };
}
