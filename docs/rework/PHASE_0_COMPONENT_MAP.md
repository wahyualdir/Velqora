# VELQORA — PHASE 0: COMPONENT ARCHITECTURE & MONOLITHIC MAP

---

## 1. COMPONENT CLASSIFICATION & RESPONSIBILITY

### A. Desktop Workspace Primitives (`src/components/layout/desktop/`)
- `DesktopWorkspace`: Base container providing persistent sidebar offset (245px/68px).
- `DesktopTopBar`: Context bar with Spotlight search (`Ctrl + K`), system telemetry, and user profile.
- `DesktopTable`: High-density structured table for Tasks, Schedules, and Files with `...` action menus.

### B. Mobile App Primitives (`src/components/layout/mobile/` & `layout/`)
- `MobileAppShell`: Single-column container with safe-area padding (`env(safe-area-inset-bottom)`).
- `MobileTopBar`: Compact header with back navigation and contextual actions.
- `MobileBottomNav`: Fixed 5-destination bottom navigation bar (**Beranda**, **Materi**, **Tugas**, **Modul**, **Menu**).
- `MobileBottomSheet`: Modal touch drawer for contextual actions.
- `MobileMenuDrawer`: Slide-over drawer for secondary tools.

### C. Shared Primitives (`src/components/ui/`)
- `Button`, `Input`, `Dialog`, `Sheet`, `Badge`, `DropdownMenu`, `Logo`.

---

## 2. MONOLITHIC COMPONENT INVENTORY (>300 LOC)

| File Path | Lines | Classification | Recommended Action |
| :--- | :--- | :--- | :--- |
| `src/actions/study-actions.ts` | 2,755 | Server Action Monolith | **PROTECTED** — Preserve backward-compatible exports. Split into domain action modules in Phase 1/2. |
| `src/actions/schedule-actions.ts`| 2,273 | Server Action Monolith | **PROTECTED** — Preserve backward-compatible exports. Split into domain action modules in Phase 1/2. |
| `src/components/modul/unified-content-form.tsx` | 1,374 | Multi-step Form | **NEEDS REVIEW** — Decompose into separate sub-tab forms (metadata, content, file upload). |
| `src/lib/file-converter.ts` | 1,326 | Library Engine | **PROTECTED** — Core conversion engine. |
| `src/components/schedule/schedule-import-modal.tsx`| 1,176 | Large Modal | **NEEDS REVIEW** — Extract preview table and verification checks into dedicated sub-components. |
| `src/components/modul/module-drive-explorer.tsx` | 1,146 | Large File Explorer | **NEEDS REVIEW** — Extract tree navigation from preview pane. |
| `src/components/layout/sidebar/sidebar.tsx` | 723 | Layout Navigation | **SAFE TO REFINE** — Desktop 245px sidebar. |
| `src/components/layout/command-palette.tsx` | 624 | Spotlight Search | **SAFE TO REFINE** — Clean keyboard shortcut dialog. |
| `src/context/theme-accent-context.tsx` | 506 | Context State | **PROTECTED** — Design system tokens provider. |

---

## 3. CODE DUPLICATION AUDIT

| Duplication Category | Identified Files | Risk Level | Action Strategy |
| :--- | :--- | :---: | :--- |
| **Empty States** | Embedded in multiple pages | LOW | Normalize across shared `EmptyState` component. |
| **Loading Skeletons** | Inline skeletons in 5+ pages | LOW | Standardize around `.skeleton` and `Skeleton` primitive. |
| **Category Badges** | Repetitive badge class names | LOW | Enforce semantic badge tokens (`Badge variant="neutral"`). |
