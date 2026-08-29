"use client";

import { useEffect, useState, use, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Layers,
  Search,
  X,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { PageContainer } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { getCategoryDetails, getModules, deleteModule } from "@/actions/study-actions";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/utils";
import { isBookmarked, toggleBookmark } from "@/lib/bookmark-service";
import { ModuleListItem } from "@/components/modul/module-list-item";
import { ModuleFilePreviewerModal } from "@/components/modul/module-file-previewer-modal";
import { ModuleDriveFile } from "@/types/module-drive";
import { toast } from "sonner";

export default function DedicatedCategoryModulesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const categoryId = resolvedParams.id;
  const router = useRouter();

  // State
  const [category, setCategory] = useState<any>(null);
  const [parentCategory, setParentCategory] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Filters within category
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [contentMode, setContentMode] = useState<"all" | "module" | "project">("all");
  const [previewFile, setPreviewFile] = useState<ModuleDriveFile | null>(null);
  const [bookmarkMap, setBookmarkMap] = useState<{ [id: string]: boolean }>({});

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

  // Fetch Category & its Modules
  const loadData = useCallback(async () => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    try {
      const [catData, allModules] = await Promise.all([
        getCategoryDetails(categoryId),
        getModules(),
      ]);

      if (catData?.category) {
        setCategory(catData.category);
        setParentCategory(catData.parentCategory || null);
      }

      if (allModules) {
        const filtered = allModules.filter(
          (m) => m.category_id === categoryId || m.category?.id === categoryId
        );
        setModules(filtered);

        const bmState: { [id: string]: boolean } = {};
        filtered.forEach((m) => {
          bmState[m.id] = isBookmarked(m.id);
        });
        setBookmarkMap(bmState);
      }
    } catch (err) {
      console.error("Failed to load category modules:", err);
      setError("Data kategori dan modul belum dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

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

  // Handle Bookmark
  const handleToggleBookmark = (mod: any) => {
    const nextState = toggleBookmark({
      id: mod.id,
      title: mod.title,
      type: mod.kind === "project" ? "project" : "module",
      url: `/dashboard/modul?module=${mod.id}`,
      category: mod.category?.name || category?.name || "Modul",
      subtitle: mod.author_name || "Velqora",
    });
    setBookmarkMap((prev) => ({ ...prev, [mod.id]: nextState }));
    toast.success(
      nextState ? "Disimpan ke Bookmark." : "Dihapus dari Bookmark."
    );
  };

  // Filtered list
  const filteredModules = useMemo(() => {
    let list = [...modules];

    if (contentMode === "module") {
      list = list.filter((m) => m.kind !== "project");
    } else if (contentMode === "project") {
      list = list.filter((m) => m.kind === "project");
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title?.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q)
      );
    }

    if (levelFilter) {
      list = list.filter((m) => m.level === levelFilter);
    }

    return list;
  }, [modules, contentMode, search, levelFilter]);

  return (
    <PageContainer className="space-y-6 pb-14">
      {/* Back Link */}
      <div>
        <Link
          href="/dashboard/modul"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Semua Modul</span>
        </Link>
      </div>

      {/* Category Header */}
      <header className="space-y-2 border-b border-border/70 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {parentCategory && (
                <>
                  <span className="text-xs font-medium text-text-secondary">
                    {parentCategory.name}
                  </span>
                  <span className="text-text-tertiary text-xs">/</span>
                </>
              )}
              <Badge variant="neutral">Kategori Spesifik</Badge>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight font-display">
              {category?.name || "Kategori Modul"}
            </h1>
            {category?.description && (
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
                {category.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Link href={`/dashboard/modul/baru?category=${categoryId}`}>
              <Button size="sm" className="gap-1.5 text-xs font-semibold">
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Modul di Sini</span>
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
          <Button
            size="sm"
            variant="outline"
            onClick={loadData}
            className="text-xs gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-surface shadow-2xs">
        <div className="relative flex-1 min-w-[200px] max-w-md flex items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari dalam kategori ini..."
            className="w-full pl-9 pr-8 py-1.5 min-h-[36px] rounded-lg border border-border bg-surface-secondary/70 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500 transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 p-1 text-text-tertiary hover:text-text-primary"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-secondary border border-border text-xs">
            {[
              { id: "all", label: "Semua" },
              { id: "module", label: "Modul" },
              { id: "project", label: "Proyek" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setContentMode(m.id as any)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  contentMode === m.id
                    ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shadow-2xs font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 min-h-[36px] rounded-lg border border-border bg-surface-secondary/60 text-xs text-text-primary focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="">Semua Tingkat</option>
            <option value="pemula">Pemula</option>
            <option value="menengah">Menengah</option>
            <option value="lanjutan">Lanjutan</option>
          </select>
        </div>
      </div>

      {/* Content List */}
      <section className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-2"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredModules.length === 0 ? (
          <EmptyState
            icon={<Layers className="w-8 h-8" />}
            title="Belum ada modul di kategori ini"
            description="Tambahkan materi atau proyek belajar pertama untuk kategori ini."
            action={
              <Link href={`/dashboard/modul/baru?category=${categoryId}`}>
                <Button size="sm" className="gap-1.5 text-xs font-semibold">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Modul</span>
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredModules.map((mod) => (
              <ModuleListItem
                key={mod.id}
                module={mod}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                isBookmarked={Boolean(bookmarkMap[mod.id])}
                onToggleBookmark={handleToggleBookmark}
                onEdit={(item) => router.push(`/dashboard/modul/edit/${item.id}`)}
                onDelete={handleDeleteModule}
                onFilePreview={(file) => setPreviewFile(file)}
              />
            ))}
          </div>
        )}
      </section>

      {/* File Previewer Modal */}
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
