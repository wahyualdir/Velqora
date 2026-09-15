import { DocSectionItem } from "@/components/modul/doc-reader-layout";
import { ModuleSection } from "@/types/module-drive";

/**
 * Metadata sitasi dan rujukan akademik resmi yang dapat diverifikasi (DOI, URL, buku teks, paper)
 */
export interface AcademicCitation {
  title: string;
  authors: string[];
  type: "book" | "paper" | "documentation" | "standard" | "course";
  url: string;
  doi?: string;
  relevance: string;
  year?: number;
  publisherOrVenue?: string;
  accessedAt?: string;
}

/**
 * Contoh kode praktikum Python yang dapat dieksekusi mandiri
 */
export interface AcademicCodeExample {
  id: string;
  title: string;
  language: "python" | "sql" | "bash";
  filename: string;
  code: string;
  expectedOutput: string;
  explanation: string;
  prerequisites?: string[];
}

/**
 * Struktur subbab materi akademik mendalam
 */
export interface AcademicSubchapter {
  id: string;
  slug: string;
  title: string;
  orderIndex: number;
  description: string;
  learningObjectives?: string[];
  prerequisites?: string[];
  content_markdown: string;
  codeExamples?: AcademicCodeExample[];
  exercises?: string[];
  references?: AcademicCitation[];
}

/**
 * Struktur bab kurikulum
 */
export interface AcademicChapter {
  id: string;
  slug: string;
  title: string;
  orderIndex: number;
  description: string;
  learningObjectives?: string[];
  subchapters: AcademicSubchapter[];
}

/**
 * Entitas kurikulum lengkap untuk suatu bidang topik
 */
export interface AcademicCurriculum {
  id: string;
  slug: string;
  title: string;
  category: string; // Kategori induk (misal: "Kecerdasan Buatan", "Data Science")
  level: "pemula" | "menengah" | "lanjutan";
  description: string;
  primaryReferences: AcademicCitation[];
  chapters: AcademicChapter[];
  estimatedHours?: number;
  version?: string;
}

/**
 * Helper converter: Mengubah AcademicCurriculum menjadi DocSectionItem[] untuk DocReaderLayout
 */
export function curriculumToDocSectionItems(curriculum: AcademicCurriculum): DocSectionItem[] {
  return curriculum.chapters.map((chapter) => {
    const subsections: DocSectionItem[] = chapter.subchapters.map((sub) => ({
      id: sub.id,
      slug: sub.slug,
      title: sub.title,
      orderIndex: sub.orderIndex,
      description: sub.description,
      content_markdown: sub.content_markdown,
      parentTitle: chapter.title,
      chapterNumber: chapter.orderIndex,
      codeSnippets: (sub.codeExamples || []).map((c) => ({
        id: c.id,
        language: c.language,
        code: c.code,
        caption: c.filename,
      })),
    }));

    return {
      id: chapter.id,
      slug: chapter.slug,
      title: chapter.title,
      orderIndex: chapter.orderIndex,
      description: chapter.description,
      content_markdown: subsections[0]?.content_markdown || null,
      subsections,
      codeSnippets: [],
    };
  });
}

/**
 * Helper converter: Mengubah AcademicCurriculum menjadi daftar flat DocSectionItem[]
 */
export function curriculumToFlatDocSectionItems(curriculum: AcademicCurriculum): DocSectionItem[] {
  const flatList: DocSectionItem[] = [];
  for (const chapter of curriculum.chapters) {
    if (chapter.subchapters && chapter.subchapters.length > 0) {
      for (const sub of chapter.subchapters) {
        flatList.push({
          id: sub.id,
          slug: sub.slug,
          title: sub.title,
          orderIndex: sub.orderIndex,
          description: sub.description,
          content_markdown: sub.content_markdown,
          parentTitle: chapter.title,
          chapterNumber: chapter.orderIndex,
          codeSnippets: (sub.codeExamples || []).map((c) => ({
            id: c.id,
            language: c.language,
            code: c.code,
            caption: c.filename,
          })),
        });
      }
    } else {
      flatList.push({
        id: chapter.id,
        slug: chapter.slug,
        title: chapter.title,
        orderIndex: chapter.orderIndex,
        description: chapter.description,
        content_markdown: null,
      });
    }
  }
  return flatList;
}

/**
 * Helper converter: Mengubah AcademicCurriculum menjadi ModuleSection[] untuk silabus default modul
 */
export function curriculumToModuleSections(curriculum: AcademicCurriculum): ModuleSection[] {
  return curriculum.chapters.map((ch) => ({
    id: ch.id,
    title: ch.title,
    orderIndex: ch.orderIndex,
    isCompleted: false,
    description: ch.description,
    codeSnippets: ch.subchapters[0]?.codeExamples?.map((c) => ({
      id: c.id,
      language: c.language,
      code: c.code,
      caption: c.filename,
    })) || [],
  }));
}
