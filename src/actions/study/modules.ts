"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ModuleFormData } from "@/lib/validations";
import { validateAcademicText } from "@/lib/academic-content-filter";
import { getCategoryDetails } from "./categories";
import { extractModuleDriveFromNotes, injectModuleDriveIntoNotes, ModuleComment } from "@/types/module-drive";
import { isOwnerUser } from "@/lib/utils";
import { SYSTEM_PRIMARY_CATEGORIES } from "@/lib/constants";

export async function getModules(
  search?: string,
  categoryId?: string,
  level?: string,
  scope: "all" | "mine" = "all",
  kind: "all" | "module" | "project" = "all",
  tech?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from("modules")
    .select("*, category:categories!category_id(*, parent:categories!parent_id(*)), chapters:module_chapters(*)")
    .order("created_at", { ascending: false });

  if (scope === "mine" && user) {
    query = query.eq("user_id", user.id);
  }

  if (categoryId) {
    // If user selected a parent category, include the parent ID and all its subcategories
    const { data: subcats } = await supabase
      .from("categories")
      .select("id")
      .eq("parent_id", categoryId);

    if (subcats && subcats.length > 0) {
      const allCatIds = [categoryId, ...subcats.map((s) => s.id)];
      query = query.in("category_id", allCatIds);
    } else {
      query = query.eq("category_id", categoryId);
    }
  }

  if (level) query = query.eq("level", level);
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,notes.ilike.%${search}%`);
  }

  const { data: initialData, error } = await query;
  let finalData = initialData;

  if (error) {
    // Fallback query if parent_id column does not exist on categories table yet
    let fallbackQuery = supabase
      .from("modules")
      .select("*, category:categories!category_id(*), chapters:module_chapters(*)")
      .order("created_at", { ascending: false });

    if (scope === "mine" && user) {
      fallbackQuery = fallbackQuery.eq("user_id", user.id);
    }

    if (categoryId) fallbackQuery = fallbackQuery.eq("category_id", categoryId);
    if (level) fallbackQuery = fallbackQuery.eq("level", level);
    if (search) {
      fallbackQuery = fallbackQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%,notes.ilike.%${search}%`);
    }

    const fallbackRes = await fallbackQuery;
    finalData = fallbackRes.data;
  }

  let enriched = (finalData || []).map((m: any) => {
    const drive = extractModuleDriveFromNotes(m.notes);
    const inferredKind = drive.kind || (m.title?.toLowerCase().startsWith("project") ? "project" : "module");
    return {
      ...m,
      kind: inferredKind,
      tech_stack: drive.techStack && drive.techStack.length > 0 ? drive.techStack : (inferredKind === "project" ? ["Source Code", "Programming"] : []),
      author_name: drive.authorName || m.author_name || user?.user_metadata?.full_name || (user?.email ? user.email.split("@")[0] : "Pengguna"),
      repository_url: drive.repositoryUrl || null,
      demo_url: drive.demoUrl || null,
      driveFilesCount: drive.files?.length || 0,
      driveFoldersCount: drive.folders?.length || 0,
      driveFiles: drive.files || [],
      driveFolders: drive.folders || [],
      commentsCount: drive.comments?.length || 0,
      reactionsCount: drive.reactions?.filter((r) => r.type === "like").length || 0,
    };
  });

  // Filter by content kind
  if (kind !== "all") {
    enriched = enriched.filter((m: any) => m.kind === kind);
  }

  // Filter by tech stack / programming language
  if (tech && tech.trim()) {
    const lowerTech = tech.toLowerCase().trim();
    enriched = enriched.filter((m: any) =>
      m.tech_stack?.some((t: string) => t.toLowerCase().includes(lowerTech)) ||
      m.title?.toLowerCase().includes(lowerTech) ||
      m.description?.toLowerCase().includes(lowerTech) ||
      m.category?.name?.toLowerCase().includes(lowerTech)
    );
  }

  return enriched;
}


function sanitizePgText(str?: string | null): string {
  if (!str) return "";
  return str
    .replace(/\u0000/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
    .trim();
}

export async function createModule(data: ModuleFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Silakan masuk ke akun Anda terlebih dahulu untuk menambah konten.");

  // Academic relevance and content safety verification
  const academicValidation = validateAcademicText(data.description || "", data.title);
  if (!academicValidation.isValid) {
    throw new Error(
      academicValidation.reason ||
        "Konten atau judul terdeteksi tidak sesuai dengan bahan ajar akademik."
    );
  }

  let validCategoryId: string | null = null;
  if (data.category_id && typeof data.category_id === "string" && data.category_id.trim() !== "") {
    const rawCat = data.category_id.trim();

    // 1. Try finding by ID
    const { data: catById } = await supabase
      .from("categories")
      .select("id")
      .eq("id", rawCat)
      .maybeSingle();

    if (catById) {
      validCategoryId = catById.id;
    } else {
      // 2. Try finding by name in DB
      const { data: catByName } = await supabase
        .from("categories")
        .select("id")
        .ilike("name", rawCat)
        .maybeSingle();

      if (catByName) {
        validCategoryId = catByName.id;
      } else {
        // 3. Auto-insert preset category into DB so it persists
        try {
          const catDetails = await getCategoryDetails(rawCat);
          let parentId: string | null = null;

          if (catDetails?.parent?.name) {
            const { data: parentCat } = await supabase
              .from("categories")
              .select("id")
              .ilike("name", catDetails.parent.name)
              .maybeSingle();

            if (parentCat) {
              parentId = parentCat.id;
            } else {
              const { data: createdParent } = await supabase
                .from("categories")
                .insert({
                  user_id: user.id,
                  name: catDetails.parent.name,
                  color: catDetails.parent.color || "#3b82f6",
                  icon: catDetails.parent.icon || "code",
                })
                .select("id")
                .maybeSingle();
              if (createdParent) parentId = createdParent.id;
            }
          }

          const { data: createdSub } = await supabase
            .from("categories")
            .insert({
              user_id: user.id,
              name: catDetails?.name || rawCat,
              color: catDetails?.color || "#3b82f6",
              icon: catDetails?.icon || "code",
              parent_id: parentId,
            })
            .select("id")
            .maybeSingle();

          if (createdSub) validCategoryId = createdSub.id;
        } catch (e) {
          console.warn("Auto-insert category error:", e);
        }
      }
    }
  }

  const defaultTitle = data.kind === "project" ? "Project Baru" : "Modul Pembelajaran Baru";
  const sanitizedTitle = sanitizePgText(data.title) || defaultTitle;
  const sanitizedDesc = sanitizePgText(data.description);
  
  // Format initial drive payload with kind & techStack
  const authorName = user.user_metadata?.full_name || user.user_metadata?.name || (user.email ? user.email.split("@")[0] : "Pengguna");
  const initialDriveNotes = injectModuleDriveIntoNotes(
    data.notes || "",
    [],
    [],
    [],
    [],
    {
      kind: data.kind || "module",
      techStack: data.tech_stack || [],
      repositoryUrl: data.repository_url || undefined,
      demoUrl: data.demo_url || undefined,
      authorName,
    }
  );

  let created: any = null;
  try {
    const res = await supabase
      .from("modules")
      .insert({
        user_id: user.id,
        title: sanitizedTitle,
        description: sanitizedDesc,
        category_id: validCategoryId,
        level: data.level || "pemula",
        progress: 0,
        notes: initialDriveNotes,
        content_type: data.kind || "module",
        tech_stack: data.tech_stack || [],
        repository_url: data.repository_url || null,
        demo_url: data.demo_url || null,
        author_name: authorName,
      })
      .select()
      .single();

    if (res.error) throw res.error;
    created = res.data;
  } catch {
    // Fallback if custom columns don't exist yet on DB
    const fallbackRes = await supabase
      .from("modules")
      .insert({
        user_id: user.id,
        title: sanitizedTitle,
        description: sanitizedDesc,
        category_id: validCategoryId,
        level: data.level || "pemula",
        progress: 0,
        notes: initialDriveNotes,
      })
      .select()
      .single();

    if (fallbackRes.error) throw new Error(fallbackRes.error.message);
    created = fallbackRes.data;
  }

  revalidatePath("/dashboard/modul");
  return created;
}

export async function addModuleChapters(moduleId: string, titles: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  if (!titles || titles.length === 0) return [];

  const rows = titles
    .map((t) => sanitizePgText(t))
    .filter(Boolean)
    .map((title, idx) => ({
      module_id: moduleId,
      title,
      order_index: idx + 1,
      is_completed: false,
    }));

  if (rows.length === 0) return [];

  const { data, error } = await supabase
    .from("module_chapters")
    .insert(rows)
    .select();

  if (error) {
    console.error("Bulk add chapters error:", error);
    return [];
  }

  revalidatePath("/dashboard/modul");
  return data || [];
}

export async function seedStarterCommunityModules() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const starterModules = [
    {
      title: "Mastering Python: Dari Dasar Hingga OOP & Scripting",
      description: "Panduan lengkap belajar bahasa pemrograman Python untuk pemula hingga mahir, mencakup sintaks, struktur data, fungsi, OOP, dan manipulasi data.",
      categoryMatch: "Python",
      level: "pemula",
      author: "Tim Kurikulum Velqora",
      notes: "👤 **Diposting oleh:** Tim Kurikulum Velqora\n\nModul resmi kurikulum Python untuk mahasiswa dan pelajar.",
      chapters: [
        "Pengenalan Python, Variabel, dan Tipe Data",
        "Struktur Kendali (If-Else, For Loop, While Loop)",
        "Struktur Data: List, Tuple, Dictionary, dan Set",
        "Fungsi, Parameter, dan Lambda Expressions",
        "Pemrograman Berorientasi Objek (OOP) & Class",
        "Penanganan File I/O dan Exception Handling",
      ],
    },
    {
      title: "Fullstack JavaScript & TypeScript Modern Guide",
      description: "Belajar ekosistem JavaScript modern, TypeScript static typing, asynchronous programming, dan integrasi API RESTful.",
      categoryMatch: "JavaScript",
      level: "menengah",
      author: "Tim Kurikulum Velqora",
      notes: "👤 **Diposting oleh:** Tim Kurikulum Velqora\n\nModul panduan JavaScript & TypeScript modern.",
      chapters: [
        "JavaScript ES6+ Syntax & Array Methods",
        "Asynchronous JavaScript: Promise, Async/Await",
        "TypeScript Fundamentals & Type Annotations",
        "Interfaces, Types, Generics & Utility Types",
        "Fetching Data dari REST API & Error Handling",
      ],
    },
    {
      title: "Next.js 15 App Router & Server Actions Masterclass",
      description: "Arsitektur web modern dengan Next.js App Router, Server vs Client Components, dynamic routing, dan mutasi data database.",
      categoryMatch: "Next.js",
      level: "menengah",
      author: "Tim Kurikulum Velqora",
      notes: "👤 **Diposting oleh:** Tim Kurikulum Velqora\n\nModul belajar Web Development dengan Next.js.",
      chapters: [
        "Konsep Server Components vs Client Components",
        "Routing, Layouts, dan Dynamic Route Segments",
        "Server Actions untuk Mutasi Data Tanpa API Route",
        "State Management & Optimistic UI Updates",
        "SEO Optimization & Deployment ke Vercel",
      ],
    },
    {
      title: "Fundamental Machine Learning & AI Terapan",
      description: "Konsep dasar kecerdasan buatan, algoritma supervised & unsupervised learning, preprocessing data, dan evaluasi model.",
      categoryMatch: "Machine Learning",
      level: "menengah",
      author: "Tim Kurikulum Velqora",
      notes: "👤 **Diposting oleh:** Tim Kurikulum Velqora\n\nModul kecerdasan buatan & machine learning.",
      chapters: [
        "Pengantar Kecerdasan Buatan & Cabang AI",
        "Data Preprocessing & Feature Engineering",
        "Supervised Learning: Regresi Linear & Logistik",
        "Decision Trees & Random Forest Classifier",
        "Unsupervised Learning: K-Means Clustering",
        "Evaluasi Model & Matriks Konfusi (Confusion Matrix)",
      ],
    },
    {
      title: "Basis Data Relasional & Query SQL Terapan",
      description: "Desain database relasional, DDL/DML, relasi antar tabel (FK/PK), JOIN kompleks, subquery, dan indexing performa tinggi.",
      categoryMatch: "PostgreSQL",
      level: "pemula",
      author: "Tim Kurikulum Velqora",
      notes: "👤 **Diposting oleh:** Tim Kurikulum Velqora\n\nModul perancangan dan kueri database SQL.",
      chapters: [
        "Konsep RDBMS & Normalisasi Database (1NF-3NF)",
        "DDL: CREATE, ALTER, DROP Table & Constraints",
        "DML: INSERT, UPDATE, DELETE, dan SELECT Dasar",
        "Kueri Relasional: INNER, LEFT, RIGHT JOIN",
        "Fungsi Agregasi (GROUP BY, HAVING, COUNT)",
        "Indexing, Transaksi ACID, dan Keamanan Data",
      ],
    },
    {
      title: "Analisis Data Eksploratif (EDA) dengan Pandas & Python",
      description: "Metode pembersihan data, eksplorasi pola statistik, korelasi variabel, dan visualisasi interaktif.",
      categoryMatch: "Data Science",
      level: "pemula",
      author: "Tim Kurikulum Velqora",
      notes: "👤 **Diposting oleh:** Tim Kurikulum Velqora\n\nModul analisis data sains dan visualisasi.",
      chapters: [
        "Data Ingestion dari CSV, Excel, dan Database",
        "Data Cleaning: Missing Values & Outlier Detection",
        "Data Transformation & Grouping dengan Pandas",
        "Visualisasi Data dengan Matplotlib & Seaborn",
        "Analisis Korelasi & Penarikan Kesimpulan Bisnis",
      ],
    },
    {
      title: "Pengantar Keamanan Siber & Pertahanan Jaringan",
      description: "Memahami prinsip CIA Triad, identifikasi ancaman siber, OWASP Top 10 web vulnerabilities, dan proteksi sistem.",
      categoryMatch: "Cyber Security",
      level: "pemula",
      author: "Tim Kurikulum Velqora",
      notes: "👤 **Diposting oleh:** Tim Kurikulum Velqora\n\nModul fundamental keamanan sistem informasi.",
      chapters: [
        "Prinsip Dasar Keamanan Informasi (CIA Triad)",
        "Arsitektur Jaringan, Firewall, dan Port Scanning",
        "Kerentanan Web Populer (OWASP Top 10)",
        "Dasar Kriptografi Simetris & Asimetris",
        "Hardening Server & Kebijakan Keamanan Siber",
      ],
    },
    {
      title: "Desain UI/UX & Design System Berbasis Figma",
      description: "Prinsip antarmuka pengguna modern, wireframing, prototipe interaktif, dan pembuatan reusable design system.",
      categoryMatch: "UI/UX Design",
      level: "pemula",
      author: "Tim Kurikulum Velqora",
      notes: "👤 **Diposting oleh:** Tim Kurikulum Velqora\n\nModul panduan desain antarmuka dan pengalaman pengguna.",
      chapters: [
        "User Research & Pembuatan Persona Pengguna",
        "Prinsip Tata Letak, Grid System & Visual Hierarchy",
        "Typography, Palet Warna & Aksesibilitas (a11y)",
        "Auto-layout, Variasi Komponen & Prototyping Figma",
        "Usability Testing & Iterasi Desain Berdasarkan Feedback",
      ],
    },
    // ============================================================
    // STARTER SOURCE CODE & NOTEBOOK PROJECTS
    // ============================================================
    {
      title: "Project: Sistem Prediksi Cuaca & Analisis Iklim (ML & Python)",
      description: "Repositori proyek machine learning lengkap untuk memprediksi curah hujan dan pola iklim harian menggunakan Random Forest & Pandas.",
      categoryMatch: "Machine Learning",
      level: "menengah",
      author: "Tim Kurikulum Velqora",
      notes: injectModuleDriveIntoNotes(
        "👤 **Dibuat oleh:** Tim Kurikulum Velqora\n\nProyek implementasi machine learning praktis end-to-end dengan notebook Jupyter, skrip training modular, dan dataset.",
        [
          { id: "f_src", name: "src", parentId: null, createdAt: new Date().toISOString() },
          { id: "f_data", name: "data", parentId: null, createdAt: new Date().toISOString() },
        ],
        [
          {
            id: "p1_nb",
            name: "weather_prediction_model.ipynb",
            folderId: "f_src",
            storagePath: "",
            url: "https://example.com/weather_prediction_model.ipynb",
            size: 14200,
            fileType: "Jupyter Notebook",
            extension: "ipynb",
            category: "jupyter",
            description: "Jupyter Notebook eksplorasi data, feature engineering, dan evaluasi model Random Forest",
            uploadedAt: new Date().toISOString(),
            textContent: JSON.stringify({
              cells: [
                {
                  cell_type: "markdown",
                  source: ["# 🌦️ Sistem Prediksi Cuaca & Analisis Iklim\n\nNotebook ini mengimplementasikan pipeline klasifikasi cuaca (Hujan vs Cerah) menggunakan algoritma **Random Forest Classifier** dan evaluasi matriks akurasi."],
                },
                {
                  cell_type: "code",
                  execution_count: 1,
                  source: [
                    "import pandas as pd\n",
                    "import numpy as np\n",
                    "from sklearn.model_selection import train_test_split\n",
                    "from sklearn.ensemble import RandomForestClassifier\n",
                    "from sklearn.metrics import classification_report, accuracy_score\n",
                    "\n",
                    "# 1. Membaca dataset cuaca\n",
                    "df = pd.read_csv('../data/dataset_weather_sample.csv')\n",
                    "print(f'Ukuran Dataset: {df.shape[0]} baris, {df.shape[1]} kolom')\n",
                    "df.head()"
                  ],
                  outputs: [
                    {
                      output_type: "stream",
                      name: "stdout",
                      text: "Ukuran Dataset: 500 baris, 6 kolom\n"
                    }
                  ]
                },
                {
                  cell_type: "markdown",
                  source: ["## 2. Preprocessing & Feature Selection\nMemisahkan fitur numerik atmosfer (Suhu, Kelembaban, Tekanan Udara, Kecepatan Angin) dan target klasifikasi."],
                },
                {
                  cell_type: "code",
                  execution_count: 2,
                  source: [
                    "X = df[['Temperature', 'Humidity', 'Pressure', 'WindSpeed']]\n",
                    "y = df['RainTomorrow']\n",
                    "\n",
                    "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n",
                    "model = RandomForestClassifier(n_estimators=100, random_state=42)\n",
                    "model.fit(X_train, y_train)\n",
                    "\n",
                    "y_pred = model.predict(X_test)\n",
                    "acc = accuracy_score(y_test, y_pred)\n",
                    "print(f'Model Accuracy Score: {acc * 100:.2f}%')"
                  ],
                  outputs: [
                    {
                      output_type: "stream",
                      name: "stdout",
                      text: "Model Accuracy Score: 94.00%\n"
                    }
                  ]
                }
              ]
            })
          },
          {
            id: "p1_py",
            name: "train_pipeline.py",
            folderId: "f_src",
            storagePath: "",
            url: "https://example.com/train_pipeline.py",
            size: 4320,
            fileType: "Python Script",
            extension: "py",
            category: "python",
            description: "Modul pelatihan mandiri dengan CLI argument parser",
            uploadedAt: new Date().toISOString(),
            textContent: `"""
Weather Prediction ML Pipeline
Author: Tim Kurikulum Velqora
License: MIT
"""

import sys
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

def run_training_pipeline(csv_path: str = "data/dataset_weather_sample.csv"):
    print(f"[*] Loading weather data from {csv_path}...")
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"[!] Gagal membaca dataset: {e}")
        return
        
    features = ['Temperature', 'Humidity', 'Pressure', 'WindSpeed']
    target = 'RainTomorrow'
    
    X = df[features]
    y = df[target]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("[*] Training Random Forest model with 100 estimators...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    score = clf.score(X_test, y_test)
    print(f"[+] Training complete! Test Accuracy: {score * 100:.2f}%")

if __name__ == "__main__":
    run_training_pipeline()
`
          },
          {
            id: "p1_csv",
            name: "dataset_weather_sample.csv",
            folderId: "f_data",
            storagePath: "",
            url: "https://example.com/dataset_weather_sample.csv",
            size: 8900,
            fileType: "Dataset CSV",
            extension: "csv",
            category: "excel",
            description: "Dataset cuaca atmosfer historis sampel",
            uploadedAt: new Date().toISOString(),
            textContent: `Date,Temperature,Humidity,Pressure,WindSpeed,RainTomorrow
2026-08-01,29.4,78,1012,14.2,Yes
2026-08-02,31.2,65,1014,10.5,No
2026-08-03,28.5,82,1010,18.0,Yes
2026-08-04,32.0,58,1015,8.2,No
2026-08-05,27.8,88,1008,22.4,Yes
2026-08-06,30.5,70,1013,12.1,No
2026-08-07,29.1,75,1011,15.3,Yes
2026-08-08,33.1,52,1016,7.5,No
2026-08-09,28.0,85,1009,20.1,Yes
2026-08-10,31.8,62,1014,9.8,No`
          },
          {
            id: "p1_req",
            name: "requirements.txt",
            folderId: null,
            storagePath: "",
            url: "https://example.com/requirements.txt",
            size: 210,
            fileType: "Dependencies",
            extension: "txt",
            category: "python",
            description: "Daftar pustaka Python yang dibutuhkan",
            uploadedAt: new Date().toISOString(),
            textContent: "pandas>=2.0.0\nnumpy>=1.24.0\nscikit-learn>=1.3.0\nmatplotlib>=3.7.0\nseaborn>=0.12.0\njupyterlab>=4.0.0"
          },
          {
            id: "p1_readme",
            name: "README.md",
            folderId: null,
            storagePath: "",
            url: "https://example.com/README.md",
            size: 1850,
            fileType: "Markdown Documentation",
            extension: "md",
            category: "markdown",
            description: "Dokumentasi proyek & instruksi instalasi",
            uploadedAt: new Date().toISOString(),
            textContent: `# 🌦️ Sistem Prediksi Cuaca (Machine Learning)

Repositori proyek pembelajaran mesin terapan untuk analisis atmosfer dan prediksi curah hujan harian.

## 🚀 Fitur Utama
- **Jupyter Notebook Interaktif**: Eksplorasi data, visualisasi korelasi fitur, dan evaluasi matriks.
- **Pipeline Skrip Modular**: Kode Python bersih yang siap dieksekusi melalui terminal.
- **Akurasi Tinggi**: Menggunakan Random Forest Classifier dengan akurasi pengujian mencapai 94%.

## 🛠️ Instalasi & Menjalankan
\`\`\`bash
pip install -r requirements.txt
python src/train_pipeline.py
\`\`\`

Dibuat untuk keperluan materi pembelajaran & portofolio sains data.`
          }
        ],
        [],
        [],
        {
          kind: "project",
          techStack: ["Python", "Scikit-Learn", "Pandas", "Jupyter", "Machine Learning"],
          authorName: "Tim Kurikulum Velqora",
          repositoryUrl: "https://github.com/velqora-team/weather-prediction-ml",
        }
      ),
      chapters: [
        "Inisialisasi Proyek & Eksplorasi Dataset Cuaca",
        "Data Cleaning & Penanganan Missing Values",
        "Feature Engineering & Pembagian Data Train/Test",
        "Pelatihan Model Random Forest Classifier",
        "Evaluasi Matriks Akurasi & Deployment Pipeline",
      ],
    },
    {
      title: "Project: Fullstack E-Commerce Analytics Dashboard",
      description: "Repositori web dashboard modern dengan Next.js App Router, TypeScript, Tailwind CSS, dan integrasi schema database Supabase.",
      categoryMatch: "Next.js",
      level: "menengah",
      author: "Tim Kurikulum Velqora",
      notes: injectModuleDriveIntoNotes(
        "👤 **Dibuat oleh:** Tim Kurikulum Velqora\n\nProyek fullstack web application untuk manajemen transaksi, metrik penjualan, dan visualisasi analitik.",
        [
          { id: "f_comp", name: "components", parentId: null, createdAt: new Date().toISOString() },
          { id: "f_db", name: "database", parentId: null, createdAt: new Date().toISOString() },
        ],
        [
          {
            id: "p2_pkg",
            name: "package.json",
            folderId: null,
            storagePath: "",
            url: "https://example.com/package.json",
            size: 780,
            fileType: "Node.js Config",
            extension: "json",
            category: "code",
            description: "Konfigurasi dependensi project web",
            uploadedAt: new Date().toISOString(),
            textContent: JSON.stringify({
              name: "ecommerce-analytics-dashboard",
              version: "1.0.0",
              dependencies: {
                "next": "15.1.0",
                "react": "^19.0.0",
                "react-dom": "^19.0.0",
                "@supabase/supabase-js": "^2.45.0",
                "lucide-react": "^0.460.0",
                "tailwindcss": "^4.0.0"
              }
            }, null, 2)
          },
          {
            id: "p2_layout",
            name: "dashboard_layout.tsx",
            folderId: "f_comp",
            storagePath: "",
            url: "https://example.com/dashboard_layout.tsx",
            size: 3890,
            fileType: "React TypeScript",
            extension: "tsx",
            category: "code",
            description: "Komponen tata letak analitik responsif",
            uploadedAt: new Date().toISOString(),
            textContent: `"use client";

import React from "react";

export function AnalyticsDashboardOverview() {
  const metrics = [
    { title: "Total Pendapatan", value: "Rp 128.500.000", change: "+14.2%" },
    { title: "Transaksi Sukses", value: "1.420 Order", change: "+8.5%" },
    { title: "Pelanggan Aktif", value: "850 Pengguna", change: "+12.1%" },
  ];

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold text-slate-100">Ikhtisar Performa Penjualan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <div key={m.title} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-md">
            <p className="text-xs text-slate-400 font-medium">{m.title}</p>
            <p className="text-2xl font-bold text-white mt-1">{m.value}</p>
            <span className="text-xs font-semibold text-emerald-400 mt-2 inline-block">{m.change} dibanding bulan lalu</span>
          </div>
        ))}
      </div>
    </div>
  );
}`
          },
          {
            id: "p2_sql",
            name: "database_schema.sql",
            folderId: "f_db",
            storagePath: "",
            url: "https://example.com/database_schema.sql",
            size: 1950,
            fileType: "SQL Schema",
            extension: "sql",
            category: "code",
            description: "DDL relasi tabel order, produk, dan transaksi",
            uploadedAt: new Date().toISOString(),
            textContent: `-- Schema Database E-Commerce Analytics
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price NUMERIC(10, 2) NOT NULL
);`
          },
          {
            id: "p2_readme",
            name: "README.md",
            folderId: null,
            storagePath: "",
            url: "https://example.com/README.md",
            size: 1200,
            fileType: "Markdown Documentation",
            extension: "md",
            category: "markdown",
            description: "Petunjuk instalasi dan arsitektur dashboard",
            uploadedAt: new Date().toISOString(),
            textContent: `# 📊 Fullstack E-Commerce Analytics Dashboard

Aplikasi web dashboard realtime dibangun dengan Next.js 15 App Router dan Supabase Database.

## 🌟 Tech Stack
- **Framework**: Next.js 15 & React 19
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL / Supabase Relational

## 🚀 Memulai
\`\`\`bash
npm install
npm run dev
\`\`\``
          }
        ],
        [],
        [],
        {
          kind: "project",
          techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "React"],
          authorName: "Tim Kurikulum Velqora",
          repositoryUrl: "https://github.com/velqora-team/nextjs-ecommerce-analytics",
        }
      ),
      chapters: [
        "Arsitektur Aplikasi & Setup Supabase Database",
        "Pembuatan Komponen UI & Visualisasi Metrik",
        "Implementasi Server Actions & Mutasi Transaksi",
        "Filter Rentang Waktu & Optimasi Query",
      ],
    },
    {
      title: "Project: Sistem Kasir & Manajemen Stok (POS Desktop Python)",
      description: "Aplikasi kasir point of sale berbasis Python & SQLite dengan kalkulasi total otomatis, cetak struk, dan manajemen inventaris.",
      categoryMatch: "Python",
      level: "pemula",
      author: "Tim Kurikulum Velqora",
      notes: injectModuleDriveIntoNotes(
        "👤 **Dibuat oleh:** Tim Kurikulum Velqora\n\nProyek aplikasi kasir desktop dengan basis data lokal SQLite dan antarmuka Python.",
        [],
        [
          {
            id: "p3_main",
            name: "main_pos_app.py",
            folderId: null,
            storagePath: "",
            url: "https://example.com/main_pos_app.py",
            size: 3200,
            fileType: "Python Script",
            extension: "py",
            category: "python",
            description: "Logika utama transaksi kasir dan hitung total",
            uploadedAt: new Date().toISOString(),
            textContent: `import sqlite3

class POSSystem:
    def __init__(self, db_name="pos_data.db"):
        self.conn = sqlite3.connect(db_name)
        self.create_tables()
        
    def create_tables(self):
        with self.conn:
            self.conn.execute("""
                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    price REAL NOT NULL,
                    stock INTEGER NOT NULL
                )
            """)
            
    def add_product(self, name, price, stock):
        with self.conn:
            self.conn.execute("INSERT INTO products (name, price, stock) VALUES (?, ?, ?)", (name, price, stock))
        print(f"[+] Produk '{name}' berhasil didaftarkan.")

if __name__ == "__main__":
    pos = POSSystem()
    print("Sistem Kasir Siap Digunakan.")`
          },
          {
            id: "p3_readme",
            name: "README.md",
            folderId: null,
            storagePath: "",
            url: "https://example.com/README.md",
            size: 980,
            fileType: "Markdown Documentation",
            extension: "md",
            category: "markdown",
            description: "Panduan menjalankan sistem kasir",
            uploadedAt: new Date().toISOString(),
            textContent: `# 🛒 Sistem Kasir POS Python

Aplikasi kasir mandiri ringan dengan basis data SQLite lokal untuk UMKM.`
          }
        ],
        [],
        [],
        {
          kind: "project",
          techStack: ["Python", "SQLite", "Desktop", "OOP"],
          authorName: "Tim Kurikulum Velqora",
        }
      ),
      chapters: [
        "Desain Skema SQLite & Relasi Produk",
        "Implementasi Operasi CRUD Produk & Stok",
        "Logika Transaksi Kasir & Validasi Saldo",
      ],
    },
  ];

  const { data: allCategories } = await supabase.from("categories").select("*");
  const categoryCache = new Map<string, any>();
  (allCategories || []).forEach((c: any) => {
    categoryCache.set(c.name.toLowerCase().trim(), c);
  });

  const createdModules = [];

  for (const starter of starterModules) {
    let validCatId = categoryCache.get(starter.categoryMatch.toLowerCase().trim())?.id || null;

    if (!validCatId) {
      // Find parent category and subcategory from SYSTEM_PRIMARY_CATEGORIES
      for (const primary of SYSTEM_PRIMARY_CATEGORIES) {
        const sub = primary.subcategories.find(
          (s) => s.name.toLowerCase() === starter.categoryMatch.toLowerCase()
        );
        if (sub) {
          let parentCat = categoryCache.get(primary.name.toLowerCase().trim());
          if (!parentCat) {
            const { data: createdParent } = await supabase
              .from("categories")
              .insert({
                user_id: user.id,
                name: primary.name,
                color: primary.color,
                icon: primary.icon,
                parent_id: null,
              })
              .select()
              .maybeSingle();
            if (createdParent) {
              parentCat = createdParent;
              categoryCache.set(primary.name.toLowerCase().trim(), createdParent);
            }
          }

          if (parentCat) {
            const { data: createdSub } = await supabase
              .from("categories")
              .insert({
                user_id: user.id,
                name: sub.name,
                color: sub.color || primary.color,
                icon: sub.icon || primary.icon,
                parent_id: parentCat.id,
              })
              .select()
              .maybeSingle();
            if (createdSub) {
              validCatId = createdSub.id;
              categoryCache.set(sub.name.toLowerCase().trim(), createdSub);
            }
          }
          break;
        }
      }
    }

    // Check if module with same title already exists
    const { data: existingMod } = await supabase
      .from("modules")
      .select("id")
      .ilike("title", `%${starter.title.slice(0, 25)}%`)
      .maybeSingle();

    if (!existingMod) {
      const drive = extractModuleDriveFromNotes(starter.notes);
      const isProject = drive.kind === "project" || starter.title.toLowerCase().startsWith("project");
      const kind = isProject ? "project" : "module";

      let createdItem: any = null;
      try {
        const res = await supabase
          .from("modules")
          .insert({
            user_id: user.id,
            title: starter.title,
            description: starter.description,
            category_id: validCatId,
            level: starter.level as any,
            progress: 0,
            notes: starter.notes,
            content_type: kind,
            tech_stack: drive.techStack || [],
            repository_url: drive.repositoryUrl || null,
            demo_url: drive.demoUrl || null,
            author_name: starter.author || "Tim Kurikulum Velqora",
          })
          .select()
          .single();

        if (res.error) throw res.error;
        createdItem = res.data;
      } catch {
        const fallbackRes = await supabase
          .from("modules")
          .insert({
            user_id: user.id,
            title: starter.title,
            description: starter.description,
            category_id: validCatId,
            level: starter.level as any,
            progress: 0,
            notes: starter.notes,
          })
          .select()
          .single();

        if (!fallbackRes.error && fallbackRes.data) {
          createdItem = fallbackRes.data;
        }
      }

      if (createdItem) {
        createdModules.push(createdItem);
        if (starter.chapters && starter.chapters.length > 0) {
          await addModuleChapters(createdItem.id, starter.chapters);
        }
      }
    }
  }

  revalidatePath("/dashboard/modul");
  return createdModules;
}

export async function updateModule(id: string, data: Partial<ModuleFormData>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const isOwner = isOwnerUser(user.email);

  // Fetch current module to maintain drive contents
  const { data: currentMod } = await supabase.from("modules").select("notes").eq("id", id).maybeSingle();
  let updatedNotes = data.notes !== undefined ? sanitizePgText(data.notes) : (currentMod?.notes || "");

  if (data.kind || data.tech_stack || data.repository_url !== undefined || data.demo_url !== undefined) {
    const currentDrive = extractModuleDriveFromNotes(updatedNotes);
    updatedNotes = injectModuleDriveIntoNotes(
      updatedNotes,
      currentDrive.folders,
      currentDrive.files,
      currentDrive.comments,
      currentDrive.reactions,
      {
        kind: data.kind || currentDrive.kind,
        techStack: data.tech_stack !== undefined ? data.tech_stack : currentDrive.techStack,
        repositoryUrl: data.repository_url !== undefined ? (data.repository_url || undefined) : currentDrive.repositoryUrl,
        demoUrl: data.demo_url !== undefined ? (data.demo_url || undefined) : currentDrive.demoUrl,
      }
    );
  }

  const updatePayload: any = {};
  if (data.title !== undefined) updatePayload.title = sanitizePgText(data.title);
  if (data.description !== undefined) updatePayload.description = sanitizePgText(data.description);
  if (data.category_id !== undefined) updatePayload.category_id = data.category_id || null;
  if (data.level !== undefined) updatePayload.level = data.level;
  updatePayload.notes = updatedNotes;
  updatePayload.updated_at = new Date().toISOString();

  if (data.kind) updatePayload.content_type = data.kind;
  if (data.tech_stack) updatePayload.tech_stack = data.tech_stack;
  if (data.repository_url !== undefined) updatePayload.repository_url = data.repository_url || null;
  if (data.demo_url !== undefined) updatePayload.demo_url = data.demo_url || null;

  let updateQuery = supabase.from("modules").update(updatePayload).eq("id", id);
  if (!isOwner) {
    updateQuery = updateQuery.eq("user_id", user.id);
  }

  const { error } = await updateQuery;
  if (error) {
    // If error due to column missing, retry without custom columns
    delete updatePayload.content_type;
    delete updatePayload.tech_stack;
    delete updatePayload.repository_url;
    delete updatePayload.demo_url;

    let retryQuery = supabase.from("modules").update(updatePayload).eq("id", id);
    if (!isOwner) retryQuery = retryQuery.eq("user_id", user.id);
    const { error: retryError } = await retryQuery;
    if (retryError) throw new Error(retryError.message);
  }
  revalidatePath("/dashboard/modul");
}

export async function addModuleChapter(moduleId: string, title: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { count } = await supabase
    .from("module_chapters")
    .select("id", { count: "exact", head: true })
    .eq("module_id", moduleId);

  const { error } = await supabase.from("module_chapters").insert({
    module_id: moduleId,
    title: sanitizePgText(title) || "Bab Pembelajaran",
    order_index: (count || 0) + 1,
    is_completed: false,
  });

  if (error) throw new Error(error.message);
  await recalculateModuleProgress(moduleId);
  revalidatePath("/dashboard/modul");
}

export async function toggleChapterComplete(chapterId: string, moduleId: string, isCompleted: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("module_chapters")
    .update({ is_completed: isCompleted })
    .eq("id", chapterId);

  if (error) throw new Error(error.message);
  await recalculateModuleProgress(moduleId);
  revalidatePath("/dashboard/modul");
}

async function recalculateModuleProgress(moduleId: string) {
  const supabase = await createClient();
  const { data: chapters } = await supabase
    .from("module_chapters")
    .select("is_completed")
    .eq("module_id", moduleId);

  if (!chapters || chapters.length === 0) {
    await supabase.from("modules").update({ progress: 0 }).eq("id", moduleId);
    return;
  }

  const completedCount = chapters.filter((c) => c.is_completed).length;
  const progressPercent = Math.round((completedCount / chapters.length) * 100);

  await supabase.from("modules").update({ progress: progressPercent }).eq("id", moduleId);
}

export async function deleteModule(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const isOwner = isOwnerUser(user.email);

  // Safely clean up associated chapters first
  await supabase.from("module_chapters").delete().eq("module_id", id);

  let deleteQuery = supabase.from("modules").delete().eq("id", id);
  if (!isOwner) {
    deleteQuery = deleteQuery.eq("user_id", user.id);
  }

  const { error } = await deleteQuery;
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/modul");
}

// ==========================================
// MODULE GOOGLE DRIVE ACTIONS (Folders & Files)
// ==========================================

export async function toggleModuleReaction(
  moduleId: string,
  targetId: string = "module",
  type: "like" | "dislike"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Silakan masuk untuk memberikan like atau dislike");

  const { data: mod } = await supabase
    .from("modules")
    .select("notes")
    .eq("id", moduleId)
    .single();

  if (!mod) throw new Error("Modul tidak ditemukan");

  const drive = extractModuleDriveFromNotes(mod.notes);
  const existingReactions = drive.reactions || [];

  const existingIndex = existingReactions.findIndex(
    (r) => r.userId === user.id && r.targetId === targetId
  );

  const authorName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Pengguna";

  const updatedReactions = [...existingReactions];

  if (existingIndex >= 0) {
    const current = existingReactions[existingIndex];
    if (current.type === type) {
      // Toggle off (remove reaction)
      updatedReactions.splice(existingIndex, 1);
    } else {
      // Switch reaction (e.g. from dislike to like)
      updatedReactions[existingIndex] = {
        ...current,
        type,
        createdAt: new Date().toISOString(),
      };
    }
  } else {
    // Add new reaction
    updatedReactions.push({
      userId: user.id,
      userName: authorName,
      type,
      targetId,
      createdAt: new Date().toISOString(),
    });
  }

  const updatedNotes = injectModuleDriveIntoNotes(
    mod.notes,
    drive.folders,
    drive.files,
    drive.comments,
    updatedReactions
  );

  const { error } = await supabase
    .from("modules")
    .update({
      notes: updatedNotes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", moduleId);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/modul");
  return updatedReactions;
}

export async function addModuleComment(
  moduleId: string,
  targetId: string = "module",
  content: string,
  targetName?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Silakan masuk untuk menulis komentar");

  const cleanContent = sanitizePgText(content);
  if (!cleanContent) throw new Error("Komentar tidak boleh kosong");

  // Academic text filter
  const safety = validateAcademicText(cleanContent);
  if (!safety.isValid) {
    throw new Error(safety.reason || "Komentar terdeteksi tidak sesuai dengan etika dan standar akademik.");
  }

  const { data: mod } = await supabase
    .from("modules")
    .select("notes, user_id")
    .eq("id", moduleId)
    .single();

  if (!mod) throw new Error("Modul tidak ditemukan");

  const drive = extractModuleDriveFromNotes(mod.notes);
  const existingComments = drive.comments || [];

  const authorName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Pengguna";

  const isOwner = isOwnerUser(user.email);
  const isCreator = mod.user_id === user.id;
  const authorRole = isOwner ? "Owner" : isCreator ? "Pembuat Modul" : "Mahasiswa / Pelajar";

  const newComment: ModuleComment = {
    id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: user.id,
    authorName,
    authorEmail: user.email,
    authorRole,
    content: cleanContent,
    targetId,
    targetName: targetName || undefined,
    createdAt: new Date().toISOString(),
  };

  const updatedComments = [newComment, ...existingComments];

  const updatedNotes = injectModuleDriveIntoNotes(
    mod.notes,
    drive.folders,
    drive.files,
    updatedComments,
    drive.reactions
  );

  const { error } = await supabase
    .from("modules")
    .update({
      notes: updatedNotes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", moduleId);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/modul");
  return newComment;
}

export async function deleteModuleComment(
  moduleId: string,
  commentId: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: mod } = await supabase
    .from("modules")
    .select("notes, user_id")
    .eq("id", moduleId)
    .single();

  if (!mod) throw new Error("Modul tidak ditemukan");

  const drive = extractModuleDriveFromNotes(mod.notes);
  const existingComments = drive.comments || [];

  const targetComment = existingComments.find((c) => c.id === commentId);
  if (!targetComment) throw new Error("Komentar tidak ditemukan");

  const isOwner = isOwnerUser(user.email);
  const isCreator = mod.user_id === user.id;
  const isAuthor = targetComment.userId === user.id;

  if (!isAuthor && !isCreator && !isOwner) {
    throw new Error("Anda tidak memiliki izin untuk menghapus komentar ini.");
  }

  const remainingComments = existingComments.filter((c) => c.id !== commentId);

  const updatedNotes = injectModuleDriveIntoNotes(
    mod.notes,
    drive.folders,
    drive.files,
    remainingComments,
    drive.reactions
  );

  const { error } = await supabase
    .from("modules")
    .update({
      notes: updatedNotes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", moduleId);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/modul");
  return true;
}
