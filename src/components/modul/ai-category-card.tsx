"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { getCategoryIconComponent } from "./category-icon";
import { getTopicStatus, TopicStatusMeta } from "@/lib/curriculum/status";

export interface AiCategoryItem {
  id: string;
  name: string;
  color: string;
  icon: string;
  moduleCount: number;
  statusMeta?: TopicStatusMeta;
}

interface AiCategoryCardProps {
  category: AiCategoryItem;
}

export function AiCategoryCard({ category }: AiCategoryCardProps) {
  const IconComponent = getCategoryIconComponent(category.icon);
  const href = `/dashboard/modul/kategori/${encodeURIComponent(category.id || category.name)}`;
  const statusMeta = category.statusMeta || getTopicStatus(category.id || category.name);

  return (
    <Link
      href={href}
      className="group block p-4 sm:p-5 vt-window bg-[#FFFFFF] dark:bg-[#18181B] hover:bg-[#FAF8F5] dark:hover:bg-[#202024] transition-all relative overflow-hidden border border-border flex flex-col justify-between"
      style={{
        borderTopWidth: "3px",
        borderTopColor: category.color,
      }}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: `${category.color}15`,
              borderColor: `${category.color}35`,
              color: category.color,
            }}
          >
            <IconComponent className="w-5 h-5 transition-transform group-hover:scale-110 duration-200" />
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span
              className="px-2 py-0.5 text-[11px] font-mono font-bold rounded border"
              style={{
                backgroundColor: `${category.color}10`,
                borderColor: `${category.color}30`,
                color: category.color,
              }}
            >
              {category.moduleCount} Bab
            </span>

            {/* Status Badge Transparan */}
            {statusMeta.status === "verified" && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                <span>{statusMeta.badgeLabel}</span>
              </span>
            )}
            {statusMeta.status === "under_review" && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                <span>{statusMeta.badgeLabel}</span>
              </span>
            )}
            {statusMeta.status === "in_development" && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                <Clock className="w-2.5 h-2.5 shrink-0" />
                <span>{statusMeta.badgeLabel}</span>
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-bold text-sm sm:text-base text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
            {category.name}
          </h3>
          <p className="text-[11px] text-text-tertiary font-mono line-clamp-2 leading-relaxed">
            {statusMeta.shortDescription}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-mono text-text-tertiary group-hover:text-brand-600 dark:group-hover:text-brand-400">
        <span className="font-medium">Buka Topik</span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

