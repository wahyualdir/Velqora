/**
 * Production AI Subsystem Comprehensive Test Suite
 * Tests 10 key architectural capabilities of Velqora AI.
 */

import { detectUserIntent } from "../intent-detector";
import { resolveConversationContext } from "../context-resolver";
import {
  clearAllUserMemories,
  deleteUserMemoryItem,
  extractAndStoreDurableFacts,
  getRelevantMemories,
  getUserMemoryProfile,
  saveUserMemoryItem,
} from "../memory-manager";
import { generateConversationSummary } from "../conversation-summarizer";
import { buildAIContextPrompt } from "../prompt-builder";
import { executeAIEngine } from "../engine";
import { ChatDialogueTurn } from "../types";

export async function runAISubsystemTests(): Promise<{
  passed: number;
  failed: number;
  results: Array<{ test: string; status: "PASS" | "FAIL"; details?: string }>;
}> {
  const results: Array<{ test: string; status: "PASS" | "FAIL"; details?: string }> = [];

  // Helper to record result
  const record = (name: string, condition: boolean, details?: string) => {
    if (condition) {
      results.push({ test: name, status: "PASS" });
    } else {
      results.push({ test: name, status: "FAIL", details });
    }
  };

  // -------------------------------------------------------------
  // TEST 1: Short-term Multi-turn Context & Skill Level Tracking
  // -------------------------------------------------------------
  try {
    const history: ChatDialogueTurn[] = [
      { role: "user", text: "Saya sedang belajar Python." },
      { role: "ai", text: "Bagus! Python adalah bahasa yang sangat fleksibel." },
      { role: "user", text: "Saya masih pemula." },
      { role: "ai", text: "Baik, saya akan sesuaikan penjelasan untuk tingkat pemula." },
    ];
    const resolved = resolveConversationContext("Jelaskan function.", history);
    const pass =
      resolved.activeLanguage === "Python" &&
      resolved.activeSkillLevel === "beginner" &&
      resolved.resolvedUserIntent.type === "explanation";

    record(
      "TEST 1: Multi-turn short-term memory (Python + Beginner + Function)",
      pass,
      `Resolved: lang=${resolved.activeLanguage}, level=${resolved.activeSkillLevel}, intent=${resolved.resolvedUserIntent.type}`
    );
  } catch (e: any) {
    record("TEST 1: Multi-turn short-term memory", false, e.message);
  }

  // -------------------------------------------------------------
  // TEST 2: Context Resolution for Follow-up ("Tambahkan XGBoost")
  // -------------------------------------------------------------
  try {
    const history: ChatDialogueTurn[] = [
      { role: "user", text: "Buat project machine learning untuk prediksi harga rumah." },
      { role: "ai", text: "Berikut arsitektur pipeline Machine Learning dengan scikit-learn..." },
    ];
    const resolved = resolveConversationContext("Tambahkan XGBoost.", history);
    const pass =
      resolved.isFollowUp &&
      resolved.followUpTarget?.includes("prediksi harga rumah") &&
      resolved.activeLanguage === "Python";

    record(
      "TEST 2: Anaphoric follow-up context resolution ('Tambahkan XGBoost')",
      !!pass,
      `Resolved followUpTarget=${resolved.followUpTarget}`
    );
  } catch (e: any) {
    record("TEST 2: Context Resolution", false, e.message);
  }

  // -------------------------------------------------------------
  // TEST 3: Durable Fact Extraction & Storage
  // -------------------------------------------------------------
  const testUserA = `test_user_a_${Date.now()}`;
  try {
    await extractAndStoreDurableFacts(
      testUserA,
      "Saya sedang mengembangkan platform pembelajaran online dengan Next.js."
    );
    const profile = await getUserMemoryProfile(testUserA);
    const hasProject = profile.ongoingProjects.some((p) =>
      p.toLowerCase().includes("platform pembelajaran")
    );

    record(
      "TEST 3: Automatic durable fact extraction (Ongoing Project)",
      hasProject,
      `Projects found: ${JSON.stringify(profile.ongoingProjects)}`
    );
  } catch (e: any) {
    record("TEST 3: Durable Fact Extraction", false, e.message);
  }

  // -------------------------------------------------------------
  // TEST 4: Relevant Memory Retrieval (Preventing Bloat)
  // -------------------------------------------------------------
  try {
    await saveUserMemoryItem(testUserA, "preferred_topics", "Database", "Suka PostgreSQL dan Supabase");
    await saveUserMemoryItem(testUserA, "learning_preferences", "Gaya Belajar", "Suka penjelasan step-by-step");
    await saveUserMemoryItem(testUserA, "ongoing_projects", "App", "Mobile App Flutter");

    const profile = await getUserMemoryProfile(testUserA);
    const relevantForDb = getRelevantMemories("Bagaimana cara query PostgreSQL?", profile);
    const pass =
      relevantForDb.length > 0 &&
      relevantForDb.some((m) => m.key.includes("Database") || m.value.includes("PostgreSQL"));

    record(
      "TEST 4: Relevant memory retrieval scoring",
      pass,
      `Retrieved ${relevantForDb.length} items for DB query`
    );
  } catch (e: any) {
    record("TEST 4: Relevant Memory Retrieval", false, e.message);
  }

  // -------------------------------------------------------------
  // TEST 5: Memory Consent & Deletion
  // -------------------------------------------------------------
  try {
    const item = await saveUserMemoryItem(testUserA, "important_context", "SecretKey", "Private Note to delete");
    const deleted = await deleteUserMemoryItem(testUserA, item.id);
    const profile = await getUserMemoryProfile(testUserA);
    const exists = profile.memories.some((m) => m.id === item.id);

    record(
      "TEST 5: User memory deletion and consent control",
      deleted && !exists,
      `Deleted status: ${deleted}, exists: ${exists}`
    );
  } catch (e: any) {
    record("TEST 5: Memory Deletion", false, e.message);
  }

  // -------------------------------------------------------------
  // TEST 6: User Isolation (User A memories NOT visible to User B)
  // -------------------------------------------------------------
  const testUserB = `test_user_b_${Date.now()}`;
  try {
    const profileB = await getUserMemoryProfile(testUserB);
    const isIsolated =
      profileB.memories.length === 0 &&
      !profileB.ongoingProjects.some((p) => p.includes("platform pembelajaran"));

    record(
      "TEST 6: Multi-tenant user memory isolation",
      isIsolated,
      `User B memory count: ${profileB.memories.length}`
    );
  } catch (e: any) {
    record("TEST 6: User Isolation", false, e.message);
  }

  // -------------------------------------------------------------
  // TEST 7: Rolling Conversation Summarizer
  // -------------------------------------------------------------
  try {
    const longHistory: ChatDialogueTurn[] = [
      { role: "user", text: "Saya ingin membuat arsitektur LMS." },
      { role: "ai", text: "Baik, mari kita rancang." },
      { role: "user", text: "Gunakan Next.js 15 dan Supabase." },
      { role: "ai", text: "Pilihan yang sangat tepat." },
      { role: "user", text: "Jangan gunakan framework CSS selain Tailwind." },
      { role: "ai", text: "Dipahami, hanya menggunakan Tailwind CSS." },
      { role: "user", text: "Sekarang buatkan schema tabel users." },
    ];
    const summary = generateConversationSummary(longHistory);
    const pass =
      !!summary &&
      summary.decisions.length > 0 &&
      summary.constraints.some((c) => c.toLowerCase().includes("tailwind"));

    record(
      "TEST 7: Rolling conversation summarizer (Decisions & Constraints)",
      pass,
      `Summary generated: ${JSON.stringify(summary)}`
    );
  } catch (e: any) {
    record("TEST 7: Conversation Summarizer", false, e.message);
  }

  // -------------------------------------------------------------
  // TEST 8: Intent Detection & Format Request
  // -------------------------------------------------------------
  try {
    const intent1 = detectUserIntent("Langsung kodenya saja untuk binary search");
    const intent2 = detectUserIntent("Jelaskan step by step algoritma Dijkstra");
    const intent3 = detectUserIntent("Kenapa muncul error TypeError: undefined is not a function?");

    const pass =
      intent1.requestedFormat === "code_only" &&
      intent2.requestedFormat === "step_by_step" &&
      intent3.type === "debugging";

    record(
      "TEST 8: Intent detection and requested format detection",
      pass,
      `Intent1=${intent1.requestedFormat}, Intent2=${intent2.requestedFormat}, Intent3=${intent3.type}`
    );
  } catch (e: any) {
    record("TEST 8: Intent Detection", false, e.message);
  }

  // -------------------------------------------------------------
  // TEST 9: Prompt Builder Modular Assembly
  // -------------------------------------------------------------
  try {
    const prompt = buildAIContextPrompt(
      {
        systemInstructions: "",
        userProfile: { displayName: "Wahyu" },
        relevantMemories: [
          {
            id: "1",
            userId: testUserA,
            category: "ongoing_projects",
            key: "Proyek",
            value: "Learning Management System",
            confidence: 1,
            createdAt: "",
            updatedAt: "",
          },
        ],
        recentMessages: [],
        currentMessage: "Halo!",
      },
      null
    );

    const pass =
      prompt.includes("Velqora AI Tutor") &&
      prompt.includes("PRINSIP KEJUJURAN") &&
      prompt.includes("Learning Management System") &&
      prompt.includes("Wahyu");

    record(
      "TEST 9: Modular Prompt Builder composition integrity",
      pass,
      `Prompt sample: ${prompt.slice(0, 150)}...`
    );
  } catch (e: any) {
    record("TEST 9: Prompt Builder", false, e.message);
  }

  // -------------------------------------------------------------
  // TEST 10: End-to-End Engine Execution & Telemetry Logging
  // -------------------------------------------------------------
  try {
    const response = await executeAIEngine({
      prompt: "Bagaimana cara membuat REST API modular di TypeScript?",
      userId: testUserA,
      displayName: "Wahyu",
    });

    const pass =
      typeof response.reply === "string" &&
      response.reply.length > 50 &&
      response.telemetry &&
      response.telemetry.latencyMs >= 0 &&
      response.resolvedContext.activeLanguage === "TypeScript";

    record(
      "TEST 10: End-to-end AI Engine execution & telemetry",
      pass,
      `Model: ${response.telemetry.model}, Latency: ${response.telemetry.latencyMs}ms`
    );
  } catch (e: any) {
    record("TEST 10: End-to-End Engine Execution", false, e.message);
  }

  // Cleanup test user
  await clearAllUserMemories(testUserA);
  await clearAllUserMemories(testUserB);

  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;

  return { passed, failed, results };
}
