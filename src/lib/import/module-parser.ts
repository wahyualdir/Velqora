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
