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
      title: "Lab Notebook",
      description: "Notebook interaktif JS, Python & SQL dengan visualisasi",
      href: "/dashboard/playground",
      icon: Code2,
    },
    {
      title: "Latihan & Kuis AI",
      description: "Uji pemahaman dan simulasi evaluasi otomatis",
      href: "/dashboard/kuis-ai",
      icon: BrainCircuit,
    },
    {
      title: "Katalog Kode",
      description: "Direktori skrip Python, SQL, & latihan praktikum",
      href: "/dashboard/kode",
      icon: FileCode2,
    },
    {
      title: "Velqora AI Tutor",
      description: "Diskusi konsep & tanya jawab materi secara langsung",
      href: "/dashboard/ai-tutor",
      icon: Bot,
    },
    {
      title: "Konversi & OCR Berkas",
      description: "Ekstrak teks dari foto catatan & dokumen PDF",
      href: "/dashboard/konversi",
      icon: ScanLine,
    },
  ];

  return (
    <section className="space-y-3 font-sans">
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <Wrench className="w-4 h-4 text-[#C2553A] dark:text-[#F09A82] shrink-0" />
          <h3 className="text-[15px] font-bold text-[#1C1917] dark:text-[#F5F5F4] font-display truncate">
            Alat Praktik &amp; Ujian
          </h3>
        </div>
      </div>

      <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E6E0D6] dark:border-[#24201E] overflow-hidden shadow-2xs divide-y divide-[#E6E0D6]/70 dark:divide-[#24201E]">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.title}
              href={tool.href}
              className="group flex items-center justify-between p-4 sm:px-5 hover:bg-[#FAF8F5] dark:hover:bg-[#1C1917] transition-colors gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#FAF3EF] dark:bg-[#1C1917] text-[#C2553A] dark:text-[#F09A82] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[13px] sm:text-sm font-semibold text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#C2553A] dark:group-hover:text-[#F09A82] transition-colors truncate font-display">
                    {tool.title}
                  </h4>
                  <p className="text-xs text-[#6B6560] dark:text-[#A8A29E] truncate">
                    {tool.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A8378] dark:text-[#8C857F] group-hover:text-[#C2553A] dark:group-hover:text-[#F09A82] group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
