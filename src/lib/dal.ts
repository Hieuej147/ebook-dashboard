"use server";
import axiosServer from "./axios-server";

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

  const res = await axiosServer.get("/books/admin/all", { params });
  return res.data;
};

export const getAllOrders = async (params: {
  page: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  const res = await axiosServer.get("/orders/admin/all", { params });
  return res.data;
};
export const getAllcategories = async (params: {
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await axiosServer.get("/category", { params });
  return res.data;
};
// lib/dal.ts

export const getCategoriesList = async () => {
  const res = await axiosServer.get("/category/all/list");
  return res.data;
};
