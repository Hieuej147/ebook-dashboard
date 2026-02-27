import { fetchWithAuth } from "@/lib/dal";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();

  const response = await fetchWithAuth(`/orders/admin/all?${queryString}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json(
      { message: data.message || "Error when take orders" },
      { status: response.status },
    );
  }
  return NextResponse.json(data);
}
