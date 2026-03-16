// app/api/orders/user/[userId]/route.ts
import axiosServer from "@/lib/axios-server";
import { handleApiError } from "@/lib/api-error";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { userId } = await params;

  try {
    // 1. Lấy query params từ URL (page, limit, search...)
    const { searchParams } = new URL(request.url);
    const paramsObj = Object.fromEntries(searchParams.entries());

    // 2. Axios tự động biến paramsObj thành query string chuẩn
    // Ví dụ: { page: 1 } -> ?page=1
    const res = await axiosServer.get(`/orders/admin/user/${userId}`, {
      params: paramsObj,
    });

    return NextResponse.json(res.data);
  } catch (error) {
    // Helper của Hiếu sẽ xử lý gọn các lỗi 404 (user ko tồn tại) hoặc 401
    return handleApiError(
      error,
      "Không thể lấy danh sách đơn hàng của người dùng",
    );
  }
}
