import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Map protected routes to login paths
  const routeMap: Record<string, string> = {
    admin: "/auth/login/admin",
    consultant: "/auth/login/consultant",
    customer: "/auth/login/customer",
  };

  // Extract the base route (admin/consultant/customer)
  const baseRoute = pathname.split("/")[1];

  // ✅ If no token, redirect to login page for that route
  if (!token) {
    if (routeMap[baseRoute]) {
      return NextResponse.redirect(new URL(routeMap[baseRoute], req.url));
    }
  }

  // ✅ If logged in, check if their loginContext matches the route
  if (token?.loginContext) {
    if (baseRoute && baseRoute !== token.loginContext) {
      // Redirect to their dashboard based on loginContext
      return NextResponse.redirect(new URL(`/${token.loginContext}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/consultant/:path*", "/customer/:path*"],
};
