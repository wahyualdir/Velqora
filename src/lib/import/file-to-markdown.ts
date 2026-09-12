import JSZip from "jszip";
import mammoth from "mammoth";
import TurndownService from "turndown";

export interface ConversionResult {
  suggestedTitle: string;
  markdownBody: string;
  warning?: string;
}

/**
 * Unescapes basic XML entities from raw PowerPoint XML nodes
 */
function unescapeXml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/**
 * Strips file extension to produce a clean title fallback
 */
function cleanFilenameTitle(filename: string): string {
  const withoutExt = filename.replace(/\.[^/.]+$/, "");
  return withoutExt.replace(/[-_]+/g, " ").trim() || "Catatan Tanpa Judul";
}

/**
 * 3.1 Converter for Jupyter Notebook (.ipynb)
 * Extracts markdown and code cells deterministically without AI or outputs
 */
export function convertIpynbToMarkdown(
  filename: string,
  buffer: Buffer
): ConversionResult {
  const cleanTitle = cleanFilenameTitle(filename);
  let notebook: any;

  try {
    const rawStr = buffer.toString("utf-8");
    notebook = JSON.parse(rawStr);
  } catch (err: any) {
    throw new Error(`Format berkas .ipynb tidak valid (gagal parsing JSON): ${err.message}`);
  }

  if (!notebook || !Array.isArray(notebook.cells)) {
    throw new Error("Berkas .ipynb tidak memiliki struktur cells notebook yang valid.");
  }

  // Detect kernel / programming language
  const detectedLanguage =
    notebook.metadata?.kernelspec?.language ||
    notebook.metadata?.language_info?.name ||
    "python";

  const normalizedLang = String(detectedLanguage).toLowerCase().trim() || "python";

  let firstHeadingTitle: string | null = null;
  const sections: string[] = [];

  for (const cell of notebook.cells) {
    if (!cell) continue;

    const rawSource = Array.isArray(cell.source)
      ? cell.source.join("")
      : String(cell.source || "");
    const trimmedSource = rawSource.trim();

    if (!trimmedSource) continue;

    if (cell.cell_type === "markdown") {
      // Find the first top-level heading for suggestedTitle if not found yet
      if (!firstHeadingTitle) {
        const headingMatch = trimmedSource.match(/^#\s+(.+)$/m);
        if (headingMatch) {
          firstHeadingTitle = headingMatch[1].trim();
        }
      }
      sections.push(trimmedSource);
    } else if (cell.cell_type === "code") {
      // Exclude execution outputs - only include code wrapped in fenced code block
      sections.push(`\`\`\`${normalizedLang}\n${trimmedSource}\n\`\`\``);
    }
    // raw cells are intentionally skipped
  }

  const markdownBody = sections.join("\n\n").trim();
  const warning =
    markdownBody.length === 0
      ? "Notebook ini tidak memiliki cell markdown maupun cell kode yang dapat diekstrak."
      : undefined;

  return {
    suggestedTitle: firstHeadingTitle || cleanTitle,
    markdownBody,
    warning,
  };
}

/**
 * 3.2 Converter for Word Document (.docx)
 * Uses mammoth to extract HTML structure, then turndown to produce clean ATX Markdown
 */
export async function convertDocxToMarkdown(
  filename: string,
  buffer: Buffer
): Promise<ConversionResult> {
  const cleanTitle = cleanFilenameTitle(filename);

  let html = "";
  try {
    const result = await mammoth.convertToHtml({ buffer });
    html = result.value || "";
  } catch (err: any) {
    throw new Error(`Gagal membaca dokumen .docx: ${err.message || String(err)}`);
  }

  const turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    strongDelimiter: "**",
  });

  const markdownBody = turndownService.turndown(html).trim();

  // Extract first H1 heading if present
  let firstHeadingTitle: string | null = null;
  const headingMatch = markdownBody.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    firstHeadingTitle = headingMatch[1].trim();
  }

  const warning =
    markdownBody.length === 0
      ? "Dokumen Word ini kosong atau teks tidak dapat diekstrak."
      : undefined;

  return {
    suggestedTitle: firstHeadingTitle || cleanTitle,
    markdownBody,
    warning,
  };
}

/**
 * 3.3 Converter for PowerPoint Presentation (.pptx)
 * Uses jszip to open the zip package, reads slides numerically, and groups by slide
 */
export async function convertPptxToMarkdown(
  filename: string,
  buffer: Buffer
): Promise<ConversionResult> {
  const cleanTitle = cleanFilenameTitle(filename);

  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(buffer);
  } catch (err: any) {
    throw new Error(`Gagal membuka berkas .pptx sebagai arsip presentasi: ${err.message}`);
  }

  // Find all slide XML files e.g. ppt/slides/slide1.xml, ppt/slides/slide2.xml
  const slideFiles: Array<{ slideNum: number; path: string }> = [];

  zip.forEach((relativePath) => {
    const match = relativePath.match(/^ppt\/slides\/slide(\d+)\.xml$/i);
    if (match) {
      slideFiles.push({
        slideNum: parseInt(match[1], 10),
        path: relativePath,
      });
    }
  });

  // Sort numerically so Slide 10 doesn't appear before Slide 2
  slideFiles.sort((a, b) => a.slideNum - b.slideNum);

  if (slideFiles.length === 0) {
    return {
      suggestedTitle: cleanTitle,
      markdownBody: "",
      warning: "Tidak ditemukan slide presentasi di dalam berkas .pptx ini.",
    };
  }

  const slideSections: string[] = [];

  for (const slide of slideFiles) {
    const fileEntry = zip.file(slide.path);
    if (!fileEntry) continue;

    const xmlContent = await fileEntry.async("text");

    // Extract all text inside <a:t>...</a:t> tags
    const textMatches = xmlContent.match(/<a:t[^>]*>([\s\S]*?)<\/a:t>/gi) || [];
    const textChunks: string[] = [];

    for (const match of textMatches) {
      const inner = match.replace(/<\/?a:t[^>]*>/gi, "");
      const unescaped = unescapeXml(inner).trim();
      if (unescaped) {
        textChunks.push(unescaped);
      }
    }

    if (textChunks.length > 0) {
      const slideBody = textChunks.join("\n\n");
      slideSections.push(`## Slide ${slide.slideNum}\n\n${slideBody}`);
    } else {
      slideSections.push(`## Slide ${slide.slideNum}\n\n*(Slide tidak berisi teks yang dapat diekstrak)*`);
    }
  }

  const markdownBody = slideSections.join("\n\n---\n\n").trim();

  return {
    suggestedTitle: cleanTitle,
    markdownBody,
    warning:
      markdownBody.length === 0
        ? "Teks presentasi kosong atau tidak dapat diekstrak."
        : undefined,
  };
}

/**
 * 3.4 Converter for PDF Document (.pdf)
 * Uses pdf-parse to extract raw text, checks for scanned/empty PDFs, formats into paragraphs
 */
export async function convertPdfToMarkdown(
  filename: string,
  buffer: Buffer
): Promise<ConversionResult> {
  const cleanTitle = cleanFilenameTitle(filename);

  if (!buffer || buffer.length < 4 || buffer.toString("ascii", 0, 4) !== "%PDF") {
    throw new Error("Berkas PDF tidak valid atau rusak (header %PDF tidak ditemukan).");
  }

  let rawText = "";
  try {
    const pdfModule = await import("pdf-parse");
    const PDFParse = (pdfModule as any).PDFParse || (pdfModule as any).default || pdfModule;

    if (typeof PDFParse === "function") {
      try {
        const parser = new PDFParse({ data: buffer });
        const parsed = await parser.getText();
        rawText = typeof parsed === "object" ? parsed.text || "" : parsed || "";
      } catch {
        const parsed = await PDFParse(buffer);
        rawText = parsed?.text || "";
      }
    }
  } catch (err: any) {
    throw new Error(`Gagal membaca berkas PDF: ${err.message || String(err)}`);
  }

  const cleaned = rawText
    .replace(/\u0000/g, "")
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();

  // If text is below threshold, flag as scanned/image PDF
  let warning: string | undefined;
  if (cleaned.length < 40) {
    warning =
      "Teks minim atau tidak terdeteksi — kemungkinan PDF ini hasil scan/gambar dan perlu OCR manual sebelum diimpor.";
  }

  // Format into paragraphs based on double linebreaks
  const paragraphs = cleaned
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\r?\n/g, " ").trim())
    .filter(Boolean);

  const markdownBody = paragraphs.join("\n\n");

  // Determine suggestedTitle from first non-empty line
  let suggestedTitle = cleanTitle;
  if (paragraphs.length > 0) {
    const firstLine = paragraphs[0].slice(0, 80).trim();
    if (firstLine.length >= 3) {
      suggestedTitle = firstLine;
    }
  }

  return {
    suggestedTitle,
    markdownBody,
    warning,
  };
}

/**
 * Main dispatcher: converts a supported document buffer into Markdown
 */
export async function convertFileBufferToMarkdown(
  filename: string,
  buffer: Buffer
): Promise<ConversionResult> {
  const ext = filename.toLowerCase().split(".").pop();

  switch (ext) {
    case "ipynb":
      return convertIpynbToMarkdown(filename, buffer);
    case "docx":
      return convertDocxToMarkdown(filename, buffer);
    case "pptx":
      return convertPptxToMarkdown(filename, buffer);
    case "pdf":
      return convertPdfToMarkdown(filename, buffer);
    default:
      throw new Error(`Format berkas '.${ext}' tidak didukung untuk konversi otomatis.`);
  }
}
