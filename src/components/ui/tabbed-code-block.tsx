"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Layers, Play, Cpu, Server } from "lucide-react";
import { CodeBlock } from "./code-block";
import type { PlotType } from "./code-plot-visualizer";

export interface CodeTabItem {
  id: string;
  label: string;
  code: string;
  language?: string;
  filename?: string;
  plotType?: PlotType;
  runtimeBadge?: "pyodide-ready" | "production-env";
}

interface TabbedCodeBlockProps {
  tabs: CodeTabItem[];
  defaultTabId?: string;
  className?: string;
}

export function TabbedCodeBlock({ tabs, defaultTabId, className = "" }: TabbedCodeBlockProps) {
  const [activeTabId, setActiveTabId] = useState<string>(() => {
    if (defaultTabId && tabs.some((t) => t.id === defaultTabId)) {
      return defaultTabId;
    }
    return tabs[0]?.id || "";
  });

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  if (!tabs || tabs.length === 0) return null;

  const activeLang = activeTab?.language || "python";
  const canRunInPlayground =
    activeTab &&
    ["python", "sql", "javascript", "typescript"].includes(activeLang.toLowerCase()) &&
    activeTab.runtimeBadge !== "production-env";

  const playgroundHref = activeTab
    ? `/dashboard/playground?code=${encodeURIComponent(activeTab.code)}&lang=${encodeURIComponent(activeLang)}`
    : "/dashboard/playground";

  return (
    <div
      className={`my-5 rounded-2xl border border-[#292524] bg-[#141210] shadow-[inset_0_1px_0_rgba(255,248,240,0.04),0_10px_28px_-14px_rgba(0,0,0,0.65)] overflow-hidden not-prose ${className}`}
    >
      {/* Horizontal Tab Navigation Bar — Warm Obsidian L2 */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-[#1C1917] border-b border-[#292524] select-none">
        <div className="flex items-center gap-1.5 min-w-0 overflow-x-auto scrollbar-none">
          <Layers className="w-3.5 h-3.5 text-[#D4664A] shrink-0 mr-1" />

          <div className="flex items-center gap-1 py-0.5">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#24201D] text-[#F5F5F4] border border-[#D4664A]/40 shadow-[inset_0_1px_0_rgba(255,248,240,0.06)]"
                      : "text-[#A8A29E] hover:text-[#F5F5F4] hover:bg-[#24201D]/60 border border-transparent"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isActive ? "bg-[#D4664A]" : "bg-[#6E6863]"
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Runtime Badge + 1-Click Run in Lab Notebook */}
        <div className="flex items-center gap-2 shrink-0">
          {activeTab?.runtimeBadge === "pyodide-ready" && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/28"
              title="100% dapat dijalankan langsung di browser (Pyodide WebAssembly)"
            >
              <Cpu className="w-3 h-3" />
              <span>Pyodide Ready</span>
            </span>
          )}
          {activeTab?.runtimeBadge === "production-env" && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#E5C194]/10 text-[#E5C194] border border-[#E5C194]/28"
              title="Arsitektur skala produksi / diagnostik lokal"
            >
              <Server className="w-3 h-3" />
              <span>Production Env</span>
            </span>
          )}

          {canRunInPlayground && (
            <Link
              href={playgroundHref}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#C2553A] hover:bg-[#B34B32] text-[#FFFBF8] text-[11px] font-mono font-semibold border border-[#D4664A]/40 transition-colors"
              title="Jalankan skrip ini langsung di Velqora Lab Notebook"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Jalankan</span>
            </Link>
          )}
        </div>
      </div>

      {/* Active Code Block */}
      {activeTab && (
        <div className="[&>div]:my-0 [&>div]:border-0 [&>div]:rounded-none">
          <CodeBlock
            key={activeTab.id}
            code={activeTab.code}
            language={activeLang}
            title={activeTab.filename || activeTab.label}
            plotType={activeTab.plotType}
            className="!my-0 !border-0 !rounded-none shadow-none"
          />
        </div>
      )}
    </div>
  );
}
