"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Folder } from "lucide-react";
import { Modal } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { toast } from "sonner";
import { createNote } from "@/actions/study/notes";
import type { CategoryTreeFolder } from "@/actions/study/notes";
import { isCategoryInActiveScope } from "@/lib/constants";

interface NewNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: CategoryTreeFolder[];
  defaultTitle?: string;
  defaultCategoryId?: string | null;
}

export function NewNoteModal({
  isOpen,
  onClose,
  categories = [],
  defaultTitle = "",
  defaultCategoryId = null,
}: NewNoteModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState(defaultTitle);
  const [categoryId, setCategoryId] = useState<string | null>(defaultCategoryId);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(defaultTitle);
      setCategoryId(defaultCategoryId);
      setContent(defaultTitle ? `# ${defaultTitle}\n\n` : "");
    }
  }, [isOpen, defaultTitle, defaultCategoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Judul catatan harus diisi.");
      return;
    }

    try {
      setLoading(true);
      const newNote = await createNote({
        title: title.trim(),
        content_markdown: content || `# ${title.trim()}\n\n`,
        categoryId: categoryId || undefined,
      });

      toast.success(`Catatan "${newNote.title}" berhasil dibuat!`);
      onClose();
      router.push(`/dashboard/catatan/${newNote.slug}`);
    } catch (err: any) {
      toast.error(err.message || "Gagal membuat catatan.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buat Catatan Kurikulum Baru">
      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="font-bold text-text-primary uppercase text-[11px]">
            Judul Catatan *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Transformer Architecture"
            required
            className="text-xs font-mono"
            autoFocus
          />
        </div>

        {/* Category Selection */}
        {categories.length > 0 && (
          <div className="space-y-1.5">
            <label className="font-bold text-text-primary uppercase text-[11px] flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-brand-500" />
              <span>Kategori Pembelajaran</span>
            </label>
            <select
              value={categoryId || ""}
              onChange={(e) => setCategoryId(e.target.value || null)}
              className="w-full px-3 py-2 rounded-md bg-surface border border-border text-xs font-mono text-text-primary focus:outline-hidden focus:border-brand-500 cursor-pointer"
            >
              <option value="">Tanpa Kategori (Catatan Lepas)</option>
              {categories
                .filter((c) => isCategoryInActiveScope(c.name))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Content Preview / Seed */}
        <div className="space-y-1.5">
          <label className="font-bold text-text-primary uppercase text-[11px] flex items-center justify-between">
            <span>Isi Catatan Awal (Markdown)</span>
            <span className="text-[10px] text-text-tertiary lowercase font-normal">
              Bisa diedit nanti di halaman catatan
            </span>
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis ringkasan awal... gunakan [[WikiLink]] untuk menautkan catatan lain."
            rows={5}
            className="text-xs font-mono resize-y"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="text-xs font-mono"
          >
            Batal
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={loading}
            className="text-xs font-mono font-bold bg-brand-600 hover:bg-brand-700 text-white gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{loading ? "Menyimpan..." : "Buat Catatan"}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
