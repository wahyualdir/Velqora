"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Code2, ChevronRight, Bookmark, CheckCircle2, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileModuleListProps {
  modules: any[];
  bookmarkMap: { [id: string]: boolean };
  onToggleBookmark: (mod: any) => void;
}

export function MobileModuleList({
  modules,
  bookmarkMap,
  onToggleBookmark,
}: MobileModuleListProps) {
  return (
    <div className="space-y-3 pb-8">
      <Card padding="none" className="divide-y divide-border/60">
        {modules.map((mod) => {
          const isProject = mod.kind === "project";
          const chapters = mod.chapters || [];
          const totalChapters = chapters.length;
          const completedChapters = chapters.filter((c: any) => c.is_completed).length;
          const progressPercent = totalChapters > 0
            ? Math.round((completedChapters / totalChapters) * 100)
            : 0;

          return (
            <Link
              key={mod.id}
              href={`/dashboard/modul/${mod.id}`}
              className="p-4 hover:bg-surface-secondary/40 active:bg-surface-secondary/70 transition-colors block"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5",
                      isProject
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                        : "bg-brand-500/10 border-brand-500/20 text-brand-500"
                    )}
                  >
                    {isProject ? (
                      <Code2 className="w-4 h-4" />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.2 rounded bg-surface-secondary text-text-tertiary uppercase">
                        {mod.category?.name || "Modul"}
                      </span>
                      {mod.level && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-500">
                          {mod.level}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs font-bold text-text-primary truncate font-display">
                      {mod.title}
                    </h3>

                    {mod.description && (
                      <p className="text-[11px] text-text-tertiary line-clamp-2 leading-relaxed">
                        {mod.description}
                      </p>
                    )}

                    {/* Progress Bar & Lesson Count */}
                    <div className="pt-2 space-y-1">
                      <div className="flex items-center justify-between text-[10.5px] text-text-tertiary font-mono">
                        <span>
                          {totalChapters > 0
                            ? `${completedChapters} / ${totalChapters} Bab Selesai`
                            : "Kurikulum Aktif"}
                        </span>
                        {totalChapters > 0 && (
                          <span className="font-semibold text-brand-500">
                            {progressPercent}%
                          </span>
                        )}
                      </div>
                      {totalChapters > 0 && (
                        <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
                          <div
                            className="h-full bg-brand-500 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center pt-2">
                  <ChevronRight className="w-4 h-4 text-text-tertiary" />
                </div>
              </div>
            </Link>
          );
        })}
      </Card>
    </div>
  );
}
