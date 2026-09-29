"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Layers } from "lucide-react";
import { toast } from "sonner";
import { CodeBlock } from "./code-block";
import type { PlotType } from "./code-plot-visualizer";

export interface CodeTabItem {
  id: string;
  label: string;
  code: string;
  language?: string;
  filename?: string;
  plotType?: PlotType;
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

  return (
    <div className={`my-4 rounded-xl border border-zinc-700/80 bg-[#18181B] shadow-md overflow-hidden ${className}`}>
      {/* Horizontal Tab Navigation Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#202023] border-b border-zinc-700/80 overflow-x-auto scrollbar-thin select-none">
        <div className="flex items-center gap-1.5 min-w-0">
          <Layers className="w-3.5 h-3.5 text-brand-400 shrink-0 mr-1" />
          <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider hidden sm:inline mr-2 font-bold">
            Implementasi:
          </span>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`px-3 py-1.5 rounded-md font-mono text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#2E2E33] text-white shadow-xs border border-zinc-600/80"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-[#27272A]"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? "bg-brand-400" : "bg-zinc-600"
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#141416] text-zinc-400 border border-zinc-700 shrink-0 ml-2">
          {activeTab?.language || "python"}
        </span>
      </div>

      {/* Active Code Block */}
      {activeTab && (
        <div className="[&>div]:my-0 [&>div]:border-0 [&>div]:rounded-none">
          <CodeBlock
            key={activeTab.id}
            code={activeTab.code}
            language={activeTab.language || "python"}
            title={activeTab.filename || activeTab.label}
            plotType={activeTab.plotType}
            className="!my-0 !border-0 !rounded-none shadow-none"
          />
        </div>
      )}
    </div>
  );
}
