"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { OWNER_EMAIL } from "@/lib/utils";

export interface UserRoleRecord {
  email: string;
  role: "owner" | "admin" | "user";
  created_at?: string;
  updated_at?: string;
}

/**
 * Get role for a specific email
 */
export async function getUserRoleAction(email: string): Promise<"owner" | "admin" | "user"> {
  const normalized = (email || "").trim().toLowerCase();
  if (normalized === OWNER_EMAIL.toLowerCase()) return "owner";

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("email", normalized)
      .single();

    if (error || !data) return "user";
    return (data.role as "owner" | "admin" | "user") || "user";
  } catch {
    return "user";
  }
}

/**
 * Get all users and their assigned roles (Accessible by Owner)
 */
export async function getAllUserRolesAction(): Promise<UserRoleRecord[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Verify current user is Owner
    const currentUserEmail = user?.email?.toLowerCase() || "";
    if (currentUserEmail !== OWNER_EMAIL.toLowerCase()) {
      throw new Error("Unauthorized: Hanya System Owner yang dapat melihat wewenang peran.");
    }

    // Fetch from user_roles
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: false });

    // Also fetch tracked visitor emails to populate complete user directory
    const { data: visits } = await supabase
      .from("user_visits")
      .select("user_email, visited_at")
      .order("visited_at", { ascending: false });

    const rolesMap = new Map<string, UserRoleRecord>();

    // Always seed System Owner
    rolesMap.set(OWNER_EMAIL.toLowerCase(), {
      email: OWNER_EMAIL,
      role: "owner",
      created_at: new Date().toISOString(),
    });

    if (roleData) {
      roleData.forEach((r) => {
        rolesMap.set(r.email.toLowerCase(), {
          email: r.email,
          role: r.email.toLowerCase() === OWNER_EMAIL.toLowerCase() ? "owner" : (r.role as any),
          created_at: r.created_at,
          updated_at: r.updated_at,
        });
      });
    }

    if (visits) {
      visits.forEach((v) => {
        const e = (v.user_email || "").trim().toLowerCase();
        if (e && !rolesMap.has(e)) {
          rolesMap.set(e, {
            email: v.user_email,
            role: "user",
            created_at: v.visited_at,
          });
        }
      });
    }

    return Array.from(rolesMap.values());
  } catch (err: any) {
    console.error("Error in getAllUserRolesAction:", err);
    // Fallback list with Owner
    return [
      {
        email: OWNER_EMAIL,
        role: "owner",
        created_at: new Date().toISOString(),
      },
    ];
  }
}

/**
 * Promote or Demote user role (Accessible ONLY by System Owner)
 */
export async function updateUserRoleAction(targetEmail: string, newRole: "admin" | "user"): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const currentUserEmail = user?.email?.toLowerCase() || "";
  if (currentUserEmail !== OWNER_EMAIL.toLowerCase()) {
    throw new Error("Unauthorized: Hanya System Owner yang berhak merubah peran pengguna.");
  }

  const normalizedTarget = (targetEmail || "").trim().toLowerCase();
  if (!normalizedTarget) throw new Error("Email tidak valid");

  if (normalizedTarget === OWNER_EMAIL.toLowerCase()) {
    throw new Error("Peran System Owner tidak dapat diubah!");
  }

  // Upsert into user_roles table
  const { error } = await supabase
    .from("user_roles")
    .upsert({
      email: normalizedTarget,
      role: newRole,
      updated_at: new Date().toISOString(),
    }, { onConflict: "email" });

  if (error) {
    console.error("Error updating user_roles table:", error);
    // Fallback error message
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/kelola-role");
  revalidatePath("/dashboard/peta-pengguna");
  return true;
}
