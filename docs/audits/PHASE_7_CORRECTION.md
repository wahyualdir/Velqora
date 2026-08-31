# VELQORA — PHASE 7 CORRECTION & RECONCILIATION
## REKONSILIASI ARSITEKTUR: SURFACE (STATUS INSTALASI) vs EXPERIENCE (LEBAR LAYAR)

---

### 1. Masalah yang Dikoreksi
Sebelumnya terdapat dua sistem yang bertabrakan dalam menentukan Web vs App:
1. `src/context/surface-context.tsx` (`useSurface`, `data-surface="web"|"app"`) menentukan mode berdasarkan **status instalasi aktual** (`display-mode: standalone` / `navigator.standalone`).
2. `src/context/experience-context.tsx` (`useExperience`, `ExperienceAdaptive`) menentukan "Mobile App Experience" vs "Desktop Workspace" hanya berdasarkan **lebar layar** (`< 768px = mobile`), tanpa peduli apakah aplikasi sudah di-install atau belum.

Akibatnya, saat pengguna membuka Velqora di browser HP biasa (belum di-install) dengan layar sempit, sistem langsung menampilkan "Mobile App Experience" (bottom nav, kartu app, dll).

---

### 2. Prinsip Arsitektur yang Ditegakkan (Single Source of Truth)

1. **Surface (`useSurface` / `data-surface`) = SATU-SATUNYA Penentu Identitas Produk (Web vs App)**:
   - **Surface Web (`surface === "web"`, default)**: Dibuka via browser biasa (Chrome, Safari, Firefox) di perangkat apapun dan lebar layar berapapun (Desktop, Tablet, Mobile HP).
     - Menampilkan **Web Workspace** (struktur workspace, desktop/web cards & metrics, tabel responsif dengan scroll horizontal, animasi web).
     - Pada layar sempit (< 1024px), sidebar otomatis menjadi **Drawer Navigasi Hamburger** (bukan Bottom Navigation bar).
   - **Surface App (`surface === "app"`)**: Dibuka melalui PWA yang telah di-install secara native (`display-mode: standalone` / `navigator.standalone` terverifikasi).
     - Menampilkan **App Experience** (5-destination bottom navigation, mobile app shell, personal greeting card).

2. **Experience / Viewport Width (`useExperience`, breakpoints) = Murni untuk Penyesuaian Responsif**:
   - Digunakan untuk keputusan layout responsif *di dalam surface yang sama* (misalnya penyesuaian padding, grid column collapse, drawer collapse).
   - **TIDAK BOLEH** digunakan untuk berpindah ke set komponen Mobile App.

3. **Konsolidasi Deteksi PWA Standalone**:
   - `src/context/surface-context.tsx` (`detectSurface()`) adalah satu-satunya sumber kebenaran.
   - `src/lib/experience.ts` (`checkIsPwaStandalone()`) murni mendelegasikan ke `detectSurface() === "app"`.

4. **Komponen Deklaratif**:
   - `<SurfaceAdaptive web={<...>} app={<...>} />`: Komponen utama untuk memilih branch komponen Web Workspace vs Mobile App Experience.
   - `<WebOnly>` & `<AppOnly>`: Helper kondisional berbasis `useSurface()`.
