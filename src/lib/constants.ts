// Konstanta yang digunakan di seluruh aplikasi

// Batas ukuran file upload: 50MB (cocok untuk free tier)
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

// Tipe file yang diizinkan
export const ALLOWED_FILE_TYPES = [
  // Dokumen
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  // Arsip
  "application/zip",
  "application/x-zip-compressed",
  // Code
  "application/json",
  "text/html",
  "text/css",
  "text/javascript",
  "application/javascript",
  "application/x-python-code",
  "text/x-python",
  // Gambar
  "image/jpeg",
  "image/png",
  "image/webp",
  // Jupyter notebook (biasanya application/json)
  "application/x-ipynb+json",
];

// Ekstensi file yang diizinkan
export const ALLOWED_FILE_EXTENSIONS = [
  ".pdf", ".doc", ".docx",
  ".xls", ".xlsx",
  ".ppt", ".pptx",
  ".txt", ".csv",
  ".zip",
  ".ipynb",
  ".py", ".js", ".ts",
  ".html", ".css", ".sql",
  ".jpg", ".jpeg", ".png", ".webp",
];

// Nama bucket Supabase Storage
export const STORAGE_BUCKET = "studyvault-files";

// Navigasi sidebar terkelompok 4 kategori bersih dengan sub-menu terstruktur
export const SIDEBAR_CATEGORIES = [
  {
    title: "Utama",
    links: [
      { label: "Dashboard", href: "/dashboard", icon: "LayoutGrid" },
      { label: "Statistik Belajar", href: "/dashboard/statistik", icon: "BarChart3" },
    ],
  },
  {
    title: "Pembelajaran",
    links: [
      {
        label: "Modul & Project",
        href: "/dashboard/modul",
        icon: "Layers",
        subItems: [
          { label: "Katalog Modul", href: "/dashboard/modul", icon: "Layers" },
          { label: "Repositori Project", href: "/dashboard/modul?mode=project", icon: "FolderCode" },
        ],
      },
      {
        label: "Bahan Ajar & Dokumen",
        href: "/dashboard/materi",
        icon: "BookOpen",
        subItems: [
          { label: "Materi Pembelajaran", href: "/dashboard/materi", icon: "BookOpen" },
          { label: "Semua Berkas", href: "/dashboard/file", icon: "Files" },
          { label: "Materi Tersimpan", href: "/dashboard/bookmark", icon: "Bookmark" },
          { label: "Catatan Belajar", href: "/dashboard/catatan", icon: "PenLine" },
        ],
      },
      {
        label: "Tugas & Jadwal",
        href: "/dashboard/tugas",
        icon: "CheckSquare",
        subItems: [
          { label: "Daftar Tugas", href: "/dashboard/tugas", icon: "CheckSquare" },
          { label: "Jadwal Perkuliahan", href: "/dashboard/tugas?tab=jadwal", icon: "Calendar" },
        ],
      },
      { label: "Ruang Kelas", href: "/dashboard/kelas", icon: "Users" },
    ],
  },
  {
    title: "Fitur & Alat",
    links: [
      {
        label: "AI Assistant",
        href: "/dashboard/ai-tutor",
        icon: "Bot",
        isAi: true,
        subItems: [
          { label: "AI Tutor Cerdas", href: "/dashboard/ai-tutor", icon: "Bot" },
          { label: "Latihan & Kuis AI", href: "/dashboard/kuis-ai", icon: "BrainCircuit" },
        ],
      },
      {
        label: "Ruang Praktik & Alat",
        href: "/dashboard/playground",
        icon: "Code2",
        subItems: [
          { label: "Ruang Praktik Kode", href: "/dashboard/playground", icon: "Code2" },
          { label: "Konversi & OCR Berkas", href: "/dashboard/konversi", icon: "ScanLine" },
        ],
      },
    ],
  },
  {
    title: "Pengaturan",
    links: [
      {
        label: "Pengaturan Workspace",
        href: "/dashboard/pengaturan",
        icon: "Sliders",
        subItems: [
          { label: "Pengaturan Umum", href: "/dashboard/pengaturan", icon: "Sliders" },
          { label: "Kategori & Subjek", href: "/dashboard/kategori", icon: "FolderOpen" },
          { label: "Label & Tag", href: "/dashboard/tag", icon: "Tag" },
          { label: "Cadangan Data", href: "/dashboard/backup", icon: "HardDriveDownload" },
        ],
      },
      { label: "Panduan", href: "/dashboard/panduan", icon: "Compass" },
      { label: "Pasang Aplikasi", href: "/download", icon: "Download" },
    ],
  },
] as const;

export interface SystemCategoryPreset {
  name: string;
  icon: string;
  color: string;
  subcategories: { name: string; icon?: string; color?: string }[];
}

export const SYSTEM_PRIMARY_CATEGORIES: SystemCategoryPreset[] = [
  {
    name: "Bahasa Pemrograman",
    icon: "code",
    color: "#3b82f6",
    subcategories: [
      { name: "Python", icon: "python", color: "#3776AB" },
      { name: "JavaScript", icon: "javascript", color: "#F7DF1E" },
      { name: "TypeScript", icon: "typescript", color: "#3178C6" },
      { name: "C", icon: "c", color: "#A8B9CC" },
      { name: "C++", icon: "cpp", color: "#00599C" },
      { name: "C#", icon: "csharp", color: "#239120" },
      { name: "Java", icon: "java", color: "#ED8B00" },
      { name: "Kotlin", icon: "kotlin", color: "#7F52FF" },
      { name: "Swift", icon: "swift", color: "#F05138" },
      { name: "Go", icon: "golang", color: "#00ADD8" },
      { name: "Rust", icon: "rust", color: "#DEA584" },
      { name: "PHP", icon: "php", color: "#777BB4" },
      { name: "Ruby", icon: "ruby", color: "#CC342D" },
      { name: "Dart", icon: "dart", color: "#0175C2" },
      { name: "HTML", icon: "html", color: "#E34F26" },
      { name: "CSS", icon: "css", color: "#1572B6" },
      { name: "SQL", icon: "sql", color: "#4479A1" },
    ],
  },
  {
    name: "Algoritma & Struktur Data",
    icon: "algorithm",
    color: "#6366f1",
    subcategories: [
      { name: "Algorithm Fundamentals", icon: "algorithm", color: "#6366F1" },
      { name: "Complexity Analysis", icon: "algorithm", color: "#8B5CF6" },
      { name: "Big O", icon: "algorithm", color: "#EC4899" },
      { name: "Array", icon: "algorithm", color: "#3B82F6" },
      { name: "Linked List", icon: "algorithm", color: "#10B981" },
      { name: "Stack", icon: "algorithm", color: "#F59E0B" },
      { name: "Queue", icon: "algorithm", color: "#6366F1" },
      { name: "Hash Table", icon: "algorithm", color: "#06B6D4" },
      { name: "Tree", icon: "algorithm", color: "#10B981" },
      { name: "Binary Tree", icon: "algorithm", color: "#14B8A6" },
      { name: "Heap", icon: "algorithm", color: "#F59E0B" },
      { name: "Graph", icon: "algorithm", color: "#8B5CF6" },
      { name: "Sorting", icon: "algorithm", color: "#3B82F6" },
      { name: "Searching", icon: "algorithm", color: "#06B6D4" },
      { name: "Recursion", icon: "algorithm", color: "#EC4899" },
      { name: "Backtracking", icon: "algorithm", color: "#EF4444" },
      { name: "Greedy", icon: "algorithm", color: "#10B981" },
      { name: "Dynamic Programming", icon: "algorithm", color: "#8B5CF6" },
      { name: "Divide and Conquer", icon: "algorithm", color: "#6366F1" },
    ],
  },
  {
    name: "Kecerdasan Buatan",
    icon: "machine_learning",
    color: "#8b5cf6",
    subcategories: [
      { name: "Artificial Intelligence Fundamentals", icon: "machine_learning", color: "#8B5CF6" },
      { name: "Machine Learning", icon: "machine_learning", color: "#8B5CF6" },
      { name: "Deep Learning", icon: "deep_learning", color: "#EC4899" },
      { name: "Natural Language Processing", icon: "nlp", color: "#10B981" },
      { name: "Computer Vision", icon: "computer_vision", color: "#3B82F6" },
      { name: "Generative AI", icon: "generative_ai", color: "#F59E0B" },
      { name: "Large Language Model", icon: "generative_ai", color: "#F59E0B" },
      { name: "AI Agent", icon: "robotics", color: "#EF4444" },
      { name: "Reinforcement Learning", icon: "reinforcement", color: "#8B5CF6" },
      { name: "Speech & Audio AI", icon: "speech", color: "#6366F1" },
      { name: "Recommendation System", icon: "machine_learning", color: "#8B5CF6" },
      { name: "Expert System", icon: "expert_systems", color: "#14B8A6" },
      { name: "Knowledge Representation", icon: "knowledge_rep", color: "#06B6D4" },
      { name: "Multimodal AI", icon: "generative_ai", color: "#F59E0B" },
    ],
  },
  {
    name: "Data Science",
    icon: "data_science",
    color: "#06b6d4",
    subcategories: [
      { name: "Data Science Fundamentals", icon: "data_science", color: "#06B6D4" },
      { name: "Python for Data Science", icon: "python", color: "#3776AB" },
      { name: "Data Collection", icon: "database", color: "#F59E0B" },
      { name: "Data Cleaning", icon: "data_science", color: "#10B981" },
      { name: "Data Wrangling", icon: "data_science", color: "#14B8A6" },
      { name: "Exploratory Data Analysis", icon: "data_science", color: "#06B6D4" },
      { name: "Statistics for Data Science", icon: "math", color: "#EAB308" },
      { name: "Probability", icon: "math", color: "#EAB308" },
      { name: "Data Visualization", icon: "data_science", color: "#3B82F6" },
      { name: "Machine Learning for Data Science", icon: "machine_learning", color: "#8B5CF6" },
      { name: "Data Pipeline", icon: "database", color: "#F59E0B" },
      { name: "Data Storytelling", icon: "data_science", color: "#EC4899" },
    ],
  },
  {
    name: "Data Analytics",
    icon: "data_science",
    color: "#10b981",
    subcategories: [
      { name: "Basic Data Analytics", icon: "data_science", color: "#10B981" },
      { name: "Excel for Data Analytics", icon: "data_science", color: "#107C41" },
      { name: "SQL for Data Analytics", icon: "sql", color: "#4479A1" },
      { name: "Python Analytics", icon: "python", color: "#3776AB" },
      { name: "Dashboard", icon: "data_science", color: "#3B82F6" },
      { name: "Business Intelligence", icon: "data_science", color: "#F59E0B" },
      { name: "KPI Analysis", icon: "data_science", color: "#8B5CF6" },
      { name: "Predictive Analytics", icon: "data_science", color: "#06B6D4" },
    ],
  },
  {
    name: "Database",
    icon: "database",
    color: "#f59e0b",
    subcategories: [
      { name: "Database Fundamentals", icon: "database", color: "#F59E0B" },
      { name: "SQL", icon: "sql", color: "#4479A1" },
      { name: "MySQL", icon: "mysql", color: "#00758F" },
      { name: "PostgreSQL", icon: "postgresql", color: "#336791" },
      { name: "SQLite", icon: "sqlite", color: "#003B57" },
      { name: "MongoDB", icon: "mongodb", color: "#47A248" },
      { name: "Redis", icon: "redis", color: "#DC382D" },
      { name: "Database Design", icon: "database", color: "#F59E0B" },
      { name: "NoSQL", icon: "database", color: "#47A248" },
    ],
  },
  {
    name: "Web Development",
    icon: "react",
    color: "#3b82f6",
    subcategories: [
      { name: "HTML", icon: "html", color: "#E34F26" },
      { name: "CSS", icon: "css", color: "#1572B6" },
      { name: "JavaScript", icon: "javascript", color: "#F7DF1E" },
      { name: "TypeScript", icon: "typescript", color: "#3178C6" },
      { name: "React", icon: "react", color: "#61DAFB" },
      { name: "Next.js", icon: "nextjs", color: "#000000" },
      { name: "Vue", icon: "vue", color: "#4FC08D" },
      { name: "Angular", icon: "angular", color: "#DD0031" },
      { name: "Svelte", icon: "svelte", color: "#FF3E00" },
      { name: "Node.js", icon: "node", color: "#339933" },
      { name: "Express.js", icon: "node", color: "#339933" },
      { name: "Laravel", icon: "laravel", color: "#FF2D20" },
      { name: "PHP", icon: "php", color: "#777BB4" },
      { name: "Django", icon: "django", color: "#092E20" },
      { name: "REST API", icon: "web_dev", color: "#3B82F6" },
      { name: "Web Security", icon: "security", color: "#EF4444" },
    ],
  },
  {
    name: "Mobile Development",
    icon: "flutter",
    color: "#ec4899",
    subcategories: [
      { name: "Android Development", icon: "android", color: "#3DDC84" },
      { name: "Kotlin", icon: "kotlin", color: "#7F52FF" },
      { name: "Java Android", icon: "java", color: "#ED8B00" },
      { name: "iOS Development", icon: "apple", color: "#A2AAAD" },
      { name: "Swift", icon: "swift", color: "#F05138" },
      { name: "Flutter", icon: "flutter", color: "#02569B" },
      { name: "React Native", icon: "react", color: "#61DAFB" },
      { name: "Mobile UI/UX", icon: "figma", color: "#F24E1E" },
    ],
  },
  {
    name: "Computer Vision",
    icon: "computer_vision",
    color: "#14b8a6",
    subcategories: [
      { name: "Computer Vision Fundamentals", icon: "computer_vision", color: "#14B8A6" },
      { name: "Image Processing", icon: "computer_vision", color: "#3B82F6" },
      { name: "Object Detection", icon: "computer_vision", color: "#10B981" },
      { name: "OpenCV", icon: "computer_vision", color: "#5C3EE8" },
      { name: "YOLO", icon: "computer_vision", color: "#00FFFF" },
      { name: "Face Recognition", icon: "computer_vision", color: "#EC4899" },
    ],
  },
  {
    name: "Natural Language Processing",
    icon: "nlp",
    color: "#a855f7",
    subcategories: [
      { name: "NLP Fundamentals", icon: "nlp", color: "#A855F7" },
      { name: "Tokenization", icon: "nlp", color: "#10B981" },
      { name: "Text Classification", icon: "nlp", color: "#3B82F6" },
      { name: "Sentiment Analysis", icon: "nlp", color: "#EC4899" },
      { name: "Word2Vec", icon: "nlp", color: "#F59E0B" },
      { name: "BERT & Transformers", icon: "nlp", color: "#8B5CF6" },
      { name: "Large Language Model", icon: "generative_ai", color: "#F59E0B" },
    ],
  },
  {
    name: "Generative AI",
    icon: "generative_ai",
    color: "#f43f5e",
    subcategories: [
      { name: "Generative AI Fundamentals", icon: "generative_ai", color: "#F43F5E" },
      { name: "Prompt Engineering", icon: "generative_ai", color: "#F59E0B" },
      { name: "Large Language Model", icon: "generative_ai", color: "#EC4899" },
      { name: "Retrieval Augmented Generation", icon: "generative_ai", color: "#3B82F6" },
      { name: "RAG", icon: "generative_ai", color: "#3B82F6" },
      { name: "AI Agent", icon: "robotics", color: "#EF4444" },
      { name: "Multimodal AI", icon: "generative_ai", color: "#F59E0B" },
    ],
  },
  {
    name: "Software Engineering",
    icon: "git",
    color: "#64748b",
    subcategories: [
      { name: "Software Engineering Fundamentals", icon: "git", color: "#64748B" },
      { name: "System Design", icon: "computer_systems", color: "#3B82F6" },
      { name: "Software Architecture", icon: "computer_systems", color: "#8B5CF6" },
      { name: "Clean Code", icon: "code", color: "#10B981" },
      { name: "Git", icon: "git", color: "#F05032" },
      { name: "GitHub", icon: "github", color: "#181717" },
    ],
  },
  {
    name: "DevOps & Cloud",
    icon: "docker",
    color: "#0284c7",
    subcategories: [
      { name: "Linux", icon: "linux", color: "#FCC624" },
      { name: "Git", icon: "git", color: "#F05032" },
      { name: "GitHub", icon: "github", color: "#181717" },
      { name: "Docker", icon: "docker", color: "#2496ED" },
      { name: "Kubernetes", icon: "kubernetes", color: "#326CE5" },
      { name: "AWS", icon: "aws", color: "#FF9900" },
      { name: "CI/CD", icon: "docker", color: "#0284C7" },
    ],
  },
  {
    name: "Cyber Security",
    icon: "security",
    color: "#ef4444",
    subcategories: [
      { name: "Cyber Security Fundamentals", icon: "security", color: "#EF4444" },
      { name: "Network Security", icon: "security", color: "#EF4444" },
      { name: "Web Security", icon: "security", color: "#EF4444" },
      { name: "Cryptography", icon: "security", color: "#8B5CF6" },
      { name: "Encryption", icon: "security", color: "#8B5CF6" },
      { name: "OWASP", icon: "security", color: "#EF4444" },
    ],
  },
  {
    name: "Matematika & Statistika",
    icon: "math",
    color: "#eab308",
    subcategories: [
      { name: "Calculus", icon: "math", color: "#EAB308" },
      { name: "Linear Algebra", icon: "math", color: "#EAB308" },
      { name: "Statistics", icon: "math", color: "#EAB308" },
      { name: "Probability", icon: "math", color: "#EAB308" },
      { name: "Discrete Mathematics", icon: "math", color: "#EAB308" },
      { name: "Mathematics for Machine Learning", icon: "math", color: "#8B5CF6" },
    ],
  },
  {
    name: "UI/UX & Design",
    icon: "figma",
    color: "#d946ef",
    subcategories: [
      { name: "UI Design", icon: "figma", color: "#F24E1E" },
      { name: "UX Design", icon: "figma", color: "#A259FF" },
      { name: "Design System", icon: "figma", color: "#0ACF83" },
      { name: "Typography", icon: "figma", color: "#FF7262" },
      { name: "Wireframing", icon: "figma", color: "#1ABCFE" },
      { name: "Figma", icon: "figma", color: "#F24E1E" },
    ],
  },
  {
    name: "Sistem Komputer",
    icon: "computer_systems",
    color: "#84cc16",
    subcategories: [
      { name: "Operating System", icon: "computer_systems", color: "#84CC16" },
      { name: "Linux", icon: "linux", color: "#FCC624" },
      { name: "Computer Architecture", icon: "computer_systems", color: "#84CC16" },
      { name: "Networking", icon: "computer_systems", color: "#3B82F6" },
      { name: "Storage & Memory", icon: "computer_systems", color: "#10B981" },
    ],
  },
];

export const SIDEBAR_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Semua Materi", href: "/dashboard/materi", icon: "BookOpen" },
  { label: "Tugas", href: "/dashboard/tugas", icon: "ClipboardList" },
  { label: "Modul", href: "/dashboard/modul", icon: "GraduationCap" },
  { label: "Ruang Kelas", href: "/dashboard/kelas", icon: "Users" },
  { label: "Jadwal & Reminder", href: "/dashboard/jadwal", icon: "Calendar" },
  { label: "Asisten AI", href: "/dashboard/ai-tutor", icon: "Bot" },
  { label: "Statistik & Progres", href: "/dashboard/statistik", icon: "BarChart3" },
  { label: "Kategori", href: "/dashboard/kategori", icon: "FolderOpen" },
  { label: "Tag", href: "/dashboard/tag", icon: "Tags" },
  { label: "File", href: "/dashboard/file", icon: "FileBox" },
  { label: "Backup", href: "/dashboard/backup", icon: "Download" },
  { label: "Pengaturan", href: "/dashboard/pengaturan", icon: "Settings" },
] as const;
