// app/api/orders/admin/all/route.ts
import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/lib/axios-server";
import { handleApiError } from "@/lib/api-error";
import { withAuth } from "@/lib/with-auth";

export const GET = withAuth(async (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "5";
  const status = req.nextUrl.searchParams.get("status") || "";
  const search = req.nextUrl.searchParams.get("search") || "";

  try {
    const res = await axiosServer.get("/orders/admin/all", {
      params: {
        page: Number(page),
        limit: Number(limit),
        ...(status && { status }),
        ...(search && { search }),
      },
    });
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Không thể lấy danh sách đơn hàng");
  }
});
