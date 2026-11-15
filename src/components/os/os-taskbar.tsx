"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { RevealSection } from "./motion-primitives";

export function OSTaskbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="border-t border-[#E4DDD4] dark:border-[#292524] bg-[#F3EFE9]/70 dark:bg-[#100E0D] text-[#44403C] dark:text-[#A8A29E]">
      <RevealSection yOffset={10} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#E4DDD4] dark:border-[#292524]">
          <div className="space-y-2 max-w-md">
            <Logo variant="navbar" size="md" />
            <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
              Workspace pembelajaran akademik dan computational notebook untuk
              menguasai AI, Machine Learning, dan Sains Data berbasis rujukan
              primer.
            </p>
          </div>

          <nav
            aria-label="Navigasi footer"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium"
          >
            <button
              type="button"
              onClick={() => scrollTo("curriculum-section")}
              className="hover:text-[#C2553A] dark:hover:text-[#D4664A] transition-colors cursor-pointer"
            >
              Kurikulum
            </button>
            <button
              type="button"
              onClick={() => scrollTo("notepad-section")}
              className="hover:text-[#C2553A] dark:hover:text-[#D4664A] transition-colors cursor-pointer"
            >
              Pendekatan
            </button>
            <button
              type="button"
              onClick={() => scrollTo("stats-section")}
              className="hover:text-[#C2553A] dark:hover:text-[#D4664A] transition-colors cursor-pointer"
            >
              Transparansi
            </button>
            <Link href="/dashboard" className="hover:text-[#C2553A] dark:hover:text-[#D4664A] transition-colors">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-[#C2553A] dark:hover:text-[#D4664A] transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="hover:text-[#C2553A] dark:hover:text-[#D4664A] transition-colors">
              Daftar
            </Link>
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#6B6560] dark:text-[#8C857F]">
          <span>© 2026 Velqora Academic Platform. Dirancang untuk pembelajaran terstruktur.</span>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] text-[#1C1917] dark:text-[#F5F5F4] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#34D399] ring-2 ring-[#34D399]/20" />
            <span>Sistem Aktif</span>
          </div>
        </div>
      </RevealSection>
    </footer>
  );
}
