"use client";

import React from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFocus } from "@/components/dashboard/dashboard-focus";
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics";
import { DashboardModulesList } from "@/components/dashboard/dashboard-modules-list";
import { DashboardRecentViews } from "@/components/dashboard/dashboard-recent-views";
import { DashboardTasksList } from "@/components/dashboard/dashboard-tasks-list";
import { DashboardQuickTools } from "@/components/dashboard/dashboard-quick-tools";

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
    <div className="space-y-6 sm:space-y-7 pb-14 animate-fade-in">
      {/* ─── 1. Desktop Workspace Header ─── */}
      <DashboardHeader userName={userName} />

      {/* ─── 2. Primary Focus: Continue Learning / Active Subject ─── */}
      <DashboardFocus
        loading={loading}
        recentModules={stats.recentModules}
        recentTasks={stats.recentTasks}
        recentViews={stats.recentViews}
        isBrandNew={isBrandNewWorkspace}
      />

      {/* ─── 3. Dense Metrics Overview ─── */}
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
    </div>
  );
}
