"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { slugify, isAdminUser } from "@/lib/utils";
import { SYSTEM_PRIMARY_CATEGORIES } from "@/lib/constants";

export interface NoteEntity {
  id: string;
  category_id: string | null;
  parent_note_id: string | null;
  slug: string;
  title: string;
  content_markdown: string;
  icon: string | null;
  order_index: number;
  is_folder: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    color?: string;
    icon?: string;
  } | null;
}

export interface NoteLinkItem {
  id: string;
  source_note_id: string;
  target_note_id: string | null;
  target_title_raw: string;
  target_slug?: string | null;
  target_title?: string | null;
  is_dangling: boolean;
}

export interface NoteBacklinkItem {
  id: string;
  source_note_id: string;
  source_slug: string;
  source_title: string;
  context_snippet: string;
  created_at: string;
}

export interface NoteTreeNode {
  id: string;
  title: string;
  slug: string;
  icon: string | null;
  order_index: number;
  is_folder: boolean;
  parent_note_id: string | null;
  category_id: string | null;
  children?: NoteTreeNode[];
}

export interface CategoryTreeFolder {
  id: string;
  name: string;
  color: string;
  icon: string;
  notes: NoteTreeNode[];
}

export interface NoteTreeResult {
  categories: CategoryTreeFolder[];
  rootNotes: NoteTreeNode[];
  totalNotes: number;
}

export interface NoteGraphNode {
  id: string;
  slug: string;
  title: string;
  categoryId: string | null;
  categoryName?: string;
  categoryColor?: string;
  degree: number;
  isCurrent?: boolean;
}

export interface NoteGraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface NoteGraphData {
  nodes: NoteGraphNode[];
  edges: NoteGraphEdge[];
}

/**
 * Helper to check if current user has admin permission
 */
async function assertAdminAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Anda harus login untuk melakukan tindakan ini.");
  }

  // Check user email against admin list
  if (isAdminUser(user.email)) {
    return { user, isAdmin: true };
  }

  // Check user_roles table
  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("email", user.email?.toLowerCase())
    .maybeSingle();

  if (roleRow && (roleRow.role === "admin" || roleRow.role === "owner")) {
    return { user, isAdmin: true };
  }

  throw new Error("Akses ditolak: Hanya Admin/Owner yang dapat memodifikasi kurikulum catatan.");
}

/**
 * Extract sentences or context around a [[wiki-link]] in markdown
 */
function extractContextSnippet(content: string, targetTitle: string): string {
  if (!content) return "";
  const lines = content.split("\n");
  const pattern = new RegExp(`\\[\\[${targetTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]\\]`, "i");

  for (const line of lines) {
    if (pattern.test(line)) {
      const clean = line.replace(/^[#*>-]+\s*/, "").trim();
      if (clean.length > 180) {
        return clean.slice(0, 177) + "...";
      }
      return clean;
    }
  }

  return "";
}

/**
 * 1. GET NOTE TREE
 * Return hierarchical folder & note tree for sidebar explorer
 */
export async function getNoteTree(): Promise<NoteTreeResult> {
  const supabase = await createClient();

  // 1. Fetch categories
  const { data: dbCategories } = await supabase
    .from("categories")
    .select("id, name, color, icon")
    .order("name");

  // 2. Fetch all notes
  const { data: notes, error } = await supabase
    .from("notes")
    .select("id, title, slug, icon, order_index, is_folder, parent_note_id, category_id")
    .order("order_index", { ascending: true })
    .order("title", { ascending: true });

  if (error || !notes) {
    return { categories: [], rootNotes: [], totalNotes: 0 };
  }

  // Map notes into dictionary for quick child resolution
  const noteNodesMap = new Map<string, NoteTreeNode>();
  const childrenMap = new Map<string, NoteTreeNode[]>();

  for (const n of notes) {
    const node: NoteTreeNode = {
      id: n.id,
      title: n.title,
      slug: n.slug,
      icon: n.icon,
      order_index: n.order_index ?? 0,
      is_folder: Boolean(n.is_folder),
      parent_note_id: n.parent_note_id,
      category_id: n.category_id,
      children: [],
    };
    noteNodesMap.set(n.id, node);

    if (n.parent_note_id) {
      const existing = childrenMap.get(n.parent_note_id) || [];
      existing.push(node);
      childrenMap.set(n.parent_note_id, existing);
    }
  }

  // Attach children to parent notes
  for (const [parentId, kids] of childrenMap.entries()) {
    const parent = noteNodesMap.get(parentId);
    if (parent) {
      parent.children = kids;
    }
  }

  // Group notes by category
  const categoryFolders: CategoryTreeFolder[] = [];
  const processedNoteIds = new Set<string>();

  // Use DB categories or SYSTEM_PRIMARY_CATEGORIES fallback
  const allCatList = dbCategories && dbCategories.length > 0
    ? dbCategories
    : SYSTEM_PRIMARY_CATEGORIES.map((c) => ({
        id: c.name,
        name: c.name,
        color: c.color,
        icon: c.icon,
      }));

  for (const cat of allCatList) {
    const catNotes: NoteTreeNode[] = [];

    for (const n of notes) {
      if (
        !n.parent_note_id && // only top-level items in category
        (n.category_id === cat.id ||
          (!n.category_id && n.title.toLowerCase().includes(cat.name.toLowerCase())))
      ) {
        const fullNode = noteNodesMap.get(n.id);
        if (fullNode) {
          catNotes.push(fullNode);
          processedNoteIds.add(n.id);
        }
      }
    }

    categoryFolders.push({
      id: cat.id,
      name: cat.name,
      color: cat.color || "#C2553A",
      icon: cat.icon || "Folder",
      notes: catNotes,
    });
  }

  // Collect root notes that are uncategorized
  const rootNotes: NoteTreeNode[] = [];
  for (const n of notes) {
    if (!n.parent_note_id && !processedNoteIds.has(n.id)) {
      const fullNode = noteNodesMap.get(n.id);
      if (fullNode) {
        rootNotes.push(fullNode);
      }
    }
  }

  return {
    categories: categoryFolders,
    rootNotes,
    totalNotes: notes.filter((n) => !n.is_folder).length,
  };
}

/**
 * 2. GET NOTE BY SLUG
 * Return complete note + backlinks + outgoing links + tags
 */
export async function getNoteBySlug(slug: string) {
  const supabase = await createClient();

  // 1. Fetch note
  const { data: note, error } = await supabase
    .from("notes")
    .select("*, category:categories(id, name, color, icon)")
    .eq("slug", slug)
    .single();

  if (error || !note) {
    return null;
  }

  // 2. Outgoing links
  const { data: rawOutgoing } = await supabase
    .from("note_links")
    .select("id, source_note_id, target_note_id, target_title_raw")
    .eq("source_note_id", note.id);

  const outgoingLinks: NoteLinkItem[] = [];
  if (rawOutgoing && rawOutgoing.length > 0) {
    const targetIds = rawOutgoing
      .map((l) => l.target_note_id)
      .filter(Boolean) as string[];

    const targetNotesMap = new Map<string, { slug: string; title: string }>();
    if (targetIds.length > 0) {
      const { data: targets } = await supabase
        .from("notes")
        .select("id, slug, title")
        .in("id", targetIds);

      if (targets) {
        targets.forEach((t) => targetNotesMap.set(t.id, t));
      }
    }

    for (const link of rawOutgoing) {
      const target = link.target_note_id ? targetNotesMap.get(link.target_note_id) : null;
      outgoingLinks.push({
        id: link.id,
        source_note_id: link.source_note_id,
        target_note_id: link.target_note_id,
        target_title_raw: link.target_title_raw,
        target_slug: target?.slug || null,
        target_title: target?.title || link.target_title_raw,
        is_dangling: !target,
      });
    }
  }

  // 3. Backlinks (notes that link to this note)
  const { data: rawBacklinks } = await supabase
    .from("note_links")
    .select("id, source_note_id, target_note_id, target_title_raw, created_at, source:notes!source_note_id(id, slug, title, content_markdown)")
    .or(`target_note_id.eq.${note.id},target_title_raw.ilike.${note.title}`);

  const backlinks: NoteBacklinkItem[] = [];
  if (rawBacklinks) {
    for (const b of rawBacklinks) {
      const source = b.source as any;
      if (source && source.id !== note.id) {
        backlinks.push({
          id: b.id,
          source_note_id: source.id,
          source_slug: source.slug,
          source_title: source.title,
          context_snippet: extractContextSnippet(source.content_markdown || "", note.title),
          created_at: b.created_at,
        });
      }
    }
  }

  // 4. Tags
  const { data: tagRows } = await supabase
    .from("note_tags")
    .select("tag")
    .eq("note_id", note.id);

  const tags = (tagRows || []).map((t) => t.tag);

  return {
    note: note as NoteEntity,
    outgoingLinks,
    backlinks,
    tags,
  };
}

/**
 * 3. GET NOTES BY CATEGORY
 */
export async function getNotesByCategory(categoryIdOrName: string): Promise<NoteEntity[]> {
  const supabase = await createClient();

  // Try direct UUID lookup
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryIdOrName);

  let query = supabase
    .from("notes")
    .select("*, category:categories(id, name, color, icon)")
    .eq("is_folder", false)
    .order("order_index", { ascending: true });

  if (isUuid) {
    query = query.eq("category_id", categoryIdOrName);
  } else {
    // Search by category name or title content
    const cleanName = decodeURIComponent(categoryIdOrName).toLowerCase().trim();
    query = query.ilike("title", `%${cleanName}%`);
  }

  const { data, error } = await query;
  if (error || !data || data.length === 0) {
    // Fallback: search by category name join
    const { data: fallbackData } = await supabase
      .from("notes")
      .select("*, category:categories!inner(id, name, color, icon)")
      .ilike("category.name", `%${decodeURIComponent(categoryIdOrName)}%`)
      .eq("is_folder", false)
      .order("order_index", { ascending: true });

    return (fallbackData as NoteEntity[]) || [];
  }

  return data as NoteEntity[];
}

/**
 * 4. SEARCH NOTES (Quick Switcher & Search Bar)
 */
export async function searchNotes(query: string, limit = 15): Promise<Array<{ id: string; title: string; slug: string; excerpt: string; category?: string }>> {
  if (!query || !query.trim()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("notes")
      .select("id, title, slug, content_markdown, category:categories(name)")
      .eq("is_folder", false)
      .order("updated_at", { ascending: false })
      .limit(limit);

    return (data || []).map((n: any) => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      excerpt: n.content_markdown?.slice(0, 100).replace(/^[#*>-]+\s*/, "") || "",
      category: n.category?.name,
    }));
  }

  const supabase = await createClient();
  const cleanQ = `%${query.trim()}%`;

  const { data, error } = await supabase
    .from("notes")
    .select("id, title, slug, content_markdown, category:categories(name)")
    .eq("is_folder", false)
    .or(`title.ilike.${cleanQ},content_markdown.ilike.${cleanQ}`)
    .limit(limit);

  if (error || !data) return [];

  return data.map((n: any) => ({
    id: n.id,
    title: n.title,
    slug: n.slug,
    excerpt: n.content_markdown?.slice(0, 120).replace(/^[#*>-]+\s*/, "") || "",
    category: n.category?.name,
  }));
}

/**
 * 5. PARSE & SYNC LINKS
 */
export async function parseAndSyncLinks(noteId: string, content: string) {
  const supabase = await createClient();

  // Match all [[Title]] occurrences
  const wikiRegex = /\[\[(.*?)\]\]/g;
  const matches = [...content.matchAll(wikiRegex)];
  const rawTargetTitles = Array.from(
    new Set(matches.map((m) => m[1]?.trim()).filter(Boolean))
  );

  // If no links, delete existing links for this source
  if (rawTargetTitles.length === 0) {
    await supabase.from("note_links").delete().eq("source_note_id", noteId);
    return;
  }

  // Query existing notes matching these titles (case-insensitive) or slugs
  const titleClauses = rawTargetTitles.map((t) => `title.ilike.${t}`).join(",");
  const slugClauses = rawTargetTitles.map((t) => `slug.eq.${slugify(t)}`).join(",");

  const { data: matchedNotes } = await supabase
    .from("notes")
    .select("id, title, slug")
    .or(`${titleClauses},${slugClauses}`);

  const matchedMap = new Map<string, string>(); // lower title -> noteId
  if (matchedNotes) {
    for (const n of matchedNotes) {
      matchedMap.set(n.title.toLowerCase().trim(), n.id);
      matchedMap.set(slugify(n.title), n.id);
      matchedMap.set(n.slug, n.id);
    }
  }

  // Prepare upsert payloads
  const linkPayloads = rawTargetTitles.map((rawTitle) => {
    const cleanLower = rawTitle.toLowerCase().trim();
    const slugKey = slugify(rawTitle);
    const targetNoteId = matchedMap.get(cleanLower) || matchedMap.get(slugKey) || null;

    return {
      source_note_id: noteId,
      target_title_raw: rawTitle,
      target_note_id: targetNoteId,
    };
  });

  // Upsert current links
  for (const payload of linkPayloads) {
    await supabase.from("note_links").upsert(payload, {
      onConflict: "source_note_id, target_title_raw",
    });
  }

  // Delete orphaned links that were removed in new content
  const { data: existingLinks } = await supabase
    .from("note_links")
    .select("id, target_title_raw")
    .eq("source_note_id", noteId);

  if (existingLinks) {
    const currentSet = new Set(rawTargetTitles.map((t) => t.toLowerCase().trim()));
    const toDeleteIds = existingLinks
      .filter((l) => !currentSet.has(l.target_title_raw.toLowerCase().trim()))
      .map((l) => l.id);

    if (toDeleteIds.length > 0) {
      await supabase.from("note_links").delete().in("id", toDeleteIds);
    }
  }
}

/**
 * 6. PARSE & SYNC TAGS
 */
export async function parseAndSyncTags(noteId: string, content: string) {
  const supabase = await createClient();

  // Match #tag patterns, avoiding markdown headings (# Heading)
  const tagRegex = /(?:^|\s)#([a-zA-Z0-9_-]+)/g;
  const matches = [...content.matchAll(tagRegex)];
  const tags = Array.from(new Set(matches.map((m) => m[1].toLowerCase().trim()).filter(Boolean)));

  // Delete all existing tags for this note
  await supabase.from("note_tags").delete().eq("note_id", noteId);

  // Insert new tags
  if (tags.length > 0) {
    const tagPayloads = tags.map((t) => ({
      note_id: noteId,
      tag: t,
    }));
    await supabase.from("note_tags").insert(tagPayloads);
  }
}

/**
 * 7. CREATE NOTE
 */
export async function createNote(data: {
  title: string;
  content_markdown: string;
  categoryId?: string | null;
  parentNoteId?: string | null;
  icon?: string | null;
  isFolder?: boolean;
  orderIndex?: number;
}) {
  const { user } = await assertAdminAccess();
  const supabase = await createClient();

  const rawSlug = slugify(data.title);
  let finalSlug = rawSlug;
  let counter = 1;

  // Ensure unique slug
  while (true) {
    const { data: existing } = await supabase
      .from("notes")
      .select("id")
      .eq("slug", finalSlug)
      .maybeSingle();

    if (!existing) break;
    finalSlug = `${rawSlug}-${counter}`;
    counter++;
  }

  const insertPayload = {
    title: data.title.trim(),
    slug: finalSlug,
    content_markdown: data.content_markdown || "",
    category_id: data.categoryId || null,
    parent_note_id: data.parentNoteId || null,
    icon: data.icon || (data.isFolder ? "Folder" : "FileText"),
    is_folder: Boolean(data.isFolder),
    order_index: data.orderIndex ?? 0,
    created_by: user.id,
  };

  const { data: created, error } = await supabase
    .from("notes")
    .insert(insertPayload)
    .select()
    .single();

  if (error || !created) {
    throw new Error(`Gagal membuat catatan: ${error?.message || "Unknown error"}`);
  }

  // Parse links & tags
  await parseAndSyncLinks(created.id, created.content_markdown);
  await parseAndSyncTags(created.id, created.content_markdown);

  // Retroactively resolve any dangling links that were waiting for this note
  await supabase
    .from("note_links")
    .update({ target_note_id: created.id })
    .ilike("target_title_raw", created.title)
    .is("target_note_id", null);

  revalidatePath("/dashboard/catatan");
  revalidatePath(`/dashboard/catatan/${created.slug}`);
  revalidatePath("/dashboard/catatan/graph");

  return created as NoteEntity;
}

/**
 * 8. UPDATE NOTE
 */
export async function updateNote(
  id: string,
  data: Partial<{
    title: string;
    content_markdown: string;
    categoryId: string | null;
    parentNoteId: string | null;
    icon: string | null;
    orderIndex: number;
    isFolder: boolean;
  }>
) {
  await assertAdminAccess();
  const supabase = await createClient();

  const updatePayload: any = {
    updated_at: new Date().toISOString(),
  };

  if (data.title !== undefined) updatePayload.title = data.title.trim();
  if (data.content_markdown !== undefined) updatePayload.content_markdown = data.content_markdown;
  if (data.categoryId !== undefined) updatePayload.category_id = data.categoryId;
  if (data.parentNoteId !== undefined) updatePayload.parent_note_id = data.parentNoteId;
  if (data.icon !== undefined) updatePayload.icon = data.icon;
  if (data.orderIndex !== undefined) updatePayload.order_index = data.orderIndex;
  if (data.isFolder !== undefined) updatePayload.is_folder = data.isFolder;

  const { data: updated, error } = await supabase
    .from("notes")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error || !updated) {
    throw new Error(`Gagal memperbarui catatan: ${error?.message || "Unknown error"}`);
  }

  if (data.content_markdown !== undefined) {
    await parseAndSyncLinks(id, data.content_markdown);
    await parseAndSyncTags(id, data.content_markdown);
  }

  revalidatePath("/dashboard/catatan");
  revalidatePath(`/dashboard/catatan/${updated.slug}`);
  revalidatePath("/dashboard/catatan/graph");

  return updated as NoteEntity;
}

/**
 * 9. DELETE NOTE
 */
export async function deleteNote(id: string) {
  await assertAdminAccess();
  const supabase = await createClient();

  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) {
    throw new Error(`Gagal menghapus catatan: ${error.message}`);
  }

  revalidatePath("/dashboard/catatan");
  revalidatePath("/dashboard/catatan/graph");
  return { success: true };
}

/**
 * 10. GET GRAPH DATA (Local & Global)
 */
export async function getGraphData(
  scope: "global" | { noteId: string }
): Promise<NoteGraphData> {
  const supabase = await createClient();

  if (scope === "global") {
    // 1. Fetch all notes with category info
    const { data: notes } = await supabase
      .from("notes")
      .select("id, slug, title, category_id, category:categories(name, color)")
      .eq("is_folder", false);

    if (!notes || notes.length === 0) {
      return { nodes: [], edges: [] };
    }

    const noteIdSet = new Set(notes.map((n) => n.id));

    // 2. Fetch all valid links where both source & target exist
    const { data: links } = await supabase
      .from("note_links")
      .select("id, source_note_id, target_note_id")
      .not("target_note_id", "is", null);

    const degreeMap = new Map<string, number>();
    const validEdges: NoteGraphEdge[] = [];

    if (links) {
      for (const link of links) {
        if (
          link.target_note_id &&
          noteIdSet.has(link.source_note_id) &&
          noteIdSet.has(link.target_note_id)
        ) {
          validEdges.push({
            id: link.id,
            source: link.source_note_id,
            target: link.target_note_id,
          });
          degreeMap.set(
            link.source_note_id,
            (degreeMap.get(link.source_note_id) || 0) + 1
          );
          degreeMap.set(
            link.target_note_id,
            (degreeMap.get(link.target_note_id) || 0) + 1
          );
        }
      }
    }

    const graphNodes: NoteGraphNode[] = notes.map((n: any) => ({
      id: n.id,
      slug: n.slug,
      title: n.title,
      categoryId: n.category_id,
      categoryName: n.category?.name,
      categoryColor: n.category?.color,
      degree: degreeMap.get(n.id) || 0,
      isCurrent: false,
    }));

    return { nodes: graphNodes, edges: validEdges };
  }

  // Local Scope: 1-degree neighborhood
  const focalId = scope.noteId;
  const { data: focalNote } = await supabase
    .from("notes")
    .select("id, slug, title, category_id, category:categories(name, color)")
    .eq("id", focalId)
    .single();

  if (!focalNote) return { nodes: [], edges: [] };

  // Fetch incoming and outgoing edges for focal note
  const { data: connectedLinks } = await supabase
    .from("note_links")
    .select("id, source_note_id, target_note_id")
    .or(`source_note_id.eq.${focalId},target_note_id.eq.${focalId}`)
    .not("target_note_id", "is", null);

  const neighborIds = new Set<string>();
  neighborIds.add(focalId);

  const localEdges: NoteGraphEdge[] = [];
  if (connectedLinks) {
    for (const l of connectedLinks) {
      if (l.target_note_id) {
        neighborIds.add(l.source_note_id);
        neighborIds.add(l.target_note_id);
        localEdges.push({
          id: l.id,
          source: l.source_note_id,
          target: l.target_note_id,
        });
      }
    }
  }

  const { data: neighborNotes } = await supabase
    .from("notes")
    .select("id, slug, title, category_id, category:categories(name, color)")
    .in("id", Array.from(neighborIds));

  const localNodes: NoteGraphNode[] = (neighborNotes || []).map((n: any) => ({
    id: n.id,
    slug: n.slug,
    title: n.title,
    categoryId: n.category_id,
    categoryName: n.category?.name,
    categoryColor: n.category?.color,
    degree: localEdges.filter((e) => e.source === n.id || e.target === n.id).length,
    isCurrent: n.id === focalId,
  }));

  return { nodes: localNodes, edges: localEdges };
}
