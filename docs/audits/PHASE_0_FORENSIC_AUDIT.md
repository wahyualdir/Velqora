# VELQORA — PHASE 0: FORENSIC PRODUCT AUDIT
## ARCHITECTURE DISCOVERY & REWORK BASELINE

---

## 1. REPOSITORY OVERVIEW & DISCOVERY

- **Product Name**: Velqora (Academic Productivity & Unified Learning Platform)
- **Framework**: Next.js 15.5.23 (App Router, Server Actions, Dynamic & Static prerendering)
- **Frontend Stack**: React 19, TypeScript 5.7, Tailwind CSS 3.4, Lucide Icons, Sonner
- **Backend / Database**: Supabase (PostgreSQL 15+, Auth, RLS Policies, Realtime, Storage)
- **Total TypeScript / TSX Files**: 380 files
- **Total Application Routes**: 36 routes
- **Automated Test Matrix**: 25 Test Suites (185+ passing scenarios, 0 failures)
- **PWA & Distribution**: Service Worker (`sw.js`), Manifest (`manifest.json`), Dedicated `/download` Hub

---

## 2. REPOSITORY TREE (ACTUAL FORENSIC SCAN)

```text
coba/Koleksi Belajar/
├── .env.example
├── .env.local
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.jpg
│   ├── logo.svg / logo.jpg / logo-banner.png / ml-logo.jpg / qr-mobile.png
│   ├── manifest.json
│   ├── sw.js
│   ├── icons/ (icon-192.png, icon-512.png, icon-maskable-512.png, svgs)
│   └── images/auth/login-doodle-wallpaper.png
├── src/
│   ├── actions/ (study-actions.ts, schedule-actions.ts, ai-actions.ts, quiz-actions.ts, etc.)
│   ├── app/
│   │   ├── (auth)/ (login, register, daftar, reset-password)
│   │   ├── api/ (ai/memory, health)
│   │   ├── dashboard/ (20 sub-routes: modul, materi, tugas, jadwal, kelas, ai-tutor, etc.)
│   │   ├── download/ (Dedicated App & PWA installation hub)
│   │   ├── globals.css, layout.tsx, page.tsx, not-found.tsx, error.tsx
│   ├── components/
│   │   ├── ai/ (ai-tutor, memory management, chat history)
│   │   ├── classes/ (classroom hub, streams, members)
│   │   ├── converter/ (file conversion studio workbench)
│   │   ├── dashboard/ (desktop-dashboard-view, mobile-dashboard-view, metrics, focus)
│   │   ├── files/ (drive explorer, file uploads)
│   │   ├── layout/ (desktop-workspace, mobile-app-shell, sidebar, navbar, mobile-bottom-nav)
│   │   ├── materi/ (materials library, mobile-material-list)
│   │   ├── modul/ (unified-content-form, module-drive-explorer, mobile-module-list)
│   │   ├── playground/ (code editor & OCR sandbox)
│   │   ├── quiz/ (interactive AI quiz)
│   │   ├── schedule/ (agenda, calendar, import modal, intelligence center)
│   │   ├── settings/ (profile, appearance, notifications, PWA application settings)
│   │   ├── tasks/ (desktop-task-workspace, mobile-task-list)
│   │   └── ui/ (button, input, badge, dialog, sheet, skeleton, empty-state, logo)
│   ├── context/ (experience-context, theme-accent-context, language-context)
│   ├── lib/ (supabase, schedule intelligence, validations, utils, experience)
│   └── types/ (module-drive, schedule, tasks, auth)
└── docs/audits/ (Forensic audits & Phase roadmaps)
```

---

## 3. CORE ARCHITECTURAL INVARIANTS (PROTECTED BACKEND)

The following components represent the **Shared Core** and MUST NOT be broken, deleted, or destructively refactored during presentation reworks:
1. **Supabase Database Schema & RLS**:
   - `modules`, `materials`, `tasks`, `schedules`, `classrooms`, `user_roles`, `ai_memories`.
2. **Authentication & Authorization**:
   - Supabase SSR Auth cookies, session validation, Role-Based Access Control (Admin/Teacher/Student).
3. **Server Actions Contract**:
   - `getModules()`, `createModule()`, `getTasks()`, `saveScheduleBatch()`, `askAITutorAction()`, `convertFileAction()`.
4. **AI & OCR Engines**:
   - Multi-provider fallback orchestration (Google Gemini / Anthropic Claude / Heuristic OCR & Document Parsers).
5. **Deterministic Intelligence Pipelines**:
   - Schedule collision detection, workload analysis, streak calculations, outcome calibrations.
