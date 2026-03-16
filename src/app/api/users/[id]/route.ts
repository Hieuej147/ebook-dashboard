import axiosServer from "@/lib/axios-server";
import { handleApiError } from "@/lib/api-error";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { updateUserApiSchema } from "@/lib/zod";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const res = await axiosServer.get(`/users/${id}`);
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Không thể lấy thông tin người dùng");
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
    const body = await request.json();

    // ✅ Validate
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
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const res = await axiosServer.delete(`/users/${id}`);
    return NextResponse.json(res.data || { message: "Xóa thành công" });
  } catch (error) {
    return handleApiError(error, "Xóa người dùng thất bại");
  }
}
