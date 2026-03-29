// lib/api-fetch.ts
import { toast } from "sonner";

export async function apiFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, init);

  if (res.status === 401) {
    toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
    await new Promise((r) => setTimeout(r, 1000));
    window.location.href = "/signin";
    throw new Error("UNAUTHORIZED");
  }

  return res;
}