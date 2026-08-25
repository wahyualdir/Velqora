import { createClient } from "@/lib/supabase/client";

/**
 * Track visitor location using IP geolocation.
 * Stores visit data in Supabase `user_visits` table.
 * Call this once per session (e.g., on dashboard mount).
 */
export async function trackUserVisit() {
  // Prevent duplicate tracking in the same session
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem("visit_tracked")) return;

  try {
    // Get approximate location from IP
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return;
    const geo = await res.json();

    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();

    const visitData = {
      user_email: authData?.user?.email || "anonymous",
      city: geo.city || "Unknown",
      region: geo.region || "Unknown",
      country: geo.country_name || "Unknown",
      country_code: geo.country_code || "XX",
      latitude: geo.latitude || 0,
      longitude: geo.longitude || 0,
      ip: geo.ip || "",
      timezone: geo.timezone || "",
      visited_at: new Date().toISOString(),
    };

    // Insert into Supabase table
    await supabase.from("user_visits").insert(visitData);

    // Mark as tracked for this session
    sessionStorage.setItem("visit_tracked", "true");
  } catch (err) {
    // Silently fail — tracking is non-critical
    console.warn("Visit tracking skipped:", err);
  }
}

/**
 * Fetch all visitor locations (admin only).
 */
export async function getVisitorLocations() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_visits")
    .select("*")
    .order("visited_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Failed to fetch visits:", error);
    return [];
  }
  return data || [];
}
