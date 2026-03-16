// app/api/books/admin/all/route.ts
import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/lib/axios-server"; // ✅ chạy ở server, an toàn
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const search = req.nextUrl.searchParams.get("search") || "";
  const category = req.nextUrl.searchParams.get("category") || "";
  const isActive = req.nextUrl.searchParams.get("isActive");
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "10";

  const res = await axiosServer.get("/books/admin/all", {
    params: {
      search,
      category,
      page: Number(page),
      limit: Number(limit),
      ...(isActive !== null && { isActive: isActive === "true" }),
    },
  });

  return NextResponse.json(res.data);
}
