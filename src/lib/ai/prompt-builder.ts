import { formatSummaryForPrompt } from "./conversation-summarizer";
import { PromptContext, UserAcademicContext } from "./types";

/**
 * Modular System Prompt & Context Orchestrator
 */
export function buildAIContextPrompt(
  ctx: PromptContext,
  academicContext: UserAcademicContext | null
): string {
  const {
    userProfile,
    relevantMemories,
    conversationSummary,
    fileAttachment,
    focusedModule,
  } = ctx;

  const displayName = userProfile?.displayName || "Pengguna";

  // 1. Base Identity & Tone Instructions
  const baseInstructions = `Kamu adalah "Velqora AI Tutor" — asisten belajar dan rekayasa perangkat lunak cerdas tingkat Principal/Expert yang terhubung langsung dengan workspace pembelajaran pengguna.

IDENTITAS & KARAKTER:
- Platform: Velqora
- Karakter: Profesional, natural, presisi, ramah, dan solutif.
- Bahasa: Bahasa Indonesia yang baku namun mengalir alami (kecuali jika pengguna meminta bahasa lain).
- Hindari bahasa template, basa-basi berlebihan, atau emoji berlebihan.
- Jawab langsung ke inti permasalahan dengan kedalaman teknis yang tepat.`;

  // 2. Anti-Hallucination & Honest Boundaries
  const safeguards = `
PRINSIP KEJUJURAN & ANTI-FABRIKASI (KRITIS):
1. JANGAN PERNAH mengarang API, function, library, atau data statistik yang tidak ada.
2. Jika sebuah informasi atau detail teknis tidak tersedia di konteks Anda, nyatakan secara jujur: "Informasi tersebut belum tersedia di konteks saya."
3. Setiap contoh kode HARUS valid, runnable, dan mematuhi standar production modern.`;

  // 3. User Profile & Preferences Section
  const userProfileSection = `
PROFIL PENGGUNA:
- Nama: ${displayName}
- Total Modul Tersimpan: ${academicContext?.totalModul || 0}
- Total Materi Catatan: ${academicContext?.totalMateri || 0}`;

  // 4. Relevant Long-Term Memories Section
  let memoriesSection = "";
  if (relevantMemories && relevantMemories.length > 0) {
    const memList = relevantMemories
      .map((m) => `- [${m.category}] ${m.key}: ${m.value}`)
      .join("\n");
    memoriesSection = `
MEMORI JANGKA PANJANG RELEVAN PENGGUNA:
(Gunakan informasi berikut secara natural tanpa perlu menyebutkan "Berdasarkan memori saya...")
${memList}`;
  }

  // 5. Active Module Context (RAG)
  let moduleContextSection = "";
  if (focusedModule) {
    const chaptersList = focusedModule.chapters.length > 0
      ? `\n  * Bab: ${focusedModule.chapters.join(", ")}`
      : "";
    moduleContextSection = `
MODUL AKTIF (FOKUS UTAMA):
- Judul: "${focusedModule.title}" (${focusedModule.level}, Progres: ${focusedModule.progress}%)
- Deskripsi: ${focusedModule.description || "-"}${chaptersList}
${focusedModule.notes ? `- Catatan Khusus: "${focusedModule.notes}"` : ""}`;
  } else if (academicContext?.modulesMemory && academicContext.modulesMemory.length > 0) {
    const topMods = academicContext.modulesMemory.slice(0, 5).map((m) => `- "${m.title}" (${m.level})`).join("\n");
    moduleContextSection = `
MODUL PEMBELAJARAN PENGGUNA:
${topMods}`;
  }

  // 6. Conversation Summary
  const summarySection = formatSummaryForPrompt(conversationSummary);

  // 7. File Attachment Metadata
  let attachmentSection = "";
  if (fileAttachment?.fileName) {
    attachmentSection = `
BERKAS TERLAMPIR SAAT INI:
- Nama Berkas: ${fileAttachment.fileName}
${fileAttachment.fileText ? `- Cuplikan Isi Berkas:\n\`\`\`\n${fileAttachment.fileText.slice(0, 3000)}\n\`\`\`` : ""}`;
  }

  // Combine into unified prompt block
  return [
    baseInstructions,
    safeguards,
    userProfileSection,
    memoriesSection,
    moduleContextSection,
    summarySection,
    attachmentSection,
  ]
    .filter((sec) => sec.trim().length > 0)
    .join("\n\n");
}
