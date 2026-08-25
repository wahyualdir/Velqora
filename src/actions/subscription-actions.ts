"use server";

import { createClient } from "@/lib/supabase/server";
import { OWNER_EMAIL } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export type SubscriptionTier = "free" | "premium";

export interface UserSubscription {
  id: string;
  user_id: string;
  email: string;
  tier: SubscriptionTier;
  started_at: string;
  expires_at: string | null;
  daily_message_count: number;
  last_message_date: string;
}

const FREE_DAILY_LIMIT = 15;

/**
 * Get current user's subscription tier.
 * Auto-creates a 'free' subscription if none exists.
 * Owner always gets 'premium'.
 */
export async function getUserSubscription(): Promise<UserSubscription & { dailyLimit: number; remaining: number }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Tidak terautentikasi");

  const email = (user.email || "").trim().toLowerCase();
  const isOwner = email === OWNER_EMAIL.toLowerCase();

  // Try to fetch existing subscription
  let { data: sub } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Auto-create if not exists
  if (!sub) {
    const { data: newSub, error } = await supabase
      .from("user_subscriptions")
      .insert({
        user_id: user.id,
        email,
        tier: isOwner ? "premium" : "free",
        daily_message_count: 0,
        last_message_date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating subscription:", error);
      // Return fallback
      return {
        id: "",
        user_id: user.id,
        email,
        tier: isOwner ? "premium" : "free",
        started_at: new Date().toISOString(),
        expires_at: null,
        daily_message_count: 0,
        last_message_date: new Date().toISOString().split("T")[0],
        dailyLimit: isOwner ? Infinity : FREE_DAILY_LIMIT,
        remaining: isOwner ? Infinity : FREE_DAILY_LIMIT,
      };
    }
    sub = newSub;
  }

  // Owner override
  const tier: SubscriptionTier = isOwner ? "premium" : (sub.tier as SubscriptionTier);
  const today = new Date().toISOString().split("T")[0];
  const isNewDay = sub.last_message_date !== today;
  const count = isNewDay ? 0 : (sub.daily_message_count || 0);

  const dailyLimit = tier === "premium" ? Infinity : FREE_DAILY_LIMIT;
  const remaining = tier === "premium" ? Infinity : Math.max(0, FREE_DAILY_LIMIT - count);

  return {
    ...sub,
    tier,
    daily_message_count: count,
    dailyLimit,
    remaining,
  };
}

/**
 * Check daily limit and increment message count.
 * Returns { allowed, remaining } or throws if not authenticated.
 */
export async function checkAndIncrementDailyLimit(): Promise<{
  allowed: boolean;
  remaining: number;
  tier: SubscriptionTier;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Tidak terautentikasi");

  const email = (user.email || "").trim().toLowerCase();
  const isOwner = email === OWNER_EMAIL.toLowerCase();

  let { data: sub } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Auto-create
  if (!sub) {
    const { data: newSub } = await supabase
      .from("user_subscriptions")
      .insert({
        user_id: user.id,
        email,
        tier: isOwner ? "premium" : "free",
        daily_message_count: 0,
        last_message_date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();
    sub = newSub;
  }

  if (!sub) {
    return { allowed: true, remaining: FREE_DAILY_LIMIT, tier: "free" };
  }

  const tier: SubscriptionTier = isOwner ? "premium" : (sub.tier as SubscriptionTier);

  // Premium = always allowed
  if (tier === "premium") {
    return { allowed: true, remaining: Infinity, tier: "premium" };
  }

  // Free tier — check daily limit
  const today = new Date().toISOString().split("T")[0];
  const isNewDay = sub.last_message_date !== today;
  const currentCount = isNewDay ? 0 : (sub.daily_message_count || 0);

  if (currentCount >= FREE_DAILY_LIMIT) {
    return { allowed: false, remaining: 0, tier: "free" };
  }

  // Increment count
  const newCount = currentCount + 1;
  await supabase
    .from("user_subscriptions")
    .update({
      daily_message_count: newCount,
      last_message_date: today,
    })
    .eq("user_id", user.id);

  return {
    allowed: true,
    remaining: Math.max(0, FREE_DAILY_LIMIT - newCount),
    tier: "free",
  };
}

/**
 * Upgrade/downgrade a user's tier (Owner/Admin only)
 */
export async function updateUserTierAction(
  targetEmail: string,
  newTier: SubscriptionTier
): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const currentEmail = (user?.email || "").trim().toLowerCase();
  if (currentEmail !== OWNER_EMAIL.toLowerCase()) {
    throw new Error("Unauthorized: Hanya System Owner yang berhak mengubah tier pengguna.");
  }

  const normalizedTarget = (targetEmail || "").trim().toLowerCase();
  if (!normalizedTarget) throw new Error("Email tidak valid");

  // Check if subscription exists
  const { data: existing } = await supabase
    .from("user_subscriptions")
    .select("id")
    .eq("email", normalizedTarget)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({
        tier: newTier,
        started_at: newTier === "premium" ? new Date().toISOString() : undefined,
      })
      .eq("email", normalizedTarget);

    if (error) throw new Error(error.message);
  } else {
    // Need to find user_id from auth — use a lookup from user_roles or visits
    // For now, insert with email only (user_id will be set when user logs in)
    const { error } = await supabase
      .from("user_subscriptions")
      .insert({
        user_id: user!.id, // placeholder, will be corrected on user's next login
        email: normalizedTarget,
        tier: newTier,
        daily_message_count: 0,
        last_message_date: new Date().toISOString().split("T")[0],
      });

    if (error) throw new Error(error.message);
  }

  revalidatePath("/dashboard/kelola-role");
  return true;
}

/**
 * Get all subscriptions (Owner only)
 */
export async function getAllSubscriptionsAction(): Promise<UserSubscription[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const currentEmail = (user?.email || "").trim().toLowerCase();
  if (currentEmail !== OWNER_EMAIL.toLowerCase()) {
    throw new Error("Unauthorized");
  }

  const { data } = await supabase
    .from("user_subscriptions")
    .select("*")
    .order("created_at", { ascending: false });

  return (data || []) as UserSubscription[];
}
