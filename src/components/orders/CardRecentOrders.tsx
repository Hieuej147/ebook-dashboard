"use client";
import { useState, useEffect } from "react";
import { CheckCircleIcon, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OrderRow } from "./OrderRow";

type Order = {
  id: string;
  status: "Completed" | "Processing" | "Pending";
  items: [{ bookTitle?: string }];
};

export default function CardOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders/admin/all?page=1&limit=5")
      .then((r) => r.json())
      .then((data) => setOrders(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusStyles: any = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    SHIPPED: "bg-blue-100 text-blue-700 border-blue-200",
    DELIVERED: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckCircleIcon className="w-5 h-5 text-purple-500" />
          <h1 className="font-bold text-[20px]">Recent Orders</h1>
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-purple-500" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Chưa có đơn hàng
          </p>
        ) : (
          orders.map((order) => {
            const mainItem = order.items?.[0]?.bookTitle ?? "—";
            const extraItems = (order.items?.length ?? 0) - 1;

            return (
              <OrderRow
                key={order.id}
                id={`#${order.id.slice(0, 8).toUpperCase()}`}
                title={
                  extraItems > 0
                    ? `${mainItem} + ${extraItems} items`
                    : mainItem
                }
                status={order.status}
              />
            );
          })
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
          asChild
        >
          <Link href="/dashboard/orders">View All Orders</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
