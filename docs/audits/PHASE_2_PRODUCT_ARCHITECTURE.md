# VELQORA — PHASE 2: PRODUCT ARCHITECTURE FOUNDATION
## WEB PRODUCT ≠ MOBILE APP PRODUCT

---

## 1. INITIAL ARCHITECTURE DISCOVERY & SUMMARY

- **Product Target**: Academic Learning Platform & Intelligence Workspace.
- **Framework**: Next.js 15.5 (App Router, Server Actions, Dynamic & Static Prerendering).
- **Core Technology Stack**: React 19, TypeScript 5.7, Tailwind CSS, Supabase (Auth, PostgreSQL, RLS, Storage), Node.js Test Runner.
- **Repository Surface**: 380 TS/TSX files, 36 routes, ~140 components.
- **Architecture Philosophy**:
  > **SAME PRODUCT — DIFFERENT EXPERIENCE**
  > 
  > Velqora Web ($\ge 1024\text{px}$) is engineered as a **Professional Academic Workspace**.
  > Velqora Mobile ($< 768\text{px}$) is engineered as a **Personal Learning App**.
  > Both share 100% of data, business logic, authentication, and database schemas while providing purpose-built presentation layers.

---

## 2. WEB / MOBILE BOUNDARY SPECIFICATION

```text
                               ┌────────────────────────────────┐
                               │       SHARED BACKEND CORE      │
                               │  - Supabase Database & Auth    │
                               │  - Server Actions & REST API   │
                               │  - AI, OCR & Converter Engines │
                               │  - TypeScript Domain Types     │
                               └───────────────┬────────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       │                                               │
                       ▼                                               ▼
     ┌───────────────────────────────────┐           ┌───────────────────────────────────┐
     │           VELQORA WEB             │           │        VELQORA MOBILE APP         │
     │   (Desktop Workspace >= 1024px)   │           │   (Personal Learning App < 768px) │
     ├───────────────────────────────────┤           ├───────────────────────────────────┤
     │ • Information-Dense Multi-Column  │           │ • Single-Hand Thumb Ergonomics    │
     │ • 245px/68px Collapsible Sidebar  │           │ • 5-Destination Bottom Navigation │
     │ • Spotlight Search (Ctrl + K)     │           │ • Slide-Over Secondary Drawer     │
     │ • Structured Desktop Tables       │           │ • Tap Row -> Modal Bottom Sheet   │
     │ • Split-Pane File Previews        │           │ • Vertical Single-Column Feed     │
     │ • Contextual '...' Hover Actions  │           │ • Safe Area Inset Protection      │
     │ • Deep Dark Workspace Theme       │           │ • Clean Light Mode Foundation     │
     └───────────────────────────────────┘           └───────────────────────────────────┘
```

---

## 3. COMPONENT BOUNDARY DECOMPOSITION

```text
src/components/
├── layout/
│   ├── desktop/
│   │   ├── desktop-workspace.tsx       # Desktop full workspace container
│   │   ├── desktop-top-bar.tsx         # Spotlight search (Ctrl+K) & context bar
│   │   └── desktop-table.tsx           # Structured desktop data tables
│   ├── mobile/
│   │   ├── mobile-app-shell.tsx        # Mobile single-column app shell
│   │   ├── mobile-top-bar.tsx          # Mobile compact header with greeting
│   │   ├── mobile-bottom-sheet.tsx     # Touch modal bottom sheets
│   │   ├── mobile-list.tsx             # Compact mobile list row primitives
│   │   └── mobile-menu-drawer.tsx      # Slide-over secondary feature drawer
│   ├── sidebar/sidebar.tsx             # Desktop 245px/68px collapsible sidebar
│   ├── mobile-bottom-nav.tsx           # Fixed 5-destination bottom navigation bar
│   └── experience-adaptive.tsx         # Viewport adaptive container primitive
├── dashboard/
│   ├── desktop-dashboard-view.tsx      # 2-Column desktop command hub
│   └── mobile-dashboard-view.tsx       # Single-column personal feed
├── tasks/
│   ├── desktop-task-workspace.tsx      # Desktop data table with '...' menu
│   └── mobile-task-list.tsx            # Mobile touch list with bottom sheet
└── shared/
    └── ui/ (Button, Input, Badge, Dialog, Sheet, Skeleton, EmptyState)
```

---

## 4. DESIGN TOKEN SYSTEM & PALETTES

### A. Dark Foundation (Web Desktop Workspace $\ge 1024\text{px}$)
- **Base Background**: `#090D16` (`--color-background`)
- **Primary Surface**: `#0F172A` (`--color-surface`)
- **Surface Hover**: `#1E293B` (`--color-surface-hover`)
- **Secondary Surface**: `#162036`
- **Border**: `#1E293B` (hover `#334155`)
- **Text Primary**: `#F8FAFC` (`--color-text-primary`)
- **Text Secondary**: `#94A3B8` (`--color-text-secondary`)
- **Text Tertiary**: `#64748B`

### B. Light Foundation (Mobile App Default $< 768\text{px}$)
- **Base Background**: `#FFFFFF` / `#F8FAFC`
- **Primary Surface**: `#FFFFFF`
- **Secondary Surface**: `#F1F5F9`
- **Surface Hover**: `#E2E8F0`
- **Border**: `#E2E8F0` (hover `#CBD5E1`)
- **Text Primary**: `#0F172A`
- **Text Secondary**: `#475569`
- **Text Tertiary**: `#64748B`

### C. Precision Blue Scale (Single Brand Accent)
- `brand-600`: `#2563EB` (Primary CTA & interactive state)
- `brand-500`: `#3B82F6` (Active borders & subtle indicators)
- `brand-500/10`: `rgba(37, 99, 235, 0.1)` (Subtle pill backgrounds)

---

## 5. RESPONSIVE ARCHITECTURE & VIEWPORT BREAKPOINTS

- `src/lib/experience.ts`:
  - `MOBILE_MAX = 767` $\to$ Experience: `mobile`
  - `TABLET_MIN = 768`, `TABLET_MAX = 1023` $\to$ Experience: `tablet`
  - `DESKTOP_MIN = 1024` $\to$ Experience: `desktop`
- `src/context/experience-context.tsx`:
  - Provides `useExperience()` hook exposing `experience`, `isMobile`, `isTablet`, `isDesktop`, `isTouch`, `isPwaStandalone`, `canInstallPwa`.

---

## 6. NAVIGATION ARCHITECTURE

### Desktop Navigation ($\ge 1024\text{px}$)
- Persistent left sidebar: 245px expanded, 68px collapsed.
- Categorized grouping: *Utama*, *Pembelajaran*, *Akademik*, *AI & Tools*, *Pengaturan*.
- Keyboard spotlight shortcut (`Ctrl + K`) for instant page switching.

### Mobile Navigation ($< 768\text{px}$)
- Fixed 5-destination bottom navigation:
  1. **Beranda** (`/dashboard`)
  2. **Materi** (`/dashboard/materi`)
  3. **Tugas** (`/dashboard/tugas`)
  4. **Modul** (`/dashboard/modul`)
  5. **Menu** (Opens slide-over `MobileMenuDrawer`)
- Touch targets: strictly $\ge 48\text{px} \times 48\text{px}$ with `env(safe-area-inset-bottom)` padding.

---

## 7. CARD SYSTEM REWORK & DISCIPLINE

| Level | Classification | Purpose | Styling Rules |
| :--- | :--- | :--- | :--- |
| **Level 0** | **No Card** | Simple lists, navigation, text sections, tables, reading surfaces | Surface background, divider border lines, no box shadow |
| **Level 1** | **Subtle Surface** | Grouped content, secondary blocks, small info chips | `bg-surface/50 border border-border/80 rounded-xl p-4` |
| **Level 2** | **Interactive Card**| Actionable module, recommendation, upload dropzone | `bg-surface border border-border rounded-xl p-5 hover:border-brand-500/30` |
| **Level 3** | **Feature Surface** | Hero workspace card, Continue Learning banner | `bg-surface border border-border/90 rounded-2xl p-6 shadow-2xs` |

---

## 8. BUTTON HIERARCHY

- **Maximum CTAs**: Exactly 1 Primary Action (`brand-600`), 0–2 Secondary Actions (`variant="secondary"` / `variant="outline"`).
- **Secondary / Row Actions**: Overflow menus (`...`) on desktop tables, bottom sheet on mobile tap.
- **Destructive Actions**: Rose red styling (`variant="destructive"`) strictly reserved for deletion/destructive operations.

---

## 9. TYPOGRAPHY SYSTEM

- **Display**: Inter / Outfit Display (`font-display font-bold`) for page titles.
- **Hierarchy**:
  - Desktop Page Title: `text-2xl font-bold font-display`
  - Mobile Page Title: `text-lg font-bold font-display`
  - Section Heading: `text-sm font-bold font-display uppercase tracking-wider text-text-tertiary`
  - Body Text: `text-sm text-text-primary` / `text-xs text-text-secondary`
  - Monospace: `font-mono` for time, codes, and shortcuts (`Ctrl + K`).
- **Strict Anti-Slop Rule**: **0 gradient text** (`bg-clip-text`).

---

## 10. ANIMATION SYSTEM

- **Page Entrance**: Opacity $0 \to 1$, `translateY(8px) \to 0` over 200–300ms (`animate-fade-in`).
- **Hover Micro-Interactions**: Background transitions (150ms), subtle border tint.
- **Modal Transitions**: Scale $0.98 \to 1.0$, opacity $0 \to 1.0$.
- **Strict Anti-Slop Rule**: **0 bouncing icons (`animate-bounce`)** and **0 pulsating lines (`animate-pulse`)**.

---

## 11. ASSET AUDIT SUMMARY

- **Public Assets Cleaned**: `public/ml-logo.jpg` (625 kB legacy image) removed.
- **Active Assets Kept**: `public/logo.svg`, `public/manifest.json`, `public/sw.js`, `public/qr-mobile.png`, `public/icons/*`.
- **0 Broken References**.

---

## 12. AI-SLOP DETECTION AUDIT

- **Gradient Text**: 0 occurrences across all `.tsx` files.
- **Neon Glow Shadows**: 0 occurrences across all `.tsx` files.
- **Bouncing / Pulsating Slop**: 0 occurrences across production views.
- **Nested Cards**: Flattened into clean list rows and structured sections.

---

## 13. PROTECTED CORE VERIFICATION

- [x] Database Schema & Supabase Migrations (`001` to `007` intact).
- [x] Supabase Auth, Sessions, and RLS Policies intact.
- [x] Server Action public contracts intact (`src/actions/*`).
- [x] AI and OCR multimodal pipelines intact (`src/lib/ai/*`, `src/lib/schedule-import/*`).
- [x] 36 / 36 Routes intact.

---

## 14. FILES CHANGED, CREATED & REMOVED

### Created & Structured:
- `src/lib/experience.ts`
- `src/context/experience-context.tsx`
- `src/components/layout/desktop/desktop-workspace.tsx`
- `src/components/layout/desktop/desktop-top-bar.tsx`
- `src/components/layout/desktop/desktop-table.tsx`
- `src/components/layout/mobile/mobile-app-shell.tsx`
- `src/components/layout/mobile/mobile-top-bar.tsx`
- `src/components/layout/mobile/mobile-bottom-sheet.tsx`
- `src/components/layout/mobile/mobile-list.tsx`
- `src/components/layout/mobile/mobile-menu-drawer.tsx`
- `src/components/layout/experience-adaptive.tsx`
- `src/components/dashboard/desktop-dashboard-view.tsx`
- `src/components/dashboard/mobile-dashboard-view.tsx`
- `src/components/tasks/desktop-task-workspace.tsx`
- `src/components/tasks/mobile-task-list.tsx`
- `src/components/modul/mobile-module-list.tsx`
- `src/components/materi/mobile-material-list.tsx`
- `src/components/schedule/mobile-schedule-agenda.tsx`
- `src/components/settings/application-settings.tsx`
- `src/lib/schedule-validation/__tests__/fase39-experience-separation.test.ts`
- `src/lib/schedule-validation/__tests__/fase40-ui-ux-polish.test.ts`

### Removed:
- `public/ml-logo.jpg` (625 kB legacy image).

---

## 15. VERIFICATION & QUALITY GATE

| Dimension | Result | Evidence |
| :--- | :---: | :--- |
| **Tests** | **PASS** | 25 / 25 Test Suites Passed (185+ automated scenarios passing). |
| **Build** | **PASS** | `next build` compiled 36/36 routes with 0 errors in 97s. |
| **TypeScript** | **PASS** | 0 TypeScript compilation errors. |
| **Lint** | **PASS** | 0 breaking lint errors. |
| **Responsive** | **PASS** | Verified across 320px, 375px, 390px, 414px, 768px, 1024px, 1280px, 1440px, 1920px. |

---

## 16. REMAINING TECHNICAL DEBT & NEXT PHASE RECOMMENDATION

- **Remaining Technical Debt**: Modularization of large monolithic forms (`unified-content-form.tsx`, `schedule-import-modal.tsx`) in Phase 3/4.
- **Recommended Phase 3**: *Desktop Workspace Experience Hardening & Multi-Column Information Density*.
