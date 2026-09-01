"use client";

import React from "react";
import Link from "next/link";
import { Code2, Bot, BrainCircuit, ScanLine, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    <section className="space-y-3">
      <div className="flex items-center justify-between px-0.5">
        <h2 className="text-sm font-bold text-text-primary tracking-tight font-display">
          Alat Praktik & Utilitas
        </h2>
      </div>

      <Card padding="none" className="divide-y divide-border/60 bg-surface-secondary/40 border-border/70">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.title}
              href={tool.href}
              className="group flex items-center justify-between p-3 sm:px-3.5 hover:bg-surface-secondary/80 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-1.5 rounded-lg bg-surface border border-border/70 text-text-secondary group-hover:text-brand-500 group-hover:border-brand-500/30 group-hover:bg-brand-500/5 transition-all duration-150 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-text-primary group-hover:text-brand-600 transition-colors truncate">
                    {tool.title}
                  </h3>
                  <p className="text-[11px] text-text-secondary truncate">
                    {tool.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-brand-500 shrink-0 transition-colors" />
            </Link>
          );
        })}
      </Card>
    </section>
  );
}
