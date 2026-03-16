import axios from "axios";
import { getSession } from "./session";
import { redirect } from "next/navigation";

const axiosServer = axios.create({
  baseURL: process.env.NESTJS_API_URL,
  headers: { "Content-Type": "application/json" },
});

// REQUEST: Tự động đính kèm Token từ Session Cookie
axiosServer.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// RESPONSE: Xử lý lỗi 401 tập trung
axiosServer.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      redirect("/signin");
    }
    return Promise.reject(error);
  }
);

export default axiosServer;