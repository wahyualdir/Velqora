"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = "python",
  title,
  className,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
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

  const lines = code.trim().split("\n");

  return (
    <div
      className={cn(
        "vt-window rounded-none overflow-hidden border border-border bg-[#1C1917] text-[#FAF8F5] my-2 text-xs font-mono shadow-xs",
        className
      )}
    >
      {/* Titlebar Header */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#292524] border-b border-[#44403C] text-[#A8A29E] select-none">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <Terminal className="w-3.5 h-3.5 text-brand-500 shrink-0" />
          <span className="font-bold text-[#FAF8F5] truncate text-[11px]">
            {title || `script.${language === "python" ? "py" : language}`}
          </span>
          <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold bg-[#1C1917] border border-[#44403C] text-[#D6D3CB]">
            {language}
          </span>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="px-2.5 py-1 rounded bg-[#1C1917] hover:bg-[#3F3F46] text-[#D6D3CB] hover:text-white border border-[#44403C] transition-all flex items-center gap-1.5 text-[11px] font-mono cursor-pointer shrink-0"
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
      </div>

      {/* Code Body */}
      <div className="p-3.5 sm:p-4 overflow-x-auto">
        <pre className="font-mono text-xs leading-relaxed text-[#FAF8F5] whitespace-pre">
          {showLineNumbers ? (
            <code>
              {lines.map((line, idx) => (
                <div key={idx} className="table-row">
                  <span className="table-cell pr-4 text-[#78716C] select-none text-right font-mono text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="table-cell">{line}</span>
                </div>
              ))}
            </code>
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
