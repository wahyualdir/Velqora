"use client";

import React from "react";
import { BookMarked, Layers, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import {
  EASE_SMOOTH,
  EditorialEyebrow,
  RevealSection,
  StaggerContainer,
  StaggerItem,
} from "./motion-primitives";

const PILLARS = [
  {
    code: "01",
    icon: Terminal,
    title: "Computational Notebook Terisolasi",
    description:
      "Setiap modul memadukan formulasi matematis formal LaTeX KaTeX dengan sel kode Python 3.12 yang dapat dijalankan langsung.",
    accent: "text-[#C2553A] dark:text-[#D4664A]",
  },
  {
    code: "02",
    icon: BookMarked,
    title: "Rujukan Pustaka Primer Ber-DOI",
    description:
      "Materi dipetakan langsung ke bab dan halaman buku ajar kanonikal seperti Hastie (ESL), Judea Pearl, John Tukey, Goodfellow, serta Russell & Norvig.",
    accent: "text-emerald-700 dark:text-[#34D399]",
  },
  {
    code: "03",
    icon: Layers,
    title: "Evaluasi Berpikir Kritis 5 Tingkat",
    description:
      "Latihan studi kasus analitis bertingkat dengan petunjuk scaffolding bertahap (anti-spoiler) untuk melatih ketajaman intuisi rekayasa.",
    accent: "text-amber-700 dark:text-[#E5C194]",
  },
];

export function NotepadManifesto() {
  return (
    <section
      id="notepad-section"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20"
    >
      <RevealSection className="rounded-3xl bg-white dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] p-6 sm:p-10 shadow-xs dark:shadow-[inset_0_1px_0_rgba(255,248,240,0.04)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Manifesto Prose Balanced with Grounded Specs */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <EditorialEyebrow index="01" label="Pendekatan Pembelajaran" />

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F5F4] tracking-tight leading-snug">
                Menguasai AI &amp; Sains Data bukan sekadar memanggil API hitam.
              </h2>

              <p className="text-sm sm:text-base text-[#44403C] dark:text-[#A8A29E] leading-relaxed">
                Di era kecerdasan buatan generatif, sintaks dan kode dasar dapat
                dihasilkan dalam hitungan detik. Yang membedakan seorang engineer
                andal adalah{" "}
                <strong className="text-[#1C1917] dark:text-[#F5F5F4]">
                  intuisi arsitektur
                </strong>
                : memahami batas asumsi inferensial, memperhitungkan biaya asimetris{" "}
                <em className="text-[#1C1917] dark:text-[#E5C194]">False Negative</em>
                , dan mengisolasi variabel perancu agar kesimpulan kausalitas tidak
                terbalik seperti pada Paradoks Simpson.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E4DDD4] dark:border-[#292524]">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524]">
                <div className="font-mono text-[10.5px] uppercase tracking-wider text-[#78716C] dark:text-[#8C857F]">
                  Standar Konten
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#1C1917] dark:text-[#F5F5F4] mt-1">
                  Bebas Data Sintetis
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524]">
                <div className="font-mono text-[10.5px] uppercase tracking-wider text-[#78716C] dark:text-[#8C857F]">
                  Format Belajar
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#1C1917] dark:text-[#F5F5F4] mt-1">
                  Diktat &amp; Notebook Live
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Scannable Pedagogical Pillars */}
          <StaggerContainer
            staggerDelay={0.09}
            className="lg:col-span-7 space-y-3.5 flex flex-col justify-center"
          >
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <StaggerItem key={pillar.title}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2, ease: EASE_SMOOTH }}
                    className="group relative p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] hover:border-[#C2553A]/40 hover:dark:border-[#D4664A]/40 hover:bg-white dark:hover:bg-[#221E1B] hover:shadow-sm transition-all flex items-start gap-4 overflow-hidden"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-r-full bg-[#C2553A] dark:bg-[#D4664A] scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-200"
                    />

                    <div
                      className={`w-10 h-10 rounded-xl bg-white dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform duration-200 ${pillar.accent}`}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-base font-bold text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] transition-colors">
                          {pillar.title}
                        </h3>
                        <span className="font-mono text-[11px] font-medium text-[#8C857F] shrink-0">
                          {pillar.code}
                        </span>
                      </div>
                      <p className="text-sm text-[#44403C] dark:text-[#A8A29E] leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </RevealSection>
    </section>
  );
}
