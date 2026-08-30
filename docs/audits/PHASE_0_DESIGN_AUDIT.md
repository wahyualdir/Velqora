# VELQORA — PHASE 0: DESIGN & VISUAL SYSTEM AUDIT

---

## 1. CURRENT COLOR MAP

### Dark Foundation (Active Theme Default):
- **Base Background**: `#090D16` (`--color-background`)
- **Primary Surface**: `#0F172A` (`--color-surface`)
- **Surface Hover**: `#1E293B` (`--color-surface-hover`)
- **Secondary Surface / Card Muted**: `#162036`
- **Border / Divider**: `#1E293B` (hover `#334155`)
- **Text Primary**: `#F8FAFC` (`--color-text-primary`)
- **Text Secondary**: `#94A3B8` (`--color-text-secondary`)
- **Text Tertiary / Muted**: `#64748B`

### Light Foundation (Theme Option):
- **Base Background**: `#F8FAFC`
- **Primary Surface**: `#FFFFFF`
- **Surface Hover**: `#F1F5F9`
- **Border / Divider**: `#E2E8F0`
- **Text Primary**: `#0F172A`
- **Text Secondary**: `#475569`

### Accent Scale (Precision Blue):
- **Primary Brand Accent**: `#2563EB` (`brand-600`)
- **Secondary Accent**: `#3B82F6` (`brand-500`)
- **Soft Accent Fill**: `rgba(37, 99, 235, 0.1)` (`bg-brand-500/10`)
- **Subtle Accent Border**: `rgba(59, 130, 246, 0.25)`

### Semantic Status Colors:
- **Success / Completed**: `#10B981` (Emerald)
- **Warning / Pending**: `#F59E0B` (Amber)
- **Danger / Overdue**: `#EF4444` (Rose)
- **Informational**: `#3B82F6` (Blue)

---

## 2. SEVERITY CLASSIFICATION OF UI & DESIGN PATTERNS

| Severity | Issue Description | Location / Examples | Impact | Future Rework Remedy |
| :--- | :--- | :--- | :--- | :--- |
| **P0** | Multi-column desktop grids rendered on narrow viewports causing horizontal clipping | Old schedule calendar, statistics table | Breaks mobile usability | Wrap views in `ExperienceAdaptive` with dedicated desktop vs mobile layouts |
| **P1** | Competing primary CTA buttons on a single screen | Forms with 2+ `variant="primary"` buttons | Confuses user priority | Enforce 1 primary CTA rule per viewport context |
| **P1** | Overly nested card wrappers (Card in Card in Card) | Module file explorer, settings panels | Creates visual clutter | Flatten into sections, divider lines, and rows |
| **P2** | Inconsistent badge styles and pill radiuses | Modul tags, status indicators | Visual noise | Standardize on semantic badge primitives with unified font and padding |
| **P3** | Residual unstandardized icon sizes | Various custom icons (14px vs 16px vs 18px) | Minor misalignment | Standardize on 16px (`w-4 h-4`) standard icon scale with strict Lucide family |

---

## 3. FUTURE DESIGN DIRECTIONS

### Web Desktop Vision (Professional Learning Workspace):
- **Aesthetic**: Calm, editorial, structured, dense, precise.
- **Ratio**: 75–85% neutral surfaces, 10–20% borders/text contrast, 5–10% single Precision Blue accent.
- **Layout**: Multi-column grids, persistent sidebar, split-view panels, data tables with `...` action menus.

### Mobile App Vision (Personal Learning App):
- **Aesthetic**: Fast, touch-first, comfortable, thumb-friendly.
- **Default**: Light-first / clean surface presentation with high contrast.
- **Navigation**: 5-destination bottom navigation bar (**Beranda**, **Materi**, **Tugas**, **Modul**, **Menu**) + modal bottom sheets.
