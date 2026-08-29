# Velqora — Intelligent Academic Workspace & Learning Platform

Velqora adalah platform manajemen pembelajaran dan produktivitas akademik berbasis AI yang dirancang untuk mengorganisasi silabus kuliah, tugas, catatan, jadwal terotomasi, modul pembelajaran interaktif, serta repositori dokumen perkuliahan dalam satu lingkungan kerja yang modern, terstruktur, dan aman.

---

## 🛠️ Stack Teknologi

- **Frontend & App Framework**: [Next.js 15.5](https://nextjs.org/) (App Router, Server Actions)
- **UI & Runtime**: [React 19](https://react.dev/) & TypeScript 5
- **Design System & Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth SSR, Storage, RLS)
- **Document Processing**: jsPDF, docx, jszip, pdf-parse, xlsx, qrcode
- **PWA**: Web App Manifest, Service Worker (Stale-While-Revalidate caching)
- **Testing Engine**: Built-in NodeJS Test Runner via `tsx`

---

## 📁 Struktur Folder Utama

```
velqora/
├── src/
│   ├── app/                 # Next.js App Router (35 routes: auth, dashboard, api)
│   ├── components/          # 123 Presentation components grouped by domain
│   │   ├── ai/              # AI Tutor, Context & Memory components
│   │   ├── classes/         # Classroom management & collaboration
│   │   ├── converter/       # Document format converter workbench
│   │   ├── dashboard/       # Central workspace focus, metrics & lists
│   │   ├── files/           # File repository & direct upload hub
│   │   ├── layout/          # Sidebar, Navbar, CommandPalette, Footers
│   │   ├── materi/          # Learning materials & PDF reader
│   │   ├── modul/           # Course modules, syllabus & drive explorer
│   │   ├── playground/      # Interactive code runner sandbox
│   │   ├── quiz/            # AI Quiz generator & session runner
│   │   ├── schedule/        # Academic schedule intelligence & controls
│   │   ├── settings/        # Profile, appearance, security & learning prefs
│   │   ├── tasks/           # Task management & deadline tracking
│   │   └── ui/              # Reusable design system primitives
│   ├── actions/             # Next.js Server Actions (study, schedule, ai, quiz, auth)
│   ├── lib/                 # Core domain logic, AI engines, schedule pipelines, Supabase
│   ├── context/             # Global providers (LanguageContext, ThemeAccentContext)
│   └── types/               # Core TypeScript definitions and contracts
├── docs/                    # Centralized project documentation
│   ├── architecture/        # System design & component architecture specs
│   ├── audits/              # Project audit reports (Phase 0 Audit, Phase 1 Report)
│   ├── implementation/      # Implementation logs & engineering guides
│   ├── testing/             # Test strategy & validation suites
│   └── archive/             # Archived phase reports & historical logs
├── public/                  # Static assets, PWA manifest, service worker & icons
├── scripts/                 # Test runners, fixture generators, icon tools
├── supabase/                # Database migrations (001 to 007) & RLS policies
└── fixtures/                # Real-world academic schedule documents for testing
```

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

Velqora dilengkapi dengan 23 automated test suites yang mencakup unit test, integration test, conflict engine, schedule import, heuristic parser, dan product experience scenarios.

Jalankan seluruh test suite dengan:
```bash
npm test
```

---

## 📦 Build & Production Verification

Untuk memvalidasi type check, server actions, dan kompilasi 35 route produksi:

```bash
npm run build
```

Untuk menjalankan static analysis linter:
```bash
npm run lint
```

---

## 📚 Dokumentasi Terkait

- [Comprehensive Phase 0 Audit Report](docs/audits/AUDIT_REPORT.md)
- [Phase 1 Repository Hygiene Report](docs/audits/PHASE_1_REPORT.md)
- [Production Release Checklist](PRODUCTION_RELEASE_CHECKLIST.md)
- [Historical Phase Archives](docs/archive/)

---

## 📄 Lisensi
Hak Cipta © 2026 Velqora. All rights reserved.
