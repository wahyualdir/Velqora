"use client";

import { Menu, Search, Command, Crown } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserProfileMenu } from "@/components/layout/user-profile-menu";
import { isAdminUser } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { useTheme } from "next-themes";

interface NavbarProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange?: (query: string) => void;
  onOpenCommandPalette?: () => void;
}

export function Navbar({
  onToggleSidebar,
  searchQuery,
  onOpenCommandPalette,
}: NavbarProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === "light";

  useEffect(() => {
    async function checkAdminStatus() {
      if (typeof window !== "undefined" && localStorage.getItem("user_role") === "admin") {
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

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-colors duration-200 ${
        isLight
          ? "bg-white/90 backdrop-blur-xl border-slate-200 shadow-2xs"
          : "bg-surface/90 backdrop-blur-xl border-border"
      }`}
    >
      <div className="flex items-center justify-between gap-2.5 sm:gap-3 px-3 sm:px-5 lg:px-7 xl:px-8 py-2.5 sm:py-3 max-w-[1560px] mx-auto w-full">
        
        {/* Left: Mobile Menu Toggle & Search Bar */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0 max-w-2xl">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden h-10 w-10 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors shrink-0 active:scale-95 focus:outline-none"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar / Spotlight Trigger */}
          <div
            onClick={onOpenCommandPalette}
            className="relative flex-1 min-w-0 cursor-pointer group"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-hover:text-brand-400 transition-colors pointer-events-none" />
            <input
              type="text"
              readOnly
              value={searchQuery}
              onClick={onOpenCommandPalette}
              placeholder="Cari materi, modul... (Ctrl + K)"
              className={`w-full pl-9 pr-10 sm:pr-14 h-10 min-h-[40px] rounded-xl border text-xs sm:text-sm transition-all duration-150 cursor-pointer truncate ${
                isLight
                  ? "placeholder:text-slate-400 text-slate-900 border-slate-200 bg-slate-50/90 group-hover:border-slate-300"
                  : "placeholder:text-text-tertiary text-text-primary border-border bg-surface/80 group-hover:border-brand-500/50"
              }`}
            />
            <div className="hidden xs:flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-border bg-surface-secondary text-[10px] font-mono text-text-tertiary group-hover:text-text-primary transition-colors">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right: Badges & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

          {/* Admin Badge */}
          {isAdmin && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 h-10 rounded-xl border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-semibold">
              <Crown className="w-3.5 h-3.5 shrink-0 text-brand-400" />
              <span className="font-mono text-[10px] uppercase tracking-wider">{t("adminAccess")}</span>
            </div>
          )}

          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 h-10 rounded-xl border border-border bg-surface text-xs text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="font-mono text-[10px] font-semibold text-emerald-400 uppercase">{t("statusOnline")}</span>
          </div>

          {/* Top-Right User Profile Menu */}
          <UserProfileMenu variant="navbar" />

        </div>

      </div>
    </header>
  );
}
