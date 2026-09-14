"use client";

import React, { useEffect, useState, use, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Plus,
  Upload,
  Network,
  AlertCircle,
  RefreshCw,
  BookOpen,
  LayoutGrid,
} from "lucide-react";
import { PageContainer } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { getCategoryDetails, getModules, deleteModule } from "@/actions/study-actions";
import { getNotesByCategory, type NoteEntity } from "@/actions/study/notes";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser, slugify, cleanMarkdownExcerpt } from "@/lib/utils";
import { isBookmarked, toggleBookmark } from "@/lib/bookmark-service";
import { NotebookOutline } from "@/components/modul/notebook-outline";
import { DocReaderLayout, DocSectionItem } from "@/components/modul/doc-reader-layout";
import { ModuleFilePreviewerModal } from "@/components/modul/module-file-previewer-modal";
import { BulkImportModal } from "@/components/notes/bulk-import-modal";
import { ModuleDriveFile } from "@/types/module-drive";
import { SYSTEM_PRIMARY_CATEGORIES } from "@/lib/constants";
import { getCategoryIconComponent } from "@/components/modul/category-icon";
import { getDefaultAiSections } from "@/lib/fallback-syllabus-defaults";
import {
  SCIKIT_LEARN_USER_GUIDE_SECTIONS,
  getAllFlatScikitLearnSections,
} from "@/lib/scikit-learn-curriculum";
import { enrichCurriculumToDocSections } from "@/lib/universal-curriculum-enricher";
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
  const [contentMode, setContentMode] = useState<"all" | "theory" | "module">("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [previewFile, setPreviewFile] = useState<ModuleDriveFile | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [bookmarkMap, setBookmarkMap] = useState<{ [id: string]: boolean }>({});
  const [vaultNotes, setVaultNotes] = useState<NoteEntity[]>([]);

  // Tampilan: "doc" (Default ala Scikit-Learn Documentation Reader) vs "grid"
  const [viewLayout, setViewLayout] = useState<"doc" | "grid">("doc");
  const [activeSectionId, setActiveSectionId] = useState<string>("");

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

  // Fetch Category & its Modules & its Notes concurrently
  const loadData = useCallback(async () => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    try {
      const decodedId = decodeURIComponent(categoryId).trim();

      // Parallelize: category details, scoped modules, and notes
      const [catDataRes, allModulesRes, notesRes] = await Promise.allSettled([
        getCategoryDetails(decodedId),
        getModules(undefined, decodedId),
        getNotesByCategory(decodedId),
      ]);

      const catData = catDataRes.status === "fulfilled" ? catDataRes.value : null;
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

      const allModules = allModulesRes.status === "fulfilled" && Array.isArray(allModulesRes.value) ? allModulesRes.value : [];
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

      // Handle Notes
      let initialNotes = notesRes.status === "fulfilled" && Array.isArray(notesRes.value) ? notesRes.value : [];
      if (initialNotes.length === 0 && resolvedCat?.id && resolvedCat.id !== decodedId) {
        try {
          const secondaryNotes = await getNotesByCategory(resolvedCat.id);
          if (secondaryNotes && secondaryNotes.length > 0) {
            initialNotes = secondaryNotes;
          }
        } catch {}
      }
      setVaultNotes(initialNotes);
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

  // Handle Filter Tag synchronization
  const handleFilterTagChange = (tag: string) => {
    setFilterTag(tag);
    if (tag === "all") {
      setContentMode("all");
      setLevelFilter("");
    } else if (tag === "theory") {
      setContentMode("theory");
      setLevelFilter("");
    } else if (tag === "module") {
      setContentMode("module");
      setLevelFilter("");
    } else if (["pemula", "menengah", "lanjutan"].includes(tag)) {
      setContentMode("all");
      setLevelFilter(tag);
    }
  };

  // Kumpulan Topik Materi (Notes Kurikulum Obsidian)
  const allTopicNotes = useMemo(() => {
    const catName = category?.name || decodeURIComponent(categoryId);
    const norm = catName.toLowerCase().trim();

    // Khusus Machine Learning: gunakan materi Scikit-Learn 1.9 lengkap
    if (norm.includes("machine learning") || norm.includes("pembelajaran mesin") || norm.includes("scikit")) {
      const scikitFlat = getAllFlatScikitLearnSections();
      return scikitFlat.map((sec) => ({
        id: sec.id,
        slug: sec.slug || slugify(sec.title),
        title: sec.title,
        description: sec.description || cleanMarkdownExcerpt(sec.content_markdown || "", sec.title, 160),
        isPlaceholder: false,
        content_markdown: sec.content_markdown || null,
      }));
    }

    if (vaultNotes && vaultNotes.length > 0) {
      return vaultNotes.map((n) => ({
        id: n.id,
        slug: n.slug,
        title: n.title,
        description: cleanMarkdownExcerpt(n.content_markdown, n.title, 160),
        isPlaceholder: false,
        content_markdown: n.content_markdown,
      }));
    }

    const defaults = getDefaultAiSections(catName);
    return defaults.map((sec) => ({
      id: sec.id,
      slug: slugify(sec.title),
      title: sec.title,
      description: sec.description || "",
      isPlaceholder: true,
      content_markdown: null,
    }));
  }, [vaultNotes, category, categoryId]);

  // Ekstraksi subbab nyata langsung dari markdown catatan kurikulum
  const extractSubsectionsFromNote = useCallback((markdown: string, parentId: string, parentTitle: string, chapterNum: number): DocSectionItem[] => {
    if (!markdown) return [];
    const lines = markdown.split("\n");
    const subItems: DocSectionItem[] = [];
    const seenAnchors = new Set<string>();

    for (const line of lines) {
      const match = line.match(/^##\s+(.+)$/);
      if (match) {
        let rawText = match[1].trim();
        rawText = rawText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
        rawText = rawText.replace(/[*_`]/g, "").trim();

        // Abaikan heading latihan soal atau kunci jawaban di sidebar agar hierarki tetap rapi
        const lower = rawText.toLowerCase();
        if (
          rawText.length > 2 &&
          !lower.includes("latihan soal") &&
          !lower.includes("kunci jawaban") &&
          !lower.includes("tantangan")
        ) {
          const anchor = slugify(rawText);
          if (!seenAnchors.has(anchor)) {
            seenAnchors.add(anchor);
            subItems.push({
              id: `${parentId}#${anchor}`,
              slug: anchor,
              title: rawText,
              parentTitle,
              chapterNumber: chapterNum,
              content_markdown: markdown,
            });
          }
        }
      }
    }
    return subItems;
  }, []);

  // Daftar Seksi untuk Documentation Reader View ala Scikit-Learn (Lengkap dengan Subbab)
  const docSections = useMemo<DocSectionItem[]>(() => {
    const catName = category?.name || decodeURIComponent(categoryId);
    const norm = catName.toLowerCase().trim();

    // Khusus Machine Learning: sajikan seluruh Bab dan Subbab hierarkis resmi Scikit-Learn 1.9
    if (norm.includes("machine learning") || norm.includes("pembelajaran mesin") || norm.includes("scikit")) {
      return SCIKIT_LEARN_USER_GUIDE_SECTIONS;
    }

    // Jika kategori memiliki catatan kurikulum autentik di database (seperti Data Analyst, NLP, dll.)
    // Sajikan catatan asli tersebut secara langsung tanpa penyeragaman template sintetis
    if (vaultNotes && vaultNotes.length > 0) {
      return vaultNotes.map((n, idx) => {
        const orderIndex = n.order_index ?? idx + 1;
        const realSubsections = extractSubsectionsFromNote(
          n.content_markdown || "",
          n.id,
          n.title,
          orderIndex
        );

        return {
          id: n.id,
          slug: n.slug,
          title: n.title,
          orderIndex,
          description: cleanMarkdownExcerpt(n.content_markdown, n.title, 160),
          content_markdown: n.content_markdown,
          subsections: realSubsections,
          codeSnippets: [],
        };
      });
    }

    const defaults = getDefaultAiSections(catName);
    return enrichCurriculumToDocSections(defaults, catName);
  }, [vaultNotes, category, categoryId, extractSubsectionsFromNote]);

  // Filtered topics based on search & contentMode
  const filteredTopicNotes = useMemo(() => {
    if (contentMode === "module" || levelFilter) {
      return [];
    }

    let list = [...allTopicNotes];
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allTopicNotes, contentMode, levelFilter, search]);

  // Filtered module list
  const filteredModules = useMemo(() => {
    if (contentMode === "theory") {
      return [];
    }

    let list = [...modules];

    if (contentMode === "module") {
      list = list.filter((m) => m.kind !== "project");
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

  // ─── Tampilan 1: Mode Dokumentasi Resmi ala Scikit-Learn (Full-Height Immersive) ───
  if (viewLayout === "doc") {
    return (
      <div className="w-full h-screen overflow-hidden flex flex-col">
        <DocReaderLayout
          categoryName={category?.name || decodeURIComponent(categoryId)}
          categoryId={categoryId}
          themeColor={themeColor}
          categoryIcon={category?.icon || "machine_learning"}
          sections={docSections}
          activeSectionId={activeSectionId}
          onSelectSection={(id) => setActiveSectionId(id)}
          onToggleViewMode={() => setViewLayout("grid")}
          viewMode="doc"
        />

        {previewFile && (
          <ModuleFilePreviewerModal
            isOpen={Boolean(previewFile)}
            onClose={() => setPreviewFile(null)}
            file={previewFile}
          />
        )}

        <BulkImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => loadData()}
        />
      </div>
    );
  }

  // ─── Tampilan 2: Mode Ringkasan Kartu (Grid View) ───
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

      {/* ─── 2. Header Kategori Ringkas ─── */}
      <header className="p-4 sm:p-5 vt-window bg-[#FFFFFF] dark:bg-[#18181B] border border-border space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border mt-0.5"
              style={{
                backgroundColor: `${themeColor}15`,
                borderColor: `${themeColor}35`,
                color: themeColor,
              }}
            >
              <CategoryIcon className="w-5 h-5" />
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-text-tertiary">
                <span className="uppercase tracking-wider font-semibold text-text-secondary">
                  Kurikulum AI
                </span>
                <span>•</span>
                <span>{allTopicNotes.length} Topik Silabus</span>
                <span>•</span>
                <span>{modules.length} Modul Terkait</span>
              </div>

              <h1 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight font-display">
                {category?.name || decodeURIComponent(categoryId)}
              </h1>

              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl">
                {category?.description ||
                  `Materi dan silabus kurikulum Kecerdasan Buatan untuk topik ${category?.name || decodeURIComponent(categoryId)}, mencakup dasar teori, pemodelan matematis, dan implementasi kode.`}
              </p>
            </div>
          </div>

          {/* Action buttons with view mode switcher */}
          <div className="flex items-center gap-2 shrink-0 self-start flex-wrap">
            {/* View Mode Switcher: Doc Reader vs Grid */}
            <div className="flex items-center gap-1 p-1 bg-surface-secondary rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setViewLayout("doc")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer text-text-secondary hover:text-text-primary hover:bg-surface/50"
                title="Tampilan Pembaca Dokumentasi ala Scikit-Learn"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Dokumentasi</span>
              </button>

              <button
                type="button"
                onClick={() => setViewLayout("grid")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer bg-brand-600 text-white shadow-2xs font-bold"
                title="Tampilan Ringkasan Grid Kartu"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid Kartu</span>
              </button>
            </div>

            <Link href="/dashboard/catatan/graph">
              <button
                type="button"
                className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
                title="Peta Graph Pengetahuan"
                aria-label="Peta Graph Pengetahuan"
              >
                <Network className="w-4 h-4" />
              </button>
            </Link>

            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => setShowImportModal(true)}
                  className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
                  title="Import Massal Catatan (Admin)"
                  aria-label="Import Massal Catatan"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <Link href={`/dashboard/modul/baru?category=${encodeURIComponent(category?.id || categoryId)}`}>
                  <button
                    type="button"
                    className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
                    title="Tambah Modul Baru (Khusus Admin)"
                    aria-label="Tambah Modul Baru"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </Link>
              </>
            )}
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

      {/* ─── 3. Grid View Content ─── */}
      <NotebookOutline
        topics={filteredTopicNotes}
        modules={filteredModules}
        categoryId={categoryId}
        categoryName={category?.name || decodeURIComponent(categoryId)}
        isAdmin={isAdmin}
        currentUserId={currentUserId}
        bookmarkMap={bookmarkMap}
        onToggleBookmark={handleToggleBookmark}
        onEditModule={(item) => router.push(`/dashboard/modul/edit/${item.id}`)}
        onDeleteModule={handleDeleteModule}
        onFilePreview={(file) => setPreviewFile(file)}
        search={search}
        onSearchChange={setSearch}
        filterTag={filterTag}
        onFilterTagChange={handleFilterTagChange}
        loading={loading}
      />

      {/* ─── 4. File Previewer Modal ─── */}
      {previewFile && (
        <ModuleFilePreviewerModal
          isOpen={Boolean(previewFile)}
          onClose={() => setPreviewFile(null)}
          file={previewFile}
        />
      )}

      {/* ─── 5. Bulk Import Modal ─── */}
      <BulkImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => loadData()}
      />
    </PageContainer>
  );
}
