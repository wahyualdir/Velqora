import JSZip from "jszip";
import { RawDocumentExtraction } from "./types";

/**
 * Native Word Document (.docx) Parser
 * Uses JSZip to extract paragraphs and tables from word/document.xml.
 * Does NOT execute any code, completely safe and deterministic.
 */
export async function parseDocxDocument(
  buffer: Buffer,
  fileName: string
): Promise<RawDocumentExtraction> {
  try {
    const zip = await JSZip.loadAsync(buffer);
    const docXmlFile = zip.file("word/document.xml");

    if (!docXmlFile) {
      throw new Error("Berkas Word tidak valid atau tidak memiliki konten teks.");
    }

    const xmlContent = await docXmlFile.async("string");
    const extracted = extractTextAndTablesFromDocxXml(xmlContent);

    return {
      fileName,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: buffer.length,
      extractedText: extracted.fullText,
      rowCount: extracted.paragraphsCount,
      isScanned: false,
      fragments: extracted.fragments,
    };
  } catch (err: any) {
    throw new Error(`Gagal membaca dokumen Word (.docx): ${err.message || String(err)}`);
  }
}

/**
 * Parses word/document.xml text, paragraphs, and tables with full row-level structure
 */
function extractTextAndTablesFromDocxXml(xml: string): {
  fullText: string;
  paragraphsCount: number;
  fragments: Array<{ pageOrRow: string; text: string }>;
} {
  const fragments: Array<{ pageOrRow: string; text: string }> = [];
  const lines: string[] = [];

  // 1. Process Tables first: <w:tbl>...</w:tbl>
  const tblRegex = /<w:tbl(?:\s[^>]*)?>([\s\S]*?)<\/w:tbl>/g;
  let tblMatch: RegExpExecArray | null;
  let tableIndex = 0;

  // Track XML positions of tables to avoid duplicate paragraph extraction
  const tableXmlRanges: Array<{ start: number; end: number }> = [];

  while ((tblMatch = tblRegex.exec(xml)) !== null) {
    tableIndex++;
    const tblStart = tblMatch.index;
    const tblEnd = tblMatch.index + tblMatch[0].length;
    tableXmlRanges.push({ start: tblStart, end: tblEnd });

    const tblContent = tblMatch[1];
    const trRegex = /<w:tr(?:\s[^>]*)?>([\s\S]*?)<\/w:tr>/g;
    let trMatch: RegExpExecArray | null;
    let rowIndex = 0;

    while ((trMatch = trRegex.exec(tblContent)) !== null) {
      rowIndex++;
      const trContent = trMatch[1];
      const tcRegex = /<w:tc(?:\s[^>]*)?>([\s\S]*?)<\/w:tc>/g;
      let tcMatch: RegExpExecArray | null;
      const cellTexts: string[] = [];

      while ((tcMatch = tcRegex.exec(trContent)) !== null) {
        const cellXml = tcMatch[1];
        const cellText = extractTextFromXmlNodes(cellXml).trim();
        cellTexts.push(cellText);
      }

      const isBlank = cellTexts.every((c) => !c);
      if (!isBlank) {
        const rowText = cellTexts.join(" | ");
        const traceLabel = `Tabel ${tableIndex} - Baris ${rowIndex}`;
        lines.push(`[${traceLabel}]: ${rowText}`);
        fragments.push({
          pageOrRow: traceLabel,
          text: rowText,
        });
      }
    }
  }

  // 2. Process Standalone Paragraphs outside of tables: <w:p>...</w:p>
  const pRegex = /<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g;
  let pMatch: RegExpExecArray | null;
  let pIndex = 0;

  while ((pMatch = pRegex.exec(xml)) !== null) {
    const pStart = pMatch.index;
    // Check if paragraph is inside any table range
    const isInsideTable = tableXmlRanges.some((r) => pStart >= r.start && pStart <= r.end);
    if (isInsideTable) continue;

    pIndex++;
    const pContent = pMatch[1];
    const paragraphText = extractTextFromXmlNodes(pContent).trim();

    if (paragraphText.length > 0) {
      lines.push(paragraphText);
      fragments.push({
        pageOrRow: `Paragraf ${pIndex}`,
        text: paragraphText,
      });
    }
  }

  return {
    fullText: lines.join("\n"),
    paragraphsCount: lines.length,
    fragments,
  };
}

/**
 * Extracts plain text from XML text elements <w:t>
 */
function extractTextFromXmlNodes(xml: string): string {
  const tRegex = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g;
  let tMatch: RegExpExecArray | null;
  const pieces: string[] = [];

  while ((tMatch = tRegex.exec(xml)) !== null) {
    if (tMatch[1]) {
      pieces.push(decodeXmlEntities(tMatch[1]));
    }
  }

  return pieces.join("").replace(/\s+/g, " ").trim();
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}
