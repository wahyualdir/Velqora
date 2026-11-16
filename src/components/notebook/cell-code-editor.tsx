"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, keymap, placeholder as cmPlaceholder } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { indentWithTab } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion, type CompletionContext } from "@codemirror/autocomplete";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import type { NotebookKernel, VariableSummary } from "@/lib/notebook/types";

interface CellCodeEditorProps {
  value: string;
  onChange: (nextValue: string) => void;
  kernel: NotebookKernel;
  variables?: VariableSummary[];
  editorMode?: "codemirror" | "lite";
  wordWrap?: boolean;
  fontSize?: number;
  placeholderText?: string;
  onRunCell?: () => void;
  onRunAndAdvance?: () => void;
  onFocusInsertHandler?: (
    insertFn: ((snippet: string, cursorBackOffset?: number) => void) | null
  ) => void;
}

function getLanguageExtension(kernel: NotebookKernel) {
  switch (kernel) {
    case "sql":
      return sql();
    case "typescript":
      return javascript({ typescript: true });
    case "javascript":
      return javascript({ typescript: false });
    case "python":
    default:
      return python();
  }
}

function getKernelPlaceholder(kernel: NotebookKernel, fallback?: string): string {
  if (fallback) return fallback;
  switch (kernel) {
    case "sql":
      return "-- Tulis kueri SQLite di sini, lalu klik ▶ Run atau Ctrl+Enter...";
    case "javascript":
      return "// Tulis kode JavaScript di sini, lalu klik ▶ Run atau Ctrl+Enter...";
    case "typescript":
      return "// Tulis kode TypeScript di sini, lalu klik ▶ Run atau Ctrl+Enter...";
    case "python":
    default:
      return "# Tulis kode Python (atau !pip install nama_paket), lalu klik ▶ Run atau Shift+Enter...";
  }
}

function buildVelqoraTheme(isDark: boolean, fontSize = 14) {
  const editorTheme = EditorView.theme(
    {
      "&": {
        backgroundColor: isDark ? "#0F0E0D" : "#FAF8F5",
        color: isDark ? "#F5F5F4" : "#1C1917",
        fontSize: `${fontSize}px`,
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      },
      ".cm-content": {
        padding: "14px 0",
        lineHeight: "1.65",
        caretColor: "#D4664A",
      },
      ".cm-line": {
        padding: "0 16px",
      },
      ".cm-gutters": {
        backgroundColor: isDark ? "#0F0E0D" : "#FAF8F5",
        color: isDark ? "#6B645E" : "#8A8378",
        borderRight: isDark ? "1px solid #24201E" : "1px solid #EBE5DC",
        minWidth: "42px",
        userSelect: "none",
      },
      ".cm-activeLine": {
        backgroundColor: isDark
          ? "rgba(212, 102, 74, 0.08)"
          : "rgba(194, 85, 58, 0.05)",
      },
      ".cm-activeLineGutter": {
        backgroundColor: isDark ? "#1C1917" : "#EBE5DC",
        color: "#D4664A",
      },
      ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
        backgroundColor: isDark
          ? "rgba(212, 102, 74, 0.25)"
          : "rgba(194, 85, 58, 0.18)",
      },
      ".cm-scroller": {
        overflowX: "auto",
        minHeight: "82px",
      },
    },
    { dark: isDark }
  );

  const highlight = HighlightStyle.define([
    {
      tag: [tags.keyword, tags.operatorKeyword, tags.controlKeyword],
      color: isDark ? "#F28B6E" : "#B5442A",
      fontWeight: "600",
    },
    {
      tag: [tags.string, tags.docString],
      color: isDark ? "#86EFAC" : "#15803D",
    },
    {
      tag: [tags.number, tags.integer, tags.float, tags.bool],
      color: isDark ? "#FCD34D" : "#B45309",
    },
    {
      tag: [tags.comment, tags.lineComment, tags.blockComment],
      color: isDark ? "#78716C" : "#8A8378",
      fontStyle: "italic",
    },
    {
      tag: [tags.function(tags.variableName), tags.function(tags.propertyName)],
      color: isDark ? "#93C5FD" : "#1D4ED8",
    },
    {
      tag: [tags.typeName, tags.className],
      color: isDark ? "#E5C194" : "#9A3412",
    },
  ]);

  return [editorTheme, syntaxHighlighting(highlight)];
}

export function CellCodeEditor({
  value,
  onChange,
  kernel,
  variables = [],
  editorMode = "codemirror",
  wordWrap = true,
  fontSize = 14,
  placeholderText,
  onRunCell,
  onRunAndAdvance,
  onFocusInsertHandler,
}: CellCodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const resolvedPlaceholder = getKernelPlaceholder(kernel, placeholderText);

  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const langCompRef = useRef(new Compartment());
  const themeCompRef = useRef(new Compartment());
  const completionCompRef = useRef(new Compartment());
  const wrapCompRef = useRef(new Compartment());
  const placeholderCompRef = useRef(new Compartment());

  const onChangeRef = useRef(onChange);
  const onRunCellRef = useRef(onRunCell);
  const onRunAdvanceRef = useRef(onRunAndAdvance);
  const onFocusInsertRef = useRef(onFocusInsertHandler);
  const variablesRef = useRef(variables);

  onChangeRef.current = onChange;
  onRunCellRef.current = onRunCell;
  onRunAdvanceRef.current = onRunAndAdvance;
  onFocusInsertRef.current = onFocusInsertHandler;
  variablesRef.current = variables;

  const buildCompletionSource = () => {
    return autocompletion({
      override: [
        (context: CompletionContext) => {
          const word = context.matchBefore(/\w*/);
          if (!word || (word.from === word.to && !context.explicit)) return null;

          const runtimeOptions = variablesRef.current.map((v) => ({
            label: v.name,
            type: v.isTabular ? "variable" : "property",
            detail: `${v.type}${v.shape ? ` ${v.shape}` : ""}`,
          }));

          const kernelSnippets =
            kernel === "sql"
              ? ["SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "JOIN", "LIMIT"]
              : kernel === "python"
              ? [
                  "import pandas as pd",
                  "import numpy as np",
                  "import matplotlib.pyplot as plt",
                  "print",
                  "len",
                  "range",
                  "display",
                ]
              : ["console.log", "const", "function", "return", "Array.from"];

          const staticOptions = kernelSnippets.map((label) => ({
            label,
            type: "keyword",
          }));

          return {
            from: word.from,
            options: [...runtimeOptions, ...staticOptions],
          };
        },
      ],
    });
  };

  useEffect(() => {
    if (editorMode === "lite" || !containerRef.current) return;

    const customKeymap = keymap.of([
      {
        key: "Shift-Enter",
        run: () => {
          onRunAdvanceRef.current?.();
          return true;
        },
      },
      {
        key: "Mod-Enter",
        run: () => {
          onRunCellRef.current?.();
          return true;
        },
      },
      indentWithTab,
    ]);

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        customKeymap,
        placeholderCompRef.current.of(cmPlaceholder(resolvedPlaceholder)),
        langCompRef.current.of(getLanguageExtension(kernel)),
        themeCompRef.current.of(buildVelqoraTheme(isDark, fontSize)),
        completionCompRef.current.of(buildCompletionSource()),
        wrapCompRef.current.of(wordWrap ? EditorView.lineWrapping : []),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.domEventHandlers({
          focus: () => {
            onFocusInsertRef.current?.((snippet: string, cursorBackOffset = 0) => {
              const view = viewRef.current;
              if (!view) return;
              const { from, to } = view.state.selection.main;
              const cursorPos = Math.max(
                from,
                from + snippet.length - cursorBackOffset
              );
              view.dispatch({
                changes: { from, to, insert: snippet },
                selection: { anchor: cursorPos },
              });
              view.focus();
            });
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorMode]);

  // Sync external edits (AI diff patch, param sliders, template swaps)
  useEffect(() => {
    const view = viewRef.current;
    if (!view || editorMode === "lite") return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value, editorMode]);

  // Update kernel syntax highlighting live
  useEffect(() => {
    const view = viewRef.current;
    if (!view || editorMode === "lite") return;
    view.dispatch({
      effects: [
        langCompRef.current.reconfigure(getLanguageExtension(kernel)),
        completionCompRef.current.reconfigure(buildCompletionSource()),
        placeholderCompRef.current.reconfigure(cmPlaceholder(resolvedPlaceholder)),
      ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kernel, editorMode, resolvedPlaceholder]);

  // Update light/dark theme & font size live
  useEffect(() => {
    const view = viewRef.current;
    if (!view || editorMode === "lite") return;
    view.dispatch({
      effects: themeCompRef.current.reconfigure(
        buildVelqoraTheme(isDark, fontSize)
      ),
    });
  }, [isDark, fontSize, editorMode]);

  // Update line wrapping live
  useEffect(() => {
    const view = viewRef.current;
    if (!view || editorMode === "lite") return;
    view.dispatch({
      effects: wrapCompRef.current.reconfigure(
        wordWrap ? EditorView.lineWrapping : []
      ),
    });
  }, [wordWrap, editorMode]);

  if (editorMode === "lite") {
    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={resolvedPlaceholder}
        spellCheck={false}
        onFocus={() => {
          onFocusInsertRef.current?.((snippet: string, cursorBackOffset = 0) => {
            const el = textareaRef.current;
            if (!el) return;
            const start = el.selectionStart ?? el.value.length;
            const end = el.selectionEnd ?? start;
            const nextVal =
              el.value.slice(0, start) + snippet + el.value.slice(end);
            onChangeRef.current(nextVal);
            requestAnimationFrame(() => {
              const target = Math.max(start, start + snippet.length - cursorBackOffset);
              el.focus();
              el.setSelectionRange(target, target);
            });
          });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            onRunAndAdvance?.();
          } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            onRunCell?.();
          } else if (e.key === "Tab") {
            e.preventDefault();
            const el = e.currentTarget;
            const start = el.selectionStart;
            const end = el.selectionEnd;
            const nextVal = value.slice(0, start) + "  " + value.slice(end);
            onChange(nextVal);
            requestAnimationFrame(() => {
              el.setSelectionRange(start + 2, start + 2);
            });
          }
        }}
        style={{ fontSize: `${fontSize}px` }}
        className={`w-full min-h-[88px] px-4 py-3.5 font-mono leading-[1.65] bg-[#FAF8F5] dark:bg-[#0F0E0D] text-[#1C1917] dark:text-[#F5F5F4] focus:outline-hidden resize-y ${
          wordWrap ? "whitespace-pre-wrap" : "whitespace-pre overflow-x-auto"
        }`}
      />
    );
  }

  return <div ref={containerRef} className="w-full overflow-hidden rounded-b-lg" />;
}
