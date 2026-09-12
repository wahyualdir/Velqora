"use client";

import React, { useEffect, useState, use, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Plus,
  Layers,
  Search,
  X,
  AlertCircle,
  RefreshCw,
  BookOpen,
  ArrowRight,
  Network,
  Info,
  AlertTriangle,
} from "lucide-react";
import { PageContainer } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { getCategoryDetails, getModules, deleteModule } from "@/actions/study-actions";
import { getNotesByCategory, type NoteEntity } from "@/actions/study/notes";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser, slugify } from "@/lib/utils";
import { isBookmarked, toggleBookmark } from "@/lib/bookmark-service";
import { ModuleListItem } from "@/components/modul/module-list-item";
import { ModuleFilePreviewerModal } from "@/components/modul/module-file-previewer-modal";
import {
  ModuleDriveFile,
  ModuleSection,
} from "@/types/module-drive";
import { SYSTEM_PRIMARY_CATEGORIES } from "@/lib/constants";
import { getCategoryIconComponent } from "@/components/modul/category-icon";
import { getDefaultAiSections } from "@/lib/fallback-syllabus-defaults";
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
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Filter internal modul
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [contentMode, setContentMode] = useState<"all" | "module" | "project">("all");
  const [previewFile, setPreviewFile] = useState<ModuleDriveFile | null>(null);
  const [bookmarkMap, setBookmarkMap] = useState<{ [id: string]: boolean }>({});
  const [vaultNotes, setVaultNotes] = useState<NoteEntity[]>([]);


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

  // Fetch Category & its Modules
  const loadData = useCallback(async () => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    try {
      const decodedId = decodeURIComponent(categoryId).trim();

      const [catData, allModules] = await Promise.all([
        getCategoryDetails(decodedId),
        getModules(),
      ]);

      // Resolve category info
      let resolvedCat = catData?.category || catData;

      if (!resolvedCat) {
        // Fallback pencarian di preset SYSTEM_PRIMARY_CATEGORIES
        const aiPrimary = SYSTEM_PRIMARY_CATEGORIES.find((p) => p.name === "Kecerdasan Buatan");
        const foundSub = aiPrimary?.subcategories.find(
          (s) =>
            s.name.toLowerCase() === decodedId.toLowerCase() ||
            s.name.toLowerCase().replace(/[^a-z0-9]/g, "-") === decodedId.toLowerCase()
        );

        if (foundSub) {
          resolvedCat = {
            id: foundSub.name,
            name: foundSub.name,
            color: foundSub.color || "#8B5CF6",
            icon: foundSub.icon || "machine_learning",
            description: `Kurikulum komprehensif materi ${foundSub.name} berbasis teori dan implementasi praktikum kode.`,
          };
        } else {
          resolvedCat = {
            id: decodedId,
            name: decodedId,
            color: "#8B5CF6",
            icon: "machine_learning",
            description: "Kumpulan modul kurikulum dan repositori proyek pembelajaran Kecerdasan Buatan.",
          };
        }
      }

      setCategory(resolvedCat);

      if (allModules) {
        const catNameLower = (resolvedCat.name || decodedId).toLowerCase().trim();
        const catIdLower = (resolvedCat.id || decodedId).toLowerCase().trim();

        const filtered = allModules.filter((m) => {
          const mCatId = (m.category_id || m.category?.id || "").toLowerCase().trim();
          const mCatName = (m.category?.name || "").toLowerCase().trim();
          return (
            mCatId === catIdLower ||
            mCatName === catNameLower ||
            (catNameLower.includes("fundamentals") && (!mCatName || mCatName === "kecerdasan buatan"))
          );
        });

        setModules(filtered);

        const bmState: { [id: string]: boolean } = {};
        filtered.forEach((m) => {
          bmState[m.id] = isBookmarked(m.id);
        });
        setBookmarkMap(bmState);
      }

      // Fetch vault notes for this category
      try {
        const notes = await getNotesByCategory(resolvedCat.id || decodedId);
        setVaultNotes(notes || []);
      } catch (err) {
        console.warn("Could not fetch category notes:", err);
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

  // Kumpulan Topik Materi (Notes Kurikulum Obsidian)
  const allTopicNotes = useMemo(() => {
    if (vaultNotes && vaultNotes.length > 0) {
      return vaultNotes.map((n) => ({
        id: n.id,
        slug: n.slug,
        title: n.title,
        description: n.content_markdown
          ? n.content_markdown.replace(/^[#*>-]+\s*/, "").slice(0, 150)
          : "",
        isPlaceholder: false,
      }));
    }

    const catName = category?.name || decodeURIComponent(categoryId);
    const defaults = getDefaultAiSections(catName);
    return defaults.map((sec) => ({
      id: sec.id,
      slug: slugify(sec.title),
      title: sec.title,
      description: sec.description || "",
      isPlaceholder: true,
    }));
  }, [vaultNotes, category, categoryId]);

  // Filtered module list
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

  const themeColor = category?.color || "#8B5CF6";
  const CategoryIcon = getCategoryIconComponent(category?.icon);

  return (
    <PageContainer className="space-y-6 pb-14">
      {/* ─── 1. Breadcrumb Navigasi ─── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-text-tertiary">
        <Link href="/dashboard" className="hover:text-text-primary transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/dashboard/modul" className="hover:text-text-primary transition-colors">
          Katalog Modul AI
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-text-primary font-bold truncate">
          {category?.name || decodeURIComponent(categoryId)}
        </span>
      </nav>

      {/* ─── 2. Header Kategori & Deskripsi ─── */}
      <header className="p-5 sm:p-6 vt-window bg-[#FFFFFF] dark:bg-[#18181B] border border-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border mt-0.5"
              style={{
                backgroundColor: `${themeColor}15`,
                borderColor: `${themeColor}35`,
                color: themeColor,
              }}
            >
              <CategoryIcon className="w-6 h-6" />
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono text-text-tertiary">
                <span className="uppercase tracking-wider font-semibold text-text-secondary">
                  Kurikulum AI
                </span>
                <span>•</span>
                <span className="uppercase tracking-wider">
                  {allTopicNotes.length} Topik Silabus
                </span>
                <span>•</span>
                <span className="uppercase tracking-wider">
                  {modules.length} Modul Terkait
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight font-display">
                {category?.name || decodeURIComponent(categoryId)}
              </h1>

              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl">
                {category?.description ||
                  `Materi dan silabus kurikulum Kecerdasan Buatan untuk topik ${category?.name || decodeURIComponent(categoryId)}, mencakup dasar teori, pemodelan matematis, dan implementasi kode.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start">
            <Link href={`/dashboard/modul/baru?category=${encodeURIComponent(category?.id || categoryId)}`}>
              <Button size="sm" className="gap-1.5 text-xs font-semibold cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Modul</span>
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

      {/* ─── 3. Daftar Topik Silabus Materi (Catatan Vault) ─── */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Daftar Topik Silabus Materi ({allTopicNotes.length})</span>
            </h2>
            <p className="text-xs text-text-secondary font-mono">
              Dokumen kurikulum ala Obsidian — klik topik untuk membuka catatan lengkap & kode praktikum
            </p>
          </div>

          <Link href="/dashboard/catatan/graph">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs font-mono w-fit cursor-pointer" title="Buka visualisasi graph interaktif materi">
              <Network className="w-3.5 h-3.5 text-brand-500" />
              <span>Peta Graph Pengetahuan</span>
            </Button>
          </Link>
        </div>

        {vaultNotes.length === 0 && (
          <div className="p-3 bg-amber-500/10 border-l-2 border-amber-500 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <span>
              Kategori ini belum punya catatan kurikulum yang tersimpan di database. Daftar di bawah
              merupakan contoh silabus bawaan — tambahkan catatan materi baru untuk melengkapi kurikulum.
            </span>
          </div>
        )}

        <div className="border border-border divide-y divide-border bg-[#FFFFFF] dark:bg-[#18181B] overflow-hidden shadow-2xs">
          {allTopicNotes.map((note, idx) => {
            if (note.isPlaceholder) {
              return (
                <div
                  key={note.id || idx}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none bg-surface/50"
                >
                  <div className="flex items-start gap-3 min-w-0 pr-2">
                    <span
                      className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 opacity-80"
                      style={{
                        backgroundColor: `${themeColor}15`,
                        color: themeColor,
                      }}
                    >
                      {idx + 1}
                    </span>

                    <div className="space-y-0.5 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-text-primary truncate">
                        {note.title}
                      </h3>
                      {note.description && (
                        <p className="text-xs text-text-secondary line-clamp-1">
                          {note.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <span className="text-xs font-mono text-text-tertiary italic flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      <span>Contoh silabus — catatan belum tersedia</span>
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={note.id || idx}
                href={`/dashboard/catatan/${note.slug}?fromCategory=${encodeURIComponent(categoryId)}`}
                className="p-3.5 sm:p-4 hover:bg-surface-secondary/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <span
                    className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5"
                    style={{
                      backgroundColor: `${themeColor}15`,
                      color: themeColor,
                    }}
                  >
                    {idx + 1}
                  </span>

                  <div className="space-y-0.5 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                      {note.title}
                    </h3>
                    {note.description && (
                      <p className="text-xs text-text-secondary line-clamp-1">
                        {note.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center text-xs font-mono text-brand-600 dark:text-brand-400 font-semibold group-hover:underline">
                  <span>Buka Catatan</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── 4. Modul & Proyek Terkait di Kategori Ini ─── */}
      <section className="space-y-3 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Modul & Proyek Belajar Terdaftar ({filteredModules.length})</span>
            </h3>
            <p className="text-xs text-text-secondary font-mono">
              Koleksi repositori modul silabus dan kode praktikum di kategori ini
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-secondary border border-border text-xs w-fit">
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
                    ? "bg-brand-600 text-white font-bold shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Input Search & Level */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] flex items-center border border-border bg-surface">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari modul atau project dalam topik ini..."
              className="w-full pl-9 pr-9 py-2 min-h-[36px] bg-transparent text-xs text-text-primary placeholder:text-text-tertiary focus:outline-hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 p-1 text-text-tertiary hover:text-text-primary cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 min-h-[36px] border border-border bg-surface text-xs font-mono text-text-primary cursor-pointer focus:outline-hidden"
            aria-label="Filter tingkat"
          >
            <option value="">Semua Tingkat</option>
            <option value="pemula">Pemula</option>
            <option value="menengah">Menengah</option>
            <option value="lanjutan">Lanjutan</option>
          </select>
        </div>

        {/* Modules List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
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
            title="Belum ada modul spesifik di topik ini"
            description="Tambahkan materi atau proyek belajar pertama untuk topik ini guna melengkapi kurikulum Anda."
            action={
              <Link href={`/dashboard/modul/baru?category=${encodeURIComponent(category?.id || categoryId)}`}>
                <Button size="sm" className="gap-1.5 text-xs font-semibold cursor-pointer">
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
