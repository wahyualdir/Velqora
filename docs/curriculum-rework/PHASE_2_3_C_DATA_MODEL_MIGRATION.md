# PHASE 2.3-C — DATA MODEL & MIGRATION REPORT

## 1. Executive Summary

| Metadata Layer | Target Model | Status Migrasi & Kompatibilitas |
|---|---|---|
| **Layer 1: Source & Citation** | `AcademicCitation`, `SourceRelevanceClassification` | Terintegrasi. Menandai sumber duplikat, homepage generik, dan klasifikasi relevansi. |
| **Layer 2: Code Execution** | `AcademicCodeExample`, `CodeExecutionClassification` | Terintegrasi. Mengisolasi flag verifikasi `isVerifiedOutput` dan error status runtime. |
| **Layer 3: Dataset Provenance** | `AcademicDatasetMetadata` | Terintegrasi. Mendukung nama dataset, URL sumber, lisensi, limitasi, dan inspeksi. |
| **Layer 4: Pedagogical Content** | `AcademicDiscussionUnit`, `AcademicSubchapter`, `AcademicChapter` | Terintegrasi. Mendukung struktur adaptif tanpa pembatasan kaku 10x10. |
| **Layer 5: Chapter Transitions** | `summary`, `transitionToNextChapter` | Terintegrasi. Menghubungkan kesinambungan pedagogis antar bab. |
| **Layer 6: Reader Navigation** | `DocSectionItem`, `ModuleSection` converter | Terintegrasi. Menjamin reader UI dapat merender seluruh hierarki tanpa crash. |

---

## 2. Pemisahan Enam Lapisan Arsitektur Data (6-Layer Separation)

Sesuai arahan audit Phase 2.2.1, model data kurikulum tidak lagi mencampuradukkan teks mentah dengan klaim verifikasi sepihak. Seluruh komponen dipisahkan ke dalam 6 lapisan terpisah dalam `src/lib/curriculum/types.ts`:

### 2.1 Layer 1: Source Metadata
```typescript
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
```

### 2.2 Layer 2: Code Execution Metadata
```typescript
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
```

### 2.3 Layer 3: Dataset Metadata
```typescript
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
```

### 2.4 Layer 4: Curriculum Content & Pedagogical Units
```typescript
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
  codeExamples?: AcademicCodeExample[];
  exercises?: Array<{ level: number; task: string; hint?: string; solution?: string } | string>;
  references?: AcademicCitation[];
  subSubchapters?: AcademicDiscussionUnit[];
  dataset?: AcademicDatasetMetadata;
  commonPitfalls?: string[];
  caseStudy?: string;
  contentStatus?: "legacy-synthetic" | "substantive-verified" | "migrated";
}
```

### 2.5 Layer 5: Chapter Summaries & Pedagogical Transitions
```typescript
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
```

### 2.6 Layer 6: Reader Navigation Metadata
```typescript
export function curriculumToDocSectionItems(curriculum: AcademicCurriculum): DocSectionItem[];
export function curriculumToFlatDocSectionItems(curriculum: AcademicCurriculum): DocSectionItem[];
export function curriculumToModuleSections(curriculum: AcademicCurriculum): ModuleSection[];
```

---

## 3. Strategi Migrasi Non-Destruktif (Non-Destructive Migration)

1. **Integritas Data Asli Terjaga**:
   - Seluruh 28 file topik (`01-ai-agent.ts` s.d. `28-vector-database-retrieval.ts`) tetap utuh. Tidak ada penghapusan baris kode atau data mentah secara destruktif.
2. **Penandaan Otomatis (Tagging)**:
   - Script migrasi `scripts/curriculum-generator/migrate-data-model.ts` menganalisis seluruh pohon kurikulum.
   - Unit yang dihasilkan generator sintetis lama secara eksplisit ditandai `contentStatus: "legacy-synthetic"`.
   - Kode yang memiliki placeholder `expectedOutput` ("Status eksekusi: Komputasi berhasil...") ditandai dengan `verificationStatus: "OUTPUT_MISMATCH"` dan `isVerifiedOutput: false`.
   - Referensi yang menggunakan URL berulang (hanya 47 URL untuk ribuan unit) diklasifikasikan sebagai `DUPLICATE_SOURCE`.
3. **Audit Trail**:
   - Status kurikulum `auditStatus` tetap dipertahankan sebagai `"FAILED_VALIDATION"` hingga fase penulisan pilot substantif dan eksekusi kode selesai diverifikasi.

---

## 4. Hasil Verifikasi Kompilasi & Runtime

- **TypeScript Typecheck (`npx tsc --noEmit`)**: Selesai dengan Exit Code 0 (0 error).
- **Generator Guardrail Test (`npx vitest run scripts/curriculum-generator/__tests__/substantive-generator.test.ts`)**: 3/3 Unit Test PASS (100%).
- **Backward Compatibility**: `DocReaderLayout` dan komponen frontend tetap dapat mengonsumsi `AcademicCurriculum` melalui fungsi converter tanpa regresi.
