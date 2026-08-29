"use client";

import React, { useRef } from "react";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  X,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const QUICK_ACTIONS = [
  { label: "Jelaskan Konsep", prompt: "Jelaskan konsep utama materi ini secara ringkas dan terstruktur." },
  { label: "Berikan Contoh Kode", prompt: "Berikan contoh implementasi kode praktis beserta penjelasannya." },
  { label: "Uji Pemahaman", prompt: "Buat 3 pertanyaan evaluasi singkat untuk menguji pemahaman saya." },
  { label: "Ringkas Poin Kunci", prompt: "Rangkum 5 poin paling penting dari materi ini." },
];

interface AIComposerProps {
  input: string;
  onChangeInput: (val: string) => void;
  onSubmit: () => void;
  isTyping: boolean;
  selectedImage: {
    previewUrl: string;
  } | null;
  onClearImage: () => void;
  onSelectImageClick: () => void;
  selectedFile: {
    fileName: string;
    sizeFormatted: string;
  } | null;
  onClearFile: () => void;
  onSelectFileClick: () => void;
  onQuickPrompt: (prompt: string) => void;
}

export function AIComposer({
  input,
  onChangeInput,
  onSubmit,
  isTyping,
  selectedImage,
  onClearImage,
  onSelectImageClick,
  selectedFile,
  onClearFile,
  onSelectFileClick,
  onQuickPrompt,
}: AIComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isTyping && (input.trim() || selectedImage || selectedFile)) {
        onSubmit();
      }
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Quick Action Suggestions */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_ACTIONS.map((action, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onQuickPrompt(action.prompt)}
            disabled={isTyping}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-surface-secondary text-[11px] font-medium text-text-secondary hover:text-brand-500 hover:border-brand-500/30 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
          >
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Main Composer Box */}
      <div className="rounded-xl border border-border bg-surface shadow-2xs p-2.5 space-y-2 focus-within:border-brand-500/80 transition-colors">
        {/* Attachment Previews */}
        {(selectedImage || selectedFile) && (
          <div className="flex items-center gap-2 flex-wrap pb-1 border-b border-border/60">
            {selectedImage && (
              <div className="relative inline-flex items-center gap-1.5 p-1 rounded-lg border border-border bg-surface-secondary">
                <img
                  src={selectedImage.previewUrl}
                  alt="Preview"
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="text-[11px] text-text-secondary font-mono">Gambar</span>
                <button
                  type="button"
                  onClick={onClearImage}
                  className="p-1 text-text-tertiary hover:text-rose-500 cursor-pointer"
                  aria-label="Hapus lampiran gambar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {selectedFile && (
              <div className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-surface-secondary text-[11px] font-mono text-text-secondary">
                <FileCode className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span className="truncate max-w-[140px]">{selectedFile.fileName}</span>
                <span className="text-text-tertiary">({selectedFile.sizeFormatted})</span>
                <button
                  type="button"
                  onClick={onClearFile}
                  className="p-0.5 text-text-tertiary hover:text-rose-500 cursor-pointer ml-1"
                  aria-label="Hapus lampiran berkas"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Textarea Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onChangeInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tanyakan konsep, analisis kode, atau minta penjelasan..."
          rows={2}
          disabled={isTyping}
          className="w-full resize-none bg-transparent text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none leading-relaxed"
          aria-label="Input pesan konsultasi AI"
        />

        {/* Bottom Toolbar & Send Button */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* File/Image Upload Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onSelectImageClick}
              disabled={isTyping}
              className="p-1.5 rounded-lg border border-border bg-surface-secondary text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors cursor-pointer disabled:opacity-50"
              title="Lampirkan Gambar/Diagram"
              aria-label="Lampirkan gambar"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onSelectFileClick}
              disabled={isTyping}
              className="p-1.5 rounded-lg border border-border bg-surface-secondary text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors cursor-pointer disabled:opacity-50"
              title="Lampirkan Berkas Kode/Teks (.py, .ts, .txt, .sql, dll)"
              aria-label="Lampirkan berkas teks atau kode"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          {/* Send Button */}
          <Button
            size="sm"
            onClick={onSubmit}
            disabled={isTyping || (!input.trim() && !selectedImage && !selectedFile)}
            className="gap-1.5 text-xs font-semibold px-4 cursor-pointer"
            aria-label="Kirim pertanyaan"
          >
            {isTyping ? (
              <span>Menyusun...</span>
            ) : (
              <>
                <span>Kirim</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
