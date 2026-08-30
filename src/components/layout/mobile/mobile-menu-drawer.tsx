"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  GraduationCap,
  Files,
  Code2,
  ScanLine,
  Settings,
  HelpCircle,
  Download,
  Info,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { MobileBottomSheet } from "./mobile-bottom-sheet";
import { useExperience } from "@/context/experience-context";
import { cn } from "@/lib/utils";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  const pathname = usePathname();
  const { canInstallPwa, promptInstallPwa, isPwaStandalone } = useExperience();

  const menuSections = [
    {
      title: "Alat Akademik & AI",
      items: [
        {
          label: "AI Tutor Multimodal",
          href: "/dashboard/ai-tutor",
          icon: Bot,
          description: "Tanya konsep, rangkum materi & selesaikan soal",
          isAi: true,
        },
        {
          label: "Ruang Kelas",
          href: "/dashboard/kelas",
          icon: GraduationCap,
          description: "Gabung atau kelola kelas perkuliahan",
        },
        {
          label: "Berkas & Media",
          href: "/dashboard/file",
          icon: Files,
          description: "Penyimpanan dokumen, PDF & slide kuliah",
        },
        {
          label: "Ruang Praktik Kode",
          href: "/dashboard/playground",
          icon: Code2,
          description: "Editor interaktif HTML, JS & Python",
        },
        {
          label: "Scanner & Konversi",
          href: "/dashboard/konversi",
          icon: ScanLine,
          description: "Pindai dokumen & konversi format file",
        },
      ],
    },
    {
      title: "Aplikasi & Akun",
      items: [
        {
          label: "Pengaturan Akun & Tampilan",
          href: "/dashboard/pengaturan",
          icon: Settings,
          description: "Tema, profil, notifikasi & preferensi",
        },
        {
          label: "Panduan Pengguna",
          href: "/dashboard/panduan",
          icon: HelpCircle,
          description: "Dokumentasi dan cara penggunaan fitur",
        },
      ],
    },
  ];

  const handleInstallClick = async (e: React.MouseEvent) => {
    if (canInstallPwa) {
      e.preventDefault();
      onClose();
      await promptInstallPwa();
    } else {
      onClose();
    }
  };

  return (
    <MobileBottomSheet isOpen={isOpen} onClose={onClose} title="Menu Velqora">
      <div className="space-y-4 pt-1">
        {/* Install Velqora App Banner (if not installed) */}
        {!isPwaStandalone && (
          <div className="p-3 rounded-xl border border-brand-500/30 bg-brand-500/10 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                <Download className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text-primary font-display truncate">
                  Pasang Aplikasi Velqora
                </p>
                <p className="text-[11px] text-text-secondary truncate">
                  Akses lebih cepat langsung dari layar utama
                </p>
              </div>
            </div>
            {canInstallPwa ? (
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-2.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shrink-0 active:scale-98 transition-all shadow-2xs cursor-pointer"
              >
                Pasang
              </button>
            ) : (
              <Link
                href="/download"
                onClick={onClose}
                className="px-2.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shrink-0 active:scale-98 transition-all shadow-2xs"
              >
                Unduh
              </Link>
            )}
          </div>
        )}

        {/* Grouped Sections */}
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <h3 className="px-2 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider font-mono">
              {section.title}
            </h3>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-xl border transition-all active:scale-[0.99]",
                      isActive
                        ? "bg-brand-500/10 border-brand-500/30 text-brand-500 dark:text-brand-400 font-semibold"
                        : "bg-surface hover:bg-surface-secondary border-border/80 text-text-primary"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                          isActive
                            ? "bg-brand-500/20 border-brand-500/30 text-brand-400"
                            : "bg-surface-secondary border-border text-text-secondary"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold leading-tight truncate">
                            {item.label}
                          </span>
                          {item.isAi && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-brand-500/15 text-brand-400 font-bold">
                              AI
                            </span>
                          )}
                        </div>
                        <p className="text-[10.5px] text-text-tertiary truncate leading-normal">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-text-tertiary shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </MobileBottomSheet>
  );
}
