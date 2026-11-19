"use client";

import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
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
  badTitle = "ANTI-PATTERN: KODE KELIRU / DATA LEAKAGE",
  badExplanation,
  goodCode,
  goodTitle = "PRODUCTION-SAFE PIPELINE (STANDAR INDUSTRI)",
  goodExplanation,
  language = "python",
  className = "",
}: SideBySideDiffProps) {
  return (
    <div className={`my-6 space-y-2 select-text not-prose ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Left Column: Anti-Pattern / Silent Bug */}
        <div className="flex flex-col rounded-2xl border border-[#F87171]/35 bg-[#F87171]/[0.04] dark:bg-[#141210] overflow-hidden shadow-xs">
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#F87171]/12 border-b border-[#F87171]/25 text-rose-700 dark:text-[#F87171]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="font-mono text-[11px] font-bold tracking-wide uppercase truncate">
              {badTitle}
            </span>
          </div>

          {badExplanation && (
            <div className="px-3.5 py-2 text-xs text-rose-800 dark:text-[#FCA5A5] bg-[#F87171]/5 border-b border-[#F87171]/20 leading-relaxed">
              {badExplanation}
            </div>
          )}

          <div className="p-2 bg-[#141210] flex-1">
            <CodeBlock
              code={badCode}
              language={language}
              title="anti_pattern_bug.py"
              className="!my-0 !border-[#F87171]/25"
            />
          </div>
        </div>

        {/* Right Column: Production-Safe */}
        <div className="flex flex-col rounded-2xl border border-[#34D399]/35 bg-[#34D399]/[0.04] dark:bg-[#141210] overflow-hidden shadow-xs">
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#34D399]/12 border-b border-[#34D399]/25 text-emerald-700 dark:text-[#34D399]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-mono text-[11px] font-bold tracking-wide uppercase truncate">
              {goodTitle}
            </span>
          </div>

          {goodExplanation && (
            <div className="px-3.5 py-2 text-xs text-emerald-800 dark:text-[#6EE7B7] bg-[#34D399]/5 border-b border-[#34D399]/20 leading-relaxed">
              {goodExplanation}
            </div>
          )}

          <div className="p-2 bg-[#141210] flex-1">
            <CodeBlock
              code={goodCode}
              language={language}
              title="production_safe_pipeline.py"
              className="!my-0 !border-[#34D399]/25"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
