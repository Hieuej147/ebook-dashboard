"use client";

import { useState, useTransition, useCallback } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderTableCell } from "@/components/orders/OrderTableCell";
// Component màu sắc trạng thái dựa trên OrderStatus của Prisma
import { OrderDetailDialog } from "@/components/orders/OrderDetailDialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useOrderFiltersTool } from "../action-ai/useOrderFiltersTool";
import { OrderStatusFilter, SearchBar } from "../SearchBar";
import { CustomPagination } from "../CustomPagination";
export default function OrdersDashboardClient({
  initialOrders,
  initialMeta,
  currentFilters,
}: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(currentFilters.search);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Hàm Proxy URL
  const updateQuery = useCallback(
    (newParams: Record<string, any>) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
          if (value && value !== "ALL" && value !== "")
            params.set(key, value.toString());
          else params.delete(key);
        });
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams],
  );
  useOrderFiltersTool((filters) => {
    // Cập nhật lại state ô input để đồng bộ giao diện
    if (filters.search !== undefined) {
      setSearchTerm(filters.search);
    }

    // Gọi hàm lõi để đẩy URL và trigger fetch data
    updateQuery({
      search: filters.search,
      status: filters.status,
      page: filters.page,
    });
  });

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Order Tracking</h1>
          <p className="text-muted-foreground text-sm">
            Quản lý và cập nhật trạng thái vận đơn.
          </p>
        </div>

        <div className="flex gap-3">
          <SearchBar
            defaultValue={currentFilters.search || ""}
            onSearchSubmit={(val: any) => updateQuery({ search: val, page: 1 })}
          />
          <OrderStatusFilter
            currentValue={currentFilters.status}
            onStatusChange={(val) => updateQuery({ status: val, page: 1 })}
          />
        </div>
      </div>

      <div
        className={cn(
          "bg-primary-foreground border rounded-xl overflow-hidden shadow-sm",
          isPending && "opacity-60",
        )}
      >
        <Table>
          <TableHeader className="bg-primary-foreground">
            <TableRow>
              <TableHead className="font-bold">Mã đơn</TableHead>
              <TableHead className="font-bold">Khách hàng</TableHead>
              <TableHead className="font-bold">Sản phẩm</TableHead>
              <TableHead className="font-bold text-right">Tổng tiền</TableHead>
              <TableHead className="font-bold">Trạng thái</TableHead>
              <TableHead className="font-bold text-center">Ngày đặt</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialOrders.map((order: any) => (
              <OrderTableCell
                key={order.id}
                order={order}
                onViewDetail={(data) => {
                  setSelectedOrder(data);
                  setIsOpen(true);
                }}
                onRefresh={() => router.refresh()}
              />
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t">
          <CustomPagination
            meta={initialMeta}
            onPageChange={(p) => updateQuery({ page: p })}
          />
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailDialog
          order={selectedOrder}
          open={isOpen}
          onOpenChange={setIsOpen}
        />
      )}
    </div>
  );
}
