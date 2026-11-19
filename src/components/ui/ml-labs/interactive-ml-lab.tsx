"use client";

import React, { useState } from "react";
import { Sliders, RotateCcw, Maximize2, Minimize2, Sparkles } from "lucide-react";
import { ML_LAB_REGISTRY, type InteractiveLabId } from "./types";
import { BiasVarianceLab } from "./bias-variance-lab";
import { GradientDescentLab } from "./gradient-descent-lab";
import { ThresholdCostLab } from "./threshold-cost-lab";
import { SvmKernelLab } from "./svm-kernel-lab";
import { BoostingLab } from "./boosting-lab";
import { ClusteringLab } from "./clustering-lab";
import { ConformalLab } from "./conformal-lab";
import { DriftWassersteinLab } from "./drift-wasserstein-lab";

interface InteractiveMLLabProps {
  labId: InteractiveLabId;
  customTitle?: string;
  className?: string;
}

export function InteractiveMLLab({ labId, customTitle, className = "" }: InteractiveMLLabProps) {
  const meta = ML_LAB_REGISTRY[labId];
  const [resetSignal, setResetSignal] = useState(0);
  const [expanded, setExpanded] = useState(false);

  if (!meta) return null;

  return (
    <section
      aria-label={customTitle || meta.title}
      className={`my-6 rounded-2xl border border-border bg-surface-secondary/70 dark:bg-[#141210] shadow-[inset_0_1px_0_rgba(255,248,240,0.04)] overflow-hidden not-prose transition-all ${
        expanded ? "fixed inset-4 z-50 overflow-y-auto p-0 bg-surface dark:bg-[#141210] shadow-2xl" : ""
      } ${className}`}
    >
      {/* Editorial Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3.5 border-b border-border bg-surface dark:bg-[#1C1917]">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#C2553A]/12 border border-[#D4664A]/30 flex items-center justify-center text-[#C2553A] dark:text-[#D4664A] shrink-0 mt-0.5">
            <Sliders className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-[#C2553A]/12 text-[#C2553A] dark:text-[#E5C194] border border-[#D4664A]/25">
                {meta.badge}
              </span>
              <span className="text-[10.5px] font-mono text-text-tertiary">INTERACTIVE SANDBOX</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-text-primary font-display tracking-tight mt-1">
              {customTitle || meta.title}
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed mt-0.5">
              {meta.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setResetSignal((n) => n + 1)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface-secondary hover:bg-surface-hover text-xs font-mono text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title="Reset parameter ke nilai awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="p-1.5 rounded-lg border border-border bg-surface-secondary hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title={expanded ? "Ciutkan Lab" : "Perbesar Lab"}
            aria-label={expanded ? "Ciutkan Lab" : "Perbesar Lab"}
          >
            {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Interactive Canvas Body */}
      <div className="p-4 sm:p-5">
        {labId === "bias-variance-poly" && <BiasVarianceLab resetSignal={resetSignal} />}
        {labId === "gradient-descent-2d" && <GradientDescentLab resetSignal={resetSignal} />}
        {labId === "threshold-cost-matrix" && <ThresholdCostLab resetSignal={resetSignal} />}
        {labId === "svm-kernel-margin" && <SvmKernelLab resetSignal={resetSignal} />}
        {labId === "boosting-iterations" && <BoostingLab resetSignal={resetSignal} />}
        {labId === "density-clustering" && <ClusteringLab resetSignal={resetSignal} />}
        {labId === "conformal-intervals" && <ConformalLab resetSignal={resetSignal} />}
        {labId === "drift-wasserstein" && <DriftWassersteinLab resetSignal={resetSignal} />}
      </div>

      {/* Principal Engineer Takeaway Footer */}
      <div className="px-4 sm:px-5 py-3 border-t border-border bg-surface/70 dark:bg-[#1C1917]/60 flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
        <Sparkles className="w-4 h-4 text-[#D4664A] shrink-0 mt-0.5" />
        <span>
          <strong className="text-text-primary font-semibold">Intuisi Praktisi: </strong>
          {meta.takeaway}
        </span>
      </div>
    </section>
  );
}

export * from "./types";
