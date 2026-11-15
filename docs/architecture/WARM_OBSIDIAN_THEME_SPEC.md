# VELQORA — THEME & VISUAL DESIGN SPECIFICATION: WARM OBSIDIAN × MUTED TERRACOTTA

> **Status**: Active Single Source of Truth (SSOT)  
> **Default Mode**: Dark-First (`Warm Obsidian`) with full Light Mode Parity (`Warm Paper`)  
> **Aesthetic Direction**: Refined Dark Editorial Studio & Modern Academic Workspace  
> **Replaces**: Legacy Windows 98 / Cream Retro OS Chrome (`#ECE9D8`, sharp bevel borders, `.EXE` faux window framing)

---

## 1. DESIGN PHILOSOPHY & CORE CONCEPT

Velqora is an Indonesian academic engineering, science, and polyglot coding platform. Learners spend hours reading dense mathematical notation (KaTeX), code blocks, and multi-chapter technical notes.

Previously, Velqora used a cream retro desktop motif (`#FAF8F5` + `#ECE9D8` Win98 bevels). Replacing that with a dark theme requires strict restraint so the interface **does not become "norak" (tacky, neon-heavy, sci-fi cliché, or unreadable)**:

1. **Warm Black, Never Pure Void or Cool Blue-Slate**: Pure `#000000` + `#FFFFFF` causes text halation (glare/eye fatigue). Cool `#0F172A` slate feels like generic SaaS templates and clashes with warm terracotta. Instead, Velqora uses **Warm Obsidian (`#0B0A09` → `#141210` → `#1C1917`)** — deep stone-tinted charcoal blacks with subtle warm undertones.
2. **Depth via Luminance Stepping & `1px` Hairlines, Never Bevels or Neon Glow**: Card hierarchy is created by stepping surface luminance (`+4%` per layer) paired with crisp `1px solid #292524` borders and a delicate `inset 0 1px 0 rgba(255, 248, 240, 0.04)` top edge sheen. Strictly **zero Win98 3D bevels** (`2px` white/gray borders) and **zero colored neon drop-shadows**.
3. **85 / 10 / 5 Chromatic Budget**:
   - **85% Quiet Canvas & Typography**: Obsidian surfaces (`#0B0A09`, `#141210`) + Warm Ivory / Stone text (`#F5F5F4`, `#A8A29E`).
   - **10% Structural Chrome**: Hairline borders (`#292524`), subtle inset cards (`#1C1917`), muted metadata pills.
   - **5% Intentional Accent**: Muted Terracotta (`#C2553A` fill / `#D4664A` ink & edge highlight) and sparing Champagne Sand (`#E5C194`) telemetry markers.

---

## 2. OFFICIAL COLOR PALETTE & CONTRAST MATRIX

### A. Primary Theme — Dark Mode (`Warm Obsidian`, Default)

| Layer / Role | Token Name | Hex / Value | WCAG Notes / Usage |
| :--- | :--- | :--- | :--- |
| **Canvas (L0)** | `--color-background` | `#0B0A09` | Page root background; never pure `#000000`. |
| **Surface (L1)** | `--color-surface` | `#141210` | Primary cards, explorer shells, main content containers. |
| **Surface Alt / Sidebar** | `--color-sidebar` | `#100E0D` | Sticky navigation rail / dock base. |
| **Elevated / Inset (L2)** | `--color-surface-secondary` | `#1C1917` | Code blocks, metric tiles, nested sub-panels, hover surfaces. |
| **Interactive Chip (L3)** | `--color-surface-tertiary` | `#24201D` | Active tags, input backgrounds, pill tracks. |
| **Interactive Hover** | `--color-surface-hover` | `#2C2724` | Button hover / table row hover in dark mode. |
| **Sticky Glass Header** | *(Tailwind utility)* | `rgba(11, 10, 9, 0.84)` | Paired with `backdrop-blur-md` and `1px` `#292524` bottom border. |
| **Border Default** | `--color-border` | `#292524` | Clean `1px` hairline structural divider. |
| **Border Hover / Active** | `--color-border-hover` | `#3A3431` | Subtle warm edge lift on hover. |
| **Text Primary** | `--color-text-primary` | `#F5F5F4` | Warm Ivory headlines & body copy (~17.5:1 on `#141210`, zero harsh `#FFFFFF` glare). |
| **Text Secondary** | `--color-text-secondary` | `#A8A29E` | Warm Stone subtitles, descriptions, labels (~7.1:1 on `#141210`, WCAG AAA). |
| **Text Tertiary / Caption** | `--color-text-tertiary` | `#8C857F` | Micro-labels, readable timestamps (~4.8:1 on `#141210`, WCAG AA). |
| **Muted Placeholder / Icon** | *(Tailwind / Utility)* | `#6E6863` | Disabled states, decorative indices, subtle rules (not for critical small text). |

### B. Terracotta & Supporting Accents (Dark Mode Tuned)

> **Critical Engineering Rule on Contrast**:  
> Light/pastel terracotta (`#D4664A`) has high contrast as **colored text/icons on dark obsidian (`~5.1:1`)**, whereas deeper terracotta (`#C2553A`) maintains **`>= 4.5:1` contrast with crisp white/ivory button labels**. Never put `#FFFFFF` normal-size text on bright `#E07A5F` — always pair white labels with `#C2553A` (hover `#B34B32`) or `#D4664A` text on `#141210`.

| Accent Role | Hex / Value | Usage |
| :--- | :--- | :--- |
| **Terracotta CTA Fill** | `#C2553A` (Hover `#B34B32`, Top edge `#D4664A/60`) | Primary filled buttons (`Mulai Belajar`, `Masuk`, `Submit`) with `#FFFBF8` text (`4.5:1+` contrast). |
| **Terracotta Ink / Icon** | `#D4664A` (Soft hover `#E07A5F`) | Colored links, inline emphasis, active nav indicator, brand mark highlight on dark `#0B0A09`/`#141210`. |
| **Terracotta Soft Tint** | `rgba(212, 102, 74, 0.12)` | Active pill/badge fill, selection highlight (`selection:bg-[#D4664A]/20`). |
| **Terracotta Soft Border** | `rgba(212, 102, 74, 0.32)` | Active badge/tab border and keyboard focus ring (`focus-visible:ring-[#D4664A]`). |
| **Champagne Sand Highlight** | `#E5C194` | Sparing monospace telemetry values, version badges, subtle italic editorial accent (`~11.5:1` on `#141210`). |

### C. Semantic Status Tokens (Desaturated for Eye Comfort)

| Status | Ink | Surface Fill | Border |
| :--- | :--- | :--- | :--- |
| **Verified / Ready / Online** | `#34D399` | `rgba(52, 211, 153, 0.10)` | `rgba(52, 211, 153, 0.28)` |
| **In Progress / Drafting** | `#E5B567` | `rgba(229, 181, 103, 0.10)` | `rgba(229, 181, 103, 0.28)` |
| **Under Review / Neutral** | `#A8A29E` | `rgba(168, 162, 158, 0.10)` | `rgba(168, 162, 158, 0.22)` |
| **Error / Destructive** | `#F87171` | `rgba(248, 113, 113, 0.10)` | `rgba(248, 113, 113, 0.28)` |

### D. Secondary Mode — Light Mode Parity (`Warm Paper`)

Users who manually toggle light mode via the theme switcher receive balanced warm-paper surfaces paired with the exact same typography, spacing, and muted terracotta heritage:

| Role | Light Hex | Purpose |
| :--- | :--- | :--- |
| `--color-background` | `#FAF8F5` | Warm archival paper canvas |
| `--color-surface` | `#FFFFFF` | Clean elevated cards |
| `--color-surface-secondary` | `#F3EFE9` | Nested sections & inset panels |
| `--color-surface-tertiary` | `#EAE4DC` | Subtle chips & active tracks |
| `--color-border` | `#E4DDD4` | Clean `1px` warm stone border (hover `#C8BFB4`) |
| `--color-text-primary` | `#1C1917` | Warm espresso charcoal ink |
| `--color-text-secondary` | `#57534E` | Warm medium stone |
| `--color-text-tertiary` | `#78716C` | Muted captions |
| Primary CTA Fill | `#C2553A` | Hover `#A34530`, soft fill `rgba(194, 85, 58, 0.10)` |

---

## 3. ANTI-NORAK ("ANTI-GAUDY") GUARDRAILS

Any UI addition or refactor in Velqora MUST follow these strict invariants:

1. **Zero Neon Glows**: Never use saturated `box-shadow: 0 0 20px rgba(...)` or cyberpunk borders. Subtle atmospheric radial warmth on hero/background must remain under **6% opacity** (`rgba(212, 102, 74, 0.055)`).
2. **Zero Rainbow Gradient Text**: Headlines stay crisp solid Warm Ivory (`#F5F5F4`) or editorial italic Champagne Sand/Terracotta accent — never multi-color `bg-clip-text` gradients.
3. **Zero Legacy Win98 Retro Chrome on Modern Shells**:
   - Do **not** add `2px` sharp white/black outset bevels (`border-top: #fff`, `border-right: #7A756D`).
   - Do **not** render fake `.EXE` window suffixes, non-functional `_ □ ×` titlebar buttons, or dead `File  Edit  View  Help` toolbars on modern pages, auth screens, or workspace headers.
   - Replace `rounded-none` sharp OS frames with clean modern curvature (`rounded-2xl` / `16px` for cards & dialogs, `rounded-xl` / `12px` for inputs & nested panels, `rounded-lg` / `8px` for buttons & pills).
4. **Pure Neutral Dark Readability for Long-Form Learning**:
   - Module prose, KaTeX math (`$...$`), and code blocks (`CodeBlock`) must sit on `#141210` / `#1C1917` with `#F5F5F4` / `#E7E5E4` text and generous `leading-[1.75]` line height.
   - Syntax highlighting uses balanced muted colors (warm coral, sage, soft amber, cool mist) rather than neon cyan/magenta.
5. **Single Accent Discipline**: Keep terracotta highlights reserved for primary CTAs, active tabs/nav states, interactive focus rings, and at most one focal metric/tag per card.

---

## 4. TYPOGRAPHY & VISUAL HIERARCHY

| Element | Font Stack Token | Size / Weight | Color Token |
| :--- | :--- | :--- | :--- |
| **Display Hero (`h1`)** | `font-display` (`Plus Jakarta Sans`) + optional `font-serif italic` (`Fraunces`) | `text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08]` | `#F5F5F4` (Light: `#1C1917`), italic key phrase `#E5C194` or `#D4664A` |
| **Section Title (`h2`)** | `font-display` | `text-2xl sm:text-3xl font-bold tracking-tight` | `#F5F5F4` |
| **Card Title (`h3`)** | `font-display` | `text-base sm:text-lg font-semibold tracking-tight` | `#F5F5F4` |
| **UI Body / Prose** | `font-sans` (`Inter`) | `14px–16px`, `leading-relaxed` (`1.6–1.75`) | `#A8A29E` / `#E7E5E4` |
| **Technical Meta / Telemetry / Stats** | `font-mono` (`JetBrains Mono`) | `10px–12px`, `tabular-nums`, `tracking-wider` | `#8C857F` or `#E5C194` |

---

## 5. COMPONENT STYLING PATTERNS (DO & DON'T)

### Card Container (Surface L1)
- **Dark**: `bg-[#141210] border border-[#292524] rounded-2xl shadow-[inset_0_1px_0_rgba(255,248,240,0.04),0_12px_32px_-14px_rgba(0,0,0,0.65)]`
- **Light**: `bg-white border border-[#E4DDD4] rounded-2xl shadow-[0_8px_28px_-14px_rgba(28,25,23,0.08)]`
- **Or via semantic tokens**: `bg-surface border border-border rounded-2xl`

### Nested Card / Code Container (Surface L2)
- `bg-[#F3EFE9] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] rounded-xl`

### Primary CTA Button
- `bg-[#C2553A] hover:bg-[#B34B32] active:bg-[#9E3F29] text-[#FFFBF8] border border-[#D4664A]/40 rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] transition-all duration-150`

### Secondary / Ghost Surface Button
- `bg-[#F3EFE9] dark:bg-[#1C1917] hover:bg-[#EAE4DC] dark:hover:bg-[#24201D] text-[#1C1917] dark:text-[#F5F5F4] border border-[#D6CFC5] dark:border-[#292524] hover:dark:border-[#3A3431] rounded-lg transition-all duration-150`

### Form Input
- `bg-white dark:bg-[#0F0E0D] border border-[#D6CFC5] dark:border-[#292524] focus:border-[#D4664A] focus:ring-2 focus:ring-[#D4664A]/20 rounded-xl text-[#1C1917] dark:text-[#F5F5F4] placeholder:text-[#8A8378] dark:placeholder:text-[#6E6863]`

### Legacy `.vt-*` Classes in `globals.css`
All legacy `.vt-window`, `.vt-window-inset`, `.vt-titlebar`, `.vt-btn-terracotta`, `.vt-btn-chrome`, `.vt-btn-amber`, and `.vt-desktop-bg` selectors in [globals.css](file:///c:/Users/ACER/Documents/coba/Koleksi%20Belajar/src/app/globals.css) are mapped directly to Warm Obsidian × Muted Terracotta modern elevation (hairline `1px` borders, subtle top sheen, refined radius defaults) so shared workspace pages remain 100% cohesive automatically without breaking existing class names.

---

## 6. MOTION & INTERACTION CALIBRATION

- **Shared Motion Primitives**: [src/components/os/motion-primitives.tsx](file:///c:/Users/ACER/Documents/coba/Koleksi%20Belajar/src/components/os/motion-primitives.tsx) (`VelqoraMotionProvider`, `ScrollProgressBar`, `CountUpNumber`, `RevealSection`, `StaggerContainer`, `StaggerItem`, `AnimatedProgressBar`).
- **Smooth Editorial Easing**: `EASE_SMOOTH = [0.22, 1, 0.36, 1]` (`0.35s–0.55s`), spring hover/tap via `SPRING_SNAPPY`.
- **Reduced Motion**: Always honor `@media (prefers-reduced-motion: reduce)` and `html[data-motion="reduced"]` (`MotionConfig reducedMotion="user"`).
- **Hover Discipline**: Subtle `-2px` card elevation + `#3A3431` hairline border brighten + quiet terracotta chevron nudge. Zero bouncy cartoons.

---

## 7. SINGLE SOURCE OF TRUTH FILE MAP (FOR FUTURE AGENTS)

Before modifying any UI, theme, or component color, verify tokens against these exact files:

1. **Theme Documentation (this spec)**: [docs/architecture/WARM_OBSIDIAN_THEME_SPEC.md](file:///c:/Users/ACER/Documents/coba/Koleksi%20Belajar/docs/architecture/WARM_OBSIDIAN_THEME_SPEC.md)
2. **Design System Boundary**: [docs/architecture/DESIGN_SYSTEM_BOUNDARY.md](file:///c:/Users/ACER/Documents/coba/Koleksi%20Belajar/docs/architecture/DESIGN_SYSTEM_BOUNDARY.md)
3. **CSS Variables & Utility Primitives**: [src/app/globals.css](file:///c:/Users/ACER/Documents/coba/Koleksi%20Belajar/src/app/globals.css)
4. **Default Theme Mode (`defaultTheme="dark"`)**: [src/components/layout/theme-provider.tsx](file:///c:/Users/ACER/Documents/coba/Koleksi%20Belajar/src/components/layout/theme-provider.tsx)
5. **User Theme Customizer Context**: [src/context/theme-accent-context.tsx](file:///c:/Users/ACER/Documents/coba/Koleksi%20Belajar/src/context/theme-accent-context.tsx)
6. **Landing Shell & OS Components**: [src/app/page.tsx](file:///c:/Users/ACER/Documents/coba/Koleksi%20Belajar/src/app/page.tsx) and `src/components/os/*`
7. **Auth Pages**: `src/app/(auth)/login/page.tsx`, `register/page.tsx`, `reset-password/page.tsx`
8. **Dashboard Workspace Shell**: `src/surfaces/web/layout/desktop-top-bar.tsx`, `src/components/layout/sidebar/sidebar.tsx`, `src/surfaces/web/dashboard/*`

### Quick Verification Checklist for Agents Adding New Features
- [ ] Does dark mode use `#0B0A09` / `#141210` / `#1C1917` instead of generic slate `#0F172A` or `#000000`?
- [ ] Are borders `1px solid #292524` (or `border-border`) with no retro bevels or `rounded-none` harsh boxes?
- [ ] Does primary body text use `#F5F5F4` / `#A8A29E` (`>= 4.5:1` contrast)?
- [ ] Are white-text terracotta CTAs `#C2553A` (with `#B34B32` hover) while colored terracotta icons/text use `#D4664A`?
- [ ] Does light mode toggle still render cleanly with `#FAF8F5` / `#FFFFFF` / `#1C1917`?
