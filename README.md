# Velqora — Intelligent Academic Workspace & Learning Platform

Velqora adalah platform manajemen pembelajaran dan produktivitas akademik modern yang memadukan dua pengalaman teroptimasi: **Professional Learning Workspace** untuk Web Desktop dan **Personal Learning App** untuk perangkat seluler.

---

## 🏛️ Arsitektur Produk

```text
Velqora
│
├── Web Experience (Desktop Workspace >= 1024px)
│   ├── Information-Dense Multi-Column Workspace
│   ├── Collapsible Sidebar (245px / 68px)
│   ├── Spotlight Search Palette (Ctrl + K)
│   └── Structured Desktop Data Tables
│
├── Mobile App Experience (Personal Learning App < 768px)
│   ├── Thumb-Friendly Single-Hand Navigation
│   ├── 5-Destination Bottom Nav (Beranda, Materi, Tugas, Modul, Menu)
│   ├── Slide-Over Menu Drawer
│   └── Modal Bottom Sheets & Time-Aware Feed
│
├── Shared Backend Core
│   ├── Supabase PostgreSQL Database & Strict RLS Policies
│   ├── Supabase SSR Authentication & Authorization
│   ├── High-Performance Server Actions & REST API
│   ├── Multimodal AI & Heuristic OCR Pipelines
│   └── Deterministic Schedule Conflict & Intelligence Engines
│
├── Documentation (/docs)
│   ├── /docs/architecture (Protected Core & Boundary Specs)
│   ├── /docs/audits (Phase Reports & Forensic Audits)
│   └── /docs/archive (Historical Documentation)
│
└── Testing Engine
    └── 25 Test Suites (185+ Automated Scenarios, 100% Pass Rate)
```

---

## 🛠️ Stack Teknologi

- **Frontend Framework**: [Next.js 15.5](https://nextjs.org/) (App Router, Server Actions)
- **UI & Runtime**: [React 19](https://react.dev/) & TypeScript 5
- **Styling**: Tailwind CSS & Design Token System (Precision Blue `#2563EB`, Neutral Surfaces)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, SSR Cookies, Storage, RLS)
- **Document Processing**: jsPDF, docx, jszip, pdf-parse, xlsx, qrcode
- **PWA & Distribution**: Progressive Web App Manifest, Service Worker Caching, `/download` Hub
- **Testing Engine**: Node.js Test Runner via `tsx`

---

## 🚀 Panduan Setup & Menjalankan Project

### 1. Prasyarat
- Node.js 18.18+ atau Node.js 20+
- Akun Supabase aktif

### 2. Environment Variables
Salin file template `.env.example` menjadi `.env.local` di root directory:

```bash
cp .env.example .env.local
```

Isi variabel konfigurasi dengan nilai dari dashboard Supabase & penyedia AI Anda:

```env
# Supabase (Wajib untuk Auth, Database & Storage)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Multimodal AI (Wajib untuk AI Tutor, AI Kuis & AI Parser)
GEMINI_API_KEY=your_gemini_api_key

# Opsional
ANTHROPIC_API_KEY=your_anthropic_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_OWNER_EMAIL=admin@velqora.app
NEXT_PUBLIC_ADMIN_EMAIL=admin@velqora.app
```

> [!IMPORTANT]
> **Catatan Fungsionalitas & Credentials**:
> Aplikasi **tidak akan berfungsi secara penuh** (login/registrasi, penyimpanan cloud modul/tugas, fitur AI Tutor, dan kuis otomatis) tanpa credential asli yang valid pada `.env.local`. Pastikan Anda telah membuat project Supabase dan memasukkan API Key Gemini yang valid.

> [!WARNING]
> **Catatan Keamanan**: Jangan pernah melakukan commit file `.env.local` atau credential rahasia ke dalam repository git.

### 3. Instalasi Dependencies
```bash
npm install
```

### 4. Menjalankan Server Development
```bash
npm run dev
```
Akses aplikasi melalui browser di `http://localhost:3000`.

---

## 🧪 Pengujian (Testing)

Velqora dilengkapi dengan 28 automated test suites yang mencakup unit test, integration test, conflict engine, schedule import, heuristic parser, dan product experience scenarios.

Jalankan seluruh test suite dengan:

```bash
npm test
```

---

## 📦 Fitur Import Massal Catatan Vault (Admin/Owner)

Velqora menyediakan fungsionalitas impor massal berkas Markdown (`.md`) langsung ke dalam sistem Knowledge Vault ala Obsidian tanpa perlu input manual satu per satu.

### 1. Lokasi & Akses
- Halaman: `/dashboard/catatan` (Knowledge Vault).
- Tombol: **Import Modul** (terletak di header sejajar dengan *Catatan Baru*, hanya muncul untuk user berhak akses **Admin / Owner**).

### 2. Format Berkas Markdown (.md)
Setiap berkas harus menyertakan frontmatter YAML sederhana di awal dokumen:

```markdown
---
kategori: "Artificial Intelligence Fundamentals"
title: "Rational Agents & Lingkungan PEAS"
tags: [ai-fundamentals, agent, peas]
---

# Rational Agents & Lingkungan PEAS

Isi materi catatan kurikulum lengkap...
Boleh menyertakan [[Nama Catatan Lain]] untuk wikilink otomatis.
```

- `kategori` *(Wajib)*: Nama subkategori yang sudah ada di database (pencocokan bersifat *case-insensitive*).
- `title` *(Opsional)*: Jika tidak disertakan, sistem otomatis mengekstrak judul dari heading `# Heading` pertama atau nama berkas.
- `tags` *(Opsional)*: Tag kurikulum yang otomatis disinkronkan ke tabel `note_tags`.

### 3. Keamanan & Integritas Data
- **Validasi Kategori Ketat**: Jika nama kategori tidak ditemukan di database, berkas akan ditandai *Dilewati (Skip)* dengan alasan transparan. Kategori baru tidak dibuat secara diam-diam.
- **Pencegahan Overwrite**: Judul atau slug yang sudah ada di database tidak akan ditimpa diam-diam.
- **Tahap Pratinjau Eksplisit**: Modal menyediakan validasi instan (Total Berkas, Siap Diimpor, Dilewati) sebelum konfirmasi impor dijalankan.
- **Contoh Berkas Uji**: Tersedia di folder `fixtures/notes-import-sample/`.

---

## 📚 Dokumentasi Arsitektur & Keamanan

- [Protected Core Specification](docs/architecture/PROTECTED_CORE.md)
- [Web vs Mobile Boundary Specification](docs/architecture/WEB_MOBILE_BOUNDARY.md)
- [Design System Boundary Specification](docs/architecture/DESIGN_SYSTEM_BOUNDARY.md)
- [Security Advisory & Audit Evaluation](docs/audits/SECURITY_ADVISORY.md)
- [Phase 0 Forensic Audit](docs/audits/PHASE_0_FORENSIC_AUDIT.md)
- [Product Acceptance Report](docs/audits/PRODUCT_ACCEPTANCE_REPORT.md)
