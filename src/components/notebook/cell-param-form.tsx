"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import {
  extractCellFormMeta,
  updateCellParamValue,
} from "@/lib/notebook/param-parser";
import type { CellParamDef, NotebookKernel } from "@/lib/notebook/types";

interface CellParamFormProps {
  source: string;
  kernel: NotebookKernel;
  onChangeSource: (nextSource: string, autoRun?: boolean) => void;
  layout?: "stacked" | "split";
}

export function CellParamForm({
  source,
  kernel,
  onChangeSource,
  layout = "stacked",
}: CellParamFormProps) {
  const formMeta = useMemo(() => extractCellFormMeta(source), [source]);
  const [collapsed, setCollapsed] = useState(false);
  const sliderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeSourceRef = useRef(onChangeSource);

  useEffect(() => {
    onChangeSourceRef.current = onChangeSource;
  }, [onChangeSource]);

  useEffect(() => {
    return () => {
      if (sliderTimerRef.current) {
        clearTimeout(sliderTimerRef.current);
      }
    };
  }, []);

  if (
    !formMeta.title &&
    !formMeta.description &&
    formMeta.params.length === 0
  ) {
    return null;
  }

  const handleParamChange = (
    param: CellParamDef,
    nextValue: string | number | boolean,
    autoRun = true,
    debounceRun = false
  ) => {
    const nextCode = updateCellParamValue(source, param, nextValue, kernel);
    if (debounceRun && autoRun) {
      if (sliderTimerRef.current) {
        clearTimeout(sliderTimerRef.current);
      }
      onChangeSource(nextCode, false);
      sliderTimerRef.current = setTimeout(() => {
        onChangeSourceRef.current(nextCode, true);
        sliderTimerRef.current = null;
      }, 180);
      return;
    }

    onChangeSource(nextCode, autoRun);
  };

  const isSplit = layout === "split";

  return (
    <div
      className={
        isSplit
          ? "h-full p-3 bg-surface-secondary/30 border-t xl:border-t-0 xl:border-l border-border/80 space-y-2.5"
          : "px-3.5 py-2.5 border-b border-border/80 bg-[#F3EFE9]/55 dark:bg-[#161412] space-y-2.5"
      }
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
            <SlidersHorizontal className="w-3.5 h-3.5 shrink-0 text-[#C2553A] dark:text-[#D4664A]" />
            <span className="truncate">
              {formMeta.title || "Parameter Interaktif"}
            </span>
            {formMeta.params.length > 0 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-secondary text-text-secondary">
                {formMeta.params.length}
              </span>
            )}
          </div>
          {!collapsed && formMeta.description && (
            <p className="text-[11.5px] text-text-secondary">
              {formMeta.description}
            </p>
          )}
        </div>
        {formMeta.params.length > 0 && (
          <button
            type="button"
            onClick={() => setCollapsed((p) => !p)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-border/80 bg-surface hover:bg-surface-secondary text-[11px] font-medium text-text-secondary cursor-pointer shrink-0 transition-colors"
            title={collapsed ? "Tampilkan parameter" : "Ciutkan parameter"}
          >
            <span>{collapsed ? "Buka" : "Ciutkan"}</span>
            {collapsed ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronUp className="w-3 h-3" />
            )}
          </button>
        )}
      </div>

      {!collapsed && formMeta.params.length > 0 && (
        <div
          className={
            isSplit
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5"
          }
        >
          {formMeta.params.map((param) => (
            <div
              key={`${param.name}_${param.lineIndex}`}
              className={`flex flex-col gap-1 rounded-xl border border-border/80 bg-surface ${
                isSplit ? "p-2" : "p-2.5"
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                <label className="font-semibold text-text-primary truncate">
                  {param.label}
                </label>
                {param.type === "slider" && (
                  <span className="font-bold text-[#C2553A] dark:text-[#D4664A] tabular-nums">
                    {String(param.value)}
                  </span>
                )}
              </div>

              {param.type === "slider" && (
                <input
                  type="range"
                  min={param.min ?? 0}
                  max={param.max ?? 100}
                  step={param.step ?? 1}
                  value={Number(param.value)}
                  onChange={(e) =>
                    handleParamChange(param, Number(e.target.value), true, true)
                  }
                  className="w-full accent-[#C2553A] cursor-pointer min-h-[26px]"
                />
              )}

              {(param.type === "number" || param.type === "integer") && (
                <input
                  type="number"
                  step={param.type === "integer" ? 1 : "any"}
                  value={Number(param.value)}
                  onChange={(e) =>
                    handleParamChange(param, Number(e.target.value), false)
                  }
                  className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg border border-border bg-surface-secondary/40 text-xs font-mono text-text-primary focus:outline-hidden focus:border-[#C2553A]"
                />
              )}

              {param.type === "boolean" && (
                <button
                  type="button"
                  role="switch"
                  aria-checked={Boolean(param.value)}
                  onClick={() =>
                    handleParamChange(param, !Boolean(param.value), true)
                  }
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                    param.value
                      ? "bg-[#C2553A]/12 border-[#C2553A]/40 text-[#C2553A] dark:text-[#D4664A]"
                      : "bg-surface-secondary border-border text-text-secondary"
                  }`}
                >
                  <span>{param.value ? "Aktif (True)" : "Nonaktif (False)"}</span>
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${
                      param.value ? "bg-[#C2553A]" : "bg-border-strong"
                    }`}
                  />
                </button>
              )}

              {param.type === "dropdown" && (
                <select
                  value={String(param.value)}
                  onChange={(e) => {
                    const selected = param.options?.find(
                      (opt) => String(opt) === e.target.value
                    );
                    handleParamChange(param, selected ?? e.target.value, true);
                  }}
                  className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg border border-border bg-surface-secondary/40 text-xs font-mono text-text-primary focus:outline-hidden focus:border-[#C2553A] cursor-pointer"
                >
                  {(param.options || []).map((opt) => (
                    <option key={String(opt)} value={String(opt)}>
                      {String(opt)}
                    </option>
                  ))}
                </select>
              )}

              {param.type === "date" && (
                <input
                  type="date"
                  value={String(param.value)}
                  onChange={(e) =>
                    handleParamChange(param, e.target.value, true)
                  }
                  className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg border border-border bg-surface-secondary/40 text-xs font-mono text-text-primary focus:outline-hidden focus:border-[#C2553A]"
                />
              )}

              {(param.type === "string" || param.type === "raw") && (
                <input
                  type="text"
                  value={String(param.value)}
                  onChange={(e) =>
                    handleParamChange(param, e.target.value, false)
                  }
                  className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg border border-border bg-surface-secondary/40 text-xs font-mono text-text-primary focus:outline-hidden focus:border-[#C2553A]"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
