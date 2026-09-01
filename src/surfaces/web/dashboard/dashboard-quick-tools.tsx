"use client";

import React from "react";
import Link from "next/link";
import { Code2, Bot, GraduationCap, ScanLine, ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";

export function DashboardQuickTools() {
  const tools = [
    {
      title: "Ruang Praktik Kode",
      description: "Monaco Editor & live code runner",
      href: "/dashboard/playground",
      icon: Code2,
      color: "text-brand-500 bg-brand-500/10 border-brand-500/20",
    },
    {
      title: "Velqora AI Tutor",
      description: "Tanya konsep & pemecahan masalah",
      href: "/dashboard/ai-tutor",
      icon: Bot,
      color: "text-brand-500 bg-brand-500/10 border-brand-500/20",
    },
    {
      title: "Kuis AI Interaktif",
      description: "Uji pemahaman topik belajar",
      href: "/dashboard/kuis-ai",
      icon: GraduationCap,
      color: "text-brand-500 bg-brand-500/10 border-brand-500/20",
    },
    {
      title: "Konversi & OCR Berkas",
      description: "Ekstrak teks dari foto & dokumen",
      href: "/dashboard/konversi",
      icon: ScanLine,
      color: "text-brand-500 bg-brand-500/10 border-brand-500/20",
    },
  ];

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-0.5">
        <h2 className="text-sm sm:text-base font-bold text-text-primary tracking-tight font-display">
          Alat Praktik & Utilitas
        </h2>
      </div>

      <Card padding="none" className="divide-y divide-border/60">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.title}
              href={tool.href}
              className="group flex items-center justify-between p-3 sm:px-3.5 hover:bg-surface-secondary/60 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${tool.color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-text-primary group-hover:text-brand-500 transition-colors truncate">
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
