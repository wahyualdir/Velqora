"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { TechBackground } from "@/components/ui/tech-background";
import { DashboardFooter, MinimalCopyright } from "@/components/layout/watermark-footer";
import { CommandPalette } from "@/components/layout/command-palette";
import { trackUserVisit } from "@/lib/track-visit";
import { cn } from "@/lib/utils";

function SubpageBackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const isSubPage = pathname !== "/dashboard" && pathname !== "/";

  if (!isSubPage) return null;

  return (
    <div className="mb-3.5 flex items-center justify-start">
      <button
        type="button"
        onClick={() => {
          if (typeof window !== "undefined" && window.history.length > 2) {
            router.back();
          } else {
            router.push("/dashboard");
          }
        }}
        className="h-9.5 w-9.5 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-surface hover:bg-surface-secondary border border-border text-text-secondary hover:text-text-primary transition-all active:scale-95 group shadow-2xs cursor-pointer"
        title="Kembali"
        aria-label="Kembali"
      >
        <ArrowLeft className="w-4 h-4 text-text-secondary group-hover:text-text-primary group-hover:-translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
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
    <div className="relative min-h-screen flex bg-transparent pb-6 overflow-x-hidden">
      {/* Ambient moving dark tech background (Subtle Variant for high readability) */}
      <TechBackground variant="subtle" />

      {/* Subtle Ambient Scrim to subdue background and maximize dashboard text contrast */}
      <div className="fixed inset-0 pointer-events-none dark:bg-black/35 bg-transparent backdrop-blur-[0.5px] -z-[5]" />

      {/* Global Spotlight Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Fixed Desktop Sidebar & Responsive Mobile Drawer */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content Area (Offset for fixed desktop sidebar) */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 z-10 transition-all duration-200 ease-out",
          sidebarCollapsed ? "lg:pl-[68px]" : "lg:pl-[240px]"
        )}
      >
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
        <main className="flex-1 px-3 sm:px-5 lg:px-7 xl:px-8 py-4 sm:py-5 lg:py-6 max-w-[1560px] w-full mx-auto animate-fade-in flex flex-col justify-between min-h-[calc(100vh-4rem)] safe-area-bottom">
          <div className="flex-1">
            <SubpageBackButton />
            {children}
          </div>
          {isDashboardHome ? <DashboardFooter /> : <MinimalCopyright />}
        </main>
      </div>
    </div>
  );
}
