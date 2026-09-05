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

export const metadata: Metadata = {
  title: "Velqora — Sistem Operasi Belajar Mahasiswa & Kurikulum Web Modern",
  description:
    "Platform workspace pembelajaran web modern berstandar industri: 12 Modul Kurikulum Terstandarisasi, 84 Soal Kuis, Interactive Terminal, dan AI Tutor.",
  keywords: [
    "Velqora",
    "Vintec Learn",
    "Pengembangan Aplikasi Web Modern",
    "Learning OS",
    "Next.js 15",
    "React 19",
    "Kurikulum Web",
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen vt-desktop-bg text-[#1C1917] font-sans antialiased relative selection:bg-[#C2553A] selection:text-white pb-16">
      {/* CRT Scanlines Warm Overlay */}
      <div className="fixed inset-0 vt-scanlines pointer-events-none z-40" />

      {/* Retro OS Top Menu Bar (Vintec Exact Menu: VELQORA_, File, Edit, View, Go, Help) */}
      <OSTopBar />

      {/* Main Workspace Area */}
      <main className="relative z-10 space-y-4 pt-2">
        {/* Section Hero: 3-Column Layout (Left Window + Center Shortcuts + Right MONITOR.EXE with 3D Canvas) */}
        <OSHeroWindow />

        {/* Section 01: MANIFESTO (README.TXT — NOTEPAD) */}
        <NotepadManifesto />

        {/* Section 02: KURIKULUM (C:\VELQORA\CURRICULUM_EXPLORER) */}
        <CurriculumExplorer />

        {/* Section 03: ANGKA & COMPANION (SYSTEM_MONITOR.EXE, SYSTEM_FEATURES.DLL, & VELQORA_COMPANION.EXE) */}
        <SystemMonitorWindow />

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
