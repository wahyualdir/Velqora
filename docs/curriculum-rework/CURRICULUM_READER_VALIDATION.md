# VELQORA — NOTEBOOK READER UX & COMPONENT VALIDATION

**Dokumen**: Validasi Desain Antarmuka, Rendering Notebook, & Responsivitas  
**Versi**: 2.0 (Gold Standard Rebuild)  
**Status**: VERIFIED_WITH_LIMITATIONS  
**Modul Target**: `src/components/modul/notebook/` & `src/components/modul/doc-reader-layout.tsx`

---

## 1. Arsitektur Antarmuka Pembaca (Notebook Reader System)

Sistem pembaca Velqora dirancang untuk memberikan pengalaman membaca yang setara dengan lingkungan komputasi ilmiah modern seperti **Google Colab**, **JupyterLab**, dan **ObservableHQ**, namun dikemas dengan tipografi editorial tingkat buku teks akademik.

### Prinsip Desain UI/UX:
1. **Visual Cadence [In X] / [Out X]**: Pengenalan visual instan bagi praktisi data science melalui badge bernomor konsisten.
2. **Provenance Accountability**: Output tidak pernah tampil mengambang tanpa keterangan lingkungan eksekusi; selalu ada bar metadata runtime (`Python 3.12.10`, durasi `ms`, `Exit 0`).
3. **Scaffolding Tanpa Spoiler**: Latihan komputasional menyembunyikan petunjuk (*hints*) dan solusi model dalam accordion interaktif agar mahasiswa berpikir mandiri terlebih dahulu.
4. **Tipografi & Kontras Ekstrem**: Blok kode dan output menggunakan font monospace modern (`JetBrains Mono` / `Fira Code` fallback) dengan tema gelap kontras tinggi (`bg-zinc-950`), sedangkan penjelasan narasi menggunakan tipografi serif/sans yang nyaman dibaca berjam-jam.

---

## 2. Inventaris Komponen Notebook Reader

| Nama Komponen | File Implementasi | Fitur Kunci & Kontrak Visual |
|---|---|---|
| `NotebookCodeCell` | `notebook-code-cell.tsx` | Badge `[In X]`, judul kode, pre-explanation callout, copy button interaktif, gutter nomor baris, badge dependensi pustaka, badge Big-O (Time/Space), footer mitigasi failure modes. |
| `NotebookOutputCell` | `notebook-output-cell.tsx` | Badge `[Out X]`, header provenance (runtime, execution time, timestamp, exit code badge hijau `Exit 0`), monospace output dengan line wrap & scroll horizontal. |
| `NotebookFormulaCard` | `notebook-formula-card.tsx` | Ikon Sigma, kartu display LaTeX/KaTeX sentral dengan background tint, accordion penurunan rumus, tabel kamus variabel 5 kolom, simulasi perhitungan numerik langkah-demi-langkah. |
| `NotebookExerciseCard`| `notebook-exercise-card.tsx` | Badge Level 1–5 dengan color-coding (Emerald $\to$ Purple), prompt soal, starter code dengan copy button, hints accordion berjenjang (Tier 1–3), model solution toggle, tabel rubrik analitik. |
| `NotebookDefinitionCard` | `notebook-definition-card.tsx` | Border kiri beraksen biru/indigo, definisi formal standar ISO/IEEE, analogi konkret kehidupan sehari-hari, basis matematis, dan daftar kesalahpahaman umum (*misconceptions*). |
| `NotebookInterpretationCard` | `notebook-interpretation-card.tsx` | Callout beraksen amber/cyan, headline analitis 1 kalimat, daftar observasi angka spesifik, implikasi domain bisnis/sains, dan peringatan limitasi statistik (*caveats*). |
| `NotebookWarningCard` | `notebook-warning-card.tsx` | Varian 4 tingkat keparahan (`tip`, `info`, `warning`, `danger`), ikon dinamis (Lucide AlertTriangle/ShieldAlert), deskripsi mendalam bahaya metodologis, countermeasure rekayasa protektif. |
| `NotebookProjectCard` | `notebook-project-card.tsx` | Banner proyek industri, kartu konteks bisnis, tabel spesifikasi dataset riil, checklist milestone deliverable bernomor beserta kriteria verifikasi, checklist kriteria penerimaan akhir. |
| `NotebookTableCard` | `notebook-table-card.tsx` | Tabel responsif berkontur halus (*smooth borders*), zebra-striping, sticky headers, dan caption akademik. |
| `NotebookUnitRenderer` | `notebook-unit-renderer.tsx` | Master dispatcher yang mengorkestrasi ke-12 tipe unit dengan validasi fallback defensif. |

---

## 3. Integrasi Pembaca (`doc-reader-layout.tsx`)

Komponen utama pembaca modul (`src/components/modul/doc-reader-layout.tsx`) telah di-upgrade secara arsitektural:

```tsx
{/* Unit-based Notebook Rendering vs Legacy Markdown Rendering */}
{currentSubchapter?.units && currentSubchapter.units.length > 0 ? (
  <div className="space-y-8">
    {currentSubchapter.learningObjectives && currentSubchapter.learningObjectives.length > 0 && (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 dark:bg-primary/10">
        <h3 className="text-base font-semibold text-primary mb-3">Tujuan Pembelajaran (Bloom's Taxonomy)</h3>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-foreground/90">
          {currentSubchapter.learningObjectives.map((obj, i) => (
            <li key={i}>{obj}</li>
          ))}
        </ul>
      </div>
    )}
    <NotebookUnitRenderer units={currentSubchapter.units} />
  </div>
) : (
  <NoteRenderer content={content} />
)}
```

### Keunggulan Integrasi:
1. **Deteksi Otomatis Transparan**: Jika sebuah subbab memiliki properti `units`, sistem secara otomatis beralih ke engine rendering notebook modern. Jika tidak, sistem tetap menggunakan `NoteRenderer` lama dengan sempurna.
2. **Sinkronisasi Daftar Isi (Table of Contents)**: TOC navigasi di sisi kanan layar secara otomatis membaca judul dari code cells, formula cards, dan headings di dalam notebook units.
3. **Pencarian In-Page**: Siswa dapat mencari teks atau kode di dalam modul dengan akurasi tinggi karena seluruh elemen mempertahankan DOM semantik standar.

---

## 4. Validasi Responsivitas & Aksesibilitas (Cross-Device)

| Perangkat / Resolusi | Status Uji | Perilaku UI yang Diverifikasi |
|---|:---:|---|
| **Desktop Ultra-wide (1920 $\times$ 1080)** | PASS | Layout 3-kolom (Sidebar Kurikulum, Notebook Canvas tengah, Floating TOC kanan). Lebar canvas optimal (850px max) untuk keterbacaan baris teks. |
| **Laptop / Desktop Sedang (1366 $\times$ 768)** | PASS | Sidebar dapat di-collapse, TOC kanan menyesuaikan proporsi, code cell tetap memiliki ruang cukup tanpa wrap paksa. |
| **Tablet (768 $\times$ 1024 / iPad Air)** | PASS | TOC kanan bergeser ke drawer/accordion atas. Tabel variabel dan kamus data mengaktifkan horizontal scrollbar halus. |
| **Mobile Smartphone (375 $\times$ 667 / iPhone SE)** | PASS | Full responsive single-column layout. Gutter nomor baris kode tetap presisi, badge `[In X]` dan `[Out X]` mengecil proporsional, font mono 12px terbaca tajam tanpa zoom manual. |

---

## 5. Kesimpulan Validasi

Antarmuka pembaca notebook Velqora berhasil memenuhi standar estetika dan fungsionalitas tinggi:
- Rendering LaTeX/KaTeX tajam dan rapi tanpa overflow horizontal.
- Interaksi copy-to-clipboard responsif dengan umpan balik visual instan.
- Transisi antara code cell `[In X]` dan output cell `[Out X]` terasa kohesif layaknya notebook komputasi nyata.
