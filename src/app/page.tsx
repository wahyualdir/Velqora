import React from "react";
import type { Metadata } from "next";
import {
  OSTopBar,
  OSTaskbar,
  OSHeroWindow,
  NotepadManifesto,
  CurriculumExplorer,
  SystemMonitorWindow,
  MarqueeTicker,
  RunDialogCTA,
  OSDesktopIcons,
  VelqoraMotionProvider,
} from "@/components/os";
import { getLandingCurriculumData } from "@/actions/study/landing";

export const metadata: Metadata = {
  title: "Velqora — Platform Pembelajaran & Computational Notebook Interaktif",
  description:
    "Workspace pembelajaran modern dan computational notebook interaktif untuk Kecerdasan Buatan, Machine Learning, Sains Data, dan Rekayasa Sistem.",
  keywords: [
    "Velqora",
    "Learning Platform",
    "Computational Notebook",
    "Kecerdasan Buatan",
    "Sains Data",
    "Machine Learning",
    "Deep Learning",
    "Python 3.12",
    "LaTeX KaTeX",
    "Kurikulum AI & Data",
  ],
};

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const curriculumData = await getLandingCurriculumData();

  return (
    <VelqoraMotionProvider>
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B0A09] text-[#1C1917] dark:text-[#F5F5F4] font-sans antialiased relative flex flex-col selection:bg-[#D4664A]/20 selection:text-[#F5F5F4]">
        {/* Subtle Ambient Warm Obsidian Glow (Restrained <= 7.5%) */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-0 h-[460px] bg-[radial-gradient(ellipse_75%_55%_at_50%_-12%,rgba(194,85,58,0.07),transparent_70%)] dark:bg-[radial-gradient(ellipse_75%_55%_at_50%_-12%,rgba(212,102,74,0.075),transparent_70%)]"
        />

        {/* Sticky Top Navigation */}
        <OSTopBar />

        {/* Main Content */}
        <main className="relative z-10 flex-1 space-y-12 sm:space-y-16 pb-16 sm:pb-20">
          {/* Hero Section & Interactive 3D Compute Sphere */}
          <OSHeroWindow stats={curriculumData.stats} />

          {/* Calm Capabilities Strip */}
          <MarqueeTicker stats={curriculumData.stats} />

          {/* Quick Navigation Feature Cards */}
          <OSDesktopIcons stats={curriculumData.stats} />

          {/* Academic Approach & Manifesto */}
          <NotepadManifesto />

          {/* Interactive Curriculum Explorer */}
          <CurriculumExplorer
            disciplines={curriculumData.allDisciplines}
            clusters={curriculumData.clusters}
            stats={curriculumData.stats}
            collections={curriculumData.collections}
            allModules={curriculumData.allModules}
            activeDisciplines={curriculumData.activeDisciplines}
          />

          {/* Audit Transparency & Companion Showcase */}
          <SystemMonitorWindow stats={curriculumData.stats} />

          {/* Final Call to Action */}
          <RunDialogCTA stats={curriculumData.stats} />
        </main>

        {/* Clean Grounded Footer */}
        <OSTaskbar />
      </div>
    </VelqoraMotionProvider>
  );
}
