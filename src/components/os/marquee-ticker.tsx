"use client";

import React from "react";

export function MarqueeTicker() {
  const items = [
    "7 DARI 28 TOPIK TERVERIFIKASI PENUH · LLM 72% (1.250 SUBBAB SUBSTANSIF)",
    "COMPUTATIONAL NOTEBOOK PYTHON 3.12 PROVENANCE",
    "RUJUKAN LITERATUR PRIMER BER-DOI (HASTIE, PEARL, TUKEY, RUSSELL, GOODFELLOW)",
    "FORMULASI MATEMATIKA FORMAL LATEX KATEX",
    "NEXT.JS 15.5 APP ROUTER & REACT 19",
    "SUPABASE POSTGRESQL & REALTIME RLS",
    "SCAFFOLDING EVALUASI 5-TINGKAT ANTI-SPOILER",
    "TAILWIND CSS V4 DESIGN SYSTEM",
    "ZERO DATA SINTETIS PADA TOPIK TERVERIFIKASI",
    "WAI-ARIA WCAG 2.2 AA ACCESSIBILITY",
  ];

  return (
    <div className="w-full bg-[#FAF8F5] border-y-2 border-[#E5DDD5] py-2 overflow-hidden select-none font-mono text-xs shadow-inner">
      <div className="animate-vt-marquee flex items-center gap-6 text-[#1C1917]">
        {[...items, ...items, ...items].map((text, index) => (
          <div key={index} className="flex items-center gap-3 whitespace-nowrap">
            <span className="text-[#C2553A] font-black text-sm">★</span>
            <span className="font-bold tracking-wider">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
