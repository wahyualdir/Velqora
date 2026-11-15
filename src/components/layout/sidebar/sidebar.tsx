"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SIDEBAR_CATEGORIES, NavItem } from "@/lib/constants";
import {
  ChevronRight,
  Crown,
  ShieldCheck,
  MapPin,
  Search,
  Command,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { UserProfileMenu } from "@/components/layout/user-profile-menu";
import { NotificationCenter } from "@/components/layout/notification-center";
import { isAdminUser, isOwnerUser } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { useSurface } from "@/context/surface-context";
import { iconMap, categoryTitleMap, linkLabelMap } from "./navigation-config";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDrawer?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenCommandPalette?: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  onOpenDrawer,
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
      {/* ─── 1. MOBILE & TABLET DRAWER BACKDROP OVERLAY ─── */}
      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/60 backdrop-blur-xs animate-fade-in",
            !isApp && "lg:hidden"
          )}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ─── 2. MOBILE & TABLET DRAWER SIDEBAR ─── */}
      <aside
        aria-label="Sidebar Mobile Drawer"
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 w-[min(88vw,300px)] bg-[#FAF8F5] dark:bg-[#100E0D] border-r border-[#E4DDD4] dark:border-[#292524] shadow-2xl",
          "flex flex-col transition-transform duration-200 ease-out select-none pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]",
          !isApp && "lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Header */}
        <div className="h-12 px-3.5 border-b border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between shrink-0 bg-[#F3EFE9]/75 dark:bg-[#141210]">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2 focus-visible:outline-none rounded-lg p-0.5"
          >
            <Logo variant="sidebar" />
          </Link>

          <div className="flex items-center gap-1.5">
            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="vt-btn-chrome w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
                title={resolvedTheme === "dark" ? "Mode Terang (Light)" : "Mode Gelap (Dark)"}
                aria-label="Ganti Tema"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="w-3.5 h-3.5 text-[#E5C194]" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-[#C2553A]" />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup menu navigasi"
              className="vt-btn-chrome w-7 h-7 rounded-lg flex items-center justify-center font-mono text-sm cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>

        {/* Mobile Search Button */}
        {onOpenCommandPalette && (
          <div className="px-3 pt-2.5 pb-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCommandPalette();
              }}
              className="w-full flex items-center justify-between gap-2 px-3 h-8.5 rounded-xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] text-[#8A8378] dark:text-[#8C857F] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] hover:border-[#C2553A]/40 dark:hover:border-[#D4664A]/40 transition-colors text-xs font-mono text-left cursor-pointer"
              title="Pencarian Cepat (Ctrl + K)"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Cari materi, modul...</span>
              </div>
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-[#E4DDD4] dark:border-[#292524] bg-[#F3EFE9] dark:bg-[#1C1917] text-[9.5px] font-mono shrink-0 text-[#524B42] dark:text-[#A8A29E]">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </button>
          </div>
        )}

        {/* Mobile Navigation List (Scrollable Flat List) */}
        <nav
          aria-label="Navigasi Utama Mobile"
          className="flex-1 px-2.5 py-3 space-y-4 overflow-y-auto sidebar-nav-scroll overscroll-contain pb-4"
        >
          {SIDEBAR_CATEGORIES.map((category) => {
            const catKey = categoryTitleMap[category.title];
            const translatedCatTitle =
              catKey && t(catKey) && t(catKey) !== catKey ? t(catKey) : category.title;

            return (
              <div key={category.title} className="space-y-1">
                <div className="px-2.5 pt-1 pb-0.5 font-mono text-[10px] font-semibold text-[#8A8378] dark:text-[#8C857F] uppercase tracking-wider">
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
                            "group flex items-center rounded-lg transition-all duration-150",
                            isActive
                              ? "bg-[#C2553A] text-[#FFFBF8] shadow-xs border border-[#D4664A]/40"
                              : "text-[#524B42] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] hover:bg-[#EFECE6] dark:hover:bg-[#1C1917] border border-transparent font-medium"
                          )}
                        >
                          <Link
                            href={link.href}
                            onClick={onClose}
                            aria-current={isActive ? "page" : undefined}
                            className="flex items-center gap-2.5 px-2.5 h-8.5 flex-1 min-w-0 focus-visible:outline-none"
                          >
                            {Icon && (
                              <Icon
                                className={cn(
                                  "w-4 h-4 shrink-0 transition-colors",
                                  isActive
                                    ? "text-[#FFFBF8]"
                                    : isAiItem
                                    ? "text-[#C2553A] dark:text-[#D4664A]"
                                    : "text-[#8A8378] dark:text-[#8C857F] group-hover:text-[#1C1917] dark:group-hover:text-[#F5F5F4]"
                                )}
                              />
                            )}
                            <span className="truncate flex-1 font-sans text-[13px] font-medium leading-none">
                              {translatedLabel}
                            </span>
                            {isAiItem && !isActive && (
                              <span className="px-1.5 py-0.5 text-[8.5px] font-mono font-semibold bg-[#FAF3EF] dark:bg-[#D4664A]/12 text-[#C2553A] dark:text-[#D4664A] border border-[#C2553A]/25 dark:border-[#D4664A]/30 rounded-md">
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
            <div className="pt-3 border-t border-[#E4DDD4] dark:border-[#292524] space-y-1">
              <div className="px-2.5 pb-1 font-mono text-[10px] font-semibold text-[#C2553A] dark:text-[#D4664A] flex items-center justify-between uppercase tracking-wider">
                <span>{isOwner ? "Administrasi (Pemilik)" : "Administrasi"}</span>
                <Crown className="w-3 h-3 text-[#C2553A] dark:text-[#D4664A]" />
              </div>

              <div className="space-y-0.5">
                {isOwner && (
                  <Link
                    href="/dashboard/kelola-role"
                    onClick={onClose}
                    aria-current={pathname.startsWith("/dashboard/kelola-role") ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 h-8.5 font-sans text-[13px] font-medium transition-colors rounded-lg",
                      "focus-visible:outline-none",
                      pathname.startsWith("/dashboard/kelola-role")
                        ? "bg-[#C2553A] text-[#FFFBF8] font-semibold border border-[#D4664A]/40 shadow-xs"
                        : "text-[#524B42] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] hover:bg-[#EFECE6] dark:hover:bg-[#1C1917] border border-transparent"
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
                    "flex items-center gap-2.5 px-2.5 h-8.5 font-sans text-[13px] font-medium transition-colors rounded-lg",
                    "focus-visible:outline-none",
                    pathname.startsWith("/dashboard/peta-pengguna")
                      ? "bg-[#C2553A] text-[#FFFBF8] font-semibold border border-[#D4664A]/40 shadow-xs"
                      : "text-[#524B42] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] hover:bg-[#EFECE6] dark:hover:bg-[#1C1917] border border-transparent"
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
        <div className="p-3 border-t border-[#E4DDD4] dark:border-[#292524] bg-[#F3EFE9]/75 dark:bg-[#141210] shrink-0 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <NotificationCenter
                dropdownPosition="top"
                align="left"
                buttonClassName="vt-btn-chrome p-1.5 rounded-lg"
              />
              <span className="font-mono text-[10px] text-[#8A8378] dark:text-[#8C857F]">
                Notifikasi
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FFFFFF] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] text-[9.5px] font-mono text-emerald-700 dark:text-[#34D399] uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#34D399]" />
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
            "hidden lg:flex fixed top-0 left-0 z-30 h-dvh bg-[#FAF8F5] dark:bg-[#100E0D] border-r border-[#E4DDD4] dark:border-[#292524] select-none",
            "flex-col transition-all duration-200 ease-out",
            isCollapsed ? "w-[68px]" : "w-[245px]"
          )}
        >
          {/* Desktop Header: Brand Aligned flush with DesktopTopBar (h-14) */}
          <div
            className={cn(
              "h-14 px-3.5 border-b border-[#E4DDD4] dark:border-[#292524] flex items-center shrink-0 bg-[#FAF8F5] dark:bg-[#100E0D] transition-all duration-200",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-2 focus-visible:outline-none rounded-lg p-0.5 min-w-0 overflow-hidden",
                isCollapsed && "justify-center"
              )}
              title="Velqora — Portal Akademik Terpadu"
            >
              <Logo variant="sidebar" hideText={isCollapsed} />
            </Link>
          </div>

          {/* Toggle Expand Bar when Collapsed */}
          {isCollapsed && onToggleCollapse && (
            <div className="px-2 pt-2.5 shrink-0">
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Toggle sidebar"
                aria-expanded={!isCollapsed}
                className="vt-btn-chrome w-full flex items-center justify-center h-7.5 rounded-lg cursor-pointer"
                title="Buka Penuh Sidebar (Expand)"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Compact Search Trigger only when Collapsed (Expanded mode uses DesktopTopBar Spotlight Search) */}
          {isCollapsed && onOpenCommandPalette && (
            <div className="px-2 pt-2 shrink-0">
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="w-8.5 h-8.5 mx-auto rounded-xl flex items-center justify-center bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] text-[#8A8378] dark:text-[#8C857F] hover:text-[#C2553A] dark:hover:text-[#D4664A] hover:border-[#C2553A]/40 dark:hover:border-[#D4664A]/40 transition-colors cursor-pointer"
                title="Pencarian Cepat (Ctrl + K)"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Desktop Navigation List (Clean Editorial Academic Portal Grouping) */}
          <nav
            aria-label="Navigasi Utama Desktop"
            className="flex-1 px-3 py-3.5 space-y-4 overflow-y-auto sidebar-nav-scroll overscroll-contain"
          >
            {SIDEBAR_CATEGORIES.map((category) => {
              const catKey = categoryTitleMap[category.title];
              const translatedCatTitle =
                catKey && t(catKey) && t(catKey) !== catKey ? t(catKey) : category.title;
              const isTopPrimaryGroup = category.title === "Utama";

              return (
                <div key={category.title} className="space-y-1">
                  {/* Category Header (omit redundant label on top primary group to match reference cleanly) */}
                  {!isCollapsed && !isTopPrimaryGroup && (
                    <div className="px-2.5 pt-1 pb-1 font-mono text-[10px] font-bold text-[#8A8378] dark:text-[#8C857F] uppercase tracking-[0.14em]">
                      {translatedCatTitle}
                    </div>
                  )}

                  {/* Menu Items */}
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
                              "flex items-center rounded-xl transition-all duration-150",
                              isActive
                                ? "bg-[#C2553A] dark:bg-[#D4664A] text-[#FFFBF8] shadow-xs font-semibold"
                                : "text-[#524B42] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] hover:bg-[#EFECE6] dark:hover:bg-[#1C1917] font-medium"
                            )}
                          >
                            <Link
                              href={link.href}
                              aria-current={isActive ? "page" : undefined}
                              className={cn(
                                "relative flex items-center transition-all duration-150 flex-1 min-w-0 focus-visible:outline-none",
                                isCollapsed
                                  ? "justify-center w-9 h-9 mx-auto"
                                  : "gap-2.5 px-3 h-9"
                              )}
                            >
                              {Icon && (
                                <Icon
                                  className={cn(
                                    "w-4 h-4 shrink-0 transition-colors",
                                    isActive
                                      ? "text-[#FFFBF8]"
                                      : isAiItem
                                      ? "text-[#C2553A] dark:text-[#D4664A]"
                                      : "text-[#8A8378] dark:text-[#8C857F] group-hover:text-[#1C1917] dark:group-hover:text-[#F5F5F4]"
                                  )}
                                />
                              )}

                              {!isCollapsed && (
                                <span
                                  className={cn(
                                    "truncate flex-1 font-sans text-[13px] leading-none",
                                    isActive ? "font-semibold" : "font-medium"
                                  )}
                                >
                                  {translatedLabel}
                                </span>
                              )}

                              {isAiItem && !isActive && !isCollapsed && (
                                <span className="px-1.5 py-0.5 text-[8.5px] font-mono font-semibold bg-[#FAF3EF] dark:bg-[#D4664A]/12 text-[#C2553A] dark:text-[#D4664A] border border-[#C2553A]/25 dark:border-[#D4664A]/30 rounded-md">
                                  AI
                                </span>
                              )}
                            </Link>
                          </div>

                          {/* Collapsed Tooltip on Hover */}
                          {isCollapsed && (
                            <div className="pointer-events-none group-hover:pointer-events-auto absolute left-full top-1/2 -translate-y-1/2 ml-2.5 px-3 py-1.5 rounded-lg bg-[#FFFFFF] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] text-[#1C1917] dark:text-[#F5F5F4] text-xs font-sans font-semibold shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap flex items-center gap-2">
                              <span>{translatedLabel}</span>
                              {isAiItem && (
                                <span className="px-1.5 py-0.5 text-[8.5px] font-mono bg-[#FAF3EF] dark:bg-[#D4664A]/12 text-[#C2553A] dark:text-[#D4664A] rounded-md">
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
              <div className="pt-2.5 border-t border-[#E4DDD4] dark:border-[#292524] space-y-1">
                {!isCollapsed && (
                  <div className="px-2.5 pb-0.5 font-mono text-[10px] font-bold text-[#C2553A] dark:text-[#D4664A] uppercase tracking-[0.14em] flex items-center justify-between">
                    <span>{isOwner ? "Administrasi (Pemilik)" : "Administrasi"}</span>
                    <Crown className="w-3 h-3 text-[#C2553A] dark:text-[#D4664A]" />
                  </div>
                )}

                <div className="space-y-0.5">
                  {isOwner && (
                    <div className="relative group">
                      <Link
                        href="/dashboard/kelola-role"
                        aria-current={pathname.startsWith("/dashboard/kelola-role") ? "page" : undefined}
                        className={cn(
                          "relative flex items-center transition-all duration-150 flex-1 min-w-0 rounded-xl font-sans text-[13px]",
                          "focus-visible:outline-none",
                          isCollapsed
                            ? "justify-center w-9 h-9 mx-auto"
                            : "gap-2.5 px-3 h-9",
                          pathname.startsWith("/dashboard/kelola-role")
                            ? "bg-[#C2553A] dark:bg-[#D4664A] text-[#FFFBF8] font-semibold shadow-xs"
                            : "text-[#524B42] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] hover:bg-[#EFECE6] dark:hover:bg-[#1C1917] font-medium"
                        )}
                      >
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        {!isCollapsed && (
                          <span className="truncate leading-snug">Kelola Hak Akses</span>
                        )}
                      </Link>

                      {isCollapsed && (
                        <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2.5 px-2.5 py-1 rounded-lg font-sans text-xs font-semibold bg-[#FFFFFF] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] text-[#1C1917] dark:text-[#F5F5F4] whitespace-nowrap shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
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
                        "relative flex items-center transition-all duration-150 flex-1 min-w-0 rounded-xl font-sans text-[13px]",
                        "focus-visible:outline-none",
                        isCollapsed
                          ? "justify-center w-9 h-9 mx-auto"
                          : "gap-2.5 px-3 h-9",
                        pathname.startsWith("/dashboard/peta-pengguna")
                          ? "bg-[#C2553A] dark:bg-[#D4664A] text-[#FFFBF8] font-semibold shadow-xs"
                          : "text-[#524B42] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] hover:bg-[#EFECE6] dark:hover:bg-[#1C1917] font-medium"
                      )}
                    >
                      <MapPin className="w-4 h-4 shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate leading-snug">Peta Pengguna</span>
                      )}
                    </Link>

                    {isCollapsed && (
                      <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2.5 px-2.5 py-1 rounded-lg font-sans text-xs font-semibold bg-[#FFFFFF] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] text-[#1C1917] dark:text-[#F5F5F4] whitespace-nowrap shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        Peta Pengguna
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Desktop Footer: Contained Academic Profile Card (compact rail retains notification & theme controls) */}
          <div
            className={cn(
              "border-t border-[#E4DDD4] dark:border-[#292524] bg-[#FAF8F5] dark:bg-[#100E0D] shrink-0 transition-all duration-200",
              isCollapsed ? "p-2 space-y-2 flex flex-col items-center" : "p-3"
            )}
          >
            {isCollapsed && (
              <div className="flex flex-col items-center gap-1.5 w-full">
                <NotificationCenter
                  dropdownPosition="top"
                  align="left"
                  buttonClassName="vt-btn-chrome p-1.5 rounded-lg"
                />
                {mounted && (
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="vt-btn-chrome p-1.5 rounded-lg cursor-pointer"
                    title={resolvedTheme === "dark" ? "Mode Terang" : "Mode Gelap"}
                    aria-label="Ganti Tema"
                  >
                    {resolvedTheme === "dark" ? (
                      <Sun className="w-3.5 h-3.5 text-[#E5C194]" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-[#C2553A]" />
                    )}
                  </button>
                )}
              </div>
            )}

            <UserProfileMenu variant="sidebar" isCollapsed={isCollapsed} />
          </div>
        </aside>
      )}

      {/* ─── 4. COMPACT TABLET & PWA NAVIGATION RAIL (768px–1023px & Standalone PWA >=768px) ─── */}
      <aside
        aria-label="Sidebar Tablet Rail"
        className={cn(
          "hidden md:flex fixed top-0 left-0 z-30 h-dvh w-[68px] bg-[#FAF8F5] dark:bg-[#100E0D] border-r border-[#E4DDD4] dark:border-[#292524] select-none",
          "flex-col items-center justify-between pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]",
          !isApp && "lg:hidden"
        )}
      >
        <div className="w-full px-2 py-2.5 border-b border-[#E4DDD4] dark:border-[#292524] flex flex-col items-center gap-2 shrink-0 bg-[#F3EFE9]/75 dark:bg-[#141210]">
          <Link
            href="/dashboard"
            className="flex items-center justify-center rounded-lg p-1 focus-visible:outline-none"
            title="Velqora Dashboard"
          >
            <Logo variant="sidebar" hideText />
          </Link>

          {onOpenDrawer && (
            <button
              type="button"
              onClick={onOpenDrawer}
              aria-label="Buka menu navigasi lengkap"
              title="Buka Menu Lengkap"
              className="vt-btn-chrome w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Pencarian cepat"
              title="Pencarian Cepat (Ctrl + K)"
              className="vt-btn-chrome w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
        </div>

        <nav
          aria-label="Navigasi Tablet Compact"
          className="flex-1 w-full px-2 py-2.5 space-y-1.5 overflow-y-auto sidebar-nav-scroll flex flex-col items-center"
        >
          {SIDEBAR_CATEGORIES.flatMap((category) => category.links).map((link) => {
            const Icon = iconMap[link.icon];
            const isActive = isLinkActive(link);
            const linkKey = linkLabelMap[link.label];
            const translatedLabel =
              linkKey && t(linkKey) && t(linkKey) !== linkKey ? t(linkKey) : link.label;

            return (
              <Link
                key={link.href}
                href={link.href}
                title={translatedLabel}
                aria-label={translatedLabel}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center transition-all shrink-0",
                  isActive
                    ? "bg-[#C2553A] text-[#FFFBF8] shadow-xs border border-[#D4664A]/40"
                    : "text-[#524B42] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] hover:bg-[#EFECE6] dark:hover:bg-[#1C1917]"
                )}
              >
                {Icon && <Icon className="w-[18px] h-[18px]" />}
              </Link>
            );
          })}
        </nav>

        <div className="w-full px-2 py-2.5 border-t border-[#E4DDD4] dark:border-[#292524] flex flex-col items-center gap-2 shrink-0 bg-[#F3EFE9]/60 dark:bg-[#141210]">
          <NotificationCenter
            dropdownPosition="top"
            align="left"
            buttonClassName="vt-btn-chrome w-10 h-10 rounded-xl flex items-center justify-center"
          />
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="vt-btn-chrome w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
              title={resolvedTheme === "dark" ? "Mode Terang (Light)" : "Mode Gelap (Dark)"}
              aria-label="Ganti Tema"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 text-[#E5C194]" />
              ) : (
                <Moon className="w-4 h-4 text-[#C2553A]" />
              )}
            </button>
          )}
          <UserProfileMenu variant="sidebar" isCollapsed />
        </div>
      </aside>
    </>
  );
}
