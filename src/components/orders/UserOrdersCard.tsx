"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, CalendarIcon, ChevronLeft, Eye } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import OrderDetailCard from "./OrderItemCard";

interface UserOrdersCardProps {
  userId: string;
}

const UserOrdersCard = ({ userId }: UserOrdersCardProps) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      const params = new URLSearchParams({ page: "1", limit: "10" });
      try {
        const res = await fetch(
          `/api/orders/user/${userId}?${params.toString()}`,
        );
        const result = await res.json();

        // Bóc tách data thật từ cái bọc của NestJS
        const cleanOrders =
          result.data?.map((wrapper: any) => wrapper.data) || [];
        setOrders(cleanOrders);
      } catch (error) {
        console.error("Lỗi fetch đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUserOrders();
  }, [userId]);

  // Tối ưu: Gán thẳng object order đã có items vào state
  const handleViewDetail = (order: any) => {
    setSelectedOrder(order);
  };

  if (selectedOrder) {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedOrder(null)}
          className="hover:bg-purple-50 text-purple-600 gap-2 font-bold"
        >
          <ChevronLeft size={16} /> Quay lại danh sách
        </Button>
        <OrderDetailCard order={selectedOrder} />
      </div>
    );
  }

  return (
    <div className="border shadow-sm p-4 rounded-2xl bg-primary-foreground h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold flex items-center gap-2 text-muted-foreground">
          <ShoppingBag size={20} className="text-purple-600" />
          Order History
        </h1>
        <Badge
          variant="secondary"
          className="rounded-full bg-slate-100 text-slate-600"
        >
          {orders.length} orders
        </Badge>
      </div>

      <ScrollArea className="h-[450px] pr-4">
        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-center text-sm text-slate-400 py-10 italic animate-pulse">
              Đang tải dữ liệu...
            </p>
          ) : orders.length > 0 ? (
            orders.map((order: any) => (
              <Card
                key={order.id}
                className="p-3 hover:bg-muted/40 transition-all group border-border cursor-pointer hover:border-purple-400/50"
                onClick={() => handleViewDetail(order)} // TRUYỀN CẢ OBJECT VÀO ĐÂY
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-purple-600 uppercase tracking-tighter">
                        {order.orderNumber}
                      </span>
                      <Badge className="text-[9px] h-4 px-1.5 bg-purple-100 text-purple-700 border-none font-bold">
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-black text-shadow-muted-foreground">
                      {order.total?.toLocaleString("vi-VN")}đ
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                      <CalendarIcon size={10} />
                      {format(new Date(order.createdAt), "dd/MM/yyyy")}
                    </div>
                  </div>
                  <div className="bg-muted size-8 rounded-full flex items-center justify-center border border-border">
                    <Eye size={14} className="text-purple-600" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 italic text-sm">
              User chưa có đơn hàng nào.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserOrdersCard;
