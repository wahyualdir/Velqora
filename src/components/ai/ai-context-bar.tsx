"use client";

import React from "react";
import { BookOpen, Cpu } from "lucide-react";
import type { ModuleKnowledgeItem } from "@/actions/ai-actions";

interface AIContextBarProps {
  userModules: ModuleKnowledgeItem[];
  selectedModuleId: string;
  onSelectModuleId: (id: string) => void;
  aiProvider: "gemini" | "claude";
  onSelectProvider: (provider: "gemini" | "claude") => void;
}

export function AIContextBar({
  userModules,
  selectedModuleId,
  onSelectModuleId,
  aiProvider,
  onSelectProvider,
}: AIContextBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-xl border border-border bg-surface shadow-2xs">
      {/* Left: Module Context Selector */}
      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
        <div className="flex items-center gap-1.5 text-xs text-text-secondary font-mono shrink-0">
          <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span className="hidden sm:inline">Konteks Modul:</span>
        </div>

        <select
          value={selectedModuleId}
          onChange={(e) => onSelectModuleId(e.target.value)}
          className="px-2.5 py-1 min-h-[34px] rounded-lg border border-border bg-surface-secondary text-xs text-text-primary font-medium focus:outline-none focus:border-brand-500 cursor-pointer flex-1 max-w-sm truncate"
          aria-label="Pilih konteks modul pembelajaran"
        >
          <option value="all">Semua Modul Terdaftar ({userModules.length})</option>
          {userModules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title} ({m.level})
            </option>
          ))}
        </select>
      </div>

      {/* Right: AI Engine Selector */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-text-secondary font-mono shrink-0">
          <Cpu className="w-3.5 h-3.5 text-text-tertiary" />
          <span className="hidden sm:inline">Model AI:</span>
        </div>

        <div className="flex items-center gap-1 bg-surface-secondary p-0.5 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => onSelectProvider("gemini")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              aiProvider === "gemini"
                ? "bg-surface text-brand-600 dark:text-brand-400 shadow-2xs border border-border/80"
                : "text-text-tertiary hover:text-text-primary"
            }`}
          >
            Gemini 2.0
          </button>
          <button
            type="button"
            onClick={() => onSelectProvider("claude")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              aiProvider === "claude"
                ? "bg-surface text-brand-600 dark:text-brand-400 shadow-2xs border border-border/80"
                : "text-text-tertiary hover:text-text-primary"
            }`}
          >
            Claude 3.5
          </button>
        </div>
      </div>
    </div>
  );
}
