"use client";

import React from "react";
import { 
  Check, 
  X, 
  ShieldCheck, 
  BookOpen, 
  Cpu, 
  GitBranch, 
  FileCode, 
  Sparkles 
} from "lucide-react";

export function LandingRigorMatrix() {
  const comparisonData = [
    {
      feature: "Struktur Pembelajaran (Pedagogy Flow)",
      velqora: "Terdiferensiasi: Conceptual, Mathematical, Algorithmic, Computational, Project.",
      standard: "Format tunggal kaku yang dipaksakan untuk semua jenis materi.",
    },
    {
      feature: "Formula & Notasi Matematika",
      velqora: "KaTeX lengkap dengan tabel kamus variabel simbolik, satuan, dan batas asumsi.",
      standard: "Rumus gambar buram atau teks markdown mentah tanpa definisi variabel.",
    },
    {
      feature: "Keaslian Eksekusi Kode",
      velqora: "Terverifikasi Python 3.12, pencocokan numerik (ε = 10⁻⁴), exit code 0, dan cap waktu nyata.",
      standard: "Output rekayasa atau teks statis yang rentan error saat dijalankan.",
    },
    {
      feature: "Keterlacakan Sumber Akademik",
      velqora: "102 rujukan literatur primer ber-DOI (Hastie ESL, Pearl, Tukey, Goodfellow, Gray).",
      standard: "Daftar pustaka umum tanpa penelusuran bab atau halaman spesifik.",
    },
    {
      feature: "Evaluasi & Latihan Mahasiswa",
      velqora: "Soal skenario bertingkat dengan accordion penahan petunjuk & solusi anti-spoiler.",
      standard: "Soal pilihan ganda klise dengan jawaban langsung terpampang di bawahnya.",
    },
  ];

  return (
    <section id="pedagogy-standards" className="py-24 bg-white dark:bg-zinc-900 border-b border-zinc-200/60 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3EF] dark:bg-[#C2553A]/10 border border-[#C2553A]/30 text-xs font-mono font-semibold text-[#C2553A] mb-3">
            <span>STANDAR INTEGRITAS AKADEMIK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Dibangun untuk Kejelasan, Bukan Sekadar Teori Klise.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Komparasi standar mutu platform pembelajaran akademik Velqora terhadap tutorial konvensional.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm bg-white dark:bg-zinc-950">
          <div className="grid grid-cols-12 bg-zinc-100 dark:bg-zinc-900 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold font-mono">
            <div className="col-span-4 text-zinc-600 dark:text-zinc-400">DIMENSI EVALUASI</div>
            <div className="col-span-4 text-[#C2553A] flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>STANDAR VELQORA</span>
            </div>
            <div className="col-span-4 text-zinc-500">TUTORIAL KONVENSIONAL</div>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {comparisonData.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 px-6 py-4.5 items-center text-xs leading-relaxed hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <div className="col-span-12 md:col-span-4 font-semibold text-zinc-900 dark:text-zinc-100 mb-1 md:mb-0">
                  {item.feature}
                </div>
                <div className="col-span-12 md:col-span-4 text-zinc-800 dark:text-zinc-200 flex items-start gap-2 mb-2 md:mb-0 pr-3">
                  <Check className="w-4 h-4 text-[#C2553A] shrink-0 mt-0.5" />
                  <span>{item.velqora}</span>
                </div>
                <div className="col-span-12 md:col-span-4 text-zinc-500 dark:text-zinc-400 flex items-start gap-2">
                  <X className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span>{item.standard}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
