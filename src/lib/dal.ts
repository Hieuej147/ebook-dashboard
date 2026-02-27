// lib/dal.ts
import { refreshToken } from "@/app/actions/auth";
import { deleteSession, getSession, updateTokens } from "@/lib/session";
import { redirect } from "next/navigation";

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}
export async function fetchWithAuth(url: string, options: FetchOptions = {}) {
  const session = await getSession();
  if (!session) redirect("/signin");
  let shouldRedirect = false;

  const fullUrl = `${process.env.NESTJS_API_URL}/${url.replace(/^\//, "")}`;

  // Thiết lập Headers ban đầu
  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
    ...options.headers, // Ưu tiên các headers truyền từ ngoài vào
  };

  // 2. CHỈ thêm Content-Type: application/json nếu body là Object thường (không phải FormData)
  if (options.body && !(options.body instanceof FormData)) {
    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
  }

  // NẾU là FormData, ta PHẢI để trình duyệt tự set Content-Type (không được có header Content-Type nào)
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  options.headers = headers;

  let response = await fetch(fullUrl, options);

  // XỬ LÝ KHI HẾT HẠN (401)
  if (response.status === 401) {
    console.log("401 Detected! Checking for concurrent refresh...");
    // BƯỚC QUAN TRỌNG: Đọc lại session mới nhất từ Cookie
    // Vì cookie store là server-side, nó phản ánh đúng trạng thái mới nhất
    const latestSession = await getSession();
    // KIỂM TRA: Nếu accessToken trong Cookie đã khác cái mình vừa dùng
    // Nghĩa là: Thằng khác đã refresh thành công rồi!
    if (latestSession && latestSession.accessToken !== session.accessToken) {
      console.log(
        "Another request refreshed the token. Retrying with new token...",
      );
      options.headers.Authorization = `Bearer ${latestSession.accessToken}`;
      return await fetch(fullUrl, options); // Gọi lại lần 2 ngay lập tức
    }
    // Nếu vẫn là token cũ, lúc này ta mới thực sự là "người đi đầu" để refresh
    try {
      if (session.refreshToken) {
        console.log("Performing actual refresh...");
        const newAccessToken = await refreshToken(session.refreshToken);

        if (newAccessToken) {
          // 2. Nếu thành công, thử gọi lại API lần 2 với token mới
          options.headers.Authorization = `Bearer ${newAccessToken}`;
          // const retryResponse = await fetch(fullUrl, options);

          // if (retryResponse.ok) return retryResponse; // Trả về kết quả nếu lần 2 thành công
        }
      }
    } catch (error: any) {
      // Kiểm tra nếu lỗi này chính là lệnh redirect thì ném nó đi tiếp
      // if (error.message === "NEXT_REDIRECT") throw error;
      // console.error("Refresh token failed:", error);
      // throw error;
      console.error("Critical Refresh Error:", error);
    }
    redirect("/api/auth/logout");
  }

  return response;
}

// lib/dal.ts

export const getAdminBooks = async (params: {
  isActive?: boolean;
  search?: string;
  category?: string; // Đây chính là UUID gửi lên NestJS
  page?: number;
  limit?: number;
}) => {
  const query = new URLSearchParams({
    page: params.page?.toString() || "1",
    limit: params.limit?.toString() || "10",
  });

  // 1. Thêm Search nếu có
  if (params.search) query.append("search", params.search);

  // 2. Thêm Category UUID nếu có
  if (params.category) query.append("category", params.category);

  // 3. QUAN TRỌNG: Thêm isActive (phải chuyển boolean thành string)
  if (params.isActive !== undefined) {
    query.append("isActive", params.isActive.toString());
  }

  // Gọi tới Route Handler của Next.js (Proxy)
  const res = await fetch(`/api/books?${query.toString()}`);

  if (!res.ok) throw new Error("Failed to fetch through proxy");

  return res.json();
};

// Hoàn thiện hàm lấy chi tiết sách
export const getBookById = async (id: string) => {
  const res = await fetch(`/api/books/${id}`);
  if (!res.ok) return null;
  return res.json();
};
export const getAllOrders = async (params: {
  page: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  const query = new URLSearchParams({
    page: params.page.toString() || "1",
    limit: params.limit?.toString() || "10",
  });

  if (params.status !== undefined) query.append("status", params.status);
  if (params.search) query.append("search", params.search);

  const res = await fetch(`/api/orders?${query.toString()}`);

  if (!res.ok) throw new Error("Failed to fetch through proxy");

  return res.json();
};
