"use client";

import React, { useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  extractCellFormMeta,
  updateCellParamValue,
} from "@/lib/notebook/param-parser";
import type { CellParamDef, NotebookKernel } from "@/lib/notebook/types";

interface CellParamFormProps {
  source: string;
  kernel: NotebookKernel;
  onChangeSource: (nextSource: string, autoRun?: boolean) => void;
}

export function CellParamForm({
  source,
  kernel,
  onChangeSource,
}: CellParamFormProps) {
  const formMeta = useMemo(() => extractCellFormMeta(source), [source]);

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
    autoRun = true
  ) => {
    const nextCode = updateCellParamValue(source, param, nextValue, kernel);
    onChangeSource(nextCode, autoRun);
  };

  return (
    <div className="p-3.5 border-t border-border/80 bg-[#F3EFE9]/60 dark:bg-[#181512] space-y-3">
      {(formMeta.title || formMeta.description) && (
        <div className="space-y-0.5">
          {formMeta.title && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
              <span>{formMeta.title}</span>
            </div>
          )}
          {formMeta.description && (
            <p className="text-[11.5px] text-text-secondary">
              {formMeta.description}
            </p>
          )}
        </div>
      )}

      {formMeta.params.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formMeta.params.map((param) => (
            <div
              key={`${param.name}_${param.lineIndex}`}
              className="flex flex-col gap-1 p-2.5 rounded-xl border border-border bg-surface"
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
                    handleParamChange(param, Number(e.target.value), true)
                  }
                  className="w-full accent-[#C2553A] cursor-pointer min-h-[28px]"
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
