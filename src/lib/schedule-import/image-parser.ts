import { RawDocumentExtraction } from "./types";

/**
 * Image Document Parser (.jpg, .jpeg, .png, .webp)
 * Prepares image buffer and base64 representation for AI Vision processing.
 */
export async function parseImageDocument(
  buffer: Buffer,
  fileName: string,
  mimeType: string = "image/jpeg"
): Promise<RawDocumentExtraction> {
  const base64 = buffer.toString("base64");
  const normMime = mimeType.toLowerCase().includes("png")
    ? "image/png"
    : mimeType.toLowerCase().includes("webp")
    ? "image/webp"
    : "image/jpeg";

  return {
    fileName,
    mimeType: normMime,
    size: buffer.length,
    extractedText: "", // Images have no raw text until processed by Vision/AI
    isScanned: true,
    metadata: {
      base64,
      isImage: true,
    },
    fragments: [
      {
        pageOrRow: "Gambar Dokumen",
        text: `[Berkas Gambar]: ${fileName}`,
      },
    ],
  };
}
