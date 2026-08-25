import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client untuk digunakan di BROWSER (Client Components)
 * Gunakan ini di komponen yang memiliki "use client"
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
