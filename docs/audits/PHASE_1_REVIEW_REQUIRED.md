# VELQORA — PHASE 1: REVIEW REQUIRED CATALOG

---

## 1. PRESERVED CANDIDATES FOR REVIEW

The following files were inspected during Phase 1. Rather than being deleted blindly, they have been preserved in place and cataloged for explicit review during subsequent modularization phases:

| File Path | Description | Current Safety Assessment | Recommendation |
| :--- | :--- | :--- | :--- |
| `src/components/layout/language-switcher.tsx` | Multi-language dropdown selector | Safe, non-breaking utility | Keep in place; integrate into Settings Appearance or Desktop Navbar if multi-language is toggled on. |
| `src/components/schedule/missed-session-recovery-modal.tsx` | Schedule Intelligence recovery modal | Domain model modal | Keep in place for Phase 3/4 schedule orchestration workflows. |
| `src/components/schedule/reschedule-impact-modal.tsx` | Schedule Intelligence simulation modal | Domain model modal | Keep in place for Phase 3/4 schedule simulation workflows. |

---

## 2. MODULARIZATION BACKLOG FOR PHASE 2+

1. `unified-content-form.tsx`: Break into sub-step forms.
2. `schedule-import-modal.tsx`: Break into dropzone, verification table, and error step.
3. `module-drive-explorer.tsx`: Break into file tree navigator and action toolbar.
4. `study-actions.ts`: Split into `module-actions`, `material-actions`, `comment-actions`.
5. `schedule-actions.ts`: Split into `schedule-db-actions`, `schedule-import-actions`.
