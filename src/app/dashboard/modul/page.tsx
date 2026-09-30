"use client";

import React, { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Code2,
  Layers,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Compass,
  Search as SearchIcon,
  X,
} from "lucide-react";
import { PageContainer } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { getModules, getCategories, deleteModule } from "@/actions/study-actions";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/utils";
import { isBookmarked, toggleBookmark } from "@/lib/bookmark-service";
import { ModuleHeader, ModuleViewTab } from "@/components/modul/module-header";
import { ModuleFilters } from "@/components/modul/module-filters";
import { SYSTEM_PRIMARY_CATEGORIES, isCategoryInActiveScope } from "@/lib/constants";
import { SmartModuleSorterModal } from "@/components/modul/smart-module-sorter-modal";
import { ModuleFilePreviewerModal } from "@/components/modul/module-file-previewer-modal";
import { OwnerModuleImportModal } from "@/components/modul/owner-module-import-modal";
import { AiCategoryCard, AiCategoryItem } from "@/components/modul/ai-category-card";
import { CategoryModuleGroup } from "@/components/modul/category-module-group";
import { ModuleDriveFile } from "@/types/module-drive";
import { getDefaultAiSections } from "@/lib/fallback-syllabus-defaults";
import { getAcademicCurriculum } from "@/lib/curriculum/registry";
import { getTopicStatus } from "@/lib/curriculum/status";
import {
  CATALOG_GROUPS,
  CATALOG_TOPICS,
  CAREER_PATHS,
  getCatalogChapterCount,
  CareerPath,
  TopicLevel,
} from "@/lib/curriculum/catalog";
import { toast } from "sonner";

const AI_CATEGORY_PRESET = SYSTEM_PRIMARY_CATEGORIES.find((c) => c.name === "Kecerdasan Buatan");

function isModuleInAiScope(mod: any): boolean {
  const catName = mod.category?.name;
  const parentName = mod.category?.parent?.name;

  // 1. Kategori induk atau subkategori dalam scope AI aktif
  if (isCategoryInActiveScope(catName, parentName)) {
    return true;
  }

  // 4. Modul tanpa relasi kategori spesifik: periksa kata kunci AI di judul atau tags
  const titleOrDesc = `${mod.title || ""} ${mod.description || ""}`.toLowerCase();
  const hasAiTag = mod.tags?.some((t: any) =>
    ["ai", "kecerdasan buatan", "machine learning", "deep learning", "nlp", "computer vision", "llm"].includes(
      (t.name || "").toLowerCase().trim()
    )
  );

  if (
    hasAiTag ||
    titleOrDesc.includes("machine learning") ||
    titleOrDesc.includes("deep learning") ||
    titleOrDesc.includes("kecerdasan buatan") ||
    titleOrDesc.includes("artificial intelligence") ||
    titleOrDesc.includes("neural network")
  ) {
    return true;
  }

  return false;
}

function ModulDanProjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: "all" | "module" | "project"
  const modeParam = searchParams.get("mode");
  const [contentMode, setContentMode] = useState<"all" | "module" | "project">(
    modeParam === "project" ? "project" : modeParam === "module" ? "module" : "all"
  );

  // View Tab: "categories" (default clean grid) | "all-content" (search, filter, & listing)
  const [viewTab, setViewTab] = useState<ModuleViewTab>(
    modeParam === "project" || searchParams.get("q") || searchParams.get("category")
      ? "all-content"
      : "categories"
  );

  useEffect(() => {
    if (modeParam === "project") {
      router.replace("/dashboard/project");
    }
  }, [modeParam, router]);

  // Core Data
  const [modules, setModules] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [levelFilter, setLevelFilter] = useState(searchParams.get("level") || "");
  const [scope, setScope] = useState<"all" | "mine">("all");
  const [sortBy, setSortBy] = useState<string>("latest");

  // Katalog 24 Topik: Career Path & Level Filters
  const [selectedCareerPath, setSelectedCareerPath] = useState<string>("all");
  const [selectedTopicLevel, setSelectedTopicLevel] = useState<string>("all");
  const [topicSearchQuery, setTopicSearchQuery] = useState<string>("");

  // Modals
  const [showSorterModal, setShowSorterModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<ModuleDriveFile | null>(null);
  const [bookmarkMap, setBookmarkMap] = useState<{ [id: string]: boolean }>({});

  // Fetch Current User & Admin Status
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

  // Fetch Modules & Categories
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [modulesResult, categoriesResult] = await Promise.allSettled([
        getModules(),
        getCategories(),
      ]);

      const modulesRes =
        modulesResult.status === "fulfilled" && Array.isArray(modulesResult.value)
          ? modulesResult.value
          : [];
      const categoriesRes =
        categoriesResult.status === "fulfilled" && Array.isArray(categoriesResult.value)
          ? categoriesResult.value
          : [];

      setModules(modulesRes);

      // Update bookmark map
      const bmState: { [id: string]: boolean } = {};
      modulesRes.forEach((m) => {
        bmState[m.id] = isBookmarked(m.id);
      });
      setBookmarkMap(bmState);

      if (categoriesRes && categoriesRes.length > 0) {
        setCategories(categoriesRes);
      }
    } catch (err) {
      console.error("Failed to load modules:", err);
      // Soft-fail: Do not block view if data is still settling
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Delete
  const handleDeleteModule = async (id: string) => {
    try {
      await deleteModule(id);
      setModules((prev) => prev.filter((m) => m.id !== id));
      toast.success("Modul berhasil dihapus.");
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus modul.");
    }
  };

  // Handle Bookmark Toggle
  const handleToggleBookmark = (mod: any) => {
    const nextState = toggleBookmark({
      id: mod.id,
      title: mod.title,
      type: mod.kind === "project" ? "project" : "module",
      url: `/dashboard/modul?module=${mod.id}`,
      category: mod.category?.name || "Modul",
      subtitle: mod.author_name || "Velqora",
    });
    setBookmarkMap((prev) => ({ ...prev, [mod.id]: nextState }));
    toast.success(
      nextState
        ? "Modul disimpan ke Bookmark."
        : "Modul dihapus dari Bookmark."
    );
  };

  // Scope aktif katalog modul: disaring hanya untuk materi Kecerdasan Buatan (AI)
  const aiScopedModules = useMemo(() => {
    return modules.filter(isModuleInAiScope);
  }, [modules]);

  // Filter & Sort Logic
  const filteredModules = useMemo(() => {
    let list = [...aiScopedModules];

    // 1. Content Mode Filter
    if (contentMode === "module") {
      list = list.filter((m) => m.kind !== "project");
    } else if (contentMode === "project") {
      list = list.filter((m) => m.kind === "project");
    }

    // 2. Search Query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title?.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q) ||
          m.category?.name?.toLowerCase().includes(q) ||
          m.tags?.some((t: any) => t.name?.toLowerCase().includes(q))
      );
    }

    // 3. Category Filter
    if (selectedCategory) {
      list = list.filter(
        (m) => m.category_id === selectedCategory || m.category?.id === selectedCategory
      );
    }

    // 4. Level Filter
    if (levelFilter) {
      list = list.filter((m) => m.level === levelFilter);
    }

    // 5. Scope Filter (All vs Mine)
    if (scope === "mine" && currentUserId) {
      list = list.filter((m) => m.user_id === currentUserId);
    }

    // 6. Sorting
    list.sort((a, b) => {
      if (sortBy === "oldest") {
        return (
          new Date(a.created_at || a.updated_at).getTime() -
          new Date(b.created_at || b.updated_at).getTime()
        );
      }
      if (sortBy === "title_asc") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortBy === "title_desc") {
        return (b.title || "").localeCompare(a.title || "");
      }
      // default: latest
      return (
        new Date(b.updated_at || b.created_at).getTime() -
        new Date(a.updated_at || a.created_at).getTime()
      );
    });

    return list;
  }, [aiScopedModules, contentMode, search, selectedCategory, levelFilter, scope, sortBy, currentUserId]);

  const totalModulesCount = useMemo(() => {
    return CATALOG_TOPICS.filter((t) => !t.hidden).reduce((acc, topic) => {
      const chCount = getCatalogChapterCount(topic);
      return acc + chCount;
    }, 0);
  }, []);
  const totalProjectsCount = useMemo(
    () => aiScopedModules.filter((m) => m.kind === "project").length,
    [aiScopedModules]
  );

  // ─── 1. Ringkasan 24 Topik AI (Katalog Terstruktur per Jalur) ───
  const aiTopicOverview = useMemo<AiCategoryItem[]>(() => {
    return CATALOG_TOPICS.filter((t) => !t.hidden).map((topic) => {
      const dbCat = categories.find(
        (c) =>
          (c.name || "").toLowerCase().trim() === topic.name.toLowerCase().trim() ||
          (topic.legacyId && (c.name || "").toLowerCase().trim() === topic.legacyId.toLowerCase().trim())
      );
      const customCount = aiScopedModules.filter((m) => {
        const catName = (m.category?.name || "").toLowerCase().trim();
        return (
          catName === topic.name.toLowerCase().trim() ||
          (topic.legacyId && catName === topic.legacyId.toLowerCase().trim()) ||
          (topic.id === "artificial-intelligence" && (!catName || catName === "kecerdasan buatan"))
        );
      }).length;

      const contentChapterCount = getCatalogChapterCount(topic);
      const count = Math.max(customCount, contentChapterCount);
      const statusMeta = getTopicStatus(topic.legacyId || topic.id || topic.name);

      return {
        id: topic.id,
        name: topic.name,
        color: topic.color,
        icon: topic.icon,
        moduleCount: count,
        statusMeta: {
          ...statusMeta,
          badgeLabel: topic.badgeLabel || statusMeta.badgeLabel,
          shortDescription: topic.shortDescription || statusMeta.shortDescription,
        },
        level: topic.level,
        careerPaths: topic.careerPaths,
        isNew: topic.isNew,
        absorbedTopics: topic.absorbedTopics,
        mergedFrom: topic.mergedFrom,
        group: topic.group,
      };
    });
  }, [aiScopedModules, categories]);

  // Statistik Kesiapan Konten (Dihitung Dinamis dari 24 Topik Aktif)
  const verifiedCount = useMemo(
    () => aiTopicOverview.filter((t) => t.statusMeta?.status === "verified").length,
    [aiTopicOverview]
  );
  const inProgressCount = useMemo(
    () =>
      aiTopicOverview.filter(
        (t) => t.statusMeta?.status === "in_development" || t.statusMeta?.status === "in_progress"
      ).length,
    [aiTopicOverview]
  );
  const underReviewCount = useMemo(
    () => aiTopicOverview.filter((t) => t.statusMeta?.status === "under_review").length,
    [aiTopicOverview]
  );
  const comingSoonCount = useMemo(
    () => aiTopicOverview.filter((t) => t.statusMeta?.status === "coming_soon").length,
    [aiTopicOverview]
  );

  // Filter Topik Katalog berdasarkan Jalur Karier, Level, & Pencarian
  const filteredCatalogTopics = useMemo(() => {
    let list = [...aiTopicOverview];

    // Filter berdasarkan jalur karier
    if (selectedCareerPath && selectedCareerPath !== "all") {
      list = list.filter((t) =>
        t.careerPaths?.includes(selectedCareerPath as CareerPath)
      );
    }

    // Filter berdasarkan tingkat kesulitan
    if (selectedTopicLevel && selectedTopicLevel !== "all") {
      list = list.filter(
        (t) => t.level?.toLowerCase() === selectedTopicLevel.toLowerCase()
      );
    }

    // Filter pencarian teks
    if (topicSearchQuery.trim()) {
      const q = topicSearchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.statusMeta?.shortDescription.toLowerCase().includes(q) ||
          t.absorbedTopics?.some((a) => a.toLowerCase().includes(q)) ||
          t.mergedFrom?.some((m) => m.toLowerCase().includes(q)) ||
          t.careerPaths?.some((p) => p.toLowerCase().includes(q))
      );
    }

    return list;
  }, [aiTopicOverview, selectedCareerPath, selectedTopicLevel, topicSearchQuery]);

  const hasActiveCatalogFilters = Boolean(
    (selectedCareerPath && selectedCareerPath !== "all") ||
    (selectedTopicLevel && selectedTopicLevel !== "all") ||
    topicSearchQuery.trim()
  );

  const handleResetCatalogFilters = () => {
    setSelectedCareerPath("all");
    setSelectedTopicLevel("all");
    setTopicSearchQuery("");
  };

  // ─── 2. Pengelompokan Modul yang Difilter per Kategori AI ───
  const groupedModulesByCategory = useMemo(() => {
    const map = new Map<string, { category: any; modules: any[] }>();

    for (const mod of filteredModules) {
      let catName = mod.category?.name?.trim() || "";
      const catObj = mod.category;

      if (!catName || catName.toLowerCase() === "kecerdasan buatan") {
        catName = "Artificial Intelligence Fundamentals";
      }

      const presetSub = AI_CATEGORY_PRESET?.subcategories.find(
        (s) => s.name.toLowerCase() === catName.toLowerCase()
      );

      const resolvedCategory = {
        id: catObj?.id || presetSub?.name || catName,
        name: presetSub?.name || catName,
        color: presetSub?.color || catObj?.color || "#8B5CF6",
        icon: presetSub?.icon || catObj?.icon || "machine_learning",
      };

      const key = resolvedCategory.name.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { category: resolvedCategory, modules: [] });
      }
      map.get(key)!.modules.push(mod);
    }

    return Array.from(map.values()).sort((a, b) =>
      a.category.name.localeCompare(b.category.name, "id", { sensitivity: "base" })
    );
  }, [filteredModules]);

  const hasActiveFilters = Boolean(
    search || selectedCategory || levelFilter || scope !== "all" || sortBy !== "latest"
  );

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setLevelFilter("");
    setScope("all");
    setSortBy("latest");
  };

  return (
    <PageContainer className="space-y-6 pb-14">
      {/* ─── 1. Header & Quick Actions ─── */}
      <ModuleHeader
        viewTab={viewTab}
        onViewTabChange={setViewTab}
        contentMode={contentMode}
        onModeChange={setContentMode}
        totalModules={totalModulesCount}
        totalProjects={totalProjectsCount}
        totalCategories={aiTopicOverview.length}
        onOpenSorter={() => setShowSorterModal(true)}
        onOpenImport={isAdmin ? () => setShowImportModal(true) : undefined}
      />

      {/* ─── Error Alert ─── */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center justify-between gap-3 text-xs sm:text-sm text-rose-600 dark:text-rose-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={loadData}
            className="text-xs gap-1.5 shrink-0 border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      )}

      {/* ─── TAB 1: Topik Kurikulum AI (24 Topik Dikelompokkan per Jalur) ─── */}
      {viewTab === "categories" && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono flex items-center gap-2">
                <span>Katalog Kurikulum AI & Data ({aiTopicOverview.length} Topik)</span>
              </h2>
              <p className="text-xs text-text-secondary font-mono">
                Struktur kurikulum terpadu 24 topik berstandar universitas & industri, dikelompokkan per jalur kompetensi
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViewTab("all-content")}
              className="text-xs font-mono font-medium text-brand-600 dark:text-brand-400 hover:underline cursor-pointer flex items-center gap-1 shrink-0 self-start sm:self-auto"
            >
              <span>Eksplorasi Modul ({totalModulesCount + totalProjectsCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Banner Transparansi Audit Kualitas Kurikulum (Dihitung Dinamis) */}
          <div className="p-3 sm:p-3.5 rounded-xl border border-border bg-surface/60 backdrop-blur-xs flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xs">
            <div className="flex items-center gap-2 text-text-secondary min-w-0">
              <span className="font-semibold text-text-primary uppercase tracking-wide text-[11px] shrink-0">
                Audit Mutu:
              </span>
              <span className="truncate">Sinyal transparansi kesiapan materi 24 topik kurikulum</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>{verifiedCount} Terverifikasi</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 font-semibold">
                <Clock className="w-3 h-3 shrink-0" />
                <span>{inProgressCount} Progres</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-semibold">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span>{underReviewCount} Dalam Review</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/30 font-semibold">
                <Clock className="w-3 h-3 shrink-0" />
                <span>{comingSoonCount} Segera Hadir</span>
              </span>
            </div>
          </div>

          {/* Console Filter Jalur Karier & Level */}
          <div className="p-3 sm:p-4 rounded-xl border border-border bg-surface/80 backdrop-blur-xs space-y-3 shadow-xs">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Filter Jalur Karier (Pills) */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-mono text-text-tertiary uppercase font-bold mr-1 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Jalur:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCareerPath("all")}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                    selectedCareerPath === "all"
                      ? "bg-brand-600 text-white border-brand-600 font-bold shadow-xs"
                      : "bg-surface text-text-secondary border-border hover:bg-surface-secondary"
                  }`}
                >
                  Semua Jalur ({aiTopicOverview.length})
                </button>
                {CAREER_PATHS.map((path) => {
                  const countForPath = aiTopicOverview.filter((t) =>
                    t.careerPaths?.includes(path)
                  ).length;
                  const isActive = selectedCareerPath === path;
                  return (
                    <button
                      key={path}
                      type="button"
                      onClick={() => setSelectedCareerPath(path)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? "bg-brand-600 text-white border-brand-600 font-bold shadow-xs"
                          : "bg-surface text-text-secondary border-border hover:bg-surface-secondary"
                      }`}
                    >
                      {path} ({countForPath})
                    </button>
                  );
                })}
              </div>

              {/* Controls Kanan: Level & Search */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {/* Level Dropdown */}
                <select
                  value={selectedTopicLevel}
                  onChange={(e) => setSelectedTopicLevel(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-mono rounded-lg border border-border bg-surface text-text-primary focus:outline-hidden cursor-pointer"
                  aria-label="Filter level"
                >
                  <option value="all">Semua Level</option>
                  <option value="pemula">Pemula</option>
                  <option value="menengah">Menengah</option>
                  <option value="lanjut">Lanjut</option>
                </select>

                {/* Search Input Topik */}
                <div className="relative flex-1 sm:w-56">
                  <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary pointer-events-none" />
                  <input
                    type="text"
                    value={topicSearchQuery}
                    onChange={(e) => setTopicSearchQuery(e.target.value)}
                    placeholder="Cari topik..."
                    className="w-full pl-8 pr-7 py-1.5 text-xs font-mono rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-hidden"
                  />
                  {topicSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setTopicSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Tombol Reset jika filter aktif */}
                {hasActiveCatalogFilters && (
                  <button
                    type="button"
                    onClick={handleResetCatalogFilters}
                    className="px-2 py-1 text-xs font-mono text-rose-600 dark:text-rose-400 hover:underline cursor-pointer shrink-0"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Daftar Topik Dikelompokkan per Jalur (5 Grup) */}
          <div className="space-y-8">
            {CATALOG_GROUPS.map((group) => {
              const groupTopics = filteredCatalogTopics.filter(
                (topic) => topic.group === group.id
              );

              if (groupTopics.length === 0) return null;

              return (
                <div key={group.id} className="space-y-3.5">
                  {/* Header Grup */}
                  <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      <div>
                        <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-text-primary flex items-center gap-2">
                          <span>{group.title}</span>
                          <span
                            className="px-2 py-0.2 rounded-full text-[10.5px] font-mono font-semibold"
                            style={{
                              backgroundColor: group.badgeBg,
                              color: group.badgeText,
                            }}
                          >
                            {groupTopics.length} Topik
                          </span>
                        </h3>
                        <p className="text-xs text-text-tertiary font-mono">
                          {group.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grid Kartu Topik */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                    {groupTopics.map((topic) => (
                      <AiCategoryCard key={topic.id || topic.name} category={topic} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Empty State jika tidak ada topik yang cocok */}
            {filteredCatalogTopics.length === 0 && (
              <div className="p-8 text-center rounded-xl border border-dashed border-border bg-surface/40 space-y-3">
                <p className="text-xs font-mono text-text-tertiary">
                  Tidak ditemukan topik kurikulum yang sesuai dengan kriteria filter.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleResetCatalogFilters}
                  className="text-xs font-mono"
                >
                  Reset Filter Topik
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── TAB 2: Eksplorasi Semua Modul & Proyek (Search, Filter, & Listing) ─── */}
      {viewTab === "all-content" && (
        <>
          {/* 3. Search, Category, and Scope Filters */}
          <ModuleFilters
            search={search}
            onSearchChange={setSearch}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
            levelFilter={levelFilter}
            onLevelChange={setLevelFilter}
            scope={scope}
            onScopeChange={setScope}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* 4. Content List Area (Berkelompok per Kategori) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1 text-xs text-text-tertiary font-mono">
              <span>
                Menampilkan {filteredModules.length} dari {aiScopedModules.length} konten AI ({groupedModulesByCategory.length} topik aktif)
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-20 rounded" />
                      <Skeleton className="h-4 w-24 rounded" />
                    </div>
                    <Skeleton className="h-6 w-3/4 rounded" />
                    <Skeleton className="h-4 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : aiScopedModules.length === 0 ? (
              /* Empty State 1: Zero AI modules in scope */
              <EmptyState
                icon={<Layers className="w-8 h-8" />}
                title="Belum ada modul atau project AI"
                description="Mulai susun kurikulum belajar Anda dengan menambahkan modul atau proyek bertema Kecerdasan Buatan (AI) pertama."
                action={
                  <div className="flex items-center gap-2 justify-center flex-wrap pt-2">
                    <Link href="/dashboard/modul/baru">
                      <Button size="sm" className="gap-1.5 text-xs font-semibold">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Buat Modul Baru</span>
                      </Button>
                    </Link>
                    <Link href="/dashboard/modul/baru?mode=project">
                      <Button size="sm" variant="secondary" className="gap-1.5 text-xs font-medium">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Tambah Proyek Kode</span>
                      </Button>
                    </Link>
                  </div>
                }
              />
            ) : filteredModules.length === 0 ? (
              /* Empty State 2: Zero results for current filter/search */
              <EmptyState
                icon={<Layers className="w-8 h-8" />}
                title="Tidak ada konten yang sesuai"
                description="Tidak ditemukan modul atau proyek yang cocok dengan kata kunci atau filter yang Anda pilih."
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleResetFilters}
                    className="text-xs"
                  >
                    Reset Semua Filter
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                {groupedModulesByCategory.map((group) => (
                  <CategoryModuleGroup
                    key={group.category.id || group.category.name}
                    category={group.category}
                    modules={group.modules}
                    currentUserId={currentUserId}
                    isAdmin={isAdmin}
                    bookmarkMap={bookmarkMap}
                    onToggleBookmark={handleToggleBookmark}
                    onEdit={(item) => router.push(`/dashboard/modul/edit/${item.id}`)}
                    onDelete={handleDeleteModule}
                    onFilePreview={(file) => setPreviewFile(file)}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* ─── Smart Module Sorter Modal ─── */}
      {showSorterModal && (
        <SmartModuleSorterModal
          isOpen={showSorterModal}
          onClose={() => setShowSorterModal(false)}
          onSorted={loadData}
        />
      )}

      {/* ─── File Previewer Modal ─── */}
      {previewFile && (
        <ModuleFilePreviewerModal
          isOpen={Boolean(previewFile)}
          onClose={() => setPreviewFile(null)}
          file={previewFile}
        />
      )}

      {/* Owner Module Import Modal */}
      <OwnerModuleImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => loadData()}
      />
    </PageContainer>
  );
}

export default function ModulDanProjectPage() {
  return (
    <Suspense
      fallback={
        <PageContainer className="space-y-6 pb-14">
          <div className="h-8 w-48 bg-surface-secondary rounded-lg animate-pulse" />
          <div className="h-16 w-full bg-surface-secondary rounded-xl animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 w-full bg-surface rounded-xl border border-border animate-pulse"
              />
            ))}
          </div>
        </PageContainer>
      }
    >
      <ModulDanProjectContent />
    </Suspense>
  );
}
