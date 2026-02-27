import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Route Handler cho phép xóa session hợp lệ
  await deleteSession();
  
  // Sau khi xóa xong, chuyển hướng về trang signin
  redirect("/signin");
}