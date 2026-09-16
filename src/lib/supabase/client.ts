import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client untuk digunakan di BROWSER (Client Components)
 * Gunakan ini di komponen yang memiliki "use client"
 */
export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
}
