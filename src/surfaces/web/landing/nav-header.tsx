"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export function NavHeader() {
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md transition-shadow duration-200">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg">
            <Logo variant="sidebar" withTile />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-text-secondary">
          <a
            href="#arsitektur"
            onClick={(e) => handleAnchorClick(e, "arsitektur")}
            className="relative py-1.5 hover:text-text-primary transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-500 after:transition-all after:duration-200 hover:after:w-full cursor-pointer select-none"
          >
            Web & Mobile
          </a>
          <a
            href="#fitur"
            onClick={(e) => handleAnchorClick(e, "fitur")}
            className="relative py-1.5 hover:text-text-primary transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-500 after:transition-all after:duration-200 hover:after:w-full cursor-pointer select-none"
          >
            Fitur Utama
          </a>
          <a
            href="#alur-kerja"
            onClick={(e) => handleAnchorClick(e, "alur-kerja")}
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
              className="text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              Masuk
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              size="sm"
              className="text-[13px] font-semibold gap-1.5 bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white shadow-sm hover:shadow-md transition-all duration-150"
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
