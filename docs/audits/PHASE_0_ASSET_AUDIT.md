# VELQORA — PHASE 0: ASSET AUDIT & INVENTORY

---

## 1. PUBLIC DIRECTORY ASSET SCAN

| File Name | File Path | Size | File Type | Status | Action Plan |
| :--- | :--- | :---: | :--- | :---: | :--- |
| `logo.svg` | `public/logo.svg` | 752 B | Vector SVG | **Active** | **KEEP** — Official clean brand vector logo. |
| `logo.jpg` | `public/logo.jpg` | 444 kB | JPEG Image | **Redundant** | **ARCHIVE / OPTIMIZE** — Replace heavy JPG with SVG or optimized WebP. |
| `favicon.jpg` | `public/favicon.jpg` | 444 kB | JPEG Image | **Overweight** | **OPTIMIZE LATER** — Convert to standard 32x32 `.ico` or SVG favicon (<10 kB). |
| `logo-banner.png` | `public/logo-banner.png` | 362 kB | PNG Image | **Active** | **KEEP** — Used in social meta graph / documentation. |
| `ml-logo.jpg` | `public/ml-logo.jpg` | 625 kB | JPEG Image | **Legacy** | **ARCHIVE** — Unused legacy machine learning logo. |
| `qr-mobile.png` | `public/qr-mobile.png` | 1.8 kB | PNG Image | **Active** | **KEEP** — Used in desktop PWA install modal / download QR. |
| `manifest.json` | `public/manifest.json` | 1.8 kB | JSON Manifest | **Active** | **KEEP** — PWA standalone manifest configuration. |
| `sw.js` | `public/sw.js` | 2.9 kB | Service Worker | **Active** | **KEEP** — PWA offline caching & lifecycle handlers. |
| `icon-192.png` | `public/icons/icon-192.png` | 444 kB | PNG Image | **Active** | **OPTIMIZE LATER** — Compress to <25 kB. |
| `icon-512.png` | `public/icons/icon-512.png` | 444 kB | PNG Image | **Active** | **OPTIMIZE LATER** — Compress to <50 kB. |
| `icon-maskable-512.png` | `public/icons/icon-maskable-512.png` | 444 kB | PNG Image | **Active** | **OPTIMIZE LATER** — Compress to <50 kB. |
| `icon-192.svg` / `icon-512.svg` | `public/icons/*.svg` | ~750 B | Vector SVG | **Active** | **KEEP** — Lightweight vector app icons. |
| `login-doodle-wallpaper.png` | `public/images/auth/login-doodle-wallpaper.png` | 281 kB | PNG Image | **Active** | **KEEP** — Clean auth screen backdrop. |

---

## 2. ASSET HYGIENE CLASSIFICATION SUMMARY

- **KEEP (Active & Essential)**: 9 assets (`logo.svg`, `icon-192.svg`, `icon-512.svg`, `qr-mobile.png`, `manifest.json`, `sw.js`, `logo-banner.png`, `login-doodle-wallpaper.png`, `public/icons/*`).
- **OPTIMIZE (Oversized Images)**: 4 assets (`favicon.jpg`, `logo.jpg`, `icon-192.png`, `icon-512.png`).
- **ARCHIVE (Unused / Legacy)**: 1 asset (`ml-logo.jpg`).
- *Note: In accordance with Phase 0 rules, no files have been deleted at this stage.*
