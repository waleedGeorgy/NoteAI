import { type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";
import { createClient } from "./utils/supabase/server";

export async function proxy(request: NextRequest) {
  await updateSession(request);

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isAuthenticated = !!data.user;

  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  const protectedRoutes = ["/dashboard", "/notes/*"];
  const authRoutes = ["/signup", "/login", "/"];

  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  if (!isAuthenticated && isProtectedRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }
  if (isAuthenticated && isAuthRoute) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  return null;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
