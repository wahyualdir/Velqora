"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Command, Crown, Download, CheckCircle2, Menu } from "lucide-react";
import { UserProfileMenu } from "@/components/layout/user-profile-menu";
import { NotificationCenter } from "@/components/layout/notification-center";
import { useExperience } from "@/context/experience-context";
import { useLanguage } from "@/context/language-context";
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
    <header className="sticky top-0 z-30 bg-[#ECE9D8] border-b-2 border-[#FFFFFF] border-b-[#7A756D] shadow-xs select-none">
      <div className="flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-2 max-w-[1600px] mx-auto w-full font-mono">
        {/* Left: Menu Toggle Button & Retro Inset Search Box */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0 max-w-xl">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Toggle menu sidebar"
              className="h-8 w-8 min-h-[32px] min-w-[32px] flex items-center justify-center vt-btn-chrome text-[#1C1917] cursor-pointer shrink-0"
              title={isSidebarCollapsed ? "Buka Menu Sidebar" : "Kecilkan Menu Sidebar"}
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <div
            onClick={onOpenCommandPalette}
            className="relative flex-1 min-w-0 cursor-pointer group"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A756D] group-hover:text-[#C2553A] transition-colors pointer-events-none" />
            <input
              type="text"
              readOnly
              value={searchQuery}
              onClick={onOpenCommandPalette}
              placeholder="Cari materi, modul, tugas... (Ctrl + K)"
              className="w-full pl-8 pr-12 h-8 bg-[#FAF8F5] border-t border-l border-[#7A756D] border-b border-r border-[#FFFFFF] text-[#1C1917] placeholder:text-[#8A8378] text-xs font-mono transition-all truncate focus:outline-none"
            />
            <div className="flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 border border-[#B8B1A5] bg-[#ECE9D8] text-[10px] font-mono text-[#524B42]">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right: Workspace Status & User Actions (Retro Bevel) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 text-xs">
          {/* Install / Download App CTA */}
          {!isPwaStandalone ? (
            canInstallPwa ? (
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-2.5 h-8 vt-btn-terracotta text-xs font-bold cursor-pointer"
                title="Pasang Velqora Desktop App"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xl:inline">Pasang App</span>
              </button>
            ) : (
              <Link
                href="/download"
                className="flex items-center gap-1.5 px-2.5 h-8 vt-btn-chrome text-xs font-semibold"
                title="Unduh & Pasang Aplikasi"
              >
                <Download className="w-3.5 h-3.5 shrink-0 text-[#C2553A]" />
                <span className="hidden xl:inline">Unduh App</span>
              </Link>
            )
          ) : (
            <div className="flex items-center gap-1 px-2.5 h-8 bg-[#FAF8F5] border border-[#B8B1A5] text-emerald-800 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span className="hidden xl:inline">App Mode</span>
            </div>
          )}

          {/* Admin Badge */}
          {isAdmin && (
            <div
              className="flex items-center gap-1.5 px-2.5 h-8 vt-btn-terracotta text-xs font-bold"
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
            className="flex items-center gap-1.5 px-2.5 h-8 bg-[#FAF8F5] border border-[#B8B1A5] text-xs text-[#1C1917]"
            title="Sistem Terhubung & Sinkron"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span className="hidden sm:inline font-mono text-[10px] font-bold text-emerald-700 uppercase">
              {t("statusOnline")}
            </span>
          </div>

          {/* Notifications Center */}
          <div className="vt-btn-chrome h-8 flex items-center justify-center px-1">
            <NotificationCenter />
          </div>

          {/* User Profile Menu */}
          <div className="vt-btn-chrome h-8 flex items-center px-1">
            <UserProfileMenu variant="navbar" />
          </div>
        </div>
      </div>
    </header>
  );
}
