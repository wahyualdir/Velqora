# VELQORA — CURRICULUM CONTENT ARCHITECTURE & NOTEBOOK SPECIFICATION

**Dokumen**: Arsitektur Konten Kurikulum Akademik Notebook-Style  
**Versi**: 2.0 (Gold Standard Rebuild)  
**Status**: VERIFIED_WITH_LIMITATIONS  
**Domain Referensi**: Data Science — Bab 1 (Siklus Hidup Analisis Data, Problem Framing & Metodologi Inferensi)

---

## 1. Eksekutif & Filosofi Desain

Sistem kurikulum Velqora dirancang ulang secara radikal dari model artikel blogging statis menjadi **Sistem Pembelajaran Akademik Berbasis Notebook (Notebook-Style Learning System)** setara mata kuliah universitas terkemuka dan buku teks komputasional standar industri (MIT OpenCourseWare, Stanford CS229, UC Berkeley Data 8, O'Reilly Hands-On Series).

### Prinsip Inti Arsitektur:
1. **Zero Synthetic / Pseudo Code**: Seluruh kode komputasional wajib executable dan divalidasi langsung oleh Python runtime (`python.exe` 3.12+).
2. **Output Provenance Binding**: Output yang ditampilkan bukan teks karangan, melainkan hasil tangkapan riil stdout/stderr lengkap dengan execution timestamp, exit code, dan runtime.
3. **Rigorous Pedagogical Cadence**: Tidak ada kode yang berdiri sendiri tanpa penjelasan konseptual sebelumnya (Pre-Code Markdown) dan interpretasi empiris sesudahnya (Post-Code Interpretation).
4. **Multi-Layered Assessment**: Latihan bertingkat dari Level 1 (Konseptual) hingga Level 5 (Desain Arsitektur/Penelitian Mandiri) dengan rubrik analitik dan solusi terverifikasi.

---

## 2. Hierarki Struktur Kurikulum

```
Level 1: Topic (Domain)
└── Level 2: Bab (Course Module / Chapter)
    └── Level 3: Subbab (Academic Subchapter / Notebook Unit Container)
        └── Level 4: Unit (Polymorphic Notebook Cell)
```

### Relasi Data Model TypeScript:
- **`TopicCurriculum`**: Entitas topik level teratas (`id`, `title`, `description`, `chapters`).
- **`AcademicChapter`**: Modul pembelajaran komprehensif (`id`, `chapterNumber`, `title`, `description`, `subchapters`).
- **`AcademicSubchapter`**: Notebook unit container (`id`, `subchapterNumber`, `title`, `description`, `learningObjectives`, `units`, `content_markdown`, `sourceRefIds`, `reviewStatus`).
- **`NotebookUnit`**: Union diskriminatif dari 12 tipe unit pembelajaran.

---

## 3. Matriks 31 Elemen Kurikulum Akademik

Setiap subbab yang berstatus Gold Standard mengintegrasikan 31 elemen esensial:

| No | Elemen Kurikulum | Lapisan Pedagogis | Representasi Data Model | Tipe Unit |
|---|---|---|---|---|
| 1 | Subchapter Title & Code | Metadata | `AcademicSubchapter.title`, `id` | Metadata Header |
| 2 | Estimated Duration | Metadata | `AcademicSubchapter.estimatedMinutes` | Metadata Header |
| 3 | Difficulty Level (1–5) | Metadata | `AcademicSubchapter.difficulty` | Metadata Badge |
| 4 | Academic Abstract | Pre-Lecture | `AcademicSubchapter.description` | Markdown Unit |
| 5 | Bloom's Learning Objectives | Pre-Lecture | `AcademicSubchapter.learningObjectives` | Objective Card |
| 6 | Prerequisites & Assumptions | Pre-Lecture | `NotebookUnit.markdown` | Markdown Unit |
| 7 | Canonical Academic References | Pre-Lecture | `AcademicSubchapter.sourceRefIds` | Source Registry |
| 8 | Rigorous Academic Definition | Teori Formal | `NotebookDefinitionUnit.definition` | Definition Card |
| 9 | Intuitive Everyday Analogy | Intuisi | `NotebookDefinitionUnit.analogy` | Definition Card |
| 10 | Formal Mathematical Notation | Teori Formal | `NotebookFormulaUnit.latex` | KaTeX Formula Card |
| 11 | Formula Derivation & Context | Teori Formal | `NotebookFormulaUnit.derivation` | Formula Card |
| 12 | Variables Dictionary Table | Teori Formal | `NotebookFormulaUnit.variables` | Variable Table |
| 13 | Step-by-Step Hand Calculation | Komputasi Manual | `NotebookFormulaUnit.stepByStep` | Formula Card |
| 14 | Misconceptions & Anti-Patterns | Teori Kritis | `NotebookDefinitionUnit.misconceptions`| Definition Card |
| 15 | Engineering / Business Context | Terapan | `NotebookCodeUnit.explanation` | Code Cell Header |
| 16 | Executable Production Code | Komputasi | `NotebookCodeUnit.code` | Monospace Code Cell |
| 17 | Execution Provenance Bar | Validasi Mesin | `NotebookOutputUnit.evidence` | Output Cell Header |
| 18 | Captured Monospace Output | Validasi Mesin | `NotebookOutputUnit.output` | Monospace Output |
| 19 | Structured Interpretation | Analisis Data | `NotebookInterpretationUnit.observations`| Interpretation Card |
| 20 | Statistical / Scientific Caveats | Analisis Data | `NotebookInterpretationUnit.caveats` | Interpretation Card |
| 21 | Big-O Complexity Profile | Rekayasa | `NotebookCodeUnit.complexity` | Code Cell Metadata |
| 22 | Failure Modes & Mitigations | Rekayasa | `NotebookCodeUnit.failureModes` | Code Cell Footer |
| 23 | Architectural Best Practices | Rekayasa | `NotebookWarningUnit.severity='tip'` | Warning Card |
| 24 | Critical Severity Alert | Rekayasa | `NotebookWarningUnit.severity='danger'` | Warning Card |
| 25 | Production Countermeasure | Rekayasa | `NotebookWarningUnit.countermeasure` | Warning Card |
| 26 | Progressive Practice Exercises | Evaluasi | `NotebookExerciseUnit.difficulty` (1–5) | Exercise Card |
| 27 | Diagnostic Starter Code | Evaluasi | `NotebookExerciseUnit.starterCode` | Exercise Card |
| 28 | Progressive Hints Accordion | Bimbingan | `NotebookExerciseUnit.hints` | Exercise Card |
| 29 | Verified Model Solution | Evaluasi | `NotebookExerciseUnit.solution` | Solution Modal/Drawer |
| 30 | Analytic Grading Rubric | Evaluasi | `NotebookExerciseUnit.rubric` | Rubric Table |
| 31 | End-to-End Capstone Project | Sintesis | `NotebookProjectUnit` | Project Milestone Card |

---

## 4. Spesifikasi 12 Tipe Notebook Unit

### 4.1 `NotebookMarkdownUnit`
- **Tujuan**: Narasi akademik, penjelasan intuisi, pengantar bab, transisi pedagogis, ringkasan akhir.
- **Payload**: `content: string` (Markdown standar mendukung sub-headings, lists, quotes, inline code).

### 4.2 `NotebookDefinitionUnit`
- **Tujuan**: Mendefinisikan konsep, ontologi, atau hukum ilmiah secara formal dan intuitif.
- **Komponen**:
  - `term`: Nama terminologi.
  - `definition`: Definisi akademik baku sesuai standar ISO/IEEE/Buku Teks.
  - `analogy`: Analogi konkret kehidupan nyata non-teknis.
  - `mathematicalBasis`: Rumusan matematika atau relasi relasional jika relevan.
  - `misconceptions`: Array string berisi kesalahpahaman umum yang sering dilakukan praktisi.

### 4.3 `NotebookFormulaUnit`
- **Tujuan**: Menampilkan formulasi matematis lengkap dengan penurunan dan kamus variabel.
- **Komponen**:
  - `title`: Nama rumus / teorema.
  - `latex`: String LaTeX/KaTeX murni (misal: $\tau^* = \frac{C_{FP}}{C_{FP} + C_{FN}}$).
  - `derivation`: Penjelasan langkah penurunan matematis dari aksioma dasar.
  - `variables`: Array objek `{ symbol, name, description, unit }`.
  - `stepByStep`: Simulasi perhitungan numerik langkah demi langkah dengan angka konkret.

### 4.4 `NotebookExampleUnit`
- **Tujuan**: Contoh studi kasus skenario industri atau dunia nyata.
- **Komponen**: `scenario`, `approach`, `outcome`, `takeaways`.

### 4.5 `NotebookCodeUnit`
- **Tujuan**: Code cell runnable yang siap dieksekusi di notebook/terminal.
- **Komponen**:
  - `language`: 'python' | 'typescript' | 'sql' | 'r' | 'bash'.
  - `cellNumber`: Penomoran interaktif ala Colab/Jupyter (`[In 1]`, `[In 2]`, dst).
  - `title`: Judul fungsional kode.
  - `explanation`: Konsep dan arsitektur kode sebelum pembaca melihat sintaks.
  - `code`: Raw code string (tipe data eksplisit, docstrings PEP 257, komentar modular).
  - `dependencies`: Daftar pustaka luar (contoh: `numpy>=1.26`, `pandas>=2.2`, `scikit-learn>=1.4`).
  - `complexity`: `{ time: string, space: string }` (analisis Big-O asimtotik).
  - `failureModes`: Risiko kegagalan sistemik (edge cases, NaN inputs, OOM) dan penanganannya.

### 4.6 `NotebookOutputUnit`
- **Tujuan**: Output cell autentik yang dipasangkan tepat setelah code cell (`[Out 1]`).
- **Komponen**:
  - `cellNumber`: Pasangan nomor cell input (`[Out 1]`).
  - `output`: Raw text/ASCII terminal capture yang identik dengan output eksekusi sebenarnya.
  - `evidence`: Provenance object `{ runtime, executionTimeMs, timestamp, exitCode }`.

### 4.7 `NotebookInterpretationUnit`
- **Tujuan**: Dekonstruksi empiris terhadap angka dan visualisasi yang dihasilkan di output cell.
- **Komponen**:
  - `headline`: Kesimpulan analitis ringkas (1 kalimat).
  - `observations`: Poin-poin temuan spesifik dari angka di output.
  - `domainImplication`: Makna bisnis, rekayasa, atau sains dari temuan tersebut.
  - `caveats`: Keterbatasan statistik, asumsi distribusi, dan bias instrumen.

### 4.8 `NotebookWarningUnit`
- **Tujuan**: Alert dan callout peringatan praktis atau rekomendasi kritis.
- **Komponen**:
  - `severity`: `'tip'` | `'info'` | `'warning'` | `'danger'`.
  - `title`: Judul peringatan.
  - `description`: Penjelasan mendalam mengenai bahaya teknis/metodologis.
  - `countermeasure`: Rekayasa proteksi atau pencegahan konkret yang harus diterapkan.

### 4.9 `NotebookExerciseUnit`
- **Tujuan**: Latihan terstruktur Level 1–5 dengan scaffold pedagogis lengkap.
- **Komponen**:
  - `difficulty`: 1 | 2 | 3 | 4 | 5.
  - `prompt`: Instruksi soal berbobot akademik.
  - `starterCode`: Template kode atau boilerplate untuk dikerjakan siswa.
  - `hints`: Petunjuk bertahap (Tier 1 Konseptual, Tier 2 Pseudocode, Tier 3 Library).
  - `solution`: Jawaban model lengkap dengan rasionalisasi arsitektur.
  - `rubric`: Matriks penilaian `{ criterion, points, description }[]`.

### 4.10 `NotebookProjectUnit`
- **Tujuan**: Proyek capstone akhir bab atau studi kasus mini terintegrasi.
- **Komponen**:
  - `title`: Judul proyek industri.
  - `businessContext`: Latar belakang organisasi dan objektif bisnis.
  - `datasetSpecs`: Tabel spesifikasi dataset (sumber, jumlah baris, target variable, lisensi).
  - `milestones`: Tahapan pengerjaan `{ step, title, deliverable, verification }[]`.
  - `acceptanceCriteria`: Kriteria keberhasilan kelulusan proyek.

### 4.11 `NotebookTableUnit`
- **Tujuan**: Tabel data komparasi, taksonomi, atau matriks referensi.
- **Komponen**: `headers: string[]`, `rows: string[][]`, `caption?: string`.

### 4.12 `NotebookImageUnit`
- **Tujuan**: Diagram alur, arsitektur sistem, skema relasional, atau visualisasi analitik.
- **Komponen**: `src: string`, `alt: string`, `caption: string`, `diagramType?: string`.

---

## 5. Mesin Konversi Markdown Backward-Compatibility

Untuk memastikan kompatibilitas penuh dengan sistem legacy Velqora (yang mengonsumsi `content_markdown` untuk text search, legacy readers, dan test validation), modul `src/lib/curriculum/types.ts` menyediakan fungsi konversi otomatis murni:

```typescript
export function notebookUnitsToMarkdown(units: NotebookUnit[]): string
```

### Pemetaan Unit ke Markdown:
1. **`markdown`** $\to$ Direct Markdown passthrough.
2. **`definition`** $\to$ GitHub Alert block `> [!NOTE]` berlabel formal definition, disertai analogi dan misconceptions list.
3. **`formula`** $\to$ Blok LaTeX display `$$...$$`, tabel Markdown variabel, dan langkah perhitungan numerik.
4. **`code`** $\to$ Header metadata `### [In X] {title}`, pre-explanation, blok kode berspesifikasi bahasa, serta detail Big-O complexity & failure modes.
5. **`output`** $\to$ Header metadata `#### [Out X] Execution Output`, provenance footer badge, dan blok output monospace.
6. **`interpretation`** $\to$ Sub-heading analisis empiris, observations list, business implications, dan statistical caveats.
7. **`warning`** $\to$ GitHub Alert block (`> [!TIP]`, `> [!WARNING]`, `> [!CAUTION]`) beserta mitigasi rekayasa.
8. **`exercise`** $\to$ Latihan berlabel difficulty badge Level X, starter code block, collapsible hints `<details>`, model solution, dan tabel kriteria rubrik.
9. **`project`** $\to$ Capstone project guide, dataset specifications table, numbered milestone deliverables, dan acceptance criteria checklist.
10. **`table`** $\to$ Standard GitHub-flavored Markdown table.

---

## 6. Jaminan Kualitas & Invarian

1. **Determinisme**: Setiap `subchapter` memiliki urutan unit yang logis: Konsep $\to$ Teori/Rumus $\to$ Studi Kasus $\to$ Kode $\to$ Output $\to$ Interpretasi $\to$ Peringatan $\to$ Evaluasi.
2. **Ketiadaan Duplikasi Kode**: Script validator `validate-notebook-code.py` menjalankan kode secara mandiri dan menyimpan buktinya ke file JSON yang dapat diverifikasi oleh pipeline CI/CD.
3. **Zero Content Drift**: Jika unit diubah di TypeScript, fungsi `notebookUnitsToMarkdown` otomatis menyegarkan `content_markdown` saat runtime tanpa desinkronisasi.
