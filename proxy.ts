import { clerkMiddleware } from "@clerk/nextjs/server";

const protectedRoutes = [
  "/dashboard",
  "/analytics",
  "/settings",
  "/admin",
  "/api/accounts",
  "/api/settings",
  "/api/check-account",
  "/api/admin",
  "/api/upgrade",
  "/api/analytics",
];

const isProtectedRoute = (pathname: string) => {
  return protectedRoutes.some((route) => pathname.startsWith(route));
};

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  if (isProtectedRoute(pathname)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/api/accounts/:path*",
    "/api/settings/:path*",
    "/api/check-account/:path*",
    "/api/admin/:path*",
    "/api/upgrade/:path*",
    "/api/analytics/:path*",
  ],
};
