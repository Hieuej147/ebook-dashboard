// app/api/orders/user/[userId]/route.ts
import axiosServer from "@/lib/axios-server";
import { handleApiError } from "@/lib/api-error";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/with-auth";

export const GET = withAuth(async (request, { params }) => {
  const { userId } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const paramsObj = Object.fromEntries(searchParams.entries());
    const res = await axiosServer.get(`/orders/admin/user/${userId}`, {
      params: paramsObj,
    });
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(
      error,
      "Không thể lấy danh sách đơn hàng của người dùng",
    );
  }
});
