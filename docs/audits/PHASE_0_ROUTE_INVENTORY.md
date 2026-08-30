# VELQORA — PHASE 0: ROUTE FORENSIC INVENTORY

---

## COMPLETE APPLICATION ROUTE MATRIX (36 ROUTES)

| Route | Purpose | Desktop Presentation | Mobile Presentation | Primary Data Source | Auth Required | Status |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| `/` | Landing / App Redirect | Redirect to Dashboard or Login | Redirect to Dashboard or Login | Supabase Auth Session | Public | Active |
| `/_not-found` | 404 Error Page | Centered error card with action | Full-width error view | Static | Public | Active |
| `/login` | User Authentication | Clean focused card (`max-w-md`) | Full-width container ($\ge 48\text{px}$ inputs) | Supabase Auth API | Public | Active |
| `/register` | New Account Sign Up | Clean focused card with OAuth | Full-width container ($\ge 48\text{px}$ inputs) | Supabase Auth API | Public | Active |
| `/daftar` | Register Alias | Alias for `/register` | Alias for `/register` | Supabase Auth API | Public | Active |
| `/reset-password` | Password Recovery | Minimalist recovery form | Minimalist recovery form | Supabase Auth API | Public | Active |
| `/download` | Official App & PWA Hub | 3-Column platform tabs & guide | 1-Column stacked guide & install CTA | PWA Manifest / Experience Context | Public | Active |
| `/dashboard` | Main Hub | 2-Col Workspace (8-col/4-col) | Personal App Home & Greeting | `study-actions` / `schedule-actions` | Yes | Active |
| `/dashboard/modul` | Curriculum & Modules | Dense list with progress meters | Vertical stack cards with lesson counters | `getModules()` / `getCategories()` | Yes | Active |
| `/dashboard/modul/baru` | Create Module / Project | Multi-step form & file uploader | Single-column form flow | `createModule()` | Yes | Active |
| `/dashboard/modul/edit/[id]` | Edit Module | Full editing form | Single-column edit flow | `getModuleById()` / `updateModule()` | Yes | Active |
| `/dashboard/modul/kategori/[id]` | Category Modules View | Category grid & filter | Category stack view | `getModulesByCategory()` | Yes | Active |
| `/dashboard/materi` | Materials Library | Table/grid with type badges & search | File list with preview sheets | `getMaterials()` | Yes | Active |
| `/dashboard/materi/[id]` | Material Detail & Preview | Split document & notes viewer | Full-width document reader | `getMaterialById()` | Yes | Active |
| `/dashboard/materi/baru` | Upload Study Material | File dropzone & metadata form | Touch upload sheet | `createMaterial()` | Yes | Active |
| `/dashboard/tugas` | Tasks & Deadlines | `DesktopTable` with sortable headers | List rows with modal bottom sheet | `getTasks()` / `updateTaskStatus()` | Yes | Active |
| `/dashboard/tugas/baru` | Create New Task | Modal dialog & priority picker | Full-width form sheet | `createTask()` | Yes | Active |
| `/dashboard/jadwal` | Academic Calendar & Agenda | Interactive grid & day schedule | Chronological mobile agenda | `getSchedules()` | Yes | Active |
| `/dashboard/jadwal/intelligence` | Autonomous Schedule Planner | Health scores & recommendation matrix | Simplified optimization cards | `schedule-intelligence` engine | Yes | Active |
| `/dashboard/kelas` | Classroom Hub | Multi-course cards with quick links | Clean classroom list | `getClassrooms()` | Yes | Active |
| `/dashboard/kelas/[id]` | Class Detail & Stream | Stream, assignments & members tabs | Tabbed touch feed | `getClassroomDetail()` | Yes | Active |
| `/dashboard/ai-tutor` | AI Learning Assistant | 2-Col chat history & context composer | Full-screen chat with drawer | `askAITutorAction()` | Yes | Active |
| `/dashboard/playground` | Code & OCR Sandbox | Split-pane Editor & Console | Tabbed Editor / Output flow | Code Runner & OCR engines | Yes | Active |
| `/dashboard/kuis-ai` | Interactive AI Quiz | Quiz question card & progress bar | Touch choice cards | `quiz-actions` | Yes | Active |
| `/dashboard/konversi` | File Conversion Studio | Drag-and-drop batch converter | Upload & download list | `convertFileAction()` | Yes | Active |
| `/dashboard/catatan` | Study Notes | Rich notes editor & list | Streamlined mobile note editor | `getNotes()` | Yes | Active |
| `/dashboard/file` | Cloud File Storage | Folder hierarchy & file table | File list with preview sheet | `getStorageFiles()` | Yes | Active |
| `/dashboard/bookmark` | Bookmarked Resources | Filtered workspace view | Bookmark list items | `bookmark-service` | Yes | Active |
| `/dashboard/statistik` | Learning Analytics | Analytics chart & metric breakdowns | Compact summary cards | `getAnalyticsData()` | Yes | Active |
| `/dashboard/panduan` | User Manual & Shortcuts | Categorized documentation hub | Accordion guide list | Static Documentation | Yes | Active |
| `/dashboard/kategori` | Manage Categories | Category table & editor | Category list & add sheet | `manageCategories()` | Yes (Admin) | Active |
| `/dashboard/tag` | Manage Resource Tags | Tag management table | Tag pill editor | `manageTags()` | Yes (Admin) | Active |
| `/dashboard/kelola-role` | User Roles Management | User list & role selector table | User list with role bottom sheet | `manageRoles()` | Yes (Admin) | Active |
| `/dashboard/peta-pengguna` | User Journey Map | Interactive flow chart | Step-by-step roadmap | Static / State Engine | Yes | Active |
| `/dashboard/backup` | Backup & Data Export | JSON export & restore console | One-tap backup trigger | `backup-service` | Yes | Active |
| `/dashboard/pengaturan` | System Settings | Left sticky navigation & content surface | Native-style grouped settings list | Supabase Profile / Theme Context | Yes | Active |
| `/api/ai/memory` | AI Context Memory API | REST Endpoint | REST Endpoint | Supabase PGVector / Tables | Yes | Active |
| `/api/health` | System Health API | Health check JSON response | Health check JSON response | System Monitor | Public | Active |
