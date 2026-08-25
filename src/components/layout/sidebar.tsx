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
  FolderCode,
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
  ChevronDown,
  Calendar,
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
  FolderCode,
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
  Calendar,
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
  "Statistik Belajar": "navStatistik",
  "Semua Modul": "navModul",
  "Modul & Project": "navModul",
  "Modul dan Project": "navModul",
  "Modul & Panduan": "navModul",
  "Koleksi Materi": "navMateri",
  "Materi Pembelajaran": "navMateri",
  "Bahan Ajar & Dokumen": "navMateri",
  "Semua Tugas": "navTugas",
  "Tugas & Jadwal": "navTugas",
  "Tugas Pembelajaran": "navTugas",
  "Materi Tersimpan": "navBookmark",
  "Catatan Belajar": "navCatatan",
  "Asisten AI": "navAiTutor",
  "AI Assistant": "navAiTutor",
  "Tutor AI": "navAiTutor",
  "AI Tutor Cerdas": "navAiTutor",
  "Latihan dan Kuis": "navKuisAi",
  "Latihan & Kuis AI": "navKuisAi",
  "Konversi Berkas": "navKonversi",
  "Konversi & OCR Berkas": "navKonversi",
  "Ruang Praktik Kode": "navPlayground",
  "Ruang Praktik & Alat": "navPlayground",
  "Kategori Pembelajaran": "navKategori",
  "Kategori & Subjek": "navKategori",
  "Label dan Tag": "navTag",
  "Label & Tag": "navTag",
  "Berkas Pembelajaran": "navFile",
  "Semua Berkas": "navFile",
  "Ruang Kelas": "navKelas",
  "Jadwal & Reminder": "navJadwal",
  "Jadwal Perkuliahan": "navJadwal",
  "Statistik & Progres": "navStatistik",
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
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    SIDEBAR_CATEGORIES.forEach((category) => {
      category.links.forEach((link: any) => {
        if (link.subItems && link.subItems.length > 0) {
          initial[link.href] = true;
        }
      });
    });
    return initial;
  });

  // Auto-expand parent menu when current pathname matches any sub-item
  useEffect(() => {
    if (!pathname) return;
    SIDEBAR_CATEGORIES.forEach((category) => {
      category.links.forEach((link: any) => {
        if (link.subItems && link.subItems.length > 0) {
          const isChildActive = link.subItems.some((sub: any) => {
            if (sub.href.includes("?")) {
              return pathname === sub.href.split("?")[0];
            }
            return pathname === sub.href || pathname.startsWith(sub.href + "/");
          });
          const isParentActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === link.href || pathname.startsWith(link.href + "/");

          if (isChildActive || isParentActive) {
            setExpandedMenus((prev) => ({ ...prev, [link.href]: true }));
          }
        }
      });
    });
  }, [pathname]);

  // Toggle accordion item
  const toggleMenu = (href: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setExpandedMenus((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

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

      {/* ─── 2. MOBILE DRAWER SIDEBAR ─── */}
      <aside
        aria-label="Sidebar Mobile Drawer"
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 w-[min(88vw,290px)] bg-surface border-r border-border shadow-2xl lg:hidden",
          "flex flex-col transition-transform duration-200 ease-out select-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Header: Brand & Close Button */}
        <div className="h-14 px-4 border-b border-border flex items-center justify-between shrink-0 bg-surface">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 rounded-lg p-0.5"
          >
            <Logo variant="sidebar" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu navigasi"
            className="p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface-secondary active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation List (Scrollable) */}
        <nav
          aria-label="Navigasi Utama Mobile"
          className="flex-1 px-3 py-3.5 space-y-4 overflow-y-auto sidebar-nav-scroll overscroll-contain pb-8"
        >
          {SIDEBAR_CATEGORIES.map((category) => {
            const catKey = categoryTitleMap[category.title];
            const translatedCatTitle =
              catKey && t(catKey) && t(catKey) !== catKey ? t(catKey) : category.title;

            return (
              <div key={category.title} className="space-y-1">
                <div className="px-2.5 pb-1 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                  {translatedCatTitle}
                </div>

                <div className="space-y-1">
                  {category.links.map((link: any) => {
                    const Icon = iconMap[link.icon];
                    const hasSubItems = link.subItems && link.subItems.length > 0;
                    const isExpanded = !!expandedMenus[link.href];

                    const isParentExact =
                      link.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname === link.href;
                    const isAnyChildActive =
                      hasSubItems &&
                      link.subItems.some((sub: any) => {
                        if (sub.href.includes("?")) {
                          return pathname === sub.href.split("?")[0];
                        }
                        return pathname === sub.href || pathname.startsWith(sub.href + "/");
                      });
                    const isActive = isParentExact || isAnyChildActive;

                    const linkKey = linkLabelMap[link.label];
                    const translatedLabel =
                      linkKey && t(linkKey) && t(linkKey) !== linkKey
                        ? t(linkKey)
                        : link.label;
                    const isAiItem = link.isAi;

                    return (
                      <div key={link.href} className="space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Link
                            href={link.href}
                            onClick={onClose}
                            aria-current={isParentExact ? "page" : undefined}
                            className={cn(
                              "flex items-center gap-3 px-3 h-10 rounded-xl text-xs sm:text-sm font-medium transition-colors flex-1 min-w-0",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
                              isActive
                                ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20"
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
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                                AI
                              </span>
                            )}
                          </Link>

                          {hasSubItems && (
                            <button
                              type="button"
                              onClick={(e) => toggleMenu(link.href, e)}
                              aria-expanded={isExpanded}
                              aria-label={`Buka submenu ${link.label}`}
                              className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
                            >
                              <ChevronDown
                                className={cn(
                                  "w-3.5 h-3.5 transition-transform duration-200",
                                  isExpanded && "rotate-180 text-brand-500"
                                )}
                              />
                            </button>
                          )}
                        </div>

                        {/* Accordion Submenu Items */}
                        {hasSubItems && isExpanded && (
                          <div className="ml-5 pl-2.5 border-l border-border/70 space-y-0.5 py-0.5 animate-fade-in">
                            {link.subItems.map((sub: any) => {
                              const SubIcon = iconMap[sub.icon];
                              const isSubActive = sub.href.includes("?")
                                ? pathname === sub.href.split("?")[0]
                                : pathname === sub.href;
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={onClose}
                                  aria-current={isSubActive ? "page" : undefined}
                                  className={cn(
                                    "flex items-center gap-2 px-2.5 h-8.5 rounded-lg text-[12px] font-medium transition-colors",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
                                    isSubActive
                                      ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold"
                                      : "text-text-tertiary hover:text-text-primary hover:bg-surface-secondary"
                                  )}
                                >
                                  {SubIcon && (
                                    <SubIcon
                                      className={cn(
                                        "w-3.5 h-3.5 shrink-0",
                                        isSubActive
                                          ? "text-brand-500 dark:text-brand-400"
                                          : "text-text-tertiary"
                                      )}
                                    />
                                  )}
                                  <span className="truncate">{sub.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
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
                    aria-current={pathname.startsWith("/dashboard/kelola-role") ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 h-10 rounded-xl text-xs sm:text-sm font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
                      pathname.startsWith("/dashboard/kelola-role")
                        ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20"
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
                  aria-current={pathname.startsWith("/dashboard/peta-pengguna") ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 h-10 rounded-xl text-xs sm:text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
                    pathname.startsWith("/dashboard/peta-pengguna")
                      ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20"
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
        aria-label="Sidebar Desktop"
        className={cn(
          "hidden lg:flex fixed top-0 left-0 z-30 h-screen bg-surface border-r border-border select-none",
          "flex-col transition-all duration-200 ease-out",
          isCollapsed ? "w-[68px]" : "w-[245px]"
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
              "flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 rounded-lg p-0.5 min-w-0 overflow-hidden",
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
                "p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary border border-border/50 hover:border-border transition-colors cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
                isCollapsed && "hidden"
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
              className="w-full flex items-center justify-center h-7 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary border border-border/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 cursor-pointer"
              title="Buka Penuh Sidebar (Expand)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Desktop Navigation List */}
        <nav
          aria-label="Navigasi Utama Desktop"
          className="flex-1 px-2.5 py-3 space-y-3.5 overflow-y-auto sidebar-nav-scroll overscroll-contain"
        >
          {SIDEBAR_CATEGORIES.map((category) => {
            const catKey = categoryTitleMap[category.title];
            const translatedCatTitle =
              catKey && t(catKey) && t(catKey) !== catKey ? t(catKey) : category.title;

            return (
              <div key={category.title} className="space-y-0.5">
                {/* Category Header */}
                {!isCollapsed && (
                  <div className="px-2 pb-1 text-[10.5px] font-semibold text-text-tertiary uppercase tracking-wider">
                    {translatedCatTitle}
                  </div>
                )}

                {/* Menu Items */}
                <div className="space-y-0.5">
                  {category.links.map((link: any) => {
                    const Icon = iconMap[link.icon];
                    const hasSubItems = link.subItems && link.subItems.length > 0;
                    const isExpanded = !!expandedMenus[link.href];

                    const isParentExact =
                      link.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname === link.href;
                    const isAnyChildActive =
                      hasSubItems &&
                      link.subItems.some((sub: any) => {
                        if (sub.href.includes("?")) {
                          return pathname === sub.href.split("?")[0];
                        }
                        return pathname === sub.href || pathname.startsWith(sub.href + "/");
                      });
                    const isActive = isParentExact || isAnyChildActive;

                    const linkKey = linkLabelMap[link.label];
                    const translatedLabel =
                      linkKey && t(linkKey) && t(linkKey) !== linkKey
                        ? t(linkKey)
                        : link.label;
                    const isAiItem = link.isAi;

                    return (
                      <div key={link.href} className="relative group space-y-0.5">
                        <div className="flex items-center">
                          <Link
                            href={link.href}
                            aria-current={isParentExact ? "page" : undefined}
                            className={cn(
                              "relative flex items-center rounded-xl transition-all duration-150 font-medium flex-1 min-w-0",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
                              isCollapsed
                                ? "justify-center w-10 h-10 mx-auto"
                                : "gap-2 px-2.5 h-[34px] text-[13px]",
                              isActive
                                ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[3px] before:rounded-r before:bg-brand-500 shadow-2xs"
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
                              <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                                AI
                              </span>
                            )}
                          </Link>

                          {/* Expand/Collapse Chevron Button (Desktop Expanded) */}
                          {hasSubItems && !isCollapsed && (
                            <button
                              type="button"
                              onClick={(e) => toggleMenu(link.href, e)}
                              aria-expanded={isExpanded}
                              aria-label={`Toggle ${link.label}`}
                              className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer ml-0.5"
                            >
                              <ChevronDown
                                className={cn(
                                  "w-3.5 h-3.5 transition-transform duration-200",
                                  isExpanded && "rotate-180 text-brand-500"
                                )}
                              />
                            </button>
                          )}
                        </div>

                        {/* Accordion Sub-items (Desktop Expanded) */}
                        {hasSubItems && !isCollapsed && isExpanded && (
                          <div className="ml-4 pl-2 border-l border-border/70 space-y-0.5 py-0.5 animate-fade-in">
                            {link.subItems.map((sub: any) => {
                              const SubIcon = iconMap[sub.icon];
                              const isSubActive = sub.href.includes("?")
                                ? pathname === sub.href.split("?")[0]
                                : pathname === sub.href;

                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  aria-current={isSubActive ? "page" : undefined}
                                  className={cn(
                                    "flex items-center gap-2 px-2 h-7 rounded-lg text-[12px] font-medium transition-colors",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
                                    isSubActive
                                      ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold"
                                      : "text-text-tertiary hover:text-text-primary hover:bg-surface-secondary/70"
                                  )}
                                >
                                  {SubIcon && (
                                    <SubIcon
                                      className={cn(
                                        "w-3.5 h-3.5 shrink-0",
                                        isSubActive
                                          ? "text-brand-500 dark:text-brand-400"
                                          : "text-text-tertiary"
                                      )}
                                    />
                                  )}
                                  <span className="truncate">{sub.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}

                        {/* Collapsed Tooltip / Flyout Menu on Hover (Desktop Collapsed) */}
                        {isCollapsed && (
                          <div className="pointer-events-none group-hover:pointer-events-auto absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 rounded-xl bg-surface border border-border text-text-primary text-xs font-semibold shadow-2xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 min-w-[180px] space-y-1.5">
                            <div className="font-bold border-b border-border/60 pb-1 text-text-primary flex items-center justify-between">
                              <span>{translatedLabel}</span>
                              {isAiItem && (
                                <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-brand-500/10 text-brand-400">
                                  AI
                                </span>
                              )}
                            </div>

                            {hasSubItems && (
                              <div className="space-y-0.5 pt-0.5">
                                {link.subItems.map((sub: any) => {
                                  const SubIcon = iconMap[sub.icon];
                                  const isSubActive = sub.href.includes("?")
                                    ? pathname === sub.href.split("?")[0]
                                    : pathname === sub.href;

                                  return (
                                    <Link
                                      key={sub.href}
                                      href={sub.href}
                                      className={cn(
                                        "flex items-center gap-2 px-2 py-1 rounded-md text-[11.5px] transition-colors",
                                        isSubActive
                                          ? "bg-brand-500/15 text-brand-500 font-semibold"
                                          : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                                      )}
                                    >
                                      {SubIcon && <SubIcon className="w-3 h-3 shrink-0" />}
                                      <span className="truncate">{sub.label}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
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
                <div className="px-2 pb-1 text-[10.5px] font-semibold text-brand-400 uppercase tracking-wider flex items-center justify-between">
                  <span>{isOwner ? "Administrasi (Pemilik)" : "Administrasi"}</span>
                  <Crown className="w-3 h-3 text-brand-400" />
                </div>
              )}

              <div className="space-y-0.5">
                {isOwner && (
                  <div className="relative group">
                    <Link
                      href="/dashboard/kelola-role"
                      aria-current={pathname.startsWith("/dashboard/kelola-role") ? "page" : undefined}
                      className={cn(
                        "relative flex items-center rounded-xl transition-all duration-150 font-semibold",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
                        isCollapsed
                          ? "justify-center w-10 h-10 mx-auto"
                          : "gap-2.5 px-2.5 h-[34px] text-[13px]",
                        pathname.startsWith("/dashboard/kelola-role")
                          ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[3px] before:rounded-r before:bg-brand-500 shadow-2xs"
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
                    aria-current={pathname.startsWith("/dashboard/peta-pengguna") ? "page" : undefined}
                    className={cn(
                      "relative flex items-center rounded-xl transition-all duration-150 font-semibold",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
                      isCollapsed
                        ? "justify-center w-10 h-10 mx-auto"
                        : "gap-2.5 px-2.5 h-[34px] text-[13px]",
                      pathname.startsWith("/dashboard/peta-pengguna")
                        ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[3px] before:rounded-r before:bg-brand-500 shadow-2xs"
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
