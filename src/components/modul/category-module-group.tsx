"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { getCategoryIconComponent } from "./category-icon";
import { ModuleListItem } from "./module-list-item";
import { MobileModuleList } from "@/surfaces/app/modul/mobile-module-list";
import { SurfaceAdaptive } from "@/components/layout/surface-adaptive";
import { ModuleDriveFile } from "@/types/module-drive";
import { getTopicStatus } from "@/lib/curriculum/status";

interface CategoryModuleGroupProps {
  category: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
  modules: any[];
  currentUserId?: string | null;
  isAdmin?: boolean;
  bookmarkMap: { [id: string]: boolean };
  onToggleBookmark: (item: any) => void;
  onEdit: (module: any) => void;
  onDelete: (id: string) => void;
  onFilePreview?: (file: ModuleDriveFile) => void;
}

export function CategoryModuleGroup({
  category,
  modules,
  currentUserId,
  isAdmin = false,
  bookmarkMap,
  onToggleBookmark,
  onEdit,
  onDelete,
  onFilePreview,
}: CategoryModuleGroupProps) {
  const IconComponent = getCategoryIconComponent(category.icon);
  const href = `/dashboard/modul/kategori/${encodeURIComponent(category.id || category.name)}`;
  const statusMeta = getTopicStatus(category.id || category.name);

  return (
    <div className="rounded-2xl overflow-hidden bg-surface border border-[#E6E0D6] dark:border-[#24201E] mb-6 shadow-xs">
      {/* Group Header Banner */}
      <div className="p-4 sm:p-5 bg-surface border-b border-[#E6E0D6] dark:border-[#24201E] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: `${category.color}15`,
              borderColor: `${category.color}30`,
              color: category.color,
            }}
          >
            <IconComponent className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm sm:text-base text-text-primary truncate">
                {category.name}
              </h3>
              <span
                className="px-2 py-0.5 text-[11px] font-medium rounded-full shrink-0"
                style={{
                  backgroundColor: `${category.color}14`,
                  color: category.color,
                }}
              >
                {modules.length} konten
              </span>

              {/* Status Badge */}
              {statusMeta.status === "verified" && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>{statusMeta.badgeLabel}</span>
                </span>
              )}
              {statusMeta.status === "under_review" && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{statusMeta.badgeLabel}</span>
                </span>
              )}
              {statusMeta.status === "in_development" && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-400 shrink-0">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span>{statusMeta.badgeLabel}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#C2553A] dark:text-[#F09A82] hover:underline shrink-0"
        >
          <span>Detail Topik</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Modules List Inside Group */}
      <div className="p-3 sm:p-4 space-y-3">
        <SurfaceAdaptive
          web={
            <div className="space-y-3">
              {modules.map((mod) => (
                <ModuleListItem
                  key={mod.id}
                  module={mod}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  isBookmarked={Boolean(bookmarkMap[mod.id])}
                  onToggleBookmark={onToggleBookmark}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onFilePreview={onFilePreview}
                />
              ))}
            </div>
          }
          app={
            <MobileModuleList
              modules={modules}
              bookmarkMap={bookmarkMap}
              onToggleBookmark={onToggleBookmark}
            />
          }
        />
      </div>
    </div>
  );
}
