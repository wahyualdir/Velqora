"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, ChevronRight } from "lucide-react";
import { SIDEBAR_CATEGORIES } from "@/lib/constants";
import { iconMap, categoryTitleMap, linkLabelMap } from "@/components/layout/sidebar/navigation-config";
import { MobileBottomSheet } from "./mobile-bottom-sheet";
import { useExperience } from "@/context/experience-context";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

export interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { canInstallPwa, promptInstallPwa, isPwaStandalone } = useExperience();
  const [currentQuery, setCurrentQuery] = useState("");

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

  const isItemActive = (href: string) => {
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
    return pathname === href || pathname.startsWith(href + "/");
  };

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
      <div className="space-y-4 pt-1 pb-4">
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

        {/* Categories & Items dynamically driven by SIDEBAR_CATEGORIES */}
        {SIDEBAR_CATEGORIES.map((category) => {
          const catKey = categoryTitleMap[category.title];
          const translatedCatTitle =
            catKey && t(catKey) && t(catKey) !== catKey ? t(catKey) : category.title;

          return (
            <div key={category.title} className="space-y-1.5">
              <h3 className="px-2 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider font-mono">
                {translatedCatTitle}
              </h3>

              <div className="space-y-1">
                {category.links.map((item) => {
                  const Icon = iconMap[item.icon];
                  const isActive = isItemActive(item.href);
                  const linkKey = linkLabelMap[item.label];
                  const translatedLabel =
                    linkKey && t(linkKey) && t(linkKey) !== linkKey
                      ? t(linkKey)
                      : item.label;

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
                          {Icon && <Icon className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold leading-tight truncate">
                              {translatedLabel}
                            </span>
                            {item.isAi && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-brand-500/15 text-brand-400 font-bold">
                                AI
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-text-tertiary shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </MobileBottomSheet>
  );
}
