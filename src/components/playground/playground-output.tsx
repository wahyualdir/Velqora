"use client";

import React from "react";
import { Terminal, Trash2, Clock, AlertCircle } from "lucide-react";
import type { ExecutionResult } from "@/lib/code-runner";

interface PlaygroundOutputProps {
  result: ExecutionResult | null;
  onClear: () => void;
  isRunning: boolean;
}

export function PlaygroundOutput({ result, onClear, isRunning }: PlaygroundOutputProps) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-2xs flex flex-col h-[320px] sm:h-[360px]">
      {/* Terminal Header */}
      <div className="p-3 border-b border-border bg-surface-secondary/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary">
            Konsol Keluaran
          </span>
        </div>

        <div className="flex items-center gap-2">
          {result && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-text-secondary px-2 py-0.5 rounded bg-surface border border-border">
              <Clock className="w-3 h-3 text-text-tertiary" />
              <span>{result.executionTimeMs} ms</span>
            </div>
          )}

          {result && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
              title="Bersihkan konsol"
              aria-label="Bersihkan konsol"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed bg-surface-secondary/20 scrollbar-thin">
        {isRunning ? (
          <div className="h-full flex items-center justify-center text-text-secondary gap-2 animate-pulse font-mono">
            <Terminal className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Mengeksekusi program di sandbox browser...</span>
          </div>
        ) : !result ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-text-tertiary space-y-1.5 font-sans">
            <Terminal className="w-6 h-6 text-text-tertiary" />
            <p className="text-xs">Konsol siap.</p>
            <p className="text-[11px] text-text-tertiary">
              Klik &ldquo;Jalankan Kode&rdquo; atau tekan <kbd className="px-1 rounded border border-border bg-surface">Ctrl+Enter</kbd> untuk mengeksekusi.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Standard Output */}
            {result.output && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-text-tertiary block select-none">
                  STDOUT:
                </span>
                <pre className="text-text-primary whitespace-pre-wrap break-words bg-surface p-3 rounded-lg border border-border">
                  {result.output}
                </pre>
              </div>
            )}

            {/* Error Output */}
            {result.error && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-500 block select-none flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  STDERR (Error):
                </span>
                <pre className="text-rose-600 dark:text-rose-400 whitespace-pre-wrap break-words bg-rose-500/5 p-3 rounded-lg border border-rose-500/20">
                  {result.error}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
