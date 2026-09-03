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
          ? "bg-paper/95 backdrop-blur-md border-b border-paper-border shadow-xs"
          : "bg-paper/60 backdrop-blur-xs border-b border-paper-border/50"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-tinta-500 rounded-lg">
            <Logo variant="sidebar" withTile />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-ink-secondary">
          <a
            href="#arsitektur"
            onClick={(e) => handleNavClick(e, "arsitektur")}
            className="relative py-1.5 hover:text-ink-primary transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-tinta-600 after:transition-all after:duration-200 hover:after:w-full cursor-pointer select-none"
          >
            Dua Layar
          </a>
          <a
            href="#fitur"
            onClick={(e) => handleNavClick(e, "fitur")}
            className="relative py-1.5 hover:text-ink-primary transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-tinta-600 after:transition-all after:duration-200 hover:after:w-full cursor-pointer select-none"
          >
            Fitur Utama
          </a>
          <a
            href="#alur-kerja"
            onClick={(e) => handleNavClick(e, "alur-kerja")}
            className="relative py-1.5 hover:text-ink-primary transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-tinta-600 after:transition-all after:duration-200 hover:after:w-full cursor-pointer select-none"
          >
            Alur Semester
          </a>
          <Link
            href="/download"
            className="hover:text-tinta-700 transition-colors flex items-center gap-1.5 text-tinta-600 font-semibold group py-1.5"
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
              className="text-[13px] font-medium text-ink-secondary hover:text-ink-primary hover:bg-paper-secondary transition-colors cursor-pointer"
            >
              Masuk / Login
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="sm"
              className="text-[13px] font-semibold gap-1.5 bg-tinta-600 hover:bg-tinta-700 active:scale-[0.98] text-white shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer"
            >
              <span>Masuk ke Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
