"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Code2,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  Pencil,
  Trash2,
  ExternalLink,
  Github,
  Play,
  CheckSquare,
  Square,
  FileCode,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/dialog";
import { toggleChapterComplete } from "@/actions/study-actions";
import { ModuleDriveFile, extractModuleDriveFromNotes } from "@/types/module-drive";
import { toast } from "sonner";

interface ModuleListItemProps {
  module: any;
  currentUserId?: string | null;
  isAdmin?: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (item: any) => void;
  onEdit: (module: any) => void;
  onDelete: (id: string) => void;
  onFilePreview?: (file: ModuleDriveFile) => void;
}

export function ModuleListItem({
  module,
  currentUserId,
  isAdmin = false,
  isBookmarked,
  onToggleBookmark,
  onEdit,
  onDelete,
  onFilePreview,
}: ModuleListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chapters, setChapters] = useState<any[]>(module.chapters || []);
  const [togglingChapterId, setTogglingChapterId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isProject = module.kind === "project";
  const canModify = isAdmin || (currentUserId && module.user_id === currentUserId);

  // Extract attached files
  const driveFiles: ModuleDriveFile[] = React.useMemo(() => {
    const driveData = extractModuleDriveFromNotes(module.notes || "");
    return driveData?.files || [];
  }, [module.notes]);

  // Chapter completion stats
  const totalChapters = chapters.length;
  const completedChapters = chapters.filter((c) => c.is_completed).length;

  const handleToggleChapter = async (chapterId: string, currentStatus: boolean) => {
    setTogglingChapterId(chapterId);
    try {
      await toggleChapterComplete(chapterId, module.id, !currentStatus);
      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === chapterId ? { ...ch, is_completed: !currentStatus } : ch
        )
      );
      toast.success(
        !currentStatus ? "Bab diselesaikan!" : "Status bab diperbarui."
      );
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah status bab.");
    } finally {
      setTogglingChapterId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-2xs text-left mb-4 hover:border-brand-500/30 transition-all">
      {/* Header bar */}
      <div className="px-4 py-2.5 bg-surface-secondary/40 border-b border-border/80 flex items-center justify-between text-xs text-text-secondary select-none">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isProject ? "bg-blue-600" : "bg-brand-600"
            }`}
          />
          <span className="font-semibold text-text-primary truncate uppercase tracking-wider text-[11px]">
            {isProject ? "PROJ" : "MOD"}_{module.id ? String(module.id).slice(0, 8).toUpperCase() : "ITEM"}
          </span>
          <span className="text-text-tertiary hidden sm:inline">·</span>
          <span className="text-brand-600 dark:text-brand-400 font-semibold hidden sm:inline uppercase text-[11px]">
            {module.category?.name || "Umum"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
          <span className="px-2 py-0.5 bg-surface rounded-md border border-border text-text-secondary font-semibold">
            {isProject ? "Proyek Kode" : "Modul Belajar"}
          </span>
        </div>
      </div>

      {/* Main List Item Body */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Left: Icon, Type, Title & Category */}
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                isProject
                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  : "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20"
              }`}
            >
              {isProject ? <Code2 className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 text-[10.5px] font-semibold uppercase rounded-md bg-surface-secondary border border-border text-text-primary">
                  {module.category?.name || "Umum"}
                </span>

                {module.level && (
                  <span className="px-2 py-0.5 text-[10.5px] font-semibold uppercase rounded-md bg-surface-secondary border border-border text-text-secondary">
                    {module.level === "pemula"
                      ? "Pemula"
                      : module.level === "menengah"
                      ? "Menengah"
                      : "Lanjutan"}
                  </span>
                )}

                {totalChapters > 0 && (
                  <span className="text-xs text-text-tertiary">
                    {completedChapters}/{totalChapters} Bab Selesai
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-text-primary tracking-tight font-display">
                {module.title}
              </h3>

              {module.description && (
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-2 max-w-3xl">
                  {module.description}
                </p>
              )}

              {/* Project Meta: GitHub & Live Demo links */}
              {isProject && (module.github_url || module.demo_url) && (
                <div className="flex items-center gap-3 pt-1 flex-wrap text-xs">
                  {module.github_url && (
                    <a
                      href={module.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-semibold text-text-secondary hover:text-brand-600 hover:underline transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  )}
                  {module.demo_url && (
                    <a
                      href={module.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-semibold text-emerald-600 hover:underline"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start pt-1 sm:pt-0">
            <button
              type="button"
              onClick={() => onToggleBookmark(module)}
              className={`h-8 w-8 min-h-[32px] min-w-[32px] rounded-lg border border-border bg-surface hover:bg-surface-secondary flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                isBookmarked ? "text-amber-600 font-bold border-amber-500/30" : "text-text-secondary"
              }`}
              title={isBookmarked ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
              aria-label={isBookmarked ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-amber-600" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {canModify && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit(module)}
                  className="h-8 w-8 min-h-[32px] min-w-[32px] rounded-lg border border-border bg-surface hover:bg-surface-secondary flex items-center justify-center text-text-secondary hover:text-text-primary transition-all cursor-pointer shadow-2xs"
                  title="Edit Modul"
                  aria-label={`Edit modul ${module.title}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="h-8 w-8 min-h-[32px] min-w-[32px] rounded-lg border border-border bg-surface hover:bg-rose-500/10 flex items-center justify-center text-rose-600 hover:text-rose-700 transition-all cursor-pointer shadow-2xs"
                  title="Hapus Modul"
                  aria-label={`Hapus modul ${module.title}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {(totalChapters > 0 || driveFiles.length > 0) && (
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="h-8 px-3 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ml-1"
                aria-expanded={isExpanded}
              >
                <span>{isExpanded ? "Tutup Silabus" : "Lihat Silabus"}</span>
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Syllabus & Files Section */}
      {isExpanded && (
        <div className="border-t border-border bg-surface-secondary/30 p-4 sm:p-5 space-y-4">
          {/* 1. Chapter list */}
          {totalChapters > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center justify-between">
                <span>Daftar Bab & Silabus Pembelajaran</span>
                <span className="text-[11px] font-normal text-text-tertiary lowercase">
                  centang untuk menandai tuntas
                </span>
              </h4>

              <div className="divide-y divide-border/60 rounded-xl border border-border bg-surface overflow-hidden shadow-2xs">
                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.id || index}
                    className="flex items-center justify-between p-3 sm:px-4 hover:bg-surface-secondary/50 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleChapter(chapter.id, chapter.is_completed)
                        }
                        disabled={togglingChapterId === chapter.id}
                        className="text-text-tertiary hover:text-brand-600 cursor-pointer disabled:opacity-50 transition-colors shrink-0"
                        title={
                          chapter.is_completed
                            ? "Tandai belum selesai"
                            : "Tandai selesai"
                        }
                        aria-label={`Ubah status bab ${chapter.title}`}
                      >
                        {chapter.is_completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-text-tertiary" />
                        )}
                      </button>
                      <span
                        className={`truncate font-medium text-xs sm:text-sm ${
                          chapter.is_completed
                            ? "line-through text-text-tertiary"
                            : "text-text-primary"
                        }`}
                      >
                        {index + 1}. {chapter.title}
                      </span>
                    </div>

                    {chapter.duration_minutes && (
                      <span className="text-[11px] font-mono text-text-tertiary shrink-0">
                        {chapter.duration_minutes} mnt
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Attached Drive Files */}
          {driveFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Berkas & Lampiran Terkait ({driveFiles.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {driveFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface hover:bg-surface-secondary/50 transition-colors text-xs shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileCode className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                      <span className="truncate text-text-primary font-medium">
                        {file.name}
                      </span>
                    </div>
                    {onFilePreview && (
                      <button
                        type="button"
                        onClick={() => onFilePreview(file)}
                        className="text-xs font-semibold text-brand-600 hover:underline shrink-0 ml-2 cursor-pointer"
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
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete(module.id);
        }}
        title="Hapus Modul Ini?"
        message={`Apakah Anda yakin ingin menghapus "${module.title}"? Semua bab dan riwayat terkait akan terhapus secara permanen.`}
        confirmText="Hapus Modul"
      />
    </div>
  );
}
