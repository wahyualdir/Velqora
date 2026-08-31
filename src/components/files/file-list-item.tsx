"use client";

import React, { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  FileCode,
  FolderArchive,
  FileSpreadsheet,
  FileBox,
  Download,
  Trash2,
  Copy,
  Check,
  Eye,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface FileListItemProps {
  file: any;
  onPreview: (file: any) => void;
  onCopyUrl: (file: any) => void;
  isCopied: boolean;
  onDelete: (id: string, path: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (file: any) => void;
}

export function FileListItem({
  file,
  onPreview,
  onCopyUrl,
  isCopied,
  onDelete,
  isBookmarked,
  onToggleBookmark,
}: FileListItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // File Icon Helper
  const getFileIcon = (mime: string = "", name: string = "") => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (mime.includes("pdf") || ext === "pdf") {
      return <FileText className="w-5 h-5 text-rose-500" />;
    }
    if (mime.includes("image") || ["jpg", "jpeg", "png", "webp", "gif"].includes(ext || "")) {
      return <ImageIcon className="w-5 h-5 text-sky-500" />;
    }
    if (["py", "js", "ts", "tsx", "jsx", "html", "css", "sql", "json"].includes(ext || "")) {
      return <FileCode className="w-5 h-5 text-amber-500" />;
    }
    if (["zip", "rar", "tar", "gz", "7z"].includes(ext || "")) {
      return <FolderArchive className="w-5 h-5 text-purple-500" />;
    }
    if (["csv", "xlsx", "xls"].includes(ext || "")) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    }
    return <FileBox className="w-5 h-5 text-text-tertiary" />;
  };

  return (
    <>
      <Card padding="none" hover className="overflow-hidden">
        <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Icon & File Meta */}
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-lg bg-surface-secondary flex items-center justify-center shrink-0 border border-border">
              {getFileIcon(file.mime_type, file.name)}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => onPreview(file)}
                  className="text-xs sm:text-sm font-semibold text-text-primary hover:text-brand-500 text-left truncate transition-colors cursor-pointer"
                  title="Buka pratinjau berkas"
                >
                  {file.name}
                </button>
              </div>

              <div className="flex items-center gap-2.5 text-[11px] font-mono text-text-tertiary flex-wrap">
                <span>{formatFileSize(file.size || 0)}</span>
                <span>•</span>
                <span className="truncate max-w-[120px]">{file.mime_type || "Berkas"}</span>
                <span>•</span>
                <span>{formatDate(file.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
            {/* Bookmark Action */}
            <button
              type="button"
              onClick={() => onToggleBookmark(file)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isBookmarked
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  : "bg-surface-secondary text-text-tertiary border-border hover:text-text-primary"
              }`}
              title={isBookmarked ? "Hapus dari tersimpan" : "Simpan berkas"}
              aria-label="Simpan berkas"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {/* Copy URL */}
            <button
              type="button"
              onClick={() => onCopyUrl(file)}
              className="p-1.5 rounded-lg border border-border bg-surface-secondary text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
              title="Salin tautan unduhan"
              aria-label="Salin tautan"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* Preview Button */}
            <button
              type="button"
              onClick={() => onPreview(file)}
              className="p-1.5 rounded-lg border border-border bg-surface-secondary text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
              title="Pratinjau berkas"
              aria-label="Pratinjau"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Direct Download Link */}
            {file.url && (
              <a
                href={file.url}
                download={file.name}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg border border-border bg-surface-secondary text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                title="Unduh berkas"
                aria-label="Unduh"
              >
                <Download className="w-4 h-4" />
              </a>
            )}

            {/* Delete Action */}
            <button
              type="button"
              onClick={() => setDeleteDialogOpen(true)}
              className="p-1.5 rounded-lg border border-border bg-surface-secondary text-text-tertiary hover:text-rose-500 transition-colors cursor-pointer"
              title="Hapus berkas"
              aria-label="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          onDelete(file.id, file.file_path || file.path);
          setDeleteDialogOpen(false);
        }}
        title="Hapus Berkas Akademik?"
        message={`Apakah Anda yakin ingin menghapus berkas "${file.name}" dari cloud storage? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Berkas"
      />
    </>
  );
}
