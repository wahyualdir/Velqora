"use client";

import React, { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Code2, Layers, RefreshCw, AlertCircle } from "lucide-react";
import { PageContainer } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { getModules, getCategories, deleteModule } from "@/actions/study-actions";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/utils";
import { isBookmarked, toggleBookmark } from "@/lib/bookmark-service";
import { ModuleHeader } from "@/components/modul/module-header";
import { ModuleFilters, ACTIVE_CATEGORY_SCOPE } from "@/components/modul/module-filters";
import { SYSTEM_PRIMARY_CATEGORIES } from "@/lib/constants";
import { SmartModuleSorterModal } from "@/components/modul/smart-module-sorter-modal";
import { ModuleFilePreviewerModal } from "@/components/modul/module-file-previewer-modal";
import { AiCategoryCard, AiCategoryItem } from "@/components/modul/ai-category-card";
import { CategoryModuleGroup } from "@/components/modul/category-module-group";
import { ModuleDriveFile } from "@/types/module-drive";
import { toast } from "sonner";

// PEMBATASAN SEMENTARA: Scope katalog modul dibatasi hanya untuk materi Kecerdasan Buatan (AI).
// Kategori non-AI tetap tersimpan di database dan constants.ts, hanya disaring di layer presentasi.
const AI_CATEGORY_PRESET = SYSTEM_PRIMARY_CATEGORIES.find((c) => c.name === "Kecerdasan Buatan");
const AI_SUBCATEGORY_NAMES = new Set(
  AI_CATEGORY_PRESET?.subcategories.map((s) => s.name.toLowerCase()) || []
);

function isModuleInAiScope(mod: any): boolean {
  const catName = (mod.category?.name || "").toLowerCase().trim();
  const parentName = (mod.category?.parent?.name || "").toLowerCase().trim();

  // 1. Kategori induk "Kecerdasan Buatan"
  if (ACTIVE_CATEGORY_SCOPE.some((scope) => scope.toLowerCase() === catName)) {
    return true;
  }

  // 2. Parent kategori "Kecerdasan Buatan"
  if (ACTIVE_CATEGORY_SCOPE.some((scope) => scope.toLowerCase() === parentName)) {
    return true;
  }

  // 3. Subkategori resmi AI (Machine Learning, Deep Learning, NLP, Computer Vision, dll.)
  if (AI_SUBCATEGORY_NAMES.has(catName)) {
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

  // Modals
  const [showSorterModal, setShowSorterModal] = useState(false);
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
          if (localRole === "admin" || isAdminUser(email)) {
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
      const [modulesRes, categoriesRes] = await Promise.all([
        getModules(),
        getCategories(),
      ]);

      if (modulesRes) {
        setModules(modulesRes);

        // Update bookmark map
        const bmState: { [id: string]: boolean } = {};
        modulesRes.forEach((m) => {
          bmState[m.id] = isBookmarked(m.id);
        });
        setBookmarkMap(bmState);
      }

      if (categoriesRes) {
        setCategories(categoriesRes);
      }
    } catch (err) {
      console.error("Failed to load modules:", err);
      setError("Daftar modul belum dapat dimuat. Silakan periksa koneksi Anda.");
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

  const totalModulesCount = useMemo(
    () => aiScopedModules.filter((m) => m.kind !== "project").length,
    [aiScopedModules]
  );
  const totalProjectsCount = useMemo(
    () => aiScopedModules.filter((m) => m.kind === "project").length,
    [aiScopedModules]
  );

  // ─── 1. Ringkasan Topik AI (Kartu Besar) ───
  const aiTopicOverview = useMemo<AiCategoryItem[]>(() => {
    const subcats = AI_CATEGORY_PRESET?.subcategories || [];
    return subcats.map((sub) => {
      const dbCat = categories.find(
        (c) => (c.name || "").toLowerCase().trim() === sub.name.toLowerCase().trim()
      );
      const count = aiScopedModules.filter((m) => {
        const catName = (m.category?.name || "").toLowerCase().trim();
        return (
          catName === sub.name.toLowerCase().trim() ||
          (sub.name === "Artificial Intelligence Fundamentals" &&
            (!catName || catName === "kecerdasan buatan"))
        );
      }).length;

      return {
        id: dbCat?.id || sub.name,
        name: sub.name,
        color: sub.color || "#8B5CF6",
        icon: sub.icon || "machine_learning",
        moduleCount: count,
      };
    });
  }, [aiScopedModules, categories]);

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

    return Array.from(map.values());
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
        contentMode={contentMode}
        onModeChange={setContentMode}
        totalModules={totalModulesCount}
        totalProjects={totalProjectsCount}
        onOpenSorter={() => setShowSorterModal(true)}
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

      {/* ─── 2. Topik Kurikulum AI (Kartu Besar) ─── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono">
              Topik Kurikulum Kecerdasan Buatan
            </h2>
            <p className="text-xs text-text-secondary font-mono">
              Pilih kartu topik untuk meninjau silabus dan materi kode terstruktur
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {aiTopicOverview.map((topic) => (
            <AiCategoryCard key={topic.id || topic.name} category={topic} />
          ))}
        </div>
      </section>

      {/* ─── 3. Search, Category, and Scope Filters ─── */}
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

      {/* ─── 4. Content List Area (Berkelompok per Kategori) ─── */}
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
