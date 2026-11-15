import type { NotebookDocument, NotebookVersion } from "./types";

const DB_NAME = "velqora_notebooks_local_v1";
const STORE_NOTEBOOKS = "notebooks";
const STORE_VERSIONS = "versions";

function openLocalDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB tidak tersedia."));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NOTEBOOKS)) {
        db.createObjectStore(STORE_NOTEBOOKS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_VERSIONS)) {
        const vStore = db.createObjectStore(STORE_VERSIONS, { keyPath: "id" });
        vStore.createIndex("by_notebook", "notebookId", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveLocalNotebook(doc: NotebookDocument): Promise<void> {
  try {
    const db = await openLocalDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NOTEBOOKS, "readwrite");
      tx.objectStore(STORE_NOTEBOOKS).put({
        ...doc,
        updatedAt: new Date().toISOString(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Graceful no-op in non-IDB environments
  }
}

export async function getLocalNotebook(
  id: string
): Promise<NotebookDocument | null> {
  try {
    const db = await openLocalDb();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE_NOTEBOOKS, "readonly");
      const req = tx.objectStore(STORE_NOTEBOOKS).get(id);
      req.onsuccess = () => resolve((req.result as NotebookDocument) || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function listLocalNotebooks(): Promise<NotebookDocument[]> {
  try {
    const db = await openLocalDb();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE_NOTEBOOKS, "readonly");
      const req = tx.objectStore(STORE_NOTEBOOKS).getAll();
      req.onsuccess = () => {
        const list = (req.result || []) as NotebookDocument[];
        resolve(
          list.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
        );
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function deleteLocalNotebook(id: string): Promise<void> {
  try {
    const db = await openLocalDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NOTEBOOKS, "readwrite");
      tx.objectStore(STORE_NOTEBOOKS).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // Ignore
  }
}

export async function saveLocalNotebookVersion(
  version: NotebookVersion
): Promise<void> {
  try {
    const db = await openLocalDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_VERSIONS, "readwrite");
      tx.objectStore(STORE_VERSIONS).put(version);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // Ignore
  }
}

export async function listLocalNotebookVersions(
  notebookId: string
): Promise<NotebookVersion[]> {
  try {
    const db = await openLocalDb();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE_VERSIONS, "readonly");
      const idx = tx.objectStore(STORE_VERSIONS).index("by_notebook");
      const req = idx.getAll(IDBKeyRange.only(notebookId));
      req.onsuccess = () => {
        const items = (req.result || []) as NotebookVersion[];
        resolve(
          items
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 30)
        );
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}
