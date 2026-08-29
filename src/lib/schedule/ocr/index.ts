/**
 * Production OCR Engine Public Exports & Registry Initialization
 * Velqora Intelligent Schedule Automation — FASE 29
 */

export * from "./types";
export * from "./image-preprocessor";
export * from "./pdf-renderer";
export * from "./provider";
export * from "./local-provider";
export * from "./ocr-service";

import { ocrRegistry } from "./provider";
import { ArchitectureReadyOCRProvider, MockTestOCRProvider } from "./local-provider";

// Initialize default providers
const defaultProvider = new ArchitectureReadyOCRProvider();
const mockProvider = new MockTestOCRProvider();

ocrRegistry.register(defaultProvider, true);
ocrRegistry.register(mockProvider, false);
