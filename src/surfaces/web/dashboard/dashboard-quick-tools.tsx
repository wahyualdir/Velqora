"use client";

import React from "react";
import Link from "next/link";
import { Code2, FileCode2, Bot, BrainCircuit, ScanLine, ChevronRight, Wrench } from "lucide-react";
import { OSWindow } from "@/components/os/os-window";

export function DashboardQuickTools() {
  const tools = [
    {
      title: "Katalog Kode",
      description: "Direktori skrip Python, SQL, & lab praktikum",
      href: "/dashboard/kode",
      icon: FileCode2,
    },
    {
      title: "Ruang Praktik Kode",
      description: "Editor & runner JS, Python, dan SQL",
      href: "/dashboard/playground",
      icon: Code2,
    },
    {
      title: "Velqora AI Tutor",
      description: "Diskusi konsep & silabus materi",
      href: "/dashboard/ai-tutor",
      icon: Bot,
    },
    {
      title: "Latihan & Kuis AI",
      description: "Evaluasi pemahaman sebelum ujian",
      href: "/dashboard/kuis-ai",
      icon: BrainCircuit,
    },
    {
      title: "Konversi & OCR Berkas",
      description: "Ekstrak teks dari foto & dokumen",
      href: "/dashboard/konversi",
      icon: ScanLine,
    },
  ];

  return (
    <OSWindow
      title="UTILITIES // ALAT PRAKTIK"
      icon={<Wrench className="w-4 h-4" />}
      statusText="5 UTILITIES READY"
      className="shadow-sm"
      bodyClassName="p-0 bg-[#FFFFFF] dark:bg-[#141210] text-[#1C1917] dark:text-[#F5F5F4]"
    >
      <div className="p-3.5 bg-[#FAF8F5] dark:bg-[#100E0D] border-b border-[#E4DDD4] dark:border-[#292524] font-mono text-xs font-semibold text-[#1C1917] dark:text-[#F5F5F4] select-none">
        Alat Praktik &amp; Utilitas
      </div>

      <div className="divide-y divide-[#E4DDD4] dark:divide-[#292524] font-mono">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.title}
              href={tool.href}
              className="group flex items-center justify-between p-3.5 sm:px-4 hover:bg-[#FAF8F5] dark:hover:bg-[#1C1917] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-[#F3EFE9] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] text-[#C2553A] dark:text-[#D4664A] group-hover:scale-105 transition-transform shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold font-sans text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] transition-colors truncate">
                    {tool.title}
                  </h3>
                  <p className="text-[11px] text-[#524B42] dark:text-[#A8A29E] truncate font-sans">
                    {tool.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A] group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          );
        })}
      </div>
    </OSWindow>
  );
}
