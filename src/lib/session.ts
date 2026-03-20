"use server";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { CustomerType, Role } from "./types";

export type Session = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    role: Role;
    customerType: CustomerType;
  };
  accessToken: string;
  refreshToken: string;
  atExpiresAt: number; // [QUAN TRỌNG] Timestamp hết hạn của Access Token
  sessionExpiresAt: number;
};

const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);

// Hàm mã hóa Payload thành chuỗi JWT (Dùng cho cả Middleware và Session Action)
export async function encrypt(payload: Session) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Session tổng 7 ngày
    .sign(encodedKey);
}

export async function createSession(payload: Session) {
  const session = await encrypt(payload);
  const cookieStore = await cookies();

  // ExpiredAt của Cookie trình duyệt (7 ngày)
  const absoluteExpiresAt =
    payload.sessionExpiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000;
  const isProd = process.env.NODE_ENV === "production";
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: isProd,
    expires: new Date(absoluteExpiresAt),
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as Session;
  } catch (err) {
    return null;
  }
}

// Cập nhật Token (Dùng trong DAL hoặc Action)
export async function updateTokens({
  accessToken,
  refreshToken,
  atExpiresAt, // Cần truyền thời hạn mới vào đây
}: {
  accessToken: string;
  refreshToken: string;
  atExpiresAt: number;
}) {
  const session = await getSession();
  if (!session) return null;

  const newPayload: Session = {
    ...session,
    accessToken,
    refreshToken,
    atExpiresAt,
  };

  await createSession(newPayload);
}
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
