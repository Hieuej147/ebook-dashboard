// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { deleteSession, getSession } from "./lib/session";

const publicRoutes = ["/signin", "/signup"];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Đọc cookie trực tiếp
  const session = await getSession();

  // Chưa login mà vào trang protected
  if (!session && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Đã login mà cố vào signin/signup
  if (session && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
  // const session = await getSession();
  // if (!session || !session.user)
  //   return NextResponse.redirect(new URL("/signin", req.nextUrl));

  // NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
