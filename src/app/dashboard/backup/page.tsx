"use client";

import { useState, useRef } from "react";
import {
  Download,
  UploadCloud,
  ShieldCheck,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { PageContainer, PageSection } from "@/components/ui/section";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
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
      toast.success("Cadangan data workspace JSON berhasil diunduh!");
    } catch (err: any) {
      toast.error("Gagal mengekspor data: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast.error("Berkas cadangan harus berformat .JSON");
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const payload = JSON.parse(text);

      if (!payload || typeof payload !== "object") {
        throw new Error("Format JSON tidak valid atau rusak.");
      }

      const result = await importUserData(payload);
      setImportResult(result);
      toast.success("Data cadangan berhasil dipulihkan ke Velqora!");
    } catch (err: any) {
      toast.error("Gagal memulihkan cadangan: " + (err.message || "Berkas tidak dapat dibaca."));
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <PageContainer className="max-w-5xl space-y-6 pb-14">
      {/* 1. Header */}
      <PageHeader
        eyebrow="Pemulihan Data"
        title="Cadangan & Pemulihan Data"
        description="Ekspor materi, tugas, modul, dan riwayat belajar Anda ke berkas JSON atau pulihkan data kapan saja."
      />

      {/* 2. Sub-Navigation Tabs */}
      <SubNavTabs category="settings" />

      {/* 3. Main Backup & Restore Grid */}
      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export JSON Column */}
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface flex flex-col justify-between space-y-6 shadow-2xs">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-text-primary">
                  Cadangkan Data (Ekspor JSON)
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Unduh seluruh modul, dokumen materi, daftar tugas, catatan studi, dan relasi kategori ke dalam satu berkas format JSON terenkripsi.
                </p>
              </div>
            </div>

            <Button
              onClick={handleExportJSON}
              disabled={exporting}
              className="gap-2 text-xs font-semibold w-full min-h-[40px] cursor-pointer"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengekspor Berkas...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Unduh Cadangan JSON</span>
                </>
              )}
            </Button>
          </div>

          {/* Import / Restore Column */}
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface flex flex-col justify-between space-y-6 shadow-2xs">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-text-primary">
                  Pulihkan Data (Impor JSON)
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Unggah berkas cadangan JSON yang pernah Anda unduh sebelumnya untuk memulihkan seluruh struktur modul dan catatan studi.
                </p>
              </div>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
                id="restore-file-input"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="gap-2 text-xs font-semibold w-full min-h-[40px] cursor-pointer"
              >
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memulihkan Data...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Pilih Berkas Cadangan (.json)</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Restore Result Notice */}
        {importResult && (
          <div className="mt-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs text-text-primary flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                Pemulihan Berkas Berhasil!
              </p>
              <p className="text-text-secondary">
                Data cadangan telah berhasil diintegrasikan ke workspace Anda.
              </p>
            </div>
          </div>
        )}

        {/* Security Note */}
        <div className="mt-4 flex items-center gap-2 text-xs text-text-tertiary">
          <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
          <span>
            Berkas cadangan tidak menyimpan kredensial autentikasi atau kata sandi pribadi Anda.
          </span>
        </div>
      </PageSection>
    </PageContainer>
  );
}
