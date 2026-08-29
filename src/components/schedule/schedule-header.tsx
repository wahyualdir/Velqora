"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Sparkles, UploadCloud, ChevronDown, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleClassroomIcon } from "@/components/ui/brand-logos";

interface ScheduleHeaderProps {
  onOpenAddModal: () => void;
  onOpenImportModal?: () => void;
  onOpenGeneratorModal?: () => void;
  onOpenHistoryModal?: () => void;
  onOpenClassroom?: () => void;
  isClassroomConnected?: boolean;
}

export function ScheduleHeader({
  onOpenAddModal,
  onOpenImportModal,
  onOpenGeneratorModal,
  onOpenHistoryModal,
  onOpenClassroom,
  isClassroomConnected = false,
}: ScheduleHeaderProps) {
  const [showAutoDropdown, setShowAutoDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAutoDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="space-y-4 border-b border-border/70 pb-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              Jadwal Akademik
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight font-display">
            Jadwal
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
            Kelola agenda perkuliahan, import berkas jadwal otomatis, dan susun waktu belajar bebas bentrok.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {onOpenClassroom && (
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenClassroom}
              className="gap-1.5 text-xs text-text-secondary hover:text-text-primary"
            >
              <GoogleClassroomIcon className="w-3.5 h-3.5" />
              <span>{isClassroomConnected ? "Classroom Terhubung" : "Hubungkan Classroom"}</span>
            </Button>
          )}

          {/* Automatic Scheduling Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAutoDropdown(!showAutoDropdown)}
              className="gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 border-brand-500/30 hover:bg-brand-500/10 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Buat Jadwal Otomatis</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
            </Button>

            {showAutoDropdown && (
              <div className="absolute right-0 mt-1.5 w-64 rounded-xl border border-border bg-surface p-1.5 shadow-xl z-50 animate-in fade-in-0 zoom-in-95">
                {onOpenImportModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAutoDropdown(false);
                      onOpenImportModal();
                    }}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-surface-secondary text-left transition-colors cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5">
                      <UploadCloud className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-text-primary group-hover:text-brand-500 transition-colors">
                        Import Berkas Jadwal
                      </span>
                      <p className="text-[11px] text-text-tertiary leading-snug">
                        Ekstrak jadwal dari PDF, Word, Excel, CSV, TXT, atau gambar.
                      </p>
                    </div>
                  </button>
                )}

                {onOpenGeneratorModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAutoDropdown(false);
                      onOpenGeneratorModal();
                    }}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-surface-secondary text-left transition-colors cursor-pointer group mt-0.5"
                  >
                    <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                      <CalendarPlus className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-text-primary group-hover:text-indigo-500 transition-colors">
                        Susun Jadwal Otomatis AI
                      </span>
                      <p className="text-[11px] text-text-tertiary leading-snug">
                        Rencanakan target belajar bebas bentrok waktu.
                      </p>
                    </div>
                  </button>
                )}

                {onOpenHistoryModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAutoDropdown(false);
                      onOpenHistoryModal();
                    }}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-surface-secondary text-left transition-colors cursor-pointer group mt-0.5 border-t border-border/60 pt-2"
                  >
                    <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                      <UploadCloud className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-text-primary group-hover:text-amber-500 transition-colors">
                        Riwayat Import Dokumen
                      </span>
                      <p className="text-[11px] text-text-tertiary leading-snug">
                        Lihat arsip berkas jadwal yang pernah diimport.
                      </p>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={onOpenAddModal}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Manual</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
