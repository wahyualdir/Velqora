"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  Calendar,
  Trash2,
  Bookmark,
  BookmarkCheck,
  FileEdit,
  Plus,
  Pencil,
  Copy,
  Check,
  BookOpen,
  Bot,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { ReadingContainer } from "@/components/ui/section";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { getMaterialById, deleteMaterial } from "@/actions/study-actions";
import { MATERIAL_TYPE_LABELS, MaterialType } from "@/types";
import { formatDate, formatFileSize, isPreviewable } from "@/lib/utils";
import { isBookmarked, toggleBookmark } from "@/lib/bookmark-service";
import {
  getNotesForTarget,
  saveStudyNote,
  deleteStudyNote,
  StudyNote,
} from "@/lib/notes-service";
import { toast } from "sonner";

export default function DetailMateriPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copiedNotes, setCopiedNotes] = useState(false);

  useEffect(() => {
    async function loadMaterial() {
      try {
        const data = await getMaterialById(id);
        setMaterial(data);
        if (data) {
          setBookmarked(isBookmarked(data.id));
        }
      } catch (err) {
        console.error("Failed to load material:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMaterial();
  }, [id]);

  const handleToggleBookmark = () => {
    if (!material) return;
    const isNow = toggleBookmark({
      id: material.id,
      type: "material",
      title: material.title,
      subtitle: material.description || material.subject || undefined,
      category: material.category?.name,
      url: `/dashboard/materi/${material.id}`,
      savedAt: new Date().toISOString(),
    });
    setBookmarked(isNow);
    toast.success(isNow ? "Materi disimpan ke Bookmark." : "Materi dihapus dari Bookmark.");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMaterial(id);
      toast.success("Materi berhasil dihapus.");
      router.push("/dashboard/materi");
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus materi.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCopyNotes = () => {
    if (material?.notes) {
      navigator.clipboard.writeText(material.notes);
      setCopiedNotes(true);
      toast.success("Catatan materi disalin ke clipboard!");
      setTimeout(() => setCopiedNotes(false), 2000);
    }
  };

  if (loading) {
    return (
      <ReadingContainer className="space-y-6 pb-16 pt-4">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <div className="space-y-3 p-6 rounded-xl border border-border bg-surface">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-8 w-3/4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </ReadingContainer>
    );
  }

  if (!material) {
    return (
      <ReadingContainer className="text-center py-20 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-border flex items-center justify-center mx-auto text-text-tertiary">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-text-primary font-display">
          Materi tidak ditemukan
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
          Materi mungkin telah dihapus atau tautan yang Anda akses tidak valid.
        </p>
        <Link href="/dashboard/materi" className="inline-block pt-2">
          <Button variant="outline" size="sm" className="text-xs">
            Kembali ke Daftar Materi
          </Button>
        </Link>
      </ReadingContainer>
    );
  }

  const canPreview = material.file_type ? isPreviewable(material.file_type) : false;
  const typeLabel =
    MATERIAL_TYPE_LABELS[material.type as MaterialType] || material.type || "Materi";

  return (
    <ReadingContainer className="space-y-6 sm:space-y-8 pb-20 pt-2">
      {/* ─── 1. Navigation & Quick Actions Toolbar ─── */}
      <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-4">
        <Link
          href="/dashboard/materi"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Semua Materi</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleBookmark}
            aria-pressed={bookmarked}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              bookmarked
                ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                : "border-border bg-surface hover:bg-surface-secondary text-text-tertiary hover:text-text-primary"
            }`}
            title={bookmarked ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
            aria-label={bookmarked ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
          >
            {bookmarked ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteModal(true)}
            className="gap-1.5 text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus</span>
          </Button>
        </div>
      </div>

      {/* ─── 2. Document Reading Header ─── */}
      <header className="p-5 sm:p-7 rounded-xl border border-border bg-surface shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">
            {material.category?.name || "Umum"}
          </Badge>

          <Badge variant="secondary">
            {typeLabel}
          </Badge>

          {material.status && (
            <Badge variant={material.status === "selesai" ? "success" : "warning"}>
              {material.status === "selesai" ? "Selesai" : "Draft"}
            </Badge>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight font-display leading-tight">
          {material.title}
        </h1>

        {material.subject && (
          <p className="text-xs sm:text-sm font-semibold text-brand-600 dark:text-brand-400">
            Mata Kuliah / Topik: {material.subject}
          </p>
        )}

        {material.description && (
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-border/70 pt-3">
            {material.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-[11px] font-mono text-text-tertiary pt-2 border-t border-border/50">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Dibuat: {formatDate(material.created_at)}
          </span>
        </div>
      </header>

      {/* ─── Interactive AI Learning Actions ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href={`/dashboard/ai-tutor?prompt=${encodeURIComponent(`Jelaskan ringkasan materi: ${material.title}`)}`}
          className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-surface hover:border-brand-500/40 hover:bg-surface-secondary/60 transition-all shadow-2xs group"
        >
          <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0 border border-brand-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-text-primary group-hover:text-brand-500 transition-colors">
              Diskusikan dengan AI Tutor
            </p>
            <p className="text-[11px] text-text-tertiary truncate">
              Minta ringkasan konsep atau penjelasan mendalam
            </p>
          </div>
        </Link>

        <Link
          href={`/dashboard/kuis-ai?topic=${encodeURIComponent(material.title)}`}
          className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-surface hover:border-brand-500/40 hover:bg-surface-secondary/60 transition-all shadow-2xs group"
        >
          <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0 border border-brand-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-text-primary group-hover:text-brand-500 transition-colors">
              Uji Pemahaman (Kuis AI)
            </p>
            <p className="text-[11px] text-text-tertiary truncate">
              Buat kuis latihan otomatis berbasis materi ini
            </p>
          </div>
        </Link>
      </div>

      {/* ─── 3. Document File Attachment & Reader Preview ─── */}
      {material.file_url && (
        <section className="p-5 sm:p-7 rounded-xl border border-border bg-surface shadow-2xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border/70 pb-3">
            <h2 className="text-sm font-bold text-text-primary tracking-tight uppercase font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-500" />
              <span>Berkas Lampiran Dokumen</span>
            </h2>

            <a href={material.file_url} target="_blank" rel="noopener noreferrer" download>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File</span>
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-surface-secondary/70 rounded-xl border border-border">
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-text-primary truncate">
                {material.file_name || "File Lampiran"}
              </p>
              {material.file_size && (
                <p className="text-[11px] font-mono text-text-tertiary">
                  {formatFileSize(material.file_size)}
                </p>
              )}
            </div>
          </div>

          {/* Inline Previewer for PDF & Images */}
          {canPreview && (
            <div className="mt-4 border border-border rounded-xl overflow-hidden bg-surface-secondary/40">
              {material.file_type?.startsWith("image/") ? (
                <img
                  src={material.file_url}
                  alt={material.title}
                  className="w-full max-h-[550px] object-contain mx-auto"
                />
              ) : (
                <iframe
                  src={material.file_url}
                  className="w-full h-[650px] border-0"
                  title={`Pratinjau Dokumen ${material.title}`}
                />
              )}
            </div>
          )}
        </section>
      )}

      {/* ─── 4. External Reference Link ─── */}
      {material.external_url && (
        <section className="p-4 sm:p-5 rounded-xl border border-border bg-surface shadow-2xs space-y-2">
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-brand-500" />
            <span>Tautan Referensi Eksternal</span>
          </h2>
          <a
            href={material.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 hover:underline break-all font-medium inline-flex items-center gap-1"
          >
            <span>{material.external_url}</span>
          </a>
        </section>
      )}

      {/* ─── 5. Text Notes / Syllabus Code Content ─── */}
      {material.notes && (
        <section className="p-5 sm:p-7 rounded-xl border border-border bg-surface shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <h2 className="text-sm font-bold text-text-primary tracking-tight uppercase font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-500" />
              <span>Deskripsi & Catatan Pembelajaran</span>
            </h2>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyNotes}
              className="gap-1.5 text-xs"
            >
              {copiedNotes ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Teks</span>
                </>
              )}
            </Button>
          </div>

          <div className="p-4 bg-surface-secondary/70 rounded-xl border border-border whitespace-pre-wrap font-mono text-xs sm:text-sm text-text-primary leading-relaxed">
            {material.notes}
          </div>
        </section>
      )}

      {/* ─── 6. Personal Study Notes Widget ─── */}
      <PersonalMaterialNotesWidget material={material} />

      {/* ─── Delete Confirmation Dialog ─── */}
      <ConfirmDialog
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Materi Ini?"
        message={`Apakah Anda yakin ingin menghapus materi "${material.title}"? Dokumen dan catatan terkait akan dihapus secara permanen.`}
        confirmText="Hapus Materi"
      />
    </ReadingContainer>
  );
}

function PersonalMaterialNotesWidget({ material }: { material: any }) {
  const [personalNotes, setPersonalNotes] = useState<StudyNote[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadNotes = () => {
    if (material?.id) {
      setPersonalNotes(getNotesForTarget(material.id));
    }
  };

  useEffect(() => {
    loadNotes();
    const handleUpdate = () => loadNotes();
    window.addEventListener("notes-updated", handleUpdate);
    return () => window.removeEventListener("notes-updated", handleUpdate);
  }, [material?.id]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setNoteTitle(`Catatan: ${material.title}`);
    setNoteContent("");
    setShowModal(true);
  };

  const handleOpenEdit = (note: StudyNote) => {
    setEditingId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
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
        id: editingId || undefined,
        title: noteTitle.trim(),
        content: noteContent.trim(),
        category: material.category?.name || "Materi",
        targetId: material.id,
        targetType: "material",
        targetTitle: material.title,
        targetUrl: `/dashboard/materi/${material.id}`,
        color: "blue",
      });
      toast.success(editingId ? "Catatan diperbarui." : "Catatan belajar disimpan!");
      setShowModal(false);
      loadNotes();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan catatan.");
    }
  };

  const handleDelete = (id: string, title: string) => {
    deleteStudyNote(id);
    setPersonalNotes((prev) => prev.filter((n) => n.id !== id));
    toast.success(`Catatan "${title}" dihapus.`);
  };

  return (
    <section className="p-5 sm:p-7 rounded-xl border border-border bg-surface shadow-2xs space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border/70 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 border border-brand-500/20 flex items-center justify-center">
            <FileEdit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary tracking-tight font-display">
              Catatan Belajar Pribadi
            </h3>
            <p className="text-xs text-text-secondary">
              Hanya dapat dilihat dan dikelola oleh akun Anda.
            </p>
          </div>
        </div>

        <Button size="sm" onClick={handleOpenCreate} className="gap-1.5 text-xs font-semibold">
          <Plus className="w-3.5 h-3.5" />
          <span>Tulis Catatan</span>
        </Button>
      </div>

      {personalNotes.length === 0 ? (
        <div className="p-5 rounded-xl bg-surface-secondary/50 border border-border/70 text-center space-y-2">
          <p className="text-xs text-text-secondary">
            Belum ada catatan pribadi untuk materi ini. Tulis ringkasan, rumus, atau poin penting Anda.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={handleOpenCreate}
            className="gap-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Catatan Pertama</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {personalNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-xl bg-surface-secondary/60 border border-border hover:border-brand-500/40 transition-colors space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                  {note.title}
                </h4>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(note)}
                    className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
                    title="Edit catatan"
                    aria-label="Edit catatan"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(note.id, note.title)}
                    className="p-1 rounded-lg text-text-tertiary hover:text-rose-500 hover:bg-surface transition-colors cursor-pointer"
                    title="Hapus catatan"
                    aria-label="Hapus catatan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-text-secondary whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>

              <div className="pt-1 text-[10.5px] font-mono text-text-tertiary">
                Disimpan pada:{" "}
                {new Date(note.updatedAt || note.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tulis/Edit Catatan */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Edit Catatan Pribadi" : "Tulis Catatan Pribadi"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Judul Catatan *"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            required
          />

          <Textarea
            label="Isi Catatan Belajar *"
            placeholder="Tulis ringkasan, rumus penting, pemahaman materi, atau petunjuk belajar..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows={7}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowModal(false)}
            >
              Batal
            </Button>
            <Button type="submit" size="sm">
              Simpan Catatan
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
