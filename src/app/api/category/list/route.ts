// app/api/category/list/route.ts
import axiosServer from "@/lib/axios-server";
import { handleApiError } from "@/lib/api-error";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/with-auth";

export const GET = withAuth(async () => {
  try {
    const res = await axiosServer.get("/category/all/list");
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Không thể lấy danh sách danh mục");
  }
});
