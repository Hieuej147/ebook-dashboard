import { fetchWithAuth } from "@/lib/dal";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();

  // Gọi sang route mới tạo ở NestJS
  const response = await fetchWithAuth(
    `orders/admin/user/${userId}?${queryString}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();
  return NextResponse.json(data);
}
