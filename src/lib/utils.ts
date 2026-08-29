// Utility functions

/**
 * Gabungkan class names dengan filter falsy values
 * Pengganti ringan untuk 'clsx' atau 'cn' library
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format ukuran file ke format yang mudah dibaca
 * Contoh: 1024 -> "1.0 KB", 1048576 -> "1.0 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Format tanggal ke format Indonesia
 * Contoh: "2024-01-15T10:30:00" -> "15 Jan 2024"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format tanggal dengan waktu
 * Contoh: "2024-01-15T10:30:00" -> "15 Jan 2024, 10:30"
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Hitung sisa hari menuju deadline
 * Return negatif jika sudah lewat
 */
export function daysUntilDeadline(deadline: string): number {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Dapatkan warna berdasarkan sisa hari deadline
 */
export function getDeadlineColor(deadline: string): string {
  const days = daysUntilDeadline(deadline);
  if (days < 0) return "text-accent-red"; // Sudah lewat
  if (days <= 1) return "text-accent-red"; // Besok/hari ini
  if (days <= 3) return "text-accent-amber"; // 3 hari lagi
  return "text-accent-green"; // Masih lama
}

/**
 * Singkat teks panjang
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Generate slug dari text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Dapatkan ekstensi file
 */
export function getFileExtension(filename: string): string {
  return filename.slice(filename.lastIndexOf(".")).toLowerCase();
}

/**
 * Cek apakah file bisa di-preview
 */
export function isPreviewable(mimeType: string): boolean {
  return (
    mimeType === "application/pdf" ||
    mimeType.startsWith("image/")
  );
}

/**
 * Owner & Admin Credentials Helper (Configurable via Environment Variables)
 */
export const OWNER_EMAIL = (
  process.env.NEXT_PUBLIC_OWNER_EMAIL || "admin@velqora.app"
).trim().toLowerCase();

export const ADMIN_EMAIL = (
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || OWNER_EMAIL
).trim().toLowerCase();

export function isOwnerUser(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === OWNER_EMAIL;
}

export function isAdminUser(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return normalized === ADMIN_EMAIL || normalized === OWNER_EMAIL;
}

export function isOwnerOrAdminRole(role?: string | null, email?: string | null): boolean {
  if (email && isOwnerUser(email)) return true;
  if (!role) return false;
  return role === "owner" || role === "admin";
}
