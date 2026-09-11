"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getDashboardStats } from "@/actions/study-actions";
import { PageContainer } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, BarChart3, LayoutGrid } from "lucide-react";
import { DesktopDashboardView } from "@/surfaces/web/dashboard/desktop-dashboard-view";
import { MobileDashboardView } from "@/surfaces/app/dashboard/mobile-dashboard-view";
import { DashboardAnalyticsTab } from "@/surfaces/web/dashboard/dashboard-analytics-tab";
import { SurfaceAdaptive } from "@/components/layout/surface-adaptive";
import { cn } from "@/lib/utils";

interface DashboardStatsState {
  totalMateri: number;
  totalTugas: number;
  totalModul: number;
  totalFile: number;
  recentViews: any[];
  recentTasks: any[];
  recentModules: any[];
}

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"overview" | "statistik">("overview");
  const [stats, setStats] = useState<DashboardStatsState>({
    totalMateri: 0,
    totalTugas: 0,
    totalModul: 0,
    totalFile: 0,
    recentViews: [],
    recentTasks: [],
    recentModules: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Baca query parameter ?tab=statistik saat inisialisasi client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "statistik") {
        setActiveTab("statistik");
      }
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch authenticated user profile for natural greeting
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const meta = user.user_metadata || {};
        const name =
          meta.full_name ||
          meta.name ||
          meta.custom_claims?.global_name ||
          (user.email ? user.email.split("@")[0] : "");
        setUserName(name);
      }

      // 2. Fetch real dashboard stats and records
      const data = await getDashboardStats();
      if (data) {
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Data dashboard belum dapat dimuat saat ini. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isBrandNewWorkspace =
    !loading &&
    !error &&
    stats.totalMateri === 0 &&
    stats.totalTugas === 0 &&
    stats.totalModul === 0 &&
    stats.totalFile === 0;

  return (
    <PageContainer className="p-0 sm:p-0 lg:p-0 max-w-none">
      {/* ─── Dashboard Tab Switcher: Ikhtisar vs Statistik Belajar ─── */}
      <div className="mb-4 sm:mb-5 flex items-center justify-between gap-3 flex-wrap">
        <div
          role="tablist"
          aria-label="Mode Tampilan Dashboard"
          className="inline-flex items-center gap-1 bg-[#ECE9D8] dark:bg-zinc-800/80 p-1 rounded-sm border border-[#7A756D]/40 dark:border-zinc-700 text-xs font-mono select-none"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "overview"}
            onClick={() => {
              setActiveTab("overview");
              if (typeof window !== "undefined") {
                window.history.replaceState(null, "", "/dashboard");
              }
            }}
            className={cn(
              "px-3 py-1 font-semibold transition-all cursor-pointer rounded-xs flex items-center gap-1.5",
              activeTab === "overview"
                ? "bg-[#C2553A] dark:bg-brand-600 text-white shadow-xs border-t border-l border-[#EE7257] dark:border-t-brand-400 dark:border-l-brand-400 border-b border-r border-[#6B2D20] dark:border-b-brand-900"
                : "text-[#524B42] dark:text-zinc-300 hover:text-[#1C1917] dark:hover:text-white"
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Ikhtisar Belajar</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "statistik"}
            onClick={() => {
              setActiveTab("statistik");
              if (typeof window !== "undefined") {
                window.history.replaceState(null, "", "/dashboard?tab=statistik");
              }
            }}
            className={cn(
              "px-3 py-1 font-semibold transition-all cursor-pointer rounded-xs flex items-center gap-1.5",
              activeTab === "statistik"
                ? "bg-[#C2553A] dark:bg-brand-600 text-white shadow-xs border-t border-l border-[#EE7257] dark:border-t-brand-400 dark:border-l-brand-400 border-b border-r border-[#6B2D20] dark:border-b-brand-900"
                : "text-[#524B42] dark:text-zinc-300 hover:text-[#1C1917] dark:hover:text-white"
            )}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Statistik Belajar</span>
          </button>
        </div>
      </div>

      {/* ─── Error State (Humane & Actionable) ─── */}
      {error && (
        <div className="mb-4 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center justify-between gap-3 text-xs sm:text-sm text-rose-600 dark:text-rose-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={loadData}
            className="text-xs gap-1.5 shrink-0 border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      )}

      {/* ─── Tab View Rendering ─── */}
      {activeTab === "statistik" ? (
        <DashboardAnalyticsTab />
      ) : (
        <SurfaceAdaptive
          web={
            <DesktopDashboardView
              userName={userName}
              stats={stats}
              loading={loading}
              isBrandNewWorkspace={isBrandNewWorkspace}
            />
          }
          app={
            <MobileDashboardView
              userName={userName}
              stats={stats}
              loading={loading}
              onRefresh={loadData}
            />
          }
        />
      )}
    </PageContainer>
  );
}
