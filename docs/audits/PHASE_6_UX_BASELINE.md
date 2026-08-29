# VELQORA — PHASE 6 UX BASELINE & PRODUCT AUDIT

**Project**: Velqora (Intelligent Academic Workspace & Companion)  
**Phase**: Phase 6 — Product UX Audit & Human-Centered Experience Refinement  
**Status**: BASELINE AUDIT COMPLETE  

---

## 1. EXECUTIVE SUMMARY & UX PRINCIPLES

Phase 6 berfokus pada **penajaman pengalaman pengguna (Product UX)** dengan panduan prinsip:
1. **Clarity Over Decoration**: Informasi jelas tanpa ornamen visual yang membingungkan.
2. **Hierarchy Over Density**: Urutan prioritas yang logis dari yang terpenting ke rincian sekunder.
3. **Function Over Effect**: Elemen visual hanya hadir jika memberikan fungsi nyata bagi pengguna.
4. **Consistency Over Novelty**: Pola interaksi, terminologi tombol, dan penempatan status seragam di seluruh aplikasi.
5. **Progressive Disclosure**: Opsi lanjutan disembunyikan secara alami agar tidak membebani pengguna baru (*cognitive load reduction*).

---

## 2. FIVE-SECOND TEST EVALUATION (PRIMARY VIEWS)

| Rute Halaman | Tujuan Utama (*Primary Purpose*) | Aksi Utama (*Primary Action*) | Aksi Sekunder (*Secondary Action*) | Hasil Evaluasi 5-Detik |
|---|---|---|---|---|
| `/dashboard` | Mengetahui apa yang harus dipelajari sekarang & tenggat terdekat | **Lanjutkan Modul / Mulai Tugas** | Cari materi / Pintasan alat | **JELAS**: Focus banner memandu prioritas teratas tanpa distraksi |
| `/dashboard/modul` | Mengakses kurikulum, silabus, dan unit pembelajaran terstruktur | **+ Tambah Modul** | Filter kategori / Beralih tab Proyek | **JELAS**: Tab segmentasi membedakan Modul vs Proyek |
| `/dashboard/materi` | Membaca dan meninjau dokumen perkuliahan (PDF, DOCX, Slide) | **+ Tambah Materi** | Filter jenis berkas / Cari materi | **JELAS**: Daftar materi perkuliahan mudah dipindai |
| `/dashboard/tugas` | Mengelola tenggat waktu, prioritas, dan penyelesaian tugas kuliah | **+ Tambah Tugas** | Ubah status (Selesai/Proses) / Filter | **JELAS**: Deadline badges menunjukkan urgensi waktu |
| `/dashboard/jadwal` | Melihat agenda perkuliahan mingguan & rekomendasi waktu belajar | **+ Tambah Jadwal** | Impor dokumen jadwal / Optimasi AI | **JELAS**: Kalender mingguan yang rapi dan teratur |
| `/dashboard/kelas` | Mengorganisir mata kuliah semester dan kelompok belajar | **+ Tambah Kelas** | Buka detail kelas / Tinjau peserta | **JELAS**: Kartu mata kuliah informatif |
| `/dashboard/ai-tutor` | Berdiskusi dan bertanya materi perkuliahan secara interaktif | **Kirim Pertanyaan** | Pilih konteks materi / Atur gaya tutor | **JELAS**: Antarmuka percakapan yang fokus dan tenang |
| `/dashboard/konversi`| Memindai teks dari berkas (OCR) dan mengonversi format dokumen | **Pilih Berkas** | Mulai Pindai / Unduh hasil konversi | **JELAS**: Alur 2-langkah yang langsung dapat digunakan |
| `/dashboard/pengaturan`| Menyesuaikan preferensi akun, tema gelap/terang, dan profil | **Simpan Perubahan** | Ganti kata sandi / Unduh cadangan | **JELAS**: Pengelompokan tab pengaturan teratur |

---

## 3. TERMINOLOGY & SEGMENTATION AUDIT

### A. Modul vs. Proyek
- **Modul**: Struktur materi kurikulum, bab perkuliahan, dan silabus studi.
- **Proyek**: Karya praktis, tugas besar, kode program, atau artefak portofolio mahasiswa.
- **Implementasi**: Dikelola dalam satu hub terpadu dengan tab segmentasi eksplisit: `[Semua] [Modul Pembelajaran] [Proyek Studi]`.

### B. Materi vs. Berkas
- **Materi (`/dashboard/materi`)**: Konten belajar utama (catatan kuliah, rangkuman, slide dosen, referensi buku).
- **Berkas (`/dashboard/file`)**: Manajemen media dan dokumen lampiran mentah.

### C. Tugas vs. Jadwal
- **Tugas (`/dashboard/tugas`)**: Item yang harus diselesaikan (*actionable deliverables*) dengan status `Belum Mulai`, `Sedang Dikerjakan`, `Selesai`, dan indikator `Tenggat Lewat`.
- **Jadwal (`/dashboard/jadwal`)**: Waktu berjalannya kegiatan akademik (jam kuliah tetap, sesi belajar mandiri, jadwal ujian).

---

## 4. BUTTON HIERARCHY & LABELING AUDIT

| Tingkat Hierarki | Gaya Visual Token | Konteks Penggunaan | Contoh Label Humanis |
|---|---|---|---|
| **Primary** | `bg-brand-600 text-white hover:bg-brand-700` | Aksi utama tunggal pada halaman | `Tambah Modul`, `Tambah Materi`, `Tambah Tugas`, `Simpan Perubahan` |
| **Secondary** | `bg-surface border border-border hover:bg-surface-secondary` | Aksi pendukung penting | `Impor Jadwal`, `Edit Tugas`, `Unduh Cadangan` |
| **Ghost / Tertiary** | `text-text-secondary hover:text-text-primary hover:bg-surface-secondary/60` | Aksi ringan atau filter | `Batal`, `Tutup`, `Reset Filter` |
| **Destructive** | `text-rose-600 hover:bg-rose-500/10 border-rose-500/30` | Penghapusan data permanen | `Hapus Modul`, `Hapus Tugas` (dengan konfirmasi eksplisit) |

---

## 5. EMPTY STATES, LOADING & ERROR BOUNDARIES

1. **Empty States (`EmptyState.tsx`)**:
   - Menjawab 3 pertanyaan penting: (1) *Apa yang kosong?* (2) *Mengapa kosong?* (3) *Apa aksi yang dapat dilakukan pengguna sekarang?*
   - Contoh: *"Belum ada modul pembelajaran. Buat modul pertama untuk menyusun silabus dan catatan belajar Anda."* -> Tombol: `[ + Tambah Modul ]`.
2. **Loading States**:
   - Menggunakan skeleton bersahaja yang mencerminkan struktur layout nyata tanpa shimmer berlebihan.
3. **Error Handling**:
   - Menampilkan pesan error yang tenang dan manusiawi dengan tombol `[ Coba Lagi ]` atau `[ Kembali ke Dashboard ]`.

---

## 6. FORM UX & PROGRESSIVE DISCLOSURE

- **Form Labels**: Seluruh input memiliki label teks eksplisit (`<label>`), bukan hanya placeholder.
- **Double-Submit Guard**: Tombol submit dinonaktifkan otomatis (`disabled={loading}`) saat mutasi data sedang diproses.
- **Progressive Disclosure**: Field lanjutan (seperti URL referensi eksternal atau catatan tambahan) dikelompokkan dalam bagian tersendiri agar tidak mengintimidasi pengguna baru.

---

## 7. AI POSITIONING: A FOCUSED TOOL, NOT BLOATED DECORATION

- AI Tutor dan AI Quiz diposisikan secara wajar sebagai **alat bantu belajar (*academic learning tools*)**.
- Menghindari *AI-slop patterns*:
  - Tidak ada teks gradien pelangi atau neon glowing borders.
  - Tidak ada animasi floating blobs yang mengaburkan teks.
  - Tidak ada terminologi bombastis seperti "Supercharge AI magic".

---

## 8. ACTION PLAN FOR PHASE 6 REFINEMENT

1. Verifikasi konsistensi microcopy tombol dan empty state di seluruh halaman.
2. Memastikan navigasi desktop (Sidebar) dan mobile (Bottom Nav) memiliki label yang deskriptif dan mudah dipahami.
3. Validasi transisi dan feedback form (Toast notification konsisten via `sonner`).
4. Eksekusi `npm test`, `npm run build`, dan `npm run lint` untuk menjamin integritas baseline 100%.

==================================================  
**UX BASELINE ESTABLISHED: PROCEED TO PHASE 6 AUDIT & REPORT**  
==================================================  
