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
    catLearning: "Pembelajaran",
    catAi: "Fitur AI",
    catTools: "Alat",
    catOrg: "Organisasi",
    catHelp: "Bantuan",
    catSystem: "Sistem",
    adminPanel: "Administrasi",
    ownerPanel: "Administrasi (Pemilik)",

    // Sidebar Links
    navDashboard: "Dashboard",
    navPanduan: "Panduan",
    navStatistik: "Perkembangan Belajar",
    navMateri: "Materi Pembelajaran",
    navModul: "Modul dan Project",
    navTugas: "Tugas Pembelajaran",
    navKelas: "Ruang Kelas",
    navBookmark: "Materi Tersimpan",
    navCatatan: "Catatan Belajar",
    navPlayground: "Ruang Praktik Kode",
    navJadwal: "Jadwal Belajar",
    navAiTutor: "Tutor AI",
    navKuisAi: "Latihan dan Kuis",
    navKategori: "Kategori Pembelajaran",
    navTag: "Label dan Tag",
    navFile: "Berkas Pembelajaran",
    navKonversi: "Konversi Berkas",
    navBackup: "Cadangan Data",
    navPengaturan: "Pengaturan",
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
    catLearning: "Learning",
    catAi: "AI Tools",
    catTools: "Tools",
    catOrg: "Organization",
    catHelp: "Help",
    catSystem: "System",
    adminPanel: "Administration",
    ownerPanel: "Administration (Owner)",

    // Sidebar Links
    navDashboard: "Learning Overview",
    navPanduan: "Guide",
    navStatistik: "Learning Progress",
    navMateri: "Learning Materials",
    navModul: "Modules and Projects",
    navTugas: "Learning Tasks",
    navKelas: "Classroom",
    navBookmark: "Saved Materials",
    navCatatan: "Study Notes",
    navPlayground: "Code Playground",
    navJadwal: "Schedule",
    navAiTutor: "AI Tutor",
    navKuisAi: "Practice and Quiz",
    navKategori: "Learning Categories",
    navTag: "Labels and Tags",
    navFile: "Learning Files",
    navKonversi: "File Conversion",
    navBackup: "Data Backup",
    navPengaturan: "Settings",
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
