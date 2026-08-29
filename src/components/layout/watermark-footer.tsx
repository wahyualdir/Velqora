"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronUp, Check, Globe } from "lucide-react";
import { VelqoraMark } from "@/components/ui/logo";
import { IndonesiaFlag, USAFlag } from "@/components/ui/flags";
import { useLanguage } from "@/context/language-context";
import { Language } from "@/lib/i18n/translations";
import { toast } from "sonner";

/* ============================================================
   OFFICIAL SOCIAL MEDIA SVG ICONS (FOR DASHBOARD FOOTER ONLY)
   ============================================================ */

function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

/* ============================================================
   VELQORA BRAND HEADER (DASHBOARD ONLY)
   ============================================================ */

function VelqoraBrand() {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <VelqoraMark size={24} className="shrink-0" />
      <div className="flex flex-col text-left">
        <span className="text-base font-bold text-text-primary leading-tight font-display tracking-tight">
          Vel<span className="text-brand-500">qora</span>
        </span>
        <span className="text-[8.5px] font-mono text-text-tertiary leading-none mt-0.5 uppercase tracking-[0.16em] font-semibold">
          LEARNING PLATFORM
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   1. MINIMAL COPYRIGHT FOOTER
   STRICTLY FOR ALL MENU & INTERNAL ROUTES (EXCEPT /dashboard)
   ============================================================ */

export function MinimalCopyright({ className = "" }: { className?: string }) {
  const currentYear = new Date().getFullYear() || 2026;

  return (
    <footer
      role="contentinfo"
      className={`w-full mt-auto pt-8 sm:pt-10 pb-6 px-4 border-t border-border/70 text-center transition-colors duration-200 ${className}`}
    >
      <p className="text-[11px] sm:text-xs text-text-tertiary font-normal tracking-tight leading-relaxed max-w-2xl mx-auto">
        &copy; {currentYear} <span className="text-text-secondary font-medium">JOBLIB505 FORUM GROUP</span>. Semua hak dilindungi undang-undang.
      </p>
    </footer>
  );
}

/* ============================================================
   2. DASHBOARD FOOTER COMPONENT
   STRICTLY ONLY FOR /dashboard
   ============================================================ */

export function DashboardFooter({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages: { code: Language; label: string; short: string; flag: React.ReactNode }[] = [
    {
      code: "id",
      label: "Bahasa Indonesia",
      short: "ID",
      flag: <IndonesiaFlag className="w-4 h-3 rounded-xs" />,
    },
    {
      code: "en",
      label: "English (US)",
      short: "EN",
      flag: <USAFlag className="w-4 h-3 rounded-xs" />,
    },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  const socialLinks = [
    {
      name: "GitHub Repository",
      href: "https://github.com/wahyualdir/Velqora",
      icon: GitHubIcon,
    },
  ];

  const currentYear = new Date().getFullYear() || 2026;

  return (
    <footer
      role="contentinfo"
      className={`w-full mt-auto pt-10 pb-8 px-3 sm:px-5 lg:px-7 border-t border-border/80 bg-surface/60 backdrop-blur-md text-text-secondary transition-colors duration-200 ${className}`}
    >
      <div className="max-w-[1560px] mx-auto space-y-10">
        {/* Top Section: Brand Overview & Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Brand Info & Mission Statement (Left Col) */}
          <div className="md:col-span-4 lg:col-span-4 space-y-4">
            <Link
              href="/dashboard"
              className="inline-block focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 rounded-md"
              aria-label="Kembali ke Dashboard Velqora"
            >
              <VelqoraBrand />
            </Link>

            <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
              Ruang belajar untuk materi, project, dan perjalanan ngoding Anda.
            </p>

            {/* Social Media Links (Clean small pills) */}
            <div className="pt-1 flex items-center gap-2 flex-wrap" aria-label="Media Sosial">
              {socialLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Kunjungi ${item.name} Velqora`}
                    title={item.name}
                    className="w-8 h-8 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-brand-500/40 hover:bg-surface-secondary flex items-center justify-center transition-all duration-150 active:scale-95 shadow-2xs focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links Grid (Right 4 Columns) */}
          <div className="md:col-span-8 lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Column 1: BELAJAR */}
            <div className="space-y-3">
              <h2 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-text-primary">
                Belajar
              </h2>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/dashboard/modul"
                    className="text-text-secondary hover:text-brand-400 transition-colors inline-block py-0.5 focus:outline-none focus-visible:text-brand-400"
                  >
                    Modul & Project
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/materi"
                    className="text-text-secondary hover:text-brand-400 transition-colors inline-block py-0.5 focus:outline-none focus-visible:text-brand-400"
                  >
                    Materi Pembelajaran
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/kelas"
                    className="text-text-secondary hover:text-brand-400 transition-colors inline-block py-0.5 focus:outline-none focus-visible:text-brand-400"
                  >
                    Ruang Kelas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/tugas"
                    className="text-text-secondary hover:text-brand-400 transition-colors inline-block py-0.5 focus:outline-none focus-visible:text-brand-400"
                  >
                    Manajemen Tugas
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: TOOLS */}
            <div className="space-y-3">
              <h2 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-text-primary">
                Tools
              </h2>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/dashboard/ai-tutor"
                    className="text-text-secondary hover:text-brand-400 transition-colors inline-block py-0.5 focus:outline-none focus-visible:text-brand-400"
                  >
                    AI Tutor Cerdas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/kuis-ai"
                    className="text-text-secondary hover:text-brand-400 transition-colors inline-block py-0.5 focus:outline-none focus-visible:text-brand-400"
                  >
                    Kuis AI Interaktif
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/playground"
                    className="text-text-secondary hover:text-brand-400 transition-colors inline-block py-0.5 focus:outline-none focus-visible:text-brand-400"
                  >
                    Code Playground
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/konversi"
                    className="text-text-secondary hover:text-brand-400 transition-colors inline-block py-0.5 focus:outline-none focus-visible:text-brand-400"
                  >
                    Scanner & Konversi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: LAINNYA */}
            <div className="space-y-3">
              <h2 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-text-primary">
                Lainnya
              </h2>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/dashboard/panduan"
                    className="text-text-secondary hover:text-brand-400 transition-colors inline-block py-0.5 focus:outline-none focus-visible:text-brand-400"
                  >
                    Panduan Aplikasi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/kategori"
                    className="text-text-secondary hover:text-brand-400 transition-colors inline-block py-0.5 focus:outline-none focus-visible:text-brand-400"
                  >
                    Kategori Subjek
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/file"
                    className="text-text-secondary hover:text-brand-400 transition-colors inline-block py-0.5 focus:outline-none focus-visible:text-brand-400"
                  >
                    Berkas & Dokumen
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/bookmark"
                    className="text-text-secondary hover:text-brand-400 transition-colors inline-block py-0.5 focus:outline-none focus-visible:text-brand-400"
                  >
                    Materi Tersimpan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: LEGAL */}
            <div className="space-y-3">
              <h2 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-text-primary">
                Legal
              </h2>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/dashboard/pengaturan"
                    className="text-text-secondary hover:text-brand-400 transition-colors inline-block py-0.5 focus:outline-none focus-visible:text-brand-400"
                  >
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/panduan"
                    className="text-text-secondary hover:text-brand-400 transition-colors inline-block py-0.5 focus:outline-none focus-visible:text-brand-400"
                  >
                    Ketentuan Layanan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/backup"
                    className="text-text-secondary hover:text-brand-400 transition-colors inline-block py-0.5 focus:outline-none focus-visible:text-brand-400"
                  >
                    Cadangan Data
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar Separator */}
        <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
          
          {/* Mandatory Copyright Statement */}
          <div className="text-center sm:text-left text-[11px] font-normal leading-normal">
            &copy; {currentYear} <span className="text-text-secondary font-medium">JOBLIB505 FORUM GROUP</span>. Semua hak dilindungi undang-undang.
          </div>

          {/* Language Selector Dropdown with Flags */}
          <div className="flex items-center gap-4">
            <div className="relative inline-block text-left" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-secondary border border-border text-text-secondary hover:text-text-primary text-[11px] font-medium shadow-2xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
                aria-expanded={langDropdownOpen}
                aria-haspopup="true"
                title="Pilih Bahasa"
              >
                <Globe className="w-3 h-3 text-text-tertiary" />
                <span className="flex items-center gap-1.5">
                  {currentLang.flag}
                  <span>{currentLang.short}</span>
                </span>
                <ChevronUp
                  className={`w-3 h-3 text-text-tertiary transition-transform duration-150 ${
                    langDropdownOpen ? "rotate-180 text-brand-400" : ""
                  }`}
                />
              </button>

              {/* Popup Menu */}
              {langDropdownOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-48 rounded-xl border border-border bg-surface shadow-xl p-1 z-50 animate-fade-in">
                  <div className="px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-text-tertiary border-b border-border mb-1">
                    Pilih Bahasa
                  </div>

                  <div className="space-y-0.5">
                    {languages.map((item) => {
                      const isSelected = item.code === language;
                      return (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => {
                            setLanguage(item.code);
                            setLangDropdownOpen(false);
                            toast.success(
                              item.code === "id"
                                ? "Bahasa diubah ke Bahasa Indonesia"
                                : "Language changed to English"
                            );
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-brand-500/15 text-brand-400 font-semibold"
                              : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {item.flag}
                            <span>{item.label}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-brand-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   3. UNIFIED WATERMARK / FOOTER ROUTER WRAPPER
   Ensures ONLY pathname === "/dashboard" gets DashboardFooter
   Every other single route strictly gets MinimalCopyright
   ============================================================ */

export interface FooterProps {
  variant?: "auto" | "full" | "minimal";
  className?: string;
}

export function WatermarkFooter({ variant = "auto", className = "" }: FooterProps) {
  const pathname = usePathname();

  // STRICT CHECK: Only exact "/dashboard" or root "/" qualifies for full dashboard footer
  const isDashboardHome = pathname === "/dashboard" || pathname === "/";
  const effectiveVariant = variant === "auto" ? (isDashboardHome ? "full" : "minimal") : variant;

  if (effectiveVariant === "minimal") {
    return <MinimalCopyright className={className} />;
  }

  return <DashboardFooter className={className} />;
}

// Export aliases for modular imports
export { WatermarkFooter as Footer };
