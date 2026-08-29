"use server";

import { createClient } from "@/lib/supabase/server";
import { executeAIEngine } from "@/lib/ai/engine";
import { ModuleMemoryRef, UserAcademicContext, ChatDialogueTurn } from "@/lib/ai/types";
import { checkRateLimit, logger } from "@/lib/observability";

// ==========================================
// TYPES (PRESERVED FOR BACKWARD COMPATIBILITY)
// ==========================================

export interface AIChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  category?: string;
}

/** Lightweight chat turn sent from the client for multi-turn context */
export interface ChatTurn {
  role: "user" | "ai";
  text: string;
}

export interface ModuleKnowledgeItem {
  id: string;
  title: string;
  description: string;
  level: string;
  progress: number;
  notes: string;
  chapters: string[];
  updatedAt: string;
}

/**
 * Fetch all ingested user modules and learning materials for the AI Knowledge Memory
 */
async function getUserLearningContext(_focusedModuleId?: string): Promise<UserAcademicContext | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const email = user.email || "";
    const displayName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      email.split("@")[0] ||
      "Pengguna";

    // Fetch modules with chapters, materials, tasks and statistics
    const [modulesRes, materialsRes, tasksRes, materiCountRes, modulCountRes] =
      await Promise.all([
        supabase
          .from("modules")
          .select("id, title, description, level, progress, notes, updated_at, chapters:module_chapters(title, is_completed)")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(10),
        supabase
          .from("materials")
          .select("title, subject, description, notes")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(8),
        supabase
          .from("tasks")
          .select("title, subject")
          .eq("user_id", user.id)
          .neq("status", "selesai")
          .order("deadline", { ascending: true })
          .limit(4),
        supabase
          .from("materials")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("modules")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);

    const formattedModules: ModuleMemoryRef[] = (modulesRes.data || []).map((m: any) => ({
      id: m.id,
      title: m.title,
      description: m.description || "",
      level: m.level || "Umum",
      progress: m.progress || 0,
      notes: m.notes || "",
      chapters: Array.isArray(m.chapters)
        ? m.chapters.map((c: any) => `${c.title}${c.is_completed ? " (Selesai)" : ""}`)
        : [],
    }));

    return {
      displayName,
      email,
      modulesMemory: formattedModules,
      recentMaterials: (materialsRes.data || []).map((m) => ({
        title: m.title,
        subject: m.subject || "",
        description: m.description || "",
        notes: m.notes || "",
      })),
      pendingTasks: (tasksRes.data || []).map(
        (t) => `${t.title}${t.subject ? ` (${t.subject})` : ""}`
      ),
      totalMateri: materiCountRes.count || 0,
      totalModul: modulCountRes.count || 0,
    };
  } catch (err) {
    console.error("Failed to fetch user academic context:", err);
    return null;
  }
}

/**
 * Action to get all user modules for the AI Tutor UI Memory Badge / Filter
 */
export async function getUserKnowledgeModulesAction(): Promise<ModuleKnowledgeItem[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
      .from("modules")
      .select("id, title, description, level, progress, notes, updated_at, chapters:module_chapters(title, is_completed)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    return (data || []).map((m: any) => ({
      id: m.id,
      title: m.title,
      description: m.description || "",
      level: m.level || "Umum",
      progress: m.progress || 0,
      notes: m.notes || "",
      chapters: Array.isArray(m.chapters) ? m.chapters.map((c: any) => c.title) : [],
      updatedAt: m.updated_at,
    }));
  } catch (err) {
    console.error("Failed to get user modules for AI memory:", err);
    return [];
  }
}

/**
 * Server Action for AI Study Tutor Query — Powered by the Production AI Engine
 * (Context-aware, layered memory, multi-turn resolution, and multi-provider fallback)
 */
export async function askAITutorAction(
  userPrompt: string,
  imageBase64?: string,
  imageMimeType?: string,
  fileAttachment?: {
    fileName: string;
    fileText?: string;
    base64?: string;
    mimeType?: string;
  },
  aiProvider: "gemini" | "claude" = "gemini",
  chatHistory?: ChatTurn[],
  focusedModuleId?: string
): Promise<string> {
  const prompt = (userPrompt || "").trim().slice(0, 10000);
  if (!prompt && !imageBase64 && !fileAttachment) {
    return "Silakan ketikkan pertanyaan atau unggah foto/berkas yang ingin didiskusikan!";
  }

  // 1. Fetch current user identity & academic context
  let userId = "guest_user";
  let displayName = "Pengguna";

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userId = user.id;
      displayName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Pengguna";
    }
  } catch {
    // Guest fallback
  }

  // Rate Limit: 20 AI queries per minute per user
  const rateCheck = checkRateLimit(`ai_tutor_${userId}`, 20, 60000);
  if (!rateCheck.allowed) {
    logger.warn("AI_TUTOR_RATE_LIMIT", "Rate limit AI Tutor tercapai", { userId });
    return "Anda mengirim pertanyaan terlalu cepat. Mohon tunggu beberapa detik sebelum bertanya kembali.";
  }

  try {
    const academicContext = await getUserLearningContext(focusedModuleId);

    // 2. Format chat turns for AI engine
    const historyTurns: ChatDialogueTurn[] = (chatHistory || []).map((t) => ({
      role: t.role,
      text: t.text,
    }));

    // 3. Execute through the Production AI Engine
    const result = await executeAIEngine({
      prompt,
      history: historyTurns,
      userId,
      displayName,
      provider: aiProvider,
      focusedModuleId,
      academicContext,
      fileAttachment,
      imageBase64,
      imageMimeType,
    });

    return result.reply;
  } catch (err: any) {
    logger.error("AI_TUTOR_EXEC_ERROR", "Gagal mengeksekusi AI Tutor", err, { userId });
    return "Maaf, terjadi kendala saat menghubungkan ke asisten AI. Silakan coba beberapa saat lagi.";
  }
}
