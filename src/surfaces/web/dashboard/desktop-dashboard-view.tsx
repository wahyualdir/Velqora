"use client";

import React from "react";
import { DashboardHeader } from "./dashboard-header";
import { DashboardFocus } from "./dashboard-focus";
import { DashboardMetrics } from "./dashboard-metrics";
import { DashboardModulesList } from "./dashboard-modules-list";
import { DashboardRecentViews } from "./dashboard-recent-views";
import { DashboardTasksList } from "./dashboard-tasks-list";
import { DashboardQuickTools } from "./dashboard-quick-tools";

interface DesktopDashboardViewProps {
  userName: string;
  stats: {
    totalMateri: number;
    totalTugas: number;
    totalModul: number;
    totalFile: number;
    recentViews: any[];
    recentTasks: any[];
    recentModules: any[];
  };
  loading: boolean;
  isBrandNewWorkspace: boolean;
}

export function DesktopDashboardView({
  userName,
  stats,
  loading,
  isBrandNewWorkspace,
}: DesktopDashboardViewProps) {
  return (
    <div className="space-y-6 sm:space-y-7 pb-14 animate-fade-in max-w-[1560px] mx-auto">
      {/* ─── 1. Desktop Workspace Header ─── */}
      <DashboardHeader userName={userName} />

      {/* ─── 2. Level 1 Focal Point: Continue Learning / Active Subject ─── */}
      <DashboardFocus
        loading={loading}
        recentModules={stats.recentModules}
        recentTasks={stats.recentTasks}
        recentViews={stats.recentViews}
        isBrandNew={isBrandNewWorkspace}
      />

      {/* ─── 3. Level 2 Dense Metrics Overview ─── */}
      <DashboardMetrics
        loading={loading}
        totalModul={stats.totalModul}
        totalMateri={stats.totalMateri}
        totalTugas={stats.totalTugas}
        totalFile={stats.totalFile}
      />

      {/* ─── 4. Main 2-Column Academic Workspace Hub ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Core Modules (Level 2) & Recent Readings (Level 3) */}
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

        {/* Right Column (4 cols): Active Tasks (Level 2) & Quick Tools (Level 3) */}
        <div className="lg:col-span-4 space-y-6">
          <DashboardTasksList
            loading={loading}
            tasks={stats.recentTasks}
          />

          <DashboardQuickTools />
        </div>
      </div>
    </div>
  );
}
