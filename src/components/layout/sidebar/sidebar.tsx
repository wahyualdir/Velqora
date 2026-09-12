"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SIDEBAR_CATEGORIES, NavItem } from "@/lib/constants";
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  ShieldCheck,
  MapPin,
  Search,
  Command,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { UserProfileMenu } from "@/components/layout/user-profile-menu";
import { NotificationCenter } from "@/components/layout/notification-center";
import { isAdminUser, isOwnerUser, OWNER_EMAIL } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { useSurface } from "@/context/surface-context";
import { iconMap, categoryTitleMap, linkLabelMap } from "./navigation-config";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenCommandPalette?: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  onOpenCommandPalette,
}: SidebarProps) {
  const pathname = usePathname();
  const [currentQuery, setCurrentQuery] = useState("");
  const { t } = useLanguage();
  const { isApp } = useSurface();
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Track window.location.search on client without triggering Next.js SSG build bailouts
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentQuery(window.location.search);
    }
  }, [pathname]);

  useEffect(() => {
    const handleLocationChange = () => {
      if (typeof window !== "undefined") {
        setCurrentQuery(window.location.search);
      }
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  // Presisi active state untuk item navigasi flat termasuk query parameters (?mode=project)
  const isLinkActive = (link: NavItem) => {
    const searchParams = new URLSearchParams(currentQuery);
    if (link.href.includes("?")) {
      const [linkPath, linkQuery] = link.href.split("?");
      if (pathname !== linkPath) return false;
      const [qKey, qVal] = linkQuery.split("=");
      return searchParams.get(qKey) === qVal;
    }

    if (pathname !== link.href) {
      if (link.exact) return false;
      return pathname.startsWith(link.href + "/");
    }

    // Jika base path sama (misal /dashboard/modul), jangan aktif jika ada query param spesifik milik sibling
    if (link.href === "/dashboard/modul" && searchParams.get("mode") === "project") {
      return false;
    }

    return true;
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

        if (isOwnerUser(email) || localRole === "owner") {
          setIsOwner(true);
          setIsAdmin(true);
          return;
        }

        if (localRole === "admin" || localRole === "owner" || (email && isAdminUser(email))) {
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
          "fixed top-0 left-0 bottom-0 z-50 w-[min(88vw,290px)] bg-[#FAF8F5] dark:bg-[#121214] border-r-2 border-r-[#7A756D] dark:border-r-[#27272A] border-l-2 border-l-[#FFFFFF] dark:border-l-[#1E1E22] shadow-2xl lg:hidden",
          "flex flex-col transition-transform duration-200 ease-out select-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Header: Retro Window Titlebar */}
        <div className="h-11 px-3 border-b-2 border-b-[#7A756D] dark:border-b-[#27272A] flex items-center justify-between shrink-0 bg-[#ECE9D8] dark:bg-[#18181B]">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2 focus-visible:outline-none rounded-none p-0.5"
          >
            <Logo variant="sidebar" />
          </Link>

          <div className="flex items-center gap-1.5">
            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1 font-mono text-xs bg-[#ECE9D8] dark:bg-[#27272A] text-[#1C1917] dark:text-[#F4F4F5] border-t border-l border-[#FFFFFF] dark:border-t-[#3F3F46] dark:border-l-[#3F3F46] border-b border-r border-[#7A756D] dark:border-b-[#09090B] dark:border-r-[#09090B] hover:bg-[#F2EFE8] dark:hover:bg-[#3F3F46] active:border-t-[#7A756D] active:border-l-[#7A756D] active:border-b-[#FFFFFF] active:border-r-[#FFFFFF] cursor-pointer"
                title={resolvedTheme === "dark" ? "Mode Terang (Light)" : "Mode Gelap (Dark)"}
                aria-label="Ganti Tema"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-[#853827]" />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup menu navigasi"
              className="px-2 py-0.5 font-mono text-xs font-bold bg-[#ECE9D8] dark:bg-[#27272A] text-[#1C1917] dark:text-[#F4F4F5] border-t border-l border-[#FFFFFF] dark:border-t-[#3F3F46] dark:border-l-[#3F3F46] border-b border-r border-[#7A756D] dark:border-b-[#09090B] dark:border-r-[#09090B] active:border-t-[#7A756D] active:border-l-[#7A756D] active:border-b-[#FFFFFF] active:border-r-[#FFFFFF] cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>

        {/* Mobile Search Button */}
        {onOpenCommandPalette && (
          <div className="px-2.5 pt-2 pb-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCommandPalette();
              }}
              className="w-full flex items-center justify-between gap-2 px-2.5 h-8 bg-[#FAF8F5] dark:bg-[#121214] border-t border-l border-[#7A756D] dark:border-t-[#09090B] dark:border-l-[#09090B] border-b border-r border-[#FFFFFF] dark:border-b-zinc-800 dark:border-r-zinc-800 text-[#7A756D] dark:text-zinc-400 hover:text-[#1C1917] dark:hover:text-zinc-200 transition-colors text-xs font-mono text-left cursor-pointer"
              title="Pencarian Cepat (Ctrl + K)"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Cari materi, modul...</span>
              </div>
              <div className="flex items-center gap-0.5 px-1 py-0.2 border border-[#B8B1A5] dark:border-zinc-700 bg-[#ECE9D8] dark:bg-zinc-800 text-[9.5px] font-mono shrink-0">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </button>
          </div>
        )}

        {/* Mobile Navigation List (Scrollable Flat List) */}
        <nav
          aria-label="Navigasi Utama Mobile"
          className="flex-1 px-2.5 py-2.5 space-y-3.5 overflow-y-auto sidebar-nav-scroll overscroll-contain pb-4"
        >
          {SIDEBAR_CATEGORIES.map((category) => {
            const catKey = categoryTitleMap[category.title];
            const translatedCatTitle =
              catKey && t(catKey) && t(catKey) !== catKey ? t(catKey) : category.title;

            return (
              <div key={category.title} className="space-y-1">
                <div className="px-2 pt-1 pb-0.5 font-mono text-[9.5px] font-bold text-[#853827] dark:text-brand-400 uppercase tracking-wider">
                  {translatedCatTitle}
                </div>

                <div className="space-y-0.5">
                  {category.links.map((link) => {
                    const Icon = iconMap[link.icon];
                    const isActive = isLinkActive(link);
                    const linkKey = linkLabelMap[link.label];
                    const translatedLabel =
                      linkKey && t(linkKey) && t(linkKey) !== linkKey
                        ? t(linkKey)
                        : link.label;
                    const isAiItem = link.isAi;

                    return (
                      <div key={link.href} className="space-y-0.5">
                        <div
                          className={cn(
                            "group flex items-center rounded-xs transition-all duration-100",
                            isActive
                              ? "bg-[#C2553A] dark:bg-brand-600 text-white shadow-xs border-t border-l border-[#EE7257] dark:border-t-brand-400 dark:border-l-brand-400 border-b border-r border-[#6B2D20] dark:border-b-brand-900 dark:border-r-brand-900"
                              : "text-[#2D2823] dark:text-zinc-300 hover:text-[#1A1816] dark:hover:text-white hover:bg-[#ECE7DF] dark:hover:bg-zinc-800/70 border border-transparent font-medium"
                          )}
                        >
                          <Link
                            href={link.href}
                            onClick={onClose}
                            aria-current={isActive ? "page" : undefined}
                            className="flex items-center gap-2.5 px-2.5 h-8 flex-1 min-w-0 focus-visible:outline-none"
                          >
                            {Icon && (
                              <Icon
                                className={cn(
                                  "w-4 h-4 shrink-0 transition-colors",
                                  isActive
                                    ? "text-white"
                                    : isAiItem
                                    ? "text-[#C2553A] dark:text-brand-400"
                                    : "text-[#6E675F] dark:text-zinc-400 group-hover:text-[#1A1816] dark:group-hover:text-white"
                                )}
                              />
                            )}
                            <span className="truncate flex-1 font-sans text-[13px] font-medium leading-none">
                              {translatedLabel}
                            </span>
                            {isAiItem && !isActive && (
                              <span className="px-1.5 py-0.5 text-[8.5px] font-mono font-bold bg-[#C2553A]/10 dark:bg-brand-400/15 text-[#C2553A] dark:text-brand-400 border border-[#C2553A]/30 dark:border-brand-400/30 rounded-2xs">
                                AI
                              </span>
                            )}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Mobile Admin Section */}
          {(isAdmin || isOwner) && (
            <div className="pt-2.5 border-t border-[#7A756D]/40 dark:border-zinc-800 space-y-1">
              <div className="px-2 pb-1 font-mono text-[9.5px] font-bold text-[#C2553A] dark:text-brand-400 flex items-center justify-between uppercase tracking-wider">
                <span>{isOwner ? "Administrasi (Pemilik)" : "Administrasi"}</span>
                <Crown className="w-3 h-3 text-[#C2553A] dark:text-brand-400" />
              </div>

              <div className="space-y-0.5">
                {isOwner && (
                  <Link
                    href="/dashboard/kelola-role"
                    onClick={onClose}
                    aria-current={pathname.startsWith("/dashboard/kelola-role") ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 h-8 font-sans text-[13px] font-medium transition-colors rounded-xs",
                      "focus-visible:outline-none",
                      pathname.startsWith("/dashboard/kelola-role")
                        ? "bg-[#C2553A] dark:bg-brand-600 text-white font-bold border-t border-l border-[#EE7257] dark:border-t-brand-400 dark:border-l-brand-400 border-b border-r border-[#6B2D20] dark:border-b-brand-900 dark:border-r-brand-900 shadow-xs"
                        : "text-[#2D2823] dark:text-zinc-300 hover:text-[#1A1816] dark:hover:text-white hover:bg-[#ECE7DF] dark:hover:bg-zinc-800/70 border border-transparent"
                    )}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Kelola Hak Akses</span>
                  </Link>
                )}

                <Link
                  href="/dashboard/peta-pengguna"
                  onClick={onClose}
                  aria-current={pathname.startsWith("/dashboard/peta-pengguna") ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 h-8 font-sans text-[13px] font-medium transition-colors rounded-xs",
                    "focus-visible:outline-none",
                    pathname.startsWith("/dashboard/peta-pengguna")
                      ? "bg-[#C2553A] dark:bg-brand-600 text-white font-bold border-t border-l border-[#EE7257] dark:border-t-brand-400 dark:border-l-brand-400 border-b border-r border-[#6B2D20] dark:border-b-brand-900 dark:border-r-brand-900 shadow-xs"
                      : "text-[#2D2823] dark:text-zinc-300 hover:text-[#1A1816] dark:hover:text-white hover:bg-[#ECE7DF] dark:hover:bg-zinc-800/70 border border-transparent"
                  )}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Peta Pengguna</span>
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Footer: Notification + User Profile */}
        <div className="p-2.5 border-t-2 border-t-[#7A756D] dark:border-t-[#27272A] bg-[#ECE9D8] dark:bg-[#18181B] shrink-0 space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <NotificationCenter
                dropdownPosition="top"
                align="left"
                buttonClassName="p-1 rounded-none bg-[#ECE9D8] dark:bg-[#27272A] text-[#1C1917] dark:text-[#F4F4F5] border-t border-l border-[#FFFFFF] dark:border-t-[#3F3F46] dark:border-l-[#3F3F46] border-b border-r border-[#7A756D] dark:border-b-[#09090B] dark:border-r-[#09090B]"
              />
              <span className="font-mono text-[10px] text-[#7A756D] dark:text-zinc-400">
                Notifikasi
              </span>
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#FAF8F5] dark:bg-[#121214] border border-[#B8B1A5] dark:border-zinc-700 text-[9px] font-mono text-emerald-700 dark:text-emerald-400 uppercase font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </div>
          </div>
          <UserProfileMenu variant="sidebar" onCloseParent={onClose} />
        </div>
      </aside>

      {/* ─── 3. DESKTOP FIXED SIDEBAR (EXPANDED ↔ COLLAPSED) ─── */}
      {!isApp && (
        <aside
          aria-label="Sidebar Desktop"
          className={cn(
            "hidden lg:flex fixed top-0 left-0 z-30 h-screen bg-[#FAF8F5] dark:bg-[#121214] border-r-2 border-r-[#7A756D] dark:border-r-[#27272A] border-l-2 border-l-[#FFFFFF] dark:border-l-[#1E1E22] select-none",
            "flex-col transition-all duration-200 ease-out shadow-xs",
            isCollapsed ? "w-[68px]" : "w-[245px]"
          )}
        >
          {/* Desktop Header: Brand + Quick Actions */}
          <div
            className={cn(
              "h-11 px-3 border-b-2 border-b-[#7A756D] dark:border-b-[#27272A] flex items-center shrink-0 bg-[#ECE9D8] dark:bg-[#18181B] transition-all duration-200",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-2 focus-visible:outline-none rounded-none p-0.5 min-w-0 overflow-hidden",
                isCollapsed && "justify-center"
              )}
              title="Velqora Dashboard"
            >
              <Logo variant="sidebar" hideText={isCollapsed} />
            </Link>

            {/* Actions when Expanded: Theme Toggle + Collapse Button */}
            {!isCollapsed && (
              <div className="flex items-center gap-1 shrink-0">
                {mounted && (
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-1 font-mono text-xs bg-[#ECE9D8] dark:bg-[#27272A] text-[#1C1917] dark:text-[#F4F4F5] border-t border-l border-[#FFFFFF] dark:border-t-[#3F3F46] dark:border-l-[#3F3F46] border-b border-r border-[#7A756D] dark:border-b-[#09090B] dark:border-r-[#09090B] hover:bg-[#F2EFE8] dark:hover:bg-[#3F3F46] active:border-t-[#7A756D] active:border-l-[#7A756D] active:border-b-[#FFFFFF] active:border-r-[#FFFFFF] transition-colors cursor-pointer"
                    title={resolvedTheme === "dark" ? "Mode Terang (Light)" : "Mode Gelap (Dark)"}
                    aria-label="Ganti Tema"
                  >
                    {resolvedTheme === "dark" ? (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-[#853827]" />
                    )}
                  </button>
                )}

                {onToggleCollapse && (
                  <button
                    type="button"
                    onClick={onToggleCollapse}
                    aria-label="Toggle sidebar"
                    aria-expanded={!isCollapsed}
                    className="px-1.5 py-0.5 font-mono text-xs font-bold bg-[#ECE9D8] dark:bg-[#27272A] text-[#1C1917] dark:text-[#F4F4F5] border-t border-l border-[#FFFFFF] dark:border-t-[#3F3F46] dark:border-l-[#3F3F46] border-b border-r border-[#7A756D] dark:border-b-[#09090B] dark:border-r-[#09090B] hover:bg-[#F2EFE8] dark:hover:bg-[#3F3F46] active:border-t-[#7A756D] active:border-l-[#7A756D] active:border-b-[#FFFFFF] active:border-r-[#FFFFFF] transition-colors cursor-pointer"
                    title="Kecilkan Sidebar (Collapse)"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
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
                className="w-full flex items-center justify-center h-6 font-mono text-xs bg-[#ECE9D8] dark:bg-[#27272A] text-[#1C1917] dark:text-[#F4F4F5] border-t border-l border-[#FFFFFF] dark:border-t-[#3F3F46] dark:border-l-[#3F3F46] border-b border-r border-[#7A756D] dark:border-b-[#09090B] dark:border-r-[#09090B] hover:bg-[#F2EFE8] dark:hover:bg-[#3F3F46] active:border-t-[#7A756D] active:border-l-[#7A756D] active:border-b-[#FFFFFF] active:border-r-[#FFFFFF] cursor-pointer"
                title="Buka Penuh Sidebar (Expand)"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Desktop Search Trigger */}
          {onOpenCommandPalette && (
            <div className={cn("shrink-0", isCollapsed ? "px-2 pt-2" : "px-2.5 pt-2 pb-1")}>
              {!isCollapsed ? (
                <button
                  type="button"
                  onClick={onOpenCommandPalette}
                  className="w-full flex items-center justify-between gap-2 px-2.5 h-8 bg-[#FAF8F5] dark:bg-[#121214] border-t border-l border-[#7A756D] dark:border-t-[#09090B] dark:border-l-[#09090B] border-b border-r border-[#FFFFFF] dark:border-b-zinc-800 dark:border-r-zinc-800 text-[#7A756D] dark:text-zinc-400 hover:text-[#1C1917] dark:hover:text-zinc-200 transition-colors text-xs font-mono text-left cursor-pointer group"
                  title="Pencarian Cepat (Ctrl + K)"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Search className="w-3.5 h-3.5 shrink-0 text-[#7A756D] dark:text-zinc-400 group-hover:text-[#C2553A] dark:group-hover:text-brand-400 transition-colors" />
                    <span className="truncate">Cari...</span>
                  </div>
                  <div className="flex items-center gap-0.5 px-1 py-0.2 border border-[#B8B1A5] dark:border-zinc-700 bg-[#ECE9D8] dark:bg-zinc-800 text-[9.5px] font-mono text-[#524B42] dark:text-zinc-300 shrink-0">
                    <Command className="w-2.5 h-2.5" />
                    <span>K</span>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenCommandPalette}
                  className="w-8 h-8 mx-auto flex items-center justify-center bg-[#FAF8F5] dark:bg-[#121214] border-t border-l border-[#7A756D] dark:border-t-[#09090B] dark:border-l-[#09090B] border-b border-r border-[#FFFFFF] dark:border-b-zinc-800 dark:border-r-zinc-800 text-[#7A756D] dark:text-zinc-400 hover:text-[#C2553A] dark:hover:text-brand-400 transition-colors cursor-pointer"
                  title="Pencarian Cepat (Ctrl + K)"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Desktop Navigation List (Flat structured per Category) */}
          <nav
            aria-label="Navigasi Utama Desktop"
            className="flex-1 px-2 py-3 space-y-3 overflow-y-auto sidebar-nav-scroll overscroll-contain"
          >
            {SIDEBAR_CATEGORIES.map((category) => {
              const catKey = categoryTitleMap[category.title];
              const translatedCatTitle =
                catKey && t(catKey) && t(catKey) !== catKey ? t(catKey) : category.title;

              return (
                <div key={category.title} className="space-y-0.5">
                  {/* Category Header */}
                  {!isCollapsed && (
                    <div className="px-2 pt-1 pb-0.5 font-mono text-[9.5px] font-bold text-[#853827] dark:text-brand-400 uppercase tracking-wider">
                      {translatedCatTitle}
                    </div>
                  )}

                  {/* Flat Menu Items */}
                  <div className="space-y-0.5">
                    {category.links.map((link) => {
                      const Icon = iconMap[link.icon];
                      const isActive = isLinkActive(link);
                      const linkKey = linkLabelMap[link.label];
                      const translatedLabel =
                        linkKey && t(linkKey) && t(linkKey) !== linkKey
                          ? t(linkKey)
                          : link.label;
                      const isAiItem = link.isAi;

                      return (
                        <div key={link.href} className="relative group space-y-0.5">
                          <div
                            className={cn(
                              "flex items-center rounded-xs transition-all duration-100",
                              isActive
                                ? "bg-[#C2553A] dark:bg-brand-600 text-white shadow-xs border-t border-l border-[#EE7257] dark:border-t-brand-400 dark:border-l-brand-400 border-b border-r border-[#6B2D20] dark:border-b-brand-900 dark:border-r-brand-900"
                                : "text-[#2D2823] dark:text-zinc-300 hover:text-[#1A1816] dark:hover:text-white hover:bg-[#ECE7DF] dark:hover:bg-zinc-800/70 border border-transparent font-medium"
                            )}
                          >
                            <Link
                              href={link.href}
                              aria-current={isActive ? "page" : undefined}
                              className={cn(
                                "relative flex items-center transition-all duration-100 flex-1 min-w-0 focus-visible:outline-none",
                                isCollapsed
                                  ? "justify-center w-8 h-8 mx-auto"
                                  : "gap-2 px-2.5 h-7.5"
                              )}
                            >
                              {Icon && (
                                <Icon
                                  className={cn(
                                    "w-3.5 h-3.5 shrink-0 transition-colors",
                                    isActive
                                      ? "text-white"
                                      : isAiItem
                                      ? "text-[#C2553A] dark:text-brand-400"
                                      : "text-[#7A756D] dark:text-zinc-400 group-hover:text-[#1A1816] dark:group-hover:text-white"
                                  )}
                                />
                              )}

                              {!isCollapsed && (
                                <span className="truncate flex-1 font-sans text-[13px] font-medium leading-none">
                                  {translatedLabel}
                                </span>
                              )}

                              {isAiItem && !isActive && !isCollapsed && (
                                <span className="px-1 py-0.2 text-[8.5px] font-mono font-bold bg-[#C2553A]/10 dark:bg-brand-400/15 text-[#C2553A] dark:text-brand-400 border border-[#C2553A]/30 dark:border-brand-400/30 rounded-2xs">
                                  AI
                                </span>
                              )}
                            </Link>
                          </div>

                          {/* Collapsed Tooltip on Hover (Desktop Collapsed 64px) */}
                          {isCollapsed && (
                            <div className="pointer-events-none group-hover:pointer-events-auto absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-none bg-[#FAF8F5] dark:bg-[#18181B] border-2 border-t-[#FFFFFF] dark:border-t-[#3F3F46] border-l-[#FFFFFF] dark:border-l-[#3F3F46] border-b-[#7A756D] dark:border-b-[#09090B] border-r-[#7A756D] dark:border-r-[#09090B] text-[#1C1917] dark:text-[#F4F4F5] text-xs font-sans font-bold shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap flex items-center gap-2">
                              <span>{translatedLabel}</span>
                              {isAiItem && (
                                <span className="px-1 py-0.2 text-[8px] font-mono bg-[#C2553A]/10 dark:bg-brand-400/15 text-[#C2553A] dark:text-brand-400">
                                  AI
                                </span>
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
              <div className="pt-2 border-t border-[#7A756D]/40 dark:border-zinc-800 space-y-1">
                {!isCollapsed && (
                  <div className="px-2 pb-0.5 font-mono text-[9.5px] font-bold text-[#C2553A] dark:text-brand-400 uppercase tracking-wider flex items-center justify-between">
                    <span>{isOwner ? "Administrasi (Pemilik)" : "Administrasi"}</span>
                    <Crown className="w-3 h-3 text-[#C2553A] dark:text-brand-400" />
                  </div>
                )}

                <div className="space-y-0.5">
                  {isOwner && (
                    <div className="relative group">
                      <Link
                        href="/dashboard/kelola-role"
                        aria-current={pathname.startsWith("/dashboard/kelola-role") ? "page" : undefined}
                        className={cn(
                          "relative flex items-center transition-all duration-100 flex-1 min-w-0 rounded-xs font-sans text-[13px] font-medium",
                          "focus-visible:outline-none",
                          isCollapsed
                            ? "justify-center w-8 h-8 mx-auto"
                            : "gap-2 px-2.5 h-7.5",
                          pathname.startsWith("/dashboard/kelola-role")
                            ? "bg-[#C2553A] dark:bg-brand-600 text-white font-bold border-t border-l border-[#EE7257] dark:border-t-brand-400 dark:border-l-brand-400 border-b border-r border-[#6B2D20] dark:border-b-brand-900 dark:border-r-brand-900 shadow-xs"
                            : "text-[#3D352E] dark:text-zinc-300 hover:text-[#1A1816] dark:hover:text-white hover:bg-[#ECE7DF] dark:hover:bg-zinc-800/70 border border-transparent"
                        )}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        {!isCollapsed && (
                          <span className="truncate leading-snug">Kelola Hak Akses</span>
                        )}
                      </Link>

                      {isCollapsed && (
                        <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-0.5 font-sans text-[11px] font-bold bg-[#FAF8F5] dark:bg-[#18181B] border-2 border-t-[#FFFFFF] dark:border-t-[#3F3F46] border-l-[#FFFFFF] dark:border-l-[#3F3F46] border-b-[#7A756D] dark:border-b-[#09090B] border-r-[#7A756D] dark:border-r-[#09090B] text-[#1C1917] dark:text-[#F4F4F5] whitespace-nowrap shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
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
                        "relative flex items-center transition-all duration-100 flex-1 min-w-0 rounded-xs font-sans text-[13px] font-medium",
                        "focus-visible:outline-none",
                        isCollapsed
                          ? "justify-center w-8 h-8 mx-auto"
                          : "gap-2 px-2.5 h-7.5",
                        pathname.startsWith("/dashboard/peta-pengguna")
                          ? "bg-[#C2553A] dark:bg-brand-600 text-white font-bold border-t border-l border-[#EE7257] dark:border-t-brand-400 dark:border-l-brand-400 border-b border-r border-[#6B2D20] dark:border-b-brand-900 dark:border-r-brand-900 shadow-xs"
                          : "text-[#3D352E] dark:text-zinc-300 hover:text-[#1A1816] dark:hover:text-white hover:bg-[#ECE7DF] dark:hover:bg-zinc-800/70 border border-transparent"
                      )}
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate leading-snug">Peta Pengguna</span>
                      )}
                    </Link>

                    {isCollapsed && (
                      <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-0.5 font-sans text-[11px] font-bold bg-[#FAF8F5] dark:bg-[#18181B] border-2 border-t-[#FFFFFF] dark:border-t-[#3F3F46] border-l-[#FFFFFF] dark:border-l-[#3F3F46] border-b-[#7A756D] dark:border-b-[#09090B] border-r-[#7A756D] dark:border-r-[#09090B] text-[#1C1917] dark:text-[#F4F4F5] whitespace-nowrap shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        Peta Pengguna
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Desktop Footer: Notifications + Theme (when collapsed) + UserProfileMenu */}
          <div
            className={cn(
              "border-t-2 border-t-[#7A756D] dark:border-t-[#27272A] bg-[#ECE9D8] dark:bg-[#18181B] shrink-0 transition-all duration-200",
              isCollapsed ? "p-2 space-y-2 flex flex-col items-center" : "p-2.5 space-y-2"
            )}
          >
            {!isCollapsed ? (
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <NotificationCenter
                    dropdownPosition="top"
                    align="left"
                    buttonClassName="p-1 rounded-none bg-[#ECE9D8] dark:bg-[#27272A] text-[#1C1917] dark:text-[#F4F4F5] border-t border-l border-[#FFFFFF] dark:border-t-[#3F3F46] dark:border-l-[#3F3F46] border-b border-r border-[#7A756D] dark:border-b-[#09090B] dark:border-r-[#09090B] hover:bg-[#F2EFE8] dark:hover:bg-[#3F3F46]"
                  />
                  <span className="font-mono text-[10px] text-[#7A756D] dark:text-zinc-400">
                    Notifikasi
                  </span>
                </div>

                <div
                  className="flex items-center gap-1 px-1.5 py-0.5 bg-[#FAF8F5] dark:bg-[#121214] border border-[#B8B1A5] dark:border-zinc-700 text-[9px] font-mono text-emerald-700 dark:text-emerald-400 uppercase font-bold"
                  title="Sistem Terhubung"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 w-full">
                <NotificationCenter
                  dropdownPosition="top"
                  align="left"
                  buttonClassName="p-1.5 rounded-none bg-[#ECE9D8] dark:bg-[#27272A] text-[#1C1917] dark:text-[#F4F4F5] border-t border-l border-[#FFFFFF] dark:border-t-[#3F3F46] dark:border-l-[#3F3F46] border-b border-r border-[#7A756D] dark:border-b-[#09090B] dark:border-r-[#09090B] hover:bg-[#F2EFE8] dark:hover:bg-[#3F3F46]"
                />
                {mounted && (
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-1.5 font-mono text-xs bg-[#ECE9D8] dark:bg-[#27272A] text-[#1C1917] dark:text-[#F4F4F5] border-t border-l border-[#FFFFFF] dark:border-t-[#3F3F46] dark:border-l-[#3F3F46] border-b border-r border-[#7A756D] dark:border-b-[#09090B] dark:border-r-[#09090B] hover:bg-[#F2EFE8] dark:hover:bg-[#3F3F46] cursor-pointer"
                    title={resolvedTheme === "dark" ? "Mode Terang" : "Mode Gelap"}
                    aria-label="Ganti Tema"
                  >
                    {resolvedTheme === "dark" ? (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-[#853827]" />
                    )}
                  </button>
                )}
              </div>
            )}

            <UserProfileMenu variant="sidebar" isCollapsed={isCollapsed} />
          </div>
        </aside>
      )}
    </>
  );
}
