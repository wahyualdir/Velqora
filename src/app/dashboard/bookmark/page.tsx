"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Search,
  Trash2,
  ArrowRight,
  BookOpen,
  FileText,
  Copy,
  Download,
  Check,
  Layers,
} from "lucide-react";
import { Badge, Skeleton, EmptyState } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { PageContainer, PageSection } from "@/components/ui/section";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import {
  getBookmarks,
  removeBookmark,
  BookmarkItem,
} from "@/lib/bookmark-service";
import { toast } from "sonner";

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "module" | "project" | "material" | "file">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    try {
      const items = getBookmarks();
      setBookmarks(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener("bookmarks-updated", handleUpdate);
    return () => window.removeEventListener("bookmarks-updated", handleUpdate);
  }, []);

  const handleRemove = (id: string, title: string) => {
    removeBookmark(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    toast.success(`Bookmark "${title}" dihapus.`);
  };

  const handleCopyLink = (item: BookmarkItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = item.url ? `${window.location.origin}${item.url}` : window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedId(item.id);
    toast.success("Tautan materi berhasil disalin!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportBookmarks = () => {
    if (bookmarks.length === 0) {
      toast.error("Belum ada bookmark untuk diekspor.");
      return;
    }

    const content = `# Daftar Bookmark Belajar — Velqora\n\nTotal Tersimpan: ${bookmarks.length}\nTanggal Ekspor: ${new Date().toLocaleDateString("id-ID")}\n\n${bookmarks
      .map(
        (b, i) =>
          `${i + 1}. **[${b.title}](${b.url || "#"})** (${b.type.toUpperCase()})\n   - Kategori: ${b.category || "Umum"}\n   - Disimpan pada: ${new Date(
            b.savedAt || ""
          ).toLocaleDateString("id-ID")}\n`
      )
      .join("\n")}`;

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookmark-velqora-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Daftar bookmark berhasil diekspor ke format Markdown!");
  };

  const filteredBookmarks = bookmarks.filter((item) => {
    const matchType = filterType === "all" || item.type === filterType;
    const matchQuery =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(search.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchQuery;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "project":
        return <Badge variant="purple">Proyek</Badge>;
      case "module":
        return <Badge variant="brand">Modul</Badge>;
      case "material":
        return <Badge variant="success">Materi</Badge>;
      case "file":
      default:
        return <Badge variant="warning">Berkas</Badge>;
    }
  };

  return (
    <PageContainer className="space-y-6 pb-14">
      {/* 1. Header */}
      <PageHeader
        eyebrow="Tersimpan"
        title="Materi Tersimpan"
        description="Akses cepat ke materi, modul, dan referensi akademik yang Anda simpan untuk dipelajari kembali."
        actions={
          <div className="flex items-center gap-2">
            {bookmarks.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportBookmarks}
                leftIcon={<Download className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Ekspor (.md)
              </Button>
            )}
            <span className="text-xs font-mono text-text-tertiary px-3 py-1.5 rounded-lg bg-surface border border-border min-h-[36px] inline-flex items-center shadow-2xs">
              {bookmarks.length} Tersimpan
            </span>
          </div>
        }
      />

      {/* 2. Sub-Navigation Tabs */}
      <SubNavTabs category="documents" />

      {/* 3. Filter & Search Toolbar */}
      <PageSection>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-3.5 rounded-xl border border-border shadow-2xs">
          {/* Search Input */}
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Cari materi atau modul tersimpan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startIcon={<Search className="w-3.5 h-3.5 text-text-tertiary" />}
              onClear={search ? () => setSearch("") : undefined}
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-surface-secondary border border-border overflow-x-auto text-xs shrink-0">
            {[
              { id: "all", label: `Semua (${bookmarks.length})` },
              { id: "module", label: `Modul (${bookmarks.filter((b) => b.type === "module").length})` },
              { id: "material", label: `Materi (${bookmarks.filter((b) => b.type === "material").length})` },
              { id: "project", label: `Proyek (${bookmarks.filter((b) => b.type === "project").length})` },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterType(f.id as any)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  filterType === f.id
                    ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/20 shadow-2xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </PageSection>

      {/* 4. List-First Bookmark Rows */}
      <PageSection>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="w-10 h-10 text-text-tertiary" />}
            title={bookmarks.length === 0 ? "Belum ada bookmark tersimpan" : "Materi tidak ditemukan"}
            description={
              bookmarks.length === 0
                ? "Tandai modul atau materi pembelajaran saat membaca untuk menyimpannya di sini."
                : "Tidak ada bookmark yang sesuai dengan kata kunci pencarian Anda."
            }
            action={
              <Link href="/dashboard/modul">
                <Button size="sm" leftIcon={<Layers className="w-4 h-4" />}>
                  Jelajahi Modul
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-2.5">
            {filteredBookmarks.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-surface hover:border-brand-500/40 hover:bg-surface-secondary/40 transition-all shadow-2xs"
              >
                {/* Left Meta & Title */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-border flex items-center justify-center shrink-0 mt-0.5 text-text-secondary">
                    {item.type === "material" ? (
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                    ) : item.type === "module" ? (
                      <Layers className="w-4 h-4 text-brand-500" />
                    ) : (
                      <FileText className="w-4 h-4 text-amber-500" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getTypeBadge(item.type)}
                      {item.category && (
                        <span className="text-[11px] font-mono font-medium text-text-tertiary bg-surface-secondary border border-border px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-text-tertiary">
                        {item.savedAt
                          ? new Date(item.savedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Tersimpan"}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {item.title}
                    </h3>

                    {item.subtitle && (
                      <p className="text-xs text-text-secondary line-clamp-1 leading-relaxed">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/70">
                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(item, e)}
                    className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
                    title="Salin Tautan"
                    aria-label="Salin tautan materi"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.id, item.title)}
                    className="p-2 rounded-lg text-text-tertiary hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Hapus dari Bookmark"
                    aria-label={`Hapus bookmark ${item.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link href={item.url || `/dashboard/modul?module=${item.id}`}>
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8 px-3">
                      <span>Buka</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageSection>
    </PageContainer>
  );
}
