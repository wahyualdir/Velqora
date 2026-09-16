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
  RunDialogCTA 
} from "@/components/os";
import { getLandingCurriculumData } from "@/actions/study/landing";

export const metadata: Metadata = {
  title: "Velqora — Sistem Operasi Belajar Mahasiswa & Kurikulum Akademik Modern",
  description:
    "Platform workspace pembelajaran akademik berstandar industri: Kurikulum Kecerdasan Buatan (AI), Data Analytics, Algoritma Lanjutan, dan Rekayasa Web Modern dengan AI Tutor interaktif.",
  keywords: [
    "Velqora",
    "Kecerdasan Buatan",
    "Data Analytics",
    "Machine Learning",
    "Algoritma dan Struktur Data",
    "Pengembangan Web Modern",
    "Next.js 15",
    "React 19",
    "Learning OS",
  ],
};

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  // Ambil data kurikulum dinamis dan metrik terkini dari backend/Supabase
  const curriculumData = await getLandingCurriculumData();

  return (
    <div className="min-h-screen vt-desktop-bg text-[#1C1917] font-sans antialiased relative selection:bg-[#C2553A] selection:text-white pb-16">
      {/* CRT Scanlines Warm Overlay */}
      <div className="fixed inset-0 vt-scanlines pointer-events-none z-40" />

      {/* Retro OS Top Menu Bar (Vintec Exact Menu: VELQORA_, File, Edit, View, Go, Help) */}
      <OSTopBar />

      {/* Main Workspace Area */}
      <main className="relative z-10 space-y-4 pt-2">
        {/* Section Hero: 3-Column Layout (Left Window + Center Shortcuts + Right MONITOR.EXE with 3D Canvas) */}
        <OSHeroWindow stats={curriculumData.stats} />

        {/* Section 01: MANIFESTO (README.TXT — NOTEPAD) */}
        <NotepadManifesto />

        {/* Section 02: KURIKULUM (C:\VELQORA\CURRICULUM_EXPLORER) */}
        <CurriculumExplorer 
          collections={curriculumData.collections}
          allModules={curriculumData.allModules}
          activeDisciplines={curriculumData.activeDisciplines}
        />

        {/* Section 03: ANGKA & COMPANION (SYSTEM_MONITOR.EXE, SYSTEM_FEATURES.DLL, & VELQORA_COMPANION.EXE) */}
        <SystemMonitorWindow stats={curriculumData.stats} />

        {/* Marquee Ticker Ribbon */}
        <MarqueeTicker />

        {/* Section 04: MULAI (RUN.EXE — JALANKAN) */}
        <RunDialogCTA />
      </main>

      {/* Retro OS Bottom Taskbar (Vintec Exact Taskbar: Start Button, Copyright, Status, Real-time Clock) */}
      <OSTaskbar />
    </div>
  );
}
