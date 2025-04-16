import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if user is authenticated by looking for the user item in localStorage
  // Note: This is a simplified approach. In a real app, you'd use cookies or JWT tokens
  const user = request.cookies.get("user");
  const isAuthenticated = !!user;

  // Protected routes
  const protectedRoutes = ["/dashboard", "/kanban"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Login route
  const isLoginRoute = request.nextUrl.pathname === "/login";

  // Redirect logic
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
