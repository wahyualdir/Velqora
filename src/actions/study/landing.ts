"use server";

import { createClient } from "@/lib/supabase/server";
import { ALL_ACADEMIC_CURRICULA } from "@/lib/curriculum/registry";
import { getTopicStatus } from "@/lib/curriculum/status";

export interface AcademicDisciplineItem {
  id: string;
  title: string;
  slug: string;
  code: string;
  degreeLevel: string;
  totalCredits: number;
  targetRole: string;
  description: string;
  chaptersCount: number;
  subchaptersCount: number;
  cluster: "ai" | "ml" | "data" | "systems";
  clusterLabel: string;
  badgeColor: string;
  accentColor: string;
}

export interface DisciplineCluster {
  id: string;
  title: string;
  tag: string;
  description: string;
  count: number;
  disciplines: string[];
  accentColor: string;
}

// Backward compatibility interfaces
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
  totalDisciplines: number;
  verifiedDisciplines: number;
  inProgressDisciplines: number;
  underReviewDisciplines: number;
  totalChapters: number;
  totalSubchapters: number;
  totalSources: number;
  totalModules: number; // Backward compatibility
  totalCategories?: number;
  totalQuizzes: number;
  totalProjects: number;
  totalNotes: number;
}

export interface LandingCurriculumData {
  stats: LandingStats;
  clusters: DisciplineCluster[];
  allDisciplines: AcademicDisciplineItem[];
  activeClusters: string[];
  collections: CollectionItem[]; // Backward compatibility
  allModules: ModuleItem[]; // Backward compatibility
  activeDisciplines: string[]; // Backward compatibility
}

/**
 * Pemetaan Cluster Akademik 28 Disiplin Velqora
 */
function categorizeCluster(slug: string): {
  cluster: "ai" | "ml" | "data" | "systems";
  clusterLabel: string;
  badgeColor: string;
  accentColor: string;
  targetRole: string;
  code: string;
  credits: number;
} {
  const aiSlugs = [
    "ai-agent",
    "ai-ethics",
    "ai-governance",
    "ai-security",
    "ai-fundamentals",
    "generative-ai",
    "large-language-model",
    "computer-vision",
    "natural-language-processing",
    "multimodal-ai",
    "speech-audio-ai",
    "robotics-embodied-ai",
  ];

  const mlSlugs = [
    "machine-learning",
    "deep-learning",
    "reinforcement-learning",
    "graph-neural-network",
    "computational-intelligence",
    "automl-nas",
  ];

  const dataSlugs = [
    "data-science",
    "data-analyst",
    "data-engineering-ai",
    "time-series-forecasting",
    "vector-database-retrieval",
    "expert-system",
  ];

  // Kode & role defaults
  const prefix = slug.split("-").map(p => p[0].toUpperCase()).slice(0, 3).join("");
  const code = `${prefix}-40${Math.abs(slug.length % 9) + 1}`;

  if (aiSlugs.includes(slug)) {
    return {
      cluster: "ai",
      clusterLabel: "Kecerdasan Buatan & Sistem Cerdas",
      badgeColor: "bg-[#FDF2EE] text-[#C2553A] border-[#F5D0C5] dark:bg-[#D4664A]/12 dark:text-[#D4664A] dark:border-[#D4664A]/30",
      accentColor: "#D4664A",
      targetRole: "AI Engineer, Intelligent Systems Researcher",
      code,
      credits: 4,
    };
  }

  if (mlSlugs.includes(slug)) {
    return {
      cluster: "ml",
      clusterLabel: "Fondasi Machine & Deep Learning",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-[#E5C194]/12 dark:text-[#E5C194] dark:border-[#E5C194]/30",
      accentColor: "#E5C194",
      targetRole: "ML Engineer, Deep Learning Specialist",
      code,
      credits: 4,
    };
  }

  if (dataSlugs.includes(slug)) {
    return {
      cluster: "data",
      clusterLabel: "Sains Data & Analitika Lanjutan",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-[#34D399]/10 dark:text-[#34D399] dark:border-[#34D399]/30",
      accentColor: "#34D399",
      targetRole: "Data Scientist, Quantitative Analyst",
      code,
      credits: 3,
    };
  }

  return {
    cluster: "systems",
    clusterLabel: "Rekayasa Perangkat Lunak & Sistem",
    badgeColor: "bg-[#F3EFE9] text-[#57534E] border-[#E4DDD4] dark:bg-[#24201D] dark:text-[#A8A29E] dark:border-[#292524]",
    accentColor: "#A8A29E",
    targetRole: "MLOps Architect, Distributed Systems Engineer",
    code,
    credits: 3,
  };
}

export async function getLandingCurriculumData(): Promise<LandingCurriculumData> {
  // Hitung metrik asli dari Single Source of Truth kurikulum akademik Velqora
  const allDisciplines: AcademicDisciplineItem[] = ALL_ACADEMIC_CURRICULA.map((curriculum) => {
    const clusterMeta = categorizeCluster(curriculum.slug);
    const subchaptersCount = curriculum.chapters.reduce(
      (total, ch) => total + (ch.subchapters?.length || 0),
      0
    );

    const degreeLevel =
      curriculum.level === "pemula"
        ? "Sarjana (S1) Dasar"
        : curriculum.level === "menengah"
        ? "Sarjana (S1) Madya"
        : "Pascasarjana (S2/S3)";

    return {
      id: curriculum.id,
      title: curriculum.title,
      slug: curriculum.slug,
      code: clusterMeta.code,
      degreeLevel,
      totalCredits: clusterMeta.credits,
      targetRole: clusterMeta.targetRole,
      description: curriculum.description,
      chaptersCount: curriculum.chapters.length,
      subchaptersCount,
      cluster: clusterMeta.cluster,
      clusterLabel: clusterMeta.clusterLabel,
      badgeColor: clusterMeta.badgeColor,
      accentColor: clusterMeta.accentColor,
    };
  });

  const totalDisciplines = allDisciplines.length;
  const verifiedDisciplines = allDisciplines.filter(
    (d) => getTopicStatus(d.slug).status === "verified"
  ).length;
  const inProgressDisciplines = allDisciplines.filter((d) => {
    const status = getTopicStatus(d.slug).status;
    return status === "in_development" || status === "in_progress";
  }).length;
  const underReviewDisciplines = Math.max(
    0,
    totalDisciplines - verifiedDisciplines - inProgressDisciplines
  );
  const totalChapters = allDisciplines.reduce((acc, d) => acc + d.chaptersCount, 0);
  const totalSubchapters = allDisciplines.reduce((acc, d) => acc + d.subchaptersCount, 0);
  const totalSources = 102; // Canonical Source Registry

  let totalProjectsCount = 18;
  let totalNotesCount = 64;

  try {
    const supabase = await createClient();
    const { count: projCount } = await supabase
      .from("projects")
      .select("id", { count: "exact", head: true });
    if (typeof projCount === "number" && projCount > 0) {
      totalProjectsCount = projCount;
    }

    const { count: noteCount } = await supabase
      .from("notes")
      .select("id", { count: "exact", head: true });
    if (typeof noteCount === "number" && noteCount > 0) {
      totalNotesCount = noteCount;
    }
  } catch {
    // Graceful fallback
  }

  const clusters: DisciplineCluster[] = [
    {
      id: "cluster-ai",
      title: "Kecerdasan Buatan & Agen Otonom",
      tag: "01 // KECERDASAN BUATAN",
      description:
        "Arsitektur AI Agent, Large Language Model, Generative AI, Computer Vision, NLP, hingga Etika & Keamanan AI.",
      count: allDisciplines.filter((d) => d.cluster === "ai").length,
      disciplines: allDisciplines.filter((d) => d.cluster === "ai").map((d) => d.title),
      accentColor: "#D4664A",
    },
    {
      id: "cluster-ml",
      title: "Machine Learning & Deep Learning",
      tag: "02 // MACHINE LEARNING",
      description:
        "Supervised & Unsupervised Learning, Arsitektur Jaringan Saraf Dalam, Reinforcement Learning, dan Graph Neural Networks.",
      count: allDisciplines.filter((d) => d.cluster === "ml").length,
      disciplines: allDisciplines.filter((d) => d.cluster === "ml").map((d) => d.title),
      accentColor: "#E5C194",
    },
    {
      id: "cluster-data",
      title: "Sains Data & Analitika Tingkat Lanjut",
      tag: "03 // SAINS DATA",
      description:
        "Inferensi Statistik, Time Series Forecasting, Vector Database & RAG, serta Rekayasa Data Skala Masif.",
      count: allDisciplines.filter((d) => d.cluster === "data").length,
      disciplines: allDisciplines.filter((d) => d.cluster === "data").map((d) => d.title),
      accentColor: "#34D399",
    },
    {
      id: "cluster-systems",
      title: "Rekayasa Sistem & Infrastruktur Produksi",
      tag: "04 // REKAYASA SISTEM",
      description:
        "Pipeline MLOps, Sistem Terdistribusi, Edge AI & TinyML, dan Representasi Pengetahuan Formal.",
      count: allDisciplines.filter((d) => d.cluster === "systems").length,
      disciplines: allDisciplines.filter((d) => d.cluster === "systems").map((d) => d.title),
      accentColor: "#A8A29E",
    },
  ];

  const stats: LandingStats = {
    totalDisciplines,
    verifiedDisciplines,
    inProgressDisciplines,
    underReviewDisciplines,
    totalChapters,
    totalSubchapters,
    totalSources,
    totalModules: totalDisciplines,
    totalCategories: 4,
    totalQuizzes: 120,
    totalProjects: Math.max(totalProjectsCount, 18),
    totalNotes: Math.max(totalNotesCount, 64),
  };

  // Backward compatibility mock collections
  const legacyCollections: CollectionItem[] = clusters.map((c) => ({
    id: c.id,
    tag: c.tag,
    title: c.title,
    description: c.description,
    moduleCount: `${c.count} Disiplin`,
    lessonCount: "LIHAT MATERI →",
    modulesIncluded: c.disciplines.slice(0, 5),
    accentColor: c.accentColor,
    categoryName: c.title,
  }));

  const legacyModules: ModuleItem[] = allDisciplines.map((d) => ({
    id: d.id,
    title: d.title,
    dur: `${d.chaptersCount} Bab · ${d.totalCredits} SKS`,
    category: d.clusterLabel,
    level: d.degreeLevel,
    chaptersCount: d.chaptersCount,
    kind: "module",
  }));

  return {
    stats,
    clusters,
    allDisciplines,
    activeClusters: [
      "Semua",
      "Kecerdasan Buatan & Sistem Cerdas",
      "Fondasi Machine & Deep Learning",
      "Sains Data & Analitika Lanjutan",
      "Rekayasa Perangkat Lunak & Sistem",
    ],
    collections: legacyCollections,
    allModules: legacyModules,
    activeDisciplines: [
      "Semua",
      "Kecerdasan Buatan",
      "Data Analytics",
      "Machine Learning",
      "Sistem",
    ],
  };
}
