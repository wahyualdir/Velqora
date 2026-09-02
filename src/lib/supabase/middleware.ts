import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware untuk:
 * 1. Refresh session Supabase Auth
 * 2. Redirect ke /login jika belum login dan mengakses halaman yang dilindungi
 * 3. Redirect ke /dashboard jika sudah login tapi mengakses halaman autentikasi (/login, /register, /daftar, /reset-password)
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: any }>) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;
  let user = null;

  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch {
    user = null;
  }

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/daftar") ||
    pathname.startsWith("/reset-password");

  // Jika sudah login dan membuka halaman auth, arahkan ke /dashboard
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  const isProtectedRoute = pathname.startsWith("/dashboard");

  // Jika belum login dan mengakses halaman yang dilindungi, wajibkan login terlebih dahulu
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

