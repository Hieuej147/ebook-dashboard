import { fetchWithAuth } from "@/lib/dal";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const res = await fetchWithAuth(`/chapters/by-book/${id}`, {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Lấy ID từ URL (Next.js 15 yêu cầu await params)
    const { id } = await params;
    const body = await req.json();

    // 2. Chuyển tiếp request sang NestJS endpoint: PATCH /chapters/{id}
    const res = await fetchWithAuth(`/chapters/${id}`, {
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // 3. Trả về lỗi nếu backend NestJS báo lỗi
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("PATCH Chapter Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
