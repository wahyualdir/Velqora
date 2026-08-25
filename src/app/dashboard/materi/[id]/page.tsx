"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { Card, Badge, Skeleton, ConfirmDialog, Modal } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
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
import { useRouter } from "next/navigation";

export default function DetailMateriPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    async function loadMaterial() {
      try {
        const data = await getMaterialById(id);
        setMaterial(data);
        if (data) {
          setBookmarked(isBookmarked(data.id));
        }
      } catch (err) {
        console.error(err);
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
    toast.success(isNow ? "Materi disimpan ke Bookmark Saya." : "Materi dihapus dari Bookmark.");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMaterial(id);
      toast.success("Materi berhasil dihapus");
      router.push("/dashboard/materi");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-text-primary">Materi tidak ditemukan</h2>
        <p className="text-sm text-text-secondary mt-2">Materi mungkin telah dihapus atau ID tidak valid.</p>
        <Link href="/dashboard/materi" className="mt-4 inline-block">
          <Button variant="outline">Kembali ke Daftar Materi</Button>
        </Link>
      </div>
    );
  }

  const canPreview = material.file_type ? isPreviewable(material.file_type) : false;

  return (
    <div className="max-w-[1000px] mx-auto space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Back & Actions */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/materi">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleBookmark}
            className="p-2 rounded-xl border border-border text-text-secondary hover:text-brand-500 hover:bg-surface-secondary transition-colors cursor-pointer"
            title="Bookmark Materi"
          >
            {bookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-brand-500 fill-brand-500/20" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteModal(true)}
          >
            <Trash2 className="w-4 h-4" /> Hapus
          </Button>
        </div>
      </div>

      {/* Main Info Header */}
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info">
            {MATERIAL_TYPE_LABELS[material.type as MaterialType] || material.type}
          </Badge>
          {material.category && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-md"
              style={{
                backgroundColor: `${material.category.color}15`,
                color: material.category.color,
              }}
            >
              {material.category.name}
            </span>
          )}
          <Badge variant={material.status === "selesai" ? "success" : "warning"}>
            {material.status}
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          {material.title}
        </h1>

        {material.subject && (
          <p className="text-sm text-brand-600 font-medium">
            Mata Kuliah: {material.subject}
          </p>
        )}

        {material.description && (
          <p className="text-sm text-text-secondary leading-relaxed border-t border-border pt-3">
            {material.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-text-tertiary pt-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Dibuat: {formatDate(material.created_at)}
          </span>
        </div>
      </Card>

      {/* Attachments & Preview */}
      {material.file_url && (
        <Card className="space-y-4">
          <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" />
            Lampiran File
          </h3>

          <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-xl border border-border">
            <div className="space-y-1">
              <p className="text-sm font-medium text-text-primary">{material.file_name || "File Lampiran"}</p>
              {material.file_size && (
                <p className="text-xs text-text-tertiary">{formatFileSize(material.file_size)}</p>
              )}
            </div>

            <a href={material.file_url} target="_blank" rel="noopener noreferrer" download>
              <Button size="sm" className="gap-2">
                <Download className="w-4 h-4" /> Download File
              </Button>
            </a>
          </div>

          {/* PDF / Image Preview */}
          {canPreview && (
            <div className="mt-4 border border-border rounded-xl overflow-hidden bg-black/5">
              {material.file_type?.startsWith("image/") ? (
                <img
                  src={material.file_url}
                  alt={material.title}
                  className="w-full max-h-[500px] object-contain mx-auto"
                />
              ) : (
                <iframe
                  src={material.file_url}
                  className="w-full h-[600px]"
                  title="PDF Preview"
                />
              )}
            </div>
          )}
        </Card>
      )}

      {/* External Link */}
      {material.external_url && (
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-brand-600" /> Link Referensi Eksternal
          </h3>
          <a
            href={material.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-600 hover:underline break-all"
          >
            {material.external_url}
          </a>
        </Card>
      )}

      {/* Notes / Content from Material */}
      {material.notes && (
        <Card className="space-y-3">
          <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-500" />
            <span>Deskripsi / Catatan Materi</span>
          </h3>
          <div className="p-4 bg-surface-secondary rounded-xl border border-border whitespace-pre-wrap font-mono text-sm text-text-primary">
            {material.notes}
          </div>
        </Card>
      )}

      {/* ─── PERSONAL STUDY NOTES WIDGET (Catatan Pribadi Siswa) ─── */}
      <PersonalMaterialNotesWidget material={material} />

      <ConfirmDialog
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Materi Ini?"
        message="Apakah Anda yakin ingin menghapus materi ini?"
      />
    </div>
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
    <Card className="space-y-4 border-brand-500/30 bg-surface shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500 border border-brand-500/20">
            <FileEdit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">Catatan Belajar Pribadi</h3>
            <p className="text-xs text-text-secondary">
              Catatan khusus yang hanya dapat dilihat dan diedit oleh akun Anda.
            </p>
          </div>
        </div>

        <Button size="sm" onClick={handleOpenCreate} className="gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" />
          <span>Tulis Catatan</span>
        </Button>
      </div>

      {personalNotes.length === 0 ? (
        <div className="p-4 rounded-xl bg-surface-secondary border border-border/70 text-center space-y-2">
          <p className="text-xs text-text-secondary">
            Belum ada catatan pribadi untuk materi ini. Tulis ringkasan, rumus, atau poin penting Anda.
          </p>
          <Button size="sm" variant="outline" onClick={handleOpenCreate} className="gap-1.5 text-xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Catatan Pertama</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {personalNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-xl bg-surface-secondary border border-border hover:border-brand-500/40 transition-all space-y-2 group"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold text-text-primary group-hover:text-brand-400 transition-colors">
                  {note.title}
                </h4>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(note)}
                    className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(note.id, note.title)}
                    className="p-1 rounded-lg text-text-tertiary hover:text-rose-500 hover:bg-surface transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-text-secondary whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>

              <div className="pt-1 text-[10px] font-mono text-text-tertiary">
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
    </Card>
  );
}
