"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  X,
  Plus,
  Layers,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { NotebookCell } from "@/components/modul/notebook-cell";
import {
  ModuleDriveFile,
  extractModuleDriveFromNotes,
} from "@/types/module-drive";
import { toggleChapterComplete } from "@/actions/study-actions";
import { toast } from "sonner";

export interface NotebookOutlineTopic {
  id: string;
  slug: string;
  title: string;
  description: string;
  isPlaceholder: boolean;
  content_markdown?: string | null;
}

export interface NotebookOutlineProps {
  topics: NotebookOutlineTopic[];
  modules: any[];
  categoryId: string;
  categoryName: string;
  isAdmin?: boolean;
  currentUserId?: string | null;
  bookmarkMap?: Record<string, boolean>;
  onToggleBookmark?: (mod: any) => void;
  onEditModule?: (mod: any) => void;
  onDeleteModule?: (id: string) => void;
  onFilePreview?: (file: ModuleDriveFile) => void;
  // Search & Filter state managed by parent
  search: string;
  onSearchChange: (val: string) => void;
  filterTag: string; // Combined tag: "all" | "theory" | "module" | "project" | "pemula" | "menengah" | "lanjutan"
  onFilterTagChange: (tag: string) => void;
  loading?: boolean;
}

/**
 * Extracts the first fenced code block from markdown
 */
function extractFirstCodeBlock(
  raw?: string | null
): { code: string; language: string } | null {
  if (!raw) return null;
  const match = raw.match(/```(\w*)\r?\n([\s\S]*?)```/);
  if (match) {
    const code = match[2].trim();
    if (code) {
      return {
        language: match[1]?.trim() || "python",
        code: code.slice(0, 1500),
      };
    }
  }
  return null;
}

/**
 * Extracts code snippet from module notes or drive payload
 */
function extractModuleCodeSnippet(
  mod: any
): { code: string; language: string } | null {
  if (mod.notes) {
    const fromMarkdown = extractFirstCodeBlock(mod.notes);
    if (fromMarkdown) return fromMarkdown;

    const driveData = extractModuleDriveFromNotes(mod.notes);
    if (driveData?.sections) {
      for (const sec of driveData.sections) {
        if (sec.codeSnippets && sec.codeSnippets.length > 0) {
          const firstSnippet = sec.codeSnippets[0];
          if (firstSnippet.code) {
            return {
              code: firstSnippet.code,
              language: firstSnippet.language || "python",
            };
          }
        }
      }
    }
  }
  return null;
}

export interface UnifiedNotebookCellItem {
  id: string;
  type: "theory" | "module" | "project";
  title: string;
  description?: string;
  isPlaceholder?: boolean;
  href?: string;
  tag: string;
  level?: string;
  codeSnippet?: { code: string; language: string } | null;
  isBookmarked?: boolean;
  canModify?: boolean;
  githubUrl?: string;
  demoUrl?: string;
  chapters?: Array<{
    id: string;
    title: string;
    is_completed?: boolean;
    duration_minutes?: number | null;
  }>;
  driveFiles?: ModuleDriveFile[];
  raw?: any;
}

export function NotebookOutline({
  topics,
  modules,
  categoryId,
  categoryName,
  isAdmin = false,
  currentUserId,
  bookmarkMap = {},
  onToggleBookmark,
  onEditModule,
  onDeleteModule,
  onFilePreview,
  search,
  onSearchChange,
  filterTag,
  onFilterTagChange,
  loading = false,
}: NotebookOutlineProps) {
  const [togglingChapterId, setTogglingChapterId] = React.useState<string | null>(null);
  const [localChapterOverrides, setLocalChapterOverrides] = React.useState<
    Record<string, boolean>
  >({});

  const handleToggleChapter = async (
    chapterId: string,
    moduleId: string,
    currentStatus: boolean
  ) => {
    setTogglingChapterId(chapterId);
    try {
      await toggleChapterComplete(chapterId, moduleId, !currentStatus);
      setLocalChapterOverrides((prev) => ({
        ...prev,
        [chapterId]: !currentStatus,
      }));
      toast.success(
        !currentStatus ? "Bab diselesaikan!" : "Status bab diperbarui."
      );
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah status bab.");
    } finally {
      setTogglingChapterId(null);
    }
  };

  // Convert topics to notebook cells
  const topicCells = React.useMemo<UnifiedNotebookCellItem[]>(() => {
    return topics.map((t) => {
      const codeSnippet = extractFirstCodeBlock(t.content_markdown);
      return {
        type: "theory",
        id: `topic-${t.id}`,
        title: t.title,
        description: t.description,
        isPlaceholder: t.isPlaceholder,
        href: `/dashboard/catatan/${t.slug}?fromCategory=${encodeURIComponent(categoryId)}`,
        tag: "teori",
        level: undefined,
        codeSnippet,
        isBookmarked: false,
        canModify: false,
        githubUrl: undefined,
        demoUrl: undefined,
        chapters: [],
        driveFiles: [],
        raw: t,
      };
    });
  }, [topics, categoryId]);

  // Convert modules to notebook cells
  const moduleCells = React.useMemo<UnifiedNotebookCellItem[]>(() => {
    return modules.map((m) => {
      const isProject = m.kind === "project";
      const driveData = extractModuleDriveFromNotes(m.notes || "");
      const driveFiles = driveData?.files || [];
      const codeSnippet = extractModuleCodeSnippet(m);

      const resolvedChapters = (m.chapters || []).map((ch: any) => ({
        id: ch.id,
        title: ch.title,
        is_completed:
          localChapterOverrides[ch.id] !== undefined
            ? localChapterOverrides[ch.id]
            : ch.is_completed,
        duration_minutes: ch.duration_minutes,
      }));

      const canModify = Boolean(
        isAdmin || (currentUserId && m.user_id === currentUserId)
      );

      return {
        type: isProject ? "project" : "module",
        id: `module-${m.id}`,
        title: m.title,
        description: m.description,
        isPlaceholder: false,
        href: undefined,
        tag: isProject ? "proyek" : "modul",
        level: m.level,
        codeSnippet,
        isBookmarked: Boolean(bookmarkMap[m.id]),
        canModify,
        githubUrl: m.github_url,
        demoUrl: m.demo_url,
        chapters: resolvedChapters,
        driveFiles,
        raw: m,
      };
    });
  }, [modules, localChapterOverrides, isAdmin, currentUserId, bookmarkMap]);

  // Single unified top-to-bottom list
  const unifiedCells = React.useMemo(() => {
    return [...topicCells, ...moduleCells];
  }, [topicCells, moduleCells]);

  return (
    <div className="space-y-4">
      {/* ─── Outline Header & Minimal Quick Switcher Controls ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 border-b border-border/70 pb-3">
        {/* Left: Outline Label & Count */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider font-bold text-text-primary">
            Silabus & Modul Notebook
          </span>
          <span className="font-mono text-xs text-text-tertiary">
            ({loading ? "..." : `${unifiedCells.length} sel`})
          </span>
        </div>

        {/* Right: Quick Switcher Input & Minimal #tag Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Switcher Minimal Search Input */}
          <div className="relative flex items-center bg-surface-secondary/60 hover:bg-surface-secondary border border-border/70 focus-within:border-brand-500/60 transition-all rounded px-2.5 py-1">
            <Search className="w-3.5 h-3.5 text-text-tertiary shrink-0 mr-1.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari dalam notebook..."
              className="bg-transparent text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-hidden w-36 sm:w-48 focus:w-44 sm:focus:w-60 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="text-text-tertiary hover:text-text-primary cursor-pointer ml-1"
                aria-label="Hapus kata kunci"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Minimal #tag Filter Dropdown */}
          <div className="relative flex items-center bg-surface-secondary/60 hover:bg-surface-secondary border border-border/70 rounded px-2 py-1">
            <SlidersHorizontal className="w-3 h-3 text-text-tertiary shrink-0 mr-1.5 pointer-events-none" />
            <select
              value={filterTag}
              onChange={(e) => onFilterTagChange(e.target.value)}
              className="bg-transparent text-xs font-mono text-text-primary cursor-pointer focus:outline-hidden"
              aria-label="Filter sel notebook"
            >
              <option value="all">#semua</option>
              <option value="theory">#teori</option>
              <option value="module">#modul</option>
              <option value="project">#proyek</option>
              <option value="pemula">#pemula</option>
              <option value="menengah">#menengah</option>
              <option value="lanjutan">#lanjutan</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Unified Notebook Cells List ─── */}
      {loading ? (
        <div className="divide-y divide-border/60 border border-border/70 bg-surface rounded-md overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 sm:p-5 space-y-2 flex items-start gap-3">
              <Skeleton className="h-4 w-10 shrink-0 font-mono" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-3/4 sm:w-1/2" />
                <Skeleton className="h-3.5 w-full max-w-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : unifiedCells.length === 0 ? (
        <div className="border border-border/70 bg-surface rounded-md p-8 text-center space-y-3">
          <Layers className="w-8 h-8 text-text-tertiary mx-auto opacity-70" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-text-primary font-mono">
              Tidak ada sel notebook yang cocok
            </h3>
            <p className="text-xs text-text-secondary max-w-md mx-auto">
              {search || filterTag !== "all"
                ? "Cobalah menghapus filter atau kata kunci pencarian untuk melihat seluruh outline."
                : "Belum ada catatan teori maupun modul yang terdaftar dalam kategori ini."}
            </p>
          </div>

          {(search || filterTag !== "all") && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onSearchChange("");
                onFilterTagChange("all");
              }}
              className="text-xs font-mono gap-1.5 cursor-pointer mx-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filter</span>
            </Button>
          )}

          {unifiedCells.length === 0 && !search && filterTag === "all" && isAdmin && (
            <Link
              href={`/dashboard/modul/baru?category=${encodeURIComponent(categoryId)}`}
            >
              <Button size="sm" className="text-xs font-semibold gap-1.5 cursor-pointer mx-auto mt-2">
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Modul Pertama</span>
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="border border-border/70 bg-surface rounded-md overflow-hidden shadow-2xs">
          {unifiedCells.map((cell, idx) => (
            <NotebookCell
              key={cell.id}
              index={idx}
              title={cell.title}
              description={cell.description}
              tag={cell.tag}
              level={cell.level}
              codeSnippet={cell.codeSnippet}
              href={cell.href}
              isPlaceholder={cell.isPlaceholder}
              placeholderNotice="contoh — belum ada catatan tersimpan"
              isBookmarked={cell.isBookmarked}
              onToggleBookmark={
                onToggleBookmark && cell.raw && cell.type !== "theory"
                  ? () => onToggleBookmark(cell.raw)
                  : undefined
              }
              canModify={cell.canModify}
              onEdit={
                onEditModule && cell.raw && cell.type !== "theory"
                  ? () => onEditModule(cell.raw)
                  : undefined
              }
              onDelete={
                onDeleteModule && cell.raw && cell.type !== "theory"
                  ? () => onDeleteModule(cell.raw.id)
                  : undefined
              }
              deleteConfirmTitle="Hapus Modul Ini?"
              deleteConfirmMessage={`Apakah Anda yakin ingin menghapus "${cell.title}"? Seluruh bab dan riwayat terkait akan terhapus.`}
              githubUrl={cell.githubUrl}
              demoUrl={cell.demoUrl}
              chapters={cell.chapters}
              onToggleChapter={
                cell.raw && cell.type !== "theory"
                  ? (chId, status) => handleToggleChapter(chId, cell.raw.id, status)
                  : undefined
              }
              togglingChapterId={togglingChapterId}
              driveFiles={cell.driveFiles}
              onFilePreview={onFilePreview}
            />
          ))}
        </div>
      )}
    </div>
  );
}
