import { fetchWithAuth } from "@/lib/dal";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  setTimeout(() => {}, 800);
  const { id } = await params;

  const res = await fetchWithAuth(`/books/${id}`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
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
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    // 1. Xác định loại body (Dựa trên Content-Type từ Client gửi lên)
    const contentType = request.headers.get("content-type") || "";

    // Nếu là multipart (có ảnh), lấy .formData(), nếu không thì lấy .json()
    const body = contentType.includes("multipart/form-data")
      ? await request.formData()
      : await request.json();

    // 2. Gửi sang NestJS qua fetchWithAuth
    // Hàm này giờ đã tự biết:
    // - Nếu body là FormData -> Xóa Content-Type để trình duyệt tự tạo boundary.
    // - Nếu body là Object -> Tự thêm Content-Type: application/json.
    const response = await fetchWithAuth(`/books/${id}`, {
      method: "PATCH",
      body: body,
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Lỗi khi lấy danh sách Category" },
        { status: response.status },
      );
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// export async function DELETE(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   const { id } = await params;
//   try {
//     const response = await fetchWithAuth(`/books/${id}`, {
//       headers: { "Content-Type": "application/json" },
//       method: "DELETE",
//     });
//   }
// }
