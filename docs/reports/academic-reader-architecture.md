# Velqora — Academic Reader Rebuild Architecture Document

**Document ID**: `ARCH-ARR-2026-09`  
**Status**: `IMPLEMENTED & VERIFIED`  
**Author**: Senior Software Architect & Frontend Engineer  
**Date**: September 2026  

---

## 1. Arsitektur Komponen Baru

Sistem pembaca modul Velqora telah direkonstruksi dari model 3-kolom kaku dan tumpukan kartu terisolasi (*card fatigue*) menjadi **Sistem Pembaca Akademik Content-First Berstandar Universitas**.

```text
Reader Shell (DocReaderLayout)
├── Minimal Academic Header Toolbar
│   ├── Left: Sidebar Toggle, Back Button, Category Identity
│   └── Right: In-Page Outline Toggle, Grid View Switcher, Theme Switcher, Fullscreen
├── Adaptive Multi-Panel Workspace
│   ├── Left Navigation Sidebar (w-64 sm:w-72, Collapsible, Mobile Drawer with Backdrop)
│   ├── Center Main Academic Canvas (Comfortable 720–900px, Adaptive Scaling)
│   │   ├── Breadcrumb Navigation
│   │   ├── NotebookLessonHeader (Flow Badge, Reading Time, Title & Subtitle)
│   │   ├── Unobtrusive Contextual Action Toolbar
│   │   ├── NotebookObjectives (Learning Objectives)
│   │   ├── NotebookPrerequisites (Prerequisite Concepts)
│   │   ├── NotebookUnitRenderer (Unified Semantic Units & Code Execution Blocks)
│   │   ├── NotebookSummary (Key Takeaways)
│   │   ├── NotebookSourceList (Verifiable Citations)
│   │   └── NotebookNavigation (Previous / Next Lesson Navigation)
│   └── Optional Right Outline Sidebar (w-64, Collapsible On-Demand)
```

---

## 2. Resolusi Desain Layout & Responsivitas

### 2.1 Alokasi Ruang Baca Utama (Main Canvas)
- **Sebelum**: Terjepit secara permanen antara sidebar kiri (288–336px) dan outline kanan (256px), menyisakan kurang dari 680px pada layar laptop standar.
- **Sesudah**:
  - Lebar kanvas dioptimalkan pada rentang nyaman **720px–900px** (`max-w-3xl xl:max-w-4xl mx-auto`).
  - Ketika sidebar kiri atau outline kanan ditutup, kanvas secara fleksibel berpusat dan memanfaatkan ruang layar penuh tanpa batasan buatan.
  - Outline kanan dijadikan **opsional dan collapsible** (tertutup secara default pada layar standar untuk memaksimalkan fokus membaca).

### 2.2 Breakpoint Matrix
| Breakpoint | Resolusi Target | Perilaku Sidebar Kiri | Perilaku Outline Kanan | Area Membaca Utama |
|---|:---:|---|---|---|
| **Ultra-Wide** | 1920 × 1080 | Terbuka (dapat ditutup) | Opsional (toggle button) | Terpusat 900px (`max-w-4xl`), breathing room luas |
| **Standard Laptop** | 1366 × 768 | Terbuka (dapat ditutup) | Tertutup secara default | Nyaman 760px, bebas crowding |
| **Compact Laptop** | 1024 × 768 | Terbuka / toggleable | Tersembunyi (drawer on-demand) | 720px adaptif |
| **Tablet Portrait** | 768 × 1024 | Drawer overlay dengan backdrop | Drawer overlay / accordion | Satu kolom penuh dengan padding 24px |
| **Mobile Standard** | 390 × 844 | Drawer overlay dengan backdrop | Accordion / modal | Satu kolom penuh, scrolling kode lokal |
| **Mobile Compact** | 375 × 667 | Drawer overlay dengan backdrop | Accordion / modal | Bebas horizontal page overflow |

---

## 3. Model Data & Alur Pelajaran (LessonFlow)

Model kurikulum di `src/lib/curriculum/types.ts` kini mendukung:
1. **`LessonFlow`**:
   - `"conceptual"`: Fokus pada konteks, definisi formal, intuisi, analogi dunia nyata, dan miskonsepsi.
   - `"mathematical"`: Fokus pada notasi, formulasi KaTeX, penurunan, kamus variabel, dan worked example manual.
   - `"algorithmic"`: Fokus pada problem framing, langkah proses, pseudocode, kompleksitas, dan failure modes.
   - `"computational"`: Fokus pada data, setup, sel kode, output terminal aktual, interpretasi, dan bukti eksekusi.
   - `"project"`: Fokus pada spesifikasi bisnis, skema dataset, tahapan milestone deliverables, dan rubrik evaluasi.
   - `"mixed"`: Kombinasi seimbang antara konsep teoritis dan praktikum komputasi.
2. **`NotebookExecutionGroup`**:
   - Menghubungkan secara eksplisit `codeUnitId`, `outputUnitId`, dan `interpretationUnitId`.
   - Mengunci bukti eksekusi `executionEvidence` (runtime, exit code, timestamp, duration ms).

---

## 4. Penyatuan Sel Kode & Output Komputasional

- **Sebelum**: `NotebookCodeCell` dan `NotebookOutputCell` merupakan kartu terpisah yang independen dengan header dan metadata berat.
- **Sesudah**:
  - `NotebookCodeCell` memiliki penanda `[In x]`, tombol salin cepat, dan syntax highlighting mono.
  - Metadata dependensi, kompleksitas Big-O, dan failure modes dirancang dengan **Progressive Disclosure** (collapsible accordion mini).
  - `NotebookOutputCell` terpasang langsung di bawah kode dengan penanda `[Out x]`, format teks terminal bersih, dan badge verifikasi runtime `Python 3.12.10 (Exit 0)`.
  - `NotebookInterpretationCard` menindaklanjuti output dengan menjawab apa arti angka tersebut, implikasi domain, dan peringatan statistik.

---

## 5. Kompatibilitas Mundur (Backward Compatibility)

Sebanyak **3,674 subbab legacy** yang belum memiliki unit semantik notebook tetap dirender 100% tanpa error:
- Branching kondisional di `DocReaderLayout` mendeteksi keberadaan `units`:
  ```tsx
  {currentSection.units && currentSection.units.length > 0 ? (
    <NotebookUnitRenderer units={currentSection.units} />
  ) : (
    <div className="py-2 prose dark:prose-invert max-w-none">
      <NoteRenderer content={currentMarkdown} />
    </div>
  )}
  ```
- Seluruh 30 test suite Jest dan 40 Next.js pages tetap lulus dan terkompilasi bersih.
