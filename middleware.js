import { NextResponse } from "next/server";

const publicRoutes = ["/", "/products", "/categories", "/about", "/contact", "/help", "/terms", "/privacy", "/verification"];
const authRoutes = ["/auth/login", "/auth/register"];
const dashboardRoutes = ["/dashboard"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get("better-auth.session_token")?.value;
  const isLoggedIn = !!sessionCookie;

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (dashboardRoutes.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  if (pathname === "/checkout" || pathname === "/payment-success") {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
