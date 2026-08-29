/**
 * Production Observability, Structured Logging, and Rate Limiting
 * Velqora Academic Workspace
 */

export type LogLevel = "INFO" | "WARN" | "ERROR";

export type ErrorCategory =
  | "AUTH_ERROR"
  | "AUTHORIZATION_ERROR"
  | "VALIDATION_ERROR"
  | "DATABASE_ERROR"
  | "STORAGE_ERROR"
  | "AI_PROVIDER_ERROR"
  | "RATE_LIMIT_ERROR"
  | "TIMEOUT_ERROR"
  | "NETWORK_ERROR"
  | "NOT_FOUND_ERROR"
  | "CONFLICT_ERROR"
  | "INTERNAL_ERROR";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  category?: ErrorCategory;
  correlationId?: string;
  metadata?: Record<string, unknown>;
  error?: {
    name?: string;
    message?: string;
    code?: string;
  };
}

// Redact sensitive keys from metadata
const REDACTED_KEYS = new Set([
  "password",
  "token",
  "apikey",
  "api_key",
  "secret",
  "authorization",
  "cookie",
  "gemini_api_key",
  "service_role_key",
]);

function sanitizeMetadata(meta?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!meta) return undefined;
  const clean: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(meta)) {
    const lowerKey = key.toLowerCase();
    if (REDACTED_KEYS.has(lowerKey)) {
      clean[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      clean[key] = sanitizeMetadata(value as Record<string, unknown>);
    } else {
      clean[key] = value;
    }
  }

  return clean;
}

/**
 * Structured Production Logger
 */
export const logger = {
  info(context: string, message: string, metadata?: Record<string, unknown>, correlationId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "INFO",
      context,
      message,
      correlationId,
      metadata: sanitizeMetadata(metadata),
    };
    console.info(JSON.stringify(entry));
  },

  warn(context: string, message: string, metadata?: Record<string, unknown>, correlationId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "WARN",
      context,
      message,
      correlationId,
      metadata: sanitizeMetadata(metadata),
    };
    console.warn(JSON.stringify(entry));
  },

  error(
    context: string,
    message: string,
    err?: unknown,
    metadata?: Record<string, unknown>,
    correlationId?: string
  ) {
    let errorObj: LogEntry["error"] = undefined;
    if (err instanceof Error) {
      errorObj = {
        name: err.name,
        message: err.message,
      };
    } else if (typeof err === "string") {
      errorObj = { message: err };
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "ERROR",
      context,
      message,
      correlationId,
      metadata: sanitizeMetadata(metadata),
      error: errorObj,
    };
    console.error(JSON.stringify(entry));
  },
};

/**
 * Generate a safe Correlation ID
 */
export function generateCorrelationId(prefix = "req"): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${timestamp}_${randomSuffix}`;
}

// -------------------------------------------------------------
// In-Memory Sliding Window Rate Limiter
// -------------------------------------------------------------

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale rate limit records every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 600000); // 10 minutes window
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
}

/**
 * Check and record a rate limited action
 * @param key Unique key (e.g. userId or IP)
 * @param limit Maximum allowed requests in window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTimeMs: number } {
  const now = Date.now();
  let record = rateLimitStore.get(key);

  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter timestamps within the current window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0] || now;
    const resetTimeMs = Math.max(0, windowMs - (now - oldestTimestamp));
    return {
      allowed: false,
      remaining: 0,
      resetTimeMs,
    };
  }

  // Record this request
  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: Math.max(0, limit - record.timestamps.length),
    resetTimeMs: windowMs,
  };
}
