"use client";

import React, { useState } from "react";
import { DashboardHeader } from "./dashboard-header";
import { DashboardFocus } from "./dashboard-focus";
import { DashboardMetrics } from "./dashboard-metrics";
import { DashboardTodaySchedule } from "./dashboard-today-schedule";
import { DashboardModulesList } from "./dashboard-modules-list";
import { DashboardRecentViews } from "./dashboard-recent-views";
import { DashboardTasksList } from "./dashboard-tasks-list";
import { DashboardQuickTools } from "./dashboard-quick-tools";
import { DashboardRightRail } from "./dashboard-right-rail";
import { DashboardAnalyticsTab } from "./dashboard-analytics-tab";
import type {
  DashboardCategoryFilter,
  DashboardStatsData,
} from "./dashboard-utils";

interface DesktopDashboardViewProps {
  userName: string;
  stats: DashboardStatsData;
  loading: boolean;
  isBrandNewWorkspace: boolean;
  activeTab?: "overview" | "statistik";
  onTabChange?: (tab: "overview" | "statistik") => void;
}

export function DesktopDashboardView({
  userName,
  stats,
  loading,
  isBrandNewWorkspace,
  activeTab = "overview",
  onTabChange,
}: DesktopDashboardViewProps) {
  const [categoryFilter, setCategoryFilter] =
    useState<DashboardCategoryFilter>("semua");

  // Keep external URL ?tab=statistik synchronized with the integrated filter pills
  const effectiveFilter: DashboardCategoryFilter =
    activeTab === "statistik" ? "statistik" : categoryFilter;

  const handleFilterChange = (nextFilter: DashboardCategoryFilter) => {
    if (nextFilter === "statistik") {
      onTabChange?.("statistik");
      return;
    }
    if (activeTab === "statistik") {
      onTabChange?.("overview");
    }
    setCategoryFilter(nextFilter);
  };

  return (
    <div className="pb-14 animate-fade-in max-w-[1560px] mx-auto">
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* ─── MAIN PORTAL WORKSPACE (CENTER) ─── */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* 1. Academic Portal Header + Category Pill Tabs */}
          <DashboardHeader
            userName={userName}
            totalModul={stats.totalModul}
            activeFilter={effectiveFilter}
            onFilterChange={handleFilterChange}
          />

          {effectiveFilter === "statistik" ? (
            <DashboardAnalyticsTab />
          ) : (
            <>
              {/* 2. Hero Priority Banner (Border Kiri Terracotta) */}
              <DashboardFocus
                loading={loading}
                recentModules={stats.recentModules}
                recentTasks={stats.recentTasks}
                recentViews={stats.recentViews}
                todaySchedules={stats.todaySchedules}
                isBrandNew={isBrandNewWorkspace}
              />

              {/* 3. Primary 2-Column Feed: Jadwal Hari Ini & Tenggat Terdekat */}
              {(effectiveFilter === "semua" ||
                effectiveFilter === "jadwal" ||
                effectiveFilter === "tugas") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-fr">
                  {(effectiveFilter === "semua" ||
                    effectiveFilter === "jadwal") && (
                    <DashboardTodaySchedule
                      loading={loading}
                      todaySchedules={stats.todaySchedules || []}
                      upcomingSchedules={stats.upcomingSchedules || []}
                      activeModule={stats.recentModules?.[0]}
                    />
                  )}

                  {(effectiveFilter === "semua" ||
                    effectiveFilter === "tugas") && (
                    <DashboardTasksList
                      loading={loading}
                      tasks={stats.recentTasks}
                    />
                  )}
                </div>
              )}

              {/* 4. Dense Academic Metrics Strip (only on 'semua') */}
              {effectiveFilter === "semua" && (
                <DashboardMetrics
                  loading={loading}
                  totalModul={stats.totalModul}
                  totalMateri={stats.totalMateri}
                  totalTugas={stats.totalTugas}
                  totalFile={stats.totalFile}
                />
              )}

              {/* 5. Secondary Academic Feeds (filtered per tab) */}
              {effectiveFilter === "ujian" ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  <div className="lg:col-span-7">
                    <DashboardQuickTools />
                  </div>
                  <div className="lg:col-span-5">
                    <DashboardTasksList
                      loading={loading}
                      tasks={stats.recentTasks}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {(effectiveFilter === "semua" ||
                    effectiveFilter === "modul") && (
                    <div
                      className={
                        effectiveFilter === "modul"
                          ? "lg:col-span-12"
                          : "lg:col-span-7"
                      }
                    >
                      <DashboardModulesList
                        loading={loading}
                        modules={stats.recentModules}
                      />
                    </div>
                  )}

                  {(effectiveFilter === "semua" ||
                    effectiveFilter === "jadwal") && (
                    <div
                      className={
                        effectiveFilter === "jadwal"
                          ? "lg:col-span-12"
                          : "lg:col-span-5"
                      }
                    >
                      <DashboardRecentViews
                        loading={loading}
                        views={stats.recentViews}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ─── RIGHT CONTEXTUAL RAIL (Active Emblem + Hari Ini/Detail + Academic Card) ─── */}
        {effectiveFilter !== "statistik" && (
          <DashboardRightRail
            userName={userName}
            loading={loading}
            totalModul={stats.totalModul}
            totalTugas={stats.totalTugas}
            totalMateri={stats.totalMateri}
            recentModules={stats.recentModules}
            recentTasks={stats.recentTasks}
            recentViews={stats.recentViews}
            todaySchedules={stats.todaySchedules || []}
          />
        )}
      </div>
    </div>
  );
}
