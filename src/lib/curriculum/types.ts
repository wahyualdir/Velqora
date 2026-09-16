import { ModuleSection } from "@/types/module-drive";

// ============================================================================
// LAYER 0: DOC SECTION ITEM (REPRESENTASI KONSUMEN READER)
// ============================================================================

export interface DocSectionItem {
  id: string;
  slug?: string;
  title: string;
  orderIndex?: number;
  description?: string;
  content_markdown?: string | null;
  codeSnippets?: Array<{
    id: string;
    language: string;
    code: string;
    caption?: string;
  }>;
  subsections?: DocSectionItem[];
  parentTitle?: string;
  chapterNumber?: string | number;
  sectionNumber?: string;
  units?: NotebookUnit[];
  summary?: string;
  learningObjectives?: string[];
  sourceRefIds?: string[];
  reviewStatus?: "legacy_synthetic" | "verified_with_limitations" | "verified";
  flow?: LessonFlow;
  lesson?: AcademicLesson;
  executionGroups?: NotebookExecutionGroup[];
}

// ============================================================================
// LAYER 1: SOURCE & CITATION METADATA
// ============================================================================

export type SourceRelevanceClassification =
  | "VERIFIED_RELEVANT"
  | "VERIFIED_GENERAL"
  | "NEEDS_MANUAL_REVIEW"
  | "PAYWALL"
  | "BROKEN"
  | "METADATA_MISMATCH"
  | "DUPLICATE_SOURCE";

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
  relevanceClassification?: SourceRelevanceClassification;
  isPrimarySource?: boolean;
}

export interface SourceReference {
  id: string;
  title: string;
  authors: string[];
  year: number;
  publication: string;
  url?: string;
  doi?: string;
  relevanceNote?: string;
  verified?: boolean;
}

// ============================================================================
// LAYER 2: CODE EXECUTION METADATA
// ============================================================================

export type ExecutionStatus =
  | "not_executed"
  | "running"
  | "success"
  | "failed"
  | "timeout"
  | "verified";

export interface ExecutionEvidence {
  runtime: string; // e.g. "Python 3.12.10 (CPython 64-bit)"
  exitCode: number;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  timestamp: string; // ISO 8601
  machineSignature?: string;
}

export type CodeExecutionClassification =
  | "VERIFIED_RUNNABLE"
  | "VERIFIED_WITH_ENVIRONMENT_NOTES"
  | "FAILED_RUNTIME"
  | "FAILED_DEPENDENCY"
  | "OUTPUT_MISMATCH"
  | "PSEUDOCODE"
  | "NOT_EXECUTED";

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
  dependencies?: string[];
  verificationStatus?: CodeExecutionClassification;
  actualOutput?: string;
  isVerifiedOutput?: boolean;
  runtimeMs?: number;
}

// ============================================================================
// LAYER 3: DATASET PROVENANCE METADATA
// ============================================================================

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
  provenanceNotes?: string;
}

// ============================================================================
// LAYER 4: LESSON FLOW & EXECUTION RELATION MODEL
// ============================================================================

export type LessonFlow =
  | "conceptual"
  | "mathematical"
  | "algorithmic"
  | "computational"
  | "project"
  | "mixed";

export interface NotebookExecutionGroup {
  id: string;
  title?: string;
  codeUnitId: string;
  outputUnitId?: string;
  interpretationUnitId?: string;
  executionEvidence?: ExecutionEvidence;
  sourceReferences?: SourceReference[];
  status:
    | "not-run"
    | "executed"
    | "output-matched"
    | "reviewed"
    | "accepted";
}

export interface AcademicLesson {
  id: string;
  topicId: string;
  chapterId: string;
  subchapterId: string;
  number: string;
  title: string;
  subtitle?: string;
  description?: string;
  flow: LessonFlow;
  learningObjectives: string[];
  prerequisites: string[];
  keyQuestions: string[];
  estimatedMinutes?: number;
  units: NotebookUnit[];
  executionGroups?: NotebookExecutionGroup[];
  summary?: string[];
  commonMistakes?: string[];
  furtherReading?: SourceReference[];
  status: "legacy" | "pilot" | "migrated" | "reviewed" | "accepted";
}

// ============================================================================
// LAYER 5: NOTEBOOK-STYLE PEDAGOGICAL & CONTENT UNITS
// ============================================================================

export interface BaseNotebookUnit {
  id: string;
  title?: string;
  order?: number;
  sourceReferences?: SourceReference[];
  qualityStatus?: "draft" | "reviewed" | "verified" | "accepted";
}

export interface NotebookMarkdownUnit extends BaseNotebookUnit {
  type: "markdown";
  content: string;
}

export interface NotebookDefinitionUnit extends BaseNotebookUnit {
  type: "definition";
  term: string;
  formalDefinition: string;
  intuitiveExplanation: string;
  mathematicalBasis?: string;
  realWorldAnalogy: string;
  commonMisconceptions?: string[];
}

export interface NotebookFormulaUnit extends BaseNotebookUnit {
  type: "formula";
  latex: string;
  name: string;
  derivationNotes?: string;
  variables: Array<{
    symbol: string;
    description: string;
    unit?: string;
  }>;
  workedExample?: {
    inputs: Record<string, string | number>;
    stepByStep: string[];
    finalResult: string;
  };
}

export interface NotebookExampleUnit extends BaseNotebookUnit {
  type: "example";
  scenario: string;
  rawInput: string | Record<string, unknown>;
  transformationSteps: string[];
  expectedOutput: string | Record<string, unknown>;
  analysis: string;
}

export interface NotebookCodeUnit extends BaseNotebookUnit {
  type: "code";
  language: string;
  filename?: string;
  executionStatus: ExecutionStatus;
  cellIndex?: number;
  preExplanation: string;
  code: string;
  dependencies: string[];
  runtimeComplexity?: string;
  memoryComplexity?: string;
  failureModes?: string[];
  postAnalysis?: string;
}

export interface NotebookOutputUnit extends BaseNotebookUnit {
  type: "output";
  relatedCodeUnitId: string;
  cellIndex?: number;
  format: "text" | "table" | "json" | "image" | "error";
  content: string;
  executionEvidence?: ExecutionEvidence;
}

export interface NotebookInterpretationUnit extends BaseNotebookUnit {
  type: "interpretation";
  relatedCodeUnitId?: string;
  headline: string;
  observations: string[];
  domainImplication: string;
  statisticalCaveats?: string[];
}

export interface NotebookWarningUnit extends BaseNotebookUnit {
  type: "warning";
  severity: "tip" | "info" | "warning" | "danger";
  title: string;
  description: string;
  countermeasure: string;
}

export interface NotebookExerciseUnit extends BaseNotebookUnit {
  type: "exercise";
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
  scenario: string;
  task: string;
  hints: string[];
  solutionCode?: string;
  solutionExplanation?: string;
  evaluationRubric: Array<{
    criterion: string;
    weight: number;
    expectation: string;
  }>;
}

export interface NotebookProjectUnit extends BaseNotebookUnit {
  type: "project";
  title: string;
  industryContext: string;
  businessProblem: string;
  datasetSpecs: {
    name: string;
    rows: number;
    columns: number;
    source: string;
    targetVariable?: string;
  };
  milestoneSteps: Array<{
    title: string;
    deliverables: string[];
  }>;
  acceptanceCriteria: string[];
}

export interface NotebookTableUnit extends BaseNotebookUnit {
  type: "table";
  caption: string;
  headers: string[];
  rows: (string | number)[][];
  markdownFallback?: string;
}

export interface NotebookImageUnit extends BaseNotebookUnit {
  type: "image";
  src: string;
  alt: string;
  caption: string;
  technicalDiagramNote?: string;
}

export type NotebookUnit =
  | NotebookMarkdownUnit
  | NotebookDefinitionUnit
  | NotebookFormulaUnit
  | NotebookExampleUnit
  | NotebookCodeUnit
  | NotebookOutputUnit
  | NotebookInterpretationUnit
  | NotebookWarningUnit
  | NotebookExerciseUnit
  | NotebookProjectUnit
  | NotebookTableUnit
  | NotebookImageUnit;

/**
 * Konversi serangkaian NotebookUnit menjadi Markdown komprehensif
 * Menjamin kompatibilitas mundur dengan reader markdown biasa dan sistem indeks.
 */
export function notebookUnitsToMarkdown(units: NotebookUnit[]): string {
  const parts: string[] = [];

  for (const unit of units) {
    switch (unit.type) {
      case "markdown":
        parts.push(unit.content);
        break;

      case "definition": {
        let def = `### Definisi Formal: ${unit.term}\n\n`;
        def += `> **Definisi:** ${unit.formalDefinition}\n\n`;
        def += `**Intuisi & Pemahaman:** ${unit.intuitiveExplanation}\n\n`;
        def += `**Analogi Dunia Nyata:** ${unit.realWorldAnalogy}\n\n`;
        if (unit.mathematicalBasis) {
          def += `**Basis Matematis:** ${unit.mathematicalBasis}\n\n`;
        }
        if (unit.commonMisconceptions && unit.commonMisconceptions.length > 0) {
          def += `**Miskonsepsi Umum:**\n` + unit.commonMisconceptions.map((m) => `- ⚠️ ${m}`).join("\n") + "\n\n";
        }
        parts.push(def);
        break;
      }

      case "formula": {
        let form = `### Formulasi Matematis: ${unit.name}\n\n`;
        form += `$$\n${unit.latex}\n$$\n\n`;
        if (unit.derivationNotes) {
          form += `*Catatan Penurunan:* ${unit.derivationNotes}\n\n`;
        }
        if (unit.variables && unit.variables.length > 0) {
          form += `| Simbol | Deskripsi | Satuan/Dimensi |\n|---|---|---|\n`;
          form += unit.variables.map((v) => `| $${v.symbol}$ | ${v.description} | ${v.unit || "-"} |`).join("\n") + "\n\n";
        }
        if (unit.workedExample) {
          form += `**Contoh Perhitungan Manual:**\n\n`;
          form += `*Input:* ${JSON.stringify(unit.workedExample.inputs)}\n\n`;
          form += unit.workedExample.stepByStep.map((s, idx) => `${idx + 1}. ${s}`).join("\n") + "\n\n";
          form += `**Hasil Akhir:** ${unit.workedExample.finalResult}\n\n`;
        }
        parts.push(form);
        break;
      }

      case "example": {
        let ex = `### Kasus Konkret: ${unit.scenario}\n\n`;
        ex += `**Input Data Mentah:**\n\`\`\`json\n${typeof unit.rawInput === "string" ? unit.rawInput : JSON.stringify(unit.rawInput, null, 2)}\n\`\`\`\n\n`;
        ex += `**Langkah Transformasi:**\n` + unit.transformationSteps.map((s, i) => `${i + 1}. ${s}`).join("\n") + "\n\n";
        ex += `**Output Diharapkan:**\n\`\`\`json\n${typeof unit.expectedOutput === "string" ? unit.expectedOutput : JSON.stringify(unit.expectedOutput, null, 2)}\n\`\`\`\n\n`;
        ex += `**Analisis Domain:** ${unit.analysis}\n\n`;
        parts.push(ex);
        break;
      }

      case "code": {
        let c = "";
        if (unit.preExplanation) {
          c += `${unit.preExplanation}\n\n`;
        }
        const cellLabel = unit.cellIndex !== undefined ? `[In ${unit.cellIndex}]: ` : "";
        const fileLabel = unit.filename ? ` (${unit.filename})` : "";
        c += `\`\`\`${unit.language}\n# ${cellLabel}${fileLabel}\n${unit.code}\n\`\`\`\n\n`;
        if (unit.dependencies && unit.dependencies.length > 0) {
          c += `*Dependencies:* \`${unit.dependencies.join(", ")}\`\n\n`;
        }
        if (unit.runtimeComplexity || unit.memoryComplexity) {
          c += `*Kompleksitas:* Waktu: \`${unit.runtimeComplexity || "O(1)"}\` | Memori: \`${unit.memoryComplexity || "O(1)"}\`\n\n`;
        }
        if (unit.failureModes && unit.failureModes.length > 0) {
          c += `*Potensi Kegagalan Runtime:*\n` + unit.failureModes.map((f) => `- ❌ ${f}`).join("\n") + "\n\n";
        }
        if (unit.postAnalysis) {
          c += `${unit.postAnalysis}\n\n`;
        }
        parts.push(c);
        break;
      }

      case "output": {
        const cellLabel = unit.cellIndex !== undefined ? `[Out ${unit.cellIndex}]` : "[Output]";
        let out = `**Hasil Eksekusi ${cellLabel}:**\n\n`;
        if (unit.executionEvidence) {
          out += `> 🟢 *Diverifikasi pada ${unit.executionEvidence.runtime} (Runtime: ${unit.executionEvidence.executionTimeMs}ms, Exit: ${unit.executionEvidence.exitCode})*\n\n`;
        }
        out += `\`\`\`\n${unit.content}\n\`\`\`\n\n`;
        parts.push(out);
        break;
      }

      case "interpretation": {
        let interp = `#### 🔍 Interpretasi Hasil: ${unit.headline}\n\n`;
        interp += `**Observasi Kunci:**\n` + unit.observations.map((o) => `- 📌 ${o}`).join("\n") + "\n\n";
        interp += `**Implikasi Domain:** ${unit.domainImplication}\n\n`;
        if (unit.statisticalCaveats && unit.statisticalCaveats.length > 0) {
          interp += `**Peringatan Statistik:**\n` + unit.statisticalCaveats.map((c) => `- ⚠️ ${c}`).join("\n") + "\n\n";
        }
        parts.push(interp);
        break;
      }

      case "warning": {
        const badgeMap = {
          tip: "TIP",
          info: "NOTE",
          warning: "WARNING",
          danger: "CAUTION",
        };
        const alertType = badgeMap[unit.severity] || "WARNING";
        let w = `> [!${alertType}]\n`;
        w += `> **${unit.title}**\n>\n`;
        w += `> ${unit.description.replace(/\n/g, "\n> ")}\n>\n`;
        w += `> **Mitigasi / Solusi Rekayasa:** ${unit.countermeasure.replace(/\n/g, "\n> ")}\n\n`;
        parts.push(w);
        break;
      }

      case "exercise": {
        let ex = `### 🎯 Latihan Mandiri (Level ${unit.level}/5): ${unit.title}\n\n`;
        ex += `**Skenario Masalah:** ${unit.scenario}\n\n`;
        ex += `**Tugas Anda:** ${unit.task}\n\n`;
        if (unit.hints && unit.hints.length > 0) {
          ex += `<details><summary>💡 Petunjuk Penyelesaian (Klik untuk melihat)</summary>\n\n`;
          ex += unit.hints.map((h, i) => `${i + 1}. ${h}`).join("\n") + `\n\n</details>\n\n`;
        }
        if (unit.solutionCode) {
          ex += `<details><summary>🔑 Solusi Referensi & Penjelasan</summary>\n\n`;
          ex += `\`\`\`python\n${unit.solutionCode}\n\`\`\`\n\n`;
          if (unit.solutionExplanation) {
            ex += `${unit.solutionExplanation}\n\n`;
          }
          ex += `</details>\n\n`;
        }
        if (unit.evaluationRubric && unit.evaluationRubric.length > 0) {
          ex += `**Rubrik Penilaian:**\n\n| Kriteria | Bobot | Ekspektasi Capaian |\n|---|---|---|\n`;
          ex += unit.evaluationRubric.map((r) => `| ${r.criterion} | ${r.weight}% | ${r.expectation} |`).join("\n") + "\n\n";
        }
        parts.push(ex);
        break;
      }

      case "project": {
        let p = `### 🚀 Proyek Terapan: ${unit.title}\n\n`;
        p += `**Konteks Industri:** ${unit.industryContext}\n\n`;
        p += `**Tantangan Bisnis:** ${unit.businessProblem}\n\n`;
        p += `**Spesifikasi Dataset:**\n- Nama: \`${unit.datasetSpecs.name}\`\n- Dimensi: ${unit.datasetSpecs.rows} baris × ${unit.datasetSpecs.columns} kolom\n- Sumber: [${unit.datasetSpecs.source}](${unit.datasetSpecs.source})\n- Target Variabel: \`${unit.datasetSpecs.targetVariable || "N/A"}\`\n\n`;
        p += `**Milestone Implementasi:**\n`;
        p += unit.milestoneSteps.map((m, idx) => `${idx + 1}. **${m.title}**:\n   ` + m.deliverables.map((d) => `- [ ] ${d}`).join("\n   ")).join("\n") + "\n\n";
        p += `**Kriteria Penerimaan (Acceptance Criteria):**\n` + unit.acceptanceCriteria.map((a) => `- ✅ ${a}`).join("\n") + "\n\n";
        parts.push(p);
        break;
      }

      case "table": {
        let t = `### ${unit.caption}\n\n`;
        if (unit.markdownFallback) {
          t += `${unit.markdownFallback}\n\n`;
        } else {
          t += `| ${unit.headers.join(" | ")} |\n`;
          t += `| ${unit.headers.map(() => "---").join(" | ")} |\n`;
          for (const row of unit.rows) {
            t += `| ${row.join(" | ")} |\n`;
          }
          t += "\n";
        }
        parts.push(t);
        break;
      }

      case "image": {
        let img = `![${unit.alt}](${unit.src})\n\n`;
        img += `*Gambar: ${unit.caption}*\n\n`;
        if (unit.technicalDiagramNote) {
          img += `> ℹ️ *Catatan Diagram Teknis:* ${unit.technicalDiagramNote}\n\n`;
        }
        parts.push(img);
        break;
      }
    }
  }

  return parts.join("\n\n");
}

export interface AcademicDiscussionUnit {
  id: string;
  slug: string;
  title: string;
  orderIndex: number;
  content_markdown: string;
  codeExamples?: AcademicCodeExample[];
  references?: AcademicCitation[];
  purpose?: string;
  isSubstantive?: boolean;
}

export interface AcademicSubchapter {
  id: string;
  slug: string;
  title: string;
  orderIndex: number;
  description: string;
  learningObjectives?: string[];
  prerequisites?: string[];
  content_markdown: string;
  summary?: string;
  sourceRefIds?: string[];
  units?: NotebookUnit[];
  reviewStatus?: "legacy_synthetic" | "verified_with_limitations" | "verified";
  flow?: LessonFlow;
  lesson?: AcademicLesson;
  executionGroups?: NotebookExecutionGroup[];
  codeExamples?: AcademicCodeExample[];
  exercises?: Array<{ level: number; task: string; hint?: string; solution?: string } | string>;
  references?: AcademicCitation[];
  subSubchapters?: AcademicDiscussionUnit[];
  dataset?: AcademicDatasetMetadata;
  commonPitfalls?: string[];
  caseStudy?: string;
  contentStatus?: "legacy-synthetic" | "substantive-verified" | "migrated";
}

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
  transitionToNextChapter?: string;
  checklist?: string[];
  evaluationQuestions?: string[];
  miniProject?: string;
  dataset?: AcademicDatasetMetadata;
}

export interface AcademicCurriculum {
  id: string;
  slug: string;
  title: string;
  category: string;
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
  auditStatus?: "FAILED_VALIDATION" | "VERIFIED_WITH_LIMITATIONS" | "VERIFIED";
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

      // Jika ada notebook units, pastikan markdown terisi jika content_markdown kosong
      const finalMarkdown =
        sub.content_markdown && sub.content_markdown.trim().length > 30
          ? sub.content_markdown
          : sub.units && sub.units.length > 0
          ? notebookUnitsToMarkdown(sub.units)
          : sub.content_markdown;

      return {
        id: sub.id,
        slug: sub.slug,
        title: sub.title,
        orderIndex: sub.orderIndex,
        description: sub.description,
        content_markdown: finalMarkdown,
        parentTitle: chapter.title,
        chapterNumber: chapter.orderIndex,
        units: sub.units,
        lesson: sub.lesson,
        flow: sub.flow || sub.lesson?.flow,
        executionGroups: sub.executionGroups || sub.lesson?.executionGroups,
        summary: sub.summary,
        learningObjectives: sub.learningObjectives,
        sourceRefIds: sub.sourceRefIds,
        reviewStatus: sub.reviewStatus,
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

        const finalMarkdown =
          sub.content_markdown && sub.content_markdown.trim().length > 30
            ? sub.content_markdown
            : sub.units && sub.units.length > 0
            ? notebookUnitsToMarkdown(sub.units)
            : sub.content_markdown;

        flatList.push({
          id: sub.id,
          slug: sub.slug,
          title: sub.title,
          orderIndex: sub.orderIndex,
          description: sub.description,
          content_markdown: finalMarkdown,
          parentTitle: chapter.title,
          chapterNumber: chapter.orderIndex,
          units: sub.units,
          summary: sub.summary,
          learningObjectives: sub.learningObjectives,
          sourceRefIds: sub.sourceRefIds,
          reviewStatus: sub.reviewStatus,
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
