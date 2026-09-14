# PANDUAN STANDAR OPERASIONAL PROSEDUR (SOP): IMPOR MODUL & KURIKULUM VELQORA

Dokumen ini merupakan panduan resmi standar pembuatan, ekstraksi, dan impor modul pembelajaran (PDF, dokumen teknis, silabus praktikum) ke dalam platform **Velqora**.

Setiap kali modul baru dikirimkan untuk diintegrasikan ke dalam web Velqora, proses pengolahan dan migrasi **WAJIB** mematuhi seluruh aturan yang tercantum di bawah ini.

---

## 1. Filosofi & Prinsip Utama: 100% Completeness & Zero Truncation

Pengguna menetapkan standar baku bahwa materi kurikulum Velqora harus **selengkap mungkin**:
> **"Panjang tidak apa-apa, yang penting kelengkapan dan kesesuaian."**

### 5 Aturan Wajib (Golden Rules):
1. **Dilarang Meringkas Teori**: Penjelasan konsep, latar belakang bisnis, analogi, dan elaborasi teoretis harus disajikan secara mendalam sesuai teks asli dokumen sumber.
2. **Kode Program Verbatim (100% Utuh)**:
   * Nama variabel, fungsi, parameter, logika branching, dan komentar kode (`#`) **tidak boleh diubah atau dipotong**.
   * Jangan mengganti blok kode panjang dengan komentar seperti `# ... kode lainnya ...` atau `# implementasi di sini`. Semua baris wajib ditulis utuh.
3. **Sertakan Kuis & Latihan Soal Lengkap**:
   * Seluruh pertanyaan latihan, soal tantangan coding, dan kuis berganda wajib disertakan.
   * Kunci jawaban, penjelasan solusi, dan rumus perhitungan harus ditulis lengkap di akhir materi bab terkait.
4. **Format Visualisasi & Tabel Standar Markdown**:
   * Data tabular wajib disusun menggunakan tabel GitHub Flavored Markdown yang rapi.
   * Rumus matematika wajib diformat menggunakan sintaks LaTeX (`$...$` untuk inline, `$$...$$` untuk display math).
5. **Gunakan Callout Alerts**:
   * Informasi penting, tips profesional, atau peringatan kesalahan umum wajib dikemas menggunakan GitHub Alerts:
     * `> [!NOTE]` untuk konteks latar belakang dan definisi.
     * `> [!TIP]` untuk *best practices*, pintasan, dan trik performa industri.
     * `> [!IMPORTANT]` untuk aturan wajib atau urutan eksekusi kritis.
     * `> [!WARNING]` untuk kesalahan umum yang sering dilakukan pemula.
     * `> [!CAUTION]` untuk tindakan berisiko tinggi (misal: *data leakage*, kebocoran memori).

---

## 2. Strategi Distribusi Topik (Cross-Curriculum Mapping)

Ketika menerima modul pembelajaran komprehensif yang mencakup beberapa bidang studi sekaligus:

### A. Kriteria Single-Topic vs Cross-Curriculum:
* **Single-Topic**: Jika modul berfokus penuh pada satu bidang spesifik (misalnya buku resmi Scikit-Learn murni), maka seluruh bab dimasukkan ke satu kategori terkait (misal: `Machine Learning`).
* **Cross-Curriculum (Penyebaran Multi-Topik)**: Jika modul komprehensif mencakup materi lintas disiplin (contoh: Modul Data Analytics dengan Python yang memuat bab khusus Machine Learning Churn, Time Series Forecasting, NLP Sentiment Analysis, dan SQL), maka materi **didistribusikan ke kategori masing-masing**:
  1. **Materi Inti (Core Track)** $\longrightarrow$ Masuk ke kategori utama (misal: `Data Analyst`).
  2. **Studi Kasus & Teori Spesialisasi** $\longrightarrow$ Masuk ke kategori yang bersangkutan (misal: `Machine Learning`, `Time Series Forecasting & Anomaly Detection`, `Natural Language Processing`).
  3. **Cross-Referencing** $\longrightarrow$ Sertakan catatan pengantar di awal bab yang menjelaskan hubungan materi tersebut dengan modul asalnya.

---

## 3. Struktur Skema Database Velqora

Materi yang diimpor diintegrasikan ke dalam 4 tabel PostgreSQL Supabase:

### 1. Tabel `notes` (Obsidian-Style Vault & Documentation Reader)
Tempat seluruh materi bab lengkap disimpan dan dibaca di `/dashboard/catatan/[slug]` serta pada tampilan *Documentation Reader* di `/dashboard/modul/kategori/[id]`.
* `title`: Judul lengkap bab (contoh: `'BAB 2: Pandas — Manipulasi & Analisis Data Profesional'`).
* `slug`: Pengenal URL unik yang konsisten (contoh: `'da-bab-2-pandas-manipulasi-analisis-data'`).
* `content_markdown`: Seluruh teks markdown, kode program, tabel, kuis, dan kunci jawaban.
* `icon`: Nama ikon Lucide React (contoh: `'BookOpen'`, `'Brain'`, `'TrendingUp'`, `'MessageSquare'`).
* `order_index`: Urutan bab (0, 1, 2, ...).
* `category_id`: Foreign key ke `categories.id`.
* `is_folder`: `false` untuk catatan konten.
* `created_by`: UUID pengguna pemilik/sistem.

### 2. Tabel `modules` & `module_chapters` (Interactive Modules)
Daftar modul yang muncul pada katalog `/dashboard/modul`:
* `modules`: `title`, `description`, `category_id`, `level`, `tech_stack`, `content_type = 'module'`.
* `module_chapters`: Sub-bab per modul yang menampilkan progres belajar pengguna.

### 3. Tabel `projects` (Capstone Portfolio Showcase)
Studi kasus *real-world end-to-end* yang ada di dalam modul didaftarkan ke tabel `projects` agar dapat diakses di `/dashboard/project`:
* `title`, `description`, `category_id`, `level`, `tech_stack`, `notes`.

---

## 4. Standar Penulisan File Migrasi SQL

Setiap penambahan atau pembaruan modul harus dibuat dalam bentuk file migrasi terstruktur di direktori `supabase/migrations/` (misalnya `022_seed_...sql`):

### Template Blok PL/pgSQL Idempoten:
```sql
DO $SEED_MODUL_NAMA$
DECLARE
  v_user_id UUID;
  v_cat_id UUID;
BEGIN
  -- Dapatkan user_id admin/owner
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'wahyualdiriyanto80@gmail.com' LIMIT 1;
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  END IF;

  -- Dapatkan kategori tujuan
  SELECT id INTO v_cat_id FROM categories WHERE name = '<Nama Kategori>' LIMIT 1;

  -- Insert Note dengan Idempotent Upsert
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    '<Judul Bab>',
    '<slug-unik-bab>',
    $NOTE_TAG$
# Isi Markdown Lengkap
...
    $NOTE_TAG$,
    'BookOpen',
    1,
    v_cat_id,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

END $SEED_MODUL_NAMA$;
```

> [!TIP]
> Selalu gunakan **Dollar Quoting** unik untuk setiap catatan (misal: `$NOTE_BAB_1$`, `$NOTE_BAB_2$`) agar karakter tanda kutip tunggal (`'`) atau ganda (`"`) di dalam kode Python/SQL tidak menyebabkan *syntax error*.

---

## 5. Alur Kerja Impor Modul Baru (SOP Step-by-Step)

```text
1. Bedah Dokumen PDF/Teks Sumber
   └── Ekstraksi teks, kode, studi kasus, dan daftar bab secara utuh.
         │
         ▼
2. Tentukan Matriks Distribusi Kategori
   └── Apakah Single-Topic atau Cross-Curriculum?
         │
         ▼
3. Bangun Script Generator Python (Modular)
   └── Tulis generator bab terpisah untuk menjaga keutuhan data & zero truncation.
         │
         ▼
4. Generate File Migrasi SQL Resmi
   └── Cek dollar quote balancing dan sintaks SQL.
         │
         ▼
5. Daftarkan Entitas Pendukung
   └── Tambahkan entri ke tabel modules, module_chapters, dan projects.
         │
         ▼
6. Verifikasi Frontend & Responsive Layout
   └── Buka /dashboard/modul/kategori/[id] dan /dashboard/catatan/[slug].
```

---

## 6. Checklist Verifikasi Kelayakan Modul (Quality Checklist)

Sebelum tugas impor dinyatakan selesai, lakukan verifikasi terhadap 7 poin berikut:
- [ ] **Kelengkapan Kode:** Tidak ada fungsi yang dipotong (`...` atau `pass` tiruan).
- [ ] **Daftar Bab Terstruktur:** Setiap bab memiliki tujuan pembelajaran, uraian konsep, implementasi kode, dan latihan soal.
- [ ] **Kunci Jawaban:** Latihan soal memiliki pembahasan atau kunci jawaban yang jelas.
- [ ] **Kesesuaian Slug:** Slug bebas karakter aneh, menggunakan huruf kecil dan tanda hubung (`-`).
- [ ] **Idempotensi:** Migrasi aman dijalankan berulang kali tanpa membuat data duplikat (`ON CONFLICT (slug) DO UPDATE`).
- [ ] **Integrasi UI:** Catatan muncul di kategori yang sesuai dan dapat dibaca di pembaca dokumen (Doc Reader) desktop maupun mobile.
- [ ] **Proyek Capstone:** Studi kasus besar terdaftar di tabel `projects`.

---
*Dokumen ini merupakan standar resmi pemeliharaan konten akademik Velqora.*
