"use server";

import { createClient } from "@/lib/supabase/server";
import { SYSTEM_PRIMARY_CATEGORIES } from "@/lib/constants";

export interface CollectionItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  moduleCount: string;
  lessonCount: string;
  modulesIncluded: string[];
  accentColor: string;
  categoryName?: string;
}

export interface ModuleItem {
  id: string;
  title: string;
  dur?: string;
  category?: string;
  level?: string;
  chaptersCount?: number;
  kind?: "module" | "project" | "note";
}

export interface LandingStats {
  totalModules: number;
  totalCategories: number;
  totalProjects: number;
  totalNotes: number;
  totalQuizzes: number;
}

export interface LandingCurriculumData {
  stats: LandingStats;
  collections: CollectionItem[];
  allModules: ModuleItem[];
  activeDisciplines: string[];
}

// Default Fallback Collections representing Velqora's full modern curriculum
const DEFAULT_COLLECTIONS: CollectionItem[] = [
  {
    id: "col-ai",
    tag: "01 // KECERDASAN BUATAN",
    title: "AI Agent, LLM, & Machine Learning Industri",
    description:
      "Arsitektur Large Language Model, Autonomous AI Agents, Scikit-Learn Supervised & Unsupervised Learning, Computer Vision, dan optimasi inference produksi.",
    moduleCount: "6 Domain Utama",
    lessonCount: "MATERI KOMPREHENSIF →",
    modulesIncluded: [
      "AI Agent & Multi-Agent Orchestration",
      "Large Language Models & Prompt Engineering",
      "Scikit-Learn Machine Learning Pipeline",
      "Deep Learning & Computer Vision (CNN/Vision Transformers)",
      "Natural Language Processing & Analisis Sentimen",
      "MLOps & Deployment Model Skala Besar",
    ],
    accentColor: "#8B5CF6",
    categoryName: "Kecerdasan Buatan",
  },
  {
    id: "col-data",
    tag: "02 // DATA SCIENCE & ANALYTICS",
    title: "Python Analytics, SQL, & Telco Churn Modeling",
    description:
      "Pemrosesan data masif dengan Pandas & NumPy, visualisasi Seaborn, kueri analitis SQL, studi kasus riil Telco Churn ML, dan time series forecasting.",
    moduleCount: "5 Modul Lengkap",
    lessonCount: "148 HALAMAN DIKTAT →",
    modulesIncluded: [
      "Python untuk Data Analytics & Manipulasi Pandas",
      "Exploratory Data Analysis & Visualisasi Statistik",
      "Database Relasional & Analisis Kueri SQL Bisnis",
      "Studi Kasus Telco Customer Churn Prediksi ML",
      "Time Series Forecasting & Analisis Tren Musiman",
    ],
    accentColor: "#06B6D4",
    categoryName: "Data Analytics",
  },
  {
    id: "col-algo",
    tag: "03 // ALGORITMA & STRUKTUR DATA",
    title: "Struktur Data Fundamental hingga Dynamic Programming",
    description:
      "Penguasaan memori, analisis kompleksitas Big-O, struktur pohon, graf, dan teknik algoritma Greedy hingga Pemrograman Dinamis tingkat lanjut.",
    moduleCount: "4 Klaster Inti",
    lessonCount: "SIAP UJI KEMAMPUAN →",
    modulesIncluded: [
      "Kompleksitas Big O & Analisis Algoritma",
      "Array, Stack, Queue, & Hash Table Efisien",
      "Binary Search Tree, Heap, & Algoritma Graf",
      "Divide & Conquer serta Dynamic Programming",
    ],
    accentColor: "#F59E0B",
    categoryName: "Algoritma & Struktur Data",
  },
  {
    id: "col-web",
    tag: "04 // REKAYASA WEB & DEVOPS",
    title: "Next.js 15 App Router, React 19, & Arsitektur Cloud",
    description:
      "Pemisahan server-client runtime boundary, autentikasi HttpOnly RBAC, database PostgreSQL, testing Vitest/Playwright, dan Docker CI/CD.",
    moduleCount: "12 Modul Web",
    lessonCount: "PRODUKSI BERSTANDAR →",
    modulesIncluded: [
      "Next.js 15 App Router & React 19 Server Components",
      "Data Fetching, Server Actions, & Validasi Zod",
      "Autentikasi HttpOnly Cookies & Role-Based Access Control",
      "Integrasi PostgreSQL, Prisma ORM, & Database Pooling",
      "Testing Vitest, React Testing Library, & Playwright",
      "Deployment Multi-Stage Docker & Pipeline CI/CD",
    ],
    accentColor: "#C2553A",
    categoryName: "Bahasa Pemrograman",
  },
];

const DEFAULT_MODULES: ModuleItem[] = [
  // AI & ML
  { id: "mod-ai-1", title: "AI Agent & Autonomous Workflow Orchestration", dur: "3 SKS · 150m", category: "Kecerdasan Buatan", level: "menengah" },
  { id: "mod-ai-2", title: "Large Language Model Fine-Tuning & Retrieval Augmented Generation", dur: "3 SKS · 150m", category: "Kecerdasan Buatan", level: "lanjutan" },
  { id: "mod-ai-3", title: "Scikit-Learn Machine Learning Pipeline & Validasi Model", dur: "3 SKS · 150m", category: "Kecerdasan Buatan", level: "pemula" },
  { id: "mod-ai-4", title: "Computer Vision: Image Processing hingga Object Detection", dur: "3 SKS · 150m", category: "Kecerdasan Buatan", level: "menengah" },
  { id: "mod-ai-5", title: "Natural Language Processing: Analisis Sentimen & Deteksi Emosi", dur: "3 SKS · 150m", category: "Kecerdasan Buatan", level: "menengah" },
  
  // Data Analytics & Science
  { id: "mod-da-1", title: "Data Analytics Komprehensif dengan Python, NumPy, & Pandas", dur: "4 SKS · 180m", category: "Data Analytics", level: "pemula" },
  { id: "mod-da-2", title: "Exploratory Data Analysis & Visualisasi Seaborn/Matplotlib", dur: "3 SKS · 150m", category: "Data Analytics", level: "pemula" },
  { id: "mod-da-3", title: "Statistika Terapan Bisnis & Pengujian Hipotesis Data", dur: "3 SKS · 150m", category: "Data Analytics", level: "menengah" },
  { id: "mod-da-4", title: "Studi Kasus Telco Customer Churn & Modeling Prediktif", dur: "4 SKS · 180m", category: "Data Science", level: "lanjutan" },
  { id: "mod-da-5", title: "Time Series Forecasting & Analisis Tren Musiman Bisnis", dur: "3 SKS · 150m", category: "Data Analytics", level: "menengah" },

  // Algoritma
  { id: "mod-algo-1", title: "Analisis Kompleksitas Big-O & Optimasi Efisiensi Kode", dur: "2 SKS · 100m", category: "Algoritma & Struktur Data", level: "pemula" },
  { id: "mod-algo-2", title: "Struktur Data Linear: Stack, Queue, & Hash Table In-Depth", dur: "3 SKS · 150m", category: "Algoritma & Struktur Data", level: "pemula" },
  { id: "mod-algo-3", title: "Algoritma Non-Linear: Binary Search Tree & Graf Traversal", dur: "3 SKS · 150m", category: "Algoritma & Struktur Data", level: "menengah" },
  { id: "mod-algo-4", title: "Dynamic Programming: Paradigma Optimal Substructure", dur: "4 SKS · 180m", category: "Algoritma & Struktur Data", level: "lanjutan" },

  // Web Modern & DevOps
  { id: "mod-web-1", title: "Fondasi Client-Server Runtime, Semantik, & Asinkron Event Loop", dur: "3 SKS · 150m", category: "Rekayasa Web", level: "pemula" },
  { id: "mod-web-2", title: "React 19 Server Components, Hooks, & State Reconciliation", dur: "3 SKS · 150m", category: "Rekayasa Web", level: "menengah" },
  { id: "mod-web-3", title: "Routing Modern Next.js 15 App Router, Layouts, & Cache Control", dur: "3 SKS · 150m", category: "Rekayasa Web", level: "menengah" },
  { id: "mod-web-4", title: "Data Fetching & Server Actions dengan Validasi Zod", dur: "3 SKS · 150m", category: "Rekayasa Web", level: "menengah" },
  { id: "mod-web-5", title: "Autentikasi Aman HttpOnly Cookies & Role-Based Access Control", dur: "3 SKS · 150m", category: "Rekayasa Web", level: "lanjutan" },
  { id: "mod-web-6", title: "Integrasi Database PostgreSQL, Prisma ORM, & Pooling", dur: "3 SKS · 150m", category: "Rekayasa Web", level: "menengah" },
  { id: "mod-web-7", title: "Strategi Testing Web: Vitest, React Testing Library, & Playwright", dur: "3 SKS · 150m", category: "Rekayasa Web", level: "lanjutan" },
  { id: "mod-web-8", title: "Deployment Produksi, Docker Multi-Stage, & CI/CD Pipeline", dur: "3 SKS · 150m", category: "Rekayasa Web", level: "lanjutan" },
];

export async function getLandingCurriculumData(): Promise<LandingCurriculumData> {
  let dbModulesList: ModuleItem[] = [];
  let totalProjectsCount = 0;
  let totalCategoriesCount = SYSTEM_PRIMARY_CATEGORIES.length;
  let totalNotesCount = 0;

  try {
    const supabase = await createClient();

    // 1. Ambil data modules jika tersedia
    const { data: dbModules } = await supabase
      .from("modules")
      .select("id, title, level, category_id, category:categories(name), chapters:module_chapters(id)")
      .limit(30);

    if (dbModules && dbModules.length > 0) {
      dbModulesList = dbModules.map((m: any) => ({
        id: m.id,
        title: m.title,
        level: m.level || "pemula",
        category: m.category?.name || "Modul Pembelajaran",
        dur: `${m.chapters?.length || 3} Bab · Pembelajaran Terarah`,
        chaptersCount: m.chapters?.length || 0,
        kind: "module",
      }));
    }

    // 2. Ambil hitungan proyek
    const { count: projCount } = await supabase
      .from("projects")
      .select("id", { count: "exact", head: true });
    
    if (typeof projCount === "number" && projCount > 0) {
      totalProjectsCount = projCount;
    }

    // 3. Ambil hitungan notes vault
    const { count: noteCount } = await supabase
      .from("notes")
      .select("id", { count: "exact", head: true });
    
    if (typeof noteCount === "number" && noteCount > 0) {
      totalNotesCount = noteCount;
    }

    // 4. Hitung kategori riil
    const { count: catCount } = await supabase
      .from("categories")
      .select("id", { count: "exact", head: true });

    if (typeof catCount === "number" && catCount > 0) {
      totalCategoriesCount = catCount;
    }
  } catch (err) {
    // Graceful fallback jika Supabase belum siap atau koneksi anon terbatas
    console.warn("getLandingCurriculumData using default structured curriculum:", err);
  }

  // Gabungkan modul database dengan default jika database masih sedikit
  const finalModules: ModuleItem[] = dbModulesList.length >= 6
    ? dbModulesList
    : [...dbModulesList, ...DEFAULT_MODULES.filter((dm) => !dbModulesList.some((dbm) => dbm.title.toLowerCase() === dm.title.toLowerCase()))];

  const stats: LandingStats = {
    totalModules: Math.max(finalModules.length, 22),
    totalCategories: Math.max(totalCategoriesCount, 5),
    totalProjects: Math.max(totalProjectsCount, 12),
    totalNotes: Math.max(totalNotesCount, 48),
    totalQuizzes: 120, // Kuis terintegrasi AI
  };

  return {
    stats,
    collections: DEFAULT_COLLECTIONS,
    allModules: finalModules,
    activeDisciplines: [
      "Semua",
      "Kecerdasan Buatan",
      "Data Analytics",
      "Algoritma & Struktur Data",
      "Rekayasa Web",
    ],
  };
}
