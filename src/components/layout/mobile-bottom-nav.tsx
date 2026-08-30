"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, CheckSquare, Layers, Menu } from "lucide-react";
import { MobileMenuDrawer } from "./mobile/mobile-menu-drawer";

interface MobileBottomNavProps {
  onToggleSidebar?: () => void;
}

export function MobileBottomNav({ onToggleSidebar }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    {
      label: "Beranda",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Materi",
      href: "/dashboard/materi",
      icon: BookOpen,
      exact: false,
    },
    {
      label: "Tugas",
      href: "/dashboard/tugas",
      icon: CheckSquare,
      exact: false,
    },
    {
      label: "Modul",
      href: "/dashboard/modul",
      icon: Layers,
      exact: false,
    },
  ];

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
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-lg text-[10.5px] font-medium transition-all duration-150 active:scale-95 cursor-pointer",
                  isActive
                    ? "text-brand-500 dark:text-brand-400 bg-brand-500/10 border border-brand-500/25 font-semibold"
                    : "text-text-secondary hover:text-text-primary border border-transparent"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-transform",
                    isActive ? "text-brand-500 dark:text-brand-400 scale-105" : "text-text-tertiary"
                  )}
                />
                <span className="truncate max-w-[64px] font-sans mt-0.5">{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleMenuClick}
            className="flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-lg text-[10.5px] font-medium text-text-secondary hover:text-text-primary active:scale-95 transition-all duration-150 border border-transparent hover:bg-surface-secondary cursor-pointer"
          >
            <Menu className="w-4 h-4 shrink-0 text-text-tertiary" />
            <span className="font-sans mt-0.5">Menu</span>
          </button>
        </div>
      </nav>

      {/* Embedded Mobile Menu Drawer */}
      <MobileMenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
