"use client";

import React from "react";
import type { LandingStats } from "@/actions/study/landing";

interface MarqueeTickerProps {
  stats?: LandingStats;
}

export function MarqueeTicker({ stats }: MarqueeTickerProps) {
  const totalDisciplines = stats?.totalDisciplines ?? 31;
  const verifiedDisciplines = stats?.verifiedDisciplines ?? 7;

  const items = [
    `${verifiedDisciplines} dari ${totalDisciplines} Topik Terverifikasi Penuh · LLM 72%`,
    "Computational Notebook Python 3.12 Terisolasi",
    "Rujukan Literatur Primer Ber-DOI (Hastie, Pearl, Tukey, Goodfellow)",
    "Formulasi Matematis Formal LaTeX KaTeX",
    "Evaluasi Berpikir Kritis 5 Tingkat Anti-Spoiler",
    "Bebas Data Sintetis pada Modul Terverifikasi",
  ];

  return (
    <div className="relative w-full bg-[#F3EFE9]/75 dark:bg-[#141210]/95 border-y border-[#E4DDD4] dark:border-[#292524] py-3 overflow-hidden select-none">
      {/* Soft Edge Fade Masks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-[#FAF8F5] dark:from-[#0B0A09] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-[#FAF8F5] dark:from-[#0B0A09] to-transparent"
      />

      <div
        style={{ animationDuration: "42s" }}
        className="animate-vt-marquee motion-reduce:animate-none flex items-center gap-8 text-xs sm:text-sm font-medium text-[#44403C] dark:text-[#A8A29E]"
      >
        {[...items, ...items].map((text, index) => (
          <div key={index} className="flex items-center gap-4 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C2553A] dark:bg-[#D4664A] shrink-0" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
