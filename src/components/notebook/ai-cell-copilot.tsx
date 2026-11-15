"use client";

import React, { useMemo, useState } from "react";
import { diffLines } from "diff";
import { Check, Loader2, Play, Plus, Send, Sparkles, Wand2, Wrench } from "lucide-react";
import type {
  NotebookKernel,
  SqlTableMeta,
  VariableSummary,
} from "@/lib/notebook/types";

interface AICellCopilotProps {
  activeKernel: NotebookKernel;
  activeCellSource: string;
  activeCellError?: string;
  surroundingCode?: string;
  variables: VariableSummary[];
  sqlTables: SqlTableMeta[];
  onApplyPatch?: (patchedCode: string, andRun: boolean) => void;
  onInsertNewCell?: (code: string, kernel: NotebookKernel) => void;
}

export function AICellCopilot({
  activeKernel,
  activeCellSource,
  activeCellError,
  surroundingCode,
  variables,
  sqlTables,
  onApplyPatch,
  onInsertNewCell,
}: AICellCopilotProps) {
  const [promptInput, setPromptInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string>("");
  const [patchedCode, setPatchedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const runAction = async (
    action: "fix_patch" | "generate_cell" | "explain" | "optimize",
    customPrompt?: string
  ) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/notebook/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          kernel: activeKernel,
          cellSource: activeCellSource,
          errorText: activeCellError,
          userPrompt: customPrompt ?? promptInput,
          surroundingCode,
          variables,
          sqlTables,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Permintaan AI gagal diproses.");
      }
      setExplanation(json.explanation || "");
      setPatchedCode(json.patchedCode || null);
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal menghubungi AI Copilot.");
    } finally {
      setLoading(false);
    }
  };

  const diffPreview = useMemo(() => {
    if (!patchedCode) return [];
    return diffLines(activeCellSource || "", patchedCode);
  }, [activeCellSource, patchedCode]);

  return (
    <div className="space-y-3">
      {/* Quick Action Pills */}
      <div className="flex flex-wrap gap-1.5">
        {activeCellError && (
          <button
            type="button"
            disabled={loading}
            onClick={() => runAction("fix_patch")}
            className="min-h-[34px] px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Wrench className="w-3 h-3" />
            <span>Perbaiki Error Sel</span>
          </button>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={() => runAction("explain")}
          className="min-h-[34px] px-2.5 py-1 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-[11px] font-mono font-medium text-text-primary inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3 h-3 text-[#C2553A]" />
          <span>Jelaskan Sel</span>
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => runAction("optimize")}
          className="min-h-[34px] px-2.5 py-1 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-[11px] font-mono font-medium text-text-primary inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Wand2 className="w-3 h-3 text-[#C2553A]" />
          <span>Optimalkan Kode</span>
        </button>
      </div>

      {/* Prompt Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!promptInput.trim()) return;
          void runAction("generate_cell", promptInput);
        }}
        className="flex gap-1.5"
      >
        <input
          type="text"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          placeholder={`Minta AI membuat / ubah kode ${activeKernel}...`}
          className="flex-1 min-h-[38px] px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-sans text-text-primary focus:outline-hidden focus:border-[#C2553A]"
        />
        <button
          type="submit"
          disabled={loading || !promptInput.trim()}
          className="min-h-[38px] px-3 rounded-xl bg-[#C2553A] hover:bg-[#D4664A] text-white text-xs font-mono font-bold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
          aria-label="Kirim ke AI Copilot"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </form>

      {errorMsg && (
        <div className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-700 dark:text-rose-300 font-mono">
          {errorMsg}
        </div>
      )}

      {loading && (
        <div className="p-3 rounded-xl border border-border bg-surface text-xs font-mono text-text-secondary flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#C2553A]" />
          <span>AI Copilot sedang menganalisis konteks kernel &amp; variabel...</span>
        </div>
      )}

      {/* AI Response & Inline Diff */}
      {(explanation || patchedCode) && !loading && (
        <div className="p-3 rounded-xl border border-border bg-surface space-y-3">
          {explanation && (
            <p className="text-xs leading-relaxed text-text-primary whitespace-pre-wrap">
              {explanation}
            </p>
          )}

          {patchedCode && (
            <div className="space-y-2">
              <div className="text-[10.5px] font-mono uppercase tracking-wider text-text-tertiary font-bold">
                Pratinjau Diff Perubahan:
              </div>
              <pre className="p-2.5 rounded-lg border border-border bg-[#FAF8F5] dark:bg-[#0F0E0D] overflow-x-auto text-[11px] font-mono leading-relaxed max-h-56">
                {diffPreview.map((part, i) => (
                  <span
                    key={i}
                    className={
                      part.added
                        ? "block bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-1"
                        : part.removed
                        ? "block bg-rose-500/15 text-rose-700 dark:text-rose-300 line-through px-1"
                        : "block text-text-secondary px-1"
                    }
                  >
                    {part.value}
                  </span>
                ))}
              </pre>

              <div className="flex flex-wrap gap-1.5">
                {onApplyPatch && (
                  <>
                    <button
                      type="button"
                      onClick={() => onApplyPatch(patchedCode, false)}
                      className="min-h-[34px] px-2.5 py-1 rounded-lg border border-border bg-surface-secondary hover:bg-surface text-[11px] font-mono font-semibold text-text-primary inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Terapkan Patch</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onApplyPatch(patchedCode, true)}
                      className="min-h-[34px] px-2.5 py-1 rounded-lg bg-[#C2553A] hover:bg-[#D4664A] text-white text-[11px] font-mono font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Terapkan &amp; Jalankan</span>
                    </button>
                  </>
                )}
                {onInsertNewCell && (
                  <button
                    type="button"
                    onClick={() => onInsertNewCell(patchedCode, activeKernel)}
                    className="min-h-[34px] px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-[11px] font-mono text-text-secondary hover:text-text-primary inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Sel Baru</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
