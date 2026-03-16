// app/api/books/[id]/route.ts
import axiosServer from "@/lib/axios-server";
import { handleApiError } from "@/lib/api-error"; // Import helper của Hiếu
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  try {
    const res = await axiosServer.get(`/books/${id}`);
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Không thể lấy thông tin sách");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // ✅ Dùng fetch thay vì axiosServer cho FormData
      // Axios có bug với multipart/form-data boundary
      const body = await request.formData();

      const res = await fetch(`${process.env.NESTJS_API_URL}/books/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          // ❌ Không set Content-Type — fetch tự set boundary đúng
        },
        body,
      });

      const data = await res.json();
      if (!res.ok) throw { response: { status: res.status, data } };
      return NextResponse.json(data);
    }

    // JSON thì dùng axiosServer bình thường
    const body = await request.json();
    const res = await axiosServer.patch(`/books/${id}`, body);
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Cập nhật sách thất bại");
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  try {
    const res = await axiosServer.delete(`/books/${id}`);
    // Trả về data từ NestJS (thường là msg thành công hoặc object vừa xóa)
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Xóa sách không thành công");
  }
}
