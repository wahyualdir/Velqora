"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Terminal, 
  Sparkles, 
  BookOpen, 
  Code2, 
  CheckCircle2, 
  Layers 
} from "lucide-react";
import { LandingStats } from "@/actions/study/landing";

interface LandingHeroProps {
  stats: LandingStats;
}

export function LandingHero({ stats }: LandingHeroProps) {
  const scrollToCatalog = () => {
    const el = document.getElementById("curriculum-catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToNotebook = () => {
    const el = document.getElementById("notebook-showcase");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-white to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900 border-b border-zinc-200/60 dark:border-zinc-800">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5ddd515_1px,transparent_1px),linear-gradient(to_bottom,#e5ddd515_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Academic Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF3EF] dark:bg-[#C2553A]/10 border border-[#C2553A]/30 text-xs font-mono font-semibold text-[#C2553A] mb-8 shadow-2xs animate-in fade-in zoom-in-95 duration-500">
          <span className="w-2 h-2 rounded-full bg-[#C2553A] animate-pulse" />
          <span>KURIKULUM AKADEMIK 2026 · 28 DISIPLIN SAINS DATA &amp; AI</span>
        </div>

        {/* Hero Main Headline */}
        <h1 className="max-w-4xl mx-auto text-4xl sm:text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-[1.12] mb-6">
          Platform Pembelajaran &amp;{" "}
          <span className="text-[#C2553A] relative inline-block">
            Computational Notebook
            <svg
              className="absolute -bottom-2 left-0 w-full text-[#C2553A]/30 h-2"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="6" />
            </svg>
          </span>{" "}
          Akademik.
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed mb-10">
          Bukan sekadar dokumentasi biasa atau tutorial video sambil lalu. Diktat mandiri 
          dengan <span className="font-semibold text-zinc-900 dark:text-white">3.680 subbab komprehensif</span>, 
          formula matematis LaTeX terverifikasi, dan eksekusi kode Python interaktif berbasis bukti empiris.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-16">
          <button
            type="button"
            onClick={scrollToCatalog}
            className="px-6 py-3.5 rounded-xl bg-[#C2553A] hover:bg-[#A34530] text-white text-sm font-semibold shadow-md shadow-[#C2553A]/25 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
          >
            <span>Jelajahi 28 Topik Kurikulum</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={scrollToNotebook}
            className="px-5 py-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-800 dark:text-zinc-200 text-sm font-semibold shadow-2xs transition-all hover:bg-zinc-50 dark:hover:bg-zinc-750 flex items-center gap-2 cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-[#C2553A]" />
            <span>Lihat Live Notebook Demo</span>
          </button>
        </div>

        {/* Real Ecosystem Stats Grid (Exact Numbers, Zero Exaggeration) */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-md shadow-sm">
          <div className="p-3 text-center border-r border-zinc-100 dark:border-zinc-800/80 last:border-0">
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">
              {stats.totalDisciplines}
            </div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
              Topik Disiplin AI &amp; DS
            </div>
          </div>

          <div className="p-3 text-center md:border-r border-zinc-100 dark:border-zinc-800/80 last:border-0">
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">
              {stats.totalChapters}
            </div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
              Bab Pembelajaran
            </div>
          </div>

          <div className="p-3 text-center border-r border-zinc-100 dark:border-zinc-800/80 last:border-0">
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">
              {stats.totalSubchapters.toLocaleString()}
            </div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
              Subbab Komprehensif
            </div>
          </div>

          <div className="p-3 text-center last:border-0">
            <div className="text-2xl sm:text-3xl font-black text-[#C2553A] font-mono">
              {stats.totalSources}
            </div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
              Rujukan Literatur Primer
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
