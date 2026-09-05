"use client";

import React from "react";
import { OSWindow } from "./os-window";
import { Sparkles, Terminal, BookOpen, Layers, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";
import Link from "next/link";

export function OSHeroWindow() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="hero-window" className="w-full max-w-5xl mx-auto px-4 pt-6 pb-2">
      <OSWindow
        title="VELQORA_OS.EXE — Workspace Mahasiswa & Kurikulum Web Modern"
        icon={<Sparkles className="w-4 h-4 text-[#FF2E93]" />}
        statusText="BOOT SUCCESS · OS KERNEL ACTIVE · 12 MODULES VERIFIED"
        isActive={true}
        className="shadow-2xl"
      >
        <div className="p-6 sm:p-10 bg-[#0B0E15] flex flex-col items-center text-center space-y-6 font-mono select-text">
          {/* Top Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF2E93]/10 border border-[#FF2E93]/40 rounded-full text-xs text-[#FF2E93] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#FF2E93] animate-ping" />
            <span>VELQORA LEARNING KERNEL V1.2 · 2026 EDITION</span>
          </div>

          {/* Big Hero Title */}
          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase leading-none font-sans">
              BELAJAR WEB MODERN{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E93] via-[#00F2FE] to-purple-400">
                LEVEL PRODUKSI.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed pt-2">
              Tinggalkan tutorial neraka yang hanya mengajarkan todolist klise. Velqora menghadirkan diktat kuliah 
              <strong> 12 Modul Komprehensif</strong>, arsitektur Next.js 15, mitigasi kerentanan keamanan nyata, 
              dan pengujian otomatis di lingkungan desktop yang terintegrasi.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => scrollTo("curriculum-section")}
              className="px-5 py-3 vt-btn-pink text-xs flex items-center gap-2 font-bold"
            >
              <BookOpen className="w-4 h-4" />
              <span>JELAJAHI 12 MODUL (EXPLORER)</span>
            </button>

            <button
              type="button"
              onClick={() => scrollTo("terminal-section")}
              className="px-5 py-3 vt-btn-teal text-xs flex items-center gap-2 font-bold"
            >
              <Terminal className="w-4 h-4" />
              <span>BUKA TERMINAL (MONITOR.EXE)</span>
            </button>

            <Link
              href="/dashboard"
              className="px-5 py-3 vt-btn-chrome text-xs flex items-center gap-2 text-slate-200"
            >
              <Layers className="w-4 h-4" />
              <span>MASUK DASHBOARD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full pt-6 border-t border-slate-800/80 text-left text-xs">
            <div className="p-3 bg-[#080B10] rounded border border-slate-800 space-y-1">
              <div className="text-[#00F2FE] font-bold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>12 Modul Lengkap</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Dari fundamental HTTP hingga Docker &amp; CI/CD pipeline.
              </p>
            </div>

            <div className="p-3 bg-[#080B10] rounded border border-slate-800 space-y-1">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Tutorial Hell</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Setiap modul membedah studi kasus insiden produksi nyata.
              </p>
            </div>

            <div className="p-3 bg-[#080B10] rounded border border-slate-800 space-y-1">
              <div className="text-[#FF2E93] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>84 Soal Evaluasi</span>
              </div>
              <p className="text-[11px] text-slate-400">
                7 soal kuis analitis dengan pembahasan mendalam per modul.
              </p>
            </div>

            <div className="p-3 bg-[#080B10] rounded border border-slate-800 space-y-1">
              <div className="text-purple-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Companion Ready</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sinkronisasi progres belajar ke repositori Git lokal Anda.
              </p>
            </div>
          </div>
        </div>
      </OSWindow>
    </div>
  );
}
