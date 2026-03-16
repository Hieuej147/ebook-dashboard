// app/api/chapters/[id]/route.ts
import axiosServer from "@/lib/axios-server";
import { handleApiError } from "@/lib/api-error";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { updateChapterApiSchema } from "@/lib/zod";

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
    // Axios tự parse JSON, Hiếu chỉ việc lấy .data
    // Lưu ý: Endpoint là /chapters/by-book/${id} như Hiếu viết cũ
    const res = await axiosServer.get(`/chapters/by-book/${id}`);

    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Không thể lấy danh sách chương");
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
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

    // Axios tự đính Token và tự JSON.stringify body

    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Cập nhật chương thất bại");
  }
}
