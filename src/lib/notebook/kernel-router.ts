import type {
  DataFramePayload,
  KernelBootState,
  KernelExecutionRequest,
  KernelExecutionResult,
  NotebookKernel,
  SqlTableMeta,
  VariableSummary,
} from "./types";
import {
  parseTabularDataset,
  readAllVfsFiles,
  readVfsFileBytes,
  writeVfsFile,
} from "./vfs-manager";
import { RemoteJupyterBridge } from "./remote-kernel-bridge";

export type KernelStatusListener = (event: {
  kernel: NotebookKernel;
  state: KernelBootState;
  detail?: string;
}) => void;

export type KernelTelemetryListener = (snapshot: {
  variables: VariableSummary[];
  tables: SqlTableMeta[];
  installedPackages: string[];
}) => void;

interface PendingWorkerJob {
  resolve: (value: any) => void;
  reject: (err: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

const SQL_SNAPSHOT_VFS_PATH = "/workspace/.velqora_session.sqlite";

/**
 * Koordinator multi-kernel Notebook ("Colab++") di browser:
 * mengelola Pyodide Worker (Python 3.12), Persistent SQLite Worker (sql.js),
 * ES Module JS/TS Worker, OPFS Virtual FS, Cross-Kernel DataFrame Bridge,
 * serta Optional Remote GPU WebSocket Bridge.
 */
export class NotebookKernelRouter {
  private notebookId: string;
  private pyodideWorker: Worker | null = null;
  private sqlWorker: Worker | null = null;
  private jstsWorker: Worker | null = null;
  private remoteBridge = new RemoteJupyterBridge();
  private runtimeMode: "wasm" | "remote_ws" = "wasm";

  private pending = new Map<string, PendingWorkerJob>();
  private queue: Promise<unknown> = Promise.resolve();

  private kernelStates: Record<NotebookKernel, KernelBootState> = {
    python: "idle",
    sql: "idle",
    javascript: "idle",
    typescript: "idle",
  };

  private variablesByKernel: Partial<Record<NotebookKernel, VariableSummary[]>> = {};
  private sqlTables: SqlTableMeta[] = [];
  private exportedDataFrames: Record<string, DataFramePayload> = {};
  private installedPackages: string[] = [];

  private statusListeners = new Set<KernelStatusListener>();
  private telemetryListeners = new Set<KernelTelemetryListener>();

  constructor(notebookId: string) {
    this.notebookId = notebookId;
  }

  setNotebookId(nextId: string) {
    this.notebookId = nextId;
  }

  setRuntimeMode(mode: "wasm" | "remote_ws") {
    this.runtimeMode = mode;
  }

  getRemoteBridge(): RemoteJupyterBridge {
    return this.remoteBridge;
  }

  getKernelState(kernel: NotebookKernel): KernelBootState {
    return this.kernelStates[kernel];
  }

  onStatus(listener: KernelStatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  onTelemetry(listener: KernelTelemetryListener): () => void {
    this.telemetryListeners.add(listener);
    return () => this.telemetryListeners.delete(listener);
  }

  private emitStatus(kernel: NotebookKernel, state: KernelBootState, detail?: string) {
    this.kernelStates[kernel] = state;
    this.statusListeners.forEach((fn) => fn({ kernel, state, detail }));
  }

  private emitTelemetry() {
    const mergedVars: VariableSummary[] = [
      ...(this.variablesByKernel.python || []),
      ...(this.variablesByKernel.sql || []),
      ...(this.variablesByKernel.javascript || []),
    ];
    this.telemetryListeners.forEach((fn) =>
      fn({
        variables: mergedVars,
        tables: this.sqlTables,
        installedPackages: this.installedPackages,
      })
    );
  }

  private nextRequestId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  private spawnPyodideWorker(): Worker {
    if (this.pyodideWorker) return this.pyodideWorker;
    const worker = new Worker(
      new URL("./workers/pyodide.worker.ts", import.meta.url),
      { type: "module" }
    );
    worker.onmessage = (event: MessageEvent) => {
      const msg = event.data;
      if (!msg || typeof msg !== "object") return;

      if (msg.type === "status") {
        this.emitStatus("python", msg.state, msg.detail);
        return;
      }

      if (msg.type === "result" && msg.requestId) {
        const job = this.pending.get(msg.requestId);
        if (job) {
          clearTimeout(job.timer);
          this.pending.delete(msg.requestId);
          job.resolve(msg);
        }
      }
    };
    worker.onerror = (err) => {
      this.emitStatus("python", "error", err.message || "Worker crash");
    };
    this.pyodideWorker = worker;
    return worker;
  }

  private async ensureSqlWorker(): Promise<Worker> {
    if (this.sqlWorker) return this.sqlWorker;
    this.emitStatus("sql", "loading", "Memulai SQLite WebAssembly...");
    const worker = new Worker(
      new URL("./workers/sql.worker.ts", import.meta.url),
      { type: "module" }
    );

    const savedBytes = await readVfsFileBytes(
      this.notebookId,
      SQL_SNAPSHOT_VFS_PATH
    );

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Timeout inisialisasi SQL Worker"));
      }, 15000);

      worker.onmessage = (event: MessageEvent) => {
        const msg = event.data;
        if (!msg || typeof msg !== "object") return;
        if (msg.type === "ready") {
          clearTimeout(timer);
          this.sqlTables = msg.tables || [];
          this.variablesByKernel.sql = msg.variables || [];
          this.emitStatus("sql", "ready", "SQLite siap");
          this.emitTelemetry();
          resolve();
          return;
        }
        if (msg.type === "boot_error") {
          clearTimeout(timer);
          this.emitStatus("sql", "error", msg.error);
          reject(new Error(msg.error));
          return;
        }
        if (
          (msg.type === "result" ||
            msg.type === "table_mounted" ||
            msg.type === "mount_error") &&
          msg.requestId
        ) {
          const job = this.pending.get(msg.requestId);
          if (job) {
            clearTimeout(job.timer);
            this.pending.delete(msg.requestId);
            if (msg.type === "mount_error") {
              job.reject(new Error(msg.error || "Gagal mount tabel SQL"));
            } else {
              job.resolve(msg);
            }
          }
        }
      };

      worker.postMessage({
        type: "init",
        origin: typeof window !== "undefined" ? window.location.origin : "",
        dbBytes: savedBytes,
      });
    });

    // Auto-mount any existing tabular CSV/XLSX/JSON files in /workspace
    const files = await readAllVfsFiles(this.notebookId);
    for (const f of files) {
      if (f.path === SQL_SNAPSHOT_VFS_PATH) continue;
      const parsed = await parseTabularDataset(f.name, f.bytes);
      if (parsed) {
        await this.mountTableIntoSql(parsed.tableName, parsed.columns, parsed.rows, worker);
      }
    }

    this.sqlWorker = worker;
    return worker;
  }

  private async ensureJsWorker(): Promise<Worker> {
    if (this.jstsWorker) return this.jstsWorker;
    this.emitStatus("javascript", "loading", "Memulai JS/TS Sandbox...");
    const worker = new Worker(
      new URL("./workers/jsts.worker.ts", import.meta.url),
      { type: "module" }
    );
    await new Promise<void>((resolve) => {
      worker.onmessage = (event: MessageEvent) => {
        const msg = event.data;
        if (!msg || typeof msg !== "object") return;
        if (msg.type === "ready") {
          this.variablesByKernel.javascript = msg.variables || [];
          this.emitStatus("javascript", "ready", "JS/TS siap");
          this.emitStatus("typescript", "ready", "JS/TS siap");
          resolve();
          return;
        }
        if (msg.type === "result" && msg.requestId) {
          const job = this.pending.get(msg.requestId);
          if (job) {
            clearTimeout(job.timer);
            this.pending.delete(msg.requestId);
            job.resolve(msg);
          }
        }
      };
      worker.postMessage({ type: "init" });
    });

    const files = await readAllVfsFiles(this.notebookId);
    worker.postMessage({ type: "sync_files", files });
    this.jstsWorker = worker;
    return worker;
  }

  private mountTableIntoSql(
    tableName: string,
    columns: string[],
    rows: Record<string, unknown>[],
    workerInstance?: Worker
  ): Promise<void> {
    const worker = workerInstance || this.sqlWorker;
    if (!worker) return Promise.resolve();

    const requestId = this.nextRequestId("mount");
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        reject(new Error(`Timeout mount tabel ${tableName}`));
      }, 15000);

      this.pending.set(requestId, {
        resolve: async (msg) => {
          this.sqlTables = msg.tables || [];
          this.variablesByKernel.sql = msg.variables || [];
          if (msg.dbBytes instanceof Uint8Array) {
            await writeVfsFile(
              this.notebookId,
              SQL_SNAPSHOT_VFS_PATH,
              msg.dbBytes,
              "application/x-sqlite3",
              "kernel"
            );
          }
          this.emitTelemetry();
          resolve();
        },
        reject,
        timer,
      });

      worker.postMessage({
        type: "mount_table",
        requestId,
        tableName,
        columns,
        rows,
      });
    });
  }

  /**
   * Menyinkronkan file yang baru di-upload ke seluruh kernel aktif (Pyodide MEMFS,
   * JS Workspace, dan auto-mount CSV/XLSX/JSON menjadi tabel SQL).
   */
  async ingestWorkspaceFile(
    fileName: string,
    bytes: Uint8Array,
    mimeType: string,
    origin: "upload" | "dataset" = "upload"
  ): Promise<void> {
    const entry = await writeVfsFile(
      this.notebookId,
      `/workspace/${fileName}`,
      bytes,
      mimeType,
      origin
    );

    const filePayload = [{ name: entry.name, path: entry.path, bytes }];

    if (this.pyodideWorker) {
      this.pyodideWorker.postMessage({ type: "sync_files", files: filePayload });
    }
    if (this.jstsWorker) {
      this.jstsWorker.postMessage({ type: "sync_files", files: filePayload });
    }

    const parsed = await parseTabularDataset(fileName, bytes);
    if (parsed && this.sqlWorker) {
      await this.mountTableIntoSql(parsed.tableName, parsed.columns, parsed.rows);
    }
  }

  /**
   * Mengeksekusi satu sel secara antre (FIFO) agar tidak terjadi race condition
   * saat pengguna menekan `Run All` atau memicu mode Reaktif.
   */
  executeCell(request: KernelExecutionRequest): Promise<KernelExecutionResult> {
    const job = this.queue.then(() => this.runCellInternal(request));
    this.queue = job.catch(() => {});
    return job;
  }

  private async runCellInternal(
    request: KernelExecutionRequest
  ): Promise<KernelExecutionResult> {
    const { cellId, kernel, code, testAssertions, timeoutMs } = request;

    if (kernel === "python" && this.runtimeMode === "remote_ws") {
      if (!this.remoteBridge.isConnected) {
        return {
          cellId,
          kernel,
          success: false,
          executionMs: 0,
          outputs: [
            {
              kind: "error",
              ename: "RemoteKernelDisconnected",
              evalue: "Runtime diatur ke Local/GPU Kernel, tetapi belum terhubung ke server Jupyter.",
              traceback: [
                "Klik tombol Runtime Connection di toolbar untuk menghubungkan ke WebSocket Jupyter lokal, atau ubah kembali ke Browser WASM.",
              ],
            },
          ],
        };
      }
      this.emitStatus("python", "executing", "Menjalankan di Remote Kernel...");
      try {
        const res = await this.remoteBridge.execute(code, timeoutMs || 120_000);
        this.emitStatus("python", "ready", "Remote Kernel terhubung");
        return {
          cellId,
          kernel,
          success: res.success,
          outputs: res.outputs,
          executionMs: res.executionMs,
        };
      } catch (err: any) {
        this.emitStatus("python", "error", err?.message);
        return {
          cellId,
          kernel,
          success: false,
          executionMs: 0,
          outputs: [
            {
              kind: "error",
              ename: "RemoteExecutionError",
              evalue: err?.message || String(err),
              traceback: [],
            },
          ],
        };
      }
    }

    if (kernel === "python") {
      const worker = this.spawnPyodideWorker();
      const files = (await readAllVfsFiles(this.notebookId)).filter(
        (f) => f.path !== SQL_SNAPSHOT_VFS_PATH
      );
      const requestId = this.nextRequestId("py");
      const limitMs = timeoutMs ?? 90_000; // Allow initial Pyodide + micropip boot safely

      return new Promise((resolve) => {
        const timer = setTimeout(() => {
          this.pending.delete(requestId);
          this.terminateKernel("python");
          resolve({
            cellId,
            kernel,
            success: false,
            executionMs: limitMs,
            outputs: [
              {
                kind: "error",
                ename: "TimeoutError",
                evalue: `Eksekusi melebihi batas waktu ${(limitMs / 1000).toFixed(0)} detik. Kernel Python direset.`,
                traceback: [],
              },
            ],
          });
        }, limitMs);

        this.pending.set(requestId, {
          resolve: async (msg) => {
            if (Array.isArray(msg.variables)) {
              this.variablesByKernel.python = msg.variables;
            }
            if (msg.exportedDataFrames) {
              this.exportedDataFrames = {
                ...this.exportedDataFrames,
                ...msg.exportedDataFrames,
              };
            }
            if (Array.isArray(msg.installedPackages)) {
              this.installedPackages = msg.installedPackages;
            }
            // Mirror files created by Python back to VFS
            if (Array.isArray(msg.writtenFiles)) {
              for (const wf of msg.writtenFiles) {
                if (wf.bytes instanceof Uint8Array) {
                  await writeVfsFile(
                    this.notebookId,
                    wf.path,
                    wf.bytes,
                    wf.name.endsWith(".png")
                      ? "image/png"
                      : wf.name.endsWith(".csv")
                      ? "text/csv"
                      : "application/octet-stream",
                    "kernel"
                  );
                }
              }
            }
            this.emitTelemetry();
            resolve({
              cellId,
              kernel,
              success: Boolean(msg.success),
              outputs: msg.outputs || [],
              executionMs: Number(msg.executionMs || 0),
              variables: msg.variables,
              exportedDataFrames: msg.exportedDataFrames,
              installedPackages: msg.installedPackages,
            });
          },
          reject: (err) => {
            resolve({
              cellId,
              kernel,
              success: false,
              executionMs: 0,
              outputs: [
                {
                  kind: "error",
                  ename: "WorkerError",
                  evalue: err.message,
                  traceback: [],
                },
              ],
            });
          },
          timer,
        });

        worker.postMessage({
          type: "execute",
          requestId,
          cellId,
          code,
          testAssertions,
          files,
        });
      });
    }

    if (kernel === "sql") {
      const worker = await this.ensureSqlWorker();
      this.emitStatus("sql", "executing", "Menjalankan kueri SQL...");
      const requestId = this.nextRequestId("sql");
      const limitMs = timeoutMs ?? 20_000;

      return new Promise((resolve) => {
        const timer = setTimeout(() => {
          this.pending.delete(requestId);
          this.terminateKernel("sql");
          resolve({
            cellId,
            kernel,
            success: false,
            executionMs: limitMs,
            outputs: [
              {
                kind: "error",
                ename: "TimeoutError",
                evalue: "Kueri SQL melebihi batas waktu 20 detik.",
                traceback: [],
              },
            ],
          });
        }, limitMs);

        this.pending.set(requestId, {
          resolve: async (msg) => {
            this.sqlTables = msg.tables || [];
            this.variablesByKernel.sql = msg.variables || [];
            if (msg.dbBytes instanceof Uint8Array) {
              await writeVfsFile(
                this.notebookId,
                SQL_SNAPSHOT_VFS_PATH,
                msg.dbBytes,
                "application/x-sqlite3",
                "kernel"
              );
            }
            this.emitStatus("sql", "ready", "SQLite siap");
            this.emitTelemetry();
            resolve({
              cellId,
              kernel,
              success: Boolean(msg.success),
              outputs: msg.outputs || [],
              executionMs: Number(msg.executionMs || 0),
              tables: msg.tables,
              variables: msg.variables,
            });
          },
          reject: (err) => {
            this.emitStatus("sql", "error", err.message);
            resolve({
              cellId,
              kernel,
              success: false,
              executionMs: 0,
              outputs: [
                {
                  kind: "error",
                  ename: "SQLWorkerError",
                  evalue: err.message,
                  traceback: [],
                },
              ],
            });
          },
          timer,
        });

        // Cross-Kernel Bridge: automatically make exported Python DataFrames available to SQL!
        worker.postMessage({
          type: "execute",
          requestId,
          cellId,
          code,
          syncedDataFrames: this.exportedDataFrames,
        });
      });
    }

    // JavaScript / TypeScript Worker
    const worker = await this.ensureJsWorker();
    this.emitStatus(kernel, "executing", "Menjalankan JavaScript/TS...");
    const requestId = this.nextRequestId("js");
    const limitMs = timeoutMs ?? 15_000;

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        this.terminateKernel("javascript");
        resolve({
          cellId,
          kernel,
          success: false,
          executionMs: limitMs,
          outputs: [
            {
              kind: "error",
              ename: "TimeoutError",
              evalue: "Eksekusi JavaScript/TypeScript melebihi batas waktu 15 detik.",
              traceback: [],
            },
          ],
        });
      }, limitMs);

      this.pending.set(requestId, {
        resolve: (msg) => {
          this.variablesByKernel.javascript = msg.variables || [];
          this.emitStatus("javascript", "ready", "JS/TS siap");
          this.emitStatus("typescript", "ready", "JS/TS siap");
          this.emitTelemetry();
          resolve({
            cellId,
            kernel,
            success: Boolean(msg.success),
            outputs: msg.outputs || [],
            executionMs: Number(msg.executionMs || 0),
            variables: msg.variables,
          });
        },
        reject: (err) => {
          this.emitStatus(kernel, "error", err.message);
          resolve({
            cellId,
            kernel,
            success: false,
            executionMs: 0,
            outputs: [
              {
                kind: "error",
                ename: "JSWorkerError",
                evalue: err.message,
                traceback: [],
              },
            ],
          });
        },
        timer,
      });

      worker.postMessage({
        type: "execute",
        requestId,
        cellId,
        kernel,
        code,
      });
    });
  }

  /**
   * Menghentikan paksa eksekusi kernel yang macet / infinite loop dengan `worker.terminate()`.
   */
  terminateKernel(target?: NotebookKernel) {
    if (!target || target === "python") {
      if (this.runtimeMode === "remote_ws" && this.remoteBridge.isConnected) {
        void this.remoteBridge.interrupt();
      } else if (this.pyodideWorker) {
        this.pyodideWorker.terminate();
        this.pyodideWorker = null;
        this.variablesByKernel.python = [];
        this.emitStatus("python", "idle", "Kernel Python dihentikan");
      }
    }
    if (!target || target === "sql") {
      if (this.sqlWorker) {
        this.sqlWorker.terminate();
        this.sqlWorker = null;
        this.emitStatus("sql", "idle", "Kernel SQL direset");
      }
    }
    if (!target || target === "javascript" || target === "typescript") {
      if (this.jstsWorker) {
        this.jstsWorker.terminate();
        this.jstsWorker = null;
        this.variablesByKernel.javascript = [];
        this.emitStatus("javascript", "idle", "Kernel JS direset");
        this.emitStatus("typescript", "idle", "Kernel TS direset");
      }
    }

    // Reject any pending jobs gracefully
    this.pending.forEach((job, id) => {
      clearTimeout(job.timer);
      job.reject(new Error("Eksekusi dihentikan oleh pengguna (Kernel Interrupt)."));
      this.pending.delete(id);
    });
    this.emitTelemetry();
  }

  dispose() {
    this.terminateKernel();
    this.remoteBridge.disconnect();
    this.statusListeners.clear();
    this.telemetryListeners.clear();
  }
}
