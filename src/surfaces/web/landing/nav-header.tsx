"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useHeaderScrolled, scrollToAnchor } from "./use-landing-animation";

export function NavHeader() {
  const isScrolled = useHeaderScrolled(16);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    scrollToAnchor(targetId, 80);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAF8F5]/85 backdrop-blur-md border-b border-[#E7E2DA]/80 shadow-[0_4px_20px_-4px_rgba(28,25,23,0.05)]"
          : "bg-[#FAF8F5]/40 backdrop-blur-xs border-b border-[#E7E2DA]/30"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B84A2B] rounded-lg">
            <Logo variant="sidebar" withTile />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-9 text-[13.5px] font-medium text-[#57534E]">
          <a
            href="#arsitektur"
            onClick={(e) => handleNavClick(e, "arsitektur")}
            className="relative py-1.5 hover:text-[#1C1917] transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#B84A2B] after:transition-all after:duration-200 hover:after:w-full cursor-pointer select-none"
          >
            Dua Layar
          </a>
          <a
            href="#fitur"
            onClick={(e) => handleNavClick(e, "fitur")}
            className="relative py-1.5 hover:text-[#1C1917] transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#B84A2B] after:transition-all after:duration-200 hover:after:w-full cursor-pointer select-none"
          >
            Fitur Utama
          </a>
          <a
            href="#alur-kerja"
            onClick={(e) => handleNavClick(e, "alur-kerja")}
            className="relative py-1.5 hover:text-[#1C1917] transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#B84A2B] after:transition-all after:duration-200 hover:after:w-full cursor-pointer select-none"
          >
            Alur Semester
          </a>
          <Link
            href="/download"
            className="hover:text-[#9E3B1E] transition-colors flex items-center gap-1.5 text-[#B84A2B] font-medium group py-1.5"
          >
            <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-150" />
            <span>Pasang di HP</span>
          </Link>
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-[13px] font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-white/80 rounded-lg transition-colors cursor-pointer"
            >
              Masuk / Login
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="sm"
              className="text-[13px] font-semibold gap-1.5 rounded-lg bg-gradient-to-b from-[#C85A32] to-[#B84A2B] hover:from-[#D46B42] hover:to-[#C85A32] active:scale-[0.98] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_12px_rgba(184,74,43,0.32)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_18px_rgba(184,74,43,0.42)] transition-all duration-200 cursor-pointer group"
            >
              <span>Masuk ke Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
