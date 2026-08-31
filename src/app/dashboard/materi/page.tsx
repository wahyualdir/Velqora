"use client";

import React, { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { Plus, BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { getMaterials, getCategories, deleteMaterial } from "@/actions/study-actions";
import { isBookmarked, toggleBookmark } from "@/lib/bookmark-service";
import { MaterialHeader } from "@/components/materi/material-header";
import { MaterialFilters } from "@/components/materi/material-filters";
import { MaterialListItem } from "@/components/materi/material-list-item";
import { MobileMaterialList } from "@/components/materi/mobile-material-list";
import { SurfaceAdaptive } from "@/components/layout/surface-adaptive";
import { toast } from "sonner";

function MateriContent() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [bookmarkMap, setBookmarkMap] = useState<{ [id: string]: boolean }>({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [matData, catData] = await Promise.all([
        getMaterials(),
        getCategories(),
      ]);

      if (matData) {
        setMaterials(matData);
        const bmState: { [id: string]: boolean } = {};
        matData.forEach((m) => {
          bmState[m.id] = isBookmarked(m.id);
        });
        setBookmarkMap(bmState);
      }

      if (catData) {
        setCategories(catData);
      }
    } catch (err) {
      console.error("Failed to load materials:", err);
      setError("Materi belum dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Delete
  const handleDeleteMaterial = async (id: string) => {
    try {
      await deleteMaterial(id);
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      toast.success("Materi berhasil dihapus.");
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus materi.");
    }
  };

  // Handle Bookmark Toggle
  const handleToggleBookmark = (mat: any) => {
    const nextState = toggleBookmark({
      id: mat.id,
      type: "material",
      title: mat.title,
      subtitle: mat.description || mat.subject || undefined,
      category: mat.category?.name || "Materi",
      url: `/dashboard/materi/${mat.id}`,
    });
    setBookmarkMap((prev) => ({ ...prev, [mat.id]: nextState }));
    toast.success(
      nextState ? "Materi disimpan ke Bookmark." : "Materi dihapus dari Bookmark."
    );
  };

  // Filter & Sort Logic
  const filteredMaterials = useMemo(() => {
    let list = [...materials];

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title?.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q) ||
          m.subject?.toLowerCase().includes(q) ||
          m.category?.name?.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (selectedCategory) {
      list = list.filter(
        (m) => m.category_id === selectedCategory || m.category?.id === selectedCategory
      );
    }

    // 3. Type Filter
    if (selectedType) {
      list = list.filter((m) => m.type === selectedType);
    }

    // 4. Sorting
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
  }, [materials, search, selectedCategory, selectedType, sortBy]);

  const hasActiveFilters = Boolean(
    search || selectedCategory || selectedType || sortBy !== "latest"
  );

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedType("");
    setSortBy("latest");
  };

  return (
    <PageContainer className="space-y-6 pb-14">
      {/* ─── 1. Header & Actions ─── */}
      <MaterialHeader totalCount={materials.length} />

      {/* ─── Error Alert ─── */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center justify-between gap-3 text-xs sm:text-sm text-rose-600 dark:text-rose-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div>
              <p className="font-semibold">{error}</p>
              <p className="text-xs opacity-80">Terjadi kendala saat mengambil data materi.</p>
            </div>
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

      {/* ─── 2. Search & Filter Bar ─── */}
      <MaterialFilters
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* ─── 3. Materials List Area ─── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1 text-xs text-text-tertiary font-mono">
          <span>
            Menampilkan {filteredMaterials.length} dari {materials.length} dokumen materi
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
        ) : materials.length === 0 ? (
          /* Empty Workspace */
          <EmptyState
            icon={<BookOpen className="w-8 h-8" />}
            title="Belum ada materi"
            description="Tambahkan bahan ajar pertama untuk mulai membangun ruang belajar Anda."
            action={
              <Link href="/dashboard/materi/baru">
                <Button size="sm" className="gap-1.5 text-xs font-semibold">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Materi</span>
                </Button>
              </Link>
            }
          />
        ) : filteredMaterials.length === 0 ? (
          /* Empty Search / Filter */
          <EmptyState
            icon={<BookOpen className="w-8 h-8" />}
            title="Materi tidak ditemukan"
            description="Coba gunakan kata kunci atau filter yang berbeda."
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={handleResetFilters}
                className="text-xs"
              >
                Reset filter
              </Button>
            }
          />
        ) : (
          <SurfaceAdaptive
            web={
              <div className="space-y-3">
                {filteredMaterials.map((mat) => (
                  <MaterialListItem
                    key={mat.id}
                    material={mat}
                    isBookmarked={Boolean(bookmarkMap[mat.id])}
                    onToggleBookmark={handleToggleBookmark}
                    onDelete={handleDeleteMaterial}
                  />
                ))}
              </div>
            }
            app={
              <MobileMaterialList
                materials={filteredMaterials}
                bookmarkMap={bookmarkMap}
                onToggleBookmark={handleToggleBookmark}
                onDelete={handleDeleteMaterial}
              />
            }
          />
        )}
      </section>
    </PageContainer>
  );
}

export default function MateriPage() {
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
      <MateriContent />
    </Suspense>
  );
}
