"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderCode,
  Plus,
  Search,
  X,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Github,
  Code2,
  Terminal,
} from "lucide-react";
import { PageContainer } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { getProjects, deleteProject } from "@/actions/study/projects";
import { getCategories } from "@/actions/study-actions";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/utils";
import { isBookmarked, toggleBookmark } from "@/lib/bookmark-service";
import { ProjectCard } from "@/components/project/project-card";
import { Project } from "@/types";
import { toast } from "sonner";

export default function DedicatedProjectsPage() {
  const router = useRouter();

  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedTech, setSelectedTech] = useState("");
  const [bookmarkMap, setBookmarkMap] = useState<Record<string, boolean>>({});

  // Auth check
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

  // Fetch Data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projData, cats] = await Promise.all([
        getProjects(),
        getCategories(),
      ]);

      setProjects(projData || []);
      setCategories(cats || []);

      // Check bookmark status
      const bm: Record<string, boolean> = {};
      (projData || []).forEach((p) => {
        bm[p.id] = isBookmarked(p.id);
      });
      setBookmarkMap(bm);
    } catch (err: any) {
      console.error("Gagal memuat repositori proyek:", err);
      setError("Gagal memuat daftar proyek. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Delete
  const handleDeleteProject = async (id: string) => {
    try {
      const res = await deleteProject(id);
      if (!res.success) throw new Error(res.error || "Gagal menghapus proyek.");
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Proyek berhasil dihapus.");
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus proyek.");
    }
  };

  // Handle Bookmark
  const handleToggleBookmark = (proj: Project) => {
    const nextState = toggleBookmark({
      id: proj.id,
      title: proj.title,
      type: "project",
      url: `/dashboard/project/${proj.id}`,
      category: proj.category?.name || "Proyek",
      subtitle: proj.author_name || "Velqora",
    });
    setBookmarkMap((prev) => ({ ...prev, [proj.id]: nextState }));
    toast.success(nextState ? "Disimpan ke Bookmark." : "Dihapus dari Bookmark.");
  };

  // Extract all unique tech stack tags
  const allTechStacks = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      (p.tech_stack || []).forEach((t) => set.add(t));
    });
    return Array.from(set).sort();
  }, [projects]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    let list = [...projects];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.tech_stack || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      list = list.filter((p) => p.category_id === selectedCategory);
    }

    if (selectedLevel) {
      list = list.filter((p) => p.level === selectedLevel);
    }

    if (selectedTech) {
      const t = selectedTech.toLowerCase();
      list = list.filter((p) =>
        (p.tech_stack || []).some((tech) => tech.toLowerCase() === t)
      );
    }

    return list;
  }, [projects, search, selectedCategory, selectedLevel, selectedTech]);

  return (
    <PageContainer className="space-y-6 pb-16">
      {/* ─── 1. Header Repositori Project ─── */}
      <header className="p-5 sm:p-6 rounded-xl border border-border/80 bg-surface shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400">
              <FolderCode className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-text-tertiary">
                <span className="uppercase tracking-wider font-semibold text-brand-600 dark:text-brand-400">
                  Repositori Kode
                </span>
                <span>•</span>
                <span>{projects.length} Portofolio Proyek</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight font-display">
                Repositori Project
              </h1>

              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl">
                Koleksi portofolio proyek terapan, implementasi kode nyata, arsitektur pipeline AI, dan repositori open-source.
              </p>
            </div>
          </div>

          {/* Action Button: Tambah Proyek Baru */}
          <div className="shrink-0 self-start sm:self-center">
            <Link href="/dashboard/project/baru">
              <Button className="gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs sm:text-sm">
                <Plus className="w-4 h-4" />
                <span>Tambah Proyek Baru</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center justify-between gap-3 text-xs sm:text-sm text-rose-600 dark:text-rose-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={loadData} className="text-xs gap-1.5 shrink-0">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      )}

      {/* ─── 2. Filter & Pencarian Proyek ─── */}
      <div className="p-4 rounded-xl border border-border/80 bg-surface space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari proyek, teknologi, atau kata kunci..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-surface-secondary/60 border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-hidden focus:border-brand-500 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                aria-label="Bersihkan pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface-secondary/60 border border-border text-xs text-text-primary cursor-pointer focus:outline-hidden focus:border-brand-500"
            aria-label="Filter Kategori Proyek"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Level Dropdown */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface-secondary/60 border border-border text-xs text-text-primary cursor-pointer focus:outline-hidden focus:border-brand-500"
            aria-label="Filter Level Kesulitan"
          >
            <option value="">Semua Tingkat</option>
            <option value="pemula">Pemula</option>
            <option value="menengah">Menengah</option>
            <option value="lanjutan">Lanjutan</option>
          </select>
        </div>

        {/* Tech Stack Quick Filter Pills */}
        {allTechStacks.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
            <span className="font-mono text-text-tertiary text-[11px] mr-1">Teknologi:</span>
            <button
              type="button"
              onClick={() => setSelectedTech("")}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                !selectedTech
                  ? "bg-brand-600 text-white font-bold"
                  : "bg-surface-secondary text-text-secondary hover:text-text-primary border border-border"
              }`}
            >
              Semua
            </button>
            {allTechStacks.map((tech) => {
              const active = selectedTech.toLowerCase() === tech.toLowerCase();
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setSelectedTech(active ? "" : tech)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    active
                      ? "bg-brand-600 text-white font-bold"
                      : "bg-surface-secondary text-text-secondary hover:text-text-primary border border-border"
                  }`}
                >
                  #{tech}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── 3. Grid Daftar Proyek ─── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="p-5 rounded-xl border border-border/80 bg-surface space-y-3">
              <Skeleton className="h-5 w-24 rounded" />
              <Skeleton className="h-6 w-3/4 rounded" />
              <Skeleton className="h-16 w-full rounded" />
              <Skeleton className="h-8 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderCode className="w-6 h-6 text-text-secondary" />}
          title={search || selectedCategory || selectedLevel || selectedTech ? "Tidak ada proyek yang sesuai filter" : "Belum Ada Repositori Proyek"}
          description={
            search || selectedCategory || selectedLevel || selectedTech
              ? "Coba ubah kata kunci pencarian atau bersihkan filter yang aktif."
              : "Mulai bangun portofolio Anda dengan menambahkan repositori proyek pertama."
          }
          action={
            search || selectedCategory || selectedLevel || selectedTech ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("");
                  setSelectedLevel("");
                  setSelectedTech("");
                }}
              >
                Reset Semua Filter
              </Button>
            ) : (
              <Link href="/dashboard/project/baru">
                <Button size="sm" className="gap-2 bg-brand-600 text-white">
                  <Plus className="w-4 h-4" />
                  <span>Tambah Proyek Pertama</span>
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              isBookmarked={Boolean(bookmarkMap[project.id])}
              onToggleBookmark={handleToggleBookmark}
              onEdit={(p) => router.push(`/dashboard/project/edit/${p.id}`)}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
