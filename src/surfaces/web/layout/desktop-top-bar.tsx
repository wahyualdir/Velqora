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
import { isAdminUser } from "@/lib/utils";

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
        ["admin", "owner"].includes(localStorage.getItem("user_role") || "")
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
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 dark:bg-[#0B0A09]/88 backdrop-blur-md border-b border-[#E4DDD4] dark:border-[#292524] select-none transition-colors">
      <div className="flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-2.5 max-w-[1600px] mx-auto w-full font-mono">
        {/* Left: Menu Toggle Button & Search Box */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0 max-w-xl">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Toggle menu sidebar"
              className="h-8.5 w-8.5 min-h-[34px] min-w-[34px] flex items-center justify-center vt-btn-chrome rounded-lg cursor-pointer shrink-0"
              title={isSidebarCollapsed ? "Buka Menu Sidebar" : "Kecilkan Menu Sidebar"}
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <div
            onClick={onOpenCommandPalette}
            className="relative flex-1 min-w-0 cursor-pointer group"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8378] dark:text-[#8C857F] group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] transition-colors pointer-events-none" />
            <input
              type="text"
              readOnly
              value={searchQuery}
              onClick={onOpenCommandPalette}
              placeholder="Cari materi, modul, tugas... (Ctrl + K)"
              className="w-full pl-9 pr-14 h-8.5 rounded-xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] group-hover:border-[#C2553A]/40 dark:group-hover:border-[#D4664A]/50 text-[#1C1917] dark:text-[#F5F5F4] placeholder:text-[#8A8378] dark:placeholder:text-[#8C857F] text-xs font-mono transition-colors truncate focus:outline-none cursor-pointer"
            />
            <div className="flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md border border-[#E4DDD4] dark:border-[#292524] bg-[#F3EFE9] dark:bg-[#1C1917] text-[10px] font-mono text-[#524B42] dark:text-[#A8A29E]">
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
                className="flex items-center gap-1.5 px-3 h-8.5 vt-btn-terracotta rounded-lg text-xs font-semibold cursor-pointer"
                title="Pasang Velqora Desktop App"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xl:inline">Pasang App</span>
              </button>
            ) : (
              <Link
                href="/download"
                className="flex items-center gap-1.5 px-3 h-8.5 vt-btn-chrome rounded-lg text-xs font-semibold"
                title="Unduh & Pasang Aplikasi"
              >
                <Download className="w-3.5 h-3.5 shrink-0 text-[#C2553A] dark:text-[#D4664A]" />
                <span className="hidden xl:inline">Unduh App</span>
              </Link>
            )
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 h-8.5 rounded-lg bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] text-emerald-700 dark:text-[#34D399] text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xl:inline">App Mode</span>
            </div>
          )}

          {/* Admin Badge */}
          {isAdmin && (
            <div
              className="flex items-center gap-1.5 px-2.5 h-8.5 rounded-lg bg-[#FAF3EF] dark:bg-[#D4664A]/15 border border-[#C2553A]/25 dark:border-[#D4664A]/35 text-[#C2553A] dark:text-[#D4664A] text-xs font-semibold"
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
            className="flex items-center gap-1.5 px-2.5 h-8.5 rounded-lg bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] text-xs text-[#1C1917] dark:text-[#F5F5F4]"
            title="Sistem Terhubung & Sinkron"
          >
            <span className="w-2 h-2 rounded-full bg-[#059669] dark:bg-[#34D399] shrink-0" />
            <span className="hidden sm:inline font-mono text-[10px] font-semibold text-emerald-700 dark:text-[#34D399] uppercase">
              {t("statusOnline")}
            </span>
          </div>

          {/* Quick Theme Switcher */}
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="vt-btn-chrome h-8.5 w-8.5 min-w-[34px] rounded-lg flex items-center justify-center cursor-pointer"
              title={resolvedTheme === "dark" ? "Beralih ke Mode Terang (Light)" : "Beralih ke Mode Gelap (Dark)"}
              aria-label="Ganti Tema"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 text-[#E5C194]" />
              ) : (
                <Moon className="w-4 h-4 text-[#C2553A]" />
              )}
            </button>
          )}

          {/* Notifications Center */}
          <div className="vt-btn-chrome h-8.5 rounded-lg flex items-center justify-center px-1">
            <NotificationCenter />
          </div>

          {/* User Profile Menu */}
          <div className="vt-btn-chrome h-8.5 rounded-lg flex items-center px-1">
            <UserProfileMenu variant="navbar" />
          </div>
        </div>
      </div>
    </header>
  );
}
