"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Menu, 
  X, 
  Code2, 
  Layers, 
  GraduationCap 
} from "lucide-react";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 shadow-xs py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[#C2553A] flex items-center justify-center text-white shadow-sm shadow-[#C2553A]/20 transition-transform group-hover:scale-105">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight text-zinc-900 dark:text-white uppercase font-sans">
              VELQORA
            </span>
            <span className="text-[10px] font-mono text-[#C2553A] font-bold tracking-wider -mt-1">
              ACADEMIC NOTEBOOK OS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-zinc-100/70 dark:bg-zinc-900/70 p-1 rounded-full border border-zinc-200/60 dark:border-zinc-800 backdrop-blur-xs text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <button
            type="button"
            onClick={() => scrollToSection("curriculum-catalog")}
            className="px-3.5 py-1.5 rounded-full hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all"
          >
            28 Topik Kurikulum
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("notebook-showcase")}
            className="px-3.5 py-1.5 rounded-full hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all"
          >
            Computational Notebook
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("pedagogy-standards")}
            className="px-3.5 py-1.5 rounded-full hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all"
          >
            Standar Akademik
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("ecosystem")}
            className="px-3.5 py-1.5 rounded-full hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all"
          >
            Ekosistem
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-[#C2553A] dark:hover:text-[#C2553A] px-3 py-2 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-[#C2553A] hover:bg-[#A34530] text-white text-xs font-semibold shadow-sm transition-all hover:shadow-md flex items-center gap-1.5"
          >
            <span>Mulai Belajar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-2 text-sm font-medium">
            <button
              type="button"
              onClick={() => scrollToSection("curriculum-catalog")}
              className="text-left px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
            >
              28 Topik Kurikulum
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("notebook-showcase")}
              className="text-left px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
            >
              Computational Notebook
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("pedagogy-standards")}
              className="text-left px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
            >
              Standar Akademik
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("ecosystem")}
              className="text-left px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
            >
              Ekosistem Platform
            </button>
          </div>
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
            <Link
              href="/login"
              className="flex-1 text-center py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Masuk
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 text-center py-2.5 rounded-lg bg-[#C2553A] text-white text-xs font-semibold"
            >
              Mulai Belajar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
