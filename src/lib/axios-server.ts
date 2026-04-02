// lib/axios-server.ts
import axios, { AxiosError } from "axios";
import { getSession } from "./session";
import { redirect } from "next/navigation";

export class UnauthorizedError extends Error {
  constructor() {
    super("UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

const axiosServer = axios.create({
  baseURL: process.env.NESTJS_API_URL,
  headers: { "Content-Type": "application/json" },
});

// REQUEST: Gắn access token từ session
axiosServer.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// RESPONSE: Bắt lỗi tập trung
axiosServer.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token bị revoke (user bị xóa, token invalid,...)
      // Throw UnauthorizedError để Route Handler bắt
      throw new UnauthorizedError();
    }
    return Promise.reject(error);
  },
);

export default axiosServer;
