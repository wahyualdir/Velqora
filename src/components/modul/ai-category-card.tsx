"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategoryIconComponent } from "./category-icon";

export interface AiCategoryItem {
  id: string;
  name: string;
  color: string;
  icon: string;
  moduleCount: number;
}

interface AiCategoryCardProps {
  category: AiCategoryItem;
}

export function AiCategoryCard({ category }: AiCategoryCardProps) {
  const IconComponent = getCategoryIconComponent(category.icon);
  const href = `/dashboard/modul/kategori/${encodeURIComponent(category.id || category.name)}`;

  return (
    <Link
      href={href}
      className="group block p-4 sm:p-5 vt-window bg-[#FFFFFF] dark:bg-[#18181B] hover:bg-[#FAF8F5] dark:hover:bg-[#202024] transition-all relative overflow-hidden border border-border"
      style={{
        borderTopWidth: "3px",
        borderTopColor: category.color,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
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

        <span
          className="px-2 py-0.5 text-[11px] font-mono font-bold rounded border"
          style={{
            backgroundColor: `${category.color}10`,
            borderColor: `${category.color}30`,
            color: category.color,
          }}
        >
          {category.moduleCount} Modul
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-sm sm:text-base text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-text-secondary line-clamp-1 font-mono">
          Kurikulum & Praktikum AI
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-mono text-text-tertiary group-hover:text-brand-600 dark:group-hover:text-brand-400">
        <span className="font-medium">Buka Topik</span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
