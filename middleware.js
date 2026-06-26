import { NextResponse } from "next/server";

const publicRoutes = ["/", "/products", "/categories", "/about", "/contact", "/help", "/terms", "/privacy", "/verification"];
const authRoutes = ["/auth/login", "/auth/register"];

function getSessionCookie(request) {
  const cookies = request.cookies;
  // Check all possible Better-Auth cookie names
  for (const [name, value] of cookies) {
    if (name.includes("session") && value) {
      return true;
    }
  }
  return false;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isLoggedIn = getSessionCookie(request);

  // Auth pages (login/register) - redirect to dashboard if already logged in
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Dashboard routes - require login
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Checkout/payment - require login
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
