/**
 * OCR Engine Types & Interfaces
 * Velqora Intelligent Schedule Automation — FASE 29
 */

export interface OCRBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OCRTextWord {
  text: string;
  confidence: number;
  bbox?: OCRBoundingBox;
}

export interface OCRTextLine {
  text: string;
  confidence: number;
  words?: OCRTextWord[];
  bbox?: OCRBoundingBox;
  lineNumber?: number;
}

export interface OCRTextBlock {
  text: string;
  confidence: number;
  lines?: OCRTextLine[];
  bbox?: OCRBoundingBox;
  blockType?: "paragraph" | "table_cell" | "header" | "footer";
}

export interface ImagePreprocessOptions {
  grayscale?: boolean;
  contrastStretch?: boolean;
  deskew?: boolean;
  noiseReduction?: boolean;
  maxDimension?: number;
  targetDpi?: number;
}

export interface PreprocessResult {
  buffer: Buffer;
  mimeType: string;
  width?: number;
  height?: number;
  rotationDegrees?: number;
  wasModified: boolean;
  processingTimeMs: number;
  appliedSteps: string[];
}

export interface OCRProcessOptions {
  language?: string; // e.g. "ind+eng"
  preprocess?: boolean;
  preprocessOptions?: ImagePreprocessOptions;
  timeoutMs?: number;
  pageNumber?: number;
}

export interface PageOCRResult {
  pageNumber: number;
  text: string;
  confidence: number; // 0.0 to 1.0 (OCR readability fidelity)
  language?: string;
  blocks?: OCRTextBlock[];
  lines?: OCRTextLine[];
  boundingBoxes?: OCRBoundingBox[];
  metadata: {
    width?: number;
    height?: number;
    orientation?: number;
    processingTimeMs: number;
    provider: string;
    preprocessed?: boolean;
  };
  warnings?: string[];
  error?: string;
  isSuccess: boolean;
}

export interface MultiPageOCRResult {
  totalPages: number;
  successfulPages: number;
  failedPages: number;
  pages: PageOCRResult[];
  fullText: string;
  averageConfidence: number;
  provider: string;
  totalProcessingTimeMs: number;
  isPartialSuccess: boolean;
  warnings?: string[];
  error?: string;
}

export interface OCRProvider {
  readonly name: string;
  isAvailable(): boolean;
  processImage(buffer: Buffer, options?: OCRProcessOptions): Promise<PageOCRResult>;
  processPdfPages(buffer: Buffer, options?: OCRProcessOptions): Promise<MultiPageOCRResult>;
}
