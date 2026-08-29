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

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15C10.56 20.15 9.12 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.07 7.68C8.91 7.68 8.65 7.74 8.43 7.98C8.21 8.22 7.6 8.79 7.6 9.94C7.6 11.09 8.44 12.2 8.56 12.36C8.68 12.52 10.18 14.83 12.5 15.83C13.05 16.07 13.48 16.21 13.81 16.32C14.36 16.49 14.86 16.47 15.26 16.41C15.7 16.34 16.62 15.85 16.81 15.31C17 14.77 17 14.31 16.94 14.21C16.88 14.11 16.72 14.05 16.48 13.93C16.24 13.81 15.06 13.23 14.84 13.15C14.62 13.07 14.46 13.03 14.3 13.27C14.14 13.51 13.68 14.05 13.54 14.21C13.4 14.37 13.26 14.39 13.02 14.27C12.78 14.15 12.01 13.9 11.09 13.08C10.37 12.44 9.88 11.65 9.74 11.41C9.6 11.17 9.73 11.04 9.85 10.92C9.96 10.81 10.1 10.63 10.22 10.49C10.34 10.35 10.38 10.25 10.46 10.09C10.54 9.93 10.5 9.79 10.44 9.67C10.38 9.55 9.92 8.42 9.73 7.95C9.54 7.49 9.35 7.55 9.21 7.54C9.08 7.54 8.92 7.54 8.76 7.54" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.46 6.27 6.27 0 0 0 1.84-4.46V8.75a8.28 8.28 0 0 0 4.93 1.6V6.9a4.83 4.83 0 0 1-1-.21z" />
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
      name: "WhatsApp",
      href: "https://wa.me/6283162031942?text=Halo%20Admin%20Velqora%2C%20saya%20ingin%20bertanya%20seputar%20platform%3A%20",
      icon: WhatsAppIcon,
      hoverClass: "hover:text-emerald-500 hover:border-emerald-500/40",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/velqora",
      icon: InstagramIcon,
      hoverClass: "hover:text-pink-500 hover:border-pink-500/40",
    },
    {
      name: "TikTok",
      href: "https://tiktok.com/@velqora",
      icon: TikTokIcon,
      hoverClass: "hover:text-cyan-400 hover:border-cyan-400/40",
    },
    {
      name: "GitHub Repository",
      href: "https://github.com/wahyualdir/Velqora",
      icon: GitHubIcon,
      hoverClass: "hover:text-text-primary hover:border-brand-500/40",
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
                    className={`w-8 h-8 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-secondary flex items-center justify-center transition-all duration-150 active:scale-95 shadow-2xs focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 ${item.hoverClass || "hover:border-brand-500/40"}`}
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
