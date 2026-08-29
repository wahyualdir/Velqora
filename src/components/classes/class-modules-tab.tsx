"use client";

import React from "react";
import Link from "next/link";
import { Layers, ArrowRight, BookOpen, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface ClassModulesTabProps {
  modules: any[];
  subject: string;
}

export function ClassModulesTab({ modules, subject }: ClassModulesTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-text-secondary">
          Modul & Proyek Terkait ({subject})
        </h3>

        <Link href="/dashboard/modul/baru">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <Layers className="w-3.5 h-3.5" />
            <span>Jelajahi Modul</span>
          </Button>
        </Link>
      </div>

      {modules.length === 0 ? (
        <EmptyState
          icon={<Layers className="w-8 h-8" />}
          title="Belum ada modul"
          description="Belum ada modul pembelajaran yang terhubung dengan ruang kelas ini."
          action={
            <Link href="/dashboard/modul">
              <Button size="sm" variant="outline" className="text-xs">
                Buka Katalog Modul
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="p-4 sm:p-5 rounded-xl border border-border bg-surface hover:border-brand-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-surface-secondary border border-border flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0 mt-0.5">
                  {mod.kind === "project" ? (
                    <Code2 className="w-4 h-4" />
                  ) : (
                    <BookOpen className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-[10px]">
                      {mod.kind === "project" ? "Proyek Kode" : "Modul Belajar"}
                    </Badge>
                    {mod.level && (
                      <Badge variant="neutral" className="text-[10px]">
                        {mod.level}
                      </Badge>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-text-primary tracking-tight">
                    {mod.title}
                  </h4>

                  {mod.description && (
                    <p className="text-xs text-text-secondary line-clamp-1">
                      {mod.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-center">
                <Link href={`/dashboard/modul?search=${encodeURIComponent(mod.title)}`}>
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                    <span>Buka Modul</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
