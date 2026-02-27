import { fetchWithAuth } from "@/lib/dal";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const queryString = searchParams.toString();
  // Next.js gọi NestJS giúp bạn
  const response = await fetchWithAuth(
    `/category${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );
  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json(
      { message: data.message || "Lỗi khi lấy danh sách Category" },
      { status: response.status },
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetchWithAuth("/books", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { message: data.message || "Error to take all books" },
      { status: res.status },
    );
  }
  return NextResponse.json(data);
}
