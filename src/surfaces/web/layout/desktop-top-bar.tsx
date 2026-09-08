"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Command, Crown, Download, CheckCircle2, Menu, Sun, Moon } from "lucide-react";
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
  const { t } = useLanguage();
  const { isPwaStandalone, canInstallPwa, promptInstallPwa } = useExperience();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

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
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border shadow-2xs select-none transition-colors">
      <div className="flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-2.5 max-w-[1600px] mx-auto w-full">
        {/* Left: Menu Toggle Button & Modern Search Box */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0 max-w-xl">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Toggle menu sidebar"
              className="h-9 w-9 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-all cursor-pointer shrink-0 shadow-2xs"
              title={isSidebarCollapsed ? "Buka Menu Sidebar" : "Kecilkan Menu Sidebar"}
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <div
            onClick={onOpenCommandPalette}
            className="relative flex-1 min-w-0 cursor-pointer group"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-hover:text-brand-500 transition-colors pointer-events-none" />
            <input
              type="text"
              readOnly
              value={searchQuery}
              onClick={onOpenCommandPalette}
              placeholder="Cari materi, modul, tugas... (Ctrl + K)"
              className="w-full pl-10 pr-12 h-9 bg-surface-secondary/70 hover:bg-surface-secondary border border-border/80 group-hover:border-brand-500/40 rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary transition-all truncate focus:outline-hidden font-medium cursor-pointer shadow-2xs"
            />
            <div className="flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md border border-border bg-surface text-[10px] font-mono text-text-tertiary shadow-2xs">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right: Workspace Status & User Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 text-xs">
          {/* Install / Download App CTA */}
          {!isPwaStandalone ? (
            canInstallPwa ? (
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-2xs cursor-pointer transition-all active:scale-95"
                title="Pasang Velqora Desktop App"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xl:inline">Pasang App</span>
              </button>
            ) : (
              <Link
                href="/download"
                className="flex items-center gap-1.5 px-3 h-9 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-text-primary text-xs font-semibold shadow-2xs transition-all"
                title="Unduh & Pasang Aplikasi"
              >
                <Download className="w-3.5 h-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
                <span className="hidden xl:inline">Unduh App</span>
              </Link>
            )
          ) : (
            <div className="flex items-center gap-1 px-2.5 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden xl:inline">App Mode</span>
            </div>
          )}

          {/* Admin Badge */}
          {isAdmin && (
            <div
              className="flex items-center gap-1.5 px-2.5 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold"
              title="Akses Administrator"
            >
              <Crown className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xl:inline font-mono text-[10px] uppercase tracking-wider">
                {t("adminAccess")}
              </span>
            </div>
          )}

          {/* Online Health Indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 h-9 rounded-xl border border-border/80 bg-surface text-xs text-text-secondary shadow-2xs"
            title="Sistem Terhubung & Sinkron"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span className="hidden sm:inline font-mono text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase">
              {t("statusOnline")}
            </span>
          </div>

          {/* Quick Theme Switcher (Matahari / Bulan) */}
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="h-9 w-9 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-all cursor-pointer shadow-2xs"
              title={resolvedTheme === "dark" ? "Beralih ke Mode Terang (Light)" : "Beralih ke Mode Gelap (Dark)"}
              aria-label="Ganti Tema"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-brand-600" />
              )}
            </button>
          )}

          {/* Notifications Center */}
          <div className="flex items-center">
            <NotificationCenter />
          </div>

          {/* User Profile Menu */}
          <div className="flex items-center ml-0.5">
            <UserProfileMenu variant="navbar" />
          </div>
        </div>
      </div>
    </header>
  );
}
