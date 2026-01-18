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
    client: "/auth/login/client", 
    seller: "/auth/login/seller",
  };

  // Extract the base route (admin/consultant/client/seller)
  const baseRoute = pathname.split("/")[1];

  // ✅ If no token, redirect to login page for that route
  if (!token) {
    if (routeMap[baseRoute]) {
      return NextResponse.redirect(new URL(routeMap[baseRoute], req.url));
    }
  }

  // ✅ If logged in, check if their role matches the route
  if (token) {
    // Use role instead of loginContext (more standard)
    const userRole = token.role || token.loginContext;

    if (baseRoute && userRole && baseRoute !== userRole) {
      // Redirect to their dashboard based on their role
      console.log("Redirecting to", userRole);
      return NextResponse.redirect(new URL(`/${userRole}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/consultant/:path*",
    "/client/:path*", // Added client routes
    "/seller/:path*", // Added seller routes
  ],
};
