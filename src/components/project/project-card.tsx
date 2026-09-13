"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderCode,
  Github,
  Play,
  ExternalLink,
  Pencil,
  Trash2,
  Bookmark,
  BookmarkCheck,
  Code2,
  Calendar,
  User,
  ArrowRight,
} from "lucide-react";
import { Project } from "@/types";
import { formatDate } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: Project;
  currentUserId?: string | null;
  isAdmin?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

export function ProjectCard({
  project,
  currentUserId,
  isAdmin = false,
  isBookmarked = false,
  onToggleBookmark,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const canModify = Boolean(isAdmin || (currentUserId && project.user_id === currentUserId));

  const levelLabel =
    project.level === "pemula"
      ? "Pemula"
      : project.level === "menengah"
      ? "Menengah"
      : project.level === "lanjutan"
      ? "Lanjutan"
      : project.level;

  const levelColor =
    project.level === "pemula"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
      : project.level === "menengah"
      ? "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20"
      : "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";

  return (
    <div className="group relative rounded-xl border border-border/70 bg-surface hover:border-brand-500/40 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col">
        {/* Category, Level, & Bookmark */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {project.category?.name ? (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-secondary text-text-secondary border border-border/70">
                {project.category.name}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-secondary text-text-secondary border border-border/70">
                Proyek AI
              </span>
            )}

            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${levelColor}`}>
              {levelLabel}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {onToggleBookmark && (
              <button
                type="button"
                onClick={() => onToggleBookmark(project)}
                className="p-1 text-text-tertiary hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
                title={isBookmarked ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
                aria-label="Toggle Bookmark"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4 text-brand-600 dark:text-brand-400 fill-brand-600/20" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            )}

            {canModify && (
              <>
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(project)}
                    className="p-1 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                    title="Edit Proyek"
                    aria-label="Edit Proyek"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-1 text-text-tertiary hover:text-rose-600 transition-colors cursor-pointer"
                    title="Hapus Proyek"
                    aria-label="Hapus Proyek"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Project Title */}
        <div>
          <Link
            href={`/dashboard/project/${project.id}`}
            className="font-bold text-base text-text-primary hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2 inline-flex items-center gap-1"
          >
            <span>{project.title}</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3 flex-1">
          {project.description || "Tidak ada deskripsi rinci untuk proyek ini."}
        </p>

        {/* Tech Stack Badges */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="pt-2 flex items-center gap-1.5 flex-wrap">
            {project.tech_stack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[10.5px] font-mono font-medium bg-surface-secondary/80 text-text-secondary border border-border/60"
              >
                #{tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Card: Author & Quick Links */}
      <div className="px-4 py-3 bg-surface-secondary/40 border-t border-border/70 flex items-center justify-between gap-2 text-xs font-mono text-text-tertiary">
        <div className="flex items-center gap-1.5 truncate">
          <User className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{project.author_name || "Pengembang"}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {project.repository_url && (
            <a
              href={project.repository_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
              title="Kunjungi Repository GitHub"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Repo</span>
            </a>
          )}

          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded hover:bg-surface-secondary text-emerald-600 dark:text-emerald-400 hover:underline transition-colors flex items-center gap-1"
              title="Lihat Live Demo"
            >
              <Play className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Demo</span>
            </a>
          )}

          <Link
            href={`/dashboard/project/${project.id}`}
            className="px-2.5 py-1 rounded bg-surface border border-border hover:bg-surface-secondary text-text-primary text-[11px] font-medium transition-colors"
          >
            Detail
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          if (onDelete) onDelete(project.id);
          setShowDeleteConfirm(false);
        }}
        title="Hapus Proyek Ini?"
        message={`Apakah Anda yakin ingin menghapus proyek "${project.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Proyek"
        variant="danger"
      />
    </div>
  );
}
