"use client";

import { useState, useRef } from "react";
import {
  Download,
  UploadCloud,
  FileJson,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Database,
  FileText,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { exportUserData, importUserData } from "@/actions/study-actions";
import { toast } from "sonner";

export default function BackupPage() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = async () => {
    setExporting(true);
    try {
      const data = await exportUserData();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute(
        "download",
        `velqora-backup-${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("Backup data JSON berhasil diunduh!");
    } catch (err: any) {
      toast.error("Gagal export: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast.error("Berkas harus berformat .JSON");
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const payload = JSON.parse(text);

      if (!payload || typeof payload !== "object") {
        throw new Error("Format JSON tidak valid");
      }

      const result = await importUserData(payload);
      setImportResult(result);
      toast.success("Data berhasil dipulihkan (restore) ke Velqora!");
    } catch (err: any) {
      toast.error("Gagal memulihkan backup: " + (err.message || "File rusak"));
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-5 sm:space-y-6 animate-fade-in pb-12">
      <PageHeader
        eyebrow="~/backup-recovery"
        technicalMark="< json // snapshots />"
        title="Jaga data tetap aman"
        description="Ekspor dan pulihkan seluruh catatan dan riwayat belajarmu kapan saja."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Export Card */}
        <Card className="p-6 rounded-2xl bg-surface border-border space-y-5 shadow-sm transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">Cadangkan Data (Ekspor JSON)</h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Unduh seluruh struktur data akun Anda (materi, tugas, modul, bab pembelajaran, kategori, dan label) dalam format JSON.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary border border-border text-xs text-text-secondary space-y-1 font-mono">
              <div>✓ Format JSON standar</div>
              <div>✓ Termasuk struktur bab & progress</div>
              <div>✓ Portabel & siap dipindahkan</div>
            </div>
          </div>

          <Button
            onClick={handleExportJSON}
            loading={exporting}
            className="w-full gap-2 text-xs font-semibold py-2.5"
          >
            <Download className="w-4 h-4" /> Unduh Cadangan (.JSON)
          </Button>
        </Card>

        {/* 2. Import / Restore Card */}
        <Card className="p-6 rounded-2xl bg-surface border-border space-y-5 shadow-sm transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">Pulihkan Data (Restore JSON)</h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Pulihkan atau impor modul, tugas, dan materi dari berkas cadangan JSON yang sebelumnya pernah Anda simpan.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleImportFile}
              className="hidden"
            />

            {importResult ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-400 space-y-1 font-mono">
                <div className="font-bold text-text-primary flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hasil Restore Berhasil:
                </div>
                <div>• Modul: {importResult.importedModules} modul</div>
                <div>• Materi: {importResult.importedMaterials} materi</div>
                <div>• Tugas: {importResult.importedTasks} tugas</div>
                <div>• Kategori: {importResult.importedCategories} kategori</div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-surface-secondary border border-border text-xs text-text-secondary space-y-1 font-mono">
                <div>• Mendukung sinkronisasi tanpa duplikasi</div>
                <div>• Mempertahankan struktur bab modul</div>
                <div>• Langsung aktif seketika</div>
              </div>
            )}
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            loading={importing}
            variant="outline"
            className="w-full gap-2 text-xs font-semibold py-2.5 border-border text-text-primary hover:bg-surface-secondary"
          >
            <UploadCloud className="w-4 h-4" /> Pilih Berkas JSON
          </Button>
        </Card>
      </div>

      {/* Security & Cloud Info Card */}
      <Card className="p-6 rounded-2xl bg-surface border-border space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary font-display">Keamanan Cloud Storage & Database</h3>
            <p className="text-xs text-text-secondary">
              Seluruh berkas fisik disimpan di Supabase Cloud Storage dengan Row Level Security (RLS) terisolasi per akun.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border text-xs space-y-1">
            <strong className="text-text-primary">Isolasi Pengguna</strong>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Setiap user hanya dapat mengakses dan memodifikasi data miliknya sendiri.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border text-xs space-y-1">
            <strong className="text-text-primary">Bebas Vendor Lock-in</strong>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Format JSON standar yang dapat dibaca dan dimigrasikan ke platform lain kapan pun.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border text-xs space-y-1">
            <strong className="text-text-primary">Penyimpanan Terenkripsi</strong>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Koneksi database PostgreSQL terenkripsi HTTPS/SSL end-to-end.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
