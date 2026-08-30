# VELQORA — PHASE 0: PWA & APP DISTRIBUTION AUDIT

---

## 1. PWA CONFIGURATION INVENTORY

- **Manifest File**: `public/manifest.json`
  - `name`: "Velqora — Platform Belajar & Produktivitas Akademik"
  - `short_name`: "Velqora"
  - `start_url`: "/dashboard"
  - `display`: "standalone"
  - `theme_color`: "#090d16"
  - `background_color`: "#090d16"
  - `icons`: Includes 192x192, 512x512, and maskable icons.
- **Service Worker**: `public/sw.js`
  - Pre-caches core app shell, static CSS, JavaScript bundles, and brand vectors.
  - Implements cache-first strategy for static assets and network-first for dynamic API routes.
- **PWA Experience Hook**: `src/context/experience-context.tsx` & `src/lib/experience.ts`
  - Captures `beforeinstallprompt` event.
  - Detects standalone display mode via `window.matchMedia('(display-mode: standalone)')`.

---

## 2. DISTRIBUTION STATUS ACCURACY

| Distribution Channel | Technical Status | User Guidance Strategy |
| :--- | :---: | :--- |
| **Progressive Web App (PWA)** | **Fully Supported** | One-click install prompt in Chrome/Edge, Add to Home Screen in Safari. |
| **Android Experience** | **PWA WebAPK** | Full-screen app experience with badge support via Chrome / Chromium browsers. |
| **iOS / iPadOS Experience** | **PWA Standalone** | Safari "Add to Home Screen" (`Share` $\to$ `Add to Home Screen`). |
| **Desktop Experience** | **PWA Window** | Desktop window mode with taskbar/dock integration and `Ctrl + K` spotlight. |
| **Native Mobile App (APK/IPA)**| **Not Native** | Honestly labeled as PWA; no fake app store claims. |

---

## 3. HONEST OFFLINE CAPABILITY COMMUNICATION

- **Truthful Capability Statement**:
  > *"App shell dan aset statis terpilih tetap tersedia saat offline. Data dinamis dan fitur AI memerlukan koneksi internet aktif."*
- **No False Claims**: Velqora does not advertise complete offline functionality while Supabase and AI engines require cloud synchronization.
