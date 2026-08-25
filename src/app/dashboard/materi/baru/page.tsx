"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, File } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { createMaterial, getCategories } from "@/actions/study-actions";
import { MATERIAL_TYPE_LABELS } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET, MAX_FILE_SIZE } from "@/lib/constants";
import { toast } from "sonner";
import Link from "next/link";

export default function TambahMateriPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
      const list = await getCategories();
      setCategories(list);
    }
    loadCats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Judul wajib diisi");
      return;
    }

    setLoading(true);

    try {
      let fileInfo: any = undefined;

      // Unggah file ke Supabase Storage jika ada file terpilih
      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error("File terlalu besar (maksimal 50MB)");
          setLoading(false);
          return;
        }

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Pengguna tidak terautentikasi");

        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(fileName);

        fileInfo = {
          url: publicUrlData.publicUrl,
          name: file.name,
          size: file.size,
          mime: file.type,
        };

        // Simpan metadata file di tabel files
        await supabase.from("files").insert({
          user_id: user.id,
          name: file.name,
          storage_path: fileName,
          url: publicUrlData.publicUrl,
          size: file.size,
          mime_type: file.type,
        });
      }

      await createMaterial(
        {
          title,
          description: description || undefined,
          category_id: categoryId || undefined,
          subject: subject || undefined,
          type: type as any,
          status: status as any,
          external_url: externalUrl || undefined,
          notes: notes || undefined,
          tag_ids: [],
        },
        fileInfo
      );

      toast.success("Materi berhasil disimpan!");
      router.push("/dashboard/materi");
    } catch (err: any) {
      toast.error("Gagal menyimpan materi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-5 sm:space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/materi">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Button>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight font-display">Tambah Materi Baru</h1>
      </div>

      <Card className="p-4 sm:p-6 rounded-2xl bg-surface border-border">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <Input
            label="Judul Materi *"
            placeholder="Contoh: Pertemuan 1 - Pengenalan Data Science"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Jenis Materi"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={Object.entries(MATERIAL_TYPE_LABELS).map(([k, v]) => ({
                value: k,
                label: v,
              }))}
            />

            <Select
              label="Kategori"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Pilih Kategori (opsional)"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Mata Kuliah"
              placeholder="Contoh: Pemrograman Web"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <Select
              label="Status Materi"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: "draft", label: "Draft" },
                { value: "selesai", label: "Selesai" },
                { value: "arsip", label: "Arsip" },
              ]}
            />
          </div>

          <Textarea
            label="Deskripsi Ringkas"
            placeholder="Penjelasan singkat mengenai isi materi..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Upload File */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Upload File (PDF, IPYNB, ZIP, PPT, Image, dll)
            </label>
            <div className="border-2 border-dashed border-border hover:border-brand-500 rounded-xl p-6 text-center cursor-pointer transition-colors relative bg-surface-secondary">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center space-y-2">
                <Upload className="w-8 h-8 text-text-tertiary" />
                <p className="text-sm text-text-primary font-medium">
                  {file ? file.name : "Klik atau drag & drop file ke sini"}
                </p>
                <p className="text-xs text-text-tertiary">
                  Maksimal 50MB (PDF, DOCX, XLSX, PPTX, IPYNB, ZIP, PNG, JPG, CSV, DLL)
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Link Eksternal (Opsional)"
            placeholder="https://github.com/username/repository atau Google Drive link"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
          />

          <Textarea
            label="Catatan Tambahan / Ringkasan Materi"
            placeholder="Tuliskan rumus penting, instruksi, atau catatan kuliah di sini..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Link href="/dashboard/materi">
              <Button variant="ghost" type="button">
                Batal
              </Button>
            </Link>
            <Button type="submit" loading={loading}>
              Simpan Materi
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
