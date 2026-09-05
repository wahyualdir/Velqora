import React from "react";
import type { Metadata } from "next";
import { 
  OSTopBar, 
  OSTaskbar, 
  OSDesktopIcons, 
  OSHeroWindow, 
  InteractiveTerminal, 
  CurriculumExplorer, 
  NotepadManifesto, 
  CompanionShowcase, 
  RunDialogCTA, 
  MarqueeTicker 
} from "@/components/os";

export const metadata: Metadata = {
  title: "Velqora OS — Learning Environment & Kurikulum Web Modern",
  description:
    "Sistem Operasi Pembelajaran Web Modern: 12 Modul Terstandarisasi, Interactive Terminal Monitor, Curriculum Explorer, dan Kompatibilitas Docker & CI/CD.",
  keywords: [
    "Velqora OS",
    "Vintec Learn",
    "Pengembangan Aplikasi Web Modern",
    "Learning OS",
    "Next.js 15",
    "React 19",
    "Curriculum Explorer",
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen vt-desktop-bg text-slate-100 font-sans antialiased relative selection:bg-[#FF2E93] selection:text-white pb-14">
      {/* CRT Scanlines Overlay */}
      <div className="fixed inset-0 vt-scanlines pointer-events-none z-40" />

      {/* Retro OS Top Menu Bar */}
      <OSTopBar />

      {/* Marquee Ticker */}
      <MarqueeTicker />

      {/* Desktop Workspace */}
      <main className="relative z-10 space-y-8 pt-2 pb-16">
        {/* Desktop Shortcuts */}
        <OSDesktopIcons />

        {/* Hero Window */}
        <OSHeroWindow />

        {/* Interactive Terminal (MONITOR.EXE) */}
        <InteractiveTerminal />

        {/* Curriculum Explorer: 12 Modules (C:\Velqora\Curriculum_Explorer\) */}
        <CurriculumExplorer />

        {/* Notepad Manifesto (README.txt) */}
        <NotepadManifesto />

        {/* Companion App Showcase (Velqora_Companion.exe) */}
        <CompanionShowcase />

        {/* Run Dialog CTA (RUN.EXE) */}
        <RunDialogCTA />
      </main>

      {/* Retro OS Bottom Taskbar */}
      <OSTaskbar />
    </div>
  );
}
