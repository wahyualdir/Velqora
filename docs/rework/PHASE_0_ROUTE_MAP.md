# VELQORA — PHASE 0: COMPLETE ROUTE MAP
## SOURCE-CODE VERIFIED INVENTORY (35 PAGES + 2 APIS)

---

## 1. PUBLIC & AUTHENTICATION ROUTES

| Route | Page File Path | Access Guard | Primary Components | Data Source |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `src/app/page.tsx` | Public | Hero, Feature Showcase, Platform CTA | Static / Auth Status |
| `/(auth)/login` | `src/app/(auth)/login/page.tsx` | Public (Unauthed) | LoginForm, Social Auth, Brand Banner | Supabase Auth API |
| `/(auth)/register` | `src/app/(auth)/register/page.tsx` | Public (Unauthed) | RegisterForm, Role Selector | Supabase Auth API |
| `/(auth)/daftar` | `src/app/(auth)/daftar/page.tsx` | Public (Unauthed) | Registration Redirect / Alias | Supabase Auth API |
| `/(auth)/reset-password`| `src/app/(auth)/reset-password/page.tsx`| Public | ResetPasswordForm | Supabase Auth API |
| `/download` | `src/app/download/page.tsx` | Public | DownloadHub, PWA Guidance, Platform Steps | Browser PWA Prompt |

---

## 2. DASHBOARD WORKSPACE ROUTES (AUTHENTICATED)

| Route | Page File Path | Primary Desktop Component | Primary Mobile Component | Server Action / API |
| :--- | :--- | :--- | :--- | :--- |
| `/dashboard` | `src/app/dashboard/page.tsx` | `DesktopDashboardView` (2-col) | `MobileDashboardView` (feed) | `getDashboardData()` |
| `/dashboard/ai-tutor` | `src/app/dashboard/ai-tutor/page.tsx` | 2-Column AI Workspace | Full-screen Chat + Drawer | `/api/ai/memory` |
| `/dashboard/backup` | `src/app/dashboard/backup/page.tsx` | Backup Management Panel | Compact Backup Actions | `createBackupAction()` |
| `/dashboard/bookmark` | `src/app/dashboard/bookmark/page.tsx` | Bookmark Table & Grid | Touch Bookmark List | `getUserBookmarks()` |
| `/dashboard/catatan` | `src/app/dashboard/catatan/page.tsx` | Split-Pane Note Editor | Mobile Note Feed | `getNotes()`, `saveNote()` |
| `/dashboard/file` | `src/app/dashboard/file/page.tsx` | File Explorer Workspace | Mobile File List | `getStorageFiles()` |
| `/dashboard/jadwal` | `src/app/dashboard/jadwal/page.tsx` | Interactive Week Calendar | `MobileScheduleAgenda` | `getSchedules()` |
| `/dashboard/jadwal/intelligence` | `src/app/dashboard/jadwal/intelligence/page.tsx` | AI Schedule Assistant | AI Recommendation Sheet | `getOptimizationProposals()` |
| `/dashboard/kategori` | `src/app/dashboard/kategori/page.tsx` | Category Manager Table | Category Pill List | `getCategories()` |
| `/dashboard/kelas` | `src/app/dashboard/kelas/page.tsx` | Classroom Grid Workspace | Mobile Class Cards | `getClassrooms()` |
| `/dashboard/kelas/[id]` | `src/app/dashboard/kelas/[id]/page.tsx`| Class Workspace (Tabs) | Mobile Tabbed Feed | `getClassDetail()` |
| `/dashboard/kelola-role` | `src/app/dashboard/kelola-role/page.tsx`| Role Administration Table | Role List Panel | `getUserRoles()` |
| `/dashboard/konversi` | `src/app/dashboard/konversi/page.tsx` | Document Converter Studio | Converter Step Flow | `convertDocumentAction()` |
| `/dashboard/kuis-ai` | `src/app/dashboard/kuis-ai/page.tsx` | AI Quiz Arena Workspace | Mobile Quiz Stepper | `generateQuizAction()` |
| `/dashboard/materi` | `src/app/dashboard/materi/page.tsx` | Document Library Table | `MobileMaterialList` | `getMaterials()` |
| `/dashboard/materi/baru` | `src/app/dashboard/materi/baru/page.tsx`| Material Creator Studio | Mobile Upload Stepper | `createMaterialAction()` |
| `/dashboard/materi/[id]` | `src/app/dashboard/materi/[id]/page.tsx`| Material Reader & Notes | Mobile Material View | `getMaterialById()` |
| `/dashboard/modul` | `src/app/dashboard/modul/page.tsx` | Curriculum Explorer | `MobileModuleList` | `getModules()` |
| `/dashboard/modul/baru` | `src/app/dashboard/modul/baru/page.tsx` | Module Creator Form | Mobile Module Form | `createModuleAction()` |
| `/dashboard/modul/edit/[id]` | `src/app/dashboard/modul/edit/[id]/page.tsx` | Module Editor Workspace | Mobile Edit Stepper | `updateModuleAction()` |
| `/dashboard/modul/kategori/[id]` | `src/app/dashboard/modul/kategori/[id]/page.tsx` | Category Module Filter | Mobile Filter Feed | `getModulesByCategory()` |
| `/dashboard/panduan` | `src/app/dashboard/panduan/page.tsx` | Interactive Documentation | Mobile Guide Accordion | Static Content |
| `/dashboard/pengaturan` | `src/app/dashboard/pengaturan/page.tsx` | 2-Column Settings View | Mobile Native Settings List | `updateUserSettings()` |
| `/dashboard/peta-pengguna` | `src/app/dashboard/peta-pengguna/page.tsx` | Academic Journey Map | Mobile Milestone Stepper | `getMilestones()` |
| `/dashboard/playground` | `src/app/dashboard/playground/page.tsx` | Split-Pane Code & OCR Studio | Tabbed Code & Console | `runCodeAction()` |
| `/dashboard/statistik` | `src/app/dashboard/statistik/page.tsx` | Academic Health Dashboard | Mobile Summary Cards | `getAcademicStatistics()` |
| `/dashboard/tag` | `src/app/dashboard/tag/page.tsx` | Tag Manager Workspace | Tag Cloud & List | `getTags()` |
| `/dashboard/tugas` | `src/app/dashboard/tugas/page.tsx` | `DesktopTable` with `...` Menu | `MobileTaskList` + BottomSheet | `getTasks()` |
| `/dashboard/tugas/baru` | `src/app/dashboard/tugas/baru/page.tsx` | Task Creator Modal / Panel | Mobile Task Form | `createTaskAction()` |

---

## 3. API ENDPOINTS

| Endpoint | Method | Path | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/ai/memory` | `POST`, `GET`, `DELETE` | `src/app/api/ai/memory/route.ts` | AI Context Memory & Long-term Knowledge Sync |
| `/api/health` | `GET` | `src/app/api/health/route.ts` | System Health Check & Telemetry Status |
