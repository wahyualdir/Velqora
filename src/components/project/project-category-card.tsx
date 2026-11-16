"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { getCategoryIconComponent } from "@/components/modul/category-icon";

export interface ProjectCategoryItem {
  id: string;
  name: string;
  color: string;
  icon: string;
  projectCount: number;
}

interface ProjectCategoryCardProps {
  category: ProjectCategoryItem;
  onClick?: () => void;
}

export function ProjectCategoryCard({ category, onClick }: ProjectCategoryCardProps) {
  const IconComponent = getCategoryIconComponent(category.icon);

  return (
    <div
      onClick={onClick}
      className="group block p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] hover:bg-[#FAF8F5] dark:hover:bg-[#1C1917] transition-all relative overflow-hidden border border-[#E6E0D6] dark:border-[#24201E] hover:border-[#C2553A]/35 dark:hover:border-[#3A3431] cursor-pointer shadow-xs"
    >
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: `${category.color}15`,
            color: category.color,
          }}
        >
          <IconComponent className="w-5 h-5 transition-transform group-hover:scale-105 duration-200" />
        </div>

        <span
          className="px-2.5 py-0.5 text-xs font-sans font-medium rounded-full"
          style={{
            backgroundColor: `${category.color}14`,
            color: category.color,
          }}
        >
          {category.projectCount} proyek
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-base text-text-primary group-hover:text-[#C2553A] dark:group-hover:text-[#F09A82] transition-colors line-clamp-1">
          {category.name}
        </h3>
        <p className="text-xs text-text-secondary line-clamp-1">
          Portofolio &amp; repositori terapan
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-sans text-text-tertiary group-hover:text-[#C2553A] dark:group-hover:text-[#F09A82] transition-colors">
        <span className="font-medium">Lihat Proyek</span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
