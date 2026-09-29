"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck } from "lucide-react";
import { CodeBlock } from "./code-block";

interface SideBySideDiffProps {
  badCode: string;
  badTitle?: string;
  badExplanation?: string;
  goodCode: string;
  goodTitle?: string;
  goodExplanation?: string;
  language?: string;
  className?: string;
}

export function SideBySideDiff({
  badCode,
  badTitle = "PERINGATAN: KODE KELIRU / DATA LEAKAGE",
  badExplanation,
  goodCode,
  goodTitle = "STANDAR INDUSTRI / PRODUCTION-SAFE PIPELINE",
  goodExplanation,
  language = "python",
  className = "",
}: SideBySideDiffProps) {
  return (
    <div className={`my-6 space-y-2 select-text ${className}`}>
      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Left Column: Kode Keliru / Jebakan */}
        <div className="flex flex-col rounded-xl border border-rose-500/40 bg-rose-950/10 dark:bg-rose-950/20 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-rose-500/15 border-b border-rose-500/30 text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-mono text-[11px] font-extrabold tracking-wide uppercase truncate">
              {badTitle}
            </span>
          </div>

          {/* Explanation if provided */}
          {badExplanation && (
            <div className="px-3.5 py-2 text-xs text-rose-300/90 dark:text-rose-200/90 bg-rose-500/5 border-b border-rose-500/20 leading-relaxed">
              {badExplanation}
            </div>
          )}

          {/* Code */}
          <div className="p-2 bg-[#18181B]">
            <CodeBlock
              code={badCode}
              language={language}
              title="anti_pattern_bug.py"
              className="!my-0 !border-rose-900/60"
            />
          </div>
        </div>

        {/* Right Column: Standar Industri / Best Practice */}
        <div className="flex flex-col rounded-xl border border-emerald-500/40 bg-emerald-950/10 dark:bg-emerald-950/20 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-mono text-[11px] font-extrabold tracking-wide uppercase truncate">
              {goodTitle}
            </span>
          </div>

          {/* Explanation if provided */}
          {goodExplanation && (
            <div className="px-3.5 py-2 text-xs text-emerald-300/90 dark:text-emerald-200/90 bg-emerald-500/5 border-b border-emerald-500/20 leading-relaxed">
              {goodExplanation}
            </div>
          )}

          {/* Code */}
          <div className="p-2 bg-[#18181B]">
            <CodeBlock
              code={goodCode}
              language={language}
              title="production_safe_pipeline.py"
              className="!my-0 !border-emerald-900/60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
