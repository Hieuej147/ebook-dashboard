// app/actions/auth.ts
"use server";

import { createSession, deleteSession, getSession } from "@/lib/session";
import { decodeJwtExpiry } from "@/lib/token";
import { FormState } from "@/lib/types";
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
    // ✅ Decode từ token thực thay vì hardcode
    const atExpiresAt =
      decodeJwtExpiry(result.accessToken) ?? Date.now() + 15 * 60 * 1000;

    const sessionExpiresAt =
      decodeJwtExpiry(result.refreshToken) ??
      Date.now() + 7 * 24 * 60 * 60 * 1000;

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
      atExpiresAt, // ✅ chính xác từ token
      sessionExpiresAt, // ✅ chính xác từ token
    });

    redirect("/dashboard");
  } else {
    return {
      message: result.message?.message || result.message || "Login failed",
    };
  }
}

// const globalRef = global as unknown as {
//   refreshPromise: Promise<string | null> | null;
// };
// export const refreshToken = async (oldRefreshToken: string) => {
//   if (globalRef.refreshPromise) {
//     console.log("⏳ Dùng chung Promise refresh đang chạy...");
//     return globalRef.refreshPromise;
//   }
//   globalRef.refreshPromise = (async () => {
//     try {
//       const response = await fetch(
//         `${process.env.NESTJS_API_URL}/auth/refresh`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${oldRefreshToken}`,
//           },
//         },
//       );

//       if (!response.ok) {
//         return null;
//       }

//       const { accessToken, refreshToken } = await response.json();
//       // update session with new tokens
//       const updateRes = await fetch(
//         `${process.env.NESTJS_API_URL_PUBLIC}/api/auth/update`,
//         {
//           method: "POST",
//           body: JSON.stringify({
//             accessToken,
//             refreshToken,
//           }),
//         },
//       );

//       if (updateRes.ok) {
//         console.log("updated success");
//       } else {
//         console.log("updated Failed");
//       }
//       return accessToken;
//     } catch (err) {
//       console.error("❌ Refresh Token failed:", err);
//       return null;
//     } finally {
//       globalRef.refreshPromise = null;
//     }
//   })();
//   return globalRef.refreshPromise;
// };
export async function logoutAction() {
  const session = await getSession();

  // ✅ Gọi NestJS logout để xóa refreshToken trong DB
  if (session?.accessToken) {
    try {
      await fetch(`${process.env.NESTJS_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("NestJS logout failed:", error);
      // ✅ Dù NestJS lỗi vẫn xóa session FE
    }
  }

  await deleteSession();
  redirect("/signin");
}
