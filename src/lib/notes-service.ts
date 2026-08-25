"use client";

import { getActiveUserIdentifier } from "./bookmark-service";

export type NoteColor = "blue" | "emerald" | "amber" | "purple" | "rose" | "slate";

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  category?: string;
  color?: NoteColor;
  pinned?: boolean;
  targetId?: string; // module ID, material ID, chapter ID
  targetType?: "module" | "material" | "chapter" | "general";
  targetTitle?: string;
  targetUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const LEGACY_STORAGE_KEY = "velqora_user_notes_v1";

/**
 * Storage key unik per akun user
 */
export function getNotesStorageKey(): string {
  const user = getActiveUserIdentifier();
  return `velqora_notes_user_${user}`;
}

export function getStudyNotes(): StudyNote[] {
  if (typeof window === "undefined") return [];
  try {
    const key = getNotesStorageKey();
    let raw = localStorage.getItem(key);

    // Migrasi data legacy jika key user belum ada datanya
    if (!raw && key !== LEGACY_STORAGE_KEY) {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) {
        localStorage.setItem(key, legacy);
        raw = legacy;
      }
    }

    const list: StudyNote[] = raw ? JSON.parse(raw) : [];
    // Sort: Pinned first, then newest updatedAt
    return list.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  } catch (err) {
    console.error("Failed to read study notes", err);
    return [];
  }
}

export function getNotesForTarget(targetId: string): StudyNote[] {
  const notes = getStudyNotes();
  return notes.filter((n) => n.targetId === targetId);
}

export function saveStudyNote(
  note: Omit<StudyNote, "id" | "createdAt" | "updatedAt"> & { id?: string }
): StudyNote {
  if (typeof window === "undefined") {
    throw new Error("Window not defined");
  }

  const key = getNotesStorageKey();
  const notes = getStudyNotes();
  const now = new Date().toISOString();

  if (note.id) {
    const idx = notes.findIndex((n) => n.id === note.id);
    if (idx >= 0) {
      const updated: StudyNote = {
        ...notes[idx],
        ...note,
        id: note.id,
        updatedAt: now,
      };
      notes[idx] = updated;
      localStorage.setItem(key, JSON.stringify(notes));
      window.dispatchEvent(new Event("notes-updated"));
      return updated;
    }
  }

  const newNote: StudyNote = {
    ...note,
    id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    color: note.color || "blue",
    pinned: note.pinned || false,
    createdAt: now,
    updatedAt: now,
  };

  notes.unshift(newNote);
  localStorage.setItem(key, JSON.stringify(notes));
  window.dispatchEvent(new Event("notes-updated"));
  return newNote;
}

export function togglePinNote(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = getNotesStorageKey();
    const notes = getStudyNotes();
    const idx = notes.findIndex((n) => n.id === id);
    if (idx >= 0) {
      notes[idx].pinned = !notes[idx].pinned;
      notes[idx].updatedAt = new Date().toISOString();
      localStorage.setItem(key, JSON.stringify(notes));
      window.dispatchEvent(new Event("notes-updated"));
      return !!notes[idx].pinned;
    }
    return false;
  } catch (err) {
    console.error("Failed to toggle pin note", err);
    return false;
  }
}

export function deleteStudyNote(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = getNotesStorageKey();
    const notes = getStudyNotes().filter((n) => n.id !== id);
    localStorage.setItem(key, JSON.stringify(notes));
    window.dispatchEvent(new Event("notes-updated"));
  } catch (err) {
    console.error("Failed to delete study note", err);
  }
}

export function clearAllStudyNotes(): void {
  if (typeof window === "undefined") return;
  try {
    const key = getNotesStorageKey();
    localStorage.removeItem(key);
    window.dispatchEvent(new Event("notes-updated"));
  } catch (err) {
    console.error("Failed to clear study notes", err);
  }
}
