"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { ContentContainer } from "@/components/ui/section";
import { createTask } from "@/actions/study-actions";
import { toast } from "sonner";

export default function TambahTugasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form Fields
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
      toast.error("Judul tugas wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      await createTask({
        title: title.trim(),
        subject: subject.trim() || undefined,
        lecturer: lecturer.trim() || undefined,
        description: description.trim() || undefined,
        deadline: deadline || undefined,
        priority: priority as any,
        status: status as any,
        external_url: externalUrl.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      toast.success("Tugas berhasil ditambahkan!");
      router.push("/dashboard/tugas");
    } catch (err: any) {
      toast.error("Gagal menambahkan tugas: " + (err.message || "Terjadi kesalahan."));
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
            href="/dashboard/tugas"
            className="w-9 h-9 rounded-xl bg-surface-secondary hover:bg-surface-tertiary border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Kembali ke Daftar Tugas"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                Pekerjaan & Deadline
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight font-display">
              Tambah Tugas Baru
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              Dokumentasikan instruksi tugas perkuliahan, prioritas, dan tenggat waktu pengumpulan.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 2. Main Form ─── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: INFORMASI TUGAS */}
        <section className="p-4 sm:p-6 rounded-xl border border-border bg-surface shadow-2xs space-y-4">
          <div className="border-b border-border/70 pb-3">
            <h2 className="text-sm font-bold text-text-primary tracking-tight uppercase font-mono">
              1. Informasi Tugas
            </h2>
            <p className="text-xs text-text-secondary">
              Tentukan judul, mata kuliah, dan dosen pengampu tugas.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Judul Tugas *"
              placeholder="Contoh: Tugas 2 - Analisis Algoritma Sorting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Mata Kuliah / Modul"
                placeholder="Contoh: Struktur Data & Algoritma"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <Input
                label="Dosen Pengampu / Instruktur"
                placeholder="Contoh: Dr. Budi Santoso"
                value={lecturer}
                onChange={(e) => setLecturer(e.target.value)}
              />
            </div>

            <Textarea
              label="Deskripsi Tugas / Soal / Instruksi"
              placeholder="Tuliskan petunjuk pengerjaan, batasan, atau instruksi dari dosen..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </section>

        {/* SECTION 2: WAKTU & PRIORITAS */}
        <section className="p-4 sm:p-6 rounded-xl border border-border bg-surface shadow-2xs space-y-4">
          <div className="border-b border-border/70 pb-3">
            <h2 className="text-sm font-bold text-text-primary tracking-tight uppercase font-mono">
              2. Batas Waktu & Prioritas
            </h2>
            <p className="text-xs text-text-secondary">
              Atur deadline dan tingkat urgensi pengerjaan tugas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Deadline (Tanggal & Waktu)"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            <Select
              label="Tingkat Prioritas"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={[
                { value: "rendah", label: "Rendah" },
                { value: "sedang", label: "Sedang" },
                { value: "tinggi", label: "Tinggi" },
              ]}
            />

            <Select
              label="Status Pekerjaan"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: "belum_dikerjakan", label: "Belum Mulai" },
                { value: "sedang_dikerjakan", label: "Sedang Dikerjakan" },
                { value: "selesai", label: "Selesai" },
              ]}
            />
          </div>
        </section>

        {/* SECTION 3: DETAIL PEKERJAAN */}
        <section className="p-4 sm:p-6 rounded-xl border border-border bg-surface shadow-2xs space-y-4">
          <div className="border-b border-border/70 pb-3">
            <h2 className="text-sm font-bold text-text-primary tracking-tight uppercase font-mono">
              3. Detail Pengerjaan & Tautan
            </h2>
            <p className="text-xs text-text-secondary">
              Simpan tautan repositori, portal pengumpulan, atau catatan tambahan.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Tautan Pengumpulan / GitHub / Google Drive (Opsional)"
              placeholder="https://classroom.google.com/... atau https://github.com/..."
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
            />

            <Textarea
              label="Catatan Tambahan / Draft Jawaban"
              placeholder="Tuliskan catatan referensi, rumus, atau progres sementara Anda..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </section>

        {/* ─── 4. Actions ─── */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Link href="/dashboard/tugas">
            <Button variant="ghost" type="button" size="sm" className="text-xs cursor-pointer">
              Batal
            </Button>
          </Link>
          <Button type="submit" loading={loading} size="sm" className="text-xs font-semibold cursor-pointer">
            Simpan Tugas
          </Button>
        </div>
      </form>
    </ContentContainer>
  );
}
