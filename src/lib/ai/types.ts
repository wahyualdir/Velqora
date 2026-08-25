/**
 * Core Types for Velqora Production AI Subsystem
 */

export type AIIntentType =
  | "general_question"
  | "technical_question"
  | "coding"
  | "debugging"
  | "explanation"
  | "summarization"
  | "writing"
  | "project_planning"
  | "learning"
  | "file_analysis"
  | "follow_up"
  | "clarification"
  | "memory_request"
  | "quiz_generation";

export interface AIIntent {
  type: AIIntentType;
  confidence: number;
  isFollowUp: boolean;
  topic?: string;
  programmingLanguage?: string;
  requestedFormat?: "code_only" | "step_by_step" | "prompt_ready" | "detailed" | "concise";
  requiresSearchOrData?: boolean;
}

export type MemoryCategory =
  | "learning_preferences"
  | "preferred_topics"
  | "skill_level"
  | "communication_preferences"
  | "ongoing_projects"
  | "important_context";

export interface MemoryItem {
  id: string;
  userId: string;
  category: MemoryCategory;
  key: string;
  value: string;
  confidence: number;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserMemoryProfile {
  userId: string;
  isEnabled: boolean;
  learningPreferences: string[];
  preferredTopics: string[];
  skillLevel: Record<string, "beginner" | "intermediate" | "advanced">;
  communicationPreferences: string[];
  ongoingProjects: string[];
  importantContext: string[];
  memories: MemoryItem[];
}

export interface ResolvedContext {
  activeTopic: string;
  activeLanguage?: string;
  activeSkillLevel?: string;
  referencedEntity?: string;
  followUpTarget?: string;
  isFollowUp: boolean;
  relevantModuleId?: string;
  relevantFileName?: string;
  resolvedUserIntent: AIIntent;
}

export interface ConversationSummary {
  topic: string;
  goals: string[];
  decisions: string[];
  constraints: string[];
  activeTask?: string;
  lastUpdatedTurn: number;
}

export interface ChatDialogueTurn {
  role: "user" | "ai";
  text: string;
  timestamp?: string;
  attachmentName?: string;
}

export interface ModuleMemoryRef {
  id: string;
  title: string;
  level: string;
  progress: number;
  notes?: string;
  chapters: string[];
  description?: string;
}

export interface UserAcademicContext {
  displayName: string;
  email: string;
  totalMateri: number;
  totalModul: number;
  modulesMemory: ModuleMemoryRef[];
  recentMaterials: Array<{ title: string; subject?: string; description?: string; notes?: string }>;
  pendingTasks: string[];
}

export interface PromptContext {
  systemInstructions: string;
  userProfile?: {
    displayName: string;
    learningStyle?: string;
    skillLevels?: Record<string, string>;
  };
  relevantMemories: MemoryItem[];
  conversationSummary?: ConversationSummary;
  recentMessages: ChatDialogueTurn[];
  currentMessage: string;
  fileAttachment?: {
    fileName: string;
    fileText?: string;
    mimeType?: string;
    base64?: string;
  };
  focusedModule?: ModuleMemoryRef;
}

export interface TelemetryLog {
  requestId: string;
  userId: string;
  timestamp: string;
  model: string;
  intent: AIIntentType;
  latencyMs: number;
  memoryHitsCount: number;
  hasSummary: boolean;
  status: "success" | "fallback" | "error";
  errorMessage?: string;
}
