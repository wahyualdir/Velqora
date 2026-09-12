"use client";

import React, { useState, useEffect } from "react";
import { Search, FileText, Loader2, BookOpen, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { searchNotes } from "@/actions/study/notes";

export interface SelectedNotePayload {
  id: string;
  title: string;
  slug: string;
  category?: string;
}

interface NotePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNote: (note: SelectedNotePayload) => Promise<void> | void;
}

export function NotePickerModal({
  isOpen,
  onClose,
  onSelectNote,
}: NotePickerModalProps) {
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState<
    Array<{ id: string; title: string; slug: string; excerpt: string; category?: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [selectingSlug, setSelectingSlug] = useState<string | null>(null);

  // Load initial notes or search on query change
  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    setLoading(true);

    const timer = setTimeout(() => {
      searchNotes(query, 25)
        .then((res) => {
          if (active) {
            setNotes(res);
            setLoading(false);
          }
        })
        .catch(() => {
          if (active) setLoading(false);
        });
    }, 150);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, isOpen]);

  // Reset state on modal open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectingSlug(null);
    }
  }, [isOpen]);

  const handleChoose = async (note: { id: string; title: string; slug: string; category?: string }) => {
    setSelectingSlug(note.slug);
    try {
      await onSelectNote(note);
      onClose();
    } finally {
      setSelectingSlug(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-text-primary">
            Pilih Catatan dari Knowledge Vault
          </span>
        </div>
      }
      description="Pilih salah satu catatan kurikulum AI sebagai materi acuan pembuatan soal kuis evaluasi."
    >
      <div className="space-y-4 pt-2">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul catatan atau topik (contoh: Naive Bayes, CNN, LLM, Agent...)"
            autoFocus
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-surface-secondary text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-hidden focus:border-brand-500 font-sans"
          />
        </div>

        {/* Note List Container */}
        <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-text-tertiary text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
              <span>Mencari catatan di Vault...</span>
            </div>
          ) : notes.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-xs text-text-secondary">
                Tidak ditemukan catatan yang cocok dengan kata kunci &quot;{query}&quot;.
              </p>
              <p className="text-[11px] text-text-tertiary">
                Coba gunakan istilah konsep lain seperti &quot;Regresi&quot;, &quot;Transformer&quot;, atau &quot;Klasifikasi&quot;.
              </p>
            </div>
          ) : (
            notes.map((n) => {
              const isSelected = selectingSlug === n.slug;

              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleChoose(n)}
                  disabled={Boolean(selectingSlug)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 group ${
                    isSelected
                      ? "bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400"
                      : "bg-surface border-border hover:border-brand-500/40 hover:bg-surface-secondary/70"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center shrink-0 border border-border text-brand-600 dark:text-brand-400 group-hover:bg-brand-500/10 transition-colors">
                    {isSelected ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate">
                        {n.title}
                      </h4>
                      {n.category && (
                        <Badge variant="outline" size="sm" className="text-[10px] shrink-0">
                          {n.category}
                        </Badge>
                      )}
                    </div>

                    {n.excerpt && (
                      <p className="text-[11px] text-text-tertiary line-clamp-2 leading-relaxed">
                        {n.excerpt}
                      </p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-text-tertiary">
          <span>Menampilkan {notes.length} catatan kurikulum</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            AI akan menyusun pertanyaan spesifik dari isi catatan terpilih
          </span>
        </div>
      </div>
    </Modal>
  );
}
