import type { VfsFileEntry } from "./types";

const IDB_NAME = "velqora_notebook_vfs_v1";
const IDB_STORE = "files";

interface StoredVfsRecord {
  key: string; // `${notebookId}::${path}`
  notebookId: string;
  path: string;
  name: string;
  mimeType: string;
  size: number;
  updatedAt: string;
  origin: "upload" | "kernel" | "dataset";
  bytes: Uint8Array;
}

function normalizePath(rawPath: string): string {
  const cleaned = rawPath
    .replace(/\\/g, "/")
    .replace(/^\/+workspace\/?/i, "")
    .replace(/^\/+/, "")
    .replace(/\.\.+/g, "");
  return `/workspace/${cleaned || "untitled"}`;
}

function openVfsDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB tidak tersedia pada lingkungan ini."));
      return;
    }
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        const store = db.createObjectStore(IDB_STORE, { keyPath: "key" });
        store.createIndex("by_notebook", "notebookId", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("Gagal membuka IndexedDB VFS"));
  });
}

async function tryGetOpfsNotebookDir(
  notebookId: string
): Promise<FileSystemDirectoryHandle | null> {
  try {
    if (
      typeof navigator === "undefined" ||
      !("storage" in navigator) ||
      typeof navigator.storage.getDirectory !== "function"
    ) {
      return null;
    }
    const root = await navigator.storage.getDirectory();
    const vfsRoot = await root.getDirectoryHandle("velqora_workspace", {
      create: true,
    });
    const safeNb = notebookId.replace(/[^a-zA-Z0-9_-]/g, "_");
    return await vfsRoot.getDirectoryHandle(safeNb, { create: true });
  } catch {
    return null;
  }
}

export async function listVfsFiles(notebookId: string): Promise<VfsFileEntry[]> {
  try {
    const db = await openVfsDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const idx = tx.objectStore(IDB_STORE).index("by_notebook");
      const req = idx.getAll(IDBKeyRange.only(notebookId));
      req.onsuccess = () => {
        const records = (req.result || []) as StoredVfsRecord[];
        resolve(
          records.map((r) => ({
            path: r.path,
            name: r.name,
            size: r.size,
            mimeType: r.mimeType,
            updatedAt: r.updatedAt,
            origin: r.origin,
          }))
        );
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function writeVfsFile(
  notebookId: string,
  rawPath: string,
  bytes: Uint8Array,
  mimeType = "application/octet-stream",
  origin: "upload" | "kernel" | "dataset" = "upload"
): Promise<VfsFileEntry> {
  const path = normalizePath(rawPath);
  const name = path.split("/").pop() || "file";
  const updatedAt = new Date().toISOString();

  // Mirror to OPFS when supported
  const opfsDir = await tryGetOpfsNotebookDir(notebookId);
  if (opfsDir) {
    try {
      const safeFileName = name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileHandle = await opfsDir.getFileHandle(safeFileName, {
        create: true,
      });
      const writable = await fileHandle.createWritable();
      const bufferCopy = new Uint8Array(bytes.byteLength);
      bufferCopy.set(bytes);
      await writable.write(bufferCopy);
      await writable.close();
    } catch {
      // OPFS mirror best-effort; IndexedDB remains authoritative
    }
  }

  const db = await openVfsDb();
  const record: StoredVfsRecord = {
    key: `${notebookId}::${path}`,
    notebookId,
    path,
    name,
    mimeType,
    size: bytes.byteLength,
    updatedAt,
    origin,
    bytes: new Uint8Array(bytes),
  };

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  return {
    path,
    name,
    size: bytes.byteLength,
    mimeType,
    updatedAt,
    origin,
  };
}

export async function readVfsFileBytes(
  notebookId: string,
  rawPath: string
): Promise<Uint8Array | null> {
  const path = normalizePath(rawPath);
  try {
    const db = await openVfsDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get(`${notebookId}::${path}`);
      req.onsuccess = () => {
        const rec = req.result as StoredVfsRecord | undefined;
        resolve(rec ? new Uint8Array(rec.bytes) : null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function readAllVfsFiles(
  notebookId: string
): Promise<Array<{ path: string; name: string; bytes: Uint8Array; mimeType: string }>> {
  try {
    const db = await openVfsDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const idx = tx.objectStore(IDB_STORE).index("by_notebook");
      const req = idx.getAll(IDBKeyRange.only(notebookId));
      req.onsuccess = () => {
        const records = (req.result || []) as StoredVfsRecord[];
        resolve(
          records.map((r) => ({
            path: r.path,
            name: r.name,
            bytes: new Uint8Array(r.bytes),
            mimeType: r.mimeType,
          }))
        );
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function deleteVfsFile(
  notebookId: string,
  rawPath: string
): Promise<void> {
  const path = normalizePath(rawPath);
  try {
    const db = await openVfsDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).delete(`${notebookId}::${path}`);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore silently
  }
}

function splitCsvLine(line: string, delimiter = ","): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

/**
 * Mengurai berkas tabular (.csv, .tsv, .json, .xlsx) menjadi kolom dan baris terstruktur
 * agar bisa langsung di-mount ke Kernel SQL maupun dipratinjau di Explorer.
 */
export async function parseTabularDataset(
  fileName: string,
  bytes: Uint8Array
): Promise<{
  tableName: string;
  columns: string[];
  rows: Record<string, unknown>[];
} | null> {
  const lower = fileName.toLowerCase();
  const baseName = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/^(\d)/, "t_$1")
    .toLowerCase() || "dataset";

  if (lower.endsWith(".csv") || lower.endsWith(".tsv")) {
    const text = new TextDecoder("utf-8").decode(bytes);
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return null;
    const delimiter = lower.endsWith(".tsv")
      ? "\t"
      : lines[0].includes(";") && !lines[0].includes(",")
      ? ";"
      : ",";
    const headers = splitCsvLine(lines[0], delimiter).map(
      (h, idx) => h.replace(/[^a-zA-Z0-9_]/g, "_") || `col_${idx + 1}`
    );
    const rows = lines.slice(1, 5001).map((line) => {
      const vals = splitCsvLine(line, delimiter);
      const obj: Record<string, unknown> = {};
      headers.forEach((h, idx) => {
        const raw = vals[idx] ?? null;
        if (raw === null || raw === "") {
          obj[h] = null;
        } else if (/^-?\d+(\.\d+)?$/.test(raw)) {
          obj[h] = Number(raw);
        } else {
          obj[h] = raw;
        }
      });
      return obj;
    });
    return { tableName: baseName, columns: headers, rows };
  }

  if (lower.endsWith(".json")) {
    try {
      const text = new TextDecoder("utf-8").decode(bytes);
      const parsed = JSON.parse(text);
      const arr = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.data)
        ? parsed.data
        : null;
      if (!arr || arr.length === 0 || typeof arr[0] !== "object") return null;
      const colSet = new Set<string>();
      arr.slice(0, 100).forEach((item: Record<string, unknown>) => {
        Object.keys(item || {}).forEach((k) => colSet.add(k));
      });
      return {
        tableName: baseName,
        columns: Array.from(colSet),
        rows: arr.slice(0, 5000),
      };
    } catch {
      return null;
    }
  }

  if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
    const XLSX = await import("xlsx");
    const wb = XLSX.read(bytes, { type: "array" });
    const firstSheetName = wb.SheetNames[0];
    if (!firstSheetName) return null;
    const sheet = wb.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: null,
    });
    if (rows.length === 0) return null;
    const columns = Object.keys(rows[0]);
    return {
      tableName: baseName,
      columns,
      rows: rows.slice(0, 5000),
    };
  }

  return null;
}
