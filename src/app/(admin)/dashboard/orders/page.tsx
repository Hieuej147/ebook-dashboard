// app/dashboard/orders/page.tsx
import OrdersDashboardClient from "@/components/orders/OrdersDashboardClient";
import { getAllOrders } from "@/lib/dal";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // Chuẩn hóa bộ lọc từ URL
  const filters = {
    page: Number(params.page) || 1,
    limit: 12,
    status: (params.status as string) || "",
    search: (params.search as string) || "",
  };

  // Fetch dữ liệu trên Server
  const ordersData = await getAllOrders(filters);

  return (
    <OrdersDashboardClient
      initialOrders={ordersData.data || []}
      initialMeta={{
        total: ordersData.total,
        page: ordersData.page,
        limit: ordersData.limit,
        totalPages: Math.ceil(ordersData.total / ordersData.limit),
      }}
      currentFilters={filters}
    />
  );
}
