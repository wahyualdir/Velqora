"use server";

import { createClient } from "@/lib/supabase/server";
import {
  clearAllUserMemories,
  deleteUserMemoryItem,
  getUserMemoryProfile,
  saveUserMemoryItem,
  toggleUserMemoryEnabled,
} from "@/lib/ai/memory-manager";
import { MemoryCategory, MemoryItem, UserMemoryProfile } from "@/lib/ai/types";

/**
 * Get the current user's AI memory profile
 */
export async function getUserMemoriesAction(): Promise<UserMemoryProfile | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || "guest_user";
    return await getUserMemoryProfile(userId);
  } catch (err) {
    console.error("Failed to get user memories:", err);
    return null;
  }
}

/**
 * Save or update a memory item
 */
export async function saveUserMemoryAction(
  category: MemoryCategory,
  key: string,
  value: string
): Promise<MemoryItem | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || "guest_user";
    return await saveUserMemoryItem(userId, category, key, value, 1.0, "user_manual");
  } catch (err) {
    console.error("Failed to save user memory:", err);
    return null;
  }
}

/**
 * Delete a specific memory item
 */
export async function deleteUserMemoryAction(memoryId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || "guest_user";
    return await deleteUserMemoryItem(userId, memoryId);
  } catch (err) {
    console.error("Failed to delete user memory:", err);
    return false;
  }
}

/**
 * Clear all memories for the current user
 */
export async function clearAllUserMemoriesAction(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || "guest_user";
    await clearAllUserMemories(userId);
    return true;
  } catch (err) {
    console.error("Failed to clear user memories:", err);
    return false;
  }
}

/**
 * Toggle whether memory is enabled
 */
export async function toggleUserMemoryEnabledAction(isEnabled: boolean): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || "guest_user";
    return await toggleUserMemoryEnabled(userId, isEnabled);
  } catch (err) {
    console.error("Failed to toggle user memory:", err);
    return isEnabled;
  }
}
