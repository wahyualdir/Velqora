"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { LandingStats } from "@/actions/study/landing";
import {
  EASE_SMOOTH,
  EditorialEyebrow,
  RevealSection,
} from "./motion-primitives";

interface RunDialogCTAProps {
  stats?: LandingStats;
}

export function RunDialogCTA({ stats }: RunDialogCTAProps) {
  const totalDisciplines = stats?.totalDisciplines ?? 31;
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="run-section"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <RevealSection>
        <div className="relative overflow-hidden rounded-3xl bg-[#141210] border border-[#292524] p-8 sm:p-12 text-[#F5F5F4] shadow-[inset_0_1px_0_rgba(255,248,240,0.05),0_20px_50px_-18px_rgba(0,0,0,0.75)]">
          {/* Architectural Concentric Orbital Reticle Watermark */}
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 360 360"
            animate={prefersReduced ? undefined : { rotate: 360 }}
            transition={{
              duration: 56,
              repeat: Infinity,
              ease: "linear",
            }}
            className="pointer-events-none hidden sm:block absolute -top-28 -right-24 w-80 h-80 text-[#D4664A]/[0.13]"
          >
            <circle
              cx="180"
              cy="180"
              r="148"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
            <circle
              cx="180"
              cy="180"
              r="108"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
            />
            <circle
              cx="180"
              cy="180"
              r="68"
              fill="none"
              stroke="#E5C194"
              strokeOpacity="0.45"
              strokeWidth="0.8"
              strokeDasharray="2 6"
            />
            <line x1="180" y1="16" x2="180" y2="48" stroke="currentColor" strokeWidth="1.2" />
            <line x1="180" y1="312" x2="180" y2="344" stroke="currentColor" strokeWidth="1.2" />
            <line x1="16" y1="180" x2="48" y2="180" stroke="currentColor" strokeWidth="1.2" />
            <line x1="312" y1="180" x2="344" y2="180" stroke="currentColor" strokeWidth="1.2" />
          </motion.svg>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3.5 max-w-2xl">
              <EditorialEyebrow index="04" label="Mulai Belajar" />

              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#F5F5F4]">
                Siap belajar secara serius &amp; terarah?
              </h2>

              <p className="text-sm sm:text-base text-[#A8A29E] leading-relaxed">
                Akses kurikulum akademik {totalDisciplines} disiplin keilmuan, uji
                pemahaman lewat computational notebook Python 3.12 terverifikasi,
                dan kuasai AI, Machine Learning, hingga Sains Data bersama Velqora.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18, ease: EASE_SMOOTH }}
              >
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#C2553A] hover:bg-[#B34B32] active:bg-[#9E3F29] text-[#FFFBF8] border border-[#D4664A]/45 text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] transition-all"
                >
                  <span>Buat Akun Gratis</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18, ease: EASE_SMOOTH }}
              >
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-[#1C1917] hover:bg-[#24201D] border border-[#292524] hover:border-[#3A3431] text-[#F5F5F4] text-sm font-semibold transition-all"
                >
                  Sudah punya akun? Masuk
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
