"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { PlotType } from "./code-plot-visualizer";
import { CodePlotVisualizer } from "./code-plot-visualizer";

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
  showLineNumbers?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  plotType?: PlotType;
}

function renderHighlightedLine(line: string, lineIndex: number): React.ReactNode {
  if (!line.trim()) {
    return <span key={lineIndex} className="block leading-relaxed select-none">&nbsp;</span>;
  }

  if (/^\s*(#|\/\/)/.test(line)) {
    return (
      <span key={lineIndex} className="block leading-relaxed text-[#8C857F] italic">
        {line}
      </span>
    );
  }

  const tokenRegex = /(#.*$|\/\/.*$|f?"""[\s\S]*?"""|f?'''[\s\S]*?'''|f?"[^"\\]*(?:\\.[^"\\]*)*"|f?'[^'\\]*(?:\\.[^'\\]*)*'|\b(?:class|def|return|if|elif|else|import|from|as|for|in|while|try|except|finally|raise|with|lambda|yield|async|await|pass|break|continue|None|True|False|self|global|nonlocal|and|or|not|is)\b|\b(?:print|len|range|int|float|str|list|dict|set|tuple|sum|min|max|round|enumerate|zip|map|filter|super|type|isinstance|open|__init__|np|pd|plt|torch|nn|tf)\b|\b\d+(?:\.\d+)?\b)/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let tKey = 0;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      elements.push(
        <span key={`p-${tKey++}`} className="text-[#E7E5E4]">
          {line.slice(lastIndex, match.index)}
        </span>
      );
    }

    const token = match[0];
    if (token.startsWith("#") || token.startsWith("//")) {
      elements.push(
        <span key={`tok-${tKey++}`} className="text-[#8C857F] italic">
          {token}
        </span>
      );
    } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith('f"') || token.startsWith("f'")) {
      elements.push(
        <span key={`tok-${tKey++}`} className="text-[#6EE7B7] font-normal">
          {token}
        </span>
      );
    } else if (
      /^(class|def|return|if|elif|else|import|from|as|for|in|while|try|except|finally|raise|with|lambda|yield|async|await|pass|break|continue|None|True|False|self|global|nonlocal|and|or|not|is)$/.test(
        token
      )
    ) {
      elements.push(
        <span key={`tok-${tKey++}`} className="text-[#F09A82] font-semibold">
          {token}
        </span>
      );
    } else if (/^\d+(\.\d+)?$/.test(token)) {
      elements.push(
        <span key={`tok-${tKey++}`} className="text-[#E5C194] font-normal">
          {token}
        </span>
      );
    } else {
      elements.push(
        <span key={`tok-${tKey++}`} className="text-[#93C5FD] font-medium">
          {token}
        </span>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    elements.push(
      <span key={`p-${tKey++}`} className="text-[#E7E5E4]">
        {line.slice(lastIndex)}
      </span>
    );
  }

  return (
    <span key={lineIndex} className="block leading-relaxed">
      {elements}
    </span>
  );
}

export function CodeBlock({
  code,
  language = "python",
  title,
  className,
  showLineNumbers = false,
  collapsible = false,
  defaultExpanded = true,
  plotType,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState<"code" | "plot">("code");

  const resolvedPlot = useMemo(() => {
    return plotType || null;
  }, [plotType]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Kode disalin ke clipboard!");
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Gagal menyalin kode ke clipboard.");
    }
  };

  const lines = useMemo(() => code.trim().split("\n"), [code]);

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden border border-[#292524] bg-[#141210] !bg-[#141210] text-[#F5F5F4] my-4 text-xs font-mono shadow-[inset_0_1px_0_rgba(255,248,240,0.04)] w-full max-w-full min-w-0 touch-pan-x",
        className
      )}
      style={{ backgroundColor: "#141210" }}
    >
      {/* Titlebar Header — Warm Obsidian L2 */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-[#1C1917] !bg-[#1C1917] border-b border-[#292524] text-[#A8A29E] select-none",
          collapsible && "cursor-pointer hover:bg-[#24201D] transition-colors"
        )}
        style={{ backgroundColor: "#1C1917" }}
        onClick={collapsible ? () => setIsExpanded((prev) => !prev) : undefined}
      >
        <div className="flex items-center gap-2 min-w-0 pr-2">
          {/* If Plot is Available, render Tab Switcher */}
          {resolvedPlot ? (
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#141210] border border-[#292524]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab("code");
                  if (!isExpanded) setIsExpanded(true);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer",
                  activeTab === "code"
                    ? "bg-[#24201D] text-[#F5F5F4]"
                    : "text-[#A8A29E] hover:text-[#F5F5F4]"
                )}
              >
                <Terminal className="w-3 h-3 text-[#D4664A]" />
                <span>Skrip {language === "python" ? "Python" : language.toUpperCase()}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab("plot");
                  if (!isExpanded) setIsExpanded(true);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer relative",
                  activeTab === "plot"
                    ? "bg-[#D4664A]/15 text-[#E5C194] border border-[#D4664A]/35"
                    : "text-[#A8A29E] hover:text-[#E5C194]"
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4664A]" />
                <span>Hasil Visual / Grafik Plot</span>
              </button>
            </div>
          ) : (
            <>
              <Terminal className="w-3.5 h-3.5 text-[#D4664A] shrink-0" />
              <span className="font-semibold text-[#E7E5E4] truncate text-[11px]">
                {title || `script.${language === "python" ? "py" : language}`}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-[#141210] border border-[#292524] text-[#A8A29E] shrink-0">
                {language}
              </span>
            </>
          )}

          <span className="text-[10.5px] text-[#8C857F] font-mono hidden sm:inline tabular-nums">
            {lines.length} baris
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-md bg-[#141210] hover:bg-[#24201D] text-[#A8A29E] hover:text-[#F5F5F4] border border-[#292524] transition-all flex items-center gap-1.5 text-[11px] font-mono cursor-pointer shrink-0"
            title="Salin kode ke clipboard"
            aria-label="Salin kode ke clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#34D399]" />
                <span className="text-[#34D399] font-bold">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </>
            )}
          </button>

          {collapsible && (
            <div className="flex items-center gap-1 text-[11px] text-[#A8A29E] hover:text-[#F5F5F4] transition-colors">
              <span className="hidden sm:inline font-sans font-medium">
                {isExpanded ? "Tutup" : "Buka Kode"}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body: Render Code or Plot Visualizer */}
      {(!collapsible || isExpanded) && (
        <>
          {activeTab === "plot" && resolvedPlot ? (
            <CodePlotVisualizer type={resolvedPlot} title={title} />
          ) : (
            <div
              className="p-3.5 sm:p-4 overflow-x-auto scrollbar-thin touch-pan-x max-w-full bg-[#141210] !bg-[#141210]"
              style={{ backgroundColor: "#141210" }}
            >
              <pre className="font-mono text-xs leading-[1.65] text-[#F5F5F4] whitespace-pre">
                {showLineNumbers ? (
                  <div className="table w-full">
                    {lines.map((line, idx) => (
                      <div key={idx} className="table-row">
                        <span className="table-cell pr-4 text-[#6E6863] select-none text-right font-mono text-[11px] w-8 tabular-nums">
                          {idx + 1}
                        </span>
                        <span className="table-cell">
                          {renderHighlightedLine(line, idx)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <code>{lines.map((line, idx) => renderHighlightedLine(line, idx))}</code>
                )}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
