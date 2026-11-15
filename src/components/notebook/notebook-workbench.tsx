"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Boxes,
  Check,
  Cloud,
  Copy,
  Cpu,
  Download,
  FileCode2,
  FileText,
  FolderOpen,
  GitBranch,
  History,
  Laptop,
  Layers,
  PanelRightClose,
  PanelRightOpen,
  Play,
  Plus,
  RotateCcw,
  Save,
  Share2,
  Sparkles,
  Square,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import {
  clonePublicNotebookAction,
  createNotebookVersionAction,
  deleteNotebookAction,
  listNotebooksAction,
  listNotebookVersionsAction,
  saveNotebookAction,
  toggleShareNotebookAction,
  uploadNotebookDatasetAction,
} from "@/actions/notebook/notebooks";
import { convertCodeEntryToNotebook, createStarterNotebook, mapLanguageToKernel } from "@/lib/notebook/curriculum-converter";
import {
  analyzeNotebookDag,
  getTopologicalDownstreamCellIds,
} from "@/lib/notebook/dag-analyzer";
import {
  parseIpynb,
  serializeNotebookToMarkdown,
  serializeToIpynb,
} from "@/lib/notebook/ipynb-codec";
import { NotebookKernelRouter } from "@/lib/notebook/kernel-router";
import {
  deleteLocalNotebook,
  getLocalNotebook,
  listLocalNotebooks,
  listLocalNotebookVersions,
  saveLocalNotebook,
  saveLocalNotebookVersion,
} from "@/lib/notebook/local-notebook-store";
import type {
  KernelBootState,
  NotebookCell,
  NotebookDocument,
  NotebookKernel,
  NotebookVersion,
  SqlTableMeta,
  VariableSummary,
  VfsFileEntry,
} from "@/lib/notebook/types";
import {
  deleteVfsFile,
  listVfsFiles,
  readVfsFileBytes,
} from "@/lib/notebook/vfs-manager";
import { AICellCopilot } from "./ai-cell-copilot";
import { CellItem } from "./cell-item";
import { DagPanel } from "./dag-panel";
import { FileExplorerPanel } from "./file-explorer-panel";
import { RuntimeConnectionModal } from "./runtime-connection-modal";
import { TouchSymbolBar } from "./touch-symbol-bar";
import { VariableInspectorPanel } from "./variable-inspector-panel";
import { VersionDiffDrawer } from "./version-diff-drawer";

interface NotebookWorkbenchProps {
  initialDocument?: NotebookDocument;
  lookupId?: string;
  readOnly?: boolean;
  shareSlug?: string;
}

type InspectorTab = "variables" | "files" | "dag" | "ai";
type MobileViewTab = "cells" | InspectorTab;

const KERNEL_STATUS_LABELS: Record<KernelBootState, string> = {
  idle: "Siap (Idle)",
  loading: "Memuat Pyodide 3.12...",
  ready: "Kernel Aktif",
  executing: "Mengeksekusi...",
  installing_pkg: "Memasang Paket...",
  error: "Error Kernel",
  disconnected: "Terputus",
};

export function NotebookWorkbench({
  initialDocument,
  lookupId,
  readOnly = false,
  shareSlug,
}: NotebookWorkbenchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [doc, setDoc] = useState<NotebookDocument>(
    () => initialDocument || createStarterNotebook("python")
  );
  const [activeCellId, setActiveCellId] = useState<string>(
    () => (initialDocument || createStarterNotebook("python")).cells[0]?.id || ""
  );
  const [runningCellIds, setRunningCellIds] = useState<Set<string>>(new Set());
  const [execCounter, setExecCounter] = useState(1);

  const [kernelStates, setKernelStates] = useState<
    Record<NotebookKernel, KernelBootState>
  >({
    python: "idle",
    sql: "idle",
    javascript: "idle",
    typescript: "idle",
  });
  const [kernelDetail, setKernelDetail] = useState<string>("");

  const [variables, setVariables] = useState<VariableSummary[]>([]);
  const [sqlTables, setSqlTables] = useState<SqlTableMeta[]>([]);
  const [installedPackages, setInstalledPackages] = useState<string[]>([]);
  const [vfsFiles, setVfsFiles] = useState<VfsFileEntry[]>([]);

  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("variables");
  const [mobileTab, setMobileTab] = useState<MobileViewTab>("cells");
  const [tabletDrawerOpen, setTabletDrawerOpen] = useState(false);

  const [singleCellFocus, setSingleCellFocus] = useState(false);
  const [libraryDrawerOpen, setLibraryDrawerOpen] = useState(false);
  const [savedLibrary, setSavedLibrary] = useState<NotebookDocument[]>([]);
  const [versionsDrawerOpen, setVersionsDrawerOpen] = useState(false);
  const [versions, setVersions] = useState<NotebookVersion[]>([]);
  const [runtimeModalOpen, setRuntimeModalOpen] = useState(false);
  const [isCloudAuthenticated, setIsCloudAuthenticated] = useState(false);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [cloningShare, setCloningShare] = useState(false);

  const insertHandlerRef = useRef<
    ((snippet: string, cursorBackOffset?: number) => void) | null
  >(null);
  const [touchBarVisible, setTouchBarVisible] = useState(false);
  const ipynbInputRef = useRef<HTMLInputElement>(null);

  const routerRef = useRef<NotebookKernelRouter | null>(null);
  const docRef = useRef(doc);
  docRef.current = doc;

  // Initialize kernel router and subscribe to telemetry
  useEffect(() => {
    const kr = new NotebookKernelRouter(doc.id);
    kr.setRuntimeMode(doc.runtimeMode);
    routerRef.current = kr;

    const unsubStatus = kr.onStatus((ev) => {
      setKernelStates((prev) => ({ ...prev, [ev.kernel]: ev.state }));
      if (ev.detail) setKernelDetail(ev.detail);
    });
    const unsubTelemetry = kr.onTelemetry((snap) => {
      setVariables(snap.variables);
      setSqlTables(snap.tables);
      setInstalledPackages(snap.installedPackages);
    });

    void listVfsFiles(doc.id).then(setVfsFiles);

    return () => {
      unsubStatus();
      unsubTelemetry();
      kr.dispose();
      routerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc.id]);

  // Load from local IndexedDB when navigated via /dashboard/playground/[id] without cloud match
  useEffect(() => {
    if (initialDocument || !lookupId) return;
    void getLocalNotebook(lookupId).then((localDoc) => {
      if (localDoc) {
        setDoc(localDoc);
        setActiveCellId(localDoc.cells[0]?.id || "");
      }
    });
  }, [initialDocument, lookupId]);

  // Handle deep links (?codeId=..., ?code=...&lang=..., ?starter=..., ?task=...&test=...) when opened on /dashboard/playground
  useEffect(() => {
    if (initialDocument || readOnly) return;

    const codeId = searchParams.get("codeId");
    const rawCode = searchParams.get("code");
    const langParam = searchParams.get("lang");
    const starterParam = searchParams.get("starter") as NotebookKernel | null;
    const taskParam = searchParams.get("task");
    const testParam = searchParams.get("test");

    if (codeId) {
      fetch(`/api/kode?codeId=${encodeURIComponent(codeId)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.entry) {
            const nb = convertCodeEntryToNotebook(data.entry);
            setDoc(nb);
            setActiveCellId(nb.cells[1]?.id || nb.cells[0]?.id || "");
          }
        })
        .catch(() => {});
      return;
    }

    if (rawCode) {
      const kernel = mapLanguageToKernel(langParam || "python");
      const now = Date.now();
      const cells: NotebookCell[] = [];
      if (taskParam) {
        cells.push({
          id: `md_${now}`,
          type: "markdown",
          kernel,
          source: `### Tugas Praktikum\n\n${taskParam}`,
          outputs: [],
          executionCount: null,
          executionOrder: null,
          timingMs: null,
          lastModifiedAt: now,
          lastExecutedAt: null,
        });
      }
      const codeCellId = `code_${now}`;
      cells.push({
        id: codeCellId,
        type: "code",
        kernel,
        source: rawCode,
        outputs: [],
        executionCount: null,
        executionOrder: null,
        timingMs: null,
        lastModifiedAt: now,
        lastExecutedAt: null,
        testAssertions: testParam || undefined,
      });

      const base = createStarterNotebook(kernel);
      setDoc({
        ...base,
        title: taskParam ? "Latihan Praktikum Interaktif" : "Eksperimen Kode",
        cells,
      });
      setActiveCellId(codeCellId);
      return;
    }

    if (
      starterParam &&
      ["python", "sql", "javascript", "typescript"].includes(starterParam)
    ) {
      const nb = createStarterNotebook(starterParam);
      setDoc(nb);
      setActiveCellId(nb.cells[1]?.id || nb.cells[0]?.id || "");
    }
  }, [initialDocument, readOnly, searchParams]);

  // Debounced autosave to local IndexedDB
  useEffect(() => {
    if (readOnly) return;
    const timer = setTimeout(() => {
      void saveLocalNotebook(doc);
    }, 800);
    return () => clearTimeout(timer);
  }, [doc, readOnly]);

  // Load saved notebooks & versions
  const refreshLibrary = useCallback(async () => {
    const [localList, cloudRes] = await Promise.all([
      listLocalNotebooks(),
      listNotebooksAction(),
    ]);
    setIsCloudAuthenticated(cloudRes.authenticated);
    const mergedMap = new Map<string, NotebookDocument>();
    cloudRes.notebooks.forEach((n) => mergedMap.set(n.id, n));
    localList.forEach((n) => {
      if (!mergedMap.has(n.id)) mergedMap.set(n.id, n);
    });
    setSavedLibrary(Array.from(mergedMap.values()));
  }, []);

  useEffect(() => {
    if (!readOnly) {
      void refreshLibrary();
    }
  }, [readOnly, refreshLibrary]);

  const refreshVersions = useCallback(async () => {
    const [localVers, cloudVers] = await Promise.all([
      listLocalNotebookVersions(docRef.current.id),
      listNotebookVersionsAction(docRef.current.id),
    ]);
    const map = new Map<string, NotebookVersion>();
    cloudVers.versions.forEach((v) => map.set(v.id, v));
    localVers.forEach((v) => {
      if (!map.has(v.id)) map.set(v.id, v);
    });
    setVersions(
      Array.from(map.values()).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  }, []);

  const dagNodes = useMemo(
    () => analyzeNotebookDag(doc.cells, runningCellIds),
    [doc.cells, runningCellIds]
  );
  const dagMap = useMemo(
    () => new Map(dagNodes.map((n) => [n.cellId, n])),
    [dagNodes]
  );

  const updateCell = useCallback(
    (cellId: string, patch: Partial<NotebookCell>) => {
      setDoc((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        cells: prev.cells.map((c) => (c.id === cellId ? { ...c, ...patch } : c)),
      }));
    },
    []
  );

  const runSingleCell = useCallback(
    async (cellId: string, cascadeReactive = true) => {
      const kr = routerRef.current;
      const targetCell = docRef.current.cells.find((c) => c.id === cellId);
      if (!kr || !targetCell || targetCell.type !== "code") return;

      setRunningCellIds((prev) => new Set(prev).add(cellId));
      const orderNum = execCounter;
      setExecCounter((n) => n + 1);

      const res = await kr.executeCell({
        cellId,
        kernel: targetCell.kernel,
        code: targetCell.source,
        testAssertions: targetCell.testAssertions,
      });

      setRunningCellIds((prev) => {
        const next = new Set(prev);
        next.delete(cellId);
        return next;
      });

      const finishedAt = Date.now();
      setDoc((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        cells: prev.cells.map((c) =>
          c.id === cellId
            ? {
                ...c,
                outputs: res.outputs,
                executionCount: orderNum,
                executionOrder: orderNum,
                timingMs: res.executionMs,
                lastExecutedAt: finishedAt,
              }
            : c
        ),
      }));

      void listVfsFiles(docRef.current.id).then(setVfsFiles);

      // Reactive DAG execution: automatically re-run downstream dependents
      if (cascadeReactive && docRef.current.reactiveMode && res.success) {
        const downstreamIds = getTopologicalDownstreamCellIds(
          docRef.current.cells,
          cellId
        );
        for (const downId of downstreamIds) {
          await runSingleCell(downId, false);
        }
      }
    },
    [execCounter]
  );

  const runAllCells = useCallback(async () => {
    const codeCells = docRef.current.cells.filter((c) => c.type === "code");
    for (const cell of codeCells) {
      await runSingleCell(cell.id, false);
    }
  }, [runSingleCell]);

  const runStaleCells = useCallback(async () => {
    const staleIds = dagNodes
      .filter((n) => n.status === "stale" || n.status === "out_of_order")
      .map((n) => n.cellId);
    for (const cid of staleIds) {
      await runSingleCell(cid, false);
    }
  }, [dagNodes, runSingleCell]);

  const handleRestartAndRunAll = async () => {
    routerRef.current?.terminateKernel();
    toast.info("Kernel di-reset. Menjalankan ulang seluruh sel...");
    await runAllCells();
  };

  const handleSaveCloud = async () => {
    setSyncingCloud(true);
    try {
      await saveLocalNotebook(doc);
      const res = await saveNotebookAction(doc);
      if (res.savedToCloud && res.notebook) {
        setDoc(res.notebook);
        toast.success("Notebook berhasil disimpan ke Cloud & Offline VFS!");
        void refreshLibrary();
      } else {
        toast.info(res.error || "Tersimpan di penyimpanan lokal browser.");
      }
    } finally {
      setSyncingCloud(false);
    }
  };

  const handleCreateCheckpoint = async (label: string) => {
    const localVer: NotebookVersion = {
      id: `ver_${Date.now()}`,
      notebookId: doc.id,
      label,
      cellsSnapshot: structuredClone(doc.cells),
      createdAt: new Date().toISOString(),
    };
    await saveLocalNotebookVersion(localVer);
    await createNotebookVersionAction(doc.id, label, doc.cells);
    await refreshVersions();
    toast.success(`Checkpoint "${label}" disimpan.`);
  };

  const handleImportIpynb = async (file: File) => {
    try {
      const text = await file.text();
      const imported = parseIpynb(text, file.name.replace(/\.ipynb$/i, ""));
      setDoc(imported);
      setActiveCellId(imported.cells[0]?.id || "");
      toast.success(`Notebook "${imported.title}" berhasil diimpor (${imported.cells.length} sel).`);
    } catch (err: any) {
      toast.error(err?.message || "Gagal mengimpor file .ipynb.");
    }
  };

  const handleExportIpynb = () => {
    const json = serializeToIpynb(doc);
    const blob = new Blob([json], { type: "application/x-ipynb+json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zA-Z0-9_-]+/g, "_") || "notebook"}.ipynb`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File .ipynb berhasil diunduh.");
  };

  const handleExportMarkdown = () => {
    const md = serializeNotebookToMarkdown(doc);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zA-Z0-9_-]+/g, "_") || "catatan-lab"}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Markdown Notebook diunduh (siap diimpor ke Vault Catatan).");
  };

  const handleShareToggle = async () => {
    const res = await saveNotebookAction(doc);
    const targetId = res.notebook?.id || doc.id;
    const shareRes = await toggleShareNotebookAction(targetId, true);
    if (shareRes.shareSlug) {
      setDoc((prev) => ({
        ...prev,
        id: targetId,
        isPublic: true,
        shareSlug: shareRes.shareSlug,
      }));
      const shareUrl = `${window.location.origin}/dashboard/playground/share/${shareRes.shareSlug}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Tautan publik notebook disalin ke clipboard!");
    } else {
      toast.error(shareRes.error || "Masuk untuk membagikan notebook publik.");
    }
  };

  const handleCloneShare = async () => {
    if (!shareSlug) return;
    setCloningShare(true);
    try {
      const res = await clonePublicNotebookAction(shareSlug);
      if (res.notebookId) {
        toast.success("Notebook disalin ke akun Anda!");
        router.push(`/dashboard/playground/${res.notebookId}`);
      } else {
        // Fallback: save locally and open in /dashboard/playground
        const cloned = { ...createStarterNotebook(doc.defaultKernel), ...doc, id: crypto.randomUUID(), isPublic: false };
        await saveLocalNotebook(cloned);
        toast.info("Disalin ke penyimpanan lokal Anda.");
      }
    } finally {
      setCloningShare(false);
    }
  };

  const handleUploadFiles = async (files: FileList) => {
    const kr = routerRef.current;
    if (!kr) return;
    for (const f of Array.from(files)) {
      const buf = new Uint8Array(await f.arrayBuffer());
      await kr.ingestWorkspaceFile(f.name, buf, f.type || "application/octet-stream");
      const fd = new FormData();
      fd.set("file", f);
      fd.set("notebookId", doc.id);
      void uploadNotebookDatasetAction(fd);
    }
    const list = await listVfsFiles(doc.id);
    setVfsFiles(list);
    toast.success(`${files.length} file diunggah ke /workspace.`);
  };

  const addCell = (
    type: "code" | "markdown",
    afterCellId?: string,
    prefillCode?: string,
    kernelOverride?: NotebookKernel
  ) => {
    const now = Date.now();
    const newCell: NotebookCell = {
      id: `${type === "markdown" ? "md" : "c"}_${now}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      kernel: kernelOverride || doc.defaultKernel,
      source: prefillCode || "",
      outputs: [],
      executionCount: null,
      executionOrder: null,
      timingMs: null,
      lastModifiedAt: now,
      lastExecutedAt: null,
    };

    setDoc((prev) => {
      const idx = afterCellId
        ? prev.cells.findIndex((c) => c.id === afterCellId)
        : prev.cells.length - 1;
      const copy = [...prev.cells];
      copy.splice(idx >= 0 ? idx + 1 : copy.length, 0, newCell);
      return { ...prev, cells: copy, updatedAt: new Date().toISOString() };
    });
    setActiveCellId(newCell.id);
  };

  const activeCell = useMemo(
    () => doc.cells.find((c) => c.id === activeCellId) || doc.cells[0],
    [doc.cells, activeCellId]
  );

  const activeCellError = useMemo(() => {
    const err = activeCell?.outputs?.find((o) => o.kind === "error");
    return err && err.kind === "error"
      ? `${err.ename}: ${err.evalue}\n${err.traceback.join("\n")}`
      : undefined;
  }, [activeCell]);

  const activeKernelState = kernelStates[activeCell?.kernel || doc.defaultKernel];

  const displayedCells = singleCellFocus && activeCell ? [activeCell] : doc.cells;

  const inspectorContent = (tab: InspectorTab) => {
    if (tab === "variables") {
      return (
        <VariableInspectorPanel
          variables={variables}
          tables={sqlTables}
          installedPackages={installedPackages}
          onInsertExpression={(expr) => {
            if (insertHandlerRef.current) {
              insertHandlerRef.current(expr);
            } else {
              addCell("code", activeCell?.id, expr);
            }
          }}
        />
      );
    }
    if (tab === "files") {
      return (
        <FileExplorerPanel
          files={vfsFiles}
          onUploadFiles={handleUploadFiles}
          onDeleteFile={async (path) => {
            await deleteVfsFile(doc.id, path);
            setVfsFiles(await listVfsFiles(doc.id));
            toast.success("File dihapus dari /workspace.");
          }}
          onDownloadFile={async (path, name) => {
            const bytes = await readVfsFileBytes(doc.id, path);
            if (!bytes) return;
            const copy = new Uint8Array(bytes.byteLength);
            copy.set(bytes);
            const blob = new Blob([copy]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = name;
            a.click();
            URL.revokeObjectURL(url);
          }}
          onInsertSnippet={(snippet, kernelHint) => {
            addCell("code", activeCell?.id, snippet, kernelHint);
            setMobileTab("cells");
            setTabletDrawerOpen(false);
          }}
        />
      );
    }
    if (tab === "dag") {
      return (
        <DagPanel
          nodes={dagNodes}
          reactiveMode={doc.reactiveMode}
          onToggleReactiveMode={(next) =>
            setDoc((prev) => ({ ...prev, reactiveMode: next }))
          }
          onRunStaleCells={() => void runStaleCells()}
          onFocusCell={(cid) => {
            setActiveCellId(cid);
            setMobileTab("cells");
            setTabletDrawerOpen(false);
            document
              .getElementById(`nb-cell-${cid}`)
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
        />
      );
    }
    return (
      <AICellCopilot
        activeKernel={activeCell?.kernel || doc.defaultKernel}
        activeCellSource={activeCell?.source || ""}
        activeCellError={activeCellError}
        surroundingCode={doc.cells
          .filter((c) => c.type === "code" && c.id !== activeCell?.id)
          .slice(0, 3)
          .map((c) => c.source)
          .join("\n\n")}
        variables={variables}
        sqlTables={sqlTables}
        onApplyPatch={(patchedCode, andRun) => {
          if (!activeCell) return;
          updateCell(activeCell.id, {
            source: patchedCode,
            lastModifiedAt: Date.now(),
          });
          setMobileTab("cells");
          if (andRun) {
            setTimeout(() => void runSingleCell(activeCell.id), 40);
          }
        }}
        onInsertNewCell={(code, kernel) => {
          addCell("code", activeCell?.id, code, kernel);
          setMobileTab("cells");
        }}
      />
    );
  };

  return (
    <div className="w-full space-y-3.5 pb-14 lg:pb-6">
      {/* Hidden .ipynb upload input */}
      <input
        ref={ipynbInputRef}
        type="file"
        accept=".ipynb"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleImportIpynb(file);
          e.target.value = "";
        }}
      />

      {/* ─── TOP NOTEBOOK WORKSPACE HEADER ─── */}
      <div className="rounded-2xl border border-border bg-surface p-3.5 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Notebook Identity & Title */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {!readOnly && (
              <button
                type="button"
                onClick={() => {
                  void refreshLibrary();
                  setLibraryDrawerOpen(true);
                }}
                className="min-h-[40px] min-w-[40px] px-2.5 rounded-xl border border-border bg-surface-secondary/60 hover:bg-surface-secondary text-text-primary inline-flex items-center gap-1.5 text-xs font-mono font-semibold cursor-pointer shrink-0"
                title="Buka Daftar Notebook Saya"
              >
                <Layers className="w-4 h-4 text-[#C2553A]" />
                <span className="hidden sm:inline">Notebook</span>
              </button>
            )}

            <div className="min-w-0 flex-1">
              {readOnly ? (
                <h1 className="text-base sm:text-lg font-bold text-text-primary truncate">
                  {doc.title}
                </h1>
              ) : (
                <input
                  type="text"
                  value={doc.title}
                  onChange={(e) =>
                    setDoc((prev) => ({
                      ...prev,
                      title: e.target.value,
                      updatedAt: new Date().toISOString(),
                    }))
                  }
                  aria-label="Judul Notebook"
                  className="w-full bg-transparent text-base sm:text-lg font-bold text-text-primary border-b border-transparent focus:border-[#C2553A] focus:outline-hidden truncate py-0.5"
                />
              )}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-text-secondary">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeKernelState === "executing" ||
                      activeKernelState === "loading"
                        ? "bg-amber-500"
                        : activeKernelState === "error"
                        ? "bg-rose-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  <span>
                    {KERNEL_STATUS_LABELS[activeKernelState]}
                    {kernelDetail ? ` • ${kernelDetail}` : ""}
                  </span>
                </span>
                {isCloudAuthenticated && !readOnly && (
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300">
                    • Cloud Sync Siap
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-wrap items-center gap-1.5">
            {readOnly && (
              <button
                type="button"
                disabled={cloningShare}
                onClick={handleCloneShare}
                className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#C2553A] hover:bg-[#D4664A] text-white text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{cloningShare ? "Menyalin..." : "Salin & Edit"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => void runAllCells()}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#C2553A] hover:bg-[#D4664A] text-white text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Jalankan seluruh sel dari atas ke bawah"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run All</span>
            </button>

            {runningCellIds.size > 0 && (
              <button
                type="button"
                onClick={() => {
                  routerRef.current?.terminateKernel();
                  setRunningCellIds(new Set());
                  toast.warning("Eksekusi kernel dihentikan (Interrupt).");
                }}
                className="min-h-[40px] px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Hentikan</span>
              </button>
            )}

            {!readOnly && (
              <>
                <button
                  type="button"
                  onClick={handleRestartAndRunAll}
                  className="min-h-[40px] px-2.5 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-xs font-mono text-text-primary inline-flex items-center gap-1.5 cursor-pointer"
                  title="Reset kernel & jalankan seluruh sel"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Restart</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRuntimeModalOpen(true)}
                  className="min-h-[40px] px-2.5 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-xs font-mono text-text-primary inline-flex items-center gap-1.5 cursor-pointer"
                  title="Pilih Browser WASM vs Local/GPU Runtime"
                >
                  {doc.runtimeMode === "remote_ws" ? (
                    <Laptop className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Cpu className="w-3.5 h-3.5 text-[#C2553A]" />
                  )}
                  <span className="hidden sm:inline">
                    {doc.runtimeMode === "remote_ws" ? "GPU Bridge" : "WASM"}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={syncingCloud}
                  onClick={handleSaveCloud}
                  className="min-h-[40px] px-2.5 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-xs font-mono text-text-primary inline-flex items-center gap-1.5 cursor-pointer"
                  title="Simpan ke Cloud & Lokal"
                >
                  {isCloudAuthenticated ? (
                    <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Save className="w-3.5 h-3.5 text-[#C2553A]" />
                  )}
                  <span className="hidden sm:inline">
                    {syncingCloud ? "Menyimpan..." : "Simpan"}
                  </span>
                </button>
              </>
            )}

            {/* Tablet Slide-Over Inspector Toggle (768px-1023px) */}
            <button
              type="button"
              onClick={() => setTabletDrawerOpen(true)}
              className="hidden md:inline-flex lg:hidden min-h-[40px] px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-xs font-mono font-semibold text-text-primary items-center gap-1.5 cursor-pointer"
            >
              <PanelRightOpen className="w-4 h-4 text-[#C2553A]" />
              <span>Inspektor</span>
            </button>

            {/* Desktop Inspector Collapse Toggle (>=1024px) */}
            <button
              type="button"
              onClick={() => setInspectorOpen((p) => !p)}
              className="hidden lg:inline-flex min-h-[40px] px-2.5 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-xs font-mono text-text-secondary cursor-pointer items-center gap-1.5"
              title="Tutup / buka panel kanan"
            >
              {inspectorOpen ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRightOpen className="w-4 h-4 text-[#C2553A]" />
              )}
            </button>
          </div>
        </div>

        {/* Secondary Studio Controls Strip */}
        {!readOnly && (
          <div className="pt-2 border-t border-border/70 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setDoc((prev) => ({ ...prev, reactiveMode: !prev.reactiveMode }))
                }
                className={`min-h-[34px] px-2.5 py-1 rounded-lg border inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                  doc.reactiveMode
                    ? "bg-[#C2553A]/15 border-[#C2553A]/40 text-[#C2553A] dark:text-[#D4664A] font-bold"
                    : "bg-surface-secondary/50 border-border text-text-secondary"
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Reaktif: {doc.reactiveMode ? "ON" : "OFF"}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setDoc((prev) => ({
                    ...prev,
                    editorMode:
                      prev.editorMode === "codemirror" ? "lite" : "codemirror",
                  }))
                }
                className="min-h-[34px] px-2.5 py-1 rounded-lg border border-border bg-surface-secondary/50 hover:bg-surface-secondary text-text-secondary inline-flex items-center gap-1 cursor-pointer"
                title="Beralih antara CodeMirror 6 IDE atau Editor Teks Ringan"
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>
                  Editor: {doc.editorMode === "codemirror" ? "IDE (CM6)" : "Lite"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSingleCellFocus((p) => !p)}
                className={`min-h-[34px] px-2.5 py-1 rounded-lg border inline-flex items-center gap-1 cursor-pointer ${
                  singleCellFocus
                    ? "bg-brand-500/15 border-brand-500/35 text-brand-700 dark:text-brand-300 font-bold"
                    : "bg-surface-secondary/50 border-border text-text-secondary"
                }`}
              >
                <span>{singleCellFocus ? "Mode: Sel Tunggal" : "Mode: Multi-Sel"}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => ipynbInputRef.current?.click()}
                className="min-h-[34px] px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary inline-flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Impor .ipynb</span>
              </button>
              <button
                type="button"
                onClick={handleExportIpynb}
                className="min-h-[34px] px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary inline-flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>.ipynb</span>
              </button>
              <button
                type="button"
                onClick={handleExportMarkdown}
                className="hidden sm:inline-flex min-h-[34px] px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                <span>Ekspor .md</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  void refreshVersions();
                  setVersionsDrawerOpen(true);
                }}
                className="min-h-[34px] px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary inline-flex items-center gap-1 cursor-pointer"
              >
                <History className="w-3 h-3" />
                <span>Riwayat ({versions.length})</span>
              </button>
              <button
                type="button"
                onClick={handleShareToggle}
                className="min-h-[34px] px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary inline-flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="w-3 h-3" />
                <span>Bagikan</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── MOBILE TAB SWITCHER (< 768px) ─── */}
      <div className="grid grid-cols-5 gap-1 p-1 rounded-2xl border border-border bg-surface md:hidden">
        {(
          [
            { id: "cells", label: "Sel", icon: FileCode2 },
            { id: "variables", label: "Variabel", icon: Boxes },
            { id: "files", label: "File", icon: FolderOpen },
            { id: "dag", label: "DAG", icon: GitBranch },
            { id: "ai", label: "AI", icon: Sparkles },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isSel = mobileTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMobileTab(tab.id)}
              className={`min-h-[42px] px-1.5 py-1 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-mono font-semibold cursor-pointer transition-colors ${
                isSel
                  ? "bg-[#C2553A] text-white"
                  : "text-text-secondary hover:bg-surface-secondary"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── MAIN STUDIO SPLIT WORKSPACE ─── */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Cells Canvas */}
        <div
          className={`flex-1 w-full min-w-0 space-y-3 ${
            mobileTab !== "cells" ? "hidden md:block" : "block"
          }`}
        >
          {displayedCells.map((cell) => {
            const realIndex = doc.cells.findIndex((c) => c.id === cell.id);
            return (
              <CellItem
                key={cell.id}
                cell={cell}
                index={realIndex}
                totalCells={doc.cells.length}
                isActive={activeCell?.id === cell.id}
                isRunning={runningCellIds.has(cell.id)}
                dagInfo={dagMap.get(cell.id)}
                variables={variables}
                sqlTables={sqlTables}
                editorMode={doc.editorMode}
                readOnly={readOnly}
                surroundingCode={doc.cells
                  .filter((c) => c.type === "code" && c.id !== cell.id)
                  .slice(0, 3)
                  .map((c) => c.source)
                  .join("\n\n")}
                onActivate={() => setActiveCellId(cell.id)}
                onUpdateCell={(patch) => updateCell(cell.id, patch)}
                onRunCell={() => void runSingleCell(cell.id)}
                onRunAndAdvance={() => {
                  void runSingleCell(cell.id);
                  const next = doc.cells[realIndex + 1];
                  if (next) setActiveCellId(next.id);
                  else addCell("code", cell.id);
                }}
                onMoveCell={(dir) => {
                  const targetIdx = realIndex + dir;
                  if (targetIdx < 0 || targetIdx >= doc.cells.length) return;
                  setDoc((prev) => {
                    const nextCells = [...prev.cells];
                    const [moved] = nextCells.splice(realIndex, 1);
                    nextCells.splice(targetIdx, 0, moved);
                    return { ...prev, cells: nextCells };
                  });
                }}
                onDeleteCell={() => {
                  setDoc((prev) => {
                    if (prev.cells.length <= 1) return prev;
                    const nextCells = prev.cells.filter((c) => c.id !== cell.id);
                    if (activeCellId === cell.id) {
                      setActiveCellId(nextCells[Math.max(0, realIndex - 1)]?.id || "");
                    }
                    return { ...prev, cells: nextCells };
                  });
                }}
                onDuplicateCell={() =>
                  addCell(cell.type, cell.id, cell.source, cell.kernel)
                }
                onAddBelow={(t, prefill, kernelOvr) =>
                  addCell(t, cell.id, prefill, kernelOvr)
                }
                onFocusInsertHandler={(fn) => {
                  insertHandlerRef.current = fn;
                  setTouchBarVisible(Boolean(fn));
                }}
              />
            );
          })}

          {!readOnly && (
            <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => addCell("code")}
                className="min-h-[42px] px-4 py-2 rounded-xl border border-dashed border-border hover:border-[#C2553A] bg-surface hover:bg-surface-secondary text-xs font-mono font-semibold text-text-primary inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C2553A]" />
                <span>Tambah Sel Kode ({doc.defaultKernel})</span>
              </button>
              <button
                type="button"
                onClick={() => addCell("markdown")}
                className="min-h-[42px] px-4 py-2 rounded-xl border border-dashed border-border hover:border-[#C2553A] bg-surface hover:bg-surface-secondary text-xs font-mono font-semibold text-text-primary inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C2553A]" />
                <span>Tambah Sel Markdown</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Non-Cell Tab Content (< 768px) */}
        {mobileTab !== "cells" && (
          <div className="w-full md:hidden rounded-2xl border border-border bg-surface p-4">
            {inspectorContent(mobileTab)}
          </div>
        )}

        {/* Desktop Persistent Right Inspector Panel (>= 1024px) */}
        {inspectorOpen && (
          <aside className="hidden lg:flex flex-col w-[360px] xl:w-[400px] shrink-0 rounded-2xl border border-border bg-surface shadow-2xs overflow-hidden sticky top-5 max-h-[calc(100dvh-2.5rem)]">
            <div className="grid grid-cols-4 border-b border-border bg-[#F3EFE9]/60 dark:bg-[#141210] p-1 gap-1 shrink-0">
              {(
                [
                  { id: "variables", label: "Variabel", icon: Boxes },
                  { id: "files", label: "File", icon: FolderOpen },
                  { id: "dag", label: "DAG", icon: GitBranch },
                  { id: "ai", label: "AI", icon: Sparkles },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const active = inspectorTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setInspectorTab(tab.id)}
                    className={`min-h-[36px] px-2 py-1 rounded-xl text-[11px] font-mono font-semibold inline-flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      active
                        ? "bg-[#C2553A] text-white"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 overflow-y-auto flex-1 scrollbar-thin">
              {inspectorContent(inspectorTab)}
            </div>
          </aside>
        )}
      </div>

      {/* Tablet Slide-Over Inspector Drawer (768px–1023px) */}
      {tabletDrawerOpen && (
        <div
          className="fixed inset-0 z-50 hidden md:flex lg:hidden justify-end bg-black/55 backdrop-blur-xs"
          onClick={() => setTabletDrawerOpen(false)}
        >
          <aside
            className="w-96 max-w-[90vw] h-full bg-surface border-l border-border shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2 border-b border-border flex items-center justify-between gap-2 bg-[#F3EFE9]/70 dark:bg-[#141210]">
              <div className="grid grid-cols-4 gap-1 flex-1">
                {(
                  [
                    { id: "variables", label: "Variabel" },
                    { id: "files", label: "File" },
                    { id: "dag", label: "DAG" },
                    { id: "ai", label: "AI" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setInspectorTab(t.id)}
                    className={`min-h-[36px] rounded-lg text-[11px] font-mono font-semibold cursor-pointer ${
                      inspectorTab === t.id
                        ? "bg-[#C2553A] text-white"
                        : "text-text-secondary hover:bg-surface"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setTabletDrawerOpen(false)}
                className="min-h-[36px] min-w-[36px] rounded-lg border border-border flex items-center justify-center text-text-secondary cursor-pointer"
                aria-label="Tutup panel inspektor"
              >
                <PanelRightClose className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {inspectorContent(inspectorTab)}
            </div>
          </aside>
        </div>
      )}

      {/* Notebook Library Drawer */}
      {libraryDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-start"
          onClick={() => setLibraryDrawerOpen(false)}
        >
          <aside
            className="w-80 sm:w-96 max-w-[90vw] h-full bg-[#FAF8F5] dark:bg-[#100E0D] border-r border-border shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-surface">
              <span className="text-sm font-bold text-text-primary">
                Koleksi Notebook Saya
              </span>
              <button
                type="button"
                onClick={() => setLibraryDrawerOpen(false)}
                className="min-h-[34px] px-2.5 rounded-lg border border-border text-xs font-mono cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="p-3 border-b border-border grid grid-cols-2 gap-2">
              {(["python", "sql", "javascript", "typescript"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    const fresh = createStarterNotebook(k);
                    setDoc(fresh);
                    setActiveCellId(fresh.cells[1]?.id || fresh.cells[0]?.id || "");
                    setLibraryDrawerOpen(false);
                  }}
                  className="min-h-[38px] px-2.5 py-1.5 rounded-xl border border-border bg-surface hover:border-[#C2553A] text-xs font-mono font-semibold text-text-primary flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C2553A]" />
                  <span>Baru ({k.toUpperCase()})</span>
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {savedLibrary.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border space-y-1.5 cursor-pointer transition-colors ${
                    item.id === doc.id
                      ? "bg-[#C2553A]/10 border-[#C2553A]/50"
                      : "bg-surface border-border hover:bg-surface-secondary"
                  }`}
                  onClick={() => {
                    setDoc(item);
                    setActiveCellId(item.cells[0]?.id || "");
                    setLibraryDrawerOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-text-primary truncate">
                      {item.title}
                    </span>
                    {item.id === doc.id && (
                      <Check className="w-3.5 h-3.5 text-[#C2553A] shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-text-tertiary">
                    <span>
                      {item.cells.length} sel • {item.defaultKernel}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        void deleteLocalNotebook(item.id);
                        void deleteNotebookAction(item.id);
                        setSavedLibrary((prev) =>
                          prev.filter((n) => n.id !== item.id)
                        );
                      }}
                      className="text-rose-600 hover:underline cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* Modals & Drawers */}
      <VersionDiffDrawer
        isOpen={versionsDrawerOpen}
        onClose={() => setVersionsDrawerOpen(false)}
        versions={versions}
        currentCells={doc.cells}
        onCreateCheckpoint={handleCreateCheckpoint}
        onRestoreVersion={(cellsSnapshot) => {
          setDoc((prev) => ({
            ...prev,
            cells: structuredClone(cellsSnapshot),
            updatedAt: new Date().toISOString(),
          }));
          toast.success("Notebook dipulihkan ke versi checkpoint terpilih.");
        }}
      />

      <RuntimeConnectionModal
        isOpen={runtimeModalOpen}
        onClose={() => setRuntimeModalOpen(false)}
        runtimeMode={doc.runtimeMode}
        remoteUrl={doc.remoteUrl || ""}
        isRemoteConnected={Boolean(routerRef.current?.getRemoteBridge().isConnected)}
        onSelectWasm={() => {
          routerRef.current?.setRuntimeMode("wasm");
          setDoc((prev) => ({ ...prev, runtimeMode: "wasm" }));
          toast.success("Runtime beralih ke Browser WebAssembly.");
        }}
        onConnectRemote={async (url, token) => {
          if (!routerRef.current) return;
          const info = await routerRef.current.getRemoteBridge().connect(url, token);
          routerRef.current.setRuntimeMode("remote_ws");
          setDoc((prev) => ({
            ...prev,
            runtimeMode: "remote_ws",
            remoteUrl: url,
          }));
          toast.success(`Terhubung ke Remote Kernel ${info.kernelName} (${info.kernelId.slice(0, 8)}).`);
        }}
        onDisconnectRemote={() => {
          routerRef.current?.getRemoteBridge().disconnect();
          routerRef.current?.setRuntimeMode("wasm");
          setDoc((prev) => ({ ...prev, runtimeMode: "wasm" }));
          toast.info("Koneksi Remote Kernel diputus.");
        }}
      />

      {/* Sticky Touch Coding Bar on Mobile/Tablet */}
      {!readOnly && (
        <TouchSymbolBar
          visible={touchBarVisible && mobileTab === "cells"}
          onInsertSymbol={(snippet, backOffset) =>
            insertHandlerRef.current?.(snippet, backOffset)
          }
          onRunActiveCell={
            activeCell && activeCell.type === "code"
              ? () => void runSingleCell(activeCell.id)
              : undefined
          }
        />
      )}
    </div>
  );
}
