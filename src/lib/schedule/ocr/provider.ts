/**
 * OCR Provider Registry & Abstract Factory
 * Velqora Intelligent Schedule Automation — FASE 29
 */

import { OCRProvider } from "./types";
import { logger } from "@/lib/observability";

class OCRProviderRegistry {
  private providers: Map<string, OCRProvider> = new Map();
  private defaultProviderName: string = "architecture-ready";

  register(provider: OCRProvider, isDefault: boolean = false): void {
    this.providers.set(provider.name.toLowerCase(), provider);
    if (isDefault || this.providers.size === 1) {
      this.defaultProviderName = provider.name.toLowerCase();
    }
    logger.info("OCR_REGISTRY", `Registered OCR provider: ${provider.name}`, {
      isDefault: this.defaultProviderName === provider.name.toLowerCase(),
      available: provider.isAvailable(),
    });
  }

  get(name?: string): OCRProvider | undefined {
    if (!name) {
      return this.providers.get(this.defaultProviderName);
    }
    return this.providers.get(name.toLowerCase());
  }

  getDefault(): OCRProvider {
    const provider = this.providers.get(this.defaultProviderName);
    if (!provider) {
      throw new Error(`No default OCR provider registered.`);
    }
    return provider;
  }

  list(): Array<{ name: string; isAvailable: boolean; isDefault: boolean }> {
    return Array.from(this.providers.entries()).map(([key, p]) => ({
      name: p.name,
      isAvailable: p.isAvailable(),
      isDefault: key === this.defaultProviderName,
    }));
  }
}

export const ocrRegistry = new OCRProviderRegistry();
