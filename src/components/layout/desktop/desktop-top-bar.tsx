"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Command, Crown, Download, CheckCircle2, Menu } from "lucide-react";
import { UserProfileMenu } from "@/components/layout/user-profile-menu";
import { NotificationCenter } from "@/components/layout/notification-center";
import { useExperience } from "@/context/experience-context";
import { useLanguage } from "@/context/language-context";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser, cn } from "@/lib/utils";

interface DesktopTopBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenCommandPalette: () => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export function DesktopTopBar({
  searchQuery = "",
  onOpenCommandPalette,
  onToggleSidebar,
  isSidebarCollapsed = false,
}: DesktopTopBarProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const { isPwaStandalone, canInstallPwa, promptInstallPwa } = useExperience();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === "light";

  useEffect(() => {
    async function checkAdminStatus() {
      if (
        typeof window !== "undefined" &&
        localStorage.getItem("user_role") === "admin"
      ) {
        setIsAdmin(true);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email && isAdminUser(data.user.email)) {
        setIsAdmin(true);
      }
    }
    checkAdminStatus();
  }, []);

  const handleInstallClick = async () => {
    if (canInstallPwa) {
      await promptInstallPwa();
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b transition-colors duration-200",
        isLight
          ? "bg-white/95 backdrop-blur-xl border-slate-200 shadow-2xs"
          : "bg-surface/90 backdrop-blur-xl border-border"
      )}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-2.5 max-w-[1600px] mx-auto w-full">
        {/* Left: Menu Toggle Button & Spotlight Search */}
        <div className="flex items-center gap-3 flex-1 min-w-0 max-w-xl">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Toggle menu sidebar"
              className={cn(
                "h-9 w-9 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg border text-text-secondary hover:text-text-primary transition-all active:scale-95 cursor-pointer shrink-0",
                isLight
                  ? "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  : "bg-surface border-border hover:bg-surface-secondary"
              )}
              title={isSidebarCollapsed ? "Buka Menu Sidebar" : "Kecilkan Menu Sidebar"}
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <div
            onClick={onOpenCommandPalette}
            className="relative flex-1 min-w-0 cursor-pointer group"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-hover:text-brand-400 transition-colors pointer-events-none" />
            <input
              type="text"
              readOnly
              value={searchQuery}
              onClick={onOpenCommandPalette}
              placeholder="Cari materi, modul, tugas, atau tindakan... (Ctrl + K)"
              className={cn(
                "w-full pl-9 pr-14 h-9 rounded-lg border text-xs transition-all duration-150 cursor-pointer truncate",
                isLight
                  ? "placeholder:text-slate-400 text-slate-900 border-slate-200 bg-slate-50/90 group-hover:border-slate-300 focus:outline-none"
                  : "placeholder:text-text-tertiary text-text-primary border-border bg-surface/80 group-hover:border-brand-500/50 focus:outline-none"
              )}
            />
            <div className="flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-border bg-surface-secondary text-[10px] font-mono text-text-tertiary group-hover:text-text-primary transition-colors">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right: Workspace Status & User Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Subtle Download / Install App CTA */}
          {!isPwaStandalone ? (
            canInstallPwa ? (
              <button
                type="button"
                onClick={handleInstallClick}
                className="hidden xl:flex items-center gap-1.5 px-2.5 h-8 rounded-lg border border-brand-500/30 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 dark:text-brand-400 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                title="Pasang Velqora Desktop App"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pasang Aplikasi</span>
              </button>
            ) : (
              <Link
                href="/download"
                className="hidden xl:flex items-center gap-1.5 px-2.5 h-8 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary text-xs font-medium transition-colors"
                title="Unduh & Pasang Aplikasi"
              >
                <Download className="w-3.5 h-3.5 text-text-tertiary" />
                <span>Unduh App</span>
              </Link>
            )
          ) : (
            <div className="hidden xl:flex items-center gap-1 px-2.5 h-8 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[11px] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>App Mode</span>
            </div>
          )}

          {/* Admin Badge */}
          {isAdmin && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 h-8 rounded-lg border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-semibold">
              <Crown className="w-3.5 h-3.5 shrink-0 text-brand-400" />
              <span className="font-mono text-[10px] uppercase tracking-wider">
                {t("adminAccess")}
              </span>
            </div>
          )}

          {/* Online Health Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 h-8 rounded-lg border border-border bg-surface text-xs text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-[10px] font-semibold text-emerald-400 uppercase">
              {t("statusOnline")}
            </span>
          </div>

          {/* Notifications Center */}
          <NotificationCenter />

          {/* User Profile Menu */}
          <UserProfileMenu variant="navbar" />
        </div>
      </div>
    </header>
  );
}
