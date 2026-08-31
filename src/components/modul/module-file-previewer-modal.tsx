"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  Code,
  FileCode,
  Table as TableIcon,
  Play,
  Terminal,
  Loader2,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  HardDrive,
} from "lucide-react";
import { ModuleDriveFile, getFileCategory } from "@/types/module-drive";
import { formatFileSize } from "@/lib/utils";
import { executeJavaScript, executePython, ExecutionResult } from "@/lib/code-runner";
import { toast } from "sonner";

interface ModuleFilePreviewerModalProps {
  file: ModuleDriveFile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ModuleFilePreviewerModal({
  file,
  isOpen,
  onClose,
}: ModuleFilePreviewerModalProps) {
  const [copied, setCopied] = useState(false);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [notebookCells, setNotebookCells] = useState<any[] | null>(null);

  // In-Browser Code Runner State
  const [isExecuting, setIsExecuting] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    if (!isOpen || !file) {
      setTextContent(null);
      setNotebookCells(null);
      return;
    }

    const { category } = getFileCategory(file.name);

    // If it's a code, notebook, text, or csv file, fetch content to display in-app
    if (
      category === "jupyter" ||
      category === "python" ||
      category === "code" ||
      category === "markdown" ||
      category === "text" ||
      category === "excel" ||
      file.name.endsWith(".csv") ||
      file.name.endsWith(".tsv")
    ) {
      if (file.textContent) {
        setTextContent(file.textContent);
        if (category === "jupyter") {
          try {
            const parsed = JSON.parse(file.textContent);
            if (parsed && Array.isArray(parsed.cells)) {
              setNotebookCells(parsed.cells);
            }
          } catch (e) {
            console.warn("Failed to parse notebook JSON:", e);
          }
        }
      } else if (file.url && file.url.startsWith("http")) {
        setLoadingContent(true);
        fetch(file.url)
          .then((res) => res.text())
          .then((text) => {
            setTextContent(text);
            if (category === "jupyter") {
              try {
                const parsed = JSON.parse(text);
                if (parsed && Array.isArray(parsed.cells)) {
                  setNotebookCells(parsed.cells);
                }
              } catch (e) {
                console.warn("Failed to parse notebook JSON:", e);
              }
            }
          })
          .catch((err) => {
            console.warn("Failed to fetch file content for preview:", err);
            setTextContent("// Tidak dapat memuat teks langsung dari URL cloud storage. Silakan unduh berkas untuk membukanya.");
          })
          .finally(() => setLoadingContent(false));
      }
    }
  }, [isOpen, file]);

  // CSV Table parser
  const csvParsedData = useMemo(() => {
    if (!file || !textContent) return null;
    const isCsv = file.name.toLowerCase().endsWith(".csv") || file.name.toLowerCase().endsWith(".tsv");
    if (!isCsv) return null;

    try {
      const delimiter = file.name.toLowerCase().endsWith(".tsv") ? "\t" : ",";
      const lines = textContent.trim().split("\n");
      if (lines.length === 0) return null;

      const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ""));
      const rows = lines.slice(1, 101).map((line) =>
        line.split(delimiter).map((val) => val.trim().replace(/^["']|["']$/g, ""))
      );

      return { headers, rows, totalRows: lines.length - 1 };
    } catch {
      return null;
    }
  }, [file, textContent]);

  if (!isOpen || !file) return null;

  const fileInfo = getFileCategory(file.name);
  const isAudio = ["mp3", "wav", "ogg", "aac", "m4a"].includes(fileInfo.extension);
  const isVideo = ["mp4", "webm", "mov", "mkv"].includes(fileInfo.extension);

  const isRunnable = Boolean(
    fileInfo.category === "python" ||
    fileInfo.category === "code" ||
    ["js", "ts", "jsx", "tsx", "py"].includes(fileInfo.extension)
  );

  const handleRunCode = async () => {
    if (!textContent) {
      toast.error("Konten kode belum termuat");
      return;
    }

    setIsExecuting(true);
    setShowTerminal(true);

    try {
      if (fileInfo.category === "python" || fileInfo.extension === "py") {
        const res = await executePython(textContent);
        setExecResult(res);
        if (res.error) {
          toast.error("Terjadi kesalahan sintaks/runtime saat eksekusi Python");
        } else {
          toast.success(`Eksekusi Python selesai (${res.executionTimeMs}ms)`);
        }
      } else {
        const res = await executeJavaScript(textContent);
        setExecResult(res);
        if (res.error) {
          toast.error("Terjadi kesalahan runtime JavaScript");
        } else {
          toast.success(`Eksekusi JavaScript selesai (${res.executionTimeMs}ms)`);
        }
      }
    } catch (e: any) {
      setExecResult({
        output: "",
        error: e.message || String(e),
        executionTimeMs: 0,
        logs: [{ type: "error", text: e.message || String(e) }],
      });
      toast.error("Gagal mengeksekusi kode: " + e.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyUrl = () => {
    if (file.url) {
      navigator.clipboard.writeText(file.url);
      setCopied(true);
      toast.success("Link berkas berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyText = () => {
    if (textContent) {
      navigator.clipboard.writeText(textContent);
      toast.success("Konten berkas berhasil disalin!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative flex flex-col w-full max-w-5xl h-[92vh] max-h-[850px] rounded-3xl bg-[#020409] border border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-inner"
              style={{
                backgroundColor: `${fileInfo.color}20`,
                border: `1px solid ${fileInfo.color}40`,
                color: fileInfo.color,
              }}
            >
              {fileInfo.category === "jupyter" || fileInfo.category === "python" || fileInfo.category === "code" ? (
                <FileCode className="w-5 h-5" />
              ) : fileInfo.category === "excel" ? (
                <TableIcon className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white truncate max-w-md sm:max-w-xl">
                  {file.name}
                </h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${fileInfo.badgeBg} ${fileInfo.badgeBorder} ${fileInfo.badgeText}`}
                >
                  {fileInfo.label}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Pratinjau Langsung
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {formatFileSize(file.size)} • Diunggah {new Date(file.uploadedAt).toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {isRunnable && (
              <button
                onClick={handleRunCode}
                disabled={isExecuting}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50"
                title="Jalankan kode langsung di browser"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengeksekusi...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Jalankan Kode</span>
                  </>
                )}
              </button>
            )}

            {textContent && (
              <button
                onClick={handleCopyText}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] text-slate-200 hover:bg-white/[0.12] border border-white/[0.1] transition-all"
                title="Salin Isi Teks/Kode"
              >
                <Copy className="w-3.5 h-3.5" /> Salin Isi
              </button>
            )}

            <button
              onClick={handleCopyUrl}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Salin Tautan Cloud Storage"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            {file.url && (
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                download={file.name}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 shadow-xs transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Unduh
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto bg-[#000000] p-4 sm:p-6 custom-scrollbar">
          {/* 1. PDF Document View */}
          {fileInfo.category === "pdf" && file.url && (
            <div className="w-full h-full min-h-[500px] flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] bg-[#020409]">
              <iframe
                src={`${file.url}#toolbar=1&navpanes=0`}
                className="w-full h-full flex-1 border-0"
                title={file.name}
              />
            </div>
          )}

          {/* 2. Interactive Jupyter Notebook Viewer (.ipynb) */}
          {fileInfo.category === "jupyter" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <span>Preview Notebook</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">Jupyter .ipynb</span>
                    </h4>
                    <p className="text-amber-300/80 text-[11px]">
                      Struktur sel kode, markdown naratif, dan visualisasi hasil keluaran data tersusun rapi.
                    </p>
                  </div>
                </div>
                {notebookCells && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
                    {notebookCells.length} Sel Notebook
                  </span>
                )}
              </div>

              {loadingContent ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-xs">Memuat sel notebook...</p>
                </div>
              ) : notebookCells && notebookCells.length > 0 ? (
                <div className="space-y-3">
                  {notebookCells.map((cell: any, idx: number) => {
                    const sourceText = Array.isArray(cell.source) ? cell.source.join("") : cell.source || "";
                    const isCode = cell.cell_type === "code";

                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-white/[0.08] bg-[#02050c] overflow-hidden shadow-xl"
                      >
                        {/* Cell Header */}
                        <div className="flex items-center justify-between px-3.5 py-1.5 bg-white/[0.03] border-b border-white/[0.06] text-[11px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1.5">
                            {isCode ? (
                              <span className="text-amber-400 font-bold">[In {cell.execution_count ?? idx + 1}]:</span>
                            ) : (
                              <span className="text-blue-400">[Markdown]:</span>
                            )}
                          </span>

                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(sourceText);
                              toast.success("Kode sel disalin!");
                            }}
                            className="hover:text-white transition-colors"
                            title="Salin Sel Ini"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Cell Body */}
                        {isCode ? (
                          <div className="flex bg-[#010206] font-mono text-xs overflow-x-auto">
                            <div className="py-4 px-3 bg-white/[0.02] border-r border-white/[0.06] text-slate-600 text-right select-none min-w-[40px]">
                              {sourceText.split("\n").map((_line: string, lineIdx: number) => (
                                <div key={lineIdx}>{lineIdx + 1}</div>
                              ))}
                            </div>
                            <div className="p-4 text-emerald-300 flex-1 overflow-x-auto leading-relaxed whitespace-pre selection:bg-emerald-900/50">
                              {sourceText}
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-[#040812] text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                            {sourceText}
                          </div>
                        )}

                        {/* Code Outputs if available */}
                        {isCode && cell.outputs && cell.outputs.length > 0 && (
                          <div className="border-t border-white/[0.05] bg-[#02050c] p-3.5 text-xs font-mono text-slate-300 overflow-x-auto space-y-2">
                            <div className="text-[10px] uppercase font-bold text-slate-500 mb-1.5">[Out]:</div>
                            {cell.outputs.map((out: any, outIdx: number) => {
                              const outputText =
                                out.text
                                  ? Array.isArray(out.text)
                                    ? out.text.join("")
                                    : out.text
                                  : out.data?.["text/plain"]
                                    ? Array.isArray(out.data["text/plain"])
                                      ? out.data["text/plain"].join("")
                                      : out.data["text/plain"]
                                    : "";

                              const pngBase64 = out.data?.["image/png"];
                              const jpegBase64 = out.data?.["image/jpeg"];

                              return (
                                <div key={outIdx} className="space-y-2">
                                  {outputText && (
                                    <pre className="text-slate-300 whitespace-pre-wrap bg-black/40 p-2.5 rounded-xl border border-white/[0.05]">
                                      {outputText}
                                    </pre>
                                  )}
                                  {pngBase64 && (
                                    <Image
                                      src={`data:image/png;base64,${pngBase64}`}
                                      alt="Notebook Output Chart"
                                      width={600}
                                      height={400}
                                      unoptimized
                                      className="rounded-xl border border-white/[0.1] max-w-full bg-white p-2"
                                    />
                                  )}
                                  {jpegBase64 && (
                                    <Image
                                      src={`data:image/jpeg;base64,${jpegBase64}`}
                                      alt="Notebook Output Chart"
                                      width={600}
                                      height={400}
                                      unoptimized
                                      className="rounded-xl border border-white/[0.1] max-w-full bg-white p-2"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-[#010206] border border-white/[0.08] font-mono text-xs text-slate-300 whitespace-pre overflow-x-auto">
                  {textContent || "// Tidak ada konten untuk ditampilkan"}
                </div>
              )}
            </div>
          )}

          {/* 3. Interactive CSV Table Viewer */}
          {csvParsedData && (
            <div className="max-w-5xl mx-auto space-y-3">
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <span className="text-emerald-300 flex items-center gap-2 font-semibold">
                  <TableIcon className="w-4 h-4" />
                  <span>Tabel Data Interaktif: <strong className="text-white">{file.name}</strong></span>
                </span>
                <span className="font-mono text-emerald-400 text-[11px]">
                  Menampilkan {csvParsedData.rows.length} dari {csvParsedData.totalRows} baris data
                </span>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#020409] overflow-x-auto shadow-2xl">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                      <th className="p-3 text-slate-500 font-bold border-r border-white/[0.06] text-center w-12">#</th>
                      {csvParsedData.headers.map((h, hIdx) => (
                        <th key={hIdx} className="p-3 text-slate-200 font-bold border-r border-white/[0.06]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvParsedData.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="p-2.5 text-slate-500 text-center border-r border-white/[0.06]">{rIdx + 1}</td>
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className="p-2.5 text-slate-300 border-r border-white/[0.06] whitespace-nowrap">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Source Code / Python / Script / Text Viewer (with Line Numbers Gutter & In-Browser Runner) */}
          {!csvParsedData &&
            (fileInfo.category === "python" ||
              fileInfo.category === "code" ||
              fileInfo.category === "markdown" ||
              fileInfo.category === "text") && (
              <div className="max-w-4xl mx-auto space-y-3">
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface-secondary border border-white/[0.08] text-xs">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Code className="w-4 h-4 text-brand-400" />
                    <span>Pratinjau Kode: <strong className="text-white">{file.name}</strong></span>
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400 text-[11px]">
                      {textContent ? `${textContent.split("\n").length} baris kode` : "0 baris"}
                    </span>

                    {isRunnable && (
                      <button
                        onClick={handleRunCode}
                        disabled={isExecuting}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isExecuting ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Play className="w-3 h-3 fill-current" />
                        )}
                        <span>{isExecuting ? "Menjalankan..." : "Jalankan"}</span>
                      </button>
                    )}
                  </div>
                </div>

                {loadingContent ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-xs">Memuat berkas kode...</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/[0.08] bg-[#010206] overflow-hidden shadow-2xl flex">
                    {/* Line numbers gutter */}
                    <div className="py-4 px-3 bg-white/[0.02] border-r border-white/[0.06] font-mono text-xs text-slate-600 text-right select-none min-w-[44px]">
                      {(textContent || "").split("\n").map((_line: string, lineIdx: number) => (
                        <div key={lineIdx}>{lineIdx + 1}</div>
                      ))}
                    </div>
                    {/* Code content */}
                    <div className="p-4 font-mono text-xs text-slate-200 overflow-x-auto flex-1 leading-relaxed selection:bg-brand-500/30 whitespace-pre">
                      {textContent || "// Berkas siap diunduh"}
                    </div>
                  </div>
                )}

                {/* 4b. Interactive Live Execution Output Terminal */}
                {showTerminal && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-[#02050e] overflow-hidden shadow-2xl animate-fade-in mt-4">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-950/40 border-b border-emerald-500/20 text-xs">
                      <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                        <Terminal className="w-4 h-4" />
                        <span>Output Konsol Terminal:</span>
                        {execResult && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-normal">
                            ⚡ {execResult.executionTimeMs}ms
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={handleRunCode}
                          disabled={isExecuting}
                          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Jalankan Ulang"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setShowTerminal(false)}
                          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Tutup Terminal"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 font-mono text-xs overflow-x-auto max-h-60 custom-scrollbar space-y-2">
                      {isExecuting ? (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                          <span>Mengeksekusi program di sandbox browser...</span>
                        </div>
                      ) : execResult?.error ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-red-400 font-bold">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Error Runtime:</span>
                          </div>
                          <pre className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 whitespace-pre-wrap">
                            {execResult.error}
                          </pre>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {execResult?.logs && execResult.logs.length > 0 ? (
                            execResult.logs.map((log, idx) => (
                              <div
                                key={idx}
                                className={`whitespace-pre-wrap leading-relaxed ${
                                  log.type === "error"
                                    ? "text-red-400"
                                    : log.type === "warn"
                                      ? "text-amber-400"
                                      : "text-emerald-300"
                                }`}
                              >
                                {log.text}
                              </div>
                            ))
                          ) : (
                            <pre className="text-emerald-300 whitespace-pre-wrap">
                              {execResult?.output || "(Selesai)"}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* 5. High-Res Image Viewer */}
          {fileInfo.category === "image" && file.url && (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <Image
                src={file.url}
                alt={file.name}
                width={1200}
                height={800}
                unoptimized
                className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/[0.1]"
              />
            </div>
          )}

          {/* 6. Audio & Video Player */}
          {isAudio && file.url && (
            <div className="flex flex-col items-center justify-center h-full min-h-[350px] p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Play className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">{file.name}</h4>
              <audio controls src={file.url} className="w-full max-w-md" />
            </div>
          )}

          {isVideo && file.url && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              <video controls src={file.url} className="max-h-[70vh] max-w-full rounded-2xl border border-white/[0.1]" />
            </div>
          )}

          {/* 7. Office Docs (.docx, .xlsx, .pptx) Google Docs Viewer Embed */}
          {!csvParsedData &&
            (fileInfo.category === "word" ||
              fileInfo.category === "excel" ||
              fileInfo.category === "presentation") &&
            file.url && (
              <div className="flex flex-col items-center justify-center h-full min-h-[450px] p-6 text-center">
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-xl"
                  style={{
                    backgroundColor: `${fileInfo.color}20`,
                    border: `1px solid ${fileInfo.color}40`,
                    color: fileInfo.color,
                  }}
                >
                  <FileText className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{file.name}</h4>
                <p className="text-sm text-slate-400 max-w-md mb-6">
                  Dokumen Microsoft Office ({fileInfo.label}) dapat dibuka langsung melalui Google Docs Viewer atau diunduh ke perangkat.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`https://docs.google.com/viewer?url=${encodeURIComponent(file.url)}&embedded=false`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-medium bg-white/[0.08] text-white hover:bg-white/[0.15] border border-white/[0.12] transition-all"
                  >
                    <ExternalLink className="w-4 h-4 text-brand-400" /> Buka via Google Docs Viewer
                  </a>

                  <a
                    href={file.url}
                    download={file.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 shadow-xs transition-all"
                  >
                    <Download className="w-4 h-4" /> Unduh Dokumen ({formatFileSize(file.size)})
                  </a>
                </div>
              </div>
            )}

          {/* 8. Archives & Other File Types */}
          {!isAudio &&
            !isVideo &&
            (fileInfo.category === "archive" || fileInfo.category === "other") && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-6 text-center">
                <div className="w-20 h-20 rounded-3xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 flex items-center justify-center mb-4 shadow-xl">
                  <HardDrive className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{file.name}</h4>
                <p className="text-sm text-slate-400 max-w-md mb-6">
                  Berkas paket arsip / data. Unduh untuk mengekstrak dan membuka di perangkat Anda.
                </p>
                {file.url && (
                  <a
                    href={file.url}
                    download={file.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-500 shadow-xs transition-all"
                  >
                    <Download className="w-4 h-4" /> Unduh Berkas ({formatFileSize(file.size)})
                  </a>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
