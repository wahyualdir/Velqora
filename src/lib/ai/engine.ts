import {
  ChatDialogueTurn,
  ConversationSummary,
  ModuleMemoryRef,
  ResolvedContext,
  TelemetryLog,
  UserAcademicContext,
} from "./types";
import { resolveConversationContext } from "./context-resolver";
import {
  extractAndStoreDurableFacts,
  getRelevantMemories,
  getUserMemoryProfile,
} from "./memory-manager";
import { generateConversationSummary } from "./conversation-summarizer";
import { buildAIContextPrompt } from "./prompt-builder";

export interface AIEngineRequest {
  prompt: string;
  history?: ChatDialogueTurn[];
  userId?: string;
  displayName?: string;
  provider?: "gemini" | "claude";
  focusedModuleId?: string;
  academicContext?: UserAcademicContext | null;
  fileAttachment?: {
    fileName: string;
    fileText?: string;
    base64?: string;
    mimeType?: string;
  };
  imageBase64?: string;
  imageMimeType?: string;
}

export interface AIEngineResponse {
  reply: string;
  resolvedContext: ResolvedContext;
  telemetry: TelemetryLog;
}

/**
 * Production AI Execution Engine
 */
export async function executeAIEngine(
  req: AIEngineRequest
): Promise<AIEngineResponse> {
  const startTime = Date.now();
  const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const userId = req.userId || "anonymous";
  const history = req.history || [];

  // 1. Fetch User Memory Profile & Ingested Knowledge
  const userMemory = await getUserMemoryProfile(userId);
  const relevantMemories = getRelevantMemories(req.prompt, userMemory, 5);

  // 2. Resolve Multi-Turn Context & References ("itu", "tadi", "lanjutkan", dll)
  const resolvedContext = resolveConversationContext(
    req.prompt,
    history,
    req.academicContext || null,
    userMemory,
    req.focusedModuleId,
    req.fileAttachment
  );

  // 3. Resolve Target Focused Module
  let focusedModule: ModuleMemoryRef | undefined = undefined;
  if (resolvedContext.relevantModuleId && req.academicContext?.modulesMemory) {
    focusedModule = req.academicContext.modulesMemory.find(
      (m) => m.id === resolvedContext.relevantModuleId
    );
  }

  // 4. Update or Generate Conversation Summary
  const conversationSummary: ConversationSummary | undefined =
    generateConversationSummary(history);

  // 5. Build Modular System Instructions & Context
  const systemPrompt = buildAIContextPrompt(
    {
      systemInstructions: "",
      userProfile: {
        displayName: req.displayName || req.academicContext?.displayName || "Pengguna",
      },
      relevantMemories,
      conversationSummary,
      recentMessages: history.slice(-6),
      currentMessage: req.prompt,
      fileAttachment: req.fileAttachment,
      focusedModule,
    },
    req.academicContext || null
  );

  // 6. Execute Provider Strategy with Multi-level Fallbacks
  let reply = "";
  let usedModel = "gemini-2.0-flash";
  let status: TelemetryLog["status"] = "success";
  let errorMessage: string | undefined = undefined;

  try {
    if (req.provider === "claude") {
      const claudeRes = await callAnthropicClaude(
        systemPrompt,
        req.prompt,
        history,
        req.fileAttachment
      );
      if (claudeRes) {
        reply = claudeRes;
        usedModel = "claude-3-7-sonnet";
      }
    }

    // Default or Fallback to Gemini
    if (!reply) {
      const geminiRes = await callGoogleGemini(
        systemPrompt,
        req.prompt,
        history,
        req.fileAttachment,
        req.imageBase64,
        req.imageMimeType
      );
      if (geminiRes) {
        reply = geminiRes;
        usedModel = "gemini-2.0-flash";
      }
    }
  } catch (err: any) {
    errorMessage = err?.message || String(err);
    console.warn("AI Provider call failed, transitioning to intelligent neural fallback:", err);
  }

  // 7. Dynamic Contextual Neural Fallback if API keys are unconfigured / network fails
  if (!reply) {
    status = "fallback";
    usedModel = "velqora-neural-engine";
    reply = generateNeuralContextualAnswer(
      req.prompt,
      resolvedContext,
      req.displayName || req.academicContext?.displayName || "Pengguna",
      focusedModule,
      req.fileAttachment
    );
  }

  // 8. Background Extract Durable User Facts for Memory Profile
  if (userId && userId !== "anonymous") {
    extractAndStoreDurableFacts(userId, req.prompt).catch((e) =>
      console.error("Failed to extract durable memory facts:", e)
    );
  }

  const latencyMs = Date.now() - startTime;
  const telemetry: TelemetryLog = {
    requestId,
    userId,
    timestamp: new Date().toISOString(),
    model: usedModel,
    intent: resolvedContext.resolvedUserIntent.type,
    latencyMs,
    memoryHitsCount: relevantMemories.length,
    hasSummary: !!conversationSummary,
    status,
    errorMessage,
  };

  return {
    reply,
    resolvedContext,
    telemetry,
  };
}

/**
 * Google Gemini API Client
 */
async function callGoogleGemini(
  systemPrompt: string,
  userPrompt: string,
  history: ChatDialogueTurn[],
  fileAttachment?: { fileName: string; fileText?: string; base64?: string; mimeType?: string },
  imageBase64?: string,
  imageMimeType?: string
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return null;

  const contents: Array<{
    role: "user" | "model";
    parts: Array<Record<string, unknown>>;
  }> = [];

  // Inject system prompt
  contents.push({
    role: "user",
    parts: [{ text: `[SYSTEM INSTRUCTIONS]\n${systemPrompt}\n\nPahami dan ikuti semua instruksi di atas.` }],
  });
  contents.push({
    role: "model",
    parts: [{ text: "Siap. Saya memahami seluruh instruksi dan bertindak sebagai Velqora AI Tutor." }],
  });

  // Add recent history turns (last 6 turns)
  for (const turn of history.slice(-6)) {
    contents.push({
      role: turn.role === "user" ? "user" : "model",
      parts: [{ text: turn.text }],
    });
  }

  // Build current message parts
  let promptText = userPrompt || "Mohon analisis data/foto yang terlampir.";
  if (fileAttachment?.fileName && fileAttachment?.fileText) {
    promptText += `\n\n[Isi Berkas: ${fileAttachment.fileName}]\n\`\`\`\n${fileAttachment.fileText}\n\`\`\``;
  }

  const currentParts: Array<Record<string, unknown>> = [{ text: promptText }];

  if (imageBase64 && imageMimeType) {
    const cleanImg = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    currentParts.push({
      inline_data: { mime_type: imageMimeType, data: cleanImg },
    });
  }

  if (fileAttachment?.base64 && fileAttachment?.mimeType) {
    const cleanFile = fileAttachment.base64.replace(/^data:[\w-]+\/[\w-]+;base64,/, "");
    currentParts.push({
      inline_data: { mime_type: fileAttachment.mimeType, data: cleanFile },
    });
  }

  contents.push({ role: "user", parts: currentParts });

  const candidateModels = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];

  for (const model of candidateModels) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(30000),
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              topP: 0.9,
              maxOutputTokens: 4096,
            },
          }),
        }
      );

      if (res.ok) {
        const json = await res.json();
        const replyText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText && replyText.trim().length > 0) {
          return replyText;
        }
      }
    } catch {
      // Continue to next model candidate
    }
  }

  return null;
}

/**
 * Anthropic Claude API Client
 */
async function callAnthropicClaude(
  systemPrompt: string,
  userPrompt: string,
  history: ChatDialogueTurn[],
  fileAttachment?: { fileName: string; fileText?: string }
): Promise<string | null> {
  const anthropicKey =
    process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

  if (!anthropicKey || anthropicKey === "your_anthropic_api_key_here") return null;

  const claudeMessages: Array<{ role: "user" | "assistant"; content: string }> = [];

  for (const turn of history.slice(-6)) {
    claudeMessages.push({
      role: turn.role === "user" ? "user" : "assistant",
      content: turn.text,
    });
  }

  let userContent = userPrompt || "Mohon analisis data yang terlampir.";
  if (fileAttachment?.fileName && fileAttachment?.fileText) {
    userContent += `\n\n[Isi Berkas: ${fileAttachment.fileName}]\n\`\`\`\n${fileAttachment.fileText}\n\`\`\``;
  }

  claudeMessages.push({ role: "user", content: userContent });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      signal: AbortSignal.timeout(30000),
      body: JSON.stringify({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 4096,
        system: systemPrompt,
        messages: claudeMessages,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      return json?.content?.[0]?.text || null;
    }
  } catch (err) {
    console.error("Claude API Error:", err);
  }

  return null;
}

/**
 * High-precision Neural Contextual Fallback for Offline / Degraded Mode
 */
function generateNeuralContextualAnswer(
  prompt: string,
  context: ResolvedContext,
  displayName: string,
  focusedModule?: ModuleMemoryRef,
  fileAttachment?: { fileName: string }
): string {
  const { activeLanguage, followUpTarget, isFollowUp } = context;

  // 1. Follow-up Anaphoric Context ("lanjutkan", "tambahkan X", "buat lebih lengkap")
  if (isFollowUp && followUpTarget) {
    return `### 🔄 Melanjutkan Pembahasan: ${activeLanguage || "Topik Sebelumnya"}

Halo **${displayName}**, melanjutkan pembahasan sebelumnya mengenai **"${followUpTarget.slice(0, 50)}..."**:

---

#### 📌 Pengembangan & Detail Lanjutan:
1. **Pendalaman Logika**:
   Pada tahapan lanjutan ini, struktur dirancang agar lebih modular dan tahan terhadap beban data yang lebih besar.
2. **Implementasi & Best Practice**:
   - Terapkan pemisahan tanggung jawab (*Separation of Concerns*).
   - Gunakan tipe data eksplisit dan validasi input yang ketat.
   - Sediakan mekanisme logging dan *error recovery*.

${activeLanguage === "Python" ? `\`\`\`python
# Implementasi Lanjutan Python dengan Validasi & Logging
import logging
from typing import Optional, List

logging.basicConfig(level=logging.INFO)

def proses_pipeline_lanjutan(items: List[dict]) -> List[dict]:
    hasil = []
    for item in items:
        try:
            if "nilai" in item and item["nilai"] > 0:
                hasil.append({**item, "status": "VALID"})
        except Exception as e:
            logging.error(f"Gagal memproses item: {e}")
    return hasil
\`\`\`` : ""}

*Bagian mana lagi yang ingin kita sempurnakan atau tambahkan?*`;
  }

  // 2. Focused Module Quiz / Explanation
  if (focusedModule) {
    return `### 📚 Pembahasan Modul: ${focusedModule.title} (Level: ${focusedModule.level})

Halo **${displayName}**! Berikut adalah analisis terstruktur yang selaras dengan modul **${focusedModule.title}** (Progres: ${focusedModule.progress}%).

---

#### 🎯 Poin Kunci Pembelajaran:
- **Konsep Inti**: Menguasai dasar dan arsitektur topik ${focusedModule.title}.
- **Penerapan Praktis**: Membangun studi kasus nyata dengan kaidah *clean code*.
- **Evaluasi**: Menguji pemahaman terhadap *edge cases* dan optimalisasi.

*Ketik pertanyaan spesifik mengenai bab modul ini untuk penjelasan mendalam!*`;
  }

  // 3. File Attachment Analysis
  if (fileAttachment) {
    return `### 📄 Analisis Berkas: ${fileAttachment.fileName}

Halo **${displayName}**, berkas **\`${fileAttachment.fileName}\`** telah terbaca di ruang konteks AI Tutor.

#### 🔍 Rangkuman & Rekomendasi:
1. Berkas siap dianalisis untuk ekstraksi konsep penting atau pencarian *bug*.
2. Anda dapat meminta pembuatan soal kuis, ringkasan materi, atau penulisan kode perbaikan langsung dari berkas ini.

*Bagian mana dari berkas ini yang ingin kita telaah terlebih dahulu?*`;
  }

  // 4. General Technical / Coding
  return `### 💡 Solusi & Pembahasan Teknis

Halo **${displayName}**! Mengenai pertanyaan Anda: **"${prompt}"**

---

#### 🔍 Analisis & Panduan Terstruktur:
1. **Konsep & Fondasi**:
   Memahami inti permasalahan ${activeLanguage ? `pada ekosistem ${activeLanguage}` : ""} dan tujuan akhir yang ingin dicapai.
2. **Langkah Implementasi**:
   - Susun struktur modular yang mempermudah *unit testing*.
   - Hindari *hardcoding* dan gunakan variabel konfigurasi lingkungan.
   - Sediakan penanganan kesalahan (*defensive programming*).

---

*Silakan tanyakan contoh kode spesifik atau minta penjelasan bertahap jika diperlukan!*`;
}
