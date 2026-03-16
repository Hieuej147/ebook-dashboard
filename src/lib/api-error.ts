// lib/api-error.ts
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { NextResponse } from "next/server";

export function handleApiError(
  error: any,
  defaultMessage: string = "Đã có lỗi xảy ra",
) {
  if (isRedirectError(error)) throw error;

  if (process.env.NODE_ENV === "development") {
    console.error("API Error Log:", error.response?.data || error.message);
  }

  const status = error.response?.status || 500;
  const message = error.response?.data?.message || defaultMessage;

  return NextResponse.json({ message }, { status });
}
