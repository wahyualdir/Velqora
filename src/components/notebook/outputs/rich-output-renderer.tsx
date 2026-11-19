"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { NoteRenderer } from "@/components/notes/note-renderer";
import type { RichCellOutput } from "@/lib/notebook/types";
import { DataFrameExplorer } from "./dataframe-explorer";
import { PlotOutput } from "./plot-output";
import { SqlTableOutput } from "./sql-table-output";
import { TracebackOutput } from "./traceback-output";

interface RichOutputRendererProps {
  outputs: RichCellOutput[];
  onAskAiFix?: (errorSummary: string) => void;
  onInsertCode?: (code: string, kernel?: "python" | "sql") => void;
}

function buildSandboxedHtmlSrcDoc(rawHtml: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  body { margin: 10px; font-family: system-ui, -apple-system, sans-serif; font-size: 13px; color: #1c1917; background: #ffffff; }
  table { border-collapse: collapse; font-size: 12px; width: 100%; }
  th, td { border: 1px solid #e4ddd4; padding: 4px 8px; text-align: left; }
  th { background: #faf8f5; }
</style>
</head>
<body>${rawHtml}</body>
</html>`;
}

function buildPlotlySrcDoc(spec: Record<string, unknown>): string {
  const safeJson = JSON.stringify(spec).replace(/<\/script/gi, "<\\/script");
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<style>body { margin: 0; background: #ffffff; } #chart { width: 100%; height: 340px; }</style>
</head>
<body>
<div id="chart"></div>
<script>
  try {
    var spec = ${safeJson};
    if (window.Plotly) {
      window.Plotly.newPlot("chart", spec.data || [], Object.assign({ margin: { t: 32, r: 16, b: 36, l: 44 } }, spec.layout || {}), { responsive: true });
    } else {
      document.getElementById("chart").innerText = "Plotly membutuhkan koneksi internet untuk render interaktif.";
    }
  } catch (e) {
    document.getElementById("chart").innerText = String(e);
  }
</script>
</body>
</html>`;
}

export function RichOutputRenderer({
  outputs,
  onAskAiFix,
  onInsertCode,
}: RichOutputRendererProps) {
  if (!outputs || outputs.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {outputs.map((out, idx) => {
        if (out.kind === "stream") {
          const isStderr = out.name === "stderr";
          return (
            <pre
              key={idx}
              className={`font-mono text-[13px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-words max-h-[420px] ${
                isStderr
                  ? "border-l-2 border-amber-500 pl-3 py-1 bg-amber-500/5 text-amber-800 dark:text-amber-200 rounded-r-lg"
                  : "text-text-primary"
              }`}
            >
              {out.text}
            </pre>
          );
        }

        if (out.kind === "text") {
          return (
            <pre
              key={idx}
              className="font-mono text-[13px] leading-relaxed text-text-primary whitespace-pre-wrap break-words overflow-x-auto max-h-[420px]"
            >
              {out.text}
            </pre>
          );
        }

        if (out.kind === "markdown") {
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-border bg-surface prose dark:prose-invert max-w-none text-sm"
            >
              <NoteRenderer content={out.markdown} />
            </div>
          );
        }

        if (out.kind === "image") {
          return (
            <PlotOutput
              key={idx}
              mimeType={out.mimeType}
              data={out.data}
              caption={out.caption}
            />
          );
        }

        if (out.kind === "dataframe") {
          return (
            <DataFrameExplorer
              key={idx}
              payload={out.data}
              onInsertCode={
                onInsertCode ? (code) => onInsertCode(code, "python") : undefined
              }
            />
          );
        }

        if (out.kind === "sql_result") {
          return <SqlTableOutput key={idx} payload={out.data} />;
        }

        if (out.kind === "html") {
          return (
            <iframe
              key={idx}
              sandbox="allow-scripts"
              title={`Output HTML Sel #${idx + 1}`}
              srcDoc={buildSandboxedHtmlSrcDoc(out.html)}
              style={{ height: `${Math.min(480, Math.max(160, out.height || 240))}px` }}
              className="w-full rounded-xl border border-border bg-white"
            />
          );
        }

        if (out.kind === "plotly") {
          return (
            <iframe
              key={idx}
              sandbox="allow-scripts"
              title={`Grafik Plotly Interaktif #${idx + 1}`}
              srcDoc={buildPlotlySrcDoc(out.spec)}
              className="w-full h-[360px] rounded-xl border border-border bg-white"
            />
          );
        }

        if (out.kind === "test_result") {
          const allPassed = out.passed === out.total;
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border space-y-2 text-xs font-mono ${
                allPassed
                  ? "border-emerald-500/35 bg-emerald-500/8 text-emerald-800 dark:text-emerald-200"
                  : "border-rose-500/35 bg-rose-500/8 text-rose-800 dark:text-rose-200"
              }`}
            >
              <div className="flex items-center justify-between gap-2 font-bold">
                <span>
                  Autograder: {out.passed} / {out.total} Uji Lulus
                </span>
                {allPassed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                )}
              </div>
              <div className="space-y-1">
                {out.cases.map((c, cIdx) => (
                  <div key={cIdx} className="flex items-start gap-2 text-[11px]">
                    {c.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <div className="font-medium">{c.name}</div>
                      {c.message && (
                        <div className="text-[10.5px] opacity-85">{c.message}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (out.kind === "error") {
          return (
            <TracebackOutput
              key={idx}
              ename={out.ename}
              evalue={out.evalue}
              traceback={out.traceback}
              lineNumber={out.lineNumber}
              onAskAiFix={onAskAiFix}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
