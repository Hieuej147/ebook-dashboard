// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { encrypt, getSession } from "./lib/session";
import { decodeJwtExpiry } from "./lib/token";


const adminRoutes = ["/dashboard", "/admin"];
const publicRoutes = ["/", "/signin", "/signup"];

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || record.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  if (record.count >= 60) return true;

  record.count++;
  return false;
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  const isAuthRoute =
    pathname.startsWith("/api/auth") ||
    pathname === "/signin" ||
    pathname === "/signup";

  if (isAuthRoute && isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const session = await getSession();
  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = adminRoutes.some((r) => pathname.startsWith(r));

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (session && isProtectedRoute) {
    const now = Date.now();
    const isThresholdPassed = session.atExpiresAt - now < 2 * 60 * 1000;

    if (isThresholdPassed) {
      try {
        const res = await fetch(`${process.env.NESTJS_API_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.refreshToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const response = NextResponse.redirect(new URL("/signin", req.url));
          response.cookies.delete("session");
          return response;
        }

        const tokens = await res.json();
        const newAtExpiresAt =
          decodeJwtExpiry(tokens.accessToken) ?? Date.now() + 15 * 60 * 1000;

        const newSession = await encrypt({
          ...session,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          atExpiresAt: newAtExpiresAt,
        });

        const isProd = process.env.NODE_ENV === "production";
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("cookie", `session=${newSession}`);

        const response = NextResponse.next({
          request: { headers: requestHeaders },
        });

        response.cookies.set("session", newSession, {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? "none" : "lax",
          path: "/",
          expires: new Date(session.sessionExpiresAt),
        });

        return response;
      } catch (error) {
        console.error("Middleware refresh failed:", error);
        const response = NextResponse.redirect(new URL("/signin", req.url));
        response.cookies.delete("session");
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
