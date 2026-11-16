"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Command,
  Plus,
  Download,
  PanelLeft,
  PanelLeftOpen,
  Sun,
  Moon,
} from "lucide-react";
import { UserProfileMenu } from "@/components/layout/user-profile-menu";
import { NotificationCenter } from "@/components/layout/notification-center";
import { useExperience } from "@/context/experience-context";
import { useTheme } from "next-themes";
import { getCurrentAcademicPeriod } from "@/surfaces/web/dashboard/dashboard-utils";

interface DesktopTopBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenCommandPalette: () => void;
  onToggleSidebar?: () => void;
  onOpenDrawer?: () => void;
  isSidebarCollapsed?: boolean;
}

export function DesktopTopBar({
  searchQuery = "",
  onOpenCommandPalette,
  onToggleSidebar,
  onOpenDrawer,
  isSidebarCollapsed = false,
}: DesktopTopBarProps) {
  const { isPwaStandalone, canInstallPwa, promptInstallPwa } = useExperience();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [shortPeriod, setShortPeriod] = useState("Hari Ini");

  useEffect(() => {
    setMounted(true);
    setShortPeriod(getCurrentAcademicPeriod(new Date()).shortPeriod);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleInstallClick = async () => {
    if (canInstallPwa) {
      await promptInstallPwa();
    }
  };

  return (
    <header className="sticky top-0 z-25 bg-[#FAF8F5]/95 dark:bg-[#0B0A09]/92 backdrop-blur-md border-b border-[#E6E0D6] dark:border-[#24201E] select-none transition-colors">
      <div className="flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 h-14 max-w-[1600px] mx-auto w-full">
        {/* Left: Sidebar Toggle & Spotlight Search */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0 max-w-xl">
          {onOpenDrawer && (
            <button
              type="button"
              onClick={onOpenDrawer}
              aria-label="Buka menu navigasi"
              className="lg:hidden h-9 w-9 min-h-[36px] min-w-[36px] flex items-center justify-center vt-btn-chrome rounded-xl cursor-pointer shrink-0"
              title="Buka menu navigasi"
            >
              <PanelLeftOpen className="w-4 h-4 text-[#524B42] dark:text-[#A8A29E]" />
            </button>
          )}

          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Toggle menu sidebar"
              className="hidden lg:flex h-9 w-9 min-h-[36px] min-w-[36px] items-center justify-center vt-btn-chrome rounded-xl cursor-pointer shrink-0"
              title={isSidebarCollapsed ? "Buka Sidebar" : "Kecilkan Sidebar"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-[#524B42] dark:text-[#A8A29E]" />
              ) : (
                <PanelLeft className="w-4 h-4 text-[#524B42] dark:text-[#A8A29E]" />
              )}
            </button>
          )}

          <div
            onClick={onOpenCommandPalette}
            className="relative flex-1 min-w-0 cursor-pointer group"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8378] dark:text-[#8C857F] group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] transition-colors pointer-events-none" />
            <input
              type="text"
              readOnly
              value={searchQuery}
              onClick={onOpenCommandPalette}
              placeholder="Cari materi, modul, tugas, atau catatan... (Ctrl + K)"
              className="w-full pl-10 pr-16 h-9.5 rounded-xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E6E0D6] dark:border-[#24201E] group-hover:border-[#C2553A]/35 dark:group-hover:border-[#D4664A]/40 text-[#1C1917] dark:text-[#F5F5F4] placeholder:text-[#8A8378] dark:placeholder:text-[#8C857F] text-[13px] font-sans transition-colors truncate focus:outline-none cursor-pointer shadow-2xs"
            />
            <div className="flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg border border-[#E6E0D6] dark:border-[#24201E] bg-[#F3EFE9] dark:bg-[#1C1917] text-[10.5px] font-mono font-medium text-[#524B42] dark:text-[#A8A29E]">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right: Calm SaaS Actions */}
        <div className="flex items-center gap-2 shrink-0 text-xs font-sans">
          {/* Calm Academic Period Label */}
          <Link
            href="/dashboard/jadwal"
            className="hidden xl:inline-flex items-center px-3 h-9 rounded-xl bg-[#F3EFE9]/80 dark:bg-[#141210] border border-[#E6E0D6] dark:border-[#24201E] text-[#5C554E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] text-xs font-medium whitespace-nowrap transition-colors"
            title="Lihat Jadwal Belajar"
          >
            {shortPeriod}
          </Link>

          {/* Subtle Quick Create Action */}
          <Link
            href="/dashboard/modul/baru"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 vt-btn-chrome rounded-xl text-xs font-semibold text-[#1C1917] dark:text-[#F5F5F4]"
            title="Buat Modul atau Catatan Baru"
          >
            <Plus className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
            <span>Buat Modul</span>
          </Link>

          {!isPwaStandalone && canInstallPwa && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="hidden xl:flex items-center gap-1.5 px-2.5 h-9 vt-btn-chrome rounded-xl text-xs font-medium cursor-pointer"
              title="Pasang Velqora Desktop App"
            >
              <Download className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
            </button>
          )}

          {/* Theme Switcher */}
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="vt-btn-chrome h-9 w-9 min-w-[36px] rounded-xl flex items-center justify-center cursor-pointer"
              title={resolvedTheme === "dark" ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
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
          <div className="vt-btn-chrome h-9 rounded-xl flex items-center justify-center px-1">
            <NotificationCenter />
          </div>

          {/* Tablet Compact Profile Trigger */}
          <div className="hidden md:flex lg:hidden vt-btn-chrome h-9 rounded-xl items-center px-1">
            <UserProfileMenu variant="navbar" />
          </div>
        </div>
      </div>
    </header>
  );
}
