"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  Eye,
  FileText,
  FlaskConical,
  Loader2,
  Play,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { NoteRenderer } from "@/components/notes/note-renderer";
import type {
  DagNodeInfo,
  NotebookCell,
  NotebookKernel,
  SqlTableMeta,
  VariableSummary,
} from "@/lib/notebook/types";
import { AICellCopilot } from "./ai-cell-copilot";
import { CellCodeEditor } from "./cell-code-editor";
import { CellParamForm } from "./cell-param-form";
import { RichOutputRenderer } from "./outputs/rich-output-renderer";

interface CellItemProps {
  cell: NotebookCell;
  index: number;
  totalCells: number;
  isActive: boolean;
  isRunning: boolean;
  dagInfo?: DagNodeInfo;
  variables: VariableSummary[];
  sqlTables: SqlTableMeta[];
  surroundingCode?: string;
  editorMode: "codemirror" | "lite";
  readOnly?: boolean;
  onActivate: () => void;
  onUpdateCell: (patch: Partial<NotebookCell>) => void;
  onRunCell: () => void;
  onRunAndAdvance: () => void;
  onMoveCell: (dir: -1 | 1) => void;
  onDeleteCell: () => void;
  onDuplicateCell: () => void;
  onAddBelow: (
    type: "code" | "markdown",
    prefillCode?: string,
    kernelOverride?: NotebookKernel
  ) => void;
  onFocusInsertHandler?: (
    insertFn: ((snippet: string, cursorBackOffset?: number) => void) | null
  ) => void;
}

const KERNEL_BADGE: Record<NotebookKernel, { label: string; cls: string }> = {
  python: {
    label: "Python 3.12",
    cls: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25",
  },
  sql: {
    label: "SQLite WASM",
    cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  },
  javascript: {
    label: "JavaScript",
    cls: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/25",
  },
  typescript: {
    label: "TypeScript",
    cls: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/25",
  },
};

export function CellItem({
  cell,
  index,
  totalCells,
  isActive,
  isRunning,
  dagInfo,
  variables,
  sqlTables,
  surroundingCode,
  editorMode,
  readOnly = false,
  onActivate,
  onUpdateCell,
  onRunCell,
  onRunAndAdvance,
  onMoveCell,
  onDeleteCell,
  onDuplicateCell,
  onAddBelow,
  onFocusInsertHandler,
}: CellItemProps) {
  const [editingMarkdown, setEditingMarkdown] = useState(
    cell.type === "markdown" && !cell.source.trim()
  );
  const [showTestEditor, setShowTestEditor] = useState(
    Boolean(cell.testAssertions)
  );
  const [showInlineAi, setShowInlineAi] = useState(false);

  const hasFormParams = cell.source.includes("#@param") || cell.source.includes("#@title");
  const isFormOnly = cell.formMode === "form";

  const errorOutput = cell.outputs.find((o) => o.kind === "error");
  const errorSummary =
    errorOutput && errorOutput.kind === "error"
      ? `${errorOutput.ename}: ${errorOutput.evalue}\n${errorOutput.traceback.join("\n")}`
      : undefined;

  return (
    <div
      id={`nb-cell-${cell.id}`}
      onClick={onActivate}
      className={`rounded-2xl border transition-all bg-surface shadow-2xs overflow-hidden ${
        isActive
          ? "border-[#C2553A]/70 ring-1 ring-[#C2553A]/20"
          : "border-border hover:border-border-strong"
      }`}
    >
      {/* Cell Header Chrome */}
      <div className="px-3 py-2 border-b border-border/80 bg-[#F3EFE9]/70 dark:bg-[#141210] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {cell.type === "code" ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRunCell();
                }}
                disabled={isRunning}
                className="min-h-[36px] min-w-[36px] px-2.5 rounded-xl bg-[#C2553A] hover:bg-[#D4664A] text-white text-xs font-mono font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 transition-colors shrink-0"
                title="Jalankan Sel (Ctrl/Cmd + Enter, atau Shift + Enter untuk sel berikutnya)"
                aria-label={`Jalankan Sel ${index + 1}`}
              >
                {isRunning ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span className="hidden sm:inline">
                  {isRunning ? "Menjalankan" : "Run"}
                </span>
              </button>

              <span className="text-[11px] font-mono text-text-tertiary tabular-nums shrink-0">
                [{isRunning ? "*" : cell.executionCount ?? " "}]
              </span>

              {!readOnly ? (
                <select
                  value={cell.kernel}
                  onChange={(e) =>
                    onUpdateCell({
                      kernel: e.target.value as NotebookKernel,
                      lastModifiedAt: Date.now(),
                    })
                  }
                  aria-label="Kernel Bahasa Sel"
                  className={`px-2 py-1 rounded-lg border text-[11px] font-mono font-semibold cursor-pointer ${KERNEL_BADGE[cell.kernel].cls}`}
                >
                  <option value="python">Python 3.12</option>
                  <option value="sql">SQLite WASM</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                </select>
              ) : (
                <span
                  className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono font-semibold ${KERNEL_BADGE[cell.kernel].cls}`}
                >
                  {KERNEL_BADGE[cell.kernel].label}
                </span>
              )}

              {/* DAG Freshness Indicator */}
              {dagInfo && dagInfo.status !== "idle" && (
                <span
                  title={dagInfo.staleReason || "Status dependensi sel"}
                  className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-mono font-semibold ${
                    dagInfo.status === "fresh"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25"
                      : dagInfo.status === "stale" || dagInfo.status === "out_of_order"
                      ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30"
                      : dagInfo.status === "error"
                      ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25"
                      : "bg-surface-secondary text-text-secondary border-border"
                  }`}
                >
                  {dagInfo.status === "fresh" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  <span>
                    {dagInfo.status === "fresh"
                      ? "Sinkron"
                      : dagInfo.status === "stale"
                      ? "Stale"
                      : dagInfo.status === "out_of_order"
                      ? "Urutan Salah"
                      : dagInfo.status === "error"
                      ? "Error"
                      : "Aktif"}
                  </span>
                </span>
              )}

              {cell.timingMs !== null && (
                <span className="text-[10.5px] font-mono text-text-tertiary tabular-nums hidden md:inline">
                  {cell.timingMs}ms
                </span>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-surface text-[11px] font-mono font-semibold text-text-secondary">
                <FileText className="w-3.5 h-3.5 text-[#C2553A]" />
                <span>Catatan Markdown [{index + 1}]</span>
              </span>
              {!readOnly && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingMarkdown((p) => !p);
                  }}
                  className="min-h-[32px] px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-[11px] font-mono text-text-primary inline-flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>{editingMarkdown ? "Pratinjau" : "Edit Teks"}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Cell Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {cell.type === "code" && hasFormParams && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateCell({
                  formMode: isFormOnly ? "both" : "form",
                });
              }}
              className="px-2 py-1 min-h-[32px] rounded-lg border border-border bg-surface hover:bg-surface-secondary text-[10.5px] font-mono text-text-secondary cursor-pointer"
              title="Beralih antara Form + Kode atau Form saja"
            >
              {isFormOnly ? "Lihat Kode" : "Sembunyikan Kode"}
            </button>
          )}

          {cell.type === "code" && !readOnly && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTestEditor((p) => !p);
                }}
                className={`p-1.5 min-h-[32px] min-w-[32px] rounded-lg border text-xs flex items-center justify-center cursor-pointer transition-colors ${
                  showTestEditor
                    ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-700 dark:text-emerald-300"
                    : "border-border bg-surface text-text-secondary hover:bg-surface-secondary"
                }`}
                title="Uji Asersi / Autograder"
                aria-label="Uji Asersi"
              >
                <FlaskConical className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInlineAi((p) => !p);
                }}
                className={`p-1.5 min-h-[32px] min-w-[32px] rounded-lg border text-xs flex items-center justify-center cursor-pointer transition-colors ${
                  showInlineAi
                    ? "bg-[#C2553A]/15 border-[#C2553A]/40 text-[#C2553A] dark:text-[#D4664A]"
                    : "border-border bg-surface text-text-secondary hover:bg-surface-secondary"
                }`}
                title="AI Copilot untuk Sel Ini"
                aria-label="AI Copilot untuk Sel Ini"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {!readOnly && (
            <>
              <button
                type="button"
                disabled={index === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveCell(-1);
                }}
                className="p-1.5 min-h-[32px] min-w-[32px] rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary disabled:opacity-35 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                title="Naikkan sel"
                aria-label="Naikkan sel"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={index === totalCells - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveCell(1);
                }}
                className="p-1.5 min-h-[32px] min-w-[32px] rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary disabled:opacity-35 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                title="Turunkan sel"
                aria-label="Turunkan sel"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicateCell();
                }}
                className="hidden sm:flex p-1.5 min-h-[32px] min-w-[32px] rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary items-center justify-center cursor-pointer"
                title="Duplikasi sel"
                aria-label="Duplikasi sel"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {totalCells > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCell();
                  }}
                  className="p-1.5 min-h-[32px] min-w-[32px] rounded-lg border border-border bg-surface hover:bg-rose-500/10 text-text-secondary hover:text-rose-600 flex items-center justify-center cursor-pointer"
                  title="Hapus sel"
                  aria-label="Hapus sel"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Cell Body */}
      {cell.type === "markdown" ? (
        editingMarkdown && !readOnly ? (
          <div className="p-3 bg-[#FAF8F5] dark:bg-[#0F0E0D] space-y-2">
            <textarea
              value={cell.source}
              onChange={(e) =>
                onUpdateCell({
                  source: e.target.value,
                  lastModifiedAt: Date.now(),
                })
              }
              rows={Math.max(4, cell.source.split("\n").length + 1)}
              placeholder="# Tulis catatan Markdown atau rumus LaTeX $$E = mc^2$$..."
              className="w-full p-2.5 rounded-xl border border-border bg-surface font-mono text-xs leading-relaxed text-text-primary focus:outline-hidden focus:border-[#C2553A]"
            />
          </div>
        ) : (
          <div
            onDoubleClick={() => {
              if (!readOnly) setEditingMarkdown(true);
            }}
            className="p-4 sm:p-5 prose dark:prose-invert max-w-none text-sm leading-relaxed"
          >
            {cell.source.trim() ? (
              <NoteRenderer content={cell.source} />
            ) : (
              <p className="text-xs text-text-tertiary italic">
                Sel Markdown kosong — klik ganda untuk menulis catatan atau LaTeX.
              </p>
            )}
          </div>
        )
      ) : (
        <div>
          {/* Interactive Colab @param Form Controls */}
          <CellParamForm
            source={cell.source}
            kernel={cell.kernel}
            onChangeSource={(nextSource, autoRun) => {
              onUpdateCell({
                source: nextSource,
                lastModifiedAt: Date.now(),
              });
              if (autoRun) {
                onRunCell();
              }
            }}
          />

          {/* Code Editor */}
          {!isFormOnly && (
            <CellCodeEditor
              value={cell.source}
              onChange={(nextVal) =>
                onUpdateCell({
                  source: nextVal,
                  lastModifiedAt: Date.now(),
                })
              }
              kernel={cell.kernel}
              variables={variables}
              editorMode={readOnly ? "lite" : editorMode}
              onRunCell={onRunCell}
              onRunAndAdvance={onRunAndAdvance}
              onFocusInsertHandler={onFocusInsertHandler}
            />
          )}

          {/* Autograder / Unit Test Editor */}
          {showTestEditor && !readOnly && (
            <div className="p-3 border-t border-border bg-emerald-500/5 space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Autograder Assertions (dijalankan otomatis setelah sel selesai):</span>
              </label>
              <textarea
                value={cell.testAssertions || ""}
                onChange={(e) =>
                  onUpdateCell({
                    testAssertions: e.target.value,
                    lastModifiedAt: Date.now(),
                  })
                }
                rows={3}
                placeholder={`assert 'df' in locals(), "Variabel df harus dibuat"\nassert len(df) > 0`}
                className="w-full p-2.5 rounded-xl border border-emerald-500/30 bg-surface font-mono text-xs text-text-primary focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          )}

          {/* Inline AI Copilot Drawer */}
          {showInlineAi && !readOnly && (
            <div className="p-3.5 border-t border-border bg-[#F3EFE9]/50 dark:bg-[#141210]">
              <AICellCopilot
                activeKernel={cell.kernel}
                activeCellSource={cell.source}
                activeCellError={errorSummary}
                surroundingCode={surroundingCode}
                variables={variables}
                sqlTables={sqlTables}
                onApplyPatch={(patchedCode, andRun) => {
                  onUpdateCell({
                    source: patchedCode,
                    lastModifiedAt: Date.now(),
                  });
                  setShowInlineAi(false);
                  if (andRun) {
                    setTimeout(onRunCell, 40);
                  }
                }}
                onInsertNewCell={(code, k) => {
                  onAddBelow("code", code, k);
                  setShowInlineAi(false);
                }}
              />
            </div>
          )}

          {/* Outputs Container */}
          {cell.outputs && cell.outputs.length > 0 && (
            <div className="border-t border-border bg-surface-secondary/20">
              <div className="px-3 py-1.5 flex items-center justify-between border-b border-border/50">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-text-tertiary">
                  Output ({cell.outputs.length})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateCell({ outputCollapsed: !cell.outputCollapsed })
                  }
                  className="text-[10.5px] font-mono text-text-secondary hover:text-text-primary inline-flex items-center gap-1 cursor-pointer"
                >
                  {cell.outputCollapsed ? (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      <span>Tampilkan</span>
                    </>
                  ) : (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      <span>Lipat</span>
                    </>
                  )}
                </button>
              </div>

              {!cell.outputCollapsed && (
                <div className="p-3">
                  <RichOutputRenderer
                    outputs={cell.outputs}
                    onAskAiFix={() => setShowInlineAi(true)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick Insert Bar Between Cells */}
      {!readOnly && (
        <div className="px-3 py-1.5 border-t border-border/50 bg-surface-secondary/25 flex items-center justify-center gap-2 opacity-90 hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddBelow("code");
            }}
            className="min-h-[30px] px-2.5 py-0.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-[11px] font-mono text-text-secondary hover:text-text-primary inline-flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3 text-[#C2553A]" />
            <Code2 className="w-3 h-3" />
            <span>Kode</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddBelow("markdown");
            }}
            className="min-h-[30px] px-2.5 py-0.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-[11px] font-mono text-text-secondary hover:text-text-primary inline-flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3 text-[#C2553A]" />
            <FileText className="w-3 h-3" />
            <span>Teks / LaTeX</span>
          </button>
        </div>
      )}
    </div>
  );
}
