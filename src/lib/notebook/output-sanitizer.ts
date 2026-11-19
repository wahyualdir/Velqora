const PLACEHOLDER_OUTPUT_PATTERNS: RegExp[] = [
  /^status eksekusi:\s*komputasi berhasil dan output metrik valid\.?$/i,
  /^#\s*output\s+(?:verifikasi|pipeline)\b/i,
  /^validasi analitis$/i,
];

/**
 * Mendeteksi apakah teks output hanyalah placeholder generik kurikulum
 * (bukan keluaran eksekusi riil dari kode).
 */
export function isPlaceholderExpectedOutput(raw?: string | null): boolean {
  if (!raw) return false;
  const normalized = raw.trim();
  if (!normalized) return false;
  return PLACEHOLDER_OUTPUT_PATTERNS.some((re) => re.test(normalized));
}

/**
 * Mengembalikan teks output hanya jika merupakan keluaran nyata, atau string kosong bila placeholder.
 */
export function sanitizeExpectedOutput(raw?: string | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed || isPlaceholderExpectedOutput(trimmed)) return "";
  return trimmed;
}
