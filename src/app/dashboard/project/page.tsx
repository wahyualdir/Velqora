"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FolderCode,
  Plus,
  Search,
  X,
  Layers,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Github,
  Code2,
  Terminal,
  ArrowRight,
} from "lucide-react";
import { PageContainer } from "@/components/ui/section";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { getProjects, deleteProject } from "@/actions/study/projects";
import { getCategories } from "@/actions/study-actions";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/utils";
import { isBookmarked, toggleBookmark } from "@/lib/bookmark-service";
import { ProjectCard } from "@/components/project/project-card";
import { ProjectCategoryCard, ProjectCategoryItem } from "@/components/project/project-category-card";
import { SYSTEM_PRIMARY_CATEGORIES } from "@/lib/constants";
import { Project } from "@/types";
import { toast } from "sonner";

const AI_CATEGORY_PRESET = SYSTEM_PRIMARY_CATEGORIES.find((c) => c.name === "Kecerdasan Buatan");

export default function DedicatedProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab View: "categories" (default grid of AI topics) | "all-content" (search, filter, & listing)
  const initialCategoryParam = searchParams.get("category") || "";
  const [viewTab, setViewTab] = useState<"categories" | "all-content">(
    initialCategoryParam ? "all-content" : "categories"
  );

  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryParam);
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

  // ─── 1. Topik Kurikulum AI untuk Proyek (28 Topik Alfabetis A-Z, Persis Seperti di Modul) ───
  const aiTopicOverview = useMemo<ProjectCategoryItem[]>(() => {
    if (!AI_CATEGORY_PRESET) return [];

    const sortedSubcategories = [...AI_CATEGORY_PRESET.subcategories].sort((a, b) =>
      a.name.localeCompare(b.name, "id", { sensitivity: "base" })
    );

    return sortedSubcategories.map((sub) => {
      const dbCat = categories.find(
        (c) =>
          c.name.toLowerCase().trim() === sub.name.toLowerCase().trim() ||
          (c.parent?.name?.toLowerCase() === "kecerdasan buatan" &&
            c.name.toLowerCase().trim() === sub.name.toLowerCase().trim())
      );

      const count = projects.filter((p) => {
        const catName = (p.category?.name || "").toLowerCase().trim();
        const pCatId = (p.category_id || "").toLowerCase().trim();
        return (
          catName === sub.name.toLowerCase().trim() ||
          (dbCat && pCatId === dbCat.id.toLowerCase().trim()) ||
          (sub.name === "Artificial Intelligence Fundamentals" &&
            (!catName || catName === "kecerdasan buatan"))
        );
      }).length;

      return {
        id: dbCat?.id || sub.name,
        name: sub.name,
        color: sub.color || "#8B5CF6",
        icon: sub.icon || "machine_learning",
        projectCount: count,
      };
    });
  }, [projects, categories]);

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
      const targetCat = selectedCategory.toLowerCase().trim();
      list = list.filter((p) => {
        const catName = (p.category?.name || "").toLowerCase().trim();
        const pCatId = (p.category_id || "").toLowerCase().trim();
        return catName === targetCat || pCatId === targetCat;
      });
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

  const handleSelectTopicCard = (topic: ProjectCategoryItem) => {
    setSelectedCategory(topic.name);
    setViewTab("all-content");
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedLevel("");
    setSelectedTech("");
  };

  const hasActiveFilters = Boolean(
    search || selectedCategory || selectedLevel || selectedTech
  );

  return (
    <PageContainer className="space-y-6 pb-16">
      {/* ─── 1. Header & Tab Switcher (Sama Seperti di Modul) ─── */}
      <PageHeader
        eyebrow="Kurikulum & Repositori Kecerdasan Buatan"
        title="Repositori Project AI"
        description="Jelajahi portofolio proyek terapan, implementasi kode nyata, pipeline kecerdasan buatan, dan repositori open-source."
        actions={
          <Link href="/dashboard/project/baru">
            <Button size="sm" className="gap-1.5 text-xs font-semibold cursor-pointer bg-brand-600 hover:bg-brand-700 text-white">
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Proyek Baru</span>
            </Button>
          </Link>
        }
      >
        {/* Tab View Switcher: Topik Kurikulum vs Semua Proyek */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="flex items-center gap-1 p-1 bg-surface-secondary rounded-xl border border-border w-fit max-w-full overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setViewTab("categories")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                viewTab === "categories"
                  ? "bg-brand-600 text-white font-bold shadow-xs"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Topik Kurikulum ({aiTopicOverview.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setViewTab("all-content")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                viewTab === "all-content"
                  ? "bg-brand-600 text-white font-bold shadow-xs"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
              }`}
            >
              <FolderCode className="w-3.5 h-3.5" />
              <span>Semua Proyek ({projects.length})</span>
            </button>
          </div>
        </div>
      </PageHeader>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center justify-between gap-3 text-xs sm:text-sm text-rose-600 dark:text-rose-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={loadData} className="text-xs gap-1.5 shrink-0 border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      )}

      {/* ─── TAB 1: Topik Kurikulum AI (28 Kartu Topik Persis Seperti Modul) ─── */}
      {viewTab === "categories" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono">
                Topik Repositori Proyek Kecerdasan Buatan ({aiTopicOverview.length})
              </h2>
              <p className="text-xs text-text-secondary font-mono">
                Pilih topik untuk melihat portofolio kode dan repositori proyek terapan
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("");
                setViewTab("all-content");
              }}
              className="text-xs font-mono font-medium text-brand-600 dark:text-brand-400 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
            >
              <span>Eksplorasi Semua Proyek ({projects.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {aiTopicOverview.map((topic) => (
              <ProjectCategoryCard
                key={topic.id || topic.name}
                category={topic}
                onClick={() => handleSelectTopicCard(topic)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── TAB 2: Eksplorasi Semua Proyek (Search, Filter, & Cards) ─── */}
      {viewTab === "all-content" && (
        <div className="space-y-4">
          {/* Active Category Banner (jika dipilih dari Tab 1) */}
          {selectedCategory && (
            <div className="p-3 rounded-lg bg-surface-secondary/70 border border-brand-500/30 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-text-tertiary">Topik Aktif:</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">
                  {selectedCategory}
                </span>
                <span className="text-text-tertiary">({filteredProjects.length} Proyek)</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategory("")}
                className="text-text-secondary hover:text-text-primary underline cursor-pointer"
              >
                Hapus Filter Topik
              </button>
            </div>
          )}

          {/* Filter & Pencarian */}
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

              {/* Category Dropdown (28 AI Topics) */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-lg bg-surface-secondary/60 border border-border text-xs text-text-primary cursor-pointer focus:outline-hidden focus:border-brand-500 max-w-xs"
                aria-label="Filter Kategori Proyek"
              >
                <option value="">Semua Topik AI ({aiTopicOverview.length})</option>
                <optgroup label="Topik Kurikulum Kecerdasan Buatan (28)">
                  {aiTopicOverview.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} ({t.projectCount})
                    </option>
                  ))}
                </optgroup>
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

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-xs shrink-0"
                >
                  Reset Filter
                </Button>
              )}
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

          {/* Grid Daftar Proyek */}
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
              title={
                hasActiveFilters
                  ? "Tidak ada proyek yang sesuai filter"
                  : "Belum Ada Repositori Proyek"
              }
              description={
                hasActiveFilters
                  ? "Coba ubah kata kunci pencarian atau pilih topik kurikulum lain."
                  : "Mulai bangun portofolio Anda dengan menambahkan repositori proyek pertama."
              }
              action={
                hasActiveFilters ? (
                  <Button variant="outline" size="sm" onClick={handleResetFilters}>
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
        </div>
      )}
    </PageContainer>
  );
}
