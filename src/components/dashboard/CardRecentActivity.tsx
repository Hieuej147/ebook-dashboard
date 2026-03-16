"use client";
import {
  Activity,
  BookOpen,
  ShoppingCart,
  UserPlus,
  Star,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

type ActivityItem = {
  id: string;
  title: string;
  time: string;
  type: "book" | "order" | "user" | "review" | "alert";
};

const ICON_MAP = {
  book: <BookOpen className="w-4 h-4 text-purple-500" />,
  order: <ShoppingCart className="w-4 h-4 text-blue-500" />,
  user: <UserPlus className="w-4 h-4 text-green-500" />,
  review: <Star className="w-4 h-4 text-yellow-500" />,
  alert: <AlertTriangle className="w-4 h-4 text-red-500" />,
};

const COLOR_MAP = {
  book: "border-purple-500",
  order: "border-blue-500",
  user: "border-green-500",
  review: "border-yellow-500",
  alert: "border-red-500",
};

const activities: ActivityItem[] = [
  {
    id: "1",
    title: 'Published "The Future of AI"',
    time: "2 minutes ago",
    type: "book",
  },
  {
    id: "2",
    title: "Order #ORD-2024-004 completed",
    time: "15 minutes ago",
    type: "order",
  },
  {
    id: "3",
    title: "New premium user registered",
    time: "1 hour ago",
    type: "user",
  },
  {
    id: "4",
    title: '5★ review on "Web Dev Guide"',
    time: "2 hours ago",
    type: "review",
  },
  {
    id: "5",
    title: 'Low stock: "Clean Code" (3 left)',
    time: "3 hours ago",
    type: "alert",
  },
  {
    id: "6",
    title: "Order #ORD-2024-003 shipped",
    time: "5 hours ago",
    type: "order",
  },
  { id: "7", title: "New user registered", time: "8 hours ago", type: "user" },
  {
    id: "8",
    title: 'Published "Sustainable Living"',
    time: "Yesterday",
    type: "book",
  },
  {
    id: "9",
    title: "Order #ORD-2024-002 delivered",
    time: "Yesterday",
    type: "order",
  },
  {
    id: "10",
    title: "1★ review flagged for review",
    time: "2 days ago",
    type: "alert",
  },
];

export default function CardRecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="w-5 h-5 text-purple-500" />
          <span className="font-bold">Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <ScrollArea className="h-[420px] mt-4">
        <CardContent className="space-y-3">
          {activities.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 border-l-2 ${COLOR_MAP[item.type]} pl-3`}
            >
              <div className="mt-0.5">{ICON_MAP[item.type]}</div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium">{item.title}</p>
                <span className="text-xs text-muted-foreground">
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
