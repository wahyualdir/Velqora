"use client";

import React, { useRef } from "react";
import {
  Upload,
  Download,
  Copy,
  Check,
  FileCode,
  CheckCircle2,
  Trash2,
  Camera,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConversionOption, CamScannerFilterMode } from "@/lib/file-converter";
import { formatFileSize } from "@/lib/utils";

interface ConverterWorkbenchProps {
  selectedOption: ConversionOption;
  selectedFile: File | null;
  fileTextContent: string;
  onChangeFileTextContent: (val: string) => void;
  inputMode: "file" | "text";
  onChangeInputMode: (mode: "file" | "text") => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
  isConverting: boolean;
  progress: number;
  onConvert: () => void;
  convertedResult: {
    fileName: string;
    downloadUrl: string;
    fileSize: string;
    text?: string;
    originalSize?: string;
    savingsPercent?: number;
    isHdEnhanced?: boolean;
  } | null;
  isCopied: boolean;
  onCopyText: () => void;
  // Specific Options
  hdScale: 2 | 4;
  onChangeHdScale: (s: 2 | 4) => void;
  pasfotoRatio: "3x4" | "4x6" | "2x3";
  onChangePasfotoRatio: (r: "3x4" | "4x6" | "2x3") => void;
  photoBgColor: string;
  onChangePhotoBgColor: (c: string) => void;
  camFilterMode: CamScannerFilterMode;
  onChangeCamFilterMode: (m: CamScannerFilterMode) => void;
  onOpenCamScannerCamera?: () => void;
}

export function ConverterWorkbench({
  selectedOption,
  selectedFile,
  fileTextContent,
  onChangeFileTextContent,
  inputMode,
  onChangeInputMode,
  onFileSelect,
  onClearFile,
  isConverting,
  progress,
  onConvert,
  convertedResult,
  isCopied,
  onCopyText,
  hdScale,
  onChangeHdScale,
  pasfotoRatio,
  onChangePasfotoRatio,
  photoBgColor,
  onChangePhotoBgColor,
  camFilterMode,
  onChangeCamFilterMode,
  onOpenCamScannerCamera,
}: ConverterWorkbenchProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isTextSupported =
    selectedOption.category === "data" || selectedOption.category === "code";
  const isCamScanner = selectedOption.id === "doc-scanner";
  const isHdPhoto = selectedOption.id === "photo-hd";
  const isPasfoto = selectedOption.id === "photo-pasfoto";

  return (
    <div className="p-5 sm:p-6 rounded-xl border border-border bg-surface shadow-2xs space-y-6 max-w-4xl">
      {/* Workbench Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              {selectedOption.fromFormat} &rarr; {selectedOption.toFormat}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-text-primary">
            {selectedOption.name}
          </h2>
        </div>

        {isTextSupported && (
          <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-lg border border-border shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onChangeInputMode("file")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                inputMode === "file"
                  ? "bg-surface text-brand-600 dark:text-brand-400 shadow-2xs border border-border/80"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Unggah Berkas
            </button>
            <button
              type="button"
              onClick={() => onChangeInputMode("text")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                inputMode === "text"
                  ? "bg-surface text-brand-600 dark:text-brand-400 shadow-2xs border border-border/80"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Ketik Langsung
            </button>
          </div>
        )}
      </div>

      {/* Input Dropzone / Text Editor */}
      {inputMode === "text" && isTextSupported ? (
        <div className="space-y-2">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary">
            Teks atau Kode Input
          </label>
          <textarea
            value={fileTextContent}
            onChange={(e) => onChangeFileTextContent(e.target.value)}
            placeholder="Tempel atau ketikkan data/kode di sini..."
            rows={7}
            className="w-full p-3.5 rounded-xl border border-border bg-surface-secondary text-xs sm:text-sm font-mono text-text-primary focus:outline-none focus:border-brand-500 leading-relaxed resize-none"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={selectedOption.accept}
            onChange={onFileSelect}
            className="hidden"
          />

          {selectedFile ? (
            <div className="flex items-center justify-between p-4 rounded-xl border border-brand-500/30 bg-brand-500/5 text-xs font-mono">
              <div className="flex items-center gap-3 min-w-0">
                <FileCode className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-text-primary truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-text-tertiary">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || "Berkas"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClearFile}
                className="p-1.5 text-text-tertiary hover:text-rose-500 transition-colors cursor-pointer"
                title="Hapus berkas terpilih"
                aria-label="Hapus berkas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex flex-col items-center justify-center gap-2 p-8 rounded-xl border border-dashed border-border bg-surface-secondary/40 text-xs text-text-secondary hover:text-text-primary hover:border-brand-500/50 hover:bg-surface-secondary transition-colors cursor-pointer"
              >
                <Upload className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                <span className="font-medium">
                  Pilih berkas dari perangkat Anda ({selectedOption.accept})
                </span>
                <span className="text-[11px] text-text-tertiary">
                  Klik untuk membuka file explorer
                </span>
              </button>

              {isCamScanner && onOpenCamScannerCamera && (
                <button
                  type="button"
                  onClick={onOpenCamScannerCamera}
                  className="sm:w-48 flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-border bg-surface-secondary text-xs text-text-secondary hover:text-text-primary hover:border-brand-500/40 transition-colors cursor-pointer"
                >
                  <Camera className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  <span className="font-semibold text-text-primary">Buka Kamera</span>
                  <span className="text-[10px] text-text-tertiary text-center">
                    Ambil foto catatan langsung
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tool Specific Configuration Options */}
      {isHdPhoto && (
        <div className="p-3.5 rounded-xl border border-border bg-surface-secondary/40 space-y-2">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary">
            Skala Peningkatan Resolusi HD
          </label>
          <div className="flex items-center gap-2">
            {[2, 4].map((sc) => (
              <button
                key={sc}
                type="button"
                onClick={() => onChangeHdScale(sc as 2 | 4)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  hdScale === sc
                    ? "bg-surface text-brand-600 dark:text-brand-400 border border-brand-500/30 shadow-2xs"
                    : "bg-surface text-text-secondary border border-border hover:text-text-primary"
                }`}
              >
                {sc}X Resolusi Ultra HD
              </button>
            ))}
          </div>
        </div>
      )}

      {isPasfoto && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl border border-border bg-surface-secondary/40">
          <div className="space-y-1.5">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary">
              Ukuran Pasfoto
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 rounded-lg border border-border bg-surface">
              {(["3x4", "4x6", "2x3"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onChangePasfotoRatio(r)}
                  className={`py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                    pasfotoRatio === r
                      ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold"
                      : "text-text-tertiary hover:text-text-primary"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary">
              Warna Latar Belakang
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 rounded-lg border border-border bg-surface">
              {[
                { id: "none", label: "Asli" },
                { id: "red", label: "Merah" },
                { id: "blue", label: "Biru" },
                { id: "white", label: "Putih" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onChangePhotoBgColor(c.id)}
                  className={`py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                    photoBgColor === c.id
                      ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold"
                      : "text-text-tertiary hover:text-text-primary"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isCamScanner && (
        <div className="p-3.5 rounded-xl border border-border bg-surface-secondary/40 space-y-2">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary">
            Filter Pemindaian Dokumen
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "magic_color", label: "Magic Color" },
              { id: "bw_clean", label: "B&W Bersih" },
              { id: "grayscale", label: "Grayscale" },
              { id: "original", label: "Asli" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onChangeCamFilterMode(f.id as CamScannerFilterMode)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center ${
                  camFilterMode === f.id
                    ? "bg-surface text-brand-600 dark:text-brand-400 border-brand-500/30 shadow-2xs font-bold"
                    : "bg-surface text-text-secondary border-border hover:text-text-primary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Trigger */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Button
          size="lg"
          onClick={onConvert}
          disabled={
            isConverting ||
            (inputMode === "file" && !selectedFile) ||
            (inputMode === "text" && !fileTextContent.trim())
          }
          className="w-full sm:w-auto gap-2 text-xs font-semibold px-6 min-h-[44px] cursor-pointer shadow-2xs"
        >
          {isConverting ? (
            <span>Memproses Berkas ({progress}%)...</span>
          ) : (
            <>
              <ArrowRightLeft className="w-4 h-4" />
              <span>Jalankan Konversi</span>
            </>
          )}
        </Button>
      </div>

      {/* Converted Result Box */}
      {convertedResult && (
        <div className="p-4 sm:p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-text-primary truncate">
                  {convertedResult.fileName}
                </p>
                <p className="text-[11px] font-mono text-text-tertiary">
                  Ukuran: {convertedResult.fileSize}
                  {convertedResult.savingsPercent !== undefined &&
                    ` • Hemat ${convertedResult.savingsPercent}%`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {convertedResult.text && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onCopyText}
                  className="gap-1.5 text-xs text-text-secondary hover:text-text-primary cursor-pointer"
                  aria-label="Salin teks hasil konversi"
                >
                  {isCopied ? (
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
              )}

              {convertedResult.downloadUrl && (
                <a
                  href={convertedResult.downloadUrl}
                  download={convertedResult.fileName}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Berkas</span>
                </a>
              )}
            </div>
          </div>

          {/* Text Result Preview if string output */}
          {convertedResult.text && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-text-tertiary uppercase">
                Pratinjau Keluaran Teks:
              </span>
              <pre className="p-3 rounded-lg bg-surface border border-border text-xs font-mono text-text-primary whitespace-pre-wrap break-words max-h-48 overflow-y-auto scrollbar-thin">
                {convertedResult.text}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
