// app/api/books/[id]/route.ts
import axiosServer from "@/lib/axios-server";
import { handleApiError } from "@/lib/api-error";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { withAuth } from "@/lib/with-auth";

export const GET = withAuth(async (_req, { params }) => {
  const { id } = await params;
  try {
    const res = await axiosServer.get(`/books/${id}`);
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Không thể lấy thông tin sách");
  }
});

export const PATCH = withAuth(async (request, { params }, session) => {
  const { id } = await params;
  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      // FormData: dùng fetch vì axios có bug với multipart boundary
      const body = await request.formData();
      const res = await fetch(`${process.env.NESTJS_API_URL}/books/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session!.accessToken}`,
        },
        body,
      });
      const data = await res.json();
      if (!res.ok) throw { response: { status: res.status, data } };
      return NextResponse.json(data);
    }

    const body = await request.json();
    const res = await axiosServer.patch(`/books/${id}`, body);
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Cập nhật sách thất bại");
  }
});

export const DELETE = withAuth(async (_req, { params }) => {
  const { id } = await params;
  try {
    const res = await axiosServer.delete(`/books/${id}`);
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Xóa sách không thành công");
  }
});
