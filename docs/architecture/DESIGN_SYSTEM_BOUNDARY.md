# VELQORA — ARCHITECTURAL SPECIFICATION: DESIGN SYSTEM BOUNDARY

---

## 1. SHARED BRAND & DESIGN TOKEN FOUNDATION

### A. Surface Palette Tokens
- **Dark Neutral Foundation (70–85% of Viewport)**:
  - Base Background: `#090D16` (`--color-background`)
  - Primary Surface: `#0F172A` (`--color-surface`)
  - Surface Hover: `#1E293B` (`--color-surface-hover`)
  - Card Secondary: `#162036`
  - Border / Separators: `#1E293B` (hover `#334155`)
- **Light Neutral Foundation (Theme Option / Clean Presentation)**:
  - Base Background: `#F8FAFC`
  - Primary Surface: `#FFFFFF`
  - Surface Hover: `#F1F5F9`
  - Border / Separators: `#E2E8F0`

### B. Precision Blue Accent (5–10% of Viewport)
- **Primary Brand Accent**: `#2563EB` (`brand-600`)
- **Secondary Accent**: `#3B82F6` (`brand-500`)
- **Soft Interactive Fill**: `rgba(37, 99, 235, 0.1)` (`bg-brand-500/10`)
- **Subtle Focus Ring**: `#3B82F6` (`focus-visible:ring-brand-500`)

### C. Anti-Slop Strict Invariants
- Strictly **0 gradient text** (`bg-clip-text`).
- Strictly **0 neon glow drop-shadows** (`shadow-[0_0_...]`).
- Strictly **0 bouncing icons or pulsating lines** (`animate-bounce` / `animate-pulse`).
- Strictly **0 arbitrary multi-nested card containers**.

---

## 2. WEB VS MOBILE DESIGN SYSTEM CALIBRATION

| Dimension | Web Desktop Workspace ($\ge 1024\text{px}$) | Mobile App Companion ($< 768\text{px}$) |
| :--- | :--- | :--- |
| **Typography Scale** | Standard Display (`text-2xl font-bold font-display`) | Compact Display (`text-lg font-bold font-display`) |
| **Container Padding**| Generous (`p-6` to `p-8`, `max-w-7xl` / `80rem`) | Compact (`p-4` with safe area padding) |
| **Component Spacing**| `gap-6`, `space-y-6` | `gap-3.5`, `space-y-3.5` |
| **Button Hierarchy** | 1 Primary (`brand-600`), 1-2 Secondary (`outline`/`ghost`) | 1 Full-width Primary CTA ($\ge 48\text{px}$ height) |
| **Interactive Menus**| Contextual Dropdown (`...`) on table rows | Tap row $\to$ Modal bottom sheet |
| **Touch Boundaries** | Optimized for mouse precision & click | Minimum $48\text{px} \times 48\text{px}$ touch targets |
| **Corners & Borders**| Subtle rounded corners (`rounded-xl` / `12px`) | Ergonomic rounded cards (`rounded-2xl` / `16px`) |
