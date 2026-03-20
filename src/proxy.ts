import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { encrypt, getSession } from "./lib/session";
import { decodeJwtExpiry } from "./lib/token";
import arcjet, { shield, fixedWindow, detectBot } from "@arcjet/next";

const publicRoutes = ["/signin", "/signup"];

// ✅ Rule chung cho toàn app
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR"],
    }),
  ],
});

// ✅ Rule chặt hơn cho auth routes
const authAj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 10,
    }),
  ],
});

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/unauthorized") {
    return NextResponse.next();
  }

  const isAuthRoute =
    pathname.startsWith("/api/auth") ||
    pathname === "/signin" ||
    pathname === "/signup";

  const decision = await (isAuthRoute ? authAj : aj).protect(req);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }
    if (decision.reason.isBot()) {
      return NextResponse.json({ message: "Bot detected" }, { status: 403 });
    }
    if (decision.reason.isShield()) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const session = await getSession();
  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isRootRoute = pathname === "/";

  if (isRootRoute && session) {
    if ((session.user.role as unknown) !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (
    isProtectedRoute &&
    session &&
    (session.user.role as unknown) !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
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

        const newSessionPayload = {
          ...session,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          atExpiresAt: newAtExpiresAt,
        };

        const newSessionValue = await encrypt(newSessionPayload);
        const requestHeaders = new Headers(req.headers);
        const isProd = process.env.NODE_ENV === "production";
        requestHeaders.set("cookie", `session=${newSessionValue}`);

        const response = NextResponse.next({
          request: { headers: requestHeaders },
        });
        response.cookies.set("session", newSessionValue, {
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
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
