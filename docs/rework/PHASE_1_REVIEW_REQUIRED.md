# VELQORA — PHASE 1: REVIEW REQUIRED CATALOG

---

## 1. PRESERVED MONOLITHIC & UTILITY COMPONENTS

| File Path | LOC | Current Status | Recommendation |
| :--- | :--- | :--- | :--- |
| `src/components/layout/language-switcher.tsx` | 89 | Preserved | Multilingual toggle candidate for Settings. |
| `src/components/modul/unified-content-form.tsx` | 1,374 | Active & Protected | Modularize tab panels in Phase 2. |
| `src/components/schedule/schedule-import-modal.tsx`| 1,176 | Active & Protected | Extract verification preview sub-component in Phase 2. |
| `src/components/modul/module-drive-explorer.tsx` | 1,146 | Active & Protected | Split tree navigator from file action toolbar in Phase 2. |

---

## 2. PROTECTED CORE STATUS

- All database queries, RLS policies, server actions, and AI multimodal pipelines remain 100% intact and verified.
