"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Compass,
  LayoutDashboard,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { motion } from "framer-motion";
import type { LandingStats } from "@/actions/study/landing";
import { EASE_SMOOTH, StaggerContainer, StaggerItem } from "./motion-primitives";

interface QuickShortcut {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  targetId?: string;
  href?: string;
}

interface OSDesktopIconsProps {
  stats?: LandingStats;
}

export function OSDesktopIcons({ stats }: OSDesktopIconsProps) {
  const totalDisciplines = stats?.totalDisciplines ?? 31;

  const shortcuts: QuickShortcut[] = [
    {
      id: "curriculum",
      title: "Katalog Kurikulum",
      subtitle: `${totalDisciplines} disiplin ilmu terstruktur`,
      icon: <BookOpen className="w-[18px] h-[18px]" />,
      targetId: "curriculum-section",
    },
    {
      id: "notebook",
      title: "Notebook Python 3.12",
      subtitle: "Simulasi & formula KaTeX",
      icon: <Terminal className="w-[18px] h-[18px]" />,
      targetId: "hero-window",
    },
    {
      id: "manifesto",
      title: "Pendekatan Belajar",
      subtitle: "Intuisi & diktat formal",
      icon: <Compass className="w-[18px] h-[18px]" />,
      targetId: "notepad-section",
    },
    {
      id: "audit",
      title: "Transparansi Audit",
      subtitle: "102+ rujukan primer ber-DOI",
      icon: <ShieldCheck className="w-[18px] h-[18px]" />,
      targetId: "stats-section",
    },
    {
      id: "dashboard",
      title: "Workspace Belajar",
      subtitle: "Buka reader & modul lengkap",
      icon: <LayoutDashboard className="w-[18px] h-[18px]" />,
      href: "/dashboard",
    },
  ];

  const handleScroll = (targetId?: string) => {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      aria-label="Akses cepat fitur Velqora"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3.5">
        {shortcuts.map((item) => {
          const cardBody = (
            <motion.div
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.2, ease: EASE_SMOOTH }}
              className="h-full p-4 rounded-2xl bg-white dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] shadow-2xs dark:shadow-[inset_0_1px_0_rgba(255,248,240,0.04)] hover:border-[#C2553A]/45 hover:dark:border-[#D4664A]/45 hover:bg-[#FAF8F5] dark:hover:bg-[#1C1917] hover:shadow-md transition-all flex items-center justify-between gap-3 text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] group-hover:border-[#C2553A]/35 group-hover:dark:border-[#D4664A]/45 group-hover:bg-[#FDF2EE] dark:group-hover:bg-[#D4664A]/12 text-[#57534E] dark:text-[#D6D3D1] group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] flex items-center justify-center shrink-0 transition-colors duration-200">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] transition-colors leading-snug">
                    {item.title}
                  </div>
                  <div className="text-xs text-[#6B6560] dark:text-[#8C857F] leading-snug mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </div>
                </div>
              </div>

              <ArrowUpRight className="w-3.5 h-3.5 text-[#8C857F] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] transition-all duration-200 shrink-0" />
            </motion.div>
          );

          if (item.href) {
            return (
              <StaggerItem key={item.id} className="sm:col-span-2 lg:col-span-1">
                <Link href={item.href} className="block h-full">
                  {cardBody}
                </Link>
              </StaggerItem>
            );
          }

          return (
            <StaggerItem key={item.id}>
              <button
                type="button"
                onClick={() => handleScroll(item.targetId)}
                className="w-full h-full text-left"
              >
                {cardBody}
              </button>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
