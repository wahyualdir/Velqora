"use server";

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
          "Tidak memerlukan HTML sama sekali"
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
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // Clamp questionCount strictly between 1 and 50
  const safeCount = Math.min(50, Math.max(1, Number(questionCount) || 5));

  // Fallback if API key is not configured
  if (!apiKey) {
    console.warn("GEMINI_API_KEY tidak ditemukan. Menggunakan kuis preset fallback.");
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
      ? "Lanjutan / Kompleks (Hard)"
      : "Menengah (Medium)";

  const promptText = `
Role: Anda adalah Pembuat Kuis Edukasi & Penguji Pemrograman Profesional.
Tugas: Buatkan ${safeCount} butir soal kuis pilihan ganda interaktif berkualitas tinggi tentang topik: "${topic || "Evaluasi Berkas Materi"}".
Tingkat Kesulitan: ${difficultyLabel}.
${customContext ? `Materi Pendukung: "${customContext.slice(0, 1500)}"` : ""}
${fileAttachment?.fileName && fileAttachment?.fileContent ? `\n[BERKAS UTAMA TERLAMPIR: ${fileAttachment.fileName}]\n\`\`\`\n${fileAttachment.fileContent.slice(0, 8000)}\n\`\`\`\nCatatan Khusus: Buatkan soal kuis yang menguji pemahaman pengguna secara langsung tentang isi berkas di atas!` : ""}

PETUNJUK FORMAT MUTLAK:
- Kembalikan HANYA format JSON valid tanpa teks pengantar atau penutup.
- Bahasa: Bahasa Indonesia yang jelas, profesional, dan edukatif. Jangan gunakan emoji.
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
            text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
          }

          const parsed = JSON.parse(text) as GenerateQuizResult;

          if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            return parsed;
          }
        } else {
          const errText = await response.text();
          console.warn(`Gemini model ${model} error for Quiz:`, response.status, errText.slice(0, 100));
        }
      } catch (innerErr) {
        console.warn(`Quiz generation failed with model ${model}:`, innerErr);
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
