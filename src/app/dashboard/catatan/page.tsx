"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileEdit,
  Plus,
  Search,
  Trash2,
  Pencil,
  BookOpen,
  Tag,
  Pin,
  Copy,
  Download,
  Check,
  ExternalLink,
  Layers,
} from "lucide-react";
import { Card, Skeleton, EmptyState, Modal } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/ui/page-header";
import { PageContainer, PageSection } from "@/components/ui/section";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import {
  getStudyNotes,
  saveStudyNote,
  deleteStudyNote,
  togglePinNote,
  StudyNote,
  NoteColor,
} from "@/lib/notes-service";
import { toast } from "sonner";

const COLOR_CONFIG: Record<
  NoteColor,
  { bg: string; border: string; badge: string; dot: string; accent: string; label: string }
> = {
  blue: {
    bg: "bg-surface hover:bg-surface-secondary/60",
    border: "border-border hover:border-brand-500/40",
    badge: "bg-brand-500/10 text-brand-400 border-brand-500/25",
    dot: "bg-brand-400",
    accent: "border-l-4 border-l-brand-500",
    label: "Biru (Utama)",
  },
  emerald: {
    bg: "bg-surface hover:bg-surface-secondary/60",
    border: "border-border hover:border-emerald-500/40",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    dot: "bg-emerald-400",
    accent: "border-l-4 border-l-emerald-500",
    label: "Hijau (Konsep)",
  },
  amber: {
    bg: "bg-surface hover:bg-surface-secondary/60",
    border: "border-border hover:border-amber-500/40",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
    dot: "bg-amber-400",
    accent: "border-l-4 border-l-amber-500",
    label: "Kuning (Penting)",
  },
  purple: {
    bg: "bg-surface hover:bg-surface-secondary/60",
    border: "border-border hover:border-purple-500/40",
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
    dot: "bg-purple-400",
    accent: "border-l-4 border-l-purple-500",
    label: "Ungu (Kode/Teknis)",
  },
  rose: {
    bg: "bg-surface hover:bg-surface-secondary/60",
    border: "border-border hover:border-rose-500/40",
    badge: "bg-rose-500/10 text-red-600 dark:text-red-400 border-rose-500/25",
    dot: "bg-rose-400",
    accent: "border-l-4 border-l-rose-500",
    label: "Merah (Ujian/Tenggat)",
  },
  slate: {
    bg: "bg-surface hover:bg-surface-secondary/60",
    border: "border-border hover:border-border-hover",
    badge: "bg-surface-secondary text-text-secondary border-border",
    dot: "bg-slate-400",
    accent: "border-l-4 border-l-slate-400",
    label: "Netral",
  },
};

export default function CatatanPage() {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "pinned" | "module" | "material">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteCategory, setNoteCategory] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteColor, setNoteColor] = useState<NoteColor>("blue");
  const [notePinned, setNotePinned] = useState(false);

  const loadData = () => {
    setLoading(true);
    try {
      const items = getStudyNotes();
      setNotes(items);
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

    window.addEventListener("notes-updated", handleUpdate);
    return () => window.removeEventListener("notes-updated", handleUpdate);
  }, []);

  const handleOpenCreate = () => {
    setEditingNoteId(null);
    setNoteTitle("");
    setNoteCategory("");
    setNoteContent("");
    setNoteColor("blue");
    setNotePinned(false);
    setShowModal(true);
  };

  const handleOpenEdit = (note: StudyNote) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteCategory(note.category || "");
    setNoteContent(note.content);
    setNoteColor(note.color || "blue");
    setNotePinned(!!note.pinned);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) {
      toast.error("Judul dan isi catatan tidak boleh kosong.");
      return;
    }

    try {
      saveStudyNote({
        id: editingNoteId || undefined,
        title: noteTitle.trim(),
        category: noteCategory.trim() || undefined,
        content: noteContent.trim(),
        color: noteColor,
        pinned: notePinned,
      });
      toast.success(editingNoteId ? "Catatan diperbarui." : "Catatan baru disimpan.");
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan catatan.");
    }
  };

  const handleDelete = (id: string, title: string) => {
    deleteStudyNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    toast.success(`Catatan "${title}" dihapus.`);
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isPinned = togglePinNote(id);
    toast.success(isPinned ? "Catatan disematkan ke atas." : "Semat catatan dilepas.");
    loadData();
  };

  const handleCopyNote = (note: StudyNote, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `# ${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(note.id);
    toast.success("Isi catatan disalin ke papan klip!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadNote = (note: StudyNote, e: React.MouseEvent) => {
    e.stopPropagation();
    const content = `# ${note.title}\nKategori: ${note.category || "Umum"}\nTanggal: ${new Date(
      note.updatedAt || note.createdAt
    ).toLocaleDateString("id-ID")}\n\n${note.content}`;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-catatan.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Catatan diunduh dalam format Markdown!");
  };

  const filteredNotes = notes.filter((item) => {
    const matchTab =
      selectedTab === "all" ||
      (selectedTab === "pinned" && item.pinned) ||
      (selectedTab === "module" && item.targetType === "module") ||
      (selectedTab === "material" && item.targetType === "material");

    const matchQuery =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase())) ||
      (item.targetTitle && item.targetTitle.toLowerCase().includes(search.toLowerCase()));

    return matchTab && matchQuery;
  });

  const pinnedCount = notes.filter((n) => n.pinned).length;

  return (
    <PageContainer className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <PageHeader
        eyebrow="Catatan"
        title="Catatan Belajar"
        description="Simpan ringkasan konsep, rumus, dan temuan penting yang kamu catat saat belajar."
        actions={
          <Button onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
            Tambah Catatan
          </Button>
        }
      />

      {/* Sub-Navigation Tabs */}
      <SubNavTabs category="documents" />

      {/* Filter & Search Console */}
      <PageSection>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-surface p-3.5 sm:p-4 rounded-xl border border-border">
          {/* Search Input */}
          <div className="flex-1">
            <Input
              placeholder="Cari catatan, topik, materi, atau kata kunci..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startIcon={<Search className="w-3.5 h-3.5 text-text-tertiary" />}
              onClear={search ? () => setSearch("") : undefined}
            />
          </div>

          {/* Category / Type Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-surface-secondary border border-border overflow-x-auto scrollbar-none touch-pan-x max-w-full text-xs sm:text-sm shrink-0">
            <button
              type="button"
              onClick={() => setSelectedTab("all")}
              className={`px-3.5 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 ${
                selectedTab === "all"
                  ? "bg-brand-600 text-white font-semibold shadow-2xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Semua ({notes.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("pinned")}
              className={`px-3.5 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 ${
                selectedTab === "pinned"
                  ? "bg-brand-600 text-white font-semibold shadow-2xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Pin className="w-3.5 h-3.5" />
              <span>Disematkan ({pinnedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("module")}
              className={`px-3.5 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 ${
                selectedTab === "module"
                  ? "bg-brand-600 text-white font-semibold shadow-2xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Modul
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("material")}
              className={`px-3.5 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 ${
                selectedTab === "material"
                  ? "bg-brand-600 text-white font-semibold shadow-2xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Materi
            </button>
          </div>
        </div>
      </PageSection>

      {/* Notes Grid */}
      <PageSection>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <EmptyState
            icon={<FileEdit className="w-12 h-12 text-text-tertiary" />}
            title={notes.length === 0 ? "Belum ada catatan belajar" : "Catatan tidak ditemukan"}
            description={
              notes.length === 0
                ? "Tulis catatan belajar pertama Anda untuk mendokumentasikan pemahaman konsep, rumus, dan kode penting."
                : "Tidak ada catatan yang sesuai dengan pencarian atau filter yang dipilih."
            }
            action={
              <Button size="sm" onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
                Tambah Catatan
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 auto-rows-fr">
            {filteredNotes.map((note) => {
              const colorCfg = COLOR_CONFIG[note.color || "blue"] || COLOR_CONFIG.blue;

              return (
                <Card
                  key={note.id}
                  onClick={() => handleOpenEdit(note)}
                  className={`p-4 sm:p-5 rounded-xl border transition-all duration-150 shadow-2xs hover:shadow-xs flex flex-col justify-between space-y-3 cursor-pointer group relative overflow-hidden h-full ${colorCfg.bg} ${colorCfg.border} ${colorCfg.accent}`}
                >
                  {/* Pinned Marker Indicator */}
                  {note.pinned && (
                    <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center">
                      <div className="absolute top-2.5 right-2.5 p-1 rounded-md bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/25">
                        <Pin className="w-3 h-3 fill-current" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2.5">
                    {/* Category & Target Association Tag */}
                    <div className="flex items-center gap-1.5 flex-wrap pr-8">
                      {note.category && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${colorCfg.badge}`}>
                          <Tag className="w-2.5 h-2.5" />
                          <span>{note.category}</span>
                        </span>
                      )}

                      {note.targetTitle && (
                        <Link
                          href={note.targetUrl || "#"}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface-secondary text-text-secondary border border-border hover:text-brand-400 hover:border-brand-500/40 transition-colors"
                        >
                          {note.targetType === "module" ? (
                            <Layers className="w-2.5 h-2.5 text-brand-400" />
                          ) : (
                            <BookOpen className="w-2.5 h-2.5 text-emerald-400" />
                          )}
                          <span className="truncate max-w-[140px]">{note.targetTitle}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </Link>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-bold text-text-primary line-clamp-2 font-display group-hover:text-brand-400 transition-colors">
                      {note.title}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-5 whitespace-pre-wrap font-sans">
                      {note.content}
                    </p>
                  </div>

                  {/* Footer Action Bar */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-tertiary">
                    <span className="font-mono text-[11px]">
                      {new Date(note.updatedAt || note.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => handleTogglePin(note.id, e)}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 ${
                          note.pinned
                            ? "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                            : "text-text-tertiary hover:text-amber-400 hover:bg-surface-secondary"
                        }`}
                        title={note.pinned ? "Lepas Sematan" : "Sematkan Catatan"}
                        aria-label={note.pinned ? "Lepas sematan catatan" : "Sematkan catatan"}
                      >
                        <Pin className={`w-3.5 h-3.5 ${note.pinned ? "fill-amber-400" : ""}`} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleCopyNote(note, e)}
                        className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
                        title="Salin Isi Catatan"
                        aria-label="Salin isi catatan"
                      >
                        {copiedId === note.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDownloadNote(note, e)}
                        className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
                        title="Unduh (.md)"
                        aria-label="Unduh catatan format Markdown"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(note);
                        }}
                        className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
                        title="Edit Catatan"
                        aria-label="Edit catatan"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(note.id, note.title);
                        }}
                        className="p-1.5 rounded-md text-text-tertiary hover:text-red-400 hover:bg-surface-secondary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
                        title="Hapus Catatan"
                        aria-label="Hapus catatan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </PageSection>

      {/* Modal Tulis / Edit Catatan */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        size="lg"
        title={editingNoteId ? "Edit Catatan Belajar" : "Tulis Catatan Baru"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Judul Catatan *"
            placeholder="Contoh: Konsep OOP di Python, Rumus Integral..."
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Kategori / Topik (Opsional)"
              placeholder="Contoh: Python, Algoritma, Database..."
              value={noteCategory}
              onChange={(e) => setNoteCategory(e.target.value)}
            />

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1.5">
                Warna Catatan
              </label>
              <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-xl bg-surface-secondary border border-border flex-wrap">
                {(Object.keys(COLOR_CONFIG) as NoteColor[]).map((colorKey) => (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => setNoteColor(colorKey)}
                    aria-label={`Pilih warna ${COLOR_CONFIG[colorKey].label}`}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      COLOR_CONFIG[colorKey].dot
                    } ${
                      noteColor === colorKey
                        ? "ring-2 ring-brand-500 scale-110 shadow-sm"
                        : "opacity-60 hover:opacity-100 hover:scale-105"
                    }`}
                    title={COLOR_CONFIG[colorKey].label}
                  >
                    {noteColor === colorKey && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-text-primary">
                Isi Catatan Belajar *
              </label>
              <span className="text-[10px] font-mono text-text-tertiary">
                {noteContent.length} karakter • {noteContent.trim() ? noteContent.trim().split(/\s+/).length : 0} kata
              </span>
            </div>
            <Textarea
              placeholder="Tulis ringkasan, instruksi, rumus, atau catatan kode di sini..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={7}
              required
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
            <Checkbox
              checked={notePinned}
              onChange={(e) => setNotePinned(e.target.checked)}
              label="Sematkan catatan ini di urutan paling atas"
            />

            <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setShowModal(false)}
              >
                Batal
              </Button>
              <Button type="submit" size="sm" className="w-full sm:w-auto">
                Simpan Catatan
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
