"use client";

import React, { useRef } from "react";
import { JavaScriptIcon, PythonIcon } from "@/components/ui/brand-logos";

export interface CodeTemplate {
  label: string;
  code: string;
}

export interface LanguagePreset {
  name: string;
  extension: string;
  templates: CodeTemplate[];
}

interface PlaygroundEditorProps {
  lang: "javascript" | "python";
  onChangeLang: (l: "javascript" | "python") => void;
  code: string;
  onChangeCode: (c: string) => void;
  presets: Record<string, LanguagePreset>;
  onSelectTemplate: (templateCode: string) => void;
  selectedTemplateLabel: string;
}

export function PlaygroundEditor({
  lang,
  onChangeLang,
  code,
  onChangeCode,
  presets,
  onSelectTemplate,
  selectedTemplateLabel,
}: PlaygroundEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const currentPreset = presets[lang];

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-2xs flex flex-col h-[520px]">
      {/* Editor Top Toolbar */}
      <div className="p-3 border-b border-border bg-surface-secondary/50 flex flex-wrap items-center justify-between gap-3">
        {/* Language Tabs */}
        <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => onChangeLang("javascript")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              lang === "javascript"
                ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shadow-2xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <JavaScriptIcon className="w-3.5 h-3.5" />
            <span>JavaScript (.js)</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeLang("python")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              lang === "python"
                ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shadow-2xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <PythonIcon className="w-3.5 h-3.5" />
            <span>Python (.py)</span>
          </button>
        </div>

        {/* Template Presets Picker */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-text-tertiary hidden sm:inline">
            Template:
          </span>
          <div className="flex items-center gap-1">
            {currentPreset.templates.map((tpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectTemplate(tpl.code)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer border ${
                  selectedTemplateLabel === tpl.label
                    ? "bg-surface text-brand-600 dark:text-brand-400 border-brand-500/30 font-semibold shadow-2xs"
                    : "bg-surface-secondary text-text-secondary border-border hover:text-text-primary hover:border-border-hover"
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="flex-1 flex overflow-hidden font-mono text-xs sm:text-sm bg-surface-secondary/20">
        {/* Line Numbers Gutter */}
        <div className="w-12 py-3 px-2 bg-surface-secondary/60 text-right text-text-tertiary select-none border-r border-border/80 overflow-hidden font-mono text-xs leading-relaxed shrink-0">
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Code Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-text-primary focus:outline-none resize-none leading-relaxed font-mono overflow-auto scrollbar-thin whitespace-pre"
          placeholder="Tulis kode Anda di sini..."
          aria-label="Editor kode sumber"
        />
      </div>

      {/* Editor Footer Status */}
      <div className="p-2.5 px-3 border-t border-border bg-surface-secondary/30 flex items-center justify-between text-[11px] font-mono text-text-tertiary">
        <div className="flex items-center gap-3">
          <span>{lineCount} baris</span>
          <span>•</span>
          <span>{code.length} karakter</span>
        </div>
        <div className="hidden sm:inline">
          Tekan <kbd className="px-1.5 py-0.5 rounded border border-border bg-surface text-text-secondary">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded border border-border bg-surface text-text-secondary">Enter</kbd> untuk mengeksekusi
        </div>
      </div>
    </div>
  );
}
