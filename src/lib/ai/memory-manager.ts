import { MemoryCategory, MemoryItem, UserMemoryProfile } from "./types";

export const MEMORY_STORAGE_PREFIX = "velqora_ai_memory_";

/**
 * In-memory fallback / cache store for user memories (isolated by userId)
 */
const memoryStore = new Map<string, UserMemoryProfile>();

/**
 * Default empty profile for a user
 */
export function createDefaultMemoryProfile(userId: string): UserMemoryProfile {
  return {
    userId,
    isEnabled: true,
    learningPreferences: [],
    preferredTopics: [],
    skillLevel: {},
    communicationPreferences: ["Bahasa Indonesia yang jelas dan profesional", "Penjelasan terstruktur"],
    ongoingProjects: [],
    importantContext: [],
    memories: [],
  };
}

/**
 * Retrieve the full memory profile for a user
 */
export async function getUserMemoryProfile(userId: string): Promise<UserMemoryProfile> {
  if (!userId) return createDefaultMemoryProfile("anonymous");

  if (memoryStore.has(userId)) {
    return memoryStore.get(userId)!;
  }

  // Load from persistent cache or default
  const defaultProf = createDefaultMemoryProfile(userId);
  memoryStore.set(userId, defaultProf);
  return defaultProf;
}

/**
 * Save or update an explicit memory item
 */
export async function saveUserMemoryItem(
  userId: string,
  category: MemoryCategory,
  key: string,
  value: string,
  confidence: number = 1.0,
  source: string = "user_explicit"
): Promise<MemoryItem> {
  const profile = await getUserMemoryProfile(userId);
  const now = new Date().toISOString();

  const existingIdx = profile.memories.findIndex(
    (m) => m.category === category && m.key.toLowerCase() === key.toLowerCase()
  );

  let item: MemoryItem;

  if (existingIdx >= 0) {
    profile.memories[existingIdx] = {
      ...profile.memories[existingIdx],
      value,
      confidence,
      source,
      updatedAt: now,
    };
    item = profile.memories[existingIdx];
  } else {
    item = {
      id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId,
      category,
      key,
      value,
      confidence,
      source,
      createdAt: now,
      updatedAt: now,
    };
    profile.memories.push(item);
  }

  // Sync category arrays
  syncCategoryArrays(profile);
  memoryStore.set(userId, profile);
  return item;
}

/**
 * Delete a specific memory item by ID with strict user isolation
 */
export async function deleteUserMemoryItem(userId: string, memoryId: string): Promise<boolean> {
  const profile = await getUserMemoryProfile(userId);
  const beforeLen = profile.memories.length;
  profile.memories = profile.memories.filter((m) => m.id !== memoryId);

  if (profile.memories.length !== beforeLen) {
    syncCategoryArrays(profile);
    memoryStore.set(userId, profile);
    return true;
  }
  return false;
}

/**
 * Clear all memories for a user
 */
export async function clearAllUserMemories(userId: string): Promise<void> {
  const fresh = createDefaultMemoryProfile(userId);
  memoryStore.set(userId, fresh);
}

/**
 * Toggle whether memory is enabled for a user
 */
export async function toggleUserMemoryEnabled(userId: string, isEnabled: boolean): Promise<boolean> {
  const profile = await getUserMemoryProfile(userId);
  profile.isEnabled = isEnabled;
  memoryStore.set(userId, profile);
  return isEnabled;
}

/**
 * Retrieve ONLY relevant memories for the current prompt (preventing context bloat)
 */
export function getRelevantMemories(
  prompt: string,
  profile: UserMemoryProfile | null,
  maxItems: number = 5
): MemoryItem[] {
  if (!profile || !profile.isEnabled || profile.memories.length === 0) {
    return [];
  }

  const cleanPrompt = prompt.toLowerCase();
  const tokens = cleanPrompt
    .split(/[\s,.;:!?()\[\]{}'"]+/)
    .filter((t) => t.length > 2);

  const scored = profile.memories.map((mem) => {
    let score = 0;
    const memKey = mem.key.toLowerCase();
    const memVal = mem.value.toLowerCase();

    // Direct substring hit
    if (cleanPrompt.includes(memKey) || cleanPrompt.includes(memVal)) {
      score += 5;
    }

    // Token overlap scoring
    for (const token of tokens) {
      if (memKey.includes(token)) score += 2;
      if (memVal.includes(token)) score += 1;
    }

    // Boost ongoing projects & preferences
    if (mem.category === "ongoing_projects" && (cleanPrompt.includes("project") || cleanPrompt.includes("aplikasi") || cleanPrompt.includes("web"))) {
      score += 3;
    }
    if (mem.category === "skill_level" && (cleanPrompt.includes("belajar") || cleanPrompt.includes("jelaskan") || cleanPrompt.includes("bagaimana"))) {
      score += 2;
    }

    return { mem, score };
  });

  // Filter items with score > 0, sort by relevance and recency
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)
    .map((s) => s.mem);
}

/**
 * Automatically extract durable user facts from conversation turns (e.g. projects, skill level, preferences)
 * without storing temporary or transient chatter.
 */
export async function extractAndStoreDurableFacts(
  userId: string,
  userPrompt: string
): Promise<MemoryItem[]> {
  if (!userId) return [];
  const lower = userPrompt.toLowerCase().trim();
  const added: MemoryItem[] = [];

  // 1. Detect Ongoing Projects (e.g., "saya sedang membuat/mengembangkan platform...")
  const projectMatch = lower.match(/(?:saya sedang|lagi|sedang)\s+(?:membuat|membangun|mengembangkan|bikin|develop)\s+([a-z0-9\s\-_\.]+)/i);
  if (projectMatch && projectMatch[1] && projectMatch[1].length > 4 && projectMatch[1].length < 60) {
    const proj = projectMatch[1].trim();
    if (!proj.includes("pertanyaan") && !proj.includes("tes") && !proj.includes("tugas kuliah")) {
      const item = await saveUserMemoryItem(
        userId,
        "ongoing_projects",
        `Proyek: ${proj}`,
        `Pengguna sedang mengembangkan ${proj}`,
        0.9,
        "auto_inferred"
      );
      added.push(item);
    }
  }

  // 2. Detect Skill Level (e.g., "saya pemula di python", "saya masih baru belajar next.js")
  const skillMatch = lower.match(/(?:saya|aku)\s+(?:masih\s+)?(pemula|baru belajar|beginner|intermediate|menengah|mahir|expert)\s+(?:di|dalam|pada|untuk)?\s*([a-z0-9\s\.\+#]+)?/i);
  if (skillMatch) {
    const levelRaw = skillMatch[1].toLowerCase();
    const topic = (skillMatch[2] || "").trim() || "Umum";
    let normalizedLevel: "beginner" | "intermediate" | "advanced" = "beginner";
    if (levelRaw.includes("menengah") || levelRaw.includes("intermediate")) normalizedLevel = "intermediate";
    if (levelRaw.includes("mahir") || levelRaw.includes("expert")) normalizedLevel = "advanced";

    const item = await saveUserMemoryItem(
      userId,
      "skill_level",
      `Tingkat Keahlian ${topic}`,
      `Tingkat ${normalizedLevel} untuk ${topic}`,
      0.95,
      "auto_inferred"
    );
    added.push(item);
  }

  // 3. Detect Learning Preferences (e.g., "saya lebih suka penjelasan step by step", "suka kode langsung")
  if (lower.includes("step by step") || lower.includes("langkah demi langkah")) {
    const item = await saveUserMemoryItem(
      userId,
      "learning_preferences",
      "Format Penjelasan",
      "Menyukai penjelasan bertahap (step-by-step)",
      0.85,
      "auto_inferred"
    );
    added.push(item);
  }

  return added;
}

/**
 * Synchronize flat profile arrays from raw memories list
 */
function syncCategoryArrays(profile: UserMemoryProfile) {
  profile.learningPreferences = profile.memories
    .filter((m) => m.category === "learning_preferences")
    .map((m) => m.value);

  profile.preferredTopics = profile.memories
    .filter((m) => m.category === "preferred_topics")
    .map((m) => m.value);

  profile.ongoingProjects = profile.memories
    .filter((m) => m.category === "ongoing_projects")
    .map((m) => m.value);

  profile.importantContext = profile.memories
    .filter((m) => m.category === "important_context")
    .map((m) => m.value);
}
