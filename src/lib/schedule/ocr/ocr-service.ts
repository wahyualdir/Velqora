/**
 * High-Level OCR Orchestration Service
 * Velqora Intelligent Schedule Automation — FASE 29
 */

import { OCRProvider, MultiPageOCRResult, OCRProcessOptions } from "./types";
import { ocrRegistry } from "./provider";
import { inspectPdfStructure } from "./pdf-renderer";
import { logger, generateCorrelationId } from "@/lib/observability";

export interface OCRServiceOptions extends OCRProcessOptions {
  providerName?: string;
  maxPages?: number;
  onProgress?: (current: number, total: number, status: string) => void;
}

export class OCRService {
  private defaultMaxPages: number = 20;

  /**
   * Processes a document buffer (PDF or Image) through the configured OCR provider.
   */
  async processDocument(
    buffer: Buffer,
    mimeType: string,
    options: OCRServiceOptions = {}
  ): Promise<MultiPageOCRResult> {
    const startTime = Date.now();
    const correlationId = generateCorrelationId("ocr_svc");
    const provider: OCRProvider = ocrRegistry.get(options.providerName) || ocrRegistry.getDefault();

    logger.info(
      "OCR_SERVICE",
      `Starting OCR process using provider: "${provider.name}" on ${mimeType} (${buffer.length} bytes)`,
      { mimeType, bufferSize: buffer.length, provider: provider.name },
      correlationId
    );

    if (!buffer || buffer.length === 0) {
      return {
        totalPages: 0,
        successfulPages: 0,
        failedPages: 0,
        pages: [],
        fullText: "",
        averageConfidence: 0,
        provider: provider.name,
        totalProcessingTimeMs: 0,
        isPartialSuccess: false,
        error: "Berkas kosong atau tidak dapat dibaca.",
      };
    }

    try {
      // 1. If PDF, inspect structure
      if (mimeType === "application/pdf") {
        const inspection = inspectPdfStructure(buffer);
        const totalPages = Math.min(inspection.pageCount || 1, options.maxPages || this.defaultMaxPages);

        if (options.onProgress) {
          options.onProgress(1, totalPages, `Memproses ${totalPages} halaman dokumen...`);
        }

        const result = await provider.processPdfPages(buffer, options);

        logger.info(
          "OCR_SERVICE",
          `OCR finished: ${result.successfulPages}/${result.totalPages} pages successful in ${Date.now() - startTime}ms`,
          {
            totalPages: result.totalPages,
            successfulPages: result.successfulPages,
            failedPages: result.failedPages,
            avgConfidence: result.averageConfidence,
          },
          correlationId
        );

        return result;
      }

      // 2. Direct Image OCR (PNG/JPEG/WebP)
      if (options.onProgress) {
        options.onProgress(1, 1, "Membaca teks dari gambar...");
      }

      const pageResult = await provider.processImage(buffer, options);

      return {
        totalPages: 1,
        successfulPages: pageResult.isSuccess ? 1 : 0,
        failedPages: pageResult.isSuccess ? 0 : 1,
        pages: [pageResult],
        fullText: pageResult.text,
        averageConfidence: pageResult.confidence,
        provider: provider.name,
        totalProcessingTimeMs: Date.now() - startTime,
        isPartialSuccess: false,
        warnings: pageResult.warnings,
        error: pageResult.error,
      };
    } catch (err: any) {
      logger.error("OCR_SERVICE", "OCR process failed", err, undefined, correlationId);

      return {
        totalPages: 1,
        successfulPages: 0,
        failedPages: 1,
        pages: [],
        fullText: "",
        averageConfidence: 0,
        provider: provider.name,
        totalProcessingTimeMs: Date.now() - startTime,
        isPartialSuccess: false,
        error: err.message || "Gagal memproses OCR pada dokumen.",
      };
    }
  }
}

export const ocrService = new OCRService();
