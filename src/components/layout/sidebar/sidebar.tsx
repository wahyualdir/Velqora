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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { isAdminUser, OWNER_EMAIL } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { useSurface } from "@/context/surface-context";
import { iconMap, categoryTitleMap, linkLabelMap } from "./navigation-config";

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
  const [currentQuery, setCurrentQuery] = useState("");
  const { t } = useLanguage();
  const { isApp } = useSurface();
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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

        if (email === OWNER_EMAIL.toLowerCase() || localRole === "owner") {
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

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu navigasi"
            className="px-2 py-0.5 font-mono text-xs font-bold bg-[#ECE9D8] dark:bg-[#27272A] text-[#1C1917] dark:text-[#F4F4F5] border-t border-l border-[#FFFFFF] dark:border-t-[#3F3F46] dark:border-l-[#3F3F46] border-b border-r border-[#7A756D] dark:border-b-[#09090B] dark:border-r-[#09090B] active:border-t-[#7A756D] active:border-l-[#7A756D] active:border-b-[#FFFFFF] active:border-r-[#FFFFFF] cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Mobile Navigation List (Scrollable Flat List) */}
        <nav
          aria-label="Navigasi Utama Mobile"
          className="flex-1 px-2.5 py-3 space-y-3.5 overflow-y-auto sidebar-nav-scroll overscroll-contain pb-8"
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
          {/* Desktop Header: Brand + Toggle Button */}
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

            {/* Toggle Button [ ‹ ] / [ › ] */}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Toggle sidebar"
                aria-expanded={!isCollapsed}
                className={cn(
                  "px-1.5 py-0.5 font-mono text-xs font-bold bg-[#ECE9D8] dark:bg-[#27272A] text-[#1C1917] dark:text-[#F4F4F5] border-t border-l border-[#FFFFFF] dark:border-t-[#3F3F46] dark:border-l-[#3F3F46] border-b border-r border-[#7A756D] dark:border-b-[#09090B] dark:border-r-[#09090B] hover:bg-[#F2EFE8] dark:hover:bg-[#3F3F46] active:border-t-[#7A756D] active:border-l-[#7A756D] active:border-b-[#FFFFFF] active:border-r-[#FFFFFF] transition-colors cursor-pointer",
                  isCollapsed && "hidden"
                )}
                title="Kecilkan Sidebar (Collapse)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
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
                className="w-full flex items-center justify-center h-6 font-mono text-xs bg-[#ECE9D8] dark:bg-[#27272A] text-[#1C1917] dark:text-[#F4F4F5] border-t border-l border-[#FFFFFF] dark:border-t-[#3F3F46] dark:border-l-[#3F3F46] border-b border-r border-[#7A756D] dark:border-b-[#09090B] dark:border-r-[#09090B] hover:bg-[#F2EFE8] dark:hover:bg-[#3F3F46] active:border-t-[#7A756D] active:border-l-[#7A756D] active:border-b-[#FFFFFF] active:border-r-[#FFFFFF] cursor-pointer"
                title="Buka Penuh Sidebar (Expand)"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
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
        </aside>
      )}
    </>
  );
}
