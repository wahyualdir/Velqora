"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Search,
  Trash2,
  ArrowRight,
  BookOpen,
  GraduationCap,
  FileText,
  BookmarkCheck,
  X,
  Plus,
  Copy,
  Download,
  Share2,
  Check,
  ExternalLink,
  Layers,
} from "lucide-react";
import { Card, Badge, Skeleton, EmptyState } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import {
  getBookmarks,
  removeBookmark,
  clearAllBookmarks,
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
    toast.success("Tautan modul/materi berhasil disalin!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportBookmarks = () => {
    if (bookmarks.length === 0) {
      toast.error("Belum ada bookmark untuk diekspor.");
      return;
    }

    const content = `# Daftar Bookmark Belajar Saya — Velqora\n\nTotal Tersimpan: ${bookmarks.length}\nTanggal Ekspor: ${new Date().toLocaleDateString("id-ID")}\n\n${bookmarks
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
    a.download = `bookmark-saya-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Daftar bookmark berhasil diekspor ke Markdown!");
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

  const getIcon = (type: string) => {
    switch (type) {
      case "project":
        return <span className="text-xs font-mono font-bold text-purple-400">{"</>"}</span>;
      case "module":
        return <Layers className="w-4 h-4 text-brand-400" />;
      case "material":
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case "file":
      default:
        return <FileText className="w-4 h-4 text-amber-400" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "project":
        return <Badge variant="purple">Project</Badge>;
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
    <div className="page-container space-y-6 sm:space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <PageHeader
        eyebrow="~/saved"
        technicalMark="< pinned // bookmarks />"
        title="Simpan untuk nanti"
        description="Materi, modul, dan referensi yang ingin kamu baca atau pelajari kembali."
        actions={
          <>
            {bookmarks.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportBookmarks}
                className="gap-1.5 text-xs sm:text-sm min-h-[40px] px-3.5"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor (.md)</span>
              </Button>
            )}
            <span className="text-xs sm:text-sm font-mono text-text-tertiary px-3.5 py-2 rounded-xl bg-surface-secondary border border-border min-h-[40px] inline-flex items-center">
              {bookmarks.length} Tersimpan
            </span>
          </>
        }
      />

      {/* Filter & Search Console */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-surface p-3.5 sm:p-4 rounded-2xl border border-border shadow-xs">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            placeholder="Cari materi atau modul tersimpan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            className="text-xs sm:text-sm"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-secondary border border-border overflow-x-auto text-xs sm:text-sm shrink-0">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              filterType === "all"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Semua ({bookmarks.length})
          </button>
          <button
            onClick={() => setFilterType("module")}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              filterType === "module"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Modul ({bookmarks.filter((b) => b.type === "module").length})
          </button>
          <button
            onClick={() => setFilterType("material")}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              filterType === "material"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Materi ({bookmarks.filter((b) => b.type === "material").length})
          </button>
          <button
            onClick={() => setFilterType("project")}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              filterType === "project"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Project ({bookmarks.filter((b) => b.type === "project").length})
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-12 h-12 text-text-tertiary" />}
          title={bookmarks.length === 0 ? "Belum ada materi tersimpan" : "Materi tidak ditemukan"}
          description={
            bookmarks.length === 0
              ? "Tandai modul atau materi pembelajaran untuk menyimpannya di sini."
              : "Tidak ada modul atau materi yang sesuai dengan pencarian Anda."
          }
          action={
            <Link href="/dashboard/modul">
              <Button size="sm" className="gap-2">
                <Layers className="w-4 h-4" />
                <span>Lihat Modul</span>
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="card-grid">
          {filteredBookmarks.map((item) => (
            <Card
              key={item.id}
              className="p-4 sm:p-4.5 lg:p-5 rounded-xl bg-surface border-border hover:border-brand-500/40 hover:bg-surface-secondary/60 transition-all duration-150 shadow-2xs flex flex-col justify-between space-y-3.5 group relative overflow-hidden"
            >
              <div className="space-y-3">
                {/* Header Badge & Action */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getTypeBadge(item.type)}
                    {item.category && (
                      <span className="text-[10px] font-medium text-text-secondary bg-surface-secondary border border-border px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.id, item.title)}
                    className="p-1.5 rounded-lg text-text-tertiary hover:text-rose-500 hover:bg-surface-secondary transition-colors cursor-pointer"
                    title="Hapus Bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-base font-bold text-text-primary group-hover:text-brand-400 transition-colors line-clamp-2 font-display">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs text-text-secondary line-clamp-2 mt-1 leading-relaxed">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-border/70 flex items-center justify-between">
                <span className="font-mono text-[10px] text-text-tertiary">
                  {item.savedAt
                    ? new Date(item.savedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Tersimpan"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(item, e)}
                    className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                    title="Salin Tautan"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <Link href={item.url || `/dashboard/modul?module=${item.id}`}>
                    <Button size="sm" variant="outline" className="gap-1 text-xs py-1 px-2.5 h-8">
                      <span>Buka</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
