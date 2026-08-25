"use client";

export interface BookmarkItem {
  id: string;
  type: "module" | "project" | "material" | "file" | "chapter";
  title: string;
  subtitle?: string;
  category?: string;
  level?: string;
  url?: string;
  savedAt?: string;
}

const LEGACY_STORAGE_KEY = "velqora_user_bookmarks_v1";

/**
 * Mendapatkan identifier user yang sedang aktif di browser
 */
export function getActiveUserIdentifier(): string {
  if (typeof window === "undefined") return "guest";
  try {
    const cached = localStorage.getItem("velqora_current_user_id");
    if (cached) return cached;

    // Cari session token dari Supabase di localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
        const val = localStorage.getItem(key);
        if (val) {
          const parsed = JSON.parse(val);
          const user = parsed?.user?.id || parsed?.user?.email;
          if (user) {
            localStorage.setItem("velqora_current_user_id", user);
            return user;
          }
        }
      }
    }
  } catch (err) {
    console.error("Error detecting active user identifier:", err);
  }
  return "default_user";
}

/**
 * Storage key unik per akun user
 */
export function getBookmarkStorageKey(): string {
  const user = getActiveUserIdentifier();
  return `velqora_bookmarks_user_${user}`;
}

export function getBookmarks(): BookmarkItem[] {
  if (typeof window === "undefined") return [];
  try {
    const key = getBookmarkStorageKey();
    let raw = localStorage.getItem(key);

    // Migrasi data legacy jika key user belum ada datanya
    if (!raw && key !== LEGACY_STORAGE_KEY) {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) {
        localStorage.setItem(key, legacy);
        raw = legacy;
      }
    }

    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read bookmarks", err);
    return [];
  }
}

export function isBookmarked(id: string): boolean {
  const list = getBookmarks();
  return list.some((b) => b.id === id);
}

export function toggleBookmark(item: BookmarkItem): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = getBookmarkStorageKey();
    const list = getBookmarks();
    const index = list.findIndex((b) => b.id === item.id);
    let isNowBookmarked = false;

    if (index >= 0) {
      list.splice(index, 1);
      isNowBookmarked = false;
    } else {
      list.unshift({
        ...item,
        url: item.url || `/dashboard/modul?module=${item.id}`,
        savedAt: item.savedAt || new Date().toISOString(),
      });
      isNowBookmarked = true;
    }

    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new Event("bookmarks-updated"));
    return isNowBookmarked;
  } catch (err) {
    console.error("Failed to toggle bookmark", err);
    return false;
  }
}

export function removeBookmark(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = getBookmarkStorageKey();
    const list = getBookmarks().filter((b) => b.id !== id);
    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new Event("bookmarks-updated"));
  } catch (err) {
    console.error("Failed to remove bookmark", err);
  }
}

export function clearAllBookmarks(): void {
  if (typeof window === "undefined") return;
  try {
    const key = getBookmarkStorageKey();
    localStorage.removeItem(key);
    window.dispatchEvent(new Event("bookmarks-updated"));
  } catch (err) {
    console.error("Failed to clear bookmarks", err);
  }
}
