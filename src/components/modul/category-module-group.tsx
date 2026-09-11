"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategoryIconComponent } from "./category-icon";
import { ModuleListItem } from "./module-list-item";
import { MobileModuleList } from "@/surfaces/app/modul/mobile-module-list";
import { SurfaceAdaptive } from "@/components/layout/surface-adaptive";
import { ModuleDriveFile } from "@/types/module-drive";

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

  return (
    <div className="vt-window rounded-none overflow-hidden shadow-xs bg-[#FAF8F5] dark:bg-[#121214] border border-border mb-6">
      {/* Group Header Banner */}
      <div className="p-3.5 sm:p-4 bg-[#FFFFFF] dark:bg-[#18181B] border-b border-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: `${category.color}15`,
              borderColor: `${category.color}35`,
              color: category.color,
            }}
          >
            <IconComponent className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-text-primary font-display truncate">
                {category.name}
              </h3>
              <span
                className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded border shrink-0"
                style={{
                  backgroundColor: `${category.color}10`,
                  borderColor: `${category.color}30`,
                  color: category.color,
                }}
              >
                {modules.length} Konten
              </span>
            </div>
          </div>
        </div>

        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-mono font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline shrink-0"
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
