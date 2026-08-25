import {
  ChatDialogueTurn,
  ResolvedContext,
  UserAcademicContext,
  UserMemoryProfile,
} from "./types";
import { detectUserIntent } from "./intent-detector";

/**
 * Multi-Turn Context & Reference Resolution Engine
 */
export function resolveConversationContext(
  currentPrompt: string,
  history: ChatDialogueTurn[] = [],
  academicContext: UserAcademicContext | null = null,
  userMemory: UserMemoryProfile | null = null,
  focusedModuleId?: string,
  fileAttachment?: { fileName: string }
): ResolvedContext {
  const cleanPrompt = (currentPrompt || "").trim();
  const lower = cleanPrompt.toLowerCase();
  const intent = detectUserIntent(cleanPrompt, history, !!fileAttachment);

  // 1. Scan conversation history backwards to reconstruct active entities
  let activeTopic = "";
  let activeLanguage = intent.programmingLanguage;
  let activeSkillLevel: string | undefined = undefined;
  let referencedEntity: string | undefined = undefined;
  let followUpTarget: string | undefined = undefined;

  // Check user memory profile for declared skill levels
  if (userMemory?.skillLevel) {
    for (const [subj, lvl] of Object.entries(userMemory.skillLevel)) {
      if (lower.includes(subj.toLowerCase())) {
        activeSkillLevel = lvl;
        break;
      }
    }
  }

  // 2. Trace previous turns for active topic and references
  const reversedHistory = [...history].reverse();

  for (const turn of reversedHistory) {
    const turnLower = turn.text.toLowerCase();

    // Check if turn stated a skill level (e.g. "saya masih pemula", "saya pemula", "level advance")
    if (!activeSkillLevel) {
      if (turnLower.includes("pemula") || turnLower.includes("beginner") || turnLower.includes("baru belajar")) {
        activeSkillLevel = "beginner";
      } else if (turnLower.includes("menengah") || turnLower.includes("intermediate")) {
        activeSkillLevel = "intermediate";
      } else if (turnLower.includes("mahir") || turnLower.includes("expert") || turnLower.includes("advanced")) {
        activeSkillLevel = "advanced";
      }
    }

    // Check if turn introduced a language/topic
    if (!activeLanguage) {
      if (turnLower.includes("python")) activeLanguage = "Python";
      else if (turnLower.includes("typescript") || turnLower.includes("next.js") || turnLower.includes("react")) activeLanguage = "TypeScript";
      else if (turnLower.includes("javascript")) activeLanguage = "JavaScript";
      else if (turnLower.includes("sql") || turnLower.includes("postgresql")) activeLanguage = "SQL";
      else if (turnLower.includes("java")) activeLanguage = "Java";
      else if (turnLower.includes("c++")) activeLanguage = "C++";
      else if (turnLower.includes("golang") || turnLower.includes("go")) activeLanguage = "Go";
      else if (turnLower.includes("rust")) activeLanguage = "Rust";
    }

    // Extract main entity from previous user prompts if we don't have one
    if (!referencedEntity && turn.role === "user") {
      referencedEntity = turn.text;
    }
  }

  // Also check current prompt for skill level
  if (lower.includes("pemula") || lower.includes("beginner") || lower.includes("baru belajar")) {
    activeSkillLevel = "beginner";
  } else if (lower.includes("menengah") || lower.includes("intermediate")) {
    activeSkillLevel = "intermediate";
  } else if (lower.includes("mahir") || lower.includes("expert") || lower.includes("advanced")) {
    activeSkillLevel = "advanced";
  }

  // 3. Resolve Anaphoric References ("itu", "yang tadi", "lanjutkan", "tambahkan X", "step by step")
  if (intent.isFollowUp && reversedHistory.length > 0) {
    const lastUserTurn = reversedHistory.find((t) => t.role === "user");
    const lastAiTurn = reversedHistory.find((t) => t.role === "ai");

    if (lastUserTurn) {
      followUpTarget = lastUserTurn.text;
      activeTopic = activeLanguage
        ? `${activeLanguage} (${lastUserTurn.text})`
        : lastUserTurn.text;
    } else if (lastAiTurn) {
      followUpTarget = lastAiTurn.text.slice(0, 100);
      activeTopic = activeLanguage || "Diskusi Sebelumnya";
    }
  } else {
    activeTopic = activeLanguage ? `${activeLanguage}: ${cleanPrompt}` : cleanPrompt;
  }

  // 4. Resolve Target Module
  let relevantModuleId: string | undefined = focusedModuleId;
  if (!relevantModuleId && academicContext?.modulesMemory) {
    const matchedMod = academicContext.modulesMemory.find((m) =>
      lower.includes(m.title.toLowerCase())
    );
    if (matchedMod) {
      relevantModuleId = matchedMod.id;
    }
  }

  return {
    activeTopic: activeTopic || cleanPrompt,
    activeLanguage,
    activeSkillLevel,
    referencedEntity,
    followUpTarget,
    isFollowUp: intent.isFollowUp,
    relevantModuleId,
    relevantFileName: fileAttachment?.fileName,
    resolvedUserIntent: intent,
  };
}
