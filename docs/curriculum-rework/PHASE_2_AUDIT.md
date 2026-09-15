# VELQORA — PHASE 2: AUDIT LAPORAN REKONSTRUKSI SISTEM KURIKULUM AKADEMIK
**Dokumen Audit Arsitektur, Data, dan Sumber Pembelajaran**  
*Tanggal Audit: 15 September 2026*  
*Auditor: Principal Software Engineer & Academic Curriculum Architect*  
*Repository: [https://github.com/wahyualdir/Velqora.git](https://github.com/wahyualdir/Velqora.git)*  
*Status: Selesai — Baseline Evaluasi & Roadmap Rekonstruksi*

---

## 1. Eksekutif & Temuan Kritis Utama

Berdasarkan audit mendalam terhadap basis kode (*codebase*), skema migrasi Supabase, komponen katalog, server actions, dan mesin *reader*, ditemukan sejumlah permasalahan mendasar yang melatarbelakangi perlunya rekonstruksi total pada Phase 2:

1. **Ilusi Hierarki & Redundansi Generator (*Synthetic Fallback Fallacy*)**:
   - Dari 28 topik Kecerdasan Buatan yang terdaftar pada `SYSTEM_PRIMARY_CATEGORIES`, hanya **Machine Learning** (`scikit-learn-curriculum.ts`) dan **AI Fundamentals** (`ai-fundamentals-curriculum.ts`) yang memiliki struktur subbab otentik berbasis kurikulum resmi.
   - 26 topik lainnya bergantung pada `universal-curriculum-enricher.ts` dan `curriculum-batch*-defaults.ts`. Fungsi `extractSubtopicsFromDescription()` memecah string deskripsi bab berdasarkan tanda koma/titik koma, lalu menghasilkan teks sintetis dan potongan kode mock yang seragam untuk subbab-subbab yang berbeda dalam satu domain.
2. **Kelemahan Seeding Database (Migration 013 s.d. 018)**:
   - Migrasi SQL `013` hingga `018` melakukan *seeding* catatan ke tabel `notes` dengan struktur minimalis: 1 catatan per bab yang hanya berisi 1–2 kalimat ringkasan silabus dan 1 cuplikan kode tiruan (*mock snippet*). Tidak ada subbab nyata yang tersimpan di basis data untuk batch ini.
3. **Bug Perutean Silang Kategori (*Cross-Domain Collision Bug*)**:
   - Pada `src/app/dashboard/modul/kategori/[id]/page.tsx`, terdapat aturan:
     `if (norm.includes("machine learning") || norm.includes("pembelajaran mesin") || norm.includes("scikit"))`
   - Akibatnya, topik **"AI Security & Adversarial Machine Learning"** secara keliru tertangkap oleh filter ini dan menampilkan modul *Scikit-Learn Machine Learning User Guide* (22 bab) alih-alih kurikulum keamanan AI (*Adversarial Robustness, FGSM, PGD, Poisoning*).
4. **Masalah Navigasi ID Internal / UUID**:
   - Jika pengguna membuka kategori lewat kartu katalog yang terhubung ke record database (`dbCat.id`), rute URL menggunakan format `/dashboard/modul/kategori/<UUID>`. Jika record kategori di database memiliki nama yang tidak konsisten atau slug yang hilang, antarmuka rentan menampilkan judul kosong atau ID teknis di breadcrumb jika fallback tidak menanganinya secara deterministik.
5. **Ketiadaan Sumber Rujukan Akademik Sah**:
   - Modul-modul fallback tidak menyertakan rujukan primer (*verifiable citations*) seperti DOI paper, bab buku teks standar (AIMA, Sutton & Barto, Goodfellow, dsb.), tautan repositori dataset publik resmi, maupun silabus universitas rujukan (MIT OCW, Stanford, Berkeley).

---

## 2. Arsitektur Kurikulum Saat Ini

### 2.1 Alur Data (Data Flow Pipeline)
```
[User Akses Katalog: /dashboard/modul]
       │
       ▼
[src/app/dashboard/modul/page.tsx]
       │
       ├── getModules() ───────────► Ambil modul kustom pengguna dari tabel `modules`
       ├── getCategories() ────────► Ambil data kategori dari tabel `categories`
       └── aiTopicOverview ────────► Iterasi 28 topik dari SYSTEM_PRIMARY_CATEGORIES
                                     (Menghitung jumlah materi via getDefaultAiSections)
       │
       ▼ (Klik Kartu Kategori)
[User Akses Reader: /dashboard/modul/kategori/[id]]
       │
       ├── getCategoryDetails(id) ─► Pencarian di tabel `categories` atau SYSTEM_PRIMARY_CATEGORIES
       ├── getModules(category) ───► Modul pengguna yang sesuai
       ├── getNotesByCategory(id) ─► Catatan kurikulum dari tabel `notes`
       │
       ▼
[Logika Resolusi allTopicNotes & docSections]
       │
       ├── 1. Khusus "Machine Learning" ─────────► SCIKIT_LEARN_USER_GUIDE_SECTIONS (22 Bab, 58 Subbab)
       ├── 2. Khusus "AI Fundamentals" ──────────► AI_FUNDAMENTALS_CHAPTERS (5 Bab, 26 Subbab)
       ├── 3. Jika vaultNotes ada di DB ─────────► Ekstraksi subbab via regex ## dari markdown catatan
       └── 4. Fallback Default ──────────────────► enrichCurriculumToDocSections(getDefaultSections(cat))
                                                   (Programmatic heuristic generator)
       │
       ▼
[DocReaderLayout Component]
       │
       ├── Sidebar Navigasi (Accordion Bab & Subbab)
       ├── In-Page Table of Contents (ScrollSpy H2 & H3)
       ├── Study Action Toolbar (AI Tutor, Kuis AI, Playground, Salin Tautan)
       └── NoteRenderer (ReactMarkdown + remarkMath + rehypeKatex + CodeBlock)
```

---

## 3. Matriks Audit 28 Topik Kurikulum

Berikut adalah hasil audit status kurikulum untuk seluruh 28 topik Kecerdasan Buatan pada basis kode saat ini:

| No | Nama Topik Kurikulum | Status Saat Ini | Sumber Data Aktif | Bab | Subbab Nyata | Status Kode Python | Rujukan Akademik Sah | Masalah yang Ditemukan |
|:---|:---|:---|:---|:---:|:---:|:---|:---|:---|
| 01 | **AI Agent** | Fallback | `curriculum-batch1-defaults.ts` + Enricher | 14 | 0 (Sintetis) | Mock snippet sederhana | Tidak ada | Kode berupa pseudo-lambda tanpa parsing ReAct nyata, subbab digenerate sintetis |
| 02 | **AI Ethics & Responsible AI** | Fallback | `curriculum-batch1-defaults.ts` + Enricher | 12 | 0 (Sintetis) | Konsep teks, tanpa runnable | Tidak ada | Memerlukan studi kasus audit bias matematis (Disparate Impact, Equalized Odds) |
| 03 | **AI Governance & Regulasi** | Fallback | `curriculum-batch1-defaults.ts` + Enricher | 12 | 0 (Sintetis) | Matriks kebijakan | Tidak ada | Tanpa rujukan NIST AI RMF atau EU AI Act |
| 04 | **AI Security & Adversarial ML** | **SALAH RUTE** | `scikit-learn-curriculum.ts` (Collision) | 22 | 58 (ML) | Kode ML Scikit-Learn | Scikit-Learn | **Kritis**: Masuk ke materi Machine Learning umum karena filter string `norm.includes("machine learning")` |
| 05 | **AI Fundamentals** | **VALID (Pilot)** | `ai-fundamentals-curriculum.ts` | 5 | 26 | 100% Runnable (BFS, A*, Rule Engine) | Russell & Norvig, MIT OCW, Stanford | Telah direkonstruksi pada pilot Phase 2C/2D |
| 06 | **AutoML & NAS** | Fallback | `curriculum-batch2-defaults.ts` + Enricher | 10 | 0 (Sintetis) | Mock search | Tidak ada | Tidak ada integrasi Optuna nyata atau bukti matematis Bayesian Optimization |
| 07 | **Computational Intelligence** | Fallback | `curriculum-batch2-defaults.ts` + Enricher | 10 | 0 (Sintetis) | Mock fuzzy/genetic | Tidak ada | Tidak ada solver PSO atau algoritma genetika lengkap |
| 08 | **Computer Vision** | Fallback | `curriculum-batch2-defaults.ts` + Enricher | 14 | 0 (Sintetis) | OpenCV mock filter | Tidak ada | Tidak ada perumusan konvolusi matematis formal, arsitektur ResNet/YOLO/U-Net |
| 09 | **Data Analyst** | DB Notes / Fallback | `022_seed_...sql` + Enricher | 14 | Parse ## | Pandas/SQL query | Kaggle Telco Churn | Materi DB kaya namun memerlukan standardisasi bab-subbab modular TS |
| 10 | **Data Engineering & Big Data AI** | Fallback | `curriculum-batch2-defaults.ts` + Enricher | 12 | 0 (Sintetis) | Mock ETL loop | Tidak ada | Tidak ada arsitektur Lakehouse Parquet riil atau streaming PySpark |
| 11 | **Data Science** | Fallback | `curriculum-batch3-defaults.ts` + Enricher | 16 | 0 (Sintetis) | NumPy/Pandas umum | Tidak ada | Kurikulum generik tumpang tindih dengan Machine Learning |
| 12 | **Deep Learning** | Fallback | `curriculum-batch3-defaults.ts` + Enricher | 15 | 0 (Sintetis) | Perceptron mock | Tidak ada | Tanpa penurunan kalkulus backpropagation PyTorch formal dan arsitektur modern |
| 13 | **Edge AI & TinyML** | Fallback | `curriculum-batch3-defaults.ts` + Enricher | 12 | 0 (Sintetis) | Mock quantization | Tidak ada | Tanpa formulasi kuantisasi INT8 PTQ/QAT riil |
| 14 | **Expert System** | Fallback | `curriculum-batch3-defaults.ts` + Enricher | 9 | 0 (Sintetis) | If-else sederhana | Tidak ada | Tidak ada model faktor kepastian (*Certainty Factors*) Shortliffe |
| 15 | **Generative AI** | Fallback | `curriculum-batch3-defaults.ts` + Enricher | 14 | 0 (Sintetis) | Prompt engineering mock | Tidak ada | Tanpa formulasi matematis VAE (ELBO) atau Diffusion (DDPM) |
| 16 | **Graph Neural Network (GNN)** | Fallback | `curriculum-batch4-defaults.ts` + Enricher | 11 | 0 (Sintetis) | Mock matriks ketetanggaan | Tidak ada | Tanpa perumusan Message Passing Neural Network (MPNN) |
| 17 | **Knowledge Representation** | Fallback | `curriculum-batch4-defaults.ts` + Enricher | 10 | 0 (Sintetis) | Mock graf asosiasi | Tidak ada | Tanpa RDF triples, SPARQL, atau ontologi OWL resmi |
| 18 | **Large Language Model** | Fallback | `curriculum-batch4-defaults.ts` + Enricher | 15 | 0 (Sintetis) | Mock transformer call | Tidak ada | Tanpa formulasi self-attention $\mathcal{O}(n^2)$, BPE tokenizer, LoRA |
| 19 | **Machine Learning** | **VALID** | `scikit-learn-curriculum.ts` (Chapters 1–22) | 22 | 58 | Scikit-Learn 1.9 lengkap | Scikit-Learn User Guide | Lengkap, namun perlu diproteksi dari tabrakan nama dengan AI Security |
| 20 | **MLOps & AI Deployment** | Fallback | `curriculum-batch4-defaults.ts` + Enricher | 14 | 0 (Sintetis) | Mock deployment print | Tidak ada | Tanpa pipeline FastAPI/Docker/MLflow yang siap uji |
| 21 | **Multimodal AI** | Fallback | `curriculum-batch5-defaults.ts` + Enricher | 10 | 0 (Sintetis) | Mock multimodal join | Tidak ada | Tanpa arsitektur CLIP contrastive loss matematis |
| 22 | **Natural Language Processing** | Fallback | `curriculum-batch5-defaults.ts` + Enricher | 14 | 0 (Sintetis) | String split mock | Tidak ada | Tanpa n-gram, Word2Vec, TF-IDF vektorisasi, dan evaluasi BLEU |
| 23 | **Recommendation System** | Fallback | `curriculum-batch5-defaults.ts` + Enricher | 12 | 0 (Sintetis) | Mock cosine similarity | Tidak ada | Tanpa perumusan Matrix Factorization SVD atau metrik NDCG |
| 24 | **Reinforcement Learning** | Fallback | `curriculum-batch5-defaults.ts` + Enricher | 13 | 0 (Sintetis) | Mock Q-table update | Tidak ada | Tanpa Bellman Equation formal, Policy Gradients (PPO), Gymnasium |
| 25 | **Robotics & Embodied AI** | Fallback | `curriculum-batch5-defaults.ts` + Enricher | 13 | 0 (Sintetis) | Mock PID loop | Tidak ada | Tanpa transformasi koordinat DH (Denavit-Hartenberg) atau SLAM |
| 26 | **Speech & Audio AI** | Fallback | `curriculum-batch6-defaults.ts` + Enricher | 12 | 0 (Sintetis) | Mock audio array | Tidak ada | Tanpa transformasi STFT, filterbank Mel, atau CTC loss |
| 27 | **Time Series Forecasting** | Fallback | `curriculum-batch6-defaults.ts` + Enricher | 12 | 0 (Sintetis) | Mock moving average | Tidak ada | Tanpa uji stasioneritas ADF formal atau dekomposisi ARIMA |
| 28 | **Vector Database & Retrieval** | Fallback | `curriculum-batch6-defaults.ts` + Enricher | 11 | 0 (Sintetis) | Mock list scan | Tidak ada | Tanpa algoritma HNSW graph traversal riil atau IVF-PQ |

---

## 4. Analisis Masalah Khusus

### 4.1 Identifikasi Collision Routing pada Reader
Pada `src/app/dashboard/modul/kategori/[id]/page.tsx`:
```typescript
// KONDISI SAAT INI (BERMASALAH):
if (norm.includes("machine learning") || norm.includes("pembelajaran mesin") || norm.includes("scikit")) {
  return SCIKIT_LEARN_USER_GUIDE_SECTIONS;
}
```
Ketika `categoryId` atau nama kategori adalah:
`"AI Security & Adversarial Machine Learning"`
Nilai `norm.includes("machine learning")` bernilai **true**! Akibatnya modul keamanan AI menampilkan materi regresi linear dan Scikit-Learn!
**Solusi Teknis:**
Pemeriksaan harus menggunakan pencocokan ketat (*exact match*) atau mengecualikan secara eksplisit kata `"security"` dan `"adversarial"`:
```typescript
const isPureMachineLearning = (
  (norm === "machine learning" || norm === "pembelajaran mesin" || norm.startsWith("scikit")) &&
  !norm.includes("security") &&
  !norm.includes("adversarial")
);
```

### 4.2 Masalah Tampilan UUID pada Breadcrumb & Judul
Ketika kategori dibuka via ID dari basis data (UUID), fungsi `getCategoryDetails(decodedId)` mengembalikan entitas kategori. Namun jika data kategori belum pernah dibuat di database untuk pengguna tertentu, `loadData()` melakukan fallback ke `SYSTEM_PRIMARY_CATEGORIES`.
Jika URL yang diakses adalah UUID yang *tidak dikenal* di database maupun preset, sistem menetapkan:
`name: decodedId` (yang merupakan string UUID teknis!), menyebabkan breadcrumb menampilkan UUID panjang alih-alih nama modul manusiawi.
**Solusi Teknis:**
Sanitasi wajib dilakukan di `loadData()` dan `DocReaderLayout`. Jika string adalah format UUID dan tidak ditemukan namanya, sistem harus me-resolve ke kategori terdekat atau menampilkan nama topik default yang bersih.

### 4.3 Keterbatasan Runner Kode Python di Antarmuka
Saat ini:
- `NoteRenderer` menyajikan blok kode dengan tombol *Copy Code* yang berfungsi baik.
- Terdapat halaman `/dashboard/playground` yang mendukung eksekusi kode Python interaktif (via Pyodide / Worker Web).
- Namun tombol pada Reader sebelumnya belum menghubungkan potongan kode subbab langsung ke Playground dengan *pre-filled code*.
- Diperlukan integrasi di mana tombol *Playground* dapat membawa kode subbab aktif ke ruang eksekusi.

---

## 5. Rencana Arsitektur Rekonstruksi Kurikulum (Phase 2)

### 5.1 Struktur Direktori Kurikulum Modular
Untuk memastikan setiap topik memiliki modul TypeScript mandiri, terstruktur, bebas duplikasi, dan memiliki tipe data yang kuat, kurikulum akan ditempatkan pada:
```
src/lib/curriculum/
├── types.ts                     # Definisi tipe kurikulum akademik resmi (AcademicCurriculum, Chapter, Subchapter, Citation)
├── registry.ts                  # Single source of truth index untuk seluruh 28 topik AI
├── topics/
│   ├── 01-ai-agent.ts
│   ├── 02-ai-ethics.ts
│   ├── 03-ai-governance.ts
│   ├── 04-ai-security.ts
│   ├── 05-ai-fundamentals.ts   # Integrasi pilot Russell & Norvig
│   ├── 06-automl-nas.ts
│   ├── 07-computational-intelligence.ts
│   ├── 08-computer-vision.ts
│   ├── 09-data-analyst.ts
│   ├── 10-data-engineering-ai.ts
│   ├── 11-data-science.ts
│   ├── 12-deep-learning.ts
│   ├── 13-edge-ai-tinyml.ts
│   ├── 14-expert-system.ts
│   ├── 15-generative-ai.ts
│   ├── 16-graph-neural-network.ts
│   ├── 17-knowledge-representation.ts
│   ├── 18-large-language-model.ts
│   ├── 19-machine-learning.ts   # Integrasi Scikit-Learn 1.9
│   ├── 20-mlops-deployment.ts
│   ├── 21-multimodal-ai.ts
│   ├── 22-natural-language-processing.ts
│   ├── 23-recommendation-system.ts
│   ├── 24-reinforcement-learning.ts
│   ├── 25-robotics-embodied-ai.ts
│   ├── 26-speech-audio-ai.ts
│   ├── 27-time-series-forecasting.ts
│   └── 28-vector-database-retrieval.ts
└── labs/                        # Script Python murni untuk verifikasi komputasi algoritma
    ├── search_algorithms.py
    ├── computer_vision_filters.py
    ├── nlp_tokenizers.py
    └── ...
```

### 5.2 Standar Akademik Setiap Subbab
Setiap subbab wajib memenuhi schema:
1. `id`: Identifier unik bertingkat (misal: `cv-bab-3-2`).
2. `title`: Judul spesifik keilmuan (misal: `3.2. Ekstraksi Fitur Tepi dengan Operator Sobel & Canny`).
3. `orderIndex`: Urutan pedagogis dalam bab.
4. `description`: Ringkasan esensi materi 1–2 kalimat.
5. `content_markdown`: 
   - Tujuan Pembelajaran (*Learning Outcomes*).
   - Prasyarat Konsep.
   - Landasan Teori & Definisi Matematis ($\LaTeX$ formal).
   - Analisis Kompleksitas Waktu & Memori.
   - Implementasi Kode Python 100% *Runnable* (import jelas, tanpa API key rahasia).
   - Latihan Soal Mandiri & Studi Kasus Rekayasa.
   - Referensi Akademik Sah (Buku teks, Paper arXiv/IEEE, Dokumentasi resmi).

---

## 6. Penilaian Risiko & Strategi Perlindungan Data Pengguna

| Risiko Potensial | Tingkat Bahaya | Dampak Terhadap Sistem | Strategi Mitigasi / Perlindungan |
|:---|:---|:---|:---|
| **Kehilangan Modul/Proyek Pengguna** | **Tinggi** | Modul kustom yang dibuat mahasiswa di `/dashboard/modul/baru` terhapus | Modul resmi disediakan via TypeScript Registry andalan yang tidak menimpa tabel `modules` pengguna. Data kustom di tabel `modules` tetap utuh 100%. |
| **Kehilangan Catatan Pribadi (Notes)** | **Tinggi** | Catatan pribadi yang dibuat mahasiswa di `/dashboard/catatan` terhapus | Tidak melakukan `TRUNCATE notes`. Seeding hanya menargetkan slug resmi sistem, catatan milik `user_id` nyata tidak disentuh. |
| **Kerusakan Bookmark Mahasiswa** | **Sedang** | Tautan bookmark mahasiswa mengarah ke 404 | URL slug dipertahankan stabil dan backward-compatible dengan skema ID yang sudah ada. |
| **Regresi Test Suite (29 Suites)** | **Tinggi** | Build error atau fitur penjadwalan & konversi terganggu | Melakukan validasi `npx tsc --noEmit` dan `npm test` di setiap tahapan rekonstruksi. |

---

## 7. Roadmap Eksekusi Bertahap (Next Steps)

1. **Tahap 1: Fondasi Arsitektur & Perbaikan Router**:
   - Memperbaiki bug tabrakan nama Machine Learning vs AI Security pada `page.tsx`.
   - Membuat `src/lib/curriculum/types.ts` dan `src/lib/curriculum/registry.ts`.
2. **Tahap 2: Rekonstruksi Kurikulum 28 Topik secara Terstruktur**:
   - Menghubungkan 28 berkas topik akademik dengan kurikulum mendalam, formula $\LaTeX$, dan kode Python.
3. **Tahap 3: Verifikasi Kode Python Algoritma & Unit Test Suite**:
   - Membangun test suite `tests/curriculum/all-topics.test.ts` untuk memastikan 28 topik terdaftar, memiliki subbab valid, formula matematis, dan kode *runnable*.
4. **Tahap 4: Dokumentasi & Final Report**:
   - Menyusun `docs/curriculum-rework/PHASE_2_IMPLEMENTATION.md` dan `docs/curriculum-rework/PHASE_2_CONTENT_AUDIT.md`.
