"use client";

import React from "react";
import Link from "next/link";
import { Code2, Bot, BrainCircuit, ScanLine, ChevronRight, Wrench } from "lucide-react";
import { OSWindow } from "@/components/os/os-window";

export function DashboardQuickTools() {
  const tools = [
    {
      title: "Ruang Praktik Kode",
      description: "Editor monaco & runner algoritma",
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
      title="QUICK_TOOLS.DLL — ALAT PRAKTIK"
      icon={<Wrench className="w-4 h-4 text-amber-200" />}
      statusText="4 UTILITIES READY"
      className="shadow-sm"
      bodyClassName="p-0 bg-[#FFFFFF] text-[#1C1917]"
    >
      <div className="p-3 bg-[#FAF8F5] border-b border-[#E5DDD5] font-mono text-xs font-bold text-[#1C1917] select-none">
        Alat Praktik &amp; Utilitas
      </div>

      <div className="divide-y divide-[#E5DDD5] font-mono">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.title}
              href={tool.href}
              className="group flex items-center justify-between p-3 sm:px-3.5 hover:bg-[#FAF8F5] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-1.5 bg-[#FAF8F5] border border-[#D6CEC4] text-[#C2553A] group-hover:scale-105 transition-transform shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold font-sans text-[#1C1917] group-hover:text-[#C2553A] transition-colors truncate">
                    {tool.title}
                  </h3>
                  <p className="text-[11px] text-[#524B42] truncate font-sans">
                    {tool.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C2553A] group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          );
        })}
      </div>
    </OSWindow>
  );
}
