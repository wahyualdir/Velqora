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
import type { DashboardStatsData } from "@/surfaces/web/dashboard/dashboard-utils";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"overview" | "statistik">("overview");
  const [stats, setStats] = useState<DashboardStatsData>({
    totalMateri: 0,
    totalTugas: 0,
    totalModul: 0,
    totalFile: 0,
    recentViews: [],
    recentTasks: [],
    recentModules: [],
    todaySchedules: [],
    upcomingSchedules: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "statistik") {
        setActiveTab("statistik");
      }
    }
  }, []);

  const handleTabChange = useCallback((nextTab: "overview" | "statistik") => {
    setActiveTab(nextTab);
    if (typeof window !== "undefined") {
      window.history.replaceState(
        null,
        "",
        nextTab === "statistik" ? "/dashboard?tab=statistik" : "/dashboard"
      );
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
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

      const data = await getDashboardStats();
      if (data) {
        setStats({
          ...data,
          todaySchedules: data.todaySchedules || [],
          upcomingSchedules: data.upcomingSchedules || [],
        });
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
      {/* ─── Compact Mobile Switcher ONLY (<768px). On Desktop/Tablet, tabs live inside DashboardHeader ─── */}
      <div className="mb-4 flex md:hidden items-center justify-between gap-3 flex-wrap">
        <div
          role="tablist"
          aria-label="Mode Tampilan Dashboard Mobile"
          className="inline-flex items-center gap-1 bg-[#F3EFE9] dark:bg-[#141210] p-1 rounded-xl border border-[#E6E0D6] dark:border-[#24201E] text-xs font-sans select-none"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "overview"}
            onClick={() => handleTabChange("overview")}
            className={cn(
              "px-3.5 py-1.5 font-semibold transition-all cursor-pointer rounded-lg flex items-center gap-1.5",
              activeTab === "overview"
                ? "bg-[#FFFFFF] dark:bg-[#24201D] text-[#1C1917] dark:text-[#F5F5F4] shadow-2xs"
                : "text-[#5C554E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4]"
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#F09A82]" />
            <span>Ikhtisar</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "statistik"}
            onClick={() => handleTabChange("statistik")}
            className={cn(
              "px-3.5 py-1.5 font-semibold transition-all cursor-pointer rounded-lg flex items-center gap-1.5",
              activeTab === "statistik"
                ? "bg-[#FFFFFF] dark:bg-[#24201D] text-[#1C1917] dark:text-[#F5F5F4] shadow-2xs"
                : "text-[#5C554E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4]"
            )}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#F09A82]" />
            <span>Statistik</span>
          </button>
        </div>
      </div>

      {/* ─── Error State ─── */}
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

      {/* ─── Surface Rendering ─── */}
      <SurfaceAdaptive
        web={
          <DesktopDashboardView
            userName={userName}
            stats={stats}
            loading={loading}
            isBrandNewWorkspace={isBrandNewWorkspace}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        }
        app={
          activeTab === "statistik" ? (
            <DashboardAnalyticsTab />
          ) : (
            <MobileDashboardView
              userName={userName}
              stats={stats}
              loading={loading}
              onRefresh={loadData}
            />
          )
        }
      />
    </PageContainer>
  );
}
