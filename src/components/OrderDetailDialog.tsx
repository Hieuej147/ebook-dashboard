// components/OrderDetailDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "./ui/badge";

export const OrderDetailDialog = ({ order, open, onOpenChange }: any) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Chi tiết đơn hàng {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Cột 1: Thông tin khách & giao hàng */}
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-sm text-slate-500 uppercase">
                Khách hàng
              </h4>
              <p className="font-medium">{order.userName}</p>
              <p className="text-sm text-slate-400">{order.userEmail}</p>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-500 uppercase">
                Địa chỉ giao hàng
              </h4>
              <p className="text-sm italic">{order.shippingAddress}</p>
            </div>
          </div>

          {/* Cột 2: Trạng thái & Thời gian */}
          <div className="space-y-4 text-right">
            <div>
              <h4 className="font-bold text-sm text-slate-500 uppercase">
                Trạng thái
              </h4>
              <Badge className="mt-1">{order.status}</Badge>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-500 uppercase">
                Ngày tạo
              </h4>
              <p className="text-sm">
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        </div>

        {/* Bảng danh sách sản phẩm bên trong Modal */}
        <div className="mt-6 border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-2 text-left">Sản phẩm</th>
                <th className="p-2 text-center">SL</th>
                <th className="p-2 text-right">Đơn giá</th>
                <th className="p-2 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: any) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2 font-medium">{item.bookTitle}</td>
                  <td className="p-2 text-center">{item.quantity}</td>
                  <td className="p-2 text-right">
                    {item.price.toLocaleString()}đ
                  </td>
                  <td className="p-2 text-right font-bold">
                    {item.subtotal.toLocaleString()}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-right">
          <span className="text-lg font-bold text-purple-600">
            Tổng cộng: {order.total.toLocaleString()} VNĐ
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
