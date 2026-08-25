"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { createTask } from "@/actions/study-actions";
import { toast } from "sonner";

export default function TambahTugasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("sedang");
  const [status, setStatus] = useState("belum_dikerjakan");
  const [externalUrl, setExternalUrl] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Judul tugas wajib diisi");
      return;
    }

    setLoading(true);
    try {
      await createTask({
        title,
        subject,
        lecturer,
        description,
        deadline,
        priority: priority as any,
        status: status as any,
        external_url: externalUrl,
        notes,
      });

      toast.success("Tugas berhasil ditambahkan!");
      router.push("/dashboard/tugas");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-5 sm:space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/tugas">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Tambah Tugas Baru</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Judul Tugas *"
            placeholder="Contoh: Tugas 2 - Analisis Algoritma Sorting"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Mata Kuliah"
              placeholder="Contoh: Struktur Data"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <Input
              label="Dosen Pengampu"
              placeholder="Contoh: Dr. Budi Santoso"
              value={lecturer}
              onChange={(e) => setLecturer(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Deadline (Tanggal & Waktu)"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            <Select
              label="Prioritas"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={[
                { value: "rendah", label: "Rendah" },
                { value: "sedang", label: "Sedang" },
                { value: "tinggi", label: "Tinggi" },
              ]}
            />

            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: "belum_dikerjakan", label: "Belum Dikerjakan" },
                { value: "sedang_dikerjakan", label: "Sedang Dikerjakan" },
                { value: "selesai", label: "Selesai" },
              ]}
            />
          </div>

          <Textarea
            label="Deskripsi Tugas / Instruksi"
            placeholder="Ketik soal atau syarat pengerjaan tugas di sini..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            label="Link Pengumpulan / Github / Google Drive"
            placeholder="https://..."
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
          />

          <Textarea
            label="Catatan Pengerjaan"
            placeholder="Catatan tambahan..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Link href="/dashboard/tugas">
              <Button variant="ghost" type="button">
                Batal
              </Button>
            </Link>
            <Button type="submit" loading={loading}>
              Simpan Tugas
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
