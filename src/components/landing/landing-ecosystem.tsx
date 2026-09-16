"use client";

import React from "react";
import Link from "next/link";
import { 
  Network, 
  Bot, 
  Calendar, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  CheckCircle2 
} from "lucide-react";

export function LandingEcosystem() {
  const pillars = [
    {
      icon: Terminal,
      title: "Computational Notebook Reader",
      description:
        "Baca materi dalam kanvas akademik yang tenang. Didukung formula KaTeX, sel kode terformat, dan bukti eksekusi terminal terisolasi.",
      badge: "Core Learning",
      color: "text-[#C2553A] bg-[#FAF3EF] dark:bg-[#C2553A]/10 border-[#C2553A]/20",
      href: "/dashboard/modul/kategori/data-science",
    },
    {
      icon: Network,
      title: "Catatan Graph & Markdown Vault",
      description:
        "Bangun jejaring pengetahuan pribadi dengan tautan dua arah (bidirectional links) bergaya Obsidian dan visualisasi graf interaktif.",
      badge: "Knowledge Graph",
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
      href: "/dashboard/catatan",
    },
    {
      icon: Bot,
      title: "AI Tutor Akademik Berbasis Konteks",
      description:
        "Konsultasikan konsep rumit dengan AI Tutor yang memahami hierarki kurikulum, formula matematika, dan kode komputasi modul.",
      badge: "AI Assistant",
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
      href: "/dashboard/ai-tutor",
    },
    {
      icon: Calendar,
      title: "Jadwal Perkuliahan & Workload Intelligence",
      description:
        "Kelola ritme studi mandiri, tenggat tugas perkuliahan, dan optimasi beban belajar dengan pemantau cerdas.",
      badge: "Study Intelligence",
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
      href: "/dashboard/jadwal",
    },
  ];

  return (
    <section id="ecosystem" className="py-24 bg-[#FAF8F5] dark:bg-zinc-950 border-b border-zinc-200/60 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3EF] dark:bg-[#C2553A]/10 border border-[#C2553A]/30 text-xs font-mono font-semibold text-[#C2553A] mb-3">
            <span>INTEGRASI WORKSPACE LENGKAP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Ekosistem Belajar Terpadu Mahasiswa.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Seluruh instrumen belajar terintegrasi dalam satu platform tanpa perlu berpindah-pindah aplikasi.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-7 flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3 rounded-xl border ${pillar.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <Link
                    href={pillar.href}
                    className="text-xs font-semibold text-[#C2553A] hover:text-[#A34530] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Eksplorasi Fitur</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
