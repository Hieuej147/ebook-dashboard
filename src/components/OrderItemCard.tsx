"use client";

import { Badge } from "@/components/ui/badge";
import { CreditCard, MapPin, Package } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

const OrderDetailCard = ({ order }: { order: any }) => {
  if (!order) return null;

  return (
    <div className="border shadow-md p-5 rounded-2xl bg-white space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-start border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2 text-slate-900">
            <Package size={20} className="text-purple-600" />
            {order.orderNumber}
          </h1>
          <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
            ID: {order.id}
          </p>
        </div>
        <Badge className="bg-purple-600 font-black uppercase text-[10px] px-3 py-1">
          {order.status}
        </Badge>
      </div>

      {/* Địa chỉ giao hàng */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 border-dashed flex gap-3 items-start">
        <MapPin size={18} className="text-red-500 mt-1 shrink-0" />
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Giao tới
          </p>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            {order.shippingAddress}
          </p>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
          Sản phẩm đã mua
        </h3>
        <ScrollArea className="h-[280px] pr-4">
          <div className="flex flex-col gap-3">
            {order.items?.map((item: any) => (
              <Card
                key={item.id}
                className="p-3 border-none bg-slate-50/50 hover:bg-slate-100 transition-colors shadow-none flex justify-between items-center group"
              >
                <div className="flex items-center gap-4">
                  <div className="size-9 rounded-xl bg-white border border-slate-100 text-purple-700 flex items-center justify-center font-black text-xs shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    {item.quantity}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-purple-600 transition-colors">
                      {item.bookTitle}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {item.price?.toLocaleString()}đ / sản phẩm
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">
                    {item.subtotal?.toLocaleString()}đ
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Footer: Tổng tiền */}
      <div className="pt-5 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-400">
          <CreditCard size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">
            Tổng thanh toán
          </span>
        </div>
        <span className="text-2xl font-black text-purple-600">
          {order.total?.toLocaleString()} VNĐ
        </span>
      </div>
    </div>
  );
};

export default OrderDetailCard;
