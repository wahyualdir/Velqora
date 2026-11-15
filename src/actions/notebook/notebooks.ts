"use server";

import { revalidatePath } from "next/cache";
import { STORAGE_BUCKET } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type {
  NotebookCell,
  NotebookDocument,
  NotebookKernel,
  NotebookVersion,
  RuntimeMode,
} from "@/lib/notebook/types";

interface NotebookDbRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  default_kernel: NotebookKernel;
  runtime_mode: RuntimeMode;
  source_topic_id: string | null;
  source_chapter_id: string | null;
  source_subchapter_id: string | null;
  source_code_id: string | null;
  cells_json: NotebookCell[] | null;
  metadata_json: Record<string, unknown> | null;
  reactive_mode: boolean;
  is_pinned: boolean;
  is_archived: boolean;
  is_public: boolean;
  share_slug: string | null;
  created_at: string;
  updated_at: string;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function ensureUuid(id: string): string {
  if (UUID_REGEX.test(id)) return id;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function mapRowToDocument(row: NotebookDbRow): NotebookDocument {
  const meta = row.metadata_json || {};
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    defaultKernel: row.default_kernel || "python",
    runtimeMode: row.runtime_mode || "wasm",
    remoteUrl: typeof meta.remoteUrl === "string" ? meta.remoteUrl : undefined,
    sourceTopicId: row.source_topic_id || undefined,
    sourceChapterId: row.source_chapter_id || undefined,
    sourceSubchapterId: row.source_subchapter_id || undefined,
    sourceCodeId: row.source_code_id || undefined,
    reactiveMode: Boolean(row.reactive_mode),
    editorMode: meta.editorMode === "lite" ? "lite" : "codemirror",
    cells: Array.isArray(row.cells_json) ? row.cells_json : [],
    isPublic: Boolean(row.is_public),
    shareSlug: row.share_slug || undefined,
    isPinned: Boolean(row.is_pinned),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Menghindari pembengkakan payload JSONB di database: batasi output gambar base64
 * ultra-besar atau buffer panjang saat menyimpan state notebook ke Supabase.
 */
function sanitizeCellsForCloud(cells: NotebookCell[]): NotebookCell[] {
  return cells.map((cell) => ({
    ...cell,
    outputs: (cell.outputs || []).slice(0, 12).map((out) => {
      if (out.kind === "image" && out.data.length > 450_000) {
        return {
          kind: "text",
          text: "[Gambar visual berukuran besar di-skip dari cloud sync — jalankan ulang sel untuk render ulang]",
        };
      }
      if (out.kind === "dataframe" && out.data.rows.length > 50) {
        return {
          kind: "dataframe",
          data: {
            ...out.data,
            rows: out.data.rows.slice(0, 50),
            truncated: true,
          },
        };
      }
      return out;
    }),
  }));
}

export async function listNotebooksAction(): Promise<{
  notebooks: NotebookDocument[];
  authenticated: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { notebooks: [], authenticated: false };
    }

    const { data, error } = await supabase
      .from("notebooks")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .order("is_pinned", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(50);

    if (error) {
      return { notebooks: [], authenticated: true, error: error.message };
    }

    return {
      notebooks: ((data || []) as NotebookDbRow[]).map(mapRowToDocument),
      authenticated: true,
    };
  } catch (err: any) {
    return {
      notebooks: [],
      authenticated: false,
      error: err?.message || "Gagal memuat notebook cloud.",
    };
  }
}

export async function getNotebookByIdAction(id: string): Promise<{
  notebook: NotebookDocument | null;
  error?: string;
}> {
  try {
    if (!UUID_REGEX.test(id)) {
      return { notebook: null };
    }
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notebooks")
      .select("*")
      .eq("id", id)
      .eq("is_archived", false)
      .maybeSingle();

    if (error || !data) {
      return { notebook: null, error: error?.message };
    }
    return { notebook: mapRowToDocument(data as NotebookDbRow) };
  } catch (err: any) {
    return { notebook: null, error: err?.message };
  }
}

export async function getPublicNotebookBySlugAction(slug: string): Promise<{
  notebook: NotebookDocument | null;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notebooks")
      .select("*")
      .eq("share_slug", slug)
      .eq("is_public", true)
      .eq("is_archived", false)
      .maybeSingle();

    if (error || !data) {
      return { notebook: null, error: error?.message };
    }
    return { notebook: mapRowToDocument(data as NotebookDbRow) };
  } catch (err: any) {
    return { notebook: null, error: err?.message };
  }
}

export async function saveNotebookAction(doc: NotebookDocument): Promise<{
  notebook?: NotebookDocument;
  savedToCloud: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { savedToCloud: false, error: "Pengguna belum masuk (mode lokal aktif)." };
    }

    const safeId = ensureUuid(doc.id);
    const payload = {
      id: safeId,
      user_id: user.id,
      title: doc.title.trim() || "Notebook Tanpa Judul",
      description: doc.description || null,
      default_kernel: doc.defaultKernel,
      runtime_mode: doc.runtimeMode,
      source_topic_id: doc.sourceTopicId || null,
      source_chapter_id: doc.sourceChapterId || null,
      source_subchapter_id: doc.sourceSubchapterId || null,
      source_code_id: doc.sourceCodeId || null,
      cells_json: sanitizeCellsForCloud(doc.cells),
      metadata_json: {
        editorMode: doc.editorMode,
        remoteUrl: doc.remoteUrl || null,
      },
      reactive_mode: Boolean(doc.reactiveMode),
      is_pinned: Boolean(doc.isPinned),
      is_public: Boolean(doc.isPublic),
      share_slug: doc.shareSlug || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("notebooks")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      return { savedToCloud: false, error: error.message };
    }

    revalidatePath("/dashboard/playground");
    return {
      notebook: mapRowToDocument(data as NotebookDbRow),
      savedToCloud: true,
    };
  } catch (err: any) {
    return {
      savedToCloud: false,
      error: err?.message || "Gagal menyinkronkan notebook.",
    };
  }
}

export async function createNotebookVersionAction(
  notebookId: string,
  label: string,
  cells: NotebookCell[]
): Promise<{ version?: NotebookVersion; error?: string }> {
  try {
    if (!UUID_REGEX.test(notebookId)) {
      return { error: "ID notebook belum tersimpan di cloud." };
    }
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Autentikasi diperlukan." };

    const { data, error } = await supabase
      .from("notebook_versions")
      .insert({
        notebook_id: notebookId,
        user_id: user.id,
        label: label.trim() || "Checkpoint Manual",
        cells_snapshot: sanitizeCellsForCloud(cells),
      })
      .select()
      .single();

    if (error || !data) {
      return { error: error?.message || "Gagal menyimpan checkpoint." };
    }

    return {
      version: {
        id: data.id,
        notebookId: data.notebook_id,
        label: data.label,
        cellsSnapshot: data.cells_snapshot || [],
        createdAt: data.created_at,
      },
    };
  } catch (err: any) {
    return { error: err?.message };
  }
}

export async function listNotebookVersionsAction(
  notebookId: string
): Promise<{ versions: NotebookVersion[]; error?: string }> {
  try {
    if (!UUID_REGEX.test(notebookId)) {
      return { versions: [] };
    }
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notebook_versions")
      .select("id, notebook_id, label, cells_snapshot, created_at")
      .eq("notebook_id", notebookId)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error || !data) {
      return { versions: [], error: error?.message };
    }

    return {
      versions: data.map((row: any) => ({
        id: row.id,
        notebookId: row.notebook_id,
        label: row.label,
        cellsSnapshot: Array.isArray(row.cells_snapshot) ? row.cells_snapshot : [],
        createdAt: row.created_at,
      })),
    };
  } catch (err: any) {
    return { versions: [], error: err?.message };
  }
}

export async function deleteNotebookAction(
  notebookId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Autentikasi diperlukan." };

    const { error } = await supabase
      .from("notebooks")
      .update({ is_archived: true, updated_at: new Date().toISOString() })
      .eq("id", notebookId)
      .eq("user_id", user.id);

    if (error) return { success: false, error: error.message };
    revalidatePath("/dashboard/playground");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function toggleShareNotebookAction(
  notebookId: string,
  makePublic: boolean
): Promise<{ shareSlug?: string; isPublic: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { isPublic: false, error: "Autentikasi diperlukan." };

    const { data: existing } = await supabase
      .from("notebooks")
      .select("share_slug")
      .eq("id", notebookId)
      .eq("user_id", user.id)
      .single();

    const shareSlug =
      existing?.share_slug || `nb-${Math.random().toString(36).slice(2, 10)}`;

    const { error } = await supabase
      .from("notebooks")
      .update({
        is_public: makePublic,
        share_slug: shareSlug,
        updated_at: new Date().toISOString(),
      })
      .eq("id", notebookId)
      .eq("user_id", user.id);

    if (error) return { isPublic: false, error: error.message };
    return { isPublic: makePublic, shareSlug };
  } catch (err: any) {
    return { isPublic: false, error: err?.message };
  }
}

export async function clonePublicNotebookAction(
  shareSlug: string
): Promise<{ notebookId?: string; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Masuk terlebih dahulu untuk menyalin notebook ke akun Anda." };

    const { notebook } = await getPublicNotebookBySlugAction(shareSlug);
    if (!notebook) return { error: "Notebook publik tidak ditemukan." };

    const newId = ensureUuid("new");
    const cloned: NotebookDocument = {
      ...notebook,
      id: newId,
      title: `${notebook.title} (Salinan)`,
      isPublic: false,
      shareSlug: undefined,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await saveNotebookAction(cloned);
    if (!res.savedToCloud || !res.notebook) {
      return { error: res.error || "Gagal menyalin notebook." };
    }
    return { notebookId: res.notebook.id };
  } catch (err: any) {
    return { error: err?.message };
  }
}

export async function uploadNotebookDatasetAction(formData: FormData): Promise<{
  storagePath?: string;
  error?: string;
}> {
  try {
    const file = formData.get("file");
    const notebookId = String(formData.get("notebookId") || "");
    if (!(file instanceof File) || !UUID_REGEX.test(notebookId)) {
      return { error: "File atau ID notebook tidak valid." };
    }
    if (file.size > 25 * 1024 * 1024) {
      return { error: "Ukuran file dataset maksimal 25MB." };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Mode lokal: dataset tersimpan langsung di Virtual FS browser." };
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `notebooks/${user.id}/${notebookId}/${Date.now()}_${safeName}`;

    const { error: uploadErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });

    if (uploadErr) {
      return { error: uploadErr.message };
    }

    await supabase.from("notebook_datasets").insert({
      notebook_id: notebookId,
      user_id: user.id,
      file_name: file.name,
      storage_path: storagePath,
      mime_type: file.type || "application/octet-stream",
      size_bytes: file.size,
    });

    return { storagePath };
  } catch (err: any) {
    return { error: err?.message };
  }
}
