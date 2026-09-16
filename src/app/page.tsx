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
} from "@/components/os";
import { getLandingCurriculumData } from "@/actions/study/landing";

export const metadata: Metadata = {
  title: "Velqora — Academic Learning OS & Computational Notebook",
  description:
    "Velqora Retro Learning OS: 28 disiplin keilmuan akademik Kecerdasan Buatan (AI), Machine Learning, Sains Data, dan Sistem Komputasi Lanjut dengan 3.680 subbab dan computational notebook Python 3.12 terverifikasi.",
  keywords: [
    "Velqora",
    "Learning OS",
    "Computational Notebook",
    "Kecerdasan Buatan",
    "Sains Data",
    "Machine Learning",
    "Deep Learning",
    "Python 3.12",
    "LaTeX KaTeX",
    "Kurikulum Akademik",
  ],
};

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const curriculumData = await getLandingCurriculumData();

  return (
    <div className="min-h-screen vt-desktop-bg text-[#1C1917] font-sans antialiased relative selection:bg-[#C2553A] selection:text-white pb-16">
      {/* 1. CRT Scanlines Overlay */}
      <div className="fixed inset-0 vt-scanlines pointer-events-none z-40" />

      {/* 2. Classic OS Top Navigation Bar with pulldown menus */}
      <OSTopBar />

      {/* 3. Main Desktop Area */}
      <main className="relative z-10 space-y-4 pt-2">
        {/* Hero Window: Left OS Hero + Center Desktop Icons + Right MONITOR.EXE with 3D Wireframe Canvas */}
        <OSHeroWindow stats={curriculumData.stats} />

        {/* Live Marquee Ticker: Real Specs & Features */}
        <MarqueeTicker />

        {/* Desktop Quick Launch Shortcuts */}
        <OSDesktopIcons />

        {/* Notepad Window: README.TXT Manifesto */}
        <NotepadManifesto />

        {/* Explorer Window: C:\VELQORA\CURRICULUM_EXPLORER (28 Disciplines, 4 Clusters, 3.680 Subchapters) */}
        <CurriculumExplorer 
          disciplines={curriculumData.allDisciplines}
          clusters={curriculumData.clusters}
          collections={curriculumData.collections}
          allModules={curriculumData.allModules}
          activeDisciplines={curriculumData.activeDisciplines}
        />

        {/* Telemetry Window: SYSTEM_MONITOR.EXE & VELQORA_COMPANION.EXE */}
        <SystemMonitorWindow stats={curriculumData.stats} />

        {/* Command Window: RUN.EXE Dialog */}
        <RunDialogCTA />
      </main>

      {/* 4. Windows 98 Style Bottom Taskbar with Start Menu & Real-time Clock */}
      <OSTaskbar />
    </div>
  );
}
