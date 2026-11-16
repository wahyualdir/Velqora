import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { executeAIEngine } from "@/lib/ai/engine";
import type { NotebookKernel, SqlTableMeta, VariableSummary } from "@/lib/notebook/types";

interface NotebookAiPayload {
  action: "fix_patch" | "generate_cell" | "explain" | "optimize";
  kernel: NotebookKernel;
  cellSource: string;
  errorText?: string;
  userPrompt?: string;
  variables?: VariableSummary[];
  sqlTables?: SqlTableMeta[];
  surroundingCode?: string;
}

// Simple in-memory sliding window rate limit per IP/user (25 requests per minute)
const rateMap = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const prev = (rateMap.get(key) || []).filter((t) => now - t < 60_000);
  if (prev.length >= 25) {
    rateMap.set(key, prev);
    return true;
  }
  prev.push(now);
  rateMap.set(key, prev);
  return false;
}

function extractPatchedCode(replyText: string, kernel: NotebookKernel): {
  explanation: string;
  patchedCode: string | null;
} {
  // Prefer explicit JSON block if AI returned structured JSON
  const jsonMatch = replyText.match(/```json\s*([\s\S]*?)```/i);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]) as {
        explanation?: string;
        patchedCode?: string;
      };
      if (parsed && typeof parsed.patchedCode === "string") {
        return {
          explanation: parsed.explanation || replyText,
          patchedCode: parsed.patchedCode.trim(),
        };
      }
    } catch {
      // Fall through to code block extraction
    }
  }

  // Extract fenced code block matching kernel language
  const langPattern =
    kernel === "sql"
      ? "sql"
      : kernel === "javascript"
      ? "(?:javascript|js)"
      : kernel === "typescript"
      ? "(?:typescript|ts)"
      : "(?:python|py)";
  const codeBlockMatch =
    replyText.match(new RegExp("```" + langPattern + "\\s*([\\s\\S]*?)```", "i")) ||
    replyText.match(/```\w*\s*([\s\S]*?)```/);

  if (codeBlockMatch) {
    const code = codeBlockMatch[1].trim();
    const explanation = replyText.replace(codeBlockMatch[0], "").trim();
    return {
      explanation: explanation || "Berikut saran kode perbaikan dari AI Copilot:",
      patchedCode: code,
    };
  }

  return {
    explanation: replyText,
    patchedCode: null,
  };
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const rateKey = user?.id || `ip:${ip}`;
    if (isRateLimited(rateKey)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan AI Copilot. Tunggu sebentar ya." },
        { status: 429 }
      );
    }

    const body = (await req.json()) as NotebookAiPayload;
    if (!body || !body.action) {
      return NextResponse.json(
        { error: "Payload action AI Copilot tidak lengkap." },
        { status: 400 }
      );
    }

    const varSummaryText = (body.variables || [])
      .slice(0, 20)
      .map(
        (v) =>
          `- ${v.name}: ${v.type}${v.shape ? ` shape=${v.shape}` : ""}${
            v.columns?.length ? ` cols=[${v.columns.join(", ")}]` : ""
          } (contoh: ${v.preview.slice(0, 80)})`
      )
      .join("\n");

    const sqlSummaryText = (body.sqlTables || [])
      .slice(0, 10)
      .map(
        (t) =>
          `- Tabel ${t.name} (${t.rowCount} baris): ${t.columns
            .map((c) => `${c.name}:${c.type}`)
            .join(", ")}`
      )
      .join("\n");

    const actionInstruction =
      body.action === "fix_patch"
        ? "Analisa traceback/error, jelaskan akar penyebabnya secara ringkas dalam Bahasa Indonesia, lalu berikan KODE PERBAIKAN LENGKAP yang siap menggantikan sel saat ini."
        : body.action === "optimize"
        ? "Optimalkan kode ini (vektorisasi NumPy/Pandas, kompleksitas waktu/memori, dan keterbacaan) lalu berikan versi lengkap hasil optimasi."
        : body.action === "explain"
        ? "Jelaskan logika kode ini baris demi baris beserta konsep algoritma/matematis di baliknya dalam Bahasa Indonesia."
        : "Tulis satu sel kode baru yang bersih, terdokumentasi ringkas, dan kompatibel dengan variabel/tabel yang sudah ada di memori.";

    const fullPrompt = [
      `Kamu adalah AI Copilot spesialis komputasi untuk Velqora Lab Notebook (Kernel aktif: ${body.kernel}).`,
      actionInstruction,
      varSummaryText ? `Variabel aktif di memori:\n${varSummaryText}` : "",
      sqlSummaryText ? `Tabel SQLite aktif:\n${sqlSummaryText}` : "",
      body.surroundingCode
        ? `Konteks sel sebelumnya:\n\`\`\`${body.kernel}\n${body.surroundingCode.slice(0, 1200)}\n\`\`\``
        : "",
      body.cellSource
        ? `Kode sel target saat ini:\n\`\`\`${body.kernel}\n${body.cellSource}\n\`\`\``
        : "",
      body.errorText ? `Error / Traceback:\n\`\`\`\n${body.errorText}\n\`\`\`` : "",
      body.userPrompt ? `Instruksi spesifik pengguna: ${body.userPrompt}` : "",
      `Format respons: berikan penjelasan ringkas berbahasa Indonesia, diikuti satu blok kode \`\`\`${body.kernel} ... \`\`\` berisi kode lengkap (jika action bukan 'explain').`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const aiRes = await executeAIEngine({
      prompt: fullPrompt,
      userId: user?.id,
      displayName: user?.email?.split("@")[0] || "Pembelajar",
      provider: "gemini",
    });

    const parsed = extractPatchedCode(aiRes.reply, body.kernel);
    return NextResponse.json({
      explanation: parsed.explanation,
      patchedCode: parsed.patchedCode,
      telemetry: aiRes.telemetry,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error:
          err?.message ||
          "Gagal memproses permintaan AI Copilot Notebook.",
      },
      { status: 500 }
    );
  }
}
