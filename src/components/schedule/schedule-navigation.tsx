"use client";

import React from "react";

export const DAYS = [
  "Semua",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

interface ScheduleNavigationProps {
  selectedDay: string;
  onSelectDay: (day: string) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
}

export function ScheduleNavigation({
  selectedDay,
  onSelectDay,
  selectedType,
  onSelectType,
}: ScheduleNavigationProps) {
  return (
    <div className="space-y-3 p-3.5 sm:p-4 rounded-2xl border border-[#E6E0D6] dark:border-[#24201E] bg-surface shadow-xs">
      {/* Day Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
        {DAYS.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDay(day)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#C2553A] text-white font-semibold shadow-xs"
                  : "bg-surface-secondary/70 hover:bg-surface-secondary text-text-secondary hover:text-text-primary border border-border/60"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Type Filter Selector */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/60">
        <span className="text-xs font-sans font-medium text-text-tertiary shrink-0">
          Tipe Agenda:
        </span>

        <div className="flex items-center gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => onSelectType("")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              selectedType === ""
                ? "bg-surface-secondary text-text-primary border border-border font-semibold"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => onSelectType("jadwal")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              selectedType === "jadwal"
                ? "bg-surface-secondary text-text-primary border border-border font-semibold"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            Jadwal Kuliah
          </button>
          <button
            type="button"
            onClick={() => onSelectType("reminder")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              selectedType === "reminder"
                ? "bg-surface-secondary text-text-primary border border-border font-semibold"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            Pengingat
          </button>
        </div>
      </div>
    </div>
  );
}
