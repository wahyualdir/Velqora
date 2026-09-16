import { DocSectionItem } from "@/components/modul/doc-reader-layout";
import { ModuleSection } from "@/types/module-drive";

/**
 * Metadata sitasi dan rujukan akademik resmi yang dapat diverifikasi (DOI, URL, buku teks, paper)
 */
export interface AcademicCitation {
  id?: string;
  title: string;
  authors: string[];
  type: "book" | "paper" | "documentation" | "standard" | "course";
  url: string;
  doi?: string;
  relevance: string;
  year?: number;
  publisherOrVenue?: string;
  accessedAt?: string;
  sourceType?: "official-documentation" | "academic-book" | "paper" | "benchmark-dataset" | "university-course" | "standard-framework";
  provider?: string;
  relatedTopics?: string[];
  relatedConcepts?: string[];
  verified?: boolean;
  lastChecked?: string;
  verificationStatus?: "verified" | "needs-manual-verification" | "needs-source-verification";
}

/**
 * Metadata dataset resmi dan benchmark riil yang digunakan dalam pembelajaran
 */
export interface AcademicDatasetMetadata {
  id: string;
  name: string;
  purpose: string;
  sourceUrl: string;
  license?: string;
  numSamples?: number | string;
  numFeatures?: number | string;
  target?: string;
  dtypes?: Record<string, string>;
  limitations: string;
  potentialBias: string;
  downloadInstructions: string;
  inspectionSnippet: string;
  verified: boolean;
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
  inputDataDescription?: string;
  executionSteps?: string[];
  troubleshooting?: string[];
  level?: "pemula" | "menengah" | "lanjutan";
  hardwareRequirement?: "cpu" | "gpu-optional" | "gpu-recommended";
}

/**
 * Unit pembahasan mendalam atau sub-subbab (Level 3 Hierarchy)
 */
export interface AcademicDiscussionUnit {
  id: string;
  slug: string;
  title: string;
  orderIndex: number;
  content_markdown: string;
  codeExamples?: AcademicCodeExample[];
  references?: AcademicCitation[];
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
  exercises?: Array<{ level: number; task: string; hint?: string; solution?: string } | string>;
  references?: AcademicCitation[];
  subSubchapters?: AcademicDiscussionUnit[];
  dataset?: AcademicDatasetMetadata;
  commonPitfalls?: string[];
  caseStudy?: string;
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
  competencies?: string[];
  prerequisites?: string[];
  coreConcepts?: string[];
  terminology?: Array<{ term: string; definition: string; enTerm?: string }>;
  subchapters: AcademicSubchapter[];
  exercises?: string[];
  commonPitfalls?: string[];
  caseStudy?: string;
  comparison?: string;
  limitations?: string;
  ethicsAndSecurity?: string;
  summary?: string;
  checklist?: string[];
  evaluationQuestions?: string[];
  miniProject?: string;
  dataset?: AcademicDatasetMetadata;
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
  datasets?: AcademicDatasetMetadata[];
  capstoneProject?: {
    title: string;
    description: string;
    requirements: string[];
    rubrics: string[];
  };
  verifiedSourcesCount?: number;
}

/**
 * Helper converter: Mengubah AcademicCurriculum menjadi DocSectionItem[] untuk DocReaderLayout
 */
export function curriculumToDocSectionItems(curriculum: AcademicCurriculum): DocSectionItem[] {
  return curriculum.chapters.map((chapter) => {
    const subsections: DocSectionItem[] = chapter.subchapters.map((sub) => {
      // Kumpulkan kode snippet dari subbab dan seluruh sub-subbabnya
      const allSnippets = [
        ...(sub.codeExamples || []),
        ...(sub.subSubchapters || []).flatMap((unit) => unit.codeExamples || []),
      ];

      return {
        id: sub.id,
        slug: sub.slug,
        title: sub.title,
        orderIndex: sub.orderIndex,
        description: sub.description,
        content_markdown: sub.content_markdown,
        parentTitle: chapter.title,
        chapterNumber: chapter.orderIndex,
        codeSnippets: allSnippets.map((c) => ({
          id: c.id,
          language: c.language,
          code: c.code,
          caption: c.filename,
        })),
        subsections: (sub.subSubchapters || []).map((unit) => ({
          id: unit.id,
          slug: unit.slug,
          title: unit.title,
          orderIndex: unit.orderIndex,
          description: "",
          content_markdown: unit.content_markdown,
          parentTitle: sub.title,
          chapterNumber: chapter.orderIndex,
          codeSnippets: (unit.codeExamples || []).map((c) => ({
            id: c.id,
            language: c.language,
            code: c.code,
            caption: c.filename,
          })),
        })),
      };
    });

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
        const allSnippets = [
          ...(sub.codeExamples || []),
          ...(sub.subSubchapters || []).flatMap((unit) => unit.codeExamples || []),
        ];

        flatList.push({
          id: sub.id,
          slug: sub.slug,
          title: sub.title,
          orderIndex: sub.orderIndex,
          description: sub.description,
          content_markdown: sub.content_markdown,
          parentTitle: chapter.title,
          chapterNumber: chapter.orderIndex,
          codeSnippets: allSnippets.map((c) => ({
            id: c.id,
            language: c.language,
            code: c.code,
            caption: c.filename,
          })),
        });

        if (sub.subSubchapters && sub.subSubchapters.length > 0) {
          for (const unit of sub.subSubchapters) {
            flatList.push({
              id: unit.id,
              slug: unit.slug,
              title: unit.title,
              orderIndex: unit.orderIndex,
              description: "",
              content_markdown: unit.content_markdown,
              parentTitle: sub.title,
              chapterNumber: chapter.orderIndex,
              codeSnippets: (unit.codeExamples || []).map((c) => ({
                id: c.id,
                language: c.language,
                code: c.code,
                caption: c.filename,
              })),
            });
          }
        }
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
