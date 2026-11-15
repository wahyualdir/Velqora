"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import type { LandingStats } from "@/actions/study/landing";
import {
  AnimatedProgressBar,
  CountUpNumber,
  EASE_SMOOTH,
  EditorialEyebrow,
  RevealSection,
} from "./motion-primitives";

interface SystemMonitorWindowProps {
  stats?: LandingStats;
}

const VERIFIED_CORE_TOPICS = [
  "Data Analyst",
  "Data Science",
  "Machine Learning",
  "Deep Learning",
  "AI Fundamentals",
  "Computer Vision",
  "NLP",
];

export function SystemMonitorWindow({ stats }: SystemMonitorWindowProps) {
  const totalDisciplines = stats?.totalDisciplines ?? 31;
  const verifiedDisciplines = stats?.verifiedDisciplines ?? 7;
  const inProgressDisciplines = stats?.inProgressDisciplines ?? 4;
  const underReviewDisciplines =
    stats?.underReviewDisciplines ??
    Math.max(0, totalDisciplines - verifiedDisciplines - inProgressDisciplines);

  const verifiedPercent = Math.round(
    (verifiedDisciplines / Math.max(totalDisciplines, 1)) * 100
  );

  return (
    <section
      id="stats-section"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card: Curriculum Audit & Quality Transparency */}
        <RevealSection className="lg:col-span-7 flex">
          <div className="flex-1 rounded-3xl bg-white dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] p-6 sm:p-8 shadow-xs dark:shadow-[inset_0_1px_0_rgba(255,248,240,0.04)] flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="space-y-2.5">
                <EditorialEyebrow index="03" label="Transparansi & Audit Kualitas" />
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F5F4] tracking-tight">
                  Dibangun untuk kejelasan &amp; kejujuran.
                </h2>
                <p className="text-sm sm:text-base text-[#44403C] dark:text-[#A8A29E] leading-relaxed">
                  Status setiap modul ditampilkan secara terbuka—mana yang sudah
                  lulus audit rujukan penuh, dalam tahap penulisan aktif, maupun
                  yang masih direvisi.
                </p>
              </div>

              {/* 3 Audit Meters */}
              <div className="space-y-3.5">
                {/* Meter 1 */}
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.18, ease: EASE_SMOOTH }}
                  className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] hover:border-[#34D399]/35 transition-colors space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                    <span className="font-semibold text-[#1C1917] dark:text-[#F5F5F4]">
                      Audit Substantif Kurikulum
                    </span>
                    <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-[#34D399] tabular-nums">
                      {verifiedDisciplines}/{totalDisciplines} Terverifikasi (
                      <CountUpNumber value={verifiedPercent} suffix="%" />)
                    </span>
                  </div>
                  <AnimatedProgressBar
                    percent={verifiedPercent}
                    barClassName="bg-emerald-600 dark:bg-[#34D399]"
                    trackClassName="bg-[#E8E0D7] dark:bg-[#292524]"
                    delay={0.1}
                  />
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {VERIFIED_CORE_TOPICS.map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] text-[11px] font-medium text-[#44403C] dark:text-[#D6D3D1]"
                      >
                        {topic}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-[#E5B567]/10 border border-amber-200 dark:border-[#E5B567]/25 text-[11px] font-mono font-medium text-amber-800 dark:text-[#E5B567]">
                      LLM 72%
                    </span>
                  </div>
                  <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                    Selain {verifiedDisciplines} topik inti di atas, {inProgressDisciplines} topik
                    berada dalam penulisan aktif dan {underReviewDisciplines} topik dalam peninjauan bertahap.
                  </p>
                </motion.div>

                {/* Meter 2 */}
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.18, ease: EASE_SMOOTH }}
                  className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] hover:border-[#34D399]/35 transition-colors space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                    <span className="font-semibold text-[#1C1917] dark:text-[#F5F5F4]">
                      Rujukan Pustaka Primer Kanonikal
                    </span>
                    <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-[#34D399]">
                      102+ Sumber Ber-DOI
                    </span>
                  </div>
                  <AnimatedProgressBar
                    percent={100}
                    barClassName="bg-emerald-600 dark:bg-[#34D399]"
                    trackClassName="bg-[#E8E0D7] dark:bg-[#292524]"
                    delay={0.22}
                  />
                  <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                    Dipetakan ke buku ajar standar industri dan paper primer
                    (Hastie ESL, Pearl Causality, Tukey EDA, Goodfellow, Russell &amp;
                    Norvig AIMA).
                  </p>
                </motion.div>

                {/* Meter 3 */}
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.18, ease: EASE_SMOOTH }}
                  className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] hover:border-[#D4664A]/35 transition-colors space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                    <span className="font-semibold text-[#1C1917] dark:text-[#F5F5F4]">
                      Computational Notebook &amp; Python 3.12
                    </span>
                    <span className="font-mono text-xs font-semibold text-amber-700 dark:text-[#E5C194]">
                      Sandbox Terisolasi
                    </span>
                  </div>
                  <AnimatedProgressBar
                    percent={100}
                    barClassName="bg-amber-500 dark:bg-[#D4664A]"
                    trackClassName="bg-[#E8E0D7] dark:bg-[#292524]"
                    delay={0.34}
                  />
                  <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                    Mendukung eksekusi kode Python 3.12, rendering formula LaTeX
                    KaTeX responsif, dan scaffolding evaluasi 5 tingkat.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Feature Tags Footer */}
            <div className="pt-4 border-t border-[#E4DDD4] dark:border-[#292524] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  "Jalur Belajar Terkurasi",
                  "Diktat Akademik Formal",
                  "Bebas Data Sintetis",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] text-[#44403C] dark:text-[#A8A29E] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-[#34D399] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Kualitas Terverifikasi</span>
              </span>
            </div>
          </div>
        </RevealSection>

        {/* Right Card: Workspace PWA & Playground Showcase */}
        <RevealSection delay={0.12} className="lg:col-span-5 flex">
          <div
            id="companion-card"
            className="flex-1 rounded-3xl bg-gradient-to-br from-[#FDF8F4] to-white dark:from-[#181513] dark:to-[#141210] border border-[#E4DDD4] dark:border-[#292524] p-6 sm:p-8 shadow-xs dark:shadow-[inset_0_1px_0_rgba(255,248,240,0.04)] flex flex-col justify-between space-y-6 scroll-mt-20"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-2 border-b border-[#E4DDD4] dark:border-[#292524] pb-4">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#C2553A] dark:text-[#D4664A]">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Workspace &amp; Aplikasi PWA</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-white dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] text-xs font-mono text-[#6B6560] dark:text-[#E5C194]">
                  Lintas Perangkat
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-bold text-[#1C1917] dark:text-[#F5F5F4] tracking-tight leading-snug">
                  Pasang Sebagai Aplikasi &amp; Uji Kode Langsung.
                </h3>
                <p className="text-sm text-[#44403C] dark:text-[#A8A29E] leading-relaxed">
                  Gunakan Velqora layaknya aplikasi native di desktop maupun ponsel
                  melalui Progressive Web App (PWA), lengkap dengan playground Python
                  3.12 dan katalog kode kurikulum di browser.
                </p>
              </div>

              {/* Supported Platforms Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] space-y-2.5">
                <div className="text-xs font-semibold text-[#1C1917] dark:text-[#F5F5F4]">
                  Dukungan Perangkat &amp; Browser
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {["Desktop PWA", "Android", "iOS Safari"].map((os) => (
                    <motion.span
                      key={os}
                      whileHover={{ y: -1 }}
                      transition={{ duration: 0.15, ease: EASE_SMOOTH }}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-[#24201D] border border-[#E4DDD4] dark:border-[#292524] text-[#44403C] dark:text-[#A8A29E] font-medium"
                    >
                      {os}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Truthful Platform Checkpoints */}
              <div className="space-y-2.5 text-sm text-[#44403C] dark:text-[#A8A29E]">
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.16, ease: EASE_SMOOTH }}
                  className="flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#34D399] shrink-0" />
                  <span>Playground interaktif Python 3.12 &amp; JavaScript</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.16, ease: EASE_SMOOTH }}
                  className="flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#34D399] shrink-0" />
                  <span>Katalog kode 24+ topik aktif &amp; catatan KaTeX</span>
                </motion.div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E4DDD4] dark:border-[#292524] flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.18, ease: EASE_SMOOTH }}
                >
                  <Link
                    href="/download"
                    className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#C2553A] hover:bg-[#B34B32] active:bg-[#9E3F29] text-[#FFFBF8] border border-[#D4664A]/45 text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] transition-all"
                  >
                    <span>Pasang PWA</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </motion.div>

                <Link
                  href="/dashboard/playground"
                  className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1C1917] hover:bg-[#FAF8F5] dark:hover:bg-[#24201D] border border-[#E4DDD4] dark:border-[#292524] text-[#1C1917] dark:text-[#F5F5F4] text-xs font-semibold transition-colors"
                >
                  Buka Playground
                </Link>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-[#34D399]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] ring-2 ring-[#34D399]/20" />
                <span>Siap Digunakan</span>
              </span>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
