# VELQORA — PHASE 6: PWA & INSTALL EXPERIENCE REPORT

---

## 1. PWA MANIFEST & INSTALLATION ENGINE

- **Manifest File**: `src/app/manifest.ts` configured with `display: "standalone"`, `start_url: "/dashboard"`, theme colors, and icons.
- **Service Worker / Installation Registration**: `PwaRegister` listens for the `beforeinstallprompt` event and exposes state to `ExperienceContext`.
- **Install Trigger**: `promptInstallPwa()` method provides a clean native-like install prompt flow on Chromium and Android browsers.

---

## 2. MULTI-PLATFORM INSTALL ONBOARDING (`/download`)

| Platform | Detected State | Guidance Rendered |
| :--- | :--- | :--- |
| **Android** | `navigator.userAgent` includes Android | Direct PWA install button or "Tambahkan ke layar utama" menu guidance |
| **iOS / iPadOS** | `navigator.userAgent` includes iPhone/iPad | Safari Share button $\to$ "Add to Home Screen" step-by-step guidance |
| **Desktop** | Viewport $\ge 1024\text{px}$ | Chrome / Edge address bar install button guidance |
| **Standalone Mode** | `window.matchMedia('(display-mode: standalone)')` | Success badge: "Aplikasi Velqora sudah terpasang dan aktif di perangkat ini." |
