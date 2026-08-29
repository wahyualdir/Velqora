/**
 * OCR Provider Architecture & Readiness Interface
 * Velqora Intelligent Schedule Automation — FASE 28
 *
 * Implements clean abstraction for OCR capabilities without fabricating fake text.
 */
import { OCRProvider, OCRResult } from "./types";
import { logger } from "@/lib/observability";

export class ArchitectureReadyOCRProvider implements OCRProvider {
  private engineName: string;
  private isConfigured: boolean;

  constructor(engineName: string = "Velqora-OCR-Architecture-Adapter") {
    this.engineName = engineName;
    // Honest readiness check: check if any actual OCR provider/API key is present
    this.isConfigured = !!process.env.OCR_API_KEY || !!process.env.GOOGLE_VISION_API_KEY;
  }

  isAvailable(): boolean {
    return this.isConfigured;
  }

  getEngineName(): string {
    return this.engineName;
  }

  async extractText(buffer: Buffer, mimeType: string = "application/pdf"): Promise<OCRResult> {
    if (!buffer || buffer.length === 0) {
      return {
        text: "",
        confidence: 0,
        isAvailable: false,
        engineName: this.engineName,
        error: "Berkas kosong atau tidak dapat dibaca.",
      };
    }

    if (!this.isConfigured) {
      logger.info(
        "OCR_PROVIDER",
        `OCR adapter is in Architecture-Ready state (no external OCR engine configured). Scanned document safely flagged.`,
        { mimeType, bufferSize: buffer.length }
      );

      return {
        text: "",
        confidence: 0,
        isAvailable: false,
        engineName: this.engineName,
        error: "Modul OCR belum diaktifkan. Dokumen hasil scan memerlukan dokumen teks atau input manual.",
      };
    }

    // When configured with external provider in future
    return {
      text: "",
      confidence: 0,
      isAvailable: true,
      engineName: this.engineName,
    };
  }
}

// Singleton Default Provider
export const defaultOCRProvider = new ArchitectureReadyOCRProvider();
