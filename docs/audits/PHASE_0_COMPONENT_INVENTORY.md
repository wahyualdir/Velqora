# VELQORA — PHASE 0: COMPONENT FORENSIC INVENTORY

---

## 1. LARGEST COMPONENTS FORENSIC AUDIT

Components exceeding standard maintainability boundaries (>300 lines):

| Component Path | Lines | Primary Purpose | Refactoring / Decomposition Recommendation |
| :--- | :---: | :--- | :--- |
| `src/actions/study-actions.ts` | 2,755 | Server actions for modules, materials, comments | Split into modular action domains (`module-actions`, `material-actions`, `comment-actions`) in future phases. |
| `src/actions/schedule-actions.ts` | 2,273 | Schedule database mutations & import pipelines | Split into `schedule-db-actions`, `schedule-import-actions`. |
| `src/components/modul/unified-content-form.tsx` | 1,374 | Multi-tab module/project creation & drive manager | Split into step sub-components (`BasicInfoStep`, `DriveUploadStep`, `CurriculumStep`). |
| `src/lib/file-converter.ts` | 1,326 | Client-side & server-side document transformations | Keep core library, isolate format handlers. |
| `src/components/schedule/schedule-import-modal.tsx` | 1,176 | Document upload, OCR verification & conflict matrix | Split preview, verification table, and error step into separate primitives. |
| `src/components/modul/module-drive-explorer.tsx` | 1,146 | File hierarchy, drag-and-drop, tree navigator | Break down file tree item and action bar. |
| `src/app/dashboard/statistik/page.tsx` | 753 | Comprehensive analytics page | Break down metric cards and chart containers. |
| `src/components/modul/module-file-previewer-modal.tsx` | 731 | PDF, Docx, Code, Image modal viewer | Modularize previewers by MIME type. |
| `src/components/layout/sidebar/sidebar.tsx` | 723 | 245px/68px desktop navigation sidebar | Extract category item renderer and collapsible logic. |
| `src/app/dashboard/panduan/page.tsx` | 694 | User documentation & shortcuts | Extract accordion groups. |
| `src/components/ui/tech-icon/brand-icons-registry.tsx` | 631 | SVG brand icon path registry | Maintain as static registry. |
| `src/components/layout/command-palette.tsx` | 624 | Spotlight search (`Ctrl + K`) dialog | Extract search indexing and shortcut triggers. |
| `src/app/dashboard/konversi/page.tsx` | 601 | File converter studio workbench | Extract format selector and queue table. |
| `src/app/dashboard/jadwal/page.tsx` | 591 | Main calendar & schedule manager | Separate calendar grid from agenda list. |
| `src/app/dashboard/materi/[id]/page.tsx` | 586 | Material reader and note taker | Separate document viewer from comments sidebar. |
| `src/app/(auth)/register/page.tsx` | 577 | Register page & OAuth providers | Extract OAuth group and password strength meter. |
| `src/app/(auth)/login/page.tsx` | 518 | Login page & recovery links | Extract login form from background wrapper. |
| `src/components/modul/smart-module-sorter-modal.tsx` | 509 | Drag-and-drop syllabus organizer | Extract list item handle. |
| `src/components/layout/user-profile-menu.tsx` | 491 | User profile dropdown & status menu | Extract menu item rows. |

---

## 2. DUPLICATE & OVERLAPPING PATTERNS IDENTIFIED

1. **Header Components**:
   - `DesktopWorkspaceHeader` vs `DashboardHeader` vs `ModuleHeader` vs `AITutorHeader`.
   - *Recommendation*: Standardize around a canonical `PageHeader` primitive with configurable slots for badges and action buttons.
2. **List Item Primitives**:
   - `ModuleListItem` vs `MobileModuleList` vs `MobileMaterialList` vs `MobileTaskList`.
   - *Recommendation*: Preserve domain data adapters while sharing underlying typography and touch-target tokens.
3. **Empty States**:
   - Multiple local inline empty states across subpages.
   - *Recommendation*: Use canonical `src/components/ui/empty-state.tsx`.
