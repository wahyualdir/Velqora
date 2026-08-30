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
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

> **Catatan Keamanan**: Jangan pernah melakukan commit file `.env.local` atau credential asli ke dalam git repository.

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

Velqora dilengkapi dengan 25 automated test suites yang mencakup unit test, integration test, conflict engine, schedule import, heuristic parser, dan product experience scenarios.

Jalankan seluruh test suite dengan:

```bash
npm test
```

---

## 📚 Dokumentasi Arsitektur

- [Protected Core Specification](docs/architecture/PROTECTED_CORE.md)
- [Web vs Mobile Boundary Specification](docs/architecture/WEB_MOBILE_BOUNDARY.md)
- [Design System Boundary Specification](docs/architecture/DESIGN_SYSTEM_BOUNDARY.md)
- [Phase 0 Forensic Audit](docs/audits/PHASE_0_FORENSIC_AUDIT.md)
- [Product Acceptance Report](docs/audits/PRODUCT_ACCEPTANCE_REPORT.md)
