"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getDashboardStats } from "@/actions/study-actions";
import { PageContainer } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFocus } from "@/components/dashboard/dashboard-focus";
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics";
import { DashboardModulesList } from "@/components/dashboard/dashboard-modules-list";
import { DashboardRecentViews } from "@/components/dashboard/dashboard-recent-views";
import { DashboardTasksList } from "@/components/dashboard/dashboard-tasks-list";
import { DashboardQuickTools } from "@/components/dashboard/dashboard-quick-tools";

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
    <PageContainer className="space-y-6 sm:space-y-7 pb-14">
      {/* ─── 1. Header & Human Greeting ─── */}
      <DashboardHeader userName={userName} />

      {/* ─── Error State (Humane & Actionable) ─── */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center justify-between gap-3 text-xs sm:text-sm text-rose-600 dark:text-rose-400">
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

      {/* ─── 2. Primary Focus (What is most important right now?) ─── */}
      <DashboardFocus
        loading={loading}
        recentModules={stats.recentModules}
        recentTasks={stats.recentTasks}
        recentViews={stats.recentViews}
        isBrandNew={isBrandNewWorkspace}
      />

      {/* ─── 3. Compact Metrics Summary ─── */}
      <DashboardMetrics
        loading={loading}
        totalModul={stats.totalModul}
        totalMateri={stats.totalMateri}
        totalTugas={stats.totalTugas}
        totalFile={stats.totalFile}
      />

      {/* ─── 4. Main 2-Column Academic Workspace Hub ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Active Learning Modules & Recent Readings */}
        <div className="lg:col-span-8 space-y-6">
          <DashboardModulesList
            loading={loading}
            modules={stats.recentModules}
          />

          <DashboardRecentViews
            loading={loading}
            views={stats.recentViews}
          />
        </div>

        {/* Right Column (4 cols): Active Tasks / Deadlines & Quick Academic Tools */}
        <div className="lg:col-span-4 space-y-6">
          <DashboardTasksList
            loading={loading}
            tasks={stats.recentTasks}
          />

          <DashboardQuickTools />
        </div>
      </div>
    </PageContainer>
  );
}
