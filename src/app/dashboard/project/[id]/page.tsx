"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FolderCode,
  Github,
  Play,
  Pencil,
  Trash2,
  Bookmark,
  BookmarkCheck,
  User,
  Calendar,
  Code2,
  ExternalLink,
  FileText,
  AlertCircle,
  Terminal,
} from "lucide-react";
import { PageContainer } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/dialog";
import { CodeBlock } from "@/components/ui/code-block";
import { getProjectById, deleteProject } from "@/actions/study/projects";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser, formatDate } from "@/lib/utils";
import { isBookmarked, toggleBookmark } from "@/lib/bookmark-service";
import { Project } from "@/types";
import { toast } from "sonner";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Auth Check
  useEffect(() => {
    async function checkAuth() {
      try {
        const localRole = typeof window !== "undefined" ? localStorage.getItem("user_role") : null;
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setCurrentUserId(user.id);
          const email = (user.email || "").toLowerCase().trim();
          if (localRole === "admin" || localRole === "owner" || isAdminUser(email)) {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
      }
    }
    checkAuth();
  }, []);

  // Fetch Project
  useEffect(() => {
    async function load() {
      if (!projectId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getProjectById(projectId);
        if (!data) {
          setError("Proyek tidak ditemukan.");
        } else {
          setProject(data);
          setBookmarked(isBookmarked(data.id));
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat detail proyek.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [projectId]);

  const handleToggleBookmark = () => {
    if (!project) return;
    const nextState = toggleBookmark({
      id: project.id,
      title: project.title,
      type: "project",
      url: `/dashboard/project/${project.id}`,
      category: project.category?.name || "Proyek",
      subtitle: project.author_name || "Velqora",
    });
    setBookmarked(nextState);
    toast.success(nextState ? "Disimpan ke Bookmark." : "Dihapus dari Bookmark.");
  };

  const handleDelete = async () => {
    if (!project) return;
    try {
      const res = await deleteProject(project.id);
      if (!res.success) throw new Error(res.error || "Gagal menghapus proyek.");
      toast.success("Proyek berhasil dihapus.");
      router.push("/dashboard/project");
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus proyek.");
    }
  };

  if (loading) {
    return (
      <PageContainer className="space-y-6 py-6 max-w-5xl">
        <Skeleton className="h-6 w-32 rounded" />
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </PageContainer>
    );
  }

  if (error || !project) {
    return (
      <PageContainer className="py-16 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h1 className="text-lg font-bold text-text-primary">
          {error || "Proyek Tidak Ditemukan"}
        </h1>
        <p className="text-xs text-text-secondary">
          Proyek yang Anda cari mungkin telah dihapus atau URL tidak valid.
        </p>
        <Link href="/dashboard/project">
          <Button variant="outline" size="sm">
            Kembali ke Repositori Project
          </Button>
        </Link>
      </PageContainer>
    );
  }

  const canModify = Boolean(isAdmin || (currentUserId && project.user_id === currentUserId));

  const levelColor =
    project.level === "pemula"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
      : project.level === "menengah"
      ? "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20"
      : "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";

  return (
    <PageContainer className="space-y-6 pb-16 max-w-5xl">
      {/* ─── 1. Back Navigasi ─── */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/dashboard/project"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-text-tertiary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Repositori Project</span>
        </Link>

        {canModify && (
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/project/edit/${project.id}`}>
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Proyek</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 border-rose-500/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </Button>
          </div>
        )}
      </div>

      {/* ─── 2. Header Proyek ─── */}
      <header className="p-5 sm:p-7 rounded-xl border border-border/80 bg-surface shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            {project.category?.name && (
              <span className="px-2.5 py-0.5 rounded bg-surface-secondary text-text-secondary border border-border">
                {project.category.name}
              </span>
            )}
            <span className={`px-2.5 py-0.5 rounded font-medium border ${levelColor} capitalize`}>
              Tingkat {project.level}
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggleBookmark}
            className="p-1.5 rounded-md hover:bg-surface-secondary text-text-tertiary hover:text-brand-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            aria-label="Simpan Proyek"
          >
            {bookmarked ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-brand-600 fill-brand-600/20" />
                <span className="text-brand-600 font-bold">Tersimpan</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Simpan</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight font-display">
            {project.title}
          </h1>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-4xl">
            {project.description || "Tidak ada ringkasan deskripsi."}
          </p>
        </div>

        {/* Metadata Bar */}
        <div className="pt-2 flex items-center gap-4 flex-wrap text-xs font-mono text-text-tertiary border-t border-border/60">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>{project.author_name || "Pengembang"}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Dibuat {formatDate(project.created_at)}</span>
          </div>
        </div>

        {/* Action Links: GitHub & Demo */}
        <div className="pt-2 flex items-center gap-3 flex-wrap">
          {project.repository_url && (
            <a
              href={project.repository_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-800 text-white text-xs font-mono font-medium hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors shadow-xs"
            >
              <Github className="w-4 h-4" />
              <span>Lihat di GitHub</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          )}

          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-medium transition-colors shadow-xs"
            >
              <Play className="w-4 h-4" />
              <span>Buka Live Demo</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          )}
        </div>
      </header>

      {/* ─── 3. Stack Teknologi ─── */}
      {project.tech_stack && project.tech_stack.length > 0 && (
        <section className="p-5 rounded-xl border border-border/80 bg-surface space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-text-tertiary flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-brand-500" />
            <span>Teknologi & Dependensi yang Digunakan</span>
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            {project.tech_stack.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-md text-xs font-mono bg-surface-secondary text-text-primary border border-border"
              >
                #{tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ─── 4. Dokumentasi README / Panduan Proyek ─── */}
      <section className="p-5 sm:p-7 rounded-xl border border-border/80 bg-surface space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-text-tertiary flex items-center gap-1.5 border-b border-border/60 pb-3">
          <FileText className="w-4 h-4 text-brand-500" />
          <span>Dokumentasi README Proyek</span>
        </h2>

        {project.notes ? (
          <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {project.notes}
          </div>
        ) : (
          <div className="p-8 text-center text-xs font-mono text-text-tertiary">
            Belum ada dokumentasi README yang ditambahkan untuk proyek ini.
          </div>
        )}
      </section>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Hapus Proyek Ini?"
        message={`Apakah Anda yakin ingin menghapus proyek "${project.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Proyek"
        variant="danger"
      />
    </PageContainer>
  );
}
