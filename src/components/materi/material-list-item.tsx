"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  FileCode,
  FileSpreadsheet,
  Bookmark,
  BookmarkCheck,
  Trash2,
  ArrowRight,
  Paperclip,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/dialog";
import { MATERIAL_TYPE_LABELS, MaterialType } from "@/types";
import { formatDate, formatFileSize } from "@/lib/utils";

interface MaterialListItemProps {
  material: any;
  isBookmarked: boolean;
  onToggleBookmark: (material: any) => void;
  onDelete: (id: string) => void;
}

export function MaterialListItem({
  material,
  isBookmarked,
  onToggleBookmark,
  onDelete,
}: MaterialListItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Determine icon & type styling
  const typeLabel = MATERIAL_TYPE_LABELS[material.type as MaterialType] || material.type || "Materi";
  const fileName = material.file_name || "";
  const isCode =
    material.type === "kode_program" ||
    fileName.endsWith(".py") ||
    fileName.endsWith(".ipynb") ||
    fileName.endsWith(".sql") ||
    fileName.endsWith(".js") ||
    fileName.endsWith(".ts");
  const isSpreadsheet =
    fileName.endsWith(".csv") ||
    fileName.endsWith(".xlsx") ||
    fileName.endsWith(".xls");

  const IconComponent = isCode
    ? FileCode
    : isSpreadsheet
    ? FileSpreadsheet
    : FileText;

  return (
    <div className="rounded-xl border border-border bg-surface hover:border-brand-500/40 transition-colors shadow-2xs overflow-hidden">
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Icon, Metadata & Title */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-surface-secondary border border-border flex items-center justify-center text-text-secondary shrink-0 mt-0.5">
            <IconComponent className="w-5 h-5 text-brand-500" />
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="neutral">
                {material.category?.name || "Umum"}
              </Badge>

              <Badge variant="secondary">
                {typeLabel}
              </Badge>

              {material.subject && (
                <span className="text-[11px] font-medium text-text-secondary">
                  {material.subject}
                </span>
              )}

              {material.file_size && (
                <span className="text-[10.5px] font-mono text-text-tertiary flex items-center gap-1">
                  <Paperclip className="w-3 h-3" />
                  {formatFileSize(material.file_size)}
                </span>
              )}
            </div>

            <Link
              href={`/dashboard/materi/${material.id}`}
              className="block group"
            >
              <h3 className="text-sm sm:text-base font-bold text-text-primary group-hover:text-brand-500 transition-colors leading-snug font-display tracking-tight line-clamp-1">
                {material.title}
              </h3>
            </Link>

            {material.description && (
              <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed max-w-3xl">
                {material.description}
              </p>
            )}

            <div className="flex items-center gap-3 text-[11px] font-mono text-text-tertiary pt-0.5">
              <span>Diperbarui {formatDate(material.updated_at || material.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions Group */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onToggleBookmark(material)}
              aria-pressed={isBookmarked}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isBookmarked
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                  : "border-border bg-surface hover:bg-surface-secondary text-text-tertiary hover:text-text-primary"
              }`}
              title={isBookmarked ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
              aria-label={isBookmarked ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-lg border border-border bg-surface hover:bg-rose-500/10 hover:border-rose-500/30 text-text-tertiary hover:text-rose-500 transition-colors cursor-pointer"
              title="Hapus Materi"
              aria-label={`Hapus materi ${material.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <Link
            href={`/dashboard/materi/${material.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-500/10 hover:bg-brand-500/15 border border-brand-500/20 transition-all group"
          >
            <span>Buka</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete(material.id);
        }}
        title="Hapus Materi Ini?"
        message={`Apakah Anda yakin ingin menghapus "${material.title}"? Berkas dan catatan terkait akan dihapus.`}
        confirmText="Hapus Materi"
      />
    </div>
  );
}
