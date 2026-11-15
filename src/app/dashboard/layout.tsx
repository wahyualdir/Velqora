"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileTopBar } from "@/surfaces/app/layout/mobile-top-bar";
import { MobileBottomNav } from "@/surfaces/app/layout/mobile-bottom-nav";
import { TechBackground } from "@/components/ui/tech-background";
import { DashboardFooter, MinimalCopyright } from "@/components/layout/watermark-footer";
import { CommandPalette } from "@/components/layout/command-palette";
import { trackUserVisit } from "@/lib/track-visit";
import { useSurface } from "@/context/surface-context";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isApp } = useSurface();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Exact check: ONLY "/dashboard" gets full rich footer; every other route gets MinimalCopyright
  const isDashboardHome = pathname === "/dashboard";
  const isDocReader = pathname.includes("/dashboard/modul/kategori/");

  useEffect(() => {
    trackUserVisit();
    const savedCollapse = localStorage.getItem("sidebar_collapsed");
    if (savedCollapse === "true") {
      setSidebarCollapsed(true);
    }
  }, []);

  const handleToggleCollapse = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", String(next));
      return next;
    });
  };

  // Global Ctrl+K / Cmd+K and '/' shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (document.activeElement?.tagName || "").toUpperCase()
        )
      ) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-dvh flex bg-transparent overflow-x-hidden">
      {/* Precision technical canvas background */}
      <TechBackground />

      {/* Global Spotlight Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Fixed Desktop Sidebar (>= 1024px) & Tablet Compact Rail / Drawer (Hidden in immersive Doc Reader mode) */}
      {!isDocReader && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenDrawer={() => setSidebarOpen(true)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
      )}

      {/* Main Content Area: Desktop Workspace (>=1024px), Tablet Compact Rail (>=768px), Mobile App Shell (<768px) */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 z-10 transition-all duration-200 ease-out",
          !isApp && !isDocReader && (sidebarCollapsed ? "md:pl-[68px] lg:pl-[68px]" : "md:pl-[68px] lg:pl-[245px]"),
          isApp && !isDocReader && "md:pl-[68px]",
          isDocReader && "md:pl-0 lg:pl-0"
        )}
      >
        {/* Responsive Header: Mobile Top Bar ONLY on Mobile (<768px). Hidden on Tablet+ & Doc Reader! */}
        {!isDocReader && (
          isApp ? (
            <div className="block md:hidden">
              <MobileTopBar
                onOpenSearch={() => setCommandPaletteOpen(true)}
                onOpenMenu={() => setSidebarOpen(true)}
              />
            </div>
          ) : (
            <div className="block md:hidden">
              <MobileTopBar
                onOpenSearch={() => setCommandPaletteOpen(true)}
                onOpenMenu={() => setSidebarOpen(true)}
              />
            </div>
          )
        )}

        <main
          className={cn(
            "flex-1 w-full mx-auto animate-fade-in flex flex-col justify-between min-h-dvh",
            isDocReader
              ? "max-w-none p-0 m-0 w-full min-h-dvh"
              : isApp
              ? "max-w-2xl md:max-w-[1560px] px-3 sm:px-5 md:px-6 lg:px-8 py-3.5 sm:py-5 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8"
              : "max-w-[1560px] px-3 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-3.5 sm:py-5 lg:py-7 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8"
          )}
        >
          <div className="flex-1 min-w-0">{children}</div>
          {!isDocReader && (isDashboardHome ? <DashboardFooter /> : <MinimalCopyright />)}
        </main>
      </div>

      {/* Mobile App Experience: 5-Destination Bottom Navigation Bar (ONLY in App Surface / Installed PWA) */}
      {isApp && (
        <MobileBottomNav onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      )}
    </div>
  );
}
