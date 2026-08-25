"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SIDEBAR_CATEGORIES } from "@/lib/constants";
import {
  LayoutGrid,
  LayoutDashboard,
  BarChart3,
  Users,
  Layers,
  GraduationCap,
  BookOpen,
  CheckSquare,
  ClipboardList,
  Bookmark,
  PenLine,
  FileEdit,
  Bot,
  BrainCircuit,
  Sparkles,
  ScanLine,
  Scan,
  Code2,
  FolderTree,
  FolderOpen,
  Tags,
  Tag,
  Files,
  FileBox,
  FileText,
  Compass,
  HardDriveDownload,
  Download,
  ShieldCheck,
  MapPin,
  Globe,
  ChevronLeft,
  ChevronRight,
  X,
  Crown,
  Sliders,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { isAdminUser, OWNER_EMAIL } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { TranslationKey } from "@/lib/i18n/translations";

const iconMap: Record<string, React.ElementType> = {
  LayoutGrid,
  LayoutDashboard,
  BarChart3,
  Users,
  Layers,
  GraduationCap,
  BookOpen,
  CheckSquare,
  ClipboardList,
  Bookmark,
  PenLine,
  FileEdit,
  Bot,
  BrainCircuit,
  Sparkles,
  ScanLine,
  Scan,
  Code2,
  FolderTree,
  FolderOpen,
  Tags,
  Tag,
  Files,
  FileBox,
  FileText,
  Compass,
  HardDriveDownload,
  Download,
  ShieldCheck,
  MapPin,
  Globe,
  Sliders,
};

const categoryTitleMap: Record<string, TranslationKey> = {
  MAIN: "catMain",
  Utama: "catMain",
  PEMBELAJARAN: "catLearning",
  Pembelajaran: "catLearning",
  "AI & SMART LEARNING": "catAi",
  "Fitur AI": "catAi",
  "FITUR & ALAT": "catTools",
  "Fitur & Alat": "catTools",
  TOOLS: "catTools",
  Alat: "catTools",
  ORGANISASI: "catOrg",
  Organisasi: "catOrg",
  BANTUAN: "catHelp",
  Bantuan: "catHelp",
  PENGATURAN: "catSystem",
  Pengaturan: "catSystem",
  SYSTEM: "catSystem",
  Sistem: "catSystem",
  ADMINISTRATION: "adminPanel",
  Administrasi: "adminPanel",
  ownerPanel: "ownerPanel",
};

const linkLabelMap: Record<string, TranslationKey> = {
  Dashboard: "navDashboard",
  "Ringkasan Pembelajaran": "navDashboard",
  "Semua Modul": "navModul",
  "Modul & Project": "navModul",
  "Modul dan Project": "navModul",
  "Modul & Panduan": "navModul",
  "Koleksi Materi": "navMateri",
  "Materi Pembelajaran": "navMateri",
  "Bahan Ajar & Dokumen": "navMateri",
  "Tugas & Jadwal": "navTugas",
  "Tugas dan Jadwal": "navTugas",
  "Manajemen Tugas": "navTugas",
  "Tugas Pembelajaran": "navTugas",
  "Kelas Belajar": "navKelas",
  "Ruang Kelas": "navKelas",
  "Bookmark Saya": "navBookmark",
  "Materi Tersimpan": "navBookmark",
  "Catatan Belajar": "navCatatan",
  "Code Playground": "navPlayground",
  "Ruang Praktik Kode": "navPlayground",
  "Ruang Praktik & Alat": "navPlayground",
  "Statistik Belajar": "navStatistik",
  "Perkembangan Belajar": "navStatistik",
  "Velqora AI Tutor": "navAiTutor",
  "AI Tutor Cerdas": "navAiTutor",
  "AI Assistant": "navAiTutor",
  "Tutor AI": "navAiTutor",
  "Kuis AI Interaktif": "navKuisAi",
  "Latihan dan Kuis": "navKuisAi",
  "Scanner & Konversi": "navKonversi",
  "Konversi Berkas": "navKonversi",
  "Kategori Subjek": "navKategori",
  "Kategori Pembelajaran": "navKategori",
  "Label & Tag": "navTag",
  "Label dan Tag": "navTag",
  "Berkas & Dokumen": "navFile",
  "Berkas Pembelajaran": "navFile",
  "Panduan Aplikasi": "navPanduan",
  Panduan: "navPanduan",
  "Cadangkan Data": "navBackup",
  "Cadangan Data": "navBackup",
  Pengaturan: "navPengaturan",
  "Pengaturan Workspace": "navPengaturan",
  "Kelola Role": "navKelolaRole",
  "Kelola Hak Akses": "navKelolaRole",
  "Peta Pengguna": "navTotalPengguna",
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Close drawer on Escape key press (Mobile)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Load User Authorization Role
  useEffect(() => {
    async function checkRole() {
      const localRole =
        typeof window !== "undefined" ? localStorage.getItem("user_role") : null;
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const u = data?.user;
      if (u) {
        const email = (u.email || "").trim().toLowerCase();

        if (email === OWNER_EMAIL.toLowerCase() || localRole === "owner") {
          setIsOwner(true);
          setIsAdmin(true);
          return;
        }

        if (localRole === "admin" || (email && isAdminUser(email))) {
          setIsAdmin(true);
        }
      }
    }
    checkRole();
  }, []);

  // ESC key handler for mobile drawer
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* ─── 1. MOBILE DRAWER BACKDROP OVERLAY ─── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ─── 2. MOBILE DRAWER (For screens < 1024px) ─── */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 h-[100dvh] w-[min(86vw,300px)]",
          "bg-surface border-r border-border flex flex-col select-none",
          "transition-transform duration-200 ease-out shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Header */}
        <div className="h-14 px-4 border-b border-border flex items-center justify-between shrink-0 bg-surface">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5 focus:outline-none"
          >
            <Logo variant="sidebar" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation List (Scrollable) */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto sidebar-nav-scroll overscroll-contain safe-area-bottom">
          {SIDEBAR_CATEGORIES.map((category) => {
            const catKey = categoryTitleMap[category.title];
            const translatedCatTitle =
              catKey && t(catKey) && t(catKey) !== catKey ? t(catKey) : category.title;

            return (
              <div key={category.title} className="space-y-1">
                <div className="px-2.5 pb-1 text-[11px] font-semibold text-text-tertiary">
                  {translatedCatTitle}
                </div>

                <div className="space-y-0.5">
                  {category.links.map((link) => {
                    const Icon = iconMap[link.icon];
                    const isActive =
                      link.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(link.href);
                    const linkKey = linkLabelMap[link.label];
                    const translatedLabel =
                      linkKey && t(linkKey) && t(linkKey) !== linkKey
                        ? t(linkKey)
                        : link.label;
                    const isAiItem = (link as any).isAi;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-3 h-10 rounded-xl text-xs sm:text-sm font-medium transition-colors",
                          isActive
                            ? "bg-brand-500/12 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/25"
                            : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary border border-transparent"
                        )}
                      >
                        {Icon && (
                          <Icon
                            className={cn(
                              "w-4 h-4 shrink-0",
                              isActive
                                ? "text-brand-500 dark:text-brand-400"
                                : isAiItem
                                ? "text-brand-400"
                                : "text-text-tertiary"
                            )}
                          />
                        )}
                        <span className="truncate flex-1">{translatedLabel}</span>
                        {isAiItem && !isActive && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                            AI
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Mobile Admin Section */}
          {(isAdmin || isOwner) && (
            <div className="pt-3 border-t border-border/70 space-y-1">
              <div className="px-2.5 pb-1 text-[11px] font-semibold text-brand-500 dark:text-brand-400 flex items-center justify-between">
                <span>{isOwner ? "Administrasi (Pemilik)" : "Administrasi"}</span>
                <Crown className="w-3 h-3 text-brand-500 dark:text-brand-400" />
              </div>

              <div className="space-y-0.5">
                {isOwner && (
                  <Link
                    href="/dashboard/kelola-role"
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 h-10 rounded-xl text-xs sm:text-sm font-medium transition-colors",
                      pathname.startsWith("/dashboard/kelola-role")
                        ? "bg-brand-500/12 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/25"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary border border-transparent"
                    )}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0 text-text-tertiary" />
                    <span className="truncate">Kelola Hak Akses</span>
                  </Link>
                )}

                <Link
                  href="/dashboard/peta-pengguna"
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 h-10 rounded-xl text-xs sm:text-sm font-medium transition-colors",
                    pathname.startsWith("/dashboard/peta-pengguna")
                      ? "bg-brand-500/12 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/25"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary border border-transparent"
                  )}
                >
                  <MapPin className="w-4 h-4 shrink-0 text-text-tertiary" />
                  <span className="truncate">Peta Pengguna</span>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* ─── 3. DESKTOP FIXED SIDEBAR (EXPANDED ↔ COLLAPSED) ─── */}
      <aside
        className={cn(
          "hidden lg:flex fixed top-0 left-0 z-30 h-screen bg-surface border-r border-border select-none",
          "flex-col transition-all duration-200 ease-out",
          isCollapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {/* Desktop Header: Brand + Toggle Button */}
        <div
          className={cn(
            "h-14 px-3 border-b border-border flex items-center shrink-0 bg-surface transition-all duration-200",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2.5 focus:outline-none min-w-0 overflow-hidden",
              isCollapsed && "justify-center"
            )}
            title="Velqora Dashboard"
          >
            <Logo variant="sidebar" hideText={isCollapsed} />
          </Link>

          {/* Toggle Button [ ‹ ] / [ › ] */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Toggle sidebar"
              aria-expanded={!isCollapsed}
              className={cn(
                "p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary border border-border/50 hover:border-border transition-colors",
                isCollapsed && "hidden" // When collapsed, toggle is accessible or shown compactly
              )}
              title="Kecilkan Sidebar (Collapse)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Toggle Expand Bar when Collapsed */}
        {isCollapsed && onToggleCollapse && (
          <div className="px-2 pt-2 shrink-0">
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Toggle sidebar"
              aria-expanded={!isCollapsed}
              className="w-full flex items-center justify-center h-7 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary border border-border/60 transition-colors"
              title="Buka Penuh Sidebar (Expand)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Desktop Navigation List (Flexible with Smooth Internal Scroll if needed) */}
        <nav className="flex-1 px-2.5 py-3 space-y-4 overflow-y-auto sidebar-nav-scroll overscroll-contain">
          {SIDEBAR_CATEGORIES.map((category) => {
            const catKey = categoryTitleMap[category.title];
            const translatedCatTitle =
              catKey && t(catKey) && t(catKey) !== catKey ? t(catKey) : category.title;

            return (
              <div key={category.title} className="space-y-1">
                {/* Category Header (Hidden in collapsed mode) */}
                {!isCollapsed && (
                  <div className="px-2 pb-1 text-[11px] font-semibold text-text-tertiary">
                    {translatedCatTitle}
                  </div>
                )}

                {/* Menu Items */}
                <div className="space-y-0.5">
                  {category.links.map((link) => {
                    const Icon = iconMap[link.icon];
                    const isActive =
                      link.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(link.href);
                    const linkKey = linkLabelMap[link.label];
                    const translatedLabel =
                      linkKey && t(linkKey) && t(linkKey) !== linkKey
                        ? t(linkKey)
                        : link.label;
                    const isAiItem = (link as any).isAi;

                    return (
                      <div key={link.href} className="relative group">
                        <Link
                          href={link.href}
                          className={cn(
                            "relative flex items-center rounded-xl transition-all duration-150 font-medium",
                            isCollapsed
                              ? "justify-center w-10 h-10 mx-auto"
                              : "gap-2.5 px-2.5 h-[34px] text-[13px]",
                            isActive
                              ? "bg-brand-500/12 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/25 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[3px] before:rounded-r before:bg-brand-500 shadow-2xs"
                              : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary/80 border border-transparent"
                          )}
                        >
                          {Icon && (
                            <Icon
                              className={cn(
                                "w-4 h-4 shrink-0 transition-colors",
                                isActive
                                  ? "text-brand-500 dark:text-brand-400"
                                  : isAiItem
                                  ? "text-brand-400"
                                  : "text-text-tertiary group-hover:text-text-secondary"
                              )}
                            />
                          )}

                          {!isCollapsed && (
                            <span className="truncate flex-1 leading-snug">
                              {translatedLabel}
                            </span>
                          )}

                          {isAiItem && !isActive && !isCollapsed && (
                            <span className="px-1.5 py-0.2 rounded text-[8.5px] font-mono font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                              AI
                            </span>
                          )}
                        </Link>

                        {/* Collapsed Tooltip on Hover */}
                        {isCollapsed && (
                          <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2.5 px-2.5 py-1 rounded-lg bg-surface border border-border text-text-primary text-xs font-semibold whitespace-nowrap shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            {translatedLabel}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Desktop Admin Section */}
          {(isAdmin || isOwner) && (
            <div className="pt-2 border-t border-border/70 space-y-1">
              {!isCollapsed && (
                <div className="px-2 pb-1 text-[11px] font-semibold text-brand-400 flex items-center justify-between">
                  <span>{isOwner ? "Administrasi (Pemilik)" : "Administrasi"}</span>
                  <Crown className="w-3 h-3 text-brand-400" />
                </div>
              )}

              <div className="space-y-0.5">
                {isOwner && (
                  <div className="relative group">
                    <Link
                      href="/dashboard/kelola-role"
                      className={cn(
                        "relative flex items-center rounded-xl transition-all duration-150 font-semibold",
                        isCollapsed
                          ? "justify-center w-10 h-10 mx-auto"
                          : "gap-2.5 px-2.5 h-[34px] text-[13px]",
                        pathname.startsWith("/dashboard/kelola-role")
                          ? "bg-brand-500/12 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/25 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[3px] before:rounded-r before:bg-brand-500 shadow-2xs"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary/80 border border-transparent"
                      )}
                    >
                      <ShieldCheck className="w-4 h-4 shrink-0 text-text-tertiary group-hover:text-brand-400" />
                      {!isCollapsed && (
                        <span className="truncate leading-snug">Kelola Hak Akses</span>
                      )}
                    </Link>

                    {isCollapsed && (
                      <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2.5 px-2.5 py-1 rounded-lg bg-surface border border-border text-text-primary text-xs font-semibold whitespace-nowrap shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        Kelola Hak Akses
                      </div>
                    )}
                  </div>
                )}

                <div className="relative group">
                  <Link
                    href="/dashboard/peta-pengguna"
                    className={cn(
                      "relative flex items-center rounded-xl transition-all duration-150 font-semibold",
                      isCollapsed
                        ? "justify-center w-10 h-10 mx-auto"
                        : "gap-2.5 px-2.5 h-[34px] text-[13px]",
                      pathname.startsWith("/dashboard/peta-pengguna")
                        ? "bg-brand-500/12 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/25 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[3px] before:rounded-r before:bg-brand-500 shadow-2xs"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary/80 border border-transparent"
                    )}
                  >
                    <MapPin className="w-4 h-4 shrink-0 text-text-tertiary group-hover:text-brand-400" />
                    {!isCollapsed && (
                      <span className="truncate leading-snug">Peta Pengguna</span>
                    )}
                  </Link>

                  {isCollapsed && (
                    <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2.5 px-2.5 py-1 rounded-lg bg-surface border border-border text-text-primary text-xs font-semibold whitespace-nowrap shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      Peta Pengguna
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
