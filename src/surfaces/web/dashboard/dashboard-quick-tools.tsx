"use client";

import React from "react";
import Link from "next/link";
import { Code2, Bot, BrainCircuit, ScanLine, ChevronRight, Wrench } from "lucide-react";

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
    <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-2xs">
      <div className="p-4 sm:px-5 bg-surface-secondary/40 border-b border-border flex items-center justify-between select-none">
        <span className="font-bold text-sm text-text-primary flex items-center gap-2 font-display">
          <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center">
            <Wrench className="w-4 h-4" />
          </div>
          <span>Alat Praktik &amp; Utilitas</span>
        </span>
      </div>

      <div className="divide-y divide-border/60">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.title}
              href={tool.href}
              className="group flex items-center justify-between p-3.5 sm:px-4 hover:bg-surface-secondary/50 active:bg-surface-secondary/70 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-text-secondary truncate">
                    {tool.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
