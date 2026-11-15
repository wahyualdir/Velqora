"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import {
  EASE_SMOOTH,
  ScrollProgressBar,
  SPRING_GENTLE,
} from "./motion-primitives";

const NAV_ITEMS = [
  { label: "Kurikulum", targetId: "curriculum-section" },
  { label: "Pendekatan", targetId: "notepad-section" },
  { label: "Transparansi", targetId: "stats-section" },
  { label: "Aplikasi & Lab", targetId: "companion-card" },
];

export function OSTopBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-[#FAF8F5]/85 dark:bg-[#0B0A09]/84 backdrop-blur-md border-b border-[#E4DDD4] dark:border-[#292524] transition-shadow duration-300 ${
        scrolled
          ? "shadow-[0_4px_20px_rgba(28,25,23,0.06)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.55)]"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <Link
          href="/"
          className="inline-flex items-center rounded-xl py-1 pr-2 hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4664A]"
        >
          <Logo variant="navbar" size="md" />
        </Link>

        {/* Center: Primary Navigation with Smooth Hover Pill */}
        <nav
          aria-label="Navigasi utama"
          onMouseLeave={() => setHoveredNav(null)}
          className="hidden md:flex items-center gap-1"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.targetId}
              type="button"
              onMouseEnter={() => setHoveredNav(item.targetId)}
              onClick={() => scrollToSection(item.targetId)}
              className="relative px-3.5 py-2 rounded-xl text-sm font-medium text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] transition-colors cursor-pointer"
            >
              {hoveredNav === item.targetId && (
                <motion.span
                  layoutId="nav-hover-pill"
                  transition={SPRING_GENTLE}
                  className="absolute inset-0 rounded-xl bg-[#F3EFE9] dark:bg-[#1C1917] border border-transparent dark:border-[#292524]/80 -z-10"
                />
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right: Theme Switcher & Auth/Workspace CTAs */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
            title={isDark ? "Mode Terang (Warm Paper)" : "Mode Gelap (Warm Obsidian)"}
            className="h-9 w-9 rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-white dark:bg-[#141210] text-[#57534E] dark:text-[#E5C194] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] hover:bg-[#F3EFE9] dark:hover:bg-[#1C1917] hover:dark:border-[#3A3431] flex items-center justify-center transition-colors cursor-pointer overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? "sun" : "moon"}
                initial={{ opacity: 0, rotate: -35, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 35, scale: 0.7 }}
                transition={{ duration: 0.18, ease: EASE_SMOOTH }}
                className="flex items-center justify-center"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <motion.div whileTap={{ scale: 0.97 }} className="hidden sm:block">
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-9 px-4 rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-white dark:bg-[#141210] text-sm font-medium text-[#1C1917] dark:text-[#F5F5F4] hover:bg-[#F3EFE9] dark:hover:bg-[#1C1917] hover:dark:border-[#3A3431] transition-colors"
            >
              Masuk
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-[#C2553A] hover:bg-[#B34B32] active:bg-[#9E3F29] text-[#FFFBF8] border border-[#D4664A]/45 text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] transition-all"
            >
              <span>Mulai Belajar</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileOpen}
            className="md:hidden h-9 w-9 rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-white dark:bg-[#141210] text-[#1C1917] dark:text-[#F5F5F4] flex items-center justify-center transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Smooth Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: EASE_SMOOTH }}
            className="md:hidden overflow-hidden border-t border-[#E4DDD4] dark:border-[#292524] bg-[#FAF8F5] dark:bg-[#0B0A09]"
          >
            <div className="px-4 py-3 space-y-1.5">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.targetId}
                  type="button"
                  onClick={() => scrollToSection(item.targetId)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#44403C] dark:text-[#A8A29E] hover:bg-[#F3EFE9] dark:hover:bg-[#1C1917] hover:dark:text-[#F5F5F4] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2 border-t border-[#E4DDD4] dark:border-[#292524] flex items-center gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-white dark:bg-[#141210] text-sm font-medium text-[#1C1917] dark:text-[#F5F5F4]"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl bg-[#C2553A] hover:bg-[#B34B32] text-[#FFFBF8] text-sm font-semibold"
                >
                  Daftar Akun
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smooth Reading Progress Indicator */}
      <ScrollProgressBar className="absolute bottom-0 left-0 right-0" />
    </header>
  );
}
