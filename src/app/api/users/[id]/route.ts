import { fetchWithAuth } from "@/lib/dal";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const response = await fetchWithAuth(`/users/${id}`, {
    method: "GET",
    cache: "no-cache",
  });
  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json(
      { message: data.message || "Error to take all books" },
      { status: response.status },
    );
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const response = await fetchWithAuth(`/users/${id}`, {
    headers: { "Content-Type": "application/json" },
    method: "PATCH",
    body: JSON.stringify(body),
  });

  const data = await response.json();
  console.log("Dữ liệu NestJS trả về sau PATCH:", data); // <--- Soi kỹ ở đây

  if (!response.ok) {
    return NextResponse.json(
      { message: data.message || "Error to take all books" },
      { status: response.status },
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const response = await fetchWithAuth(`/users/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Delete Failed" },
      { status: response.status },
    );
  }

  return NextResponse.json({ message: "Delete success" });
}
