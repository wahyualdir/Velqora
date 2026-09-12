"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  BookmarkCheck,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Github,
  Play,
  ExternalLink,
  MoreVertical,
  CheckSquare,
  Square,
  FileCode,
  Info,
} from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import { ConfirmDialog } from "@/components/ui/dialog";
import { ModuleDriveFile } from "@/types/module-drive";

export interface NotebookCellCodeSnippet {
  code: string;
  language?: string;
  title?: string;
}

export interface NotebookCellChapter {
  id: string;
  title: string;
  is_completed?: boolean;
  duration_minutes?: number | null;
}

export interface NotebookCellProps {
  index: number;
  title: string;
  description?: string;
  tag?: string; // e.g. "teori", "modul", "proyek"
  level?: "pemula" | "menengah" | "lanjutan" | string;
  codeSnippet?: NotebookCellCodeSnippet | null;
  href?: string;
  isPlaceholder?: boolean;
  placeholderNotice?: string;
  // Module specific data
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  canModify?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  deleteConfirmTitle?: string;
  deleteConfirmMessage?: string;
  githubUrl?: string;
  demoUrl?: string;
  // Expandable chapters & files
  chapters?: NotebookCellChapter[];
  onToggleChapter?: (chapterId: string, currentStatus: boolean) => Promise<void> | void;
  togglingChapterId?: string | null;
  driveFiles?: ModuleDriveFile[];
  onFilePreview?: (file: ModuleDriveFile) => void;
  className?: string;
}

export function NotebookCell({
  index,
  title,
  description,
  tag,
  level,
  codeSnippet,
  href,
  isPlaceholder = false,
  placeholderNotice = "contoh — belum ada catatan tersimpan",
  isBookmarked,
  onToggleBookmark,
  canModify = false,
  onEdit,
  onDelete,
  deleteConfirmTitle = "Hapus Entri Ini?",
  deleteConfirmMessage = "Apakah Anda yakin ingin menghapus entri ini? Tindakan ini tidak dapat dibatalkan.",
  githubUrl,
  demoUrl,
  chapters = [],
  onToggleChapter,
  togglingChapterId,
  driveFiles = [],
  onFilePreview,
  className = "",
}: NotebookCellProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Execution number format: [01]:, [02]:, etc.
  const executionIndex = `[${String(index + 1).padStart(2, "0")}]:`;

  const totalChapters = chapters.length;
  const completedChapters = chapters.filter((c) => c.is_completed).length;
  const hasExpandableContent = totalChapters > 0 || driveFiles.length > 0;

  const levelLabel =
    level === "pemula"
      ? "Pemula"
      : level === "menengah"
      ? "Menengah"
      : level === "lanjutan"
      ? "Lanjutan"
      : level;

  return (
    <div
      className={`group relative border-b border-border/70 py-4 px-2 sm:px-3 hover:bg-surface-secondary/40 transition-colors ${className}`}
    >
      <div className="flex items-start gap-2.5 sm:gap-3.5">
        {/* Monospace Execution Number e.g. [01]: */}
        <div className="font-mono text-xs text-text-tertiary select-none shrink-0 pt-0.5 w-10 sm:w-11">
          <span>{executionIndex}</span>
        </div>

        {/* Main Cell Content */}
        <div className="min-w-0 flex-1 space-y-1.5 pr-8 sm:pr-24">
          {/* Metadata Row: Tag & Level */}
          {(tag || level || totalChapters > 0) && (
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono text-text-tertiary">
              {tag && (
                <span className="px-1.5 py-0.2 rounded bg-surface-secondary text-text-secondary border border-border text-[10.5px]">
                  #{tag}
                </span>
              )}

              {level && (
                <>
                  <span className="text-text-tertiary opacity-60">·</span>
                  <span className="text-text-secondary uppercase tracking-wider text-[10.5px]">
                    {levelLabel}
                  </span>
                </>
              )}

              {totalChapters > 0 && (
                <>
                  <span className="text-text-tertiary opacity-60">·</span>
                  <span className="text-text-tertiary text-[10.5px]">
                    {completedChapters}/{totalChapters} Bab Selesai
                  </span>
                </>
              )}
            </div>
          )}

          {/* Title */}
          <div>
            {href ? (
              <Link
                href={href}
                className="inline-flex items-center gap-1.5 font-bold text-sm sm:text-base text-text-primary hover:text-brand-600 dark:hover:text-brand-400 transition-colors tracking-tight font-sans"
              >
                <span>{title}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-brand-600 dark:text-brand-400 shrink-0" />
              </Link>
            ) : (
              <h3 className="font-bold text-sm sm:text-base text-text-primary tracking-tight font-sans">
                {title}
              </h3>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-2 max-w-4xl">
              {description}
            </p>
          )}

          {/* Placeholder Indicator */}
          {isPlaceholder && (
            <div className="text-[11px] font-mono text-text-tertiary italic flex items-center gap-1.5 pt-0.5">
              <Info className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
              <span>{placeholderNotice}</span>
            </div>
          )}

          {/* Project URLs: GitHub & Live Demo */}
          {(githubUrl || demoUrl) && (
            <div className="flex items-center gap-3 pt-1 flex-wrap text-xs font-mono">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-semibold text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}
              {demoUrl && (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}
            </div>
          )}

          {/* Optional Code Snippet Input Cell */}
          {codeSnippet && codeSnippet.code && (
            <div className="pt-2 max-w-4xl">
              <CodeBlock
                code={codeSnippet.code}
                language={codeSnippet.language || "python"}
                title={codeSnippet.title || `input.${codeSnippet.language || "py"}`}
                className="my-1"
                showLineNumbers={false}
              />
            </div>
          )}

          {/* Toggle Syllabus Button if has chapters or files */}
          {hasExpandableContent && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="inline-flex items-center gap-1 text-xs font-mono text-text-secondary hover:text-text-primary transition-colors cursor-pointer py-1"
                aria-expanded={isExpanded}
              >
                <span>{isExpanded ? "Tutup Silabus" : "Lihat Silabus"}</span>
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-text-tertiary" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-text-tertiary" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Action Toolbar (Desktop: Hover Toolbar) ─── */}
      <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute top-3.5 right-3 bg-surface/90 backdrop-blur-xs border border-border/70 p-1 rounded-md shadow-2xs z-10">
        {onToggleBookmark && (
          <button
            type="button"
            onClick={onToggleBookmark}
            className={`p-1.5 rounded hover:bg-surface-secondary text-text-secondary transition-colors cursor-pointer ${
              isBookmarked ? "text-amber-600 dark:text-amber-400 font-bold" : ""
            }`}
            title={isBookmarked ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
            aria-label={isBookmarked ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            ) : (
              <Bookmark className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        {canModify && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 rounded hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title="Edit Entri"
            aria-label={`Edit ${title}`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}

        {canModify && onDelete && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1.5 rounded hover:bg-surface-secondary text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors cursor-pointer"
            title="Hapus Entri"
            aria-label={`Hapus ${title}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {href && (
          <Link
            href={href}
            className="p-1.5 rounded hover:bg-surface-secondary text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
            title="Buka Catatan"
            aria-label={`Buka ${title}`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* ─── Action Toolbar (Mobile: Kebab Menu) ─── */}
      {(onToggleBookmark || canModify || href) && (
        <div className="sm:hidden absolute top-3.5 right-2 z-10">
          <button
            type="button"
            onClick={() => setShowMobileMenu((prev) => !prev)}
            className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
            aria-label="Buka menu aksi"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMobileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMobileMenu(false)}
              />
              <div className="absolute right-0 top-8 w-44 bg-surface border border-border shadow-md rounded-md p-1.5 z-50 text-xs font-mono space-y-1">
                {onToggleBookmark && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileMenu(false);
                      onToggleBookmark();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-surface-secondary flex items-center gap-2 text-text-secondary cursor-pointer"
                  >
                    {isBookmarked ? (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Hapus Bookmark</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Simpan Bookmark</span>
                      </>
                    )}
                  </button>
                )}

                {canModify && onEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileMenu(false);
                      onEdit();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-surface-secondary flex items-center gap-2 text-text-secondary cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                )}

                {canModify && onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowDeleteConfirm(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-surface-secondary flex items-center gap-2 text-rose-600 dark:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                )}

                {href && (
                  <Link
                    href={href}
                    onClick={() => setShowMobileMenu(false)}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-surface-secondary flex items-center gap-2 text-brand-600 dark:text-brand-400 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Buka Catatan</span>
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── Expandable Chapters & Drive Files ─── */}
      {isExpanded && hasExpandableContent && (
        <div className="mt-3 ml-0 sm:ml-12 border border-border/70 bg-surface-secondary/40 rounded-md p-3 sm:p-4 space-y-3">
          {/* Chapters Checklist */}
          {totalChapters > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-text-tertiary uppercase tracking-wider font-semibold">
                <span>Daftar Bab & Silabus ({totalChapters})</span>
                <span className="text-[10px] lowercase font-normal">centang untuk menandai tuntas</span>
              </div>

              <div className="divide-y divide-border/60 border border-border/70 bg-surface rounded overflow-hidden">
                {chapters.map((ch, idx) => (
                  <div
                    key={ch.id || idx}
                    className="flex items-center justify-between p-2.5 hover:bg-surface-secondary/50 transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      {onToggleChapter ? (
                        <button
                          type="button"
                          onClick={() => onToggleChapter(ch.id, Boolean(ch.is_completed))}
                          disabled={togglingChapterId === ch.id}
                          className="text-text-tertiary hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer disabled:opacity-50 transition-colors shrink-0"
                          title={ch.is_completed ? "Tandai belum selesai" : "Tandai selesai"}
                          aria-label={`Ubah status bab ${ch.title}`}
                        >
                          {ch.is_completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-text-tertiary" />
                          )}
                        </button>
                      ) : ch.is_completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-text-tertiary shrink-0" />
                      )}

                      <span
                        className={`truncate font-medium font-sans text-xs ${
                          ch.is_completed
                            ? "line-through text-text-tertiary"
                            : "text-text-primary"
                        }`}
                      >
                        {idx + 1}. {ch.title}
                      </span>
                    </div>

                    {ch.duration_minutes && (
                      <span className="text-[10.5px] font-mono text-text-tertiary shrink-0">
                        {ch.duration_minutes} mnt
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drive Files */}
          {driveFiles.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-mono text-text-tertiary uppercase tracking-wider font-semibold">
                Berkas & Lampiran Terkait ({driveFiles.length})
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {driveFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2.5 border border-border/70 bg-surface rounded hover:bg-surface-secondary/50 transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCode className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                      <span className="truncate text-text-primary font-medium font-sans">
                        {file.name}
                      </span>
                    </div>
                    {onFilePreview && (
                      <button
                        type="button"
                        onClick={() => onFilePreview(file)}
                        className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline shrink-0 ml-2 cursor-pointer"
                      >
                        Pratinjau
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && onDelete && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            onDelete();
          }}
          title={deleteConfirmTitle}
          message={deleteConfirmMessage}
          confirmText="Hapus"
        />
      )}
    </div>
  );
}
