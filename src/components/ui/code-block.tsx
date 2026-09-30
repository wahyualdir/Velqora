"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CodePlotVisualizer, type PlotType } from "./code-plot-visualizer";

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
      <span key={lineIndex} className="block leading-relaxed text-zinc-500 dark:text-zinc-400 italic">
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
        <span key={`p-${tKey++}`} className="text-zinc-200">
          {line.slice(lastIndex, match.index)}
        </span>
      );
    }

    const token = match[0];
    if (token.startsWith("#") || token.startsWith("//")) {
      elements.push(
        <span key={`tok-${tKey++}`} className="text-zinc-500 dark:text-zinc-400 italic">
          {token}
        </span>
      );
    } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith('f"') || token.startsWith("f'")) {
      elements.push(
        <span key={`tok-${tKey++}`} className="text-emerald-400 font-normal">
          {token}
        </span>
      );
    } else if (
      /^(class|def|return|if|elif|else|import|from|as|for|in|while|try|except|finally|raise|with|lambda|yield|async|await|pass|break|continue|None|True|False|self|global|nonlocal|and|or|not|is)$/.test(
        token
      )
    ) {
      elements.push(
        <span key={`tok-${tKey++}`} className="text-purple-400 font-semibold">
          {token}
        </span>
      );
    } else if (/^\d+(\.\d+)?$/.test(token)) {
      elements.push(
        <span key={`tok-${tKey++}`} className="text-amber-400 font-normal">
          {token}
        </span>
      );
    } else {
      elements.push(
        <span key={`tok-${tKey++}`} className="text-sky-400 font-medium">
          {token}
        </span>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    elements.push(
      <span key={`p-${tKey++}`} className="text-zinc-200">
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

function detectPlotFromCode(code: string, title?: string, language?: string): PlotType | null {
  const combined = `${title || ""} ${code}`;

  // 1. Explicit annotation match
  const plotMatch = combined.match(/(?:@plot:|plot=|\[PLOT\]:|\[VISUAL_OUTPUT\]:)\s*["']?([\w-]+)["']?/i);
  if (plotMatch) {
    const matched = plotMatch[1].toLowerCase();
    if (matched.includes("decision") || matched.includes("hyperplane") || matched.includes("boundary") || matched.includes("svm")) {
      return "decision-boundary";
    }
    if (matched.includes("loss") || matched.includes("decay") || matched.includes("convergence") || matched.includes("kurva") || matched.includes("epoch")) {
      return "loss-curve";
    }
    if (matched.includes("confusion") || matched.includes("matrix") || matched.includes("konfusi") || matched.includes("eval")) {
      return "confusion-matrix";
    }
    if (matched.includes("voronoi") || matched.includes("cluster") || matched.includes("klaster") || matched.includes("kmeans")) {
      return "voronoi";
    }
  }

  // 2. Intelligent semantic detection for Python code
  const isPython = !language || language === "python" || /(?:import |def |np\.|plt\.|sklearn)/i.test(code);
  if (!isPython) return null;

  const lower = combined.toLowerCase();

  // A. Confusion Matrix / Evaluation
  if (
    lower.includes("confusion_matrix") ||
    lower.includes("classification_report") ||
    lower.includes("f1_score") ||
    lower.includes("precision_score") ||
    lower.includes("recall_score") ||
    lower.includes("matriks konfusi") ||
    lower.includes("confusionmatrixdisplay")
  ) {
    return "confusion-matrix";
  }

  // B. Clustering / Voronoi Space
  if (
    lower.includes("kmeans") ||
    lower.includes("dbscan") ||
    lower.includes("agglomerativeclustering") ||
    lower.includes("cluster_centers_") ||
    lower.includes("silhouette_score") ||
    lower.includes("voronoi") ||
    lower.includes("n_clusters") ||
    lower.includes("inertia_") ||
    lower.includes("klasterisasi")
  ) {
    return "voronoi";
  }

  // C. Loss Convergence / Optimization / Epoch Training / Regression
  if (
    lower.includes("train_loss") ||
    lower.includes("val_loss") ||
    lower.includes("loss_history") ||
    lower.includes("cost_history") ||
    lower.includes("learning_rate") ||
    lower.includes("gradient_descent") ||
    lower.includes("double_descent") ||
    lower.includes("grokking") ||
    lower.includes("sgdregressor") ||
    lower.includes("linearregression") ||
    lower.includes("mean_squared_error") ||
    lower.includes("adam") ||
    lower.includes("epochs")
  ) {
    return "loss-curve";
  }

  // D. Decision Boundary / Classifiers / Hyperplane
  if (
    lower.includes("svc(") ||
    lower.includes("linearsvc") ||
    lower.includes("logisticregression") ||
    lower.includes("decisiontreeclassifier") ||
    lower.includes("randomforestclassifier") ||
    lower.includes("gradientboostingclassifier") ||
    lower.includes("xgbclassifier") ||
    lower.includes("decision_function") ||
    lower.includes("predict_proba") ||
    lower.includes("hyperplane") ||
    lower.includes("support_vectors_") ||
    lower.includes("boundary")
  ) {
    return "decision-boundary";
  }

  // E. Generic fallback for model fitting code
  if (lower.includes(".fit(") || lower.includes("fit_transform(")) {
    if (lower.includes("regress") || lower.includes("loss") || lower.includes("mse")) {
      return "loss-curve";
    }
    if (lower.includes("cluster") || lower.includes("centroid")) {
      return "voronoi";
    }
    return "decision-boundary";
  }

  return null;
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
    return plotType || detectPlotFromCode(code, title, language);
  }, [plotType, code, title, language]);

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
        "rounded-lg overflow-hidden border border-zinc-700/80 dark:border-zinc-800 bg-[#18181B] !bg-[#18181B] text-[#FAF8F5] my-3 text-xs font-mono shadow-md w-full max-w-full min-w-0 touch-pan-x",
        className
      )}
      style={{ backgroundColor: "#18181B" }}
    >
      {/* Titlebar Header with Interactive Tab Switcher */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-[#27272A] !bg-[#27272A] border-b border-zinc-700/70 dark:border-zinc-800 text-zinc-400 select-none",
          collapsible && "cursor-pointer hover:bg-[#303036] transition-colors"
        )}
        style={{ backgroundColor: "#27272A" }}
        onClick={collapsible ? () => setIsExpanded((prev) => !prev) : undefined}
      >
        <div className="flex items-center gap-2 min-w-0 pr-2">
          {/* If Plot is Available, render Tab Switcher */}
          {resolvedPlot ? (
            <div className="flex items-center gap-1 p-0.5 rounded-md bg-[#18181B] border border-zinc-700/80">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab("code");
                  if (!isExpanded) setIsExpanded(true);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer",
                  activeTab === "code"
                    ? "bg-[#3F3F46] text-white shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                <Terminal className="w-3 h-3 text-brand-400" />
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
                  "flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer relative",
                  activeTab === "plot"
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-xs"
                    : "text-zinc-400 hover:text-sky-300"
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span>Hasil Visual / Grafik Plot</span>
              </button>
            </div>
          ) : (
            <>
              <Terminal className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span className="font-bold text-zinc-200 truncate text-[11px]">
                {title || `script.${language === "python" ? "py" : language}`}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-[#18181B] border border-zinc-700 text-zinc-300 shrink-0">
                {language}
              </span>
            </>
          )}

          <span className="text-[10.5px] text-zinc-500 font-mono hidden sm:inline">
            {lines.length} baris
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 rounded bg-[#18181B] hover:bg-[#3F3F46] text-zinc-300 hover:text-white border border-zinc-700 transition-all flex items-center gap-1.5 text-[11px] font-mono cursor-pointer shrink-0"
            title="Salin kode ke clipboard"
            aria-label="Salin kode ke clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </>
            )}
          </button>

          {collapsible && (
            <div className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors">
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
              className="p-3.5 sm:p-4 overflow-x-auto scrollbar-thin touch-pan-x max-w-full bg-[#18181B] !bg-[#18181B]"
              style={{ backgroundColor: "#18181B" }}
            >
              <pre className="font-mono text-xs leading-relaxed text-[#F4F4F5] whitespace-pre">
                {showLineNumbers ? (
                  <div className="table w-full">
                    {lines.map((line, idx) => (
                      <div key={idx} className="table-row">
                        <span className="table-cell pr-4 text-zinc-600 select-none text-right font-mono text-[11px] w-8">
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
