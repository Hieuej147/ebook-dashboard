// app/api/category/route.ts
import axiosServer from "@/lib/axios-server";
import { handleApiError } from "@/lib/api-error";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/with-auth";
import { createCategoryApiSchema } from "@/lib/zod";

export const POST = withAuth(async (req) => {
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
    const res = await axiosServer.post("/category", result.data);
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Không thể tạo danh mục mới");
  }
});
