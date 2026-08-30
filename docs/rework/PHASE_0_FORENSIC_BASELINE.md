# VELQORA — PHASE 0: FORENSIC CODEBASE BASELINE REPORT
## REAL CODEBASE DISCOVERY & EXECUTION BENCHMARK

---

## 1. REPOSITORY TOPOLOGY & SOURCE METRICS

- **Repository**: `https://github.com/wahyualdir/Velqora.git`
- **Production URL**: `https://www.velqora.web.id/`
- **Framework & Core**: Next.js 15.5.0 (App Router), React 19, TypeScript 5.7, Tailwind CSS v4.
- **Backend & Database**: Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS), Supabase Storage.
- **Source Code Volume**:
  - Total Files in `src/`: **373 files**
  - Total TypeScript/TSX Files in `src/`: **372 files**
  - Total Discovered Page Routes: **35 routes**
  - Total Discovered API Endpoints: **2 endpoints** (`/api/ai/memory`, `/api/health`)
  - Total Test Suites: **25 suites** (**185+ automated scenarios**)

---

## 2. CODEBASE EXECUTION BENCHMARK (REAL COMMAND RUNS)

| Command | Execution Result | Real Evidence / Notes |
| :--- | :---: | :--- |
| `npm test` | **PASS (100%)** | 25 / 25 suites passed in 68.4s. 0 failures. |
| `npx tsc --noEmit` | **PASS (0 Errors)** | TypeScript 5.7 type-check exited with code 0. |
| `npm run build` | **PASS (35 Pages + 2 APIs)** | Next.js compiled all static and dynamic routes in ~97s. |
| `npm run lint` | **WARNINGS RECORDED** | Next.js ESLint flagged unused type imports in test suites. |

---

## 3. DEPENDENCY & DATA FLOW ARCHITECTURE

```text
[CLIENT VIEWPORT / BROWSER]
       │
       ▼
[EXPERIENCE CONTEXT & ROUTE]
  ├── Desktop (>=1024px) ──> DesktopWorkspace / DesktopTopBar / DesktopTable
  └── Mobile  (< 768px)  ──> MobileAppShell / MobileTopBar / MobileBottomNav
       │
       ▼
[PAGE CONTROLLER / SERVER COMPONENT]
  ├── (auth)/* ────────────> Supabase Auth Form
  └── dashboard/* ─────────> Protected Auth Guard (middleware.ts + supabase/server.ts)
       │
       ▼
[SERVER ACTIONS & INTELLIGENCE ENGINES]
  ├── study-actions.ts / schedule-actions.ts / ai-memory-actions.ts
  ├── Gemini Multimodal AI Engine (src/lib/ai/engine.ts)
  ├── Multiformat Document Parsers (PDF, DOCX, XLSX, CSV, TXT)
  └── Closed-Loop Schedule Optimization & Conflict Engines
       │
       ▼
[DATA LAYER]
  ├── Supabase PostgreSQL Tables (profiles, modules, materials, tasks, schedules, outcomes)
  └── Supabase Storage Buckets (material-files, schedule-imports)
```

---

## 4. DESIGN TOKEN & COLOR DISCIPLINE

- **Web Desktop ($\ge 1024\text{px}$)**:
  - Base: `#090D16` (`--color-background`)
  - Surface: `#0F172A` (`--color-surface`)
  - Border: `#1E293B`
  - Accent: `#2563EB` (Precision Blue)
- **Mobile App ($< 768\text{px}$)**:
  - Base: `#FFFFFF` / `#F8FAFC`
  - Surface: `#FFFFFF` / `#F1F5F9`
  - Border: `#E2E8F0`
  - Accent: `#2563EB`
- **Anti-Slop Strict Invariant**:
  - **0 gradient text** (`bg-clip-text`).
  - **0 neon glow drop-shadows** (`shadow-[0_0_...]`).
  - **0 decorative bouncing/pulsating animations**.
