"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns"; // Hiếu nên cài date-fns để format ngày cho đẹp
import {
  Search,
  Eye,
  MoreVertical,
  Package,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
// import { OrderActions } from "./OrderActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { toast } from "sonner";
interface OrderRowProps {
  order: any; // Sau này Hiếu thay bằng Type OrderResponseDto nhé
  onRefresh: () => void;
  onViewDetail: (order: any) => void; // Thêm prop này
}

export const OrderTableCell = ({
  order,
  onRefresh,
  onViewDetail,
}: OrderRowProps) => {
  // Lấy danh sách tên sách để hiển thị tóm tắt
  const mainItem = order.items[0]?.bookTitle || "N/A";
  const extraItemsCount = order.items.length - 1;

  // const handleUpdateStatus = async (newStatus: string) => {
  //   try {
  //     await updateOrderStatus(order.id, newStatus);
  //     toast.success(`Đã cập nhật đơn hàng sang ${newStatus}`);
  //     onRefresh(); // Tải lại danh sách
  //   } catch (error) {
  //     toast.error("Không thể cập nhật trạng thái");
  //   }
  // };
  const statusStyles: any = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    SHIPPED: "bg-blue-100 text-blue-700 border-blue-200",
    DELIVERED: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
  };
  console.log("This is Orders Data: ", order);
  return (
    <TableRow className="group">
      <TableCell className="font-mono text-[10px] text-purple-600">
        {order.orderNumber}
        {/* Chỉ hiện 6 ký tự cuối cho gọn */}
      </TableCell>

      <TableCell>
        <div className="flex flex-col">
          {/* Nếu backend chưa trả userName, ta dùng userId tạm */}
          <span className="font-bold text-slate-900">
            {order.userName || `User: ${order.userId.slice(0, 8)}`}
          </span>
          <span className="text-xs text-slate-500">
            {order.userEmail || "No email available"}
          </span>
        </div>
      </TableCell>

      <TableCell className="max-w-[200px] truncate">
        <span className="text-sm">
          {mainItem} {extraItemsCount > 0 && `+ ${extraItemsCount} items`}
        </span>
      </TableCell>

      <TableCell className="text-right font-black">
        {order.total.toLocaleString("vi-VN")} đ {/* Format tiền Việt */}
      </TableCell>

      <TableCell>
        <Badge
          variant="outline"
          className={`font-bold ${statusStyles[order.status]}`}
        >
          {order.status}
        </Badge>
      </TableCell>
      <TableCell className="text-slate-500 text-xs">
        {format(new Date(order.createdAt), "dd/MM/yyyy")} {/* */}
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              className="gap-2"
              onClick={() => onViewDetail(order)}
            >
              <Eye size={14} /> Xem chi tiết đơn
            </DropdownMenuItem>

            {/* Logic hiển thị các bước tiếp theo */}
            {order.status === "PENDING" && (
              <DropdownMenuItem
                // onClick={() => handleUpdateStatus("SHIPPED")}
                className="gap-2 text-blue-600 font-medium"
              >
                <Truck size={14} /> Bắt đầu giao hàng
              </DropdownMenuItem>
            )}

            {order.status === "SHIPPED" && (
              <DropdownMenuItem
                // onClick={() => handleUpdateStatus("DELIVERED")}
                className="gap-2 text-green-600 font-medium"
              >
                <CheckCircle size={14} /> Xác nhận đã giao
              </DropdownMenuItem>
            )}

            {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
              <DropdownMenuItem
                // onClick={() => handleUpdateStatus("CANCELLED")}
                className="gap-2 text-red-600"
              >
                <XCircle size={14} /> Hủy đơn hàng
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
