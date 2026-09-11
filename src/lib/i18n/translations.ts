export type Language = "id" | "en";

export const translations = {
  id: {
    // Header / Navbar
    searchPlaceholder: "Cari materi, tugas, modul pembelajaran...",
    statusOnline: "Online",
    adminAccess: "Akses Admin",
    ownerAccess: "Pemilik Sistem",

    // Sidebar Categories
    catMain: "Utama",
    catModul: "Modul",
    catProject: "Project",
    catAi: "Alat AI",
    catSystem: "Sistem",
    adminPanel: "Administrasi",
    ownerPanel: "Administrasi (Pemilik)",

    // Sidebar Links
    navDashboard: "Dashboard",
    navPanduan: "Panduan",
    navStatistik: "Statistik Belajar",
    navKatalogModul: "Katalog Modul",
    navMateri: "Materi Pembelajaran",
    navFile: "Semua Berkas",
    navBookmark: "Materi Tersimpan",
    navCatatan: "Catatan Belajar",
    navProject: "Repositori Project",
    navAiTutor: "AI Tutor Cerdas",
    navKuisAi: "Latihan & Kuis AI",
    navPlayground: "Ruang Praktik Kode",
    navKonversi: "Konversi & OCR Berkas",
    navPengaturan: "Pengaturan Umum",
    navKategori: "Kategori & Subjek",
    navTag: "Label & Tag",
    navBackup: "Cadangan Data",
    navPasangAplikasi: "Pasang Aplikasi",
    navKelolaRole: "Kelola Hak Akses",
    navTotalPengguna: "Peta Pengguna",
    logout: "Keluar",

    // Dashboard Hero & Quick Actions
    digitalLearningSpace: "Ruang Belajar",
    welcomeTitle: "Selamat datang di",
    heroSubtitle: "Ringkasan materi, tugas, project, dan aktivitas belajar Anda.",
    newMaterial: "Tambah Materi",
    newTask: "Tambah Tugas",
    newModule: "Tambah Modul",

    // Metric Cards
    materiKuliah: "Materi Pembelajaran",
    materiSubtext: "Tersimpan dalam modul",
    tugasAktif: "Tugas Aktif",
    tugasSubtext: "Belum diselesaikan",
    modulPembelajaran: "Modul dan Project",
    modulSubtext: "Kurikulum aktif",
    totalFile: "Berkas Tersimpan",
    fileSubtext: "Dokumen dan lampiran",

    // Tasks Section
    tasksAndDeadlines: "Tugas dan Tenggat Waktu",
    allTasks: "Semua Tugas",
    allTasksCompleted: "Semua Tugas Selesai",
    noActiveTasks: "Tidak ada tugas aktif atau tenggat waktu mendatang.",
    overdue: "Terlewat",
    today: "Hari ini",
    daysLeft: "hari lagi",
    noSubject: "Tanpa Topik",

    // Learning Modules Section
    learningModules: "Modul Pembelajaran",
    allModules: "Semua Modul",
    noModulesYet: "Belum Ada Modul",
    createFirstModule: "Tambahkan modul pertama Anda untuk mulai belajar.",
    learningProgress: "Perkembangan belajar",
    basicLevel: "Dasar",

    // Recent Materials Section
    recentMaterials: "Materi Terakhir Diakses",
    exploreMaterials: "Lihat Semua Materi",
    openMaterial: "Buka materi",
    untitledMaterial: "Materi Tanpa Judul",
    viewAllMaterials: "Lihat Semua",
    noRecentMaterials: "Belum ada riwayat materi yang diakses baru-baru ini.",

    // Language Selector
    selectLanguage: "Pilih Bahasa",
    indonesian: "Bahasa Indonesia",
    english: "English",
  },

  en: {
    // Header / Navbar
    searchPlaceholder: "Search materials, tasks, modules...",
    statusOnline: "Online",
    adminAccess: "Admin Access",
    ownerAccess: "System Owner",

    // Sidebar Categories
    catMain: "Main",
    catModul: "Modules",
    catProject: "Projects",
    catAi: "AI Tools",
    catSystem: "System",
    adminPanel: "Administration",
    ownerPanel: "Administration (Owner)",

    // Sidebar Links
    navDashboard: "Dashboard",
    navPanduan: "Guide",
    navStatistik: "Learning Statistics",
    navKatalogModul: "Module Catalog",
    navMateri: "Learning Materials",
    navFile: "All Files",
    navBookmark: "Saved Materials",
    navCatatan: "Study Notes",
    navProject: "Project Repository",
    navAiTutor: "Smart AI Tutor",
    navKuisAi: "AI Practice & Quiz",
    navPlayground: "Code Playground",
    navKonversi: "File & OCR Conversion",
    navPengaturan: "General Settings",
    navKategori: "Categories & Subjects",
    navTag: "Labels & Tags",
    navBackup: "Data Backup",
    navPasangAplikasi: "Install App",
    navKelolaRole: "Access Control",
    navTotalPengguna: "User Map",
    logout: "Log Out",

    // Dashboard Hero & Quick Actions
    digitalLearningSpace: "Learning Space",
    welcomeTitle: "Welcome to",
    heroSubtitle: "Summary of your materials, tasks, projects, and learning activity.",
    newMaterial: "New Material",
    newTask: "New Task",
    newModule: "New Module",

    // Metric Cards
    materiKuliah: "Learning Materials",
    materiSubtext: "Organized in modules",
    tugasAktif: "Active Tasks",
    tugasSubtext: "Needs completion",
    modulPembelajaran: "Modules and Projects",
    modulSubtext: "Active curriculum",
    totalFile: "Stored Files",
    fileSubtext: "Documents and attachments",

    // Tasks Section
    tasksAndDeadlines: "Tasks and Deadlines",
    allTasks: "All Tasks",
    allTasksCompleted: "All Tasks Completed",
    noActiveTasks: "No active tasks or upcoming deadlines.",
    overdue: "Overdue",
    today: "Today",
    daysLeft: "days left",
    noSubject: "No Subject",

    // Learning Modules Section
    learningModules: "Learning Modules",
    allModules: "All Modules",
    noModulesYet: "No Modules Yet",
    createFirstModule: "Add your first module to start learning.",
    learningProgress: "Learning progress",
    basicLevel: "Basic",

    // Recent Materials Section
    recentMaterials: "Recently Accessed Materials",
    exploreMaterials: "Explore Materials",
    openMaterial: "Open material",
    untitledMaterial: "Untitled Material",
    viewAllMaterials: "View All",
    noRecentMaterials: "No recently accessed materials.",

    // Language Selector
    selectLanguage: "Select Language",
    indonesian: "Bahasa Indonesia",
    english: "English",
  },
} as const;

export type TranslationKey = keyof typeof translations.id;
