"use server";

import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, logger } from "@/lib/observability";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface GenerateQuizResult {
  title: string;
  questions: QuizQuestion[];
}

/**
 * Fallback questions for offline mode or when API key is unconfigured
 */
const PRESET_FALLBACK_QUIZZES: Record<string, GenerateQuizResult> = {
  python: {
    title: "Kuis: Fundamentals Python",
    questions: [
      {
        id: "q1",
        question: "Tipe data manakah di Python yang bersifat Immutable (tidak dapat diubah nilainya setelah dibuat)?",
        options: ["List", "Dictionary", "Tuple", "Set"],
        correctAnswer: 2,
        explanation: "Tuple didefinisikan dengan kurung biasa () dan bersifat immutable (nilainya tidak bisa diubah/di-mutate setelah inisialisasi).",
      },
      {
        id: "q2",
        question: "Manakah cara yang benar untuk mendefinisikan sebuah fungsi di Python?",
        options: ["function myFunc():", "def myFunc():", "func myFunc():", "void myFunc():"],
        correctAnswer: 1,
        explanation: "Python menggunakan kata kunci 'def' untuk mendeklarasikan sebuah fungsi.",
      },
      {
        id: "q3",
        question: "Apakah keluaran dari kode: print(type([])) ?",
        options: ["<class 'list'>", "<class 'array'>", "<class 'dict'>", "<class 'tuple'>"],
        correctAnswer: 0,
        explanation: "Tanda kurung siku [] merupakan sintaks literal untuk membuat objek tipe data list di Python.",
      },
      {
        id: "q4",
        question: "Keyword manakah yang digunakan untuk menangani exception/error di Python?",
        options: ["try ... catch", "try ... except", "do ... catch", "try ... finally"],
        correctAnswer: 1,
        explanation: "Python menggunakan blok try...except untuk menangkap dan menangani runtime exception.",
      },
      {
        id: "q5",
        question: "Metode manakah yang digunakan untuk menambahkan elemen baru ke akhir sebuah List?",
        options: ["push()", "add()", "append()", "insert()"],
        correctAnswer: 2,
        explanation: "Metode append(x) menambahkan satu item baru ke posisi paling akhir pada objek List.",
      },
    ],
  },
  react: {
    title: "Kuis: React & Next.js Web Dev",
    questions: [
      {
        id: "q1",
        question: "Hook manakah di React yang digunakan untuk mengelola state lokal pada functional component?",
        options: ["useEffect", "useMemo", "useState", "useRef"],
        correctAnswer: 2,
        explanation: "useState adalah React Hook standar untuk mendeklarasikan dan mengelola variabel state lokal.",
      },
      {
        id: "q2",
        question: "Di Next.js App Router, nama file manakah yang digunakan untuk menetapkan halaman utama suatu route?",
        options: ["index.tsx", "page.tsx", "main.tsx", "app.tsx"],
        correctAnswer: 1,
        explanation: "Next.js App Router menggunakan konvensi penamaan file page.tsx (atau page.js) untuk membuat rute halaman.",
      },
      {
        id: "q3",
        question: "Manakah sintaks yang digunakan untuk menandai komponen Next.js sebagai Client Component?",
        options: ["'use server'", "'use client'", "'use react'", "'client component'"],
        correctAnswer: 1,
        explanation: "Direktif 'use client' di awal file menandai modul tersebut sebagai Client Component yang dapat menggunakan state & event handler browser.",
      },
      {
        id: "q4",
        question: "Apakah keunggulan utama dari Server Components di Next.js?",
        options: [
          "Dapat menggunakan useState secara bebas",
          "Ukuran bundle JavaScript di browser menjadi lebih kecil",
          "Hanya bisa berjalan di browser smartphone",
          "Tidak memerlukan HTML sama sekali",
        ],
        correctAnswer: 1,
        explanation: "Server Components di-render sepenuhnya di server sehingga kode dependency-nya tidak dikirim ke browser client, memperkecil ukuran JS bundle.",
      },
      {
        id: "q5",
        question: "Hook manakah yang digunakan untuk mengeksekusi side-effect seperti data fetching atau event subscription?",
        options: ["useCallback", "useContext", "useEffect", "useReducer"],
        correctAnswer: 2,
        explanation: "useEffect digunakan untuk menangani side-effects pada komponen React setelah render.",
      },
    ],
  },
};

export async function generateAIQuizAction(
  topic: string,
  difficulty: "mudah" | "sedang" | "sulit" = "sedang",
  questionCount: number = 5,
  customContext?: string,
  fileAttachment?: { fileName: string; fileContent: string }
): Promise<GenerateQuizResult> {
  // Rate Limit check
  let userId = "guest";
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) userId = user.id;
  } catch {
    // Continue with guest rate limit
  }

  const rateCheck = checkRateLimit(`quiz_gen_${userId}`, 15, 60000);
  if (!rateCheck.allowed) {
    logger.warn("QUIZ_GEN_RATE_LIMIT", "Rate limit kuis tercapai", { userId });
    // Return friendly preset fallback when rate limit hit
    const normalized = topic.toLowerCase();
    const fallbackSource = (normalized.includes("react") || normalized.includes("next"))
      ? PRESET_FALLBACK_QUIZZES.react
      : PRESET_FALLBACK_QUIZZES.python;
    return {
      title: `${fallbackSource.title} (Mode Cadangan)`,
      questions: fallbackSource.questions.slice(0, Math.min(5, questionCount)),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Clamp questionCount strictly between 1 and 50
  const safeCount = Math.min(50, Math.max(1, Number(questionCount) || 5));

  // Fallback if API key is not configured
  if (!apiKey) {
    logger.info("QUIZ_GEN_FALLBACK", "GEMINI_API_KEY tidak ditemukan. Menggunakan kuis preset fallback.");
    const normalized = topic.toLowerCase();
    const fallbackSource = (normalized.includes("react") || normalized.includes("next"))
      ? PRESET_FALLBACK_QUIZZES.react
      : PRESET_FALLBACK_QUIZZES.python;

    return {
      title: fallbackSource.title,
      questions: fallbackSource.questions.slice(0, safeCount),
    };
  }

  const difficultyLabel =
    difficulty === "mudah"
      ? "Dasar / Pemula (Easy)"
      : difficulty === "sulit"
      ? "Lanjutan / Sulit (Advanced / Deep Concepts)"
      : "Menengah (Intermediate)";

  const promptText = `
Anda adalah pembuat soal kuis akademik dan instruktur evaluasi materi pembelajaran di Velqora.
Buat kuis pilihan ganda berdasarkan topik: "${topic}".
Tingkat kesulitan: ${difficultyLabel}.
Jumlah pertanyaan: ${safeCount} butir soal.

${customContext ? `Konteks Tambahan Pengguna:\n${customContext}\n` : ""}
${fileAttachment?.fileName ? `Materi Lampiran (${fileAttachment.fileName}):\n${fileAttachment.fileContent}\n` : ""}

Instruksi Pembuatan Soal:
- Buat pertanyaan yang menguji pemahaman konsep nyata, bukan hafalan kata per kata.
- Berikan tepat 4 pilihan jawaban yang masuk akal (A, B, C, D).
- Berikan indeks jawaban yang benar (0 = A, 1 = B, 2 = C, 3 = D).
- Berikan penjelasan edukatif yang jelas dan ringkas.
- Buat tepat ${safeCount} pertanyaan unik dan bervariasi.

Format JSON yang wajib diikuti secara persis:
{
  "title": "Kuis: ${fileAttachment?.fileName ? fileAttachment.fileName : topic}",
  "questions": [
    {
      "id": "q1",
      "question": "[Teks pertanyaan kuis]",
      "options": [
        "Pilihan A",
        "Pilihan B",
        "Pilihan C",
        "Pilihan D"
      ],
      "correctAnswer": 0,
      "explanation": "[Penjelasan singkat mengapa jawaban tersebut benar]"
    }
  ]
}

Catatan: "correctAnswer" adalah indeks angka 0 (untuk A), 1 (untuk B), 2 (untuk C), atau 3 (untuk D).
`;

  try {
    const candidateModels = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
    
    for (const model of candidateModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-goog-api-key": apiKey,
            },
            signal: AbortSignal.timeout(30000),
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          let text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

          // Clean markdown code blocks
          if (text.startsWith("```json")) {
            text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
          } else if (text.startsWith("```")) {
            text = text.replace(/^```\w*\s*/, "").replace(/\s*```$/, "");
          }

          const parsed = JSON.parse(text) as GenerateQuizResult;
          if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            return {
              title: parsed.title || `Kuis: ${topic}`,
              questions: parsed.questions.slice(0, safeCount),
            };
          }
        } else {
          const errText = await response.text();
          logger.warn("QUIZ_GEN_API_ERROR", `Gemini model ${model} error: ${response.status}`, { errText });
        }
      } catch (err: any) {
        logger.warn("QUIZ_MODEL_FALLBACK", `Percobaan model ${model} gagal, beralih ke model berikutnya`, { error: err?.message });
      }
    }

    // If all models failed, use fallback preset
    const normalized = (topic || "").toLowerCase();
    if (normalized.includes("react") || normalized.includes("next")) {
      return PRESET_FALLBACK_QUIZZES.react;
    }
    return PRESET_FALLBACK_QUIZZES.python;
  } catch (error: any) {
    console.error("Error generating AI quiz via Gemini fetch:", error);
    // Safe fallback to preset quiz
    const normalized = (topic || "").toLowerCase();
    if (normalized.includes("react") || normalized.includes("next")) {
      return PRESET_FALLBACK_QUIZZES.react;
    }
    return PRESET_FALLBACK_QUIZZES.python;
  }
}
