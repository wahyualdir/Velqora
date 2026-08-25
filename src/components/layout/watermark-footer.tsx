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

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.93 11.93 0 0 0 12.06 0C5.46 0 .09 5.37.09 11.97c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.63a11.93 11.93 0 0 0 5.86 1.52h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-.125-6.21-3.52-8.44zM12.07 21.9h-.01a9.92 9.92 0 0 1-5.06-1.39l-.36-.21-3.76.99 1-3.66-.23-.38a9.92 9.92 0 0 1-1.52-5.28c0-5.48 4.46-9.94 9.95-9.94 2.65 0 5.15 1.03 7.03 2.91a9.88 9.88 0 0 1 2.91 7.02c0 5.48-4.46 9.94-9.92 9.94zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.89-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.07-.8.37s-1.05 1.03-1.05 2.5 1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.77-.73 2.02-1.43.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="4.2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
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
      name: "GitHub",
      href: "https://github.com/WahyuAldiRiyanto",
      icon: GitHubIcon,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/wahyualdiriyanto",
      icon: LinkedInIcon,
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/6283162031942",
      icon: WhatsAppIcon,
    },
    {
      name: "Instagram",
      href: "https://instagram.com/wahyualdriy",
      icon: InstagramIcon,
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
