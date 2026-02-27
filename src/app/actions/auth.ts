// app/actions/auth.ts
"use server";

import { createSession, deleteSession } from "@/lib/session";
import { FormState } from "@/lib/type";
import { loginSchema, signupSchema } from "@/lib/zod";
import { redirect } from "next/navigation";

export async function signupAction(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validation = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validation.success) {
    return {
      error: validation.error.flatten().fieldErrors,
    };
  }
  const { confirmPassword, ...dataTosend } = validation.data;
  // Kiểm tra khớp mật khẩu cơ bản tại server
  if (dataTosend.password !== confirmPassword) {
    return { message: "The verification password does not match." };
  }

  // 2. Gọi API NestJS
  const response = await fetch(`${process.env.NESTJS_API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataTosend),
  });

  const data = await response.json();

  // 3. Xử lý lỗi từ NestJS
  if (response.ok) {
    redirect("/signin");
  } else {
    return {
      message: response.status === 400 ? data.message : response.statusText,
    };
  }
}
// app/actions/auth.ts
export async function signinAction(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validation = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  const response = await fetch(`${process.env.NESTJS_API_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validation.data),
  });

  const result = await response.json(); // Đọc 1 lần duy nhất ở đây
  const userData = result.user;

  if (response.ok) {
    // result lúc này đã chứa id, name, role, accessToken... từ NestJS
    await createSession({
      user: {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        customerType: userData.customerType,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    redirect("/dashboard");
  } else {
    // Xử lý thông báo lỗi từ NestJS trả về (thường là result.message)
    return {
      message: result.message?.message || result.message || "Login failed",
    };
  }
}

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const refreshToken = async (oldRefreshToken: string) => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(
        `${process.env.NESTJS_API_URL}/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oldRefreshToken}`,
          },
        },
      );

      if (!response.ok) {
        return null;
      }

      const { accessToken, refreshToken } = await response.json();
      // update session with new tokens
      const updateRes = await fetch(
        `${process.env.NESTJS_API_URL_PUBLIC}/api/auth/update`,
        {
          method: "POST",
          body: JSON.stringify({
            accessToken,
            refreshToken,
          }),
        },
      );

      if (!updateRes.ok) throw new Error("Failed to update the tokens");

      return accessToken;
    } catch (err) {
      console.error("Refresh Token failed:", err);
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();
  return refreshPromise;
};
export async function logoutAction() {
  await deleteSession();

  // Đá về trang chủ hoặc trang login
  redirect("/signin");
}
