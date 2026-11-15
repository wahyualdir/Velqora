"use client";

import React from "react";
import Link from "next/link";
import {
  Code2,
  FileCode2,
  Bot,
  BrainCircuit,
  ScanLine,
  ChevronRight,
  Wrench,
} from "lucide-react";

export function DashboardQuickTools() {
  const tools = [
    {
      title: "Lab Notebook Colab++",
      description: "Notebook interaktif JS, Python & SQL dengan visualisasi",
      href: "/dashboard/playground",
      icon: Code2,
    },
    {
      title: "Latihan & Kuis Evaluasi AI",
      description: "Uji pemahaman dan simulasi ujian semester otomatis",
      href: "/dashboard/kuis-ai",
      icon: BrainCircuit,
    },
    {
      title: "Katalog Kode",
      description: "Direktori skrip Python, SQL, & lab praktikum",
      href: "/dashboard/kode",
      icon: FileCode2,
    },
    {
      title: "Velqora AI Tutor",
      description: "Tanya konsep & diskusi silabus perkuliahan",
      href: "/dashboard/ai-tutor",
      icon: Bot,
    },
    {
      title: "Konversi & OCR Berkas",
      description: "Ekstrak teks dari foto catatan & slide PDF",
      href: "/dashboard/konversi",
      icon: ScanLine,
    },
  ];

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <Wrench className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A] shrink-0" />
          <h3 className="text-[15px] sm:text-base font-extrabold text-[#1C1917] dark:text-[#F5F5F4] font-display truncate">
            Alat Praktik &amp; Ujian
          </h3>
        </div>
      </div>

      <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] overflow-hidden shadow-2xs divide-y divide-[#E4DDD4] dark:divide-[#292524]">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.title}
              href={tool.href}
              className="group flex items-center justify-between p-4 sm:px-5 hover:bg-[#FAF8F5] dark:hover:bg-[#1C1917] transition-colors gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#FAF3EF] dark:bg-[#1C1917] border border-[#C2553A]/20 dark:border-[#292524] text-[#C2553A] dark:text-[#D4664A] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] transition-colors truncate font-display">
                    {tool.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#5C554E] dark:text-[#A8A29E] truncate">
                    {tool.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A] group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
