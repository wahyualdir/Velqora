"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertTriangle, Clock, Sparkles } from "lucide-react";
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

  // Styling badge tingkat kesulitan (Level)
  const getLevelBadgeStyle = (level?: TopicLevel) => {
    switch (level) {
      case "Pemula":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
      case "Lanjut":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30";
      case "Menengah":
      default:
        return "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30";
    }
  };

  const isComingSoon = statusMeta.status === "coming_soon" || statusMeta.status === "under_review";
  const isInProgress = statusMeta.status === "in_development" || statusMeta.status === "in_progress";
  const isVerified = statusMeta.status === "verified";

  return (
    <Link
      href={href}
      className="group block p-4 sm:p-5 vt-window bg-[#FFFFFF] dark:bg-[#18181B] hover:bg-[#FAF8F5] dark:hover:bg-[#202024] transition-all relative overflow-hidden border border-border flex flex-col justify-between h-full"
      style={{
        borderTopWidth: "3px",
        borderTopColor: category.color,
      }}
    >
      <div>
        {/* Header Baris 1: Icon & Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border shadow-xs"
            style={{
              backgroundColor: `${category.color}15`,
              borderColor: `${category.color}35`,
              color: category.color,
            }}
          >
            <IconComponent className="w-5 h-5 transition-transform group-hover:scale-110 duration-200" />
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {/* Badge Topik Baru */}
              {category.isNew && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>BARU</span>
                </span>
              )}

              {/* Badge Level */}
              {category.level && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded border ${getLevelBadgeStyle(
                    category.level
                  )}`}
                >
                  {category.level}
                </span>
              )}

              {/* Badge Jumlah Bab Terhitung Nyata */}
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
            </div>

            {/* Status Badge */}
            {isVerified && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                <span>{statusMeta.badgeLabel || "Terverifikasi"}</span>
              </span>
            )}

            {isInProgress && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                <Clock className="w-2.5 h-2.5 shrink-0" />
                <span>{statusMeta.badgeLabel || "Progres"}</span>
              </span>
            )}

            {isComingSoon && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                <span>{statusMeta.badgeLabel || "Segera Hadir"}</span>
              </span>
            )}
          </div>
        </div>

        {/* Konten Judul & Deskripsi */}
        <div className="space-y-1.5">
          <h3
            className="font-bold text-sm sm:text-base text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 min-h-[2.5rem] flex items-center leading-snug"
            title={category.name}
          >
            {category.name}
          </h3>

          <p className="text-[11px] text-text-tertiary font-mono line-clamp-2 leading-relaxed">
            {statusMeta.shortDescription}
          </p>

          {/* Indikator Bab Lanjutan / Integrasi */}
          {category.absorbedTopics && category.absorbedTopics.length > 0 && (
            <div className="pt-1 flex flex-wrap items-center gap-1 text-[10px] font-mono text-text-secondary">
              <span className="text-text-tertiary font-medium">Termasuk:</span>
              {category.absorbedTopics.map((item, idx) => (
                <span
                  key={idx}
                  className="px-1 py-0.2 rounded bg-surface/80 border border-border text-[9.5px]"
                >
                  +{item}
                </span>
              ))}
            </div>
          )}

          {/* Indikator Topik Hasil Penggabungan */}
          {category.mergedFrom && category.mergedFrom.length > 0 && (
            <div className="pt-1 flex flex-wrap items-center gap-1 text-[10px] font-mono text-text-secondary">
              <span className="text-text-tertiary font-medium">Peleburan:</span>
              <span className="truncate text-[9.5px]">
                {category.mergedFrom.join(" & ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Kartu */}
      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-mono text-text-tertiary group-hover:text-brand-600 dark:group-hover:text-brand-400">
        <div className="flex items-center gap-1 text-[10px]">
          {category.careerPaths && category.careerPaths.length > 0 && (
            <span className="truncate max-w-[170px] text-text-tertiary">
              {category.careerPaths.slice(0, 2).join(" • ")}
              {category.careerPaths.length > 2 ? ` +${category.careerPaths.length - 2}` : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 font-medium shrink-0">
          <span>Buka Topik</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
