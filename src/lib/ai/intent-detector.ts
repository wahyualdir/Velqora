import { AIIntent, ChatDialogueTurn } from "./types";

/**
 * Intelligent Multi-stage Intent & Entity Detector
 */
export function detectUserIntent(
  prompt: string,
  history: ChatDialogueTurn[] = [],
  hasAttachment: boolean = false
): AIIntent {
  const cleanPrompt = (prompt || "").trim();
  const lower = cleanPrompt.toLowerCase();

  // 1. Detect Requested Formatting
  let requestedFormat: AIIntent["requestedFormat"] = undefined;
  if (
    lower.includes("langsung kodenya") ||
    lower.includes("hanya kode") ||
    lower.includes("kode saja") ||
    lower.includes("code only")
  ) {
    requestedFormat = "code_only";
  } else if (
    lower.includes("step by step") ||
    lower.includes("langkah demi langkah") ||
    lower.includes("bertahap") ||
    lower.includes("tahap demi tahap")
  ) {
    requestedFormat = "step_by_step";
  } else if (
    lower.includes("buatkan prompt") ||
    lower.includes("buat prompt") ||
    lower.includes("template prompt")
  ) {
    requestedFormat = "prompt_ready";
  } else if (
    lower.includes("jelaskan lengkap") ||
    lower.includes("lebih detail") ||
    lower.includes("secara mendalam") ||
    lower.includes("komprehensif")
  ) {
    requestedFormat = "detailed";
  } else if (
    lower.includes("singkat") ||
    lower.includes("ringkas") ||
    lower.includes("to the point") ||
    lower.includes("garis besar")
  ) {
    requestedFormat = "concise";
  }

  // 2. Detect Programming Language
  const languages: Array<{ name: string; aliases: string[] }> = [
    { name: "Python", aliases: ["python", "py", "django", "fastapi", "flask", "numpy", "pandas", "pytorch", "tensorflow", "xgboost"] },
    { name: "TypeScript", aliases: ["typescript", "ts", "tsx", "next.js", "nextjs", "react", "nest.js"] },
    { name: "JavaScript", aliases: ["javascript", "js", "jsx", "node", "nodejs", "express"] },
    { name: "Java", aliases: ["java", "spring", "springboot"] },
    { name: "C++", aliases: ["c++", "cpp"] },
    { name: "C#", aliases: ["c#", "csharp", ".net", "dotnet"] },
    { name: "PHP", aliases: ["php", "laravel"] },
    { name: "Go", aliases: ["golang", "go"] },
    { name: "Rust", aliases: ["rust", "cargo"] },
    { name: "SQL", aliases: ["sql", "postgresql", "postgres", "mysql", "sqlite", "query", "database"] },
    { name: "HTML/CSS", aliases: ["html", "css", "tailwind", "flexbox", "grid"] },
  ];

  let detectedLanguage: string | undefined = undefined;
  for (const lang of languages) {
    if (
      lang.aliases.some((alias) => {
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?:$|[^a-zA-Z0-9_])`, "i").test(lower);
      })
    ) {
      detectedLanguage = lang.name;
      break;
    }
  }

  // 3. Detect Follow-up Signals
  const followUpPatterns = [
    /^(lanjutkan|lanjut|teruskan|next|continue)\b/i,
    /\b(yang tadi|seperti sebelumnya|yang pertama|yang kedua|itu tadi|yang tersebut)\b/i,
    /^(buat|bikin)\s+(lebih\s+)?(lengkap|detail|panjang|bagus|singkat|simpel)\b/i,
    /^(tambahkan|masukkan|gabungkan)\s+/i,
    /^(ubah|ganti|perbaiki|refactor)\s+(bagian|kode|tadi|itu)\b/i,
    /^(bagaimana\s+dengan|kalau\s+yang)\s+/i,
    /^(lalu|kemudian|setelah\s+itu)\b/i,
  ];

  const isFollowUp =
    history.length > 0 &&
    (cleanPrompt.length < 25 ||
      followUpPatterns.some((pattern) => pattern.test(lower)) ||
      lower.startsWith("kenapa") ||
      lower.startsWith("bagaimana jika") ||
      lower.startsWith("apa maksudnya"));

  // 4. Memory Control Intent Detection
  if (
    lower.includes("apa yang kamu ingat") ||
    lower.includes("ingat tentang saya") ||
    lower.includes("tampilkan memory") ||
    lower.includes("lihat memory") ||
    lower.includes("hapus memory") ||
    lower.includes("lupakan tentang")
  ) {
    return {
      type: "memory_request",
      confidence: 0.95,
      isFollowUp,
      requestedFormat,
    };
  }

  // 5. Quiz Generation Intent
  if (
    lower.includes("buat kuis") ||
    lower.includes("buatkan kuis") ||
    lower.includes("soal latihan") ||
    lower.includes("uji pemahaman") ||
    lower.includes("latihan soal")
  ) {
    return {
      type: "quiz_generation",
      confidence: 0.9,
      isFollowUp,
      programmingLanguage: detectedLanguage,
      requestedFormat,
    };
  }

  // 6. File Analysis Intent
  if (hasAttachment || lower.includes("file tadi") || lower.includes("dokumen ini") || lower.includes("analisis berkas")) {
    return {
      type: "file_analysis",
      confidence: 0.9,
      isFollowUp,
      programmingLanguage: detectedLanguage,
      requestedFormat,
    };
  }

  // 7. Debugging / Error Fixing Intent
  if (
    lower.includes("error") ||
    lower.includes("bug") ||
    lower.includes("kenapa kode ini") ||
    lower.includes("tidak jalan") ||
    lower.includes("exception") ||
    lower.includes("perbaiki") ||
    lower.includes("stack trace") ||
    lower.includes("failed")
  ) {
    return {
      type: "debugging",
      confidence: 0.9,
      isFollowUp,
      programmingLanguage: detectedLanguage,
      requestedFormat,
    };
  }

  // 8. Coding / Implementation Intent
  if (
    lower.includes("buatkan kode") ||
    lower.includes("tulis fungsi") ||
    lower.includes("contoh kode") ||
    lower.includes("implementasikan") ||
    lower.includes("coding") ||
    lower.includes("bikin program") ||
    lower.includes("script")
  ) {
    return {
      type: "coding",
      confidence: 0.88,
      isFollowUp,
      programmingLanguage: detectedLanguage,
      requestedFormat,
    };
  }

  // 9. Summarization Intent
  if (
    lower.includes("rangkum") ||
    lower.includes("ringkas") ||
    lower.includes("summary") ||
    lower.includes("intisari")
  ) {
    return {
      type: "summarization",
      confidence: 0.85,
      isFollowUp,
      requestedFormat,
    };
  }

  // 10. Project Planning / Architecture Intent
  if (
    lower.includes("arsitektur") ||
    lower.includes("system design") ||
    lower.includes("roadmap") ||
    lower.includes("rencana project") ||
    lower.includes("struktur database") ||
    lower.includes("alur aplikasi")
  ) {
    return {
      type: "project_planning",
      confidence: 0.85,
      isFollowUp,
      requestedFormat,
    };
  }

  // 11. Explanation / Learning Intent
  if (
    lower.includes("apa itu") ||
    lower.includes("jelaskan") ||
    lower.includes("bagaimana cara") ||
    lower.includes("pengertian") ||
    lower.includes("perbedaan") ||
    lower.includes("kenapa")
  ) {
    return {
      type: "explanation",
      confidence: 0.88,
      isFollowUp,
      programmingLanguage: detectedLanguage,
      requestedFormat,
    };
  }

  // 12. Generic Follow-up Intent
  if (isFollowUp) {
    return {
      type: "follow_up",
      confidence: 0.82,
      isFollowUp: true,
      programmingLanguage: detectedLanguage,
      requestedFormat,
    };
  }

  return {
    type: "technical_question",
    confidence: 0.7,
    isFollowUp: false,
    programmingLanguage: detectedLanguage,
    requestedFormat,
  };
}
