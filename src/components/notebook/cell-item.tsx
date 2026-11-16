"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  FileText,
  FlaskConical,
  Loader2,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Play,
  Sparkles,
  Terminal,
  Trash2,
  X,
} from "lucide-react";
import { NoteRenderer } from "@/components/notes/note-renderer";
import type {
  DagNodeInfo,
  NotebookCell,
  NotebookKernel,
  PendingInputPrompt,
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
  pendingInputPrompt?: PendingInputPrompt | null;
  dagInfo?: DagNodeInfo;
  variables: VariableSummary[];
  sqlTables: SqlTableMeta[];
  surroundingCode?: string;
  editorMode: "codemirror" | "lite";
  wordWrap?: boolean;
  fontSize?: number;
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
  onInsertCode?: (code: string, kernel?: NotebookKernel) => void;
  onFocusInsertHandler?: (
    insertFn: ((snippet: string, cursorBackOffset?: number) => void) | null
  ) => void;
}

const KERNEL_META: Record<NotebookKernel, { label: string; dotCls: string }> = {
  python: {
    label: "Python 3.12",
    dotCls: "bg-blue-500",
  },
  sql: {
    label: "SQLite WASM",
    dotCls: "bg-emerald-500",
  },
  javascript: {
    label: "JavaScript",
    dotCls: "bg-amber-500",
  },
  typescript: {
    label: "TypeScript",
    dotCls: "bg-indigo-500",
  },
};

export function CellItem({
  cell,
  index,
  totalCells,
  isActive,
  isRunning,
  pendingInputPrompt,
  dagInfo,
  variables,
  sqlTables,
  surroundingCode,
  editorMode,
  wordWrap = true,
  fontSize = 14,
  readOnly = false,
  onActivate,
  onUpdateCell,
  onRunCell,
  onRunAndAdvance,
  onMoveCell,
  onDeleteCell,
  onDuplicateCell,
  onAddBelow,
  onInsertCode,
  onFocusInsertHandler,
}: CellItemProps) {
  const [editingMarkdown, setEditingMarkdown] = useState(
    cell.type === "markdown" && !cell.source.trim()
  );
  const [showTestEditor, setShowTestEditor] = useState(
    Boolean(cell.testAssertions)
  );
  const [showInlineAi, setShowInlineAi] = useState(false);
  const [fullscreenOutput, setFullscreenOutput] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [zenEditorOpen, setZenEditorOpen] = useState(false);
  const [cellMenuOpen, setCellMenuOpen] = useState(false);
  const [stdinDraft, setStdinDraft] = useState("");
  const cellMenuRef = useRef<HTMLDivElement>(null);
  const stdinInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pendingInputPrompt && pendingInputPrompt.cellId === cell.id) {
      setStdinDraft("");
      requestAnimationFrame(() => stdinInputRef.current?.focus());
    }
  }, [pendingInputPrompt, cell.id]);

  useEffect(() => {
    if (!cellMenuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        cellMenuRef.current &&
        !cellMenuRef.current.contains(e.target as Node)
      ) {
        setCellMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [cellMenuOpen]);

  const handleCopyCode = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(cell.source);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1500);
    } catch {
      // Clipboard API unavailable
    }
  };

  const hasFormParams =
    cell.source.includes("#@param") || cell.source.includes("#@title");
  const isFormOnly = cell.formMode === "form";

  const errorOutput = cell.outputs.find((o) => o.kind === "error");
  const errorSummary =
    errorOutput && errorOutput.kind === "error"
      ? `${errorOutput.ename}: ${errorOutput.evalue}\n${errorOutput.traceback.join("\n")}`
      : undefined;

  const hasDagConnections = Boolean(
    dagInfo &&
      (dagInfo.upstreamCellIds.length > 0 ||
        dagInfo.downstreamCellIds.length > 0 ||
        dagInfo.status === "stale" ||
        dagInfo.status === "out_of_order" ||
        dagInfo.status === "error")
  );

  const showThisStdin = Boolean(
    pendingInputPrompt && pendingInputPrompt.cellId === cell.id
  );

  const renderStdinPromptBox = () => {
    if (!showThisStdin || !pendingInputPrompt) return null;
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          pendingInputPrompt.submit(stdinDraft);
        }}
        onClick={(e) => e.stopPropagation()}
        className="border-t border-[#C2553A]/30 bg-[#C2553A]/8 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5"
      >
        <div className="flex items-center gap-2 text-xs font-mono text-text-primary shrink-0">
          <Terminal className="w-4 h-4 text-[#C2553A]" />
          <span className="font-semibold">{pendingInputPrompt.prompt}</span>
        </div>
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <input
            ref={stdinInputRef}
            type="text"
            value={stdinDraft}
            onChange={(e) => setStdinDraft(e.target.value)}
            placeholder="Ketik nilai lalu tekan Enter..."
            className="flex-1 min-w-0 h-9 px-3 rounded-lg border border-border bg-surface font-mono text-xs text-text-primary focus:outline-hidden focus:border-[#C2553A]"
          />
          <button
            type="submit"
            className="h-9 px-3 rounded-lg bg-[#C2553A] hover:bg-[#AD472E] text-white text-xs font-mono font-semibold cursor-pointer shrink-0"
          >
            Kirim
          </button>
          <button
            type="button"
            onClick={() => pendingInputPrompt.cancel()}
            className="h-9 px-2.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-mono text-text-secondary cursor-pointer shrink-0"
          >
            Batal
          </button>
        </div>
      </form>
    );
  };

  if (cell.type === "markdown") {
    return (
      <div
        id={`nb-cell-${cell.id}`}
        onClick={onActivate}
        className={`group relative rounded-2xl border transition-all bg-surface shadow-2xs ${
          isActive
            ? "border-[#C2553A]/50 ring-2 ring-[#C2553A]/10"
            : "border-border/75 hover:border-border-strong"
        }`}
      >
        {/* Clean Floating Action Pill for Markdown Cell */}
        <div
          className={`flex items-center justify-between px-4 pt-2.5 pb-1 transition-opacity ${
            isActive || editingMarkdown
              ? "opacity-100"
              : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-text-tertiary">
              <FileText className="w-3.5 h-3.5 text-[#C2553A]" />
              <span>Teks Markdown</span>
            </span>
            {!readOnly && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingMarkdown((p) => !p);
                }}
                className="h-7 px-2.5 rounded-lg border border-border/80 bg-surface-secondary/50 hover:bg-surface-secondary text-[11px] font-mono text-text-primary inline-flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3 h-3" />
                <span>{editingMarkdown ? "Selesai Edit" : "Edit Teks"}</span>
              </button>
            )}
          </div>

          {!readOnly && (
            <div className="flex items-center gap-1">
              {totalCells > 1 && (
                <>
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveCell(-1);
                    }}
                    className="h-7 w-7 rounded-lg hover:bg-surface-secondary text-text-secondary disabled:opacity-30 flex items-center justify-center cursor-pointer"
                    title="Naikkan sel"
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
                    className="h-7 w-7 rounded-lg hover:bg-surface-secondary text-text-secondary disabled:opacity-30 flex items-center justify-center cursor-pointer"
                    title="Turunkan sel"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCell();
                    }}
                    className="h-7 w-7 rounded-lg hover:bg-rose-500/10 text-text-secondary hover:text-rose-600 flex items-center justify-center cursor-pointer"
                    title="Hapus sel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {cell.collapsed ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onUpdateCell({ collapsed: false });
            }}
            className="px-4 py-3 text-xs font-mono text-text-muted hover:bg-surface-secondary/30 cursor-pointer flex items-center justify-between"
          >
            <span className="truncate">
              {cell.source.split(/\r?\n/).find((l) => l.trim()) ||
                "Catatan Markdown dilipat"}
            </span>
            <span className="text-[#C2553A] shrink-0 ml-2">Buka</span>
          </div>
        ) : editingMarkdown && !readOnly ? (
          <div className="px-4 pb-4 pt-1">
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
              className="w-full p-3 rounded-xl border border-border bg-[#FAF8F5] dark:bg-[#0F0E0D] font-mono text-xs leading-relaxed text-text-primary focus:outline-hidden focus:border-[#C2553A]"
            />
          </div>
        ) : (
          <div
            onDoubleClick={() => {
              if (!readOnly) setEditingMarkdown(true);
            }}
            className="px-5 pb-5 pt-1 prose dark:prose-invert max-w-none text-sm leading-relaxed"
          >
            {cell.source.trim() ? (
              <NoteRenderer content={cell.source} />
            ) : (
              <p className="text-xs text-text-tertiary italic m-0">
                Sel teks kosong — klik &quot;Edit Teks&quot; atau klik ganda untuk menulis catatan.
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      id={`nb-cell-${cell.id}`}
      onClick={onActivate}
      className={`group relative rounded-2xl border transition-all bg-surface shadow-2xs ${
        isRunning
          ? "border-amber-500/60 ring-2 ring-amber-500/15"
          : errorOutput
            ? "border-rose-500/50 ring-2 ring-rose-500/10"
            : isActive
              ? "border-[#C2553A]/55 ring-2 ring-[#C2553A]/12"
              : "border-border/80 hover:border-border-strong"
      }`}
    >
      {/* Mobile Compact Header (< sm) */}
      <div className="sm:hidden px-3 py-2 border-b border-border/50 bg-surface-secondary/25 flex items-center justify-between gap-2 rounded-t-2xl">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRunCell();
            }}
            disabled={isRunning}
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all disabled:opacity-65 ${
              isRunning
                ? "bg-amber-500 text-white"
                : errorOutput
                  ? "bg-rose-600 text-white"
                  : "bg-[#C2553A] hover:bg-[#AD472E] text-white"
            }`}
            title="Jalankan Sel"
            aria-label={`Jalankan Sel ${index + 1}`}
          >
            {isRunning ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          <span className="text-[11px] font-mono text-text-muted tabular-nums">
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
              className="px-2 py-1 rounded-lg border border-border/70 bg-surface text-[11px] font-mono font-medium text-text-primary cursor-pointer"
            >
              <option value="python">Python 3.12</option>
              <option value="sql">SQLite</option>
              <option value="javascript">JS</option>
              <option value="typescript">TS</option>
            </select>
          ) : (
            <span className="text-[11px] font-mono font-medium text-text-secondary">
              {KERNEL_META[cell.kernel].label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleCopyCode}
            className="h-8 w-8 rounded-lg hover:bg-surface-secondary text-text-secondary flex items-center justify-center cursor-pointer"
            title="Salin kode"
          >
            {copiedCode ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          {!readOnly && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowInlineAi((p) => !p);
              }}
              className={`h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer ${
                showInlineAi
                  ? "bg-[#C2553A]/15 text-[#C2553A]"
                  : "hover:bg-surface-secondary text-text-secondary"
              }`}
              title="Bantuan AI"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
          {!readOnly && totalCells > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCell();
              }}
              className="h-8 w-8 rounded-lg hover:bg-rose-500/10 text-text-secondary hover:text-rose-600 flex items-center justify-center cursor-pointer"
              title="Hapus sel"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Colab Layout: Left Gutter (Desktop/iPad sm+) + Right Code Surface */}
      <div className="flex items-stretch">
        {/* Google Colab-style Left Execution Gutter (>= sm) */}
        <div className="hidden sm:flex flex-col items-center pt-3.5 pb-3 px-1.5 w-14 shrink-0 border-r border-border/50 bg-surface-secondary/20 rounded-l-2xl select-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRunCell();
            }}
            disabled={isRunning}
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-2xs disabled:opacity-70 ${
              isRunning
                ? "bg-amber-500 text-white"
                : errorOutput
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : isActive
                    ? "bg-[#C2553A] hover:bg-[#AD472E] text-white"
                    : "border border-border bg-surface hover:border-[#C2553A] hover:text-[#C2553A] text-text-primary"
            }`}
            title="Jalankan Sel (Ctrl/Cmd + Enter, atau Shift + Enter)"
            aria-label={`Jalankan Sel ${index + 1}`}
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <span className="mt-2 text-[11px] font-mono text-text-muted tabular-nums">
            [{isRunning ? "*" : cell.executionCount ?? " "}]
          </span>

          {cell.timingMs !== null && !isRunning && (
            <span
              className={`mt-0.5 text-[10px] font-mono tabular-nums ${
                errorOutput ? "text-rose-600 dark:text-rose-400" : "text-text-tertiary"
              }`}
            >
              {cell.timingMs >= 1000
                ? `${(cell.timingMs / 1000).toFixed(1)}s`
                : `${cell.timingMs}ms`}
            </span>
          )}
        </div>

        {/* Right Code & Output Column */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Desktop/iPad Subtle Action Bar */}
          <div className="hidden sm:flex items-center justify-between gap-2 px-3.5 h-9 border-b border-border/45 bg-surface-secondary/10 rounded-tr-2xl">
            <div className="flex items-center gap-2 min-w-0">
              {!readOnly ? (
                <div className="inline-flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${KERNEL_META[cell.kernel].dotCls}`}
                  />
                  <select
                    value={cell.kernel}
                    onChange={(e) =>
                      onUpdateCell({
                        kernel: e.target.value as NotebookKernel,
                        lastModifiedAt: Date.now(),
                      })
                    }
                    aria-label="Kernel Bahasa Sel"
                    className="bg-transparent text-[11.5px] font-mono font-semibold text-text-secondary hover:text-text-primary focus:outline-hidden cursor-pointer pr-1"
                  >
                    <option value="python">Python 3.12</option>
                    <option value="sql">SQLite WASM</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                  </select>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11.5px] font-mono font-semibold text-text-secondary">
                  <span
                    className={`w-2 h-2 rounded-full ${KERNEL_META[cell.kernel].dotCls}`}
                  />
                  <span>{KERNEL_META[cell.kernel].label}</span>
                </span>
              )}

              {hasDagConnections && dagInfo && (
                <span
                  title={dagInfo.staleReason || "Status ketergantungan sel"}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                    dagInfo.status === "fresh"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : dagInfo.status === "stale" || dagInfo.status === "out_of_order"
                        ? "bg-amber-500/15 text-amber-800 dark:text-amber-300"
                        : "bg-rose-500/10 text-rose-700 dark:text-rose-300"
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
                        ? "Perlu Re-run"
                        : dagInfo.status === "out_of_order"
                          ? "Urutan Salah"
                          : "Error"}
                  </span>
                </span>
              )}
            </div>

            {/* Clean Top-Right Hover/Active Cell Actions */}
            <div
              className={`flex items-center gap-1 transition-opacity ${
                isActive || cellMenuOpen
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
              }`}
            >
              <button
                type="button"
                onClick={handleCopyCode}
                className="h-7 px-2 rounded-lg hover:bg-surface-secondary text-[11px] font-medium text-text-secondary hover:text-text-primary inline-flex items-center gap-1 cursor-pointer transition-colors"
                title="Salin kode"
                aria-label="Salin kode sel"
              >
                {copiedCode ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedCode ? "Disalin" : "Salin"}</span>
              </button>

              {!readOnly && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInlineAi((p) => !p);
                  }}
                  className={`h-7 px-2 rounded-lg text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer transition-colors ${
                    showInlineAi
                      ? "bg-[#C2553A]/15 text-[#C2553A]"
                      : "hover:bg-surface-secondary text-text-secondary hover:text-text-primary"
                  }`}
                  title="Bantuan AI untuk sel ini"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI</span>
                </button>
              )}

              {!readOnly && totalCells > 1 && (
                <>
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveCell(-1);
                    }}
                    className="h-7 w-7 rounded-lg hover:bg-surface-secondary text-text-secondary disabled:opacity-30 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                    title="Naikkan sel"
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
                    className="h-7 w-7 rounded-lg hover:bg-surface-secondary text-text-secondary disabled:opacity-30 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                    title="Turunkan sel"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCell();
                    }}
                    className="h-7 w-7 rounded-lg hover:bg-rose-500/10 text-text-secondary hover:text-rose-600 flex items-center justify-center cursor-pointer"
                    title="Hapus sel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              {/* Overflow Cell Menu (`⋯`) */}
              <div className="relative" ref={cellMenuRef}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCellMenuOpen((p) => !p);
                  }}
                  className="h-7 w-7 rounded-lg hover:bg-surface-secondary text-text-secondary hover:text-text-primary flex items-center justify-center cursor-pointer"
                  title="Opsi sel lainnya"
                  aria-label="Opsi sel lainnya"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {cellMenuOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-1 w-52 rounded-xl border border-border bg-surface shadow-xl z-40 py-1 text-xs font-mono"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setCellMenuOpen(false);
                        setZenEditorOpen(true);
                      }}
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-surface-secondary text-left text-text-primary cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#C2553A]" />
                      <span>Mode Fokus (Zen)</span>
                    </button>

                    {!readOnly && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setCellMenuOpen(false);
                            onDuplicateCell();
                          }}
                          className="w-full px-3 py-2 flex items-center gap-2 hover:bg-surface-secondary text-left text-text-primary cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-[#C2553A]" />
                          <span>Duplikasi Sel</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCellMenuOpen(false);
                            setShowTestEditor((p) => !p);
                          }}
                          className="w-full px-3 py-2 flex items-center gap-2 hover:bg-surface-secondary text-left text-text-primary cursor-pointer"
                        >
                          <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {showTestEditor ? "Sembunyikan Test" : "Tambah Unit Test"}
                          </span>
                        </button>
                      </>
                    )}

                    {hasFormParams && (
                      <button
                        type="button"
                        onClick={() => {
                          setCellMenuOpen(false);
                          onUpdateCell({
                            formMode: isFormOnly ? "both" : "form",
                          });
                        }}
                        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-surface-secondary text-left text-text-primary cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#C2553A]" />
                        <span>{isFormOnly ? "Lihat Kode" : "Sembunyikan Kode"}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setCellMenuOpen(false);
                        onUpdateCell({ collapsed: !cell.collapsed });
                      }}
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-surface-secondary text-left text-text-primary cursor-pointer"
                    >
                      {cell.collapsed ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronUp className="w-3.5 h-3.5" />
                      )}
                      <span>{cell.collapsed ? "Buka Isi Sel" : "Lipat Isi Sel"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cell Body */}
          {cell.collapsed ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onUpdateCell({ collapsed: false });
              }}
              className="px-4 py-3 text-xs font-mono text-text-muted bg-surface-secondary/15 hover:bg-surface-secondary/35 cursor-pointer flex items-center justify-between"
            >
              <span className="truncate">
                {cell.source.split(/\r?\n/).find((l) => l.trim()) || "Sel dilipat"}
              </span>
              <span className="text-[#C2553A] shrink-0 ml-2">Buka Sel</span>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Optional #@param Form Strip */}
              <CellParamForm
                source={cell.source}
                kernel={cell.kernel}
                layout="stacked"
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
                <>
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
                    wordWrap={wordWrap}
                    fontSize={fontSize}
                    onRunCell={onRunCell}
                    onRunAndAdvance={onRunAndAdvance}
                    onFocusInsertHandler={onFocusInsertHandler}
                  />

                  {isActive && !readOnly && (
                    <div className="px-4 py-1.5 border-t border-border/40 bg-[#F3EFE9]/30 dark:bg-[#141210]/60 flex items-center justify-between gap-2 text-[10.5px] font-mono text-text-tertiary">
                      <span>
                        <kbd className="px-1 py-0.5 rounded bg-surface border border-border/70 text-[10px]">
                          Shift+Enter
                        </kbd>{" "}
                        jalankan &amp; lanjut ·{" "}
                        <kbd className="px-1 py-0.5 rounded bg-surface border border-border/70 text-[10px]">
                          Ctrl+Enter
                        </kbd>{" "}
                        jalankan
                      </span>
                      <span className="hidden sm:inline shrink-0">
                        {cell.source.split(/\r?\n/).length} baris
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Autograder / Unit Test Editor */}
              {showTestEditor && !readOnly && (
                <div className="p-3.5 border-t border-border bg-emerald-500/5 space-y-1.5">
                  <label className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Autograder Assertions:</span>
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
                <div className="p-4 border-t border-border bg-[#F3EFE9]/50 dark:bg-[#141210]">
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

              {/* Interactive Colab stdin input() Prompt Box */}
              {renderStdinPromptBox()}

              {/* Outputs Container */}
              {cell.outputs && cell.outputs.length > 0 && (
                <div className="border-t border-border/60 bg-surface-secondary/15 rounded-br-2xl">
                  <div className="px-4 py-1.5 flex items-center justify-between border-b border-border/40">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-text-tertiary">
                      Output
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setFullscreenOutput(true)}
                        className="text-[11px] font-mono text-text-secondary hover:text-[#C2553A] inline-flex items-center gap-1 cursor-pointer"
                        title="Tampilkan output layar penuh"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span className="hidden sm:inline">Perbesar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateCell({ outputCollapsed: !cell.outputCollapsed })
                        }
                        className="text-[11px] font-mono text-text-secondary hover:text-text-primary inline-flex items-center gap-1 cursor-pointer"
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
                  </div>

                  {!cell.outputCollapsed && (
                    <div className="p-3.5 sm:p-4">
                      <RichOutputRenderer
                        outputs={cell.outputs}
                        onAskAiFix={() => setShowInlineAi(true)}
                        onInsertCode={(code, k) => {
                          if (onInsertCode) {
                            onInsertCode(code, k);
                          } else {
                            onAddBelow("code", code, k);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Output Modal */}
      {fullscreenOutput && cell.outputs && cell.outputs.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs p-3 sm:p-6 flex flex-col"
          onClick={() => setFullscreenOutput(false)}
        >
          <div
            className="flex-1 min-h-0 max-w-6xl w-full mx-auto rounded-2xl border border-border bg-surface shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-border bg-surface-secondary/40 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Maximize2 className="w-4 h-4 text-[#C2553A] shrink-0" />
                <span className="text-xs font-mono font-bold text-text-primary truncate">
                  Output Layar Penuh — Sel [{cell.executionCount ?? index + 1}] ({cell.kernel})
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setFullscreenOutput(false)}
                  className="px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-mono text-text-primary inline-flex items-center gap-1 cursor-pointer"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kecilkan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFullscreenOutput(false)}
                  className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary cursor-pointer"
                  aria-label="Tutup output layar penuh"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0">
              <RichOutputRenderer
                outputs={cell.outputs}
                onAskAiFix={() => {
                  setFullscreenOutput(false);
                  setShowInlineAi(true);
                }}
                onInsertCode={(code, k) => {
                  setFullscreenOutput(false);
                  if (onInsertCode) {
                    onInsertCode(code, k);
                  } else {
                    onAddBelow("code", code, k);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Zen Code Editor Modal */}
      {zenEditorOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs p-3 sm:p-6 flex items-center justify-center"
          onClick={() => setZenEditorOpen(false)}
        >
          <div
            className="w-full max-w-6xl max-h-[92vh] rounded-2xl border border-border bg-surface shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-2.5 border-b border-border bg-surface-secondary/40 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-text-secondary">
                  <span className={`w-2 h-2 rounded-full ${KERNEL_META[cell.kernel].dotCls}`} />
                  {KERNEL_META[cell.kernel].label}
                </span>
                <span className="text-xs font-mono font-bold text-text-primary truncate">
                  Zen Editor — Sel [{cell.executionCount ?? index + 1}]
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="h-8 px-2.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-medium text-text-secondary inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {copiedCode ? "Disalin" : "Salin Kode"}
                  </span>
                </button>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => onRunCell()}
                    disabled={isRunning}
                    className="h-8 px-3 rounded-lg bg-[#C2553A] hover:bg-[#AA452C] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {isRunning ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>Jalankan</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setZenEditorOpen(false)}
                  className="h-8 px-2.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-mono text-text-primary inline-flex items-center gap-1 cursor-pointer"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kecilkan</span>
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <CellParamForm
                source={cell.source}
                kernel={cell.kernel}
                layout="stacked"
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
                wordWrap={wordWrap}
                fontSize={Math.max(fontSize, 15)}
                onRunCell={onRunCell}
                onRunAndAdvance={onRunAndAdvance}
                onFocusInsertHandler={onFocusInsertHandler}
              />
            </div>

            {renderStdinPromptBox()}

            {cell.outputs && cell.outputs.length > 0 && (
              <div className="border-t border-border bg-surface-secondary/20 max-h-[38vh] overflow-y-auto p-3.5">
                <div className="text-[10.5px] font-mono uppercase tracking-wider text-text-tertiary mb-1.5">
                  Output
                </div>
                <RichOutputRenderer
                  outputs={cell.outputs}
                  onAskAiFix={() => {
                    setZenEditorOpen(false);
                    setShowInlineAi(true);
                  }}
                  onInsertCode={(code, k) => {
                    setZenEditorOpen(false);
                    if (onInsertCode) {
                      onInsertCode(code, k);
                    } else {
                      onAddBelow("code", code, k);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
