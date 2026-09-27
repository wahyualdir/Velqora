"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { useTheme } from "next-themes";
import { GitBranch, AlertTriangle, Check, Copy } from "lucide-react";

/**
 * Membersihkan dan menormalisasi sintaks Mermaid chart dari karakter yang berbenturan
 * dengan lexer Mermaid v12 (tanda kurung pada edge label, operator perbandingan, pipa bersyarat, norma matriks).
 */
export function sanitizeMermaidChart(chart: string): string {
  if (!chart) return "";

  return chart
    .split("\n")
    .map((line) => {
      let cleaned = line;

      // 0. Normalisasi probabilitas bersyarat internal di dalam tanda kurung misal P(Y|X)
      // agar delimiter pipa tidak memotong label edge secara prematur
      while (/\(([^)\n]*?)\|([^)\n]*?)\)/.test(cleaned)) {
        cleaned = cleaned.replace(/\(([^)\n]*?)\|([^)\n]*?)\)/g, "$1 given $2");
      }

      // 1. Amankan label edge (-->|...|, -.->|...|, ==>|...|, ---|...|, --|...|) yang belum diapit tanda kutip ganda
      cleaned = cleaned.replace(/(-->|-\.->|==>|---|--)\s*\|([^"|\n]+)\|/g, (match, arrow, label) => {
        let safe = label.trim();
        // Ganti pipa internal yang tersisa
        safe = safe.replace(/([A-Z])\|([A-Z])/g, "$1 given $2");
        safe = safe.replace(/\|/g, " / ");
        // Normalisasi simbol perbandingan matematis
        safe = safe.replace(/<=/g, "≤").replace(/>=/g, "≥");
        // Jika terdapat tanda kurung, koma, perbandingan, atau ekspresi matematika, bungkus kutip
        if (/[()<>,<=|:+*\/]/.test(safe)) {
          return `${arrow}|"${safe}"|`;
        }
        return `${arrow}|${safe}|`;
      });

      // 2. Normalisasi dobel pipa norma matriks ||...|| di dalam string teks node
      cleaned = cleaned.replace(/\|\|([^|\n]+)\|\|/g, "Norm($1)");

      // 3. Normalisasi nilai mutlak sederhana |...| di dalam teks deskripsi node
      cleaned = cleaned.replace(/\|([A-Za-z0-9_().\s\^*/+-]+)\|/g, (m, val) => {
        if (m.startsWith("-->|") || m.endsWith("|") || m.startsWith("-.->|") || m.startsWith("==>|")) return m;
        return `Abs(${val.trim()})`;
      });

      return cleaned;
    })
    .join("\n");
}

interface MermaidDiagramProps {
  chart: string;
  className?: string;
  title?: string;
}

export function MermaidDiagram({ chart, className = "", title }: MermaidDiagramProps) {
  const { resolvedTheme } = useTheme();
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  // Generate safe HTML id without colons
  const uniqueId = `mermaid-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !chart) return;

    let isCancelled = false;

    async function renderChart() {
      try {
        setError(null);
        const mermaid = (await import("mermaid")).default;
        
        const isDark = resolvedTheme === "dark";
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
          themeVariables: isDark
            ? {
                primaryColor: "#3B82F6",
                primaryTextColor: "#F1F5F9",
                primaryBorderColor: "#60A5FA",
                lineColor: "#94A3B8",
                secondaryColor: "#1E293B",
                tertiaryColor: "#0F172A",
                background: "#090D16",
              }
            : {
                primaryColor: "#2563EB",
                primaryTextColor: "#0F172A",
                primaryBorderColor: "#3B82F6",
                lineColor: "#64748B",
                secondaryColor: "#F8FAFC",
                tertiaryColor: "#F1F5F9",
                background: "#FFFFFF",
              },
        });

        // Clean any previous temp render elements if mermaid left any
        const tempId = `temp-${uniqueId}-${Date.now()}`;
        const sanitized = sanitizeMermaidChart(chart.trim());
        const { svg } = await mermaid.render(tempId, sanitized);

        if (!isCancelled) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.warn("Mermaid render warning:", err);
        if (!isCancelled) {
          setError(err?.message || "Gagal merender diagram Mermaid");
        }
      }
    }

    renderChart();

    return () => {
      isCancelled = true;
    };
  }, [chart, resolvedTheme, mounted, uniqueId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) {
    return (
      <div className={`my-6 rounded-xl border border-border bg-surface-secondary/40 p-6 animate-pulse ${className}`}>
        <div className="h-32 flex items-center justify-center text-xs text-text-tertiary">
          Memuat diagram...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`my-6 rounded-xl border border-border bg-surface-secondary/40 backdrop-blur-sm overflow-hidden shadow-sm transition-all hover:border-border-strong not-prose ${className}`}
    >
      {/* Diagram Header */}
      <div className="flex items-center justify-between border-b border-border bg-surface-secondary/70 px-4 py-2 text-xs">
        <div className="flex items-center gap-2 font-medium text-text-secondary">
          <GitBranch className="w-3.5 h-3.5 text-brand-500" />
          <span>{title || "Diagram Alur & Arsitektur"}</span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors text-[11px]"
          title="Salin kode Mermaid"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Salin Sintaks</span>
            </>
          )}
        </button>
      </div>

      {/* Diagram Body */}
      <div className="p-4 sm:p-6 overflow-x-auto flex justify-center items-center min-h-[140px]" ref={containerRef}>
        {error ? (
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2.5 max-w-lg">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Peringatan Sintaks Diagram</p>
              <p className="text-[11px] font-mono leading-relaxed opacity-90 break-words">{error}</p>
            </div>
          </div>
        ) : svgContent ? (
          <div
            className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto transition-transform"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="text-xs text-text-tertiary animate-pulse">Menghasilkan diagram vektor...</div>
        )}
      </div>
    </div>
  );
}
