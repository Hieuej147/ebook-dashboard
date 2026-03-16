import axiosServer from "@/lib/axios-server";
import { handleApiError } from "@/lib/api-error";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createChaptersApiSchema } from "@/lib/zod";

export async function POST(req: Request) {
  // ✅ Auth check
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // ✅ Validate
    const result = createChaptersApiSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const res = await axiosServer.post("/chapters", result.data);
    return NextResponse.json(res.data);
  } catch (error) {
    return handleApiError(error, "Không thể tạo chương mới");
  }
}
