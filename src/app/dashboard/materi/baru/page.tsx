"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Paperclip,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { ContentContainer } from "@/components/ui/section";
import { createMaterial, getCategories } from "@/actions/study-actions";
import { MATERIAL_TYPE_LABELS } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET, MAX_FILE_SIZE } from "@/lib/constants";
import { formatFileSize } from "@/lib/utils";
import { toast } from "sonner";

export default function TambahMateriPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("materi_kuliah");
  const [status, setStatus] = useState("selesai");
  const [externalUrl, setExternalUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadCats() {
      try {
        const list = await getCategories();
        setCategories(list || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Judul materi wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      let fileInfo: any = undefined;

      // Upload file to Supabase Storage if file attached
      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error("File terlalu besar (maksimal 50MB).");
          setLoading(false);
          return;
        }

        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Pengguna tidak terautentikasi.");

        const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const storagePath = `materials/${user.id}/${Date.now()}_${cleanFileName}`;

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(storagePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(storagePath);

        fileInfo = {
          url: publicUrlData.publicUrl,
          name: file.name,
          size: file.size,
          mime: file.type,
        };

        // Save file record
        await supabase.from("files").insert({
          user_id: user.id,
          name: file.name,
          storage_path: storagePath,
          url: publicUrlData.publicUrl,
          size: file.size,
          mime_type: file.type,
        });
      }

      await createMaterial(
        {
          title: title.trim(),
          description: description.trim() || undefined,
          category_id: categoryId || undefined,
          subject: subject.trim() || undefined,
          type: type as any,
          status: status as any,
          external_url: externalUrl.trim() || undefined,
          notes: notes.trim() || undefined,
          tag_ids: [],
        },
        fileInfo
      );

      toast.success("Materi berhasil disimpan!");
      router.push("/dashboard/materi");
    } catch (err: any) {
      toast.error("Gagal menyimpan materi: " + (err.message || "Terjadi kesalahan."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentContainer className="space-y-6 sm:space-y-8 pb-16">
      {/* ─── 1. Header & Navigation ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/materi"
            className="w-9 h-9 rounded-xl bg-surface-secondary hover:bg-surface-tertiary border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Kembali ke Daftar Materi"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                Pustaka Bahan Ajar
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight font-display">
              Tambah Materi Baru
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              Simpan slide materi, dokumen PDF, berkas kode, atau catatan perkuliahan ke workspace Anda.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 2. Main Form ─── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: INFORMASI MATERI */}
        <section className="p-4 sm:p-6 rounded-xl border border-border bg-surface shadow-2xs space-y-4">
          <div className="border-b border-border/70 pb-3">
            <h2 className="text-sm font-bold text-text-primary tracking-tight uppercase font-mono">
              1. Informasi Materi
            </h2>
            <p className="text-xs text-text-secondary">
              Tentukan judul, mata kuliah, dan klasifikasi dokumen.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Judul Materi *"
              placeholder="Contoh: Pertemuan 1 - Pengenalan Algoritma & Struktur Data"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Mata Kuliah / Topik"
                placeholder="Contoh: Algoritma & Pemrograman"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <Select
                label="Kategori"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                placeholder="Pilih Kategori (Opsional)"
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Jenis Dokumen"
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={Object.entries(MATERIAL_TYPE_LABELS).map(([k, v]) => ({
                  value: k,
                  label: v,
                }))}
              />

              <Select
                label="Status Materi"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: "draft", label: "Draft (Konsep)" },
                  { value: "selesai", label: "Selesai (Aktif)" },
                  { value: "arsip", label: "Arsip" },
                ]}
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: DESKRIPSI & CATATAN */}
        <section className="p-4 sm:p-6 rounded-xl border border-border bg-surface shadow-2xs space-y-4">
          <div className="border-b border-border/70 pb-3">
            <h2 className="text-sm font-bold text-text-primary tracking-tight uppercase font-mono">
              2. Deskripsi & Ringkasan Silabus
            </h2>
            <p className="text-xs text-text-secondary">
              Tulis penjelasan singkat atau ringkasan materi untuk referensi belajar.
            </p>
          </div>

          <div className="space-y-4">
            <Textarea
              label="Deskripsi Ringkas"
              placeholder="Penjelasan singkat mengenai konten atau tujuan pembelajaran..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />

            <Textarea
              label="Catatan Lengkap / Teks Materi"
              placeholder="Tuliskan rumus, kode referensi, poin penting, atau rangkuman materi kuliah..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
            />
          </div>
        </section>

        {/* SECTION 3: SUMBER & BERKAS LAMPIRAN */}
        <section className="p-4 sm:p-6 rounded-xl border border-border bg-surface shadow-2xs space-y-4">
          <div className="border-b border-border/70 pb-3">
            <h2 className="text-sm font-bold text-text-primary tracking-tight uppercase font-mono">
              3. Berkas Lampiran & Tautan Luar
            </h2>
            <p className="text-xs text-text-secondary">
              Lampirkan dokumen PDF, notebook, slide, atau tautan repositori luar.
            </p>
          </div>

          <div className="space-y-4">
            {/* File Upload Box */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider font-mono">
                Unggah File Dokumen
              </label>

              {file ? (
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-brand-500/40 bg-brand-500/5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/15 text-brand-500 flex items-center justify-center shrink-0">
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-text-primary truncate">
                        {file.name}
                      </p>
                      <p className="text-[11px] font-mono text-text-tertiary">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-1.5 rounded-lg text-text-tertiary hover:text-rose-500 hover:bg-surface transition-colors cursor-pointer"
                    title="Hapus file terpilih"
                    aria-label="Hapus file terpilih"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border border-dashed border-border hover:border-brand-500/60 rounded-xl p-5 text-center cursor-pointer transition-colors relative bg-surface-secondary/50 hover:bg-surface-secondary">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Pilih file dokumen materi"
                  />
                  <div className="flex flex-col items-center space-y-1.5 pointer-events-none">
                    <Upload className="w-6 h-6 text-brand-500" />
                    <p className="text-xs sm:text-sm text-text-primary font-semibold">
                      Klik atau drag & drop file ke sini
                    </p>
                    <p className="text-[11px] text-text-tertiary">
                      Maksimal 50MB (PDF, DOCX, XLSX, PPTX, IPYNB, ZIP, PY, TXT, CSV)
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Tautan Eksternal (Opsional)"
              placeholder="https://github.com/username/repository atau Google Drive link"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
            />
          </div>
        </section>

        {/* ─── 3. Action Buttons (Sticky Bottom Bar for Easy Reach) ─── */}
        <div className="sticky bottom-4 z-20 flex items-center justify-end gap-3 p-3.5 sm:p-4 rounded-xl border border-border bg-surface/95 backdrop-blur-md shadow-md">
          <Link href="/dashboard/materi">
            <Button variant="outline" type="button" size="sm" className="text-xs cursor-pointer">
              Batal
            </Button>
          </Link>
          <Button type="submit" loading={loading} size="sm" className="text-xs font-semibold cursor-pointer">
            Simpan Materi
          </Button>
        </div>
      </form>
    </ContentContainer>
  );
}
