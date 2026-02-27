// app/api/category/list/route.ts
import { fetchWithAuth } from "@/lib/dal";
import { NextResponse } from "next/server";

export async function GET() {
  // Gọi thẳng đến endpoint "all/list" mà mình vừa tạo ở NestJS
  const response = await fetchWithAuth("/category/all/list", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { message: data.message || "Lỗi khi lấy danh sách rút gọn" },
      { status: response.status }
    );
  }

  return NextResponse.json(data);
}