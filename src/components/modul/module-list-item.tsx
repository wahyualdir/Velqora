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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="rounded-xl border border-border bg-surface hover:border-brand-500/40 transition-colors shadow-2xs overflow-hidden">
      {/* Main List Item Header */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          {/* Left: Icon, Type, Title & Category */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div
              className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                isProject
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                  : "bg-brand-500/10 border-brand-500/20 text-brand-500"
              }`}
            >
              {isProject ? <Code2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="neutral">
                  {module.category?.name || "Umum"}
                </Badge>

                <Badge variant={isProject ? "info" : "secondary"}>
                  {isProject ? "Proyek Kode" : "Modul Belajar"}
                </Badge>

                {module.level && (
                  <Badge variant="outline">
                    {module.level === "pemula"
                      ? "Pemula"
                      : module.level === "menengah"
                      ? "Menengah"
                      : "Lanjutan"}
                  </Badge>
                )}

                {totalChapters > 0 && (
                  <span className="text-[11px] font-mono text-text-tertiary">
                    {completedChapters}/{totalChapters} Bab Selesai
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-text-primary tracking-tight font-display">
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
                      className="flex items-center gap-1 font-semibold text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Repositori GitHub</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  )}
                  {module.demo_url && (
                    <a
                      href={module.demo_url}
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
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start pt-1 sm:pt-0">
            <button
              type="button"
              onClick={() => onToggleBookmark(module)}
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

            {canModify && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit(module)}
                  className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                  title="Edit Modul"
                  aria-label={`Edit modul ${module.title}`}
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 rounded-lg border border-border bg-surface hover:bg-rose-500/10 hover:border-rose-500/30 text-text-tertiary hover:text-rose-500 transition-colors cursor-pointer"
                  title="Hapus Modul"
                  aria-label={`Hapus modul ${module.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            {(totalChapters > 0 || driveFiles.length > 0) && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="gap-1 text-xs ml-1"
                aria-expanded={isExpanded}
              >
                <span>{isExpanded ? "Tutup Silabus" : "Lihat Silabus"}</span>
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Syllabus & Files Section */}
      {isExpanded && (
        <div className="border-t border-border bg-surface-secondary/40 p-4 sm:p-5 space-y-4 animate-fade-in">
          {/* 1. Chapter list */}
          {totalChapters > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono flex items-center justify-between">
                <span>Daftar Bab & Silabus Pembelajaran</span>
                <span className="text-[11px] font-normal text-text-tertiary lowercase">
                  centang untuk menandai tuntas
                </span>
              </h4>

              <div className="divide-y divide-border/60 rounded-xl border border-border bg-surface overflow-hidden">
                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.id || index}
                    className="flex items-center justify-between p-3 sm:px-3.5 hover:bg-surface-secondary/60 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleChapter(chapter.id, chapter.is_completed)
                        }
                        disabled={togglingChapterId === chapter.id}
                        className="text-text-tertiary hover:text-brand-500 cursor-pointer disabled:opacity-50 transition-colors shrink-0"
                        title={
                          chapter.is_completed
                            ? "Tandai belum selesai"
                            : "Tandai selesai"
                        }
                        aria-label={`Ubah status bab ${chapter.title}`}
                      >
                        {chapter.is_completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Square className="w-4 h-4 text-text-tertiary" />
                        )}
                      </button>
                      <span
                        className={`truncate font-medium ${
                          chapter.is_completed
                            ? "line-through text-text-tertiary"
                            : "text-text-primary"
                        }`}
                      >
                        {index + 1}. {chapter.title}
                      </span>
                    </div>

                    {chapter.duration_minutes && (
                      <span className="text-[10.5px] font-mono text-text-tertiary shrink-0">
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
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono">
                Berkas & Lampiran Terkait ({driveFiles.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {driveFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary/60 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCode className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      <span className="truncate text-text-primary font-medium">
                        {file.name}
                      </span>
                    </div>
                    {onFilePreview && (
                      <button
                        type="button"
                        onClick={() => onFilePreview(file)}
                        className="text-[11px] font-semibold text-brand-500 hover:underline shrink-0 ml-2"
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
