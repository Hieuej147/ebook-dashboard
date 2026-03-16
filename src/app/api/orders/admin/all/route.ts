// app/api/orders/admin/all/route.ts
import { NextRequest, NextResponse } from "next/server";
import axiosServer from "@/lib/axios-server";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "5";
  const status = req.nextUrl.searchParams.get("status") || "";
  const search = req.nextUrl.searchParams.get("search") || "";

  const res = await axiosServer.get("/orders/admin/all", {
    params: {
      page: Number(page),
      limit: Number(limit),
      ...(status && { status }),
      ...(search && { search }),
    },
  });

  return NextResponse.json(res.data);
}
