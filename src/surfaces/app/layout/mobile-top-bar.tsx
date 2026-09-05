"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, Menu } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { UserProfileMenu } from "@/components/layout/user-profile-menu";
import { NotificationCenter } from "@/components/layout/notification-center";
import { cn } from "@/lib/utils";

interface MobileTopBarProps {
  title?: string;
  onOpenSearch?: () => void;
  showBack?: boolean;
  actions?: React.ReactNode;
  onOpenMenu?: () => void;
}

export function MobileTopBar({
  title,
  onOpenSearch,
  showBack,
  actions,
  onOpenMenu,
}: MobileTopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isDashboardHome = pathname === "/dashboard" || pathname === "/";
  const shouldShowBack = showBack !== undefined ? showBack : !isDashboardHome;

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-surface/95 backdrop-blur-md border-b border-border/80 pt-[env(safe-area-inset-top,0px)] transition-colors">
      <div className="flex items-center justify-between h-13 px-3.5 sm:px-6 w-full mx-auto">
        {/* Left Side: Menu Button, Back Button or Brand Logo */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {onOpenMenu && (
            <button
              type="button"
              onClick={onOpenMenu}
              className="h-9 w-9 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary active:scale-95 transition-all -ml-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
              aria-label="Buka menu navigasi"
              title="Menu Navigasi"
            >
              <Menu className="w-5 h-5 text-text-primary" />
            </button>
          )}

          {shouldShowBack ? (
            <button
              type="button"
              onClick={handleBack}
              className={cn(
                "h-9 w-9 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary active:scale-95 transition-all cursor-pointer",
                !onOpenMenu && "-ml-1"
              )}
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 focus:outline-none ml-0.5"
            >
              <Logo variant="sidebar" hideText={false} />
            </Link>
          )}

          {title && shouldShowBack && (
            <h1 className="text-sm font-bold text-text-primary truncate font-display ml-1">
              {title}
            </h1>
          )}
        </div>

        {/* Right Side: Quick Action Icons */}
        <div className="flex items-center gap-1 shrink-0">
          {actions ? (
            actions
          ) : (
            <>
              {onOpenSearch && (
                <button
                  type="button"
                  onClick={onOpenSearch}
                  aria-label="Cari"
                  className="h-9 w-9 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary active:scale-95 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}

              <NotificationCenter />

              <div className="ml-1">
                <UserProfileMenu variant="navbar" />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
