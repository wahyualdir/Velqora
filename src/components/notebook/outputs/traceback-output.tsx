"use client";

import React, { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronRight, Sparkles } from "lucide-react";

interface TracebackOutputProps {
  ename: string;
  evalue: string;
  traceback: string[];
  lineNumber?: number;
  onAskAiFix?: (errorSummary: string) => void;
}

export function TracebackOutput({
  ename,
  evalue,
  traceback,
  lineNumber,
  onAskAiFix,
}: TracebackOutputProps) {
  const [expanded, setExpanded] = useState(true);
  const fullError = `${ename}: ${evalue}${traceback.length ? `\n${traceback.join("\n")}` : ""}`;

  return (
    <div className="rounded-xl border border-rose-500/35 bg-rose-500/8 dark:bg-rose-950/25 overflow-hidden font-mono text-xs">
      <div className="px-3 py-2 border-b border-rose-500/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 text-rose-700 dark:text-rose-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="font-bold truncate">
            {ename}: {evalue}
          </span>
          {lineNumber ? (
            <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-[10px] shrink-0">
              Baris {lineNumber}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onAskAiFix && (
            <button
              type="button"
              onClick={() => onAskAiFix(fullError)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#C2553A] hover:bg-[#D4664A] text-white text-[11px] font-semibold cursor-pointer transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Perbaiki dengan AI</span>
            </button>
          )}
          {traceback.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((p) => !p)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-rose-500/30 text-rose-700 dark:text-rose-300 text-[10.5px] cursor-pointer"
            >
              {expanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              <span>Traceback</span>
            </button>
          )}
        </div>
      </div>

      {expanded && traceback.length > 0 && (
        <pre className="p-3 overflow-x-auto text-[11px] leading-relaxed text-rose-800 dark:text-rose-200 whitespace-pre-wrap break-words max-h-[260px]">
          {traceback.join("\n")}
        </pre>
      )}
    </div>
  );
}
