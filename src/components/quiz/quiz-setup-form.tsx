"use client";

import React, { useRef } from "react";
import {
  Sparkles,
  Upload,
  FileCode,
  Trash2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PythonIcon,
  ReactIcon,
  TypeScriptIcon,
  SupabaseIcon,
  GeminiIcon,
  TailwindIcon,
  AntigravityIcon,
} from "@/components/ui/brand-logos";

export interface PresetTopic {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRESET_TOPICS: PresetTopic[] = [
  { label: "Python Fundamentals", icon: PythonIcon },
  { label: "React & Next.js Web Dev", icon: ReactIcon },
  { label: "TypeScript & Modern JS", icon: TypeScriptIcon },
  { label: "SQL & Supabase Database", icon: SupabaseIcon },
  { label: "Kecerdasan Buatan (Google Gemini)", icon: GeminiIcon },
  { label: "Antigravity & Agentic AI", icon: AntigravityIcon },
  { label: "Tailwind CSS & UI Styling", icon: TailwindIcon },
];

interface QuizSetupFormProps {
  topic: string;
  onChangeTopic: (val: string) => void;
  difficulty: "mudah" | "sedang" | "sulit";
  onChangeDifficulty: (val: "mudah" | "sedang" | "sulit") => void;
  questionCount: number;
  onChangeQuestionCount: (val: number) => void;
  customContext: string;
  onChangeCustomContext: (val: string) => void;
  attachedFile: { name: string; size: string } | null;
  onClearFile: () => void;
  onSelectFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  onSubmit: (overrideTopic?: string) => void;
}

export function QuizSetupForm({
  topic,
  onChangeTopic,
  difficulty,
  onChangeDifficulty,
  questionCount,
  onChangeQuestionCount,
  customContext,
  onChangeCustomContext,
  attachedFile,
  onClearFile,
  onSelectFile,
  loading,
  onSubmit,
}: QuizSetupFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 1. Preset Topics */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Pilih Topik Akademik Populer</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {PRESET_TOPICS.map((preset, idx) => {
            const IconComp = preset.icon;
            const isSelected = topic.toLowerCase() === preset.label.toLowerCase();

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChangeTopic(preset.label);
                }}
                disabled={loading}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-brand-500/10 border-brand-500/30 text-brand-600 dark:text-brand-400 shadow-2xs font-semibold"
                    : "bg-surface border-border text-text-primary hover:border-border-hover hover:bg-surface-secondary"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-surface-secondary flex items-center justify-center shrink-0 border border-border">
                  <IconComp className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium truncate">{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Custom Topic & File Attachment */}
      <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-4 shadow-2xs">
        <div className="space-y-1.5">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary">
            Topik Kuis Spesifik
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => onChangeTopic(e.target.value)}
            placeholder="Contoh: Algoritma Sorting, Pemrograman Berorientasi Objek..."
            disabled={loading}
            className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-border bg-surface-secondary text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* File Attachment Area */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary flex items-center justify-between">
            <span>Lampiran Berkas Materi (Opsional)</span>
            <span className="text-[10px] font-normal text-text-tertiary font-sans">
              Mendukung berkas teks, kode, atau catatan (.txt, .py, .ts, .md, maks 10MB)
            </span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.py,.js,.ts,.tsx,.jsx,.json,.md,.csv,.sql"
            className="hidden"
            onChange={onSelectFile}
          />

          {attachedFile ? (
            <div className="flex items-center justify-between p-3 rounded-xl border border-brand-500/30 bg-brand-500/5 text-xs font-mono">
              <div className="flex items-center gap-2 min-w-0">
                <FileCode className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span className="font-semibold text-text-primary truncate">{attachedFile.name}</span>
                <span className="text-text-tertiary">({attachedFile.size})</span>
              </div>
              <button
                type="button"
                onClick={onClearFile}
                className="p-1 text-text-tertiary hover:text-rose-500 transition-colors cursor-pointer"
                title="Hapus berkas"
                aria-label="Hapus lampiran"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-dashed border-border bg-surface-secondary/50 text-xs text-text-secondary hover:text-text-primary hover:border-brand-500/50 hover:bg-surface-secondary transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Unggah Berkas Materi Kuis</span>
            </button>
          )}
        </div>

        {/* Optional Custom Context / Focus Directives */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary flex items-center justify-between">
            <span>Instruksi / Catatan Tambahan (Opsional)</span>
          </label>
          <input
            type="text"
            value={customContext}
            onChange={(e) => onChangeCustomContext(e.target.value)}
            placeholder="Contoh: Fokuskan pada penanganan error dan asynchronous programming..."
            disabled={loading}
            className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-border bg-surface-secondary text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* 3. Parameter: Difficulty & Question Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/70">
          {/* Difficulty Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary">
              Tingkat Kesulitan
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl border border-border bg-surface-secondary">
              {(["mudah", "sedang", "sulit"] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => onChangeDifficulty(diff)}
                  className={`py-2 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    difficulty === diff
                      ? "bg-surface text-brand-600 dark:text-brand-400 shadow-2xs border border-border/80"
                      : "text-text-tertiary hover:text-text-primary"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary">
              Jumlah Soal
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl border border-border bg-surface-secondary">
              {[5, 10, 15].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => onChangeQuestionCount(cnt)}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    questionCount === cnt
                      ? "bg-surface text-brand-600 dark:text-brand-400 shadow-2xs border border-border/80"
                      : "text-text-tertiary hover:text-text-primary"
                  }`}
                >
                  {cnt} Soal
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Action Button */}
        <div className="pt-2 flex justify-end">
          <Button
            size="lg"
            onClick={() => onSubmit()}
            disabled={loading || (!topic.trim() && !attachedFile)}
            className="w-full sm:w-auto gap-2 text-xs font-semibold min-h-[44px] shadow-2xs cursor-pointer"
          >
            {loading ? (
              <span>Menghasilkan Soal Kuis...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Hasilkan Kuis AI</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
