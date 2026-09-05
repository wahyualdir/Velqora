"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SIDEBAR_CATEGORIES } from "@/lib/constants";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
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
  const { t } = useLanguage();
  const { isApp } = useSurface();
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
          "fixed top-0 left-0 bottom-0 z-50 w-[min(88vw,290px)] bg-[#FAF8F5] border-r-2 border-r-[#7A756D] border-l-2 border-l-[#FFFFFF] shadow-2xl lg:hidden",
          "flex flex-col transition-transform duration-200 ease-out select-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Header: Retro Window Titlebar */}
        <div className="h-11 px-3 border-b-2 border-b-[#7A756D] flex items-center justify-between shrink-0 bg-[#ECE9D8]">
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
            className="px-2 py-0.5 font-mono text-xs font-bold bg-[#ECE9D8] text-[#1C1917] border-t border-l border-[#FFFFFF] border-b border-r border-[#7A756D] active:border-t-[#7A756D] active:border-l-[#7A756D] active:border-b-[#FFFFFF] active:border-r-[#FFFFFF] cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Mobile Navigation List (Scrollable) */}
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
                <div className="px-2 pb-1 font-mono text-[10px] font-bold text-[#853827] uppercase tracking-wider">
                  {translatedCatTitle}
                </div>

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
                      <div key={link.href} className="space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Link
                            href={link.href}
                            onClick={onClose}
                            aria-current={isParentExact ? "page" : undefined}
                            className={cn(
                              "flex items-center gap-2.5 px-2.5 h-8.5 font-mono text-xs transition-colors flex-1 min-w-0 rounded-none",
                              "focus-visible:outline-none",
                              isActive
                                ? "bg-[#C2553A] text-white font-bold border-t border-l border-[#EE7257] border-b border-r border-[#6B2D20] shadow-xs"
                                : "text-[#2D2823] hover:text-[#1A1816] hover:bg-[#ECE7DF] border border-transparent font-medium"
                            )}
                          >
                            {Icon && (
                              <Icon
                                className={cn(
                                  "w-3.5 h-3.5 shrink-0",
                                  isActive
                                    ? "text-white"
                                    : isAiItem
                                    ? "text-[#C2553A]"
                                    : "text-[#7A756D]"
                                )}
                              />
                            )}
                            <span className="truncate flex-1">{translatedLabel}</span>
                            {isAiItem && !isActive && (
                              <span className="px-1 py-0.2 text-[9px] font-mono font-bold bg-[#C2553A]/10 text-[#C2553A] border border-[#C2553A]/30">
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
                              className="p-1.5 font-mono text-xs bg-[#ECE9D8] text-[#1C1917] border-t border-l border-[#FFFFFF] border-b border-r border-[#7A756D] cursor-pointer"
                            >
                              <ChevronDown
                                className={cn(
                                  "w-3 h-3 transition-transform duration-200",
                                  isExpanded && "rotate-180 text-[#C2553A]"
                                )}
                              />
                            </button>
                          )}
                        </div>

                        {/* Accordion Submenu Items */}
                        {hasSubItems && isExpanded && (
                          <div className="ml-4 pl-2 border-l border-[#7A756D]/40 space-y-0.5 py-0.5 animate-fade-in">
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
                                    "flex items-center gap-2 px-2 h-7 font-mono text-[11px] transition-colors rounded-none",
                                    "focus-visible:outline-none",
                                    isSubActive
                                      ? "bg-[#C2553A]/15 text-[#853827] font-bold border-l-2 border-[#C2553A]"
                                      : "text-[#524B42] hover:text-[#1A1816] hover:bg-[#ECE7DF] font-normal"
                                  )}
                                >
                                  {SubIcon && (
                                    <SubIcon
                                      className={cn(
                                        "w-3 h-3 shrink-0",
                                        isSubActive
                                          ? "text-[#C2553A]"
                                          : "text-[#7A756D]"
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
            <div className="pt-2.5 border-t border-[#7A756D]/40 space-y-1">
              <div className="px-2 pb-1 font-mono text-[10px] font-bold text-[#C2553A] flex items-center justify-between uppercase tracking-wider">
                <span>{isOwner ? "Administrasi (Pemilik)" : "Administrasi"}</span>
                <Crown className="w-3 h-3 text-[#C2553A]" />
              </div>

              <div className="space-y-0.5">
                {isOwner && (
                  <Link
                    href="/dashboard/kelola-role"
                    onClick={onClose}
                    aria-current={pathname.startsWith("/dashboard/kelola-role") ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 h-8.5 font-mono text-xs transition-colors rounded-none",
                      "focus-visible:outline-none",
                      pathname.startsWith("/dashboard/kelola-role")
                        ? "bg-[#C2553A] text-white font-bold border-t border-l border-[#EE7257] border-b border-r border-[#6B2D20] shadow-xs"
                        : "text-[#2D2823] hover:text-[#1A1816] hover:bg-[#ECE7DF] border border-transparent font-medium"
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
                    "flex items-center gap-2.5 px-2.5 h-8.5 font-mono text-xs transition-colors rounded-none",
                    "focus-visible:outline-none",
                    pathname.startsWith("/dashboard/peta-pengguna")
                      ? "bg-[#C2553A] text-white font-bold border-t border-l border-[#EE7257] border-b border-r border-[#6B2D20] shadow-xs"
                      : "text-[#2D2823] hover:text-[#1A1816] hover:bg-[#ECE7DF] border border-transparent font-medium"
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
            "hidden lg:flex fixed top-0 left-0 z-30 h-screen bg-[#FAF8F5] border-r-2 border-r-[#7A756D] border-l-2 border-l-[#FFFFFF] select-none",
            "flex-col transition-all duration-200 ease-out shadow-xs",
            isCollapsed ? "w-[64px]" : "w-[245px]"
          )}
        >
        {/* Desktop Header: Brand + Toggle Button */}
        <div
          className={cn(
            "h-11 px-3 border-b-2 border-b-[#7A756D] flex items-center shrink-0 bg-[#ECE9D8] transition-all duration-200",
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
                "px-1.5 py-0.5 font-mono text-xs font-bold bg-[#ECE9D8] text-[#1C1917] border-t border-l border-[#FFFFFF] border-b border-r border-[#7A756D] hover:bg-[#F2EFE8] active:border-t-[#7A756D] active:border-l-[#7A756D] active:border-b-[#FFFFFF] active:border-r-[#FFFFFF] transition-colors cursor-pointer",
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
              className="w-full flex items-center justify-center h-6 font-mono text-xs bg-[#ECE9D8] text-[#1C1917] border-t border-l border-[#FFFFFF] border-b border-r border-[#7A756D] hover:bg-[#F2EFE8] active:border-t-[#7A756D] active:border-l-[#7A756D] active:border-b-[#FFFFFF] active:border-r-[#FFFFFF] cursor-pointer"
              title="Buka Penuh Sidebar (Expand)"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Desktop Navigation List */}
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
                  <div className="px-2 pb-0.5 font-mono text-[9.5px] font-bold text-[#853827] uppercase tracking-wider">
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
                              "relative flex items-center transition-all duration-100 font-mono text-xs flex-1 min-w-0 rounded-none",
                              "focus-visible:outline-none",
                              isCollapsed
                                ? "justify-center w-8 h-8 mx-auto"
                                : "gap-2 px-2 h-7.5",
                              isActive
                                ? "bg-[#C2553A] text-white font-bold border-t border-l border-[#EE7257] border-b border-r border-[#6B2D20] shadow-xs"
                                : "text-[#3D352E] hover:text-[#1A1816] hover:bg-[#ECE7DF] border border-transparent font-medium"
                            )}
                          >
                            {Icon && (
                              <Icon
                                className={cn(
                                  "w-3.5 h-3.5 shrink-0 transition-colors",
                                  isActive
                                    ? "text-white"
                                    : isAiItem
                                    ? "text-[#C2553A]"
                                    : "text-[#7A756D]"
                                )}
                              />
                            )}

                            {!isCollapsed && (
                              <span className="truncate flex-1 leading-snug">
                                {translatedLabel}
                              </span>
                            )}

                            {isAiItem && !isActive && !isCollapsed && (
                              <span className="px-1 py-0.2 text-[8px] font-mono font-bold bg-[#C2553A]/10 text-[#C2553A] border border-[#C2553A]/30">
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
                              className="p-1 font-mono text-xs bg-[#ECE9D8] text-[#1C1917] border border-[#7A756D]/40 hover:bg-[#F2EFE8] cursor-pointer ml-0.5"
                            >
                              <ChevronDown
                                className={cn(
                                  "w-3 h-3 transition-transform duration-200",
                                  isExpanded && "rotate-180 text-[#C2553A]"
                                )}
                              />
                            </button>
                          )}
                        </div>

                        {/* Accordion Sub-items (Desktop Expanded) */}
                        {hasSubItems && !isCollapsed && isExpanded && (
                          <div className="ml-3 pl-2 border-l border-[#7A756D]/40 space-y-0.5 py-0.5 animate-fade-in">
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
                                    "flex items-center gap-1.5 px-1.5 h-6 font-mono text-[11px] transition-colors rounded-none",
                                    "focus-visible:outline-none",
                                    isSubActive
                                      ? "bg-[#C2553A]/15 text-[#853827] font-bold border-l-2 border-[#C2553A]"
                                      : "text-[#524B42] hover:text-[#1A1816] hover:bg-[#ECE7DF] font-normal"
                                  )}
                                >
                                  {SubIcon && (
                                    <SubIcon
                                      className={cn(
                                        "w-3 h-3 shrink-0",
                                        isSubActive
                                          ? "text-[#C2553A]"
                                          : "text-[#7A756D]"
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
                          <div className="pointer-events-none group-hover:pointer-events-auto absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 rounded-none bg-[#FAF8F5] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-b-[#7A756D] border-r-[#7A756D] text-[#1C1917] text-xs font-mono font-bold shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 min-w-[170px] space-y-1.5">
                            <div className="font-bold border-b border-[#7A756D]/30 pb-1 text-[#1C1917] flex items-center justify-between">
                              <span>{translatedLabel}</span>
                              {isAiItem && (
                                <span className="px-1 py-0.2 text-[8px] font-mono bg-[#C2553A]/10 text-[#C2553A]">
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
                                        "flex items-center gap-1.5 px-1.5 py-0.5 text-[11px] font-mono transition-colors",
                                        isSubActive
                                          ? "bg-[#C2553A]/15 text-[#853827] font-bold"
                                          : "text-[#524B42] hover:text-[#1A1816] hover:bg-[#ECE7DF]"
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
            <div className="pt-2 border-t border-[#7A756D]/40 space-y-1">
              {!isCollapsed && (
                <div className="px-2 pb-0.5 font-mono text-[9.5px] font-bold text-[#C2553A] uppercase tracking-wider flex items-center justify-between">
                  <span>{isOwner ? "Administrasi (Pemilik)" : "Administrasi"}</span>
                  <Crown className="w-3 h-3 text-[#C2553A]" />
                </div>
              )}

              <div className="space-y-0.5">
                {isOwner && (
                  <div className="relative group">
                    <Link
                      href="/dashboard/kelola-role"
                      aria-current={pathname.startsWith("/dashboard/kelola-role") ? "page" : undefined}
                      className={cn(
                        "relative flex items-center transition-all duration-100 font-mono text-xs flex-1 min-w-0 rounded-none",
                        "focus-visible:outline-none",
                        isCollapsed
                          ? "justify-center w-8 h-8 mx-auto"
                          : "gap-2 px-2 h-7.5",
                        pathname.startsWith("/dashboard/kelola-role")
                          ? "bg-[#C2553A] text-white font-bold border-t border-l border-[#EE7257] border-b border-r border-[#6B2D20] shadow-xs"
                          : "text-[#3D352E] hover:text-[#1A1816] hover:bg-[#ECE7DF] border border-transparent font-medium"
                      )}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate leading-snug">Kelola Hak Akses</span>
                      )}
                    </Link>

                    {isCollapsed && (
                      <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-0.5 font-mono text-[11px] font-bold bg-[#FAF8F5] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-b-[#7A756D] border-r-[#7A756D] text-[#1C1917] whitespace-nowrap shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
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
                      "relative flex items-center transition-all duration-100 font-mono text-xs flex-1 min-w-0 rounded-none",
                      "focus-visible:outline-none",
                      isCollapsed
                        ? "justify-center w-8 h-8 mx-auto"
                        : "gap-2 px-2 h-7.5",
                      pathname.startsWith("/dashboard/peta-pengguna")
                        ? "bg-[#C2553A] text-white font-bold border-t border-l border-[#EE7257] border-b border-r border-[#6B2D20] shadow-xs"
                        : "text-[#3D352E] hover:text-[#1A1816] hover:bg-[#ECE7DF] border border-transparent font-medium"
                    )}
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate leading-snug">Peta Pengguna</span>
                    )}
                  </Link>

                  {isCollapsed && (
                    <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-0.5 font-mono text-[11px] font-bold bg-[#FAF8F5] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-b-[#7A756D] border-r-[#7A756D] text-[#1C1917] whitespace-nowrap shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
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
