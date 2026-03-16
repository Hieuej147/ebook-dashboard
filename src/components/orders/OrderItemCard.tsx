"use client";
import { Badge } from "@/components/ui/badge";
import { CreditCard, MapPin, Package, Hash, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const STATUS_STYLES: Record<string, string> = {
  DELIVERED:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PENDING:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  PROCESSING:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const OrderDetailCard = ({ order }: { order: any }) => {
  if (!order) return null;

  return (
    <div className="bg-primary-foreground rounded-2xl border border-border p-5 space-y-5 animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex justify-between items-start pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-purple-500" />
            <span className="font-black text-base text-foreground">
              {order.orderNumber}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Hash size={10} />
            <span className="font-mono">{order.id?.slice(0, 16)}...</span>
          </div>
          {order.createdAt && (
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Clock size={10} />
              <span>
                {format(new Date(order.createdAt), "dd/MM/yyyy — HH:mm")}
              </span>
            </div>
          )}
        </div>
        <Badge
          className={`text-xs font-bold px-3 py-1 border-none ${STATUS_STYLES[order.status] ?? "bg-muted text-muted-foreground"}`}
        >
          {order.status}
        </Badge>
      </div>

      {/* Địa chỉ */}
      <div className="flex gap-3 items-start bg-muted/40 border border-dashed border-border rounded-xl p-3.5">
        <MapPin size={16} className="text-red-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
            Giao tới
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {order.shippingAddress || "Không có địa chỉ"}
          </p>
        </div>
      </div>

      {/* Sản phẩm */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Sản phẩm ({order.items?.length ?? 0})
        </p>
        <ScrollArea className="h-[240px] pr-2">
          <div className="flex flex-col gap-2">
            {order.items?.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {/* Quantity badge */}
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    {item.quantity}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-purple-500 transition-colors">
                      {item.bookTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.price?.toLocaleString("vi-VN")}đ / cuốn
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-foreground">
                    {item.subtotal?.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 border-t border-dashed border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CreditCard size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">
            Tổng thanh toán
          </span>
        </div>
        <span className="text-xl font-black text-purple-500">
          {order.total?.toLocaleString("vi-VN")} VNĐ
        </span>
      </div>
    </div>
  );
};

export default OrderDetailCard;
