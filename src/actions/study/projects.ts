"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isOwnerUser } from "@/lib/utils";
import { Project } from "@/types";

export interface ProjectFormData {
  title: string;
  description?: string;
  category_id?: string;
  level?: "pemula" | "menengah" | "lanjutan";
  repository_url?: string;
  demo_url?: string;
  tech_stack?: string[];
  author_name?: string;
  cover_url?: string;
  notes?: string;
}

/**
 * 0. CURATED STARTER AI PROJECTS
 * Memberikan contoh proyek nyata terintegrasi kurikulum AI saat database masih kosong.
 */
const CURATED_AI_PROJECTS: Project[] = [
  {
    id: "proj_weather_ml",
    user_id: "system",
    title: "Sistem Prediksi Cuaca Real-Time (Random Forest & Scikit-Learn)",
    description: "Pipeline machine learning terapan untuk analisis atmosfer dan prediksi curah hujan harian berbasis Random Forest Classifier dengan data atmosfer dan REST API inferensi.",
    category_id: "Machine Learning",
    level: "pemula",
    repository_url: "https://github.com/velqora-team/weather-prediction-ml",
    demo_url: "https://weather-ml-demo.velqora.app",
    tech_stack: ["Python", "Scikit-Learn", "Pandas", "Streamlit", "Machine Learning"],
    author_name: "Tim Kurikulum AI Velqora",
    notes: "# 🌦️ Sistem Prediksi Cuaca (Machine Learning)\n\nRepositori proyek pembelajaran mesin terapan untuk analisis atmosfer dan prediksi curah hujan harian.\n\n## 🚀 Fitur Utama\n- Eksplorasi dataset cuaca atmosferik\n- Preprocessing dan Feature Engineering otomatis\n- Model Random Forest Classifier dengan akurasi 94%\n- Dashboard interaktif berbasis Streamlit",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "Machine Learning",
      name: "Machine Learning",
      color: "#8B5CF6",
      icon: "machine_learning",
      user_id: "system",
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "proj_yolo_cv",
    user_id: "system",
    title: "Deteksi Objek & Segmentasi Citra Real-Time (YOLOv8 & PyTorch)",
    description: "Implementasi deteksi multi-objek berkecepatan tinggi dengan arsitektur YOLOv8 pada video CCTV dan webcam secara real-time dengan bounding box akurat.",
    category_id: "Computer Vision",
    level: "menengah",
    repository_url: "https://github.com/velqora-team/yolov8-vision-detection",
    demo_url: "https://vision-yolo-demo.velqora.app",
    tech_stack: ["Python", "PyTorch", "YOLOv8", "OpenCV", "Computer Vision"],
    author_name: "Tim Kurikulum AI Velqora",
    notes: "# 👁️ Deteksi Objek Real-Time dengan YOLOv8\n\nRepositori implementasi computer vision modern untuk deteksi multi-objek berkecepatan tinggi.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "Computer Vision",
      name: "Computer Vision",
      color: "#3B82F6",
      icon: "computer_vision",
      user_id: "system",
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "proj_rag_llm",
    user_id: "system",
    title: "Enterprise RAG (Retrieval-Augmented Generation) dengan LangChain & FAISS",
    description: "Sistem tanya-jawab dokumen berbasis semantic search, dense vector retrieval, dan grounded LLM response dengan referensi kutipan data.",
    category_id: "Large Language Model",
    level: "lanjutan",
    repository_url: "https://github.com/velqora-team/enterprise-rag-langchain",
    demo_url: "https://rag-assistant-demo.velqora.app",
    tech_stack: ["Python", "LangChain", "OpenAI", "FAISS", "Large Language Model", "Vector DB"],
    author_name: "Tim Kurikulum AI Velqora",
    notes: "# 🤖 Enterprise RAG System\n\nImplementasi retrieval augmented generation untuk data internal perusahaan dengan latency rendah.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "Large Language Model",
      name: "Large Language Model",
      color: "#F59E0B",
      icon: "generative_ai",
      user_id: "system",
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "proj_crew_agent",
    user_id: "system",
    title: "Autonomous Multi-Agent Workflow Engine (CrewAI & LangGraph)",
    description: "Sistem orkestrasi multi-agen otonom untuk otomatisasi riset pasar, web scraping cerdas, dan penulisan laporan terstruktur.",
    category_id: "AI Agent",
    level: "lanjutan",
    repository_url: "https://github.com/velqora-team/multi-agent-crew-engine",
    demo_url: "https://agent-crew-demo.velqora.app",
    tech_stack: ["Python", "CrewAI", "LangGraph", "FastAPI", "AI Agent"],
    author_name: "Tim Kurikulum AI Velqora",
    notes: "# 🤖 Autonomous Multi-Agent Engine\n\nPlatform kolaboratif antar agen AI cerdas untuk otomasi alur kerja analitis.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "AI Agent",
      name: "AI Agent",
      color: "#EF4444",
      icon: "robotics",
      user_id: "system",
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "proj_resnet_dl",
    user_id: "system",
    title: "Klasifikasi Citra Medis X-Ray Paru-Paru (ResNet50 & PyTorch)",
    description: "Model transfer learning berbasis arsitektur deep residual network untuk screening pneumonia dan deteksi anomali radiologi secara otomatis.",
    category_id: "Deep Learning",
    level: "menengah",
    repository_url: "https://github.com/velqora-team/pneumonia-resnet-pytorch",
    demo_url: "https://xray-ai-demo.velqora.app",
    tech_stack: ["Python", "PyTorch", "TorchVision", "Deep Learning", "CNN"],
    author_name: "Tim Kurikulum AI Velqora",
    notes: "# 🩻 Deteksi Pneumonia dengan ResNet50\n\nModel deep learning berbasis Residual Network untuk mendeteksi pneumonia dari citra rontgen dada.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "Deep Learning",
      name: "Deep Learning",
      color: "#EC4899",
      icon: "deep_learning",
      user_id: "system",
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "proj_indobert_nlp",
    user_id: "system",
    title: "Analisis Sentimen & Klasifikasi Teks Bahasa Indonesia (IndoBERT)",
    description: "Fine-tuning pretrained IndoBERT model untuk sentiment analysis ulasan produk e-commerce dan deteksi emosi pada teks sosial media.",
    category_id: "Natural Language Processing",
    level: "menengah",
    repository_url: "https://github.com/velqora-team/indobert-sentiment-nlp",
    demo_url: "https://sentiment-id-demo.velqora.app",
    tech_stack: ["Python", "Transformers", "IndoBERT", "HuggingFace", "Natural Language Processing"],
    author_name: "Tim Kurikulum AI Velqora",
    notes: "# 📝 NLP Bahasa Indonesia dengan IndoBERT\n\nPipeline klasifikasi teks dan sentiment mining menggunakan transformer IndoBERT.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "Natural Language Processing",
      name: "Natural Language Processing",
      color: "#10B981",
      icon: "nlp",
      user_id: "system",
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "proj_prophet_ts",
    user_id: "system",
    title: "Prediksi Saham & Deteksi Anomali Metrik Finansial (Prophet & LSTM)",
    description: "Pemodelan deret waktu musiman untuk forecasting harga komoditas dan deteksi outlier anomali transaksi keuangan.",
    category_id: "Time Series Forecasting & Anomaly Detection",
    level: "menengah",
    repository_url: "https://github.com/velqora-team/timeseries-anomaly-prophet",
    demo_url: "https://timeseries-demo.velqora.app",
    tech_stack: ["Python", "Prophet", "TensorFlow", "Time Series", "Pandas"],
    author_name: "Tim Kurikulum AI Velqora",
    notes: "# 📈 Time Series Forecasting & Anomaly Detection\n\nAnalisis tren musiman dan deteksi fluktuasi anomali finansial.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "Time Series Forecasting & Anomaly Detection",
      name: "Time Series Forecasting & Anomaly Detection",
      color: "#06B6D4",
      icon: "time_series",
      user_id: "system",
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "proj_qdrant_vdb",
    user_id: "system",
    title: "Sistem Pencarian Semantik Produk Berbasis Qdrant & Sentence-Transformers",
    description: "Search engine multimodal untuk pencarian katalog e-commerce berdasarkan kemiripan vektor semantik dan hybrid text match.",
    category_id: "Vector Database & Retrieval System",
    level: "lanjutan",
    repository_url: "https://github.com/velqora-team/qdrant-semantic-search",
    demo_url: "https://semantic-search-demo.velqora.app",
    tech_stack: ["Python", "Qdrant", "Sentence-Transformers", "Vector DB", "FastAPI"],
    author_name: "Tim Kurikulum AI Velqora",
    notes: "# 🔍 Vector Search dengan Qdrant\n\nMesin pencari vektor semantik berkinerja tinggi dengan indexing HNSW.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "Vector Database & Retrieval System",
      name: "Vector Database & Retrieval System",
      color: "#8B5CF6",
      icon: "vector_db",
      user_id: "system",
      created_at: new Date().toISOString(),
    },
  },
];

/**
 * 1. GET ALL PROJECTS (Independen dari Modules)
 */
export async function getProjects(
  search?: string,
  categoryId?: string,
  level?: string,
  tech?: string,
  scope: "all" | "mine" = "all"
): Promise<Project[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dbProjects: Project[] = [];

  // Primary Query: Coba query tabel projects mandiri
  try {
    let query = supabase
      .from("projects")
      .select("*, category:categories!category_id(*)")
      .order("created_at", { ascending: false });

    if (scope === "mine" && user) {
      query = query.eq("user_id", user.id);
    }

    if (categoryId) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId);
      if (isUuid) {
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
      } else {
        const cleanName = decodeURIComponent(categoryId).trim().replace(/-/g, " ");
        const { data: matchedCats } = await supabase
          .from("categories")
          .select("id")
          .or(`name.ilike.%${cleanName}%,name.ilike.%${categoryId}%`);

        if (matchedCats && matchedCats.length > 0) {
          query = query.in("category_id", matchedCats.map((c) => c.id));
        }
      }
    }

    if (level) {
      query = query.eq("level", level);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,notes.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (!error && data) {
      dbProjects = data as Project[];
    }
  } catch (err) {
    console.warn("Primary projects table query error, attempting fallback:", err);
  }

  // Graceful Fallback: Jika tabel projects belum dimigrasi di Supabase, baca dari modules WHERE content_type = 'project'
  if (dbProjects.length === 0 && scope !== "mine") {
    try {
      let fallbackQuery = supabase
        .from("modules")
        .select("*, category:categories!category_id(*)")
        .eq("content_type", "project")
        .order("created_at", { ascending: false });

      if (categoryId) {
        fallbackQuery = fallbackQuery.eq("category_id", categoryId);
      }
      if (level) {
        fallbackQuery = fallbackQuery.eq("level", level);
      }
      if (search) {
        fallbackQuery = fallbackQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data: fbData } = await fallbackQuery;
      if (fbData && fbData.length > 0) {
        dbProjects = fbData.map((m: any) => ({
          id: m.id,
          user_id: m.user_id,
          title: m.title,
          description: m.description,
          category_id: m.category_id,
          level: m.level || "pemula",
          repository_url: m.repository_url,
          demo_url: m.demo_url,
          tech_stack: m.tech_stack || [],
          author_name: m.author_name,
          cover_url: m.cover_url,
          notes: m.notes,
          created_at: m.created_at,
          updated_at: m.updated_at,
          category: m.category,
        })) as Project[];
      }
    } catch {}
  }

  // Jika di database belum ada proyek sama sekali, sediakan proyek kurikulum AI terkurasi
  let combined = [...dbProjects];
  if (scope !== "mine") {
    // Sisipkan proyek terkurasi yang belum ada di database
    const existingTitles = new Set(dbProjects.map((p) => p.title.toLowerCase().trim()));
    const missingCurated = CURATED_AI_PROJECTS.filter(
      (cp) => !existingTitles.has(cp.title.toLowerCase().trim())
    );
    combined = [...dbProjects, ...missingCurated];
  }

  // Filter tech stack jika dispesifikasikan
  if (tech) {
    const targetTech = tech.toLowerCase().trim();
    combined = combined.filter((p) =>
      (p.tech_stack || []).some((t) => t.toLowerCase().includes(targetTech))
    );
  }

  // Filter category name / id jika search atau filter aktif
  if (categoryId) {
    const targetCat = categoryId.toLowerCase().trim();
    combined = combined.filter(
      (p) =>
        (p.category?.name || "").toLowerCase().trim() === targetCat ||
        (p.category_id || "").toLowerCase().trim() === targetCat
    );
  }

  return combined;
}

/**
 * 2. GET PROJECT BY ID
 */
export async function getProjectById(id: string): Promise<Project | null> {
  // Cek proyek terkurasi dulu
  const curated = CURATED_AI_PROJECTS.find((p) => p.id === id);
  if (curated) return curated;

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*, category:categories!category_id(*)")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return data as Project;
    }
  } catch (err) {
    console.warn("Error fetching from projects table:", err);
  }

  // Fallback ke modules
  try {
    const { data: fbData } = await supabase
      .from("modules")
      .select("*, category:categories!category_id(*)")
      .eq("id", id)
      .maybeSingle();

    if (fbData) {
      return {
        id: fbData.id,
        user_id: fbData.user_id,
        title: fbData.title,
        description: fbData.description,
        category_id: fbData.category_id,
        level: fbData.level || "pemula",
        repository_url: fbData.repository_url,
        demo_url: fbData.demo_url,
        tech_stack: fbData.tech_stack || [],
        author_name: fbData.author_name,
        cover_url: fbData.cover_url,
        notes: fbData.notes,
        created_at: fbData.created_at,
        updated_at: fbData.updated_at,
        category: fbData.category,
      } as Project;
    }
  } catch {}

  return null;
}

/**
 * 3. CREATE PROJECT
 */
export async function createProject(data: ProjectFormData): Promise<{ success: boolean; data?: any; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Harus masuk untuk menambahkan proyek." };
  }

  const payload = {
    user_id: user.id,
    title: data.title.trim(),
    description: data.description?.trim() || "",
    category_id: data.category_id || null,
    level: data.level || "pemula",
    repository_url: data.repository_url?.trim() || null,
    demo_url: data.demo_url?.trim() || null,
    tech_stack: data.tech_stack || [],
    author_name: data.author_name?.trim() || user.user_metadata?.full_name || user.email?.split("@")[0] || "Pengembang",
    cover_url: data.cover_url || null,
    notes: data.notes || "",
  };

  try {
    const { data: inserted, error } = await supabase
      .from("projects")
      .insert(payload)
      .select()
      .single();

    if (!error && inserted) {
      revalidatePath("/dashboard/project");
      return { success: true, data: inserted };
    }

    // Jika error tabel tidak ada, coba fallback ke modules
    if (error && error.code === "42P01") {
      const { data: fbInserted, error: fbError } = await supabase
        .from("modules")
        .insert({
          ...payload,
          content_type: "project",
        })
        .select()
        .single();

      if (fbError) {
        return { success: false, error: fbError.message };
      }
      revalidatePath("/dashboard/project");
      return { success: true, data: fbInserted };
    }

    return { success: false, error: error?.message || "Gagal menyimpan proyek." };
  } catch (err: any) {
    return { success: false, error: err.message || "Terjadi kesalahan sistem." };
  }
}

/**
 * 4. UPDATE PROJECT
 */
export async function updateProject(
  id: string,
  data: Partial<ProjectFormData>
): Promise<{ success: boolean; data?: any; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Harus masuk untuk memperbarui proyek." };
  }

  const payload: any = {
    updated_at: new Date().toISOString(),
  };

  if (data.title !== undefined) payload.title = data.title.trim();
  if (data.description !== undefined) payload.description = data.description.trim();
  if (data.category_id !== undefined) payload.category_id = data.category_id || null;
  if (data.level !== undefined) payload.level = data.level;
  if (data.repository_url !== undefined) payload.repository_url = data.repository_url.trim() || null;
  if (data.demo_url !== undefined) payload.demo_url = data.demo_url.trim() || null;
  if (data.tech_stack !== undefined) payload.tech_stack = data.tech_stack;
  if (data.author_name !== undefined) payload.author_name = data.author_name.trim();
  if (data.cover_url !== undefined) payload.cover_url = data.cover_url;
  if (data.notes !== undefined) payload.notes = data.notes;

  try {
    const { data: updated, error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (!error && updated) {
      revalidatePath("/dashboard/project");
      revalidatePath(`/dashboard/project/${id}`);
      return { success: true, data: updated };
    }

    // Fallback update to modules
    const { data: fbUpdated, error: fbError } = await supabase
      .from("modules")
      .update(payload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (fbError) {
      return { success: false, error: fbError.message };
    }

    revalidatePath("/dashboard/project");
    revalidatePath(`/dashboard/project/${id}`);
    return { success: true, data: fbUpdated };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memperbarui proyek." };
  }
}

/**
 * 5. DELETE PROJECT
 */
export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Harus masuk untuk menghapus proyek." };
  }

  try {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) {
      revalidatePath("/dashboard/project");
      return { success: true };
    }
  } catch {}

  // Fallback ke modules
  try {
    const { error: fbErr } = await supabase.from("modules").delete().eq("id", id);
    if (!fbErr) {
      revalidatePath("/dashboard/project");
      return { success: true };
    }
    return { success: false, error: fbErr.message };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
