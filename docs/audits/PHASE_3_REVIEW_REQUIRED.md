# VELQORA — PHASE 3: REVIEW REQUIRED CATALOG

---

## 1. PRESERVED COMPONENTS FOR ONGOING REVIEW

| File Path | Classification | Current Status | Recommendation |
| :--- | :--- | :--- | :--- |
| `src/components/layout/language-switcher.tsx` | UI Utility | Preserved | Integrate into Settings or Desktop Navbar if multilingual feature is enabled. |
| `src/components/modul/unified-content-form.tsx` | Large Component (1,374 lines) | Active & Protected | Modularize step components in Phase 4 without breaking schema. |
| `src/components/schedule/schedule-import-modal.tsx` | Large Component (1,176 lines) | Active & Protected | Modularize preview and verification table in Phase 4. |
| `src/components/modul/module-drive-explorer.tsx` | Large Component (1,146 lines) | Active & Protected | Modularize file hierarchy and action bar in Phase 4. |

---

## 2. MODULARIZATION BACKLOG FOR SUBSEQUENT PHASES

1. **Step-by-step Form Decomposition**: Decompose multi-tab forms into distinct sub-components.
2. **File Explorer Decomposition**: Split tree navigation from contextual action ribbons.
3. **Action Domain Splitting**: Segregate `study-actions.ts` into specific domain actions while maintaining backward-compatible facade exports.
