# VELQORA — PHASE 2.2.1: AUDIT ANTARMUKA PEMBACA (READER) & PENGALAMAN PENGGUNA (UX)

> **Dokumen Deliverable**: `docs/curriculum-rework/PHASE_2_2_1_READER_UX_AUDIT.md`  
> **Status Audit**: AUDITED & TESTED (Evaluasi Komponen `DocReaderLayout`, `NoteRenderer`, dan Perilaku Runtime Browser)  
> **Komponen Sasaran**: `src/app/dashboard/modul/kategori/[id]/page.tsx`, `src/components/modul/doc-reader-layout.tsx`, `src/components/notes/note-renderer.tsx`  
> **Tanggal Pelaksanaan**: 2026-09-16  

---

## 1. Matriks Evaluasi Pengalaman Pengguna (UX Audit Matrix)

| Fitur / Komponen UX | Status Teknis | Evaluasi Kinerja & Skalabilitas | Rekomendasi Remediasi |
|---|---|---|---|
| **Navigasi 40.500 Unit** | `CRITICAL_FAILURE` | **40.500 unit sub-subbab TIDAK DAPAT DINAVIGASI**. Sidebar reader hanya memiliki 2 tingkat hierarki (Bab & Subbab). Unit Level 3 tidak pernah dirender di sidebar maupun di panel baca utama. | Tambahkan hierarki Level 3 accordion atau gabungkan isi unit langsung ke dalam dokumen subbab. |
| **Pencarian Sidebar (Search)** | `ADEQUATE_LIMITED` | Input pencarian bekerja cepat secara client-side, namun hanya mencocokkan judul Bab dan Subbab. Konten mendalam dan rumus matematika di dalam materi tidak terindeks pencarian. | Integrasikan pencarian berbasis full-text search atau MiniSearch untuk mencari ke dalam body markdown. |
| **Daftar Isi In-Page (TOC)** | `VERIFIED` | Kolom kanan mengekstrak H2 dan H3 menggunakan regex dan ScrollSpy aktif memantau posisi scroll pembaca dengan mulus. | Pertahankan. |
| **Breadcrumbs & Hirarki** | `VERIFIED` | Menampilkan alur logis: `Dashboard > Modul > {Kategori} > {Bab} > {Subbab}`. | Pertahankan. |
| **Navigasi Previous / Next** | `VERIFIED` | Tombol Sebelumnya / Selanjutnya di kaki artikel memindahkan state `selectedId` secara sekuensial pada daftar `flatSections`. | Pertahankan. |
| **Deep-Link & URL State** | `DEFECT_FOUND` | URL browser hanya berhenti pada ID kategori (`/dashboard/modul/kategori/machine-learning`). Me-refresh browser atau membagikan tautan selalu me-reset bacaan ke bab pertama (tidak ada `?section=...` atau hash `#...`). | Sinkronkan `selectedId` ke query parameter URL (`?section=...`) agar pengguna dapat membagikan tautan ke materi spesifik. |
| **State Awal Accordion** | `PERFORMANCE_RISK` | Kode secara eksplisit mengatur `init[sec.id] = true` untuk seluruh bab saat inisialisasi. Pada topik 22 bab (Topic 19), 220 link subbab dibuka sekaligus di DOM, memberatkan browser perangkat rendah. | Ubah default agar hanya bab pertama atau bab yang sedang aktif yang terbuka (*lazy accordion expansion*). |
| **Rendering Formula KaTeX** | `VERIFIED` | `NoteRenderer` memuat `remarkMath` dan `rehypeKatex` beserta stylesheet `katex.min.css`. Formula blok `$$` dan inline `$` ter-render dengan tipografi tajam. | Pertahankan. |
| **Rendering Kode & Sintaks** | `VERIFIED` | `CodeBlock` merender penyorotan sintaks Python/SQL dengan nomor baris dan tombol copy fungsional. | Pertahankan. |
| **Tautan Eksternal (Security)**| `VERIFIED` | Seluruh tautan sitasi menggunakan atribut pengaman standar: `target="_blank"` dan `rel="noopener noreferrer"`. | Pertahankan. |
| **Responsivitas Mobile (<768px)**| `ADEQUATE` | Sidebar bertransformasi menjadi slide-over drawer dengan tombol pemicu mengambang. Navigasi lancar namun daftar 220 link terasa sangat panjang saat di-scroll di ponsel. | Tambahkan opsi pencarian yang tetap menempel (*sticky search*) di drawer mobile. |
| **Ukuran Bundle & Tree-Shaking**| `WARNING` | File topik 19 berukuran 2.43 MB. Karena seluruh 28 topik diimpor secara statis di `registry.ts`, seluruh data kurikulum (~30 MB teks) dimuat ke memori tanpa dynamic code-splitting. | Terapkan dynamic `import()` per topik agar data topik hanya diunduh saat pengguna membuka kategori tersebut. |

---

## 2. Investigasi Mendalam: Mengapa 40.500 Unit "Hilang" di UI?

Pada `src/lib/curriculum/types.ts`, konversi kurikulum dilakukan melalui:
```typescript
export function curriculumToDocSectionItems(curriculum: AcademicCurriculum): DocSectionItem[] {
  return curriculum.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    subsections: chapter.subchapters.map((sub) => ({
      id: sub.id,
      title: sub.title,
      subsections: (sub.subSubchapters || []).map((unit) => ({ ... })) // LEVEL 3
    }))
  }));
}
```
Namun pada komponen antarmuka `src/components/modul/doc-reader-layout.tsx` (baris 556–648):
- Loop Level 1: `filteredSections.map((chapter) => ...)`
- Loop Level 2: `chapter.subsections!.map((sub) => ...)`
- **Loop Level 3**: **TIDAK ADA**. Komponen antarmuka tidak pernah merender `sub.subsections`.

Dan saat subbab diklik, baris 242 merender:
```tsx
currentSection.content_markdown
```
String `content_markdown` dari subbab hanya memuat ringkasan subbab ~300 kata, dan sama sekali tidak menyertakan teks dari 10 unit `subSubchapters`-nya.

**Konsekuensi Praktis**:
Klaim bahwa *"Velqora memiliki 40.500 sub-subbab materi yang dapat dipelajari pengguna"* tidak terbukti di lapangan: pengguna yang membuka browser sama sekali tidak dapat melihat atau membaca 40.500 unit tersebut karena UI tidak merendernya.

---

## 3. Rekomendasi Remediasi Antarmuka & UX

1. **Sinkronisasi Teks Unit ke Teks Subbab**:
   Gabungkan isi unit ke dalam tampilan subbab utama (sebagai seksi H3 bertahap) sehingga seluruh materi yang telah disusun dapat dibaca langsung oleh mahasiswa.
2. **Implementasikan URL Query Persistence**:
   Gunakan `window.history.replaceState` atau router Next.js untuk memperbarui query string:
   `/dashboard/modul/kategori/machine-learning?chapter=1&section=1-2`
   sehingga posisi belajar tersimpan saat refresh atau dibagikan ke teman.
3. **Tutup Accordion Bab Non-Aktif**:
   Ubah state awal agar hanya bab yang sedang dibaca yang terbuka, menghemat memori DOM hingga 90% pada perangkat seluler.
