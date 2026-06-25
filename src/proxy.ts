import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAccountRoute = createRouteMatcher(["/account(.*)"]);
const isAdminPublicRoute = createRouteMatcher([
  "/admin/login(.*)",
  "/admin/unauthorized(.*)",
]);
const isAdminPageRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminApiRoute = createRouteMatcher(["/api/admin(.*)"]);

export const proxy = clerkMiddleware(async (auth, req) => {
  if (isAdminPublicRoute(req)) {
    return NextResponse.next();
  }

  if (isAccountRoute(req)) {
    await auth.protect({ unauthenticatedUrl: "/sign-in" });
  }

  if (isAdminPageRoute(req)) {
    await auth.protect({ unauthenticatedUrl: "/admin/login" });
  }

  if (isAdminApiRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)", "/__clerk/:path*"],
};
