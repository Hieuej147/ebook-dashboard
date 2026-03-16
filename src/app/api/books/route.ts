// app/api/books/route.ts
import axiosServer from "@/lib/axios-server";
import { handleApiError } from "@/lib/api-error";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createBookApiSchema } from "@/lib/zod";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = createBookApiSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // 1. Không cần JSON.stringify
    // 2. Không cần headers thủ công
    // 3. Không cần check res.ok
    const res = await axiosServer.post("/books", body);

    return NextResponse.json(res.data);
  } catch (error) {
    // Dùng luôn helper "thần thánh" của Hiếu
    return handleApiError(error, "Không thể tạo sách mới");
  }
}
