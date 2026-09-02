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
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-xs"
          : "bg-background/60 backdrop-blur-xs border-b border-border/40"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg">
            <Logo variant="sidebar" withTile />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-text-secondary">
          <a
            href="#arsitektur"
            onClick={(e) => handleNavClick(e, "arsitektur")}
            className="relative py-1.5 hover:text-text-primary transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-500 after:transition-all after:duration-200 hover:after:w-full cursor-pointer select-none"
          >
            Dua Layar
          </a>
          <a
            href="#fitur"
            onClick={(e) => handleNavClick(e, "fitur")}
            className="relative py-1.5 hover:text-text-primary transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-500 after:transition-all after:duration-200 hover:after:w-full cursor-pointer select-none"
          >
            Fitur Utama
          </a>
          <a
            href="#alur-kerja"
            onClick={(e) => handleNavClick(e, "alur-kerja")}
            className="relative py-1.5 hover:text-text-primary transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-500 after:transition-all after:duration-200 hover:after:w-full cursor-pointer select-none"
          >
            Alur Semester
          </a>
          <Link
            href="/download"
            className="hover:text-brand-600 transition-colors flex items-center gap-1.5 text-brand-500 font-semibold group py-1.5"
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
              className="text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              Masuk / Login
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="sm"
              className="text-[13px] font-semibold gap-1.5 bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
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
