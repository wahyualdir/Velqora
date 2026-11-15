"use client";

import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";

interface TouchSymbolBarProps {
  visible: boolean;
  onInsertSymbol: (snippet: string, cursorBackOffset?: number) => void;
  onRunActiveCell?: () => void;
}

const SYMBOLS: Array<{
  label: string;
  snippet: string;
  backOffset?: number;
  title: string;
}> = [
  { label: "Tab", snippet: "  ", title: "Indentasi 2 spasi" },
  { label: "( )", snippet: "()", backOffset: 1, title: "Kurung bulat" },
  { label: "[ ]", snippet: "[]", backOffset: 1, title: "Kurung siku" },
  { label: "{ }", snippet: "{}", backOffset: 1, title: "Kurung kurawal" },
  { label: "=", snippet: " = ", title: "Assignment" },
  { label: ":", snippet: ": ", title: "Titik dua" },
  { label: '""', snippet: '""', backOffset: 1, title: "Tanda kutip ganda" },
  { label: "''", snippet: "''", backOffset: 1, title: "Tanda kutip tunggal" },
  { label: "_", snippet: "_", title: "Underscore" },
  { label: "#", snippet: "# ", title: "Komentar Python / Heading" },
  { label: "->", snippet: " -> ", title: "Type arrow" },
];

export function TouchSymbolBar({
  visible,
  onInsertSymbol,
  onRunActiveCell,
}: TouchSymbolBarProps) {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const vv = window.visualViewport;
    const updateOffset = () => {
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardOffset(inset);
    };

    updateOffset();
    vv.addEventListener("resize", updateOffset);
    vv.addEventListener("scroll", updateOffset);
    return () => {
      vv.removeEventListener("resize", updateOffset);
      vv.removeEventListener("scroll", updateOffset);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        bottom:
          keyboardOffset > 0
            ? `${keyboardOffset}px`
            : "calc(env(safe-area-inset-bottom, 0px))",
      }}
      className="fixed left-0 right-0 z-40 lg:hidden border-t border-border bg-[#FAF8F5]/95 dark:bg-[#141210]/95 backdrop-blur-md px-2 py-1.5 flex items-center gap-1.5 shadow-lg"
    >
      <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-none touch-pan-x">
        {SYMBOLS.map((sym) => (
          <button
            key={sym.label}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onInsertSymbol(sym.snippet, sym.backOffset || 0);
            }}
            title={sym.title}
            className="shrink-0 min-h-[40px] min-w-[40px] px-2.5 rounded-lg border border-border bg-surface active:bg-surface-secondary text-xs font-mono font-semibold text-text-primary cursor-pointer"
          >
            {sym.label}
          </button>
        ))}
      </div>

      {onRunActiveCell && (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onRunActiveCell();
          }}
          className="shrink-0 min-h-[40px] px-3 rounded-lg bg-[#C2553A] hover:bg-[#D4664A] text-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
          aria-label="Jalankan sel aktif"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Run</span>
        </button>
      )}
    </div>
  );
}
