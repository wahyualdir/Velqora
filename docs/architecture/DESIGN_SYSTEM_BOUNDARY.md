# VELQORA — ARCHITECTURAL SPECIFICATION: DESIGN SYSTEM BOUNDARY

---

## 1. SHARED BRAND & DESIGN TOKEN FOUNDATION

### A. Surface Palette Tokens — "Warm Obsidian × Muted Terracotta" (Dark-First, Dual-Mode)

> **Full Specification**: See [WARM_OBSIDIAN_THEME_SPEC.md](./WARM_OBSIDIAN_THEME_SPEC.md) for the complete palette matrix, contrast calculations, anti-norak guardrails, component recipes, and migration map.

**Design Philosophy**: Velqora's visual identity centers on an editorial dark studio ("Warm Obsidian" — warm-tinted charcoal surfaces instead of pure void `#000000` or generic cool slate `#0F172A`) paired with muted terracotta heritage (`#D4664A` / `#C2553A`) and restrained Champagne Sand (`#E5C194`) telemetry markers. Light mode maintains full parity via "Warm Paper" (`#FAF8F5` / `#FFFFFF`). Legacy Win98 retro bevels are deprecated across modern web surfaces.

- **Warm Obsidian Dark Foundation (Default Mode — 85% of Viewport)**:
  - Canvas (L0): `#0B0A09` (`--color-background`) — warm obsidian charcoal
  - Primary Surface (L1): `#141210` (`--color-surface`) — elevated cards & shells
  - Secondary / Inset Surface (L2): `#1C1917` (`--color-surface-secondary`) — nested panels & code blocks
  - Interactive Chip / Hover (L3): `#24201D` -> `#2C2724`
  - Hairline Borders: `#292524` (hover `#3A3431`) — crisp `1px` separation, zero neon glare
  - Text Primary: `#F5F5F4` — warm ivory (avoids pure `#FFFFFF` halation)
  - Text Secondary: `#A8A29E` — warm stone (`~7.1:1` contrast)
  - Text Tertiary: `#8C857F` — readable muted metadata (`~4.8:1` contrast)

- **Warm Paper Light Foundation (Light Toggle Parity)**:
  - Base Background: `#FAF8F5` (`--color-background`)
  - Primary Surface: `#FFFFFF` (`--color-surface`)
  - Surface Secondary: `#F3EFE9`
  - Surface Tertiary: `#EAE4DC`
  - Border / Separators: `#E4DDD4` (hover `#C8BFB4`)
  - Text Primary: `#1C1917` / Secondary: `#57534E` / Tertiary: `#78716C`

- **App Surface (Mobile PWA — Unchanged)**:
  - Base Background: `#FFFFFF`
  - Primary Surface: `#F8FAFC`
  - Surface Hover: `#E2E8F0`
  - Border / Separators: `#E2E8F0`

### B. Terracotta Accent (5% Budget — Dark & Light Tuned)
- **Terracotta Ink / Highlight (Dark)**: `#D4664A` (Champagne highlight `#E5C194`)
- **Primary Button Fill (White Label Safe, `>= 4.5:1`)**: `#C2553A` (`brand-500`)
- **Interactive Hover**: `#B34B32` (dark) / `#A34530` (`brand-600`)
- **Soft Interactive Fill**: `rgba(212, 102, 74, 0.12)` (dark) / `rgba(194, 85, 58, 0.10)` (light)
- **Subtle Focus Ring**: `#D4664A` / `focus-visible:ring-brand-500`

**Why Terracotta?** No major edtech competitor (Notion, Coursera, Google
Classroom, Canva Learn) uses terracotta as primary accent. It evokes warmth,
academic heritage, and intentionality — qualities absent from generic
blue/indigo/teal palettes that dominate AI-generated output.

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
