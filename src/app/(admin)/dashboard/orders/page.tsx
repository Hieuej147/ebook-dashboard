"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  MoreVertical,
  Package,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderTableCell } from "@/components/OrderTableCell";
import { getAllOrders } from "@/lib/dal";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
// Component màu sắc trạng thái dựa trên OrderStatus của Prisma
const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    SHIPPED: "bg-blue-100 text-blue-700 border-blue-200",
    DELIVERED: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <Badge variant="outline" className={`${styles[status] || ""} font-bold`}>
      {status}
    </Badge>
  );
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    search: "", // Thêm search vào đây để khớp với QueryOrderDto
  });
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data từ route @Get('admin/all')
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Gọi hàm getAllOrders từ dal.ts với đầy đủ filters
      const response = await getAllOrders(filters);

      setOrders(response.data);

      setMeta({
        total: response.total,
        page: response.page,
        limit: response.limit,
      });
    } catch (error) {
      console.error("Lỗi fetch API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }
  };
  const totalPages = Math.ceil(meta.total / meta.limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.total) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const { page, total } = meta;

    for (let i = 1; i <= totalPages; i++) {
      // Hiển thị trang đầu, trang cuối, và các trang lân cận trang hiện tại
      if (i === 1 || i === total || (i >= page - 1 && i <= page + 1)) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={page === i}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      } else if (i === page - 2 || i === page + 2) {
        items.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }
    return items;
  };

  return (
    <div className="space-y-6 bg-primary-foreground min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Order Tracking
          </h1>
          <p className="text-slate-500 text-sm">
            Track and update the status of customer orders.
          </p>
        </div>

        {/* Bộ lọc nhanh */}
        <div className="flex gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Find Order..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Select
            onValueChange={(v) =>
              setFilters({ ...filters, status: v, page: 1 })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">ALL</SelectItem>
              <SelectItem value="PENDING">Waiting</SelectItem>
              <SelectItem value="SHIPPED">Shipping</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white border rounded-sm shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold w-[100px]">OrderID</TableHead>
              <TableHead className="font-bold">Khách hàng</TableHead>
              <TableHead className="font-bold">Sản phẩm</TableHead>
              <TableHead className="font-bold text-right">Tổng tiền</TableHead>
              <TableHead className="font-bold">Trạng thái</TableHead>
              <TableHead className="font-bold">Ngày đặt</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-20">
                  Đang tải đơn hàng...
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: any) => (
                <OrderTableCell
                  key={order.id}
                  order={order}
                  onRefresh={fetchOrders} // Truyền hàm fetch vào để TableCell gọi lại sau khi update
                />
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex justify-center border-t border p-4 bg-white">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(meta.page - 1);
                  }}
                  className={
                    meta.page <= 1
                      ? "pointer-events-none opacity-40"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(meta.page + 1);
                  }}
                  className={
                    meta.page >= totalPages // Sửa lại chỗ này cho đúng logic meta.total
                      ? "pointer-events-none opacity-40"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
