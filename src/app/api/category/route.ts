import axiosServer from "@/lib/axios-server";
import { handleApiError } from "@/lib/api-error";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createCategoryApiSchema } from "@/lib/zod";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const result = createCategoryApiSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // ✅ dùng result.data thay vì body
    const res = await axiosServer.post("/category", result.data);
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Không thể tạo danh mục mới");
  }
}
