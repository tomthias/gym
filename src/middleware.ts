import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type ProfileRole = { role: "patient" | "physio" };

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Missing env vars — let the request through to avoid blocking all routes
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Public routes that don't require auth
  const publicRoutes = ["/login", "/register", "/callback", "/forgot-password", "/reset-password"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // If not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If authenticated and on a public route, redirect based on role
  if (user && isPublicRoute) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single<ProfileRole>();

    if (profileError || !profile) {
      // Profile not ready yet (e.g. trigger hasn't fired) — let the request through
      return supabaseResponse;
    }

    const url = request.nextUrl.clone();
    url.pathname = profile.role === "physio" ? "/physio/dashboard" : "/dashboard";
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  if (user) {
    const isPatientRoute =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/workout") ||
      pathname.startsWith("/history") ||
      pathname.startsWith("/nutrition") ||
      pathname.startsWith("/settings");
    const isPhysioRoute = pathname.startsWith("/physio");

    if (isPatientRoute || isPhysioRoute) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single<ProfileRole>();

      if (profileError || !profile) {
        // Profile not found — redirect to login as safety fallback
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      const url = request.nextUrl.clone();
      if (isPatientRoute && profile.role === "physio") {
        url.pathname = "/physio/dashboard";
        return NextResponse.redirect(url);
      }
      if (isPhysioRoute && profile.role === "patient") {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|sounds|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
