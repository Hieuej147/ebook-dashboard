// app/api/export/[id]/[format]/route.ts
import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/lib/axios-server";
import { withAuth } from "@/lib/with-auth";
import { handleApiError } from "@/lib/api-error";

export const GET = withAuth(
  async (
    request: NextRequest, // Phải dùng NextRequest để khớp với withAuth
    { params }: { params: Promise<{ id: string; format: string }> },
    session, // Session được withAuth tự động truyền vào đây
  ) => {
    try {
      const { id, format } = await params;

      const response = await axiosServer.get(`/export-doc/${id}/${format}`, {
        responseType: "arraybuffer",
      });

      const contentType = response.headers["content-type"];
      const contentDisposition = response.headers["content-disposition"];

      return new NextResponse(response.data, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": contentDisposition,
        },
      });
    } catch (error) {
      return handleApiError(error, "Could not export!");
    }
  },
);
