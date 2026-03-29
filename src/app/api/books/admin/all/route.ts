// app/api/books/admin/all/route.ts
import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/lib/axios-server";
import { handleApiError } from "@/lib/api-error";
import { withAuth } from "@/lib/with-auth";

export const GET = withAuth(async (req: NextRequest) => {
  const search = req.nextUrl.searchParams.get("search") || "";
  const category = req.nextUrl.searchParams.get("category") || "";
  const isActive = req.nextUrl.searchParams.get("isActive");
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "10";

  try {
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
  } catch (error) {
    return handleApiError(error, "Không thể lấy danh sách sách");
  }
});