import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // ✅ If no token and trying to access protected routes
  if (!token && (pathname.startsWith("/admin") || pathname.startsWith("/consultant") || pathname.startsWith("/customer"))) {
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ If logged in but role is not allowed
  if (token) {
    if (pathname.startsWith("/admin") && token.role !== "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (pathname.startsWith("/consultant") && token.role !== "linkedin") {
      return NextResponse.redirect(new URL("/consultant", req.url));
    }

    if (pathname.startsWith("/customer") && !(["google", "facebook", "linkedin"].includes(token.role as string))) {
      return NextResponse.redirect(new URL("/customer/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/consultant/:path*", "/customer/:path*"],
};
