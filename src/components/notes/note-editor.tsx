"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  Edit3,
  Save,
  Bold,
  Italic,
  Code,
  Link as LinkIcon,
  Hash,
  Heading2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteRenderer } from "./note-renderer";
import type { NoteLinkItem } from "@/actions/study/notes";

interface NoteEditorProps {
  initialTitle: string;
  initialContent: string;
  outgoingLinks?: NoteLinkItem[];
  onSave: (data: { title: string; content: string }) => Promise<void>;
  onDanglingClick?: (rawTitle: string) => void;
  canEdit?: boolean;
}

export function NoteEditor({
  initialTitle,
  initialContent,
  outgoingLinks = [],
  onSave,
  onDanglingClick,
  canEdit = true,
}: NoteEditorProps) {
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state if props change from outside
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setIsDirty(false);
  }, [initialTitle, initialContent]);

  // Insert markdown syntax around selected text
  const insertFormatting = (prefix: string, suffix = prefix, placeholder = "teks") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || placeholder;

    const replacement = `${prefix}${selected}${suffix}`;
    const newContent = content.slice(0, start) + replacement + content.slice(end);

    setContent(newContent);
    setIsDirty(true);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length
      );
    }, 10);
  };

  const handleSave = async () => {
    if (!isDirty || isSaving) return;
    try {
      setIsSaving(true);
      await onSave({ title, content });
      setIsDirty(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  // Keyboard shortcut Ctrl+S or Cmd+S
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] dark:bg-[#141416] border border-border overflow-hidden">
      {/* ─── 1. Editor Control Bar ─── */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#FFFFFF] dark:bg-[#18181B] border-b border-border select-none">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-surface-secondary border border-border text-xs">
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs font-semibold transition-all cursor-pointer ${
              mode === "preview"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          {canEdit && (
            <button
              type="button"
              onClick={() => setMode("edit")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs font-semibold transition-all cursor-pointer ${
                mode === "edit"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit (Source)</span>
            </button>
          )}
        </div>

        {/* Formatting Toolbar (Only visible in Edit Mode) */}
        {mode === "edit" && (
          <div className="hidden sm:flex items-center gap-1 font-mono text-xs text-text-secondary">
            <button
              type="button"
              onClick={() => insertFormatting("**", "**", "teks tebal")}
              className="p-1.5 rounded hover:bg-surface-secondary hover:text-text-primary cursor-pointer"
              title="Tebal (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("*", "*", "teks miring")}
              className="p-1.5 rounded hover:bg-surface-secondary hover:text-text-primary cursor-pointer"
              title="Miring (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("## ", "", "Judul Bagian")}
              className="p-1.5 rounded hover:bg-surface-secondary hover:text-text-primary cursor-pointer"
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("\n```python\n", "\n```\n", "# kode python")}
              className="p-1.5 rounded hover:bg-surface-secondary hover:text-text-primary cursor-pointer"
              title="Blok Kode"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("[[", "]]", "Judul Catatan")}
              className="p-1.5 rounded hover:bg-surface-secondary hover:text-text-primary cursor-pointer text-brand-600 dark:text-brand-400 font-bold"
              title="Wiki-Link [[Catatan]]"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("#", "", "tag")}
              className="p-1.5 rounded hover:bg-surface-secondary hover:text-text-primary cursor-pointer"
              title="Tambah #tag"
            >
              <Hash className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Save Status & Button */}
        {canEdit && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-text-tertiary hidden sm:inline">
              {isSaving
                ? "Menyimpan..."
                : justSaved
                ? "Tersimpan ✓"
                : isDirty
                ? "Belum disimpan"
                : "Tersimpan"}
            </span>

            <Button
              size="sm"
              disabled={!isDirty || isSaving}
              onClick={handleSave}
              className={`gap-1.5 text-xs font-mono font-semibold cursor-pointer ${
                isDirty ? "bg-brand-600 hover:bg-brand-700 text-white" : ""
              }`}
            >
              {justSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Tersimpan</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* ─── 2. Editor / Preview Body ─── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        {mode === "edit" ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Judul Catatan..."
              className="w-full text-2xl sm:text-3xl font-bold font-display bg-transparent text-text-primary placeholder:text-text-tertiary focus:outline-hidden border-b border-border/60 pb-2"
            />

            {/* Markdown Textarea */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setIsDirty(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Tulis materi catatan Anda di sini... Gunakan [[Judul Catatan]] untuk membuat tautan wiki-link dan #tag untuk menambahkan label."
              rows={24}
              className="w-full p-4 bg-surface dark:bg-[#18181B] border border-border text-xs sm:text-sm font-mono text-text-primary placeholder:text-text-tertiary leading-relaxed focus:outline-hidden focus:border-brand-500 rounded-none shadow-inner resize-y min-h-[500px]"
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <NoteRenderer
              content={content}
              outgoingLinks={outgoingLinks}
              onDanglingClick={onDanglingClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}
