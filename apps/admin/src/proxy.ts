import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseMiddlewareClient } from "@repo/api";
import { isValidRole } from "@/features/auth/utils/roles";

const PUBLIC_PATHS = ["/login"];
const ADMIN_PATHS = ["/users", "/publishers", "/settings", "/regions", "/categories"];

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  const supabase = createSupabaseMiddlewareClient(request, response);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  const isPublicPath = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  // 1. Unauthenticated or expired session
  if (authError || !user) {
    if (!isPublicPath) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      
      const redirectSupabase = createSupabaseMiddlewareClient(request, redirectResponse);
      await redirectSupabase.auth.signOut();
      
      return redirectResponse;
    }
    return response;
  }

  // 2. Profile checks (inactive blocking, role fallback)
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  const profile = profileData as { role: string; is_active: boolean } | null;

  if (profileError || !profile || profile.is_active === false || !isValidRole(profile.role)) {
    const loginUrl = new URL("/login", request.url);
    if (profile && profile.is_active === false) {
      loginUrl.searchParams.set("error", "Your account has been deactivated.");
    } else {
      loginUrl.searchParams.set("error", "Access denied. Insufficient permissions.");
    }
    
    const redirectResponse = NextResponse.redirect(loginUrl);
    const redirectSupabase = createSupabaseMiddlewareClient(request, redirectResponse);
    await redirectSupabase.auth.signOut();
    return redirectResponse;
  }

  // 3. Unauthorized route protection
  const isAdminPath = ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (isAdminPath && profile.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4. Authenticated + visiting /login → redirect to dashboard
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
