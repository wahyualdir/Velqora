"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertTriangle, Clock, FileCode2 } from "lucide-react";
import { getCategoryIconComponent } from "./category-icon";
import { getTopicStatus, TopicStatusMeta } from "@/lib/curriculum/status";
import { CareerPath, TopicLevel } from "@/lib/curriculum/catalog";

export interface AiCategoryItem {
  id: string;
  name: string;
  color: string;
  icon: string;
  moduleCount: number;
  statusMeta?: TopicStatusMeta;
  level?: TopicLevel;
  careerPaths?: CareerPath[];
  isNew?: boolean;
  absorbedTopics?: string[];
  mergedFrom?: string[];
  group?: string;
}

interface AiCategoryCardProps {
  category: AiCategoryItem;
}

export function AiCategoryCard({ category }: AiCategoryCardProps) {
  const IconComponent = getCategoryIconComponent(category.icon);
  const href = `/dashboard/modul/kategori/${encodeURIComponent(category.id || category.name)}`;
  const statusMeta = category.statusMeta || getTopicStatus(category.id || category.name);
  const kodeHref = `/dashboard/kode?topic=${encodeURIComponent(category.id || category.name)}`;

  const getLevelBadgeStyle = (level?: TopicLevel) => {
    switch (level) {
      case "Pemula":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
      case "Lanjut":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300";
      case "Menengah":
      default:
        return "bg-sky-500/10 text-sky-700 dark:text-sky-300";
    }
  };

  const isVerified = statusMeta.status === "verified";
  const isUnderReview = statusMeta.status === "under_review";
  const isInProgress = statusMeta.status === "in_development" || statusMeta.status === "in_progress";
  const isComingSoon = statusMeta.status === "coming_soon";

  return (
    <div className="group p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] hover:bg-[#FAF8F5] dark:hover:bg-[#1C1917] transition-colors border border-[#E6E0D6] dark:border-[#24201E] hover:border-[#C2553A]/35 dark:hover:border-[#D4664A]/40 flex flex-col justify-between h-full shadow-2xs font-sans">
      <Link href={href} className="block flex-1 focus:outline-none">
        {/* Clean Header Row: Icon + Maximum 2 Focused Badges */}
        <div className="flex items-start justify-between gap-2.5 mb-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${category.color}16`,
              color: category.color,
            }}
          >
            <IconComponent className="w-5 h-5 transition-transform group-hover:scale-105 duration-200" />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {category.level && (
              <span
                className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full ${getLevelBadgeStyle(
                  category.level
                )}`}
              >
                {category.level}
              </span>
            )}

            <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-[#F3EFE9] dark:bg-[#1C1917] text-[#5C554E] dark:text-[#A8A29E] tabular-nums">
              {category.moduleCount} Bab
            </span>
          </div>
        </div>

        {/* Clean Title & Readable Sans Description */}
        <div className="space-y-1.5">
          <h3
            className="font-bold text-[15px] sm:text-base text-text-primary group-hover:text-[#C2553A] dark:group-hover:text-[#F09A82] transition-colors line-clamp-2 leading-snug font-display"
            title={category.name}
          >
            {category.name}
          </h3>

          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
            {statusMeta.shortDescription}
          </p>
        </div>
      </Link>

      {/* Calm Card Footer */}
      <div className="mt-4 pt-3 border-t border-[#E6E0D6]/70 dark:border-[#24201E] flex items-center justify-between gap-2 text-xs text-text-secondary">
        <div className="flex items-center gap-1.5 min-w-0">
          {isVerified && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{statusMeta.badgeLabel || "Terverifikasi"}</span>
            </span>
          )}
          {isUnderReview && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-300 truncate">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{statusMeta.badgeLabel || "Review"}</span>
            </span>
          )}
          {(isInProgress || isComingSoon) && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-secondary truncate">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{statusMeta.badgeLabel || "Progres"}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href={kodeHref}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-text-secondary hover:text-[#C2553A] dark:hover:text-[#F09A82] transition-colors"
            title={`Buka Lab Kode ${category.name}`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Kode</span>
          </Link>
          <Link
            href={href}
            className="inline-flex items-center gap-1 font-semibold text-[#C2553A] dark:text-[#F09A82]"
          >
            <span>Buka</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
