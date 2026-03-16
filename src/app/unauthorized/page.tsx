// src/app/unauthorized/page.tsx
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8 border rounded-2xl shadow-lg max-w-md">
        <div className="text-6xl">🔒</div>
        <h1 className="text-2xl font-bold text-destructive">
          Truy cập bị từ chối
        </h1>
        <p className="text-muted-foreground">
          Bạn không có quyền truy cập trang này. Chỉ Admin mới được phép vào
          Dashboard.
        </p>
        {/* ✅ Tự động xóa session khi render */}
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Đăng nhập tài khoản khác
          </button>
        </form>
      </div>
    </div>
  );
}
