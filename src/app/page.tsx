import React from "react";
import type { Metadata } from "next";
import { 
  LandingNavbar,
  LandingHero,
  LandingNotebookPreview,
  LandingCurriculumCatalog,
  LandingRigorMatrix,
  LandingEcosystem,
  LandingCTA,
  LandingFooter
} from "@/components/landing";
import { getLandingCurriculumData } from "@/actions/study/landing";

export const metadata: Metadata = {
  title: "Velqora — Platform Kurikulum & Computational Notebook Akademik",
  description:
    "Workspace perkuliahan & platform computational notebook akademik berstandar universitas: 28 disiplin keilmuan mutakhir Kecerdasan Buatan (AI), Machine Learning, Sains Data, dan Sistem Komputasi Lanjut dengan eksekusi Python terverifikasi.",
  keywords: [
    "Velqora",
    "Computational Notebook",
    "Kecerdasan Buatan",
    "Sains Data",
    "Data Science",
    "Machine Learning",
    "Deep Learning",
    "Python 3.12",
    "LaTeX KaTeX",
    "Kurikulum Akademik",
    "Next.js 15",
    "React 19",
  ],
};

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  // Ambil data kurikulum dinamis dan metrik terkini dari Single Source of Truth
  const curriculumData = await getLandingCurriculumData();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-[#C2553A] selection:text-white">
      {/* 1. Modern Top Navigation */}
      <LandingNavbar />

      <main>
        {/* 2. Hero Section with Real Ecosystem Metrics */}
        <LandingHero stats={curriculumData.stats} />

        {/* 3. Live Computational Notebook Preview (KaTeX + Python 3.12 Provenance + Scaffolding) */}
        <LandingNotebookPreview />

        {/* 4. Complete 28-Discipline Academic Curriculum Catalog & Search */}
        <LandingCurriculumCatalog
          disciplines={curriculumData.allDisciplines}
          clusters={curriculumData.clusters}
        />

        {/* 5. Academic Rigor & Integrity Comparison Table */}
        <LandingRigorMatrix />

        {/* 6. Unified Workspace Ecosystem (Notebook, Graph Vault, AI Tutor, Jadwal) */}
        <LandingEcosystem />

        {/* 7. Final Call to Action */}
        <LandingCTA />
      </main>

      {/* 8. Modern Academic Footer */}
      <LandingFooter />
    </div>
  );
}
