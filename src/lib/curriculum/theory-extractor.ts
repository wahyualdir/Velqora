export interface ExtractedCodeSnippetFromMarkdown {
  heading: string;
  language: "python" | "sql" | "bash" | "javascript" | "typescript";
  code: string;
  expectedOutput?: string;
}

export interface TheoryCodeExtractionResult {
  theoryMarkdown: string;
  extractedCount: number;
  hasExtractedCode: boolean;
  extractedSnippets: ExtractedCodeSnippetFromMarkdown[];
}

const H2_CODE_SECTION_RE =
  /^(?:\d+(?:\.\d+)*\.?\s*)?(?:implementasi\s+(?:kode|komputasi|praktikum|algoritma)|kode\s+(?:implementasi|lengkap|praktikum)|praktikum\s+kode|lab(?:oratorium)?\s+kode|hands[\s-]+on\s+kode)\b/i;

const H3_STANDALONE_CODE_SECTION_RE =
  /^(?:\d+(?:\.\d+)*\.?\s*)?(?:kode\s+(?:lengkap|praktikum|implementasi)|implementasi\s+kode|hasil\s+eksekusi(?:\s*&\s*validasi\s+output)?|output\s+terverifikasi|penjelasan\s+(?:kode|alur\s+kode|mekanisme\s+eksekusi)|analisis\s+(?:kode(?:\s*&\s*penjelasan\s+baris-demi-baris)?|baris-demi-baris))\b/i;

const H3_OUTPUT_HEADING_RE =
  /^(?:\d+(?:\.\d+)*\.?\s*)?(?:hasil\s+eksekusi(?:\s*&\s*validasi\s+output)?|output\s+terverifikasi)\b/i;

const H3_CODE_FENCE_HEADING_RE =
  /^(?:\d+(?:\.\d+)*\.?\s*)?(?:kode\s+(?:lengkap|praktikum|implementasi)|implementasi\s+kode|arsitektur\s+)/i;

function normalizeExtractedLanguage(
  rawLang: string
): ExtractedCodeSnippetFromMarkdown["language"] | null {
  const cleaned = rawLang.trim().toLowerCase();
  if (cleaned === "python" || cleaned === "py" || cleaned === "python3") return "python";
  if (cleaned === "sql" || cleaned === "postgresql" || cleaned === "sqlite") return "sql";
  if (cleaned === "bash" || cleaned === "sh" || cleaned === "shell" || cleaned === "zsh") {
    return "bash";
  }
  if (cleaned === "javascript" || cleaned === "js") return "javascript";
  if (cleaned === "typescript" || cleaned === "ts") return "typescript";
  return null;
}

function isFenceToggle(line: string): { marker: string; lang: string } | null {
  const match = line.match(/^ {0,3}(```+|~~~+)\s*([a-zA-Z0-9_-]*)/);
  if (!match) return null;
  return { marker: match[1], lang: match[2] ?? "" };
}

/**
 * Memisahkan bagian implementasi kode panjang, blok output eksekusi, dan penjelasan baris-demi-baris
 * dari markdown teori sehingga modul tetap berfokus pada konsep, intuisi, matematika, diagram,
 * studi kasus, jebakan umum, dan rujukan akademik.
 *
 * Modul murni tanpa ketergantungan ke registri kurikulum agar aman dipakai di client bundle ringan.
 */
export function extractTheoryAndCodeFromMarkdown(
  markdown: string
): TheoryCodeExtractionResult {
  if (!markdown || !markdown.trim()) {
    return {
      theoryMarkdown: markdown || "",
      extractedCount: 0,
      hasExtractedCode: false,
      extractedSnippets: [],
    };
  }

  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const theoryLines: string[] = [];
  const extractedSnippets: ExtractedCodeSnippetFromMarkdown[] = [];

  let inFence = false;
  let fenceChar = "";
  let fenceLen = 0;
  let fenceLang = "";
  let fenceBuffer: string[] = [];

  let skipMode: "none" | "h2-code" | "h3-code" = "none";
  let currentSubheading = "";
  let extractedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inFence) {
      const openFence = isFenceToggle(line);
      if (openFence) {
        inFence = true;
        fenceChar = openFence.marker[0];
        fenceLen = openFence.marker.length;
        fenceLang = openFence.lang;
        fenceBuffer = [];
        if (skipMode === "none") {
          theoryLines.push(line);
        }
        continue;
      }
    } else {
      const closeMatch = line.match(
        new RegExp(`^ {0,3}${fenceChar === "`" ? "`" : "~"}{${fenceLen},}\\s*$`)
      );
      if (closeMatch) {
        const blockContent = fenceBuffer.join("\n").trim();
        if (skipMode !== "none") {
          const normalizedLang = normalizeExtractedLanguage(fenceLang);
          if (
            normalizedLang &&
            blockContent.split("\n").length >= 3 &&
            !H3_OUTPUT_HEADING_RE.test(currentSubheading)
          ) {
            extractedSnippets.push({
              heading: currentSubheading || "Implementasi Kode",
              language: normalizedLang,
              code: blockContent,
            });
            extractedCount += 1;
          } else if (
            extractedSnippets.length > 0 &&
            (H3_OUTPUT_HEADING_RE.test(currentSubheading) ||
              fenceLang.toLowerCase() === "text" ||
              fenceLang.toLowerCase() === "output" ||
              fenceLang === "")
          ) {
            const last = extractedSnippets[extractedSnippets.length - 1];
            if (!last.expectedOutput && blockContent.length > 0) {
              last.expectedOutput = blockContent;
            }
          }
        } else {
          theoryLines.push(line);
        }
        inFence = false;
        fenceChar = "";
        fenceLen = 0;
        fenceLang = "";
        fenceBuffer = [];
        continue;
      }

      if (skipMode !== "none") {
        fenceBuffer.push(line);
      } else {
        theoryLines.push(line);
      }
      continue;
    }

    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      const headingText = h2Match[1].trim();
      if (H2_CODE_SECTION_RE.test(headingText)) {
        skipMode = "h2-code";
        currentSubheading = headingText;
        extractedCount += 1;
        continue;
      }
      skipMode = "none";
      currentSubheading = "";
      theoryLines.push(line);
      continue;
    }

    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      const headingText = h3Match[1].trim();
      if (skipMode === "h2-code") {
        currentSubheading = headingText;
        continue;
      }
      if (H3_STANDALONE_CODE_SECTION_RE.test(headingText)) {
        skipMode = "h3-code";
        currentSubheading = headingText;
        if (H3_CODE_FENCE_HEADING_RE.test(headingText)) {
          extractedCount += 1;
        }
        continue;
      }
      skipMode = "none";
      currentSubheading = "";
      theoryLines.push(line);
      continue;
    }

    if (skipMode === "h3-code" && /^\s*---\s*$/.test(line)) {
      let nextNonEmpty = "";
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() !== "") {
          nextNonEmpty = lines[j].trim();
          break;
        }
      }
      const nextIsCodeH3 =
        nextNonEmpty.startsWith("### ") &&
        H3_STANDALONE_CODE_SECTION_RE.test(nextNonEmpty.replace(/^###\s+/, ""));
      if (!nextIsCodeH3) {
        skipMode = "none";
        currentSubheading = "";
        theoryLines.push(line);
        continue;
      }
    }

    if (skipMode === "none") {
      theoryLines.push(line);
    }
  }

  const cleanedTheory = theoryLines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/(?:\n---\s*){2,}/g, "\n---\n")
    .trim();

  const hasExtractedCode = extractedSnippets.length > 0 || extractedCount > 0;
  return {
    theoryMarkdown: cleanedTheory,
    extractedCount: Math.max(extractedSnippets.length, hasExtractedCode ? 1 : 0),
    hasExtractedCode,
    extractedSnippets,
  };
}
