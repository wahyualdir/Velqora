import { createClient } from "@/lib/supabase/client";

export interface ClassItem {
  id: string;
  name: string;
  subject: string;
  description: string;
  code: string; // 6-digit random code e.g. "K9x7B2"
  teacherName: string;
  teacherEmail: string;
  createdAt: string;
  membersCount: number;
  bannerColor: string;
}

export interface AnnouncementItem {
  id: string;
  classId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
}

/**
 * Generate 6-digit random code consisting of numbers, lowercase, and uppercase letters.
 * Example outputs: "K9x7B2", "m4W8Pq", "R3n9Z1"
 */
export function generateClassCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const BANNER_GRADIENTS = [
  "from-indigo-600 via-purple-600 to-pink-600",
  "from-blue-600 via-cyan-600 to-teal-500",
  "from-emerald-600 via-teal-600 to-cyan-600",
  "from-amber-600 via-orange-600 to-rose-600",
  "from-violet-600 via-indigo-600 to-blue-600",
];

import { getActiveUserIdentifier } from "./bookmark-service";

export function getClassesStorageKey(): string {
  const user = getActiveUserIdentifier();
  return `velqora_classes_user_${user}`;
}

export function getJoinedClassesStorageKey(): string {
  const user = getActiveUserIdentifier();
  return `velqora_joined_classes_user_${user}`;
}

export function getLocalClasses(): ClassItem[] {
  if (typeof window === "undefined") return [];
  const key = getClassesStorageKey();
  const saved = localStorage.getItem(key);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
}

export function saveLocalClass(newClass: ClassItem) {
  if (typeof window === "undefined") return;
  const key = getClassesStorageKey();
  const current = getLocalClasses();
  const updated = [newClass, ...current];
  localStorage.setItem(key, JSON.stringify(updated));
}

export function deleteLocalClass(classId: string) {
  if (typeof window === "undefined") return;
  const key = getClassesStorageKey();
  const current = getLocalClasses();
  const updated = current.filter((c) => c.id !== classId);
  localStorage.setItem(key, JSON.stringify(updated));
}

export function getJoinedClassCodes(): string[] {
  if (typeof window === "undefined") return [];
  const key = getJoinedClassesStorageKey();
  const saved = localStorage.getItem(key);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
}

export function addJoinedClassCode(code: string) {
  if (typeof window === "undefined") return;
  const key = getJoinedClassesStorageKey();
  const current = getJoinedClassCodes();
  if (!current.includes(code)) {
    localStorage.setItem(key, JSON.stringify([...current, code]));
  }
}

export function getRandomBannerGradient(): string {
  const randomIndex = Math.floor(Math.random() * BANNER_GRADIENTS.length);
  return BANNER_GRADIENTS[randomIndex];
}
