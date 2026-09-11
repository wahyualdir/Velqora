"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { getMobilePrimaryNavItems } from "@/lib/constants";
import { iconMap, linkLabelMap } from "@/components/layout/sidebar/navigation-config";
import { useLanguage } from "@/context/language-context";
import { MobileMenuDrawer } from "./mobile-menu-drawer";

interface MobileBottomNavProps {
  onToggleSidebar?: () => void;
}

export function MobileBottomNav({ onToggleSidebar }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");

  const primaryNavItems = getMobilePrimaryNavItems();

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

  const isItemActive = (href: string, exact?: boolean) => {
    const searchParams = new URLSearchParams(currentQuery);
    if (href.includes("?")) {
      const [path, query] = href.split("?");
      if (pathname !== path) return false;
      const [qKey, qVal] = query.split("=");
      return searchParams.get(qKey) === qVal;
    }
    if (href === "/dashboard/modul" && searchParams.get("mode") === "project") {
      return false;
    }
    return exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  };

  const handleMenuClick = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    } else {
      setMenuOpen(true);
    }
  };

  return (
    <>
      <nav
        aria-label="Navigasi Mobile Utama"
        className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border lg:hidden px-2 pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-xl select-none"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {primaryNavItems.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = isItemActive(item.href, item.exact);
            const linkKey = linkLabelMap[item.label];
            const translatedLabel =
              linkKey && t(linkKey) && t(linkKey) !== linkKey ? t(linkKey) : item.label;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-lg text-[10.5px] font-medium transition-all duration-150 active:scale-95 cursor-pointer",
                  isActive
                    ? "text-brand-600 bg-brand-500/10 border border-brand-500/25 font-bold"
                    : "text-text-secondary hover:text-text-primary border border-transparent font-medium"
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-transform",
                      isActive ? "text-brand-600 scale-105" : "text-text-secondary"
                    )}
                  />
                )}
                <span className="truncate max-w-[64px] font-sans mt-0.5">{translatedLabel}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleMenuClick}
            className="flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-lg text-[10.5px] font-medium text-text-secondary hover:text-text-primary active:scale-95 transition-all duration-150 border border-transparent hover:bg-surface-secondary cursor-pointer"
          >
            <Menu className="w-4 h-4 shrink-0 text-text-secondary" />
            <span className="font-sans mt-0.5">Menu</span>
          </button>
        </div>
      </nav>

      {/* Embedded Mobile Menu Drawer */}
      <MobileMenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
