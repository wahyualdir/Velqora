"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Terminal } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  COMPUTE_ENGINES,
  LiveComputeCanvas,
  type ComputeEngineSpec,
} from "./live-compute-canvas";
import type { LandingStats } from "@/actions/study/landing";
import { CountUpNumber, EASE_SMOOTH } from "./motion-primitives";

interface OSHeroWindowProps {
  stats?: LandingStats;
}

export function OSHeroWindow({ stats }: OSHeroWindowProps) {
  const [activeEngine, setActiveEngine] = useState<ComputeEngineSpec>(
    COMPUTE_ENGINES[0]
  );
  const prefersReduced = useReducedMotion();

  const totalDisciplines = stats?.totalDisciplines ?? 31;
  const verifiedDisciplines = stats?.verifiedDisciplines ?? 7;
  const inProgressDisciplines = stats?.inProgressDisciplines ?? 4;
  const totalChapters = stats?.totalChapters ?? 443;
  const totalSubchapters = stats?.totalSubchapters ?? 4105;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: prefersReduced ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: EASE_SMOOTH },
  });

  return (
    <section
      id="hero-window"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Choreographed Editorial Hero Copy, CTAs & Animated Stat Cards */}
        <div className="lg:col-span-6 space-y-6">
          {/* Status Pill */}
          <motion.div
            {...reveal(0.03)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2EE] dark:bg-[#1C1917] border border-[#F5D0C5] dark:border-[#D4664A]/30 text-xs font-medium text-[#9E3B1E] dark:text-[#E5C194]"
          >
            <span className="w-2 h-2 rounded-full bg-[#34D399] ring-2 ring-[#34D399]/20 shrink-0" />
            <span>
              {verifiedDisciplines} dari {totalDisciplines} topik terverifikasi penuh ·{" "}
              {inProgressDisciplines} dalam pengembangan aktif
            </span>
          </motion.div>

          {/* Headline & Subtitle */}
          <div className="space-y-3">
            <motion.h1
              {...reveal(0.1)}
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3.05rem] font-extrabold tracking-tight text-[#1C1917] dark:text-[#F5F5F4] leading-[1.12]"
            >
              Kuasai AI, Machine Learning &amp; Sains Data{" "}
              <span className="text-[#C2553A] dark:text-[#D4664A]">
                Secara Terstruktur.
              </span>
            </motion.h1>

            <motion.p
              {...reveal(0.18)}
              className="text-base sm:text-lg text-[#44403C] dark:text-[#A8A29E] leading-relaxed max-w-2xl"
            >
              Workspace pembelajaran interaktif dan computational notebook yang
              memadukan formulasi matematis formal, eksekusi Python 3.12, serta
              rujukan literatur primer ber-DOI.
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div
            {...reveal(0.25)}
            className="flex flex-wrap items-center gap-3 pt-1"
          >
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: EASE_SMOOTH }}
            >
              <Link
                href="/dashboard"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#C2553A] hover:bg-[#B34B32] active:bg-[#9E3F29] text-[#FFFBF8] border border-[#D4664A]/45 text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_20px_-8px_rgba(194,85,58,0.45)] transition-all"
              >
                <span>Mulai Belajar</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: EASE_SMOOTH }}
              onClick={() => scrollToSection("curriculum-section")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] hover:border-[#C2553A]/50 hover:dark:border-[#D4664A]/45 hover:bg-[#F3EFE9] dark:hover:bg-[#1C1917] text-[#1C1917] dark:text-[#F5F5F4] text-sm font-semibold transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A]" />
              <span>Jelajahi Kurikulum ({totalDisciplines} Topik)</span>
            </motion.button>
          </motion.div>

          {/* 3 Balanced Stat Cards with Smooth Count-Up */}
          <motion.div
            {...reveal(0.32)}
            className="grid grid-cols-3 gap-3 sm:gap-4 pt-3"
          >
            {[
              {
                value: totalDisciplines,
                label: "Topik Disiplin",
                meta: "4 klaster keilmuan",
                accentBg: "bg-[#C2553A] dark:bg-[#D4664A]",
                colorClass: "text-[#C2553A] dark:text-[#D4664A]",
                formatLocale: false,
              },
              {
                value: totalChapters,
                label: "Bab Pembelajaran",
                meta: "Modul terstruktur",
                accentBg: "bg-[#44403C] dark:bg-[#E5C194]",
                colorClass: "text-[#1C1917] dark:text-[#F5F5F4]",
                formatLocale: true,
              },
              {
                value: totalSubchapters,
                label: "Subbab Materi",
                meta: "Python 3.12 & KaTeX",
                accentBg: "bg-emerald-600 dark:bg-[#34D399]",
                colorClass: "text-emerald-700 dark:text-[#34D399]",
                formatLocale: true,
              },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2, ease: EASE_SMOOTH }}
                className="group p-4 rounded-2xl bg-white dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] shadow-2xs dark:shadow-[inset_0_1px_0_rgba(255,248,240,0.04)] hover:shadow-md hover:border-[#C2553A]/40 hover:dark:border-[#3A3431] transition-all flex flex-col justify-between gap-2"
              >
                <div className="space-y-2">
                  <span
                    className={`block w-6 h-0.5 rounded-full opacity-75 group-hover:w-10 transition-all duration-300 ${stat.accentBg}`}
                  />
                  <div
                    className={`text-2xl sm:text-3xl font-bold font-display tabular-nums leading-none ${stat.colorClass}`}
                  >
                    <CountUpNumber
                      value={stat.value}
                      formatLocale={stat.formatLocale}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F5F4] font-semibold">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-[#78716C] dark:text-[#8C857F] mt-0.5 hidden sm:block">
                    {stat.meta}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Live Interactive Curriculum Simulation Card */}
        <motion.div
          initial={{
            opacity: 0,
            y: prefersReduced ? 0 : 18,
            scale: prefersReduced ? 1 : 0.98,
          }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.16, ease: EASE_SMOOTH }}
          className="lg:col-span-6"
        >
          <div className="rounded-3xl bg-[#141210] border border-[#292524] shadow-[inset_0_1px_0_rgba(255,248,240,0.04),0_24px_56px_-16px_rgba(0,0,0,0.72)] overflow-hidden text-[#F5F5F4]">
            {/* Minimal Architectural Header */}
            <div className="px-5 py-3.5 border-b border-[#292524] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#F5F5F4]">
                <span className="w-6 h-6 rounded-lg bg-[#1C1917] border border-[#292524] flex items-center justify-center shrink-0">
                  <Terminal className="w-3.5 h-3.5 text-[#D4664A]" />
                </span>
                <span>Simulasi Konsep Kurikulum</span>
              </div>
              <span
                title={`${activeEngine.name} · ${activeEngine.statusLabel}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1C1917] border border-[#292524] text-[11px] font-medium text-[#E5C194] max-w-[210px] sm:max-w-none overflow-hidden"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    activeEngine.isVerified ? "bg-[#34D399]" : "bg-[#E5B567]"
                  }`}
                />
                <motion.span
                  key={activeEngine.id}
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: EASE_SMOOTH }}
                  className="truncate"
                >
                  {activeEngine.title}
                </motion.span>
              </span>
            </div>

            {/* Expansive Multi-Mode Compute Canvas + Interactive Dock */}
            <LiveComputeCanvas onModeChange={setActiveEngine} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
