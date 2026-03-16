// app/api/category/list/route.ts
import axiosServer from "@/lib/axios-server";
import { handleApiError } from "@/lib/api-error";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    // Gọi thẳng đến NestJS. Interceptor tự đính Token và tự parse JSON.
    const res = await axiosServer.get("/category/all/list");

    return NextResponse.json(res.data);
  } catch (error) {
    // Helper của Hiếu sẽ hốt gọn mọi lỗi 400, 401, 500 từ NestJS
    return handleApiError(error, "Không thể lấy danh sách danh mục");
  }
}
