// app/api/chapters/[id]/route.ts
import axiosServer from "@/lib/axios-server";
import { handleApiError } from "@/lib/api-error";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/with-auth";
import { updateChapterApiSchema } from "@/lib/zod";

export const GET = withAuth(async (_req, { params }) => {
  const { id } = await params;
  try {
    const res = await axiosServer.get(`/chapters/by-book/${id}`);
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Không thể lấy danh sách chương");
  }
});

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params;
  try {
    const body = await req.json();
    const result = updateChapterApiSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const res = await axiosServer.patch(`/chapters/${id}`, result.data);
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Cập nhật chương thất bại");
  }
});
