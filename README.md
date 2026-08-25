# StudyVault — Perpustakaan Digital Tugas & Modul Pribadi

StudyVault adalah aplikasi web pribadi modern untuk menyimpan, mengelola, dan mengorganisir seluruh materi kuliah, tugas, modul pembelajaran, catatan, project, notebook Jupyter, source code, dan file pembelajaran Anda dalam satu tempat yang aman dan terstruktur.

---

## 🌟 Fitur Utama

- 📊 **Dashboard Interaktif**: Statistik total materi, tugas, modul, dan file. Tampilan tugas mendekati deadline dan modul aktif.
- 📚 **Sistem Materi (CRUD)**: Kelola materi kuliah, catatan, notebook, project, dan referensi eksternal.
- 📋 **Sistem Tugas Kuliah**: Manajemen deadline dengan indikator visual otomatis (merah/kuning/hijau), tingkat prioritas, dan status pengerjaan.
- 🎓 **Modul Pembelajaran Step-by-Step**: Kelola bab/chapter pembelajaran dengan progress bar persentase otomatis.
- 📁 **Cloud File Storage**: Integrasi langsung dengan Supabase Storage untuk upload & download file hingga 50MB (PDF, DOCX, IPYNB, ZIP, Gambar, dll).
- 🏷️ **Kategori & Tag**: Pengelompokan fleksibel berdasarkan mata kuliah atau topik (Python, Data Science, Web Dev, dll).
- 🔍 **Pencarian Global & Filter**: Filter berdasarkan kategori, jenis materi, status, dan kata kunci.
- 🌙 **Dark / Light / System Mode**: Tampilan fleksibel yang nyaman di mata.
- 💾 **Backup & Export Data**: Ekspor metadata ke format JSON untuk perlindungan data.
- 🔐 **Keamanan Terjamin**: Proteksi Row Level Security (RLS) Supabase — pengguna hanya dapat melihat dan mengubah datanya sendiri.

---

## 🛠️ Stack Teknologi

- **Frontend Framework**: Next.js 15 (App Router, Server Actions)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Database & Auth**: Supabase PostgreSQL + Supabase Auth
- **File Storage**: Supabase Storage
- **UI Feedback**: Sonner (Toast notifications)
- **Deployment Target**: Vercel

---

## 🚀 Panduan Setup & Instalasi Lokal

### 1. Persiapan Supabase

1. Buka [supabase.com](https://supabase.com) dan buat project baru (Gratis).
2. Di **SQL Editor** Supabase, jalankan isi file `supabase/migrations/001_initial_schema.sql` untuk membuat tabel, trigger, dan RLS policies.
3. Di **Storage**, buat bucket baru bernama: `studyvault-files` dan centang opsi **Public**.
4. Di **Authentication -> Providers**, pastikan provider **Email** aktif.

### 2. Environment Variables

Buat file `.env.local` di root folder project dan isi dengan credential dari Supabase Project Settings -> API:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install Dependencies & Jalankan Project

Jalankan perintah berikut di terminal:

```bash
npm install
npm run dev
```

Buka browser dan akses: `http://localhost:3000`

---

## 📦 Menjalankan Build Testing

Untuk memastikan tidak ada error TypeScript atau ESLint sebelum deployment:

```bash
npm run build
```

---

## 🚀 Panduan Deploy ke Vercel

1. Push repository ini ke akun **GitHub** Anda.
2. Login ke [vercel.com](https://vercel.com) dan pilih **Add New Project**.
3. Import repository GitHub **StudyVault**.
4. Di bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Klik **Deploy**. Project Anda akan aktif secara instan dalam beberapa detik!

---

## 📄 Lisensi & Hak Cipta

Project ini dibuat khusus sebagai perpustakaan digital pribadi.
