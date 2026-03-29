// app/api/users/[id]/route.ts
import axiosServer from "@/lib/axios-server";
import { handleApiError } from "@/lib/api-error";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/with-auth";
import { updateUserApiSchema } from "@/lib/zod";

export const GET = withAuth(async (_req, { params }) => {
  const { id } = await params;
  try {
    const res = await axiosServer.get(`/users/${id}`);
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Không thể lấy thông tin người dùng");
  }
});

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params;
  try {
    const body = await req.json();
    const result = updateUserApiSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const res = await axiosServer.patch(`/users/${id}`, result.data);
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Cập nhật người dùng thất bại");
  }
});

export const DELETE = withAuth(async (_req, { params }) => {
  const { id } = await params;
  try {
    const res = await axiosServer.delete(`/users/${id}`);
    return NextResponse.json(res.data || { message: "Xóa thành công" });
  } catch (error) {
    return handleApiError(error, "Xóa người dùng thất bại");
  }
});
