"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { DesktopTopBar } from "@/components/layout/desktop/desktop-top-bar";
import { MobileTopBar } from "@/components/layout/mobile/mobile-top-bar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { TechBackground } from "@/components/ui/tech-background";
import { DashboardFooter, MinimalCopyright } from "@/components/layout/watermark-footer";
import { CommandPalette } from "@/components/layout/command-palette";
import { trackUserVisit } from "@/lib/track-visit";
import { useExperience } from "@/context/experience-context";
import { useSurface } from "@/context/surface-context";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isDesktop, isMounted } = useExperience();
  const { isApp } = useSurface();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Exact check: ONLY "/dashboard" gets full rich footer; every other route gets MinimalCopyright
  const isDashboardHome = pathname === "/dashboard";

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
    <div className="relative min-h-screen flex bg-transparent overflow-x-hidden">
      {/* Precision technical canvas background */}
      <TechBackground />

      {/* Global Spotlight Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Fixed Desktop Sidebar (>= 1024px) & Tablet Drawer */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content Area: Desktop Workspace on >=1024px, Mobile App Shell on <1024px */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 z-10 transition-all duration-200 ease-out",
          !isApp && (sidebarCollapsed ? "lg:pl-[68px]" : "lg:pl-[245px]")
        )}
      >
        {/* Responsive Header: Desktop Top Bar on Desktop Web, Mobile Top Bar on Mobile & App */}
        {isApp ? (
          <MobileTopBar
            onOpenSearch={() => setCommandPaletteOpen(true)}
          />
        ) : (
          <>
            <div className="hidden lg:block">
              <DesktopTopBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onOpenCommandPalette={() => setCommandPaletteOpen(true)}
                onToggleSidebar={handleToggleCollapse}
                isSidebarCollapsed={sidebarCollapsed}
              />
            </div>

            <div className="block lg:hidden">
              <MobileTopBar
                onOpenSearch={() => setCommandPaletteOpen(true)}
              />
            </div>
          </>
        )}

        <main
          className={cn(
            "flex-1 w-full mx-auto animate-fade-in flex flex-col justify-between min-h-[calc(100vh-3.5rem)]",
            isApp
              ? "max-w-2xl px-3 sm:px-5 py-3.5 sm:py-5 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]"
              : "max-w-[1560px] px-3 sm:px-5 lg:px-7 xl:px-8 py-3.5 sm:py-5 lg:py-6 pb-6"
          )}
        >
          <div className="flex-1 min-w-0">{children}</div>
          {isDashboardHome ? <DashboardFooter /> : <MinimalCopyright />}
        </main>
      </div>

      {/* Mobile App Experience: 5-Destination Bottom Navigation Bar (ONLY in App Surface / Installed PWA) */}
      {isApp && (
        <MobileBottomNav onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      )}
    </div>
  );
}
