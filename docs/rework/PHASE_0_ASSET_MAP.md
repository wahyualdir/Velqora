# VELQORA — PHASE 0: PUBLIC ASSET FORENSIC MAP

---

## 1. PUBLIC ASSET DISPOSITION MATRIX

| Asset Path | Size | Dimensions / Type | Usage Status | Disposition |
| :--- | :--- | :--- | :--- | :--- |
| `public/favicon.jpg` | 434.0 KB | JPG Icon | Active in `<head>` | **KEEP / OPTIMIZE** (convert to WebP/ICO) |
| `public/logo.jpg` | 434.0 KB | JPG Logo | Active in metadata | **KEEP / OPTIMIZE** |
| `public/logo.svg` | 0.7 KB | Vector SVG | Primary logo vector | **REQUIRED / KEEP** |
| `public/logo-banner.png` | 354.3 KB | Banner Graphic | Social OpenGraph & Auth Banner | **KEEP / OPTIMIZE** |
| `public/images/auth/login-doodle-wallpaper.png` | 274.5 KB | PNG Wallpaper | Auth wallpaper | **KEEP** |
| `public/icons/icon-192.png` | 434.0 KB | PWA Icon 192px | PWA manifest | **REQUIRED / KEEP** |
| `public/icons/icon-512.png` | 434.0 KB | PWA Icon 512px | PWA manifest | **REQUIRED / KEEP** |
| `public/icons/icon-maskable-512.png`| 434.0 KB | Maskable PWA Icon | PWA manifest | **REQUIRED / KEEP** |
| `public/icons/icon-192.svg` | 0.7 KB | Vector SVG Icon | Manifest SVG | **REQUIRED / KEEP** |
| `public/icons/icon-512.svg` | 0.7 KB | Vector SVG Icon | Manifest SVG | **REQUIRED / KEEP** |
| `public/icons/icon.svg` | 0.7 KB | Vector SVG Icon | Favicon vector | **REQUIRED / KEEP** |
| `public/qr-mobile.png` | 1.8 KB | PNG QR Code | Used on `/download` page | **REQUIRED / KEEP** |
| `public/manifest.json` | 1.8 KB | JSON Manifest | PWA Web App Manifest | **REQUIRED / KEEP** |
| `public/sw.js` | 2.9 KB | Service Worker JS | PWA Offline Service Worker | **REQUIRED / KEEP** |

---

## 2. ASSET HYGIENE AUDIT RESULTS

- **Total Public Assets**: 14 files.
- **Unused / Orphaned Assets**: 0 (Legacy `ml-logo.jpg` 625 kB was already permanently cleaned in Phase 1).
- **Optimization Candidates**: Large PNGs/JPGs can be compressed in Phase 1 asset hygiene.
