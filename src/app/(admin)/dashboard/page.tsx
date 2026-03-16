"use client";
import CardBooks from "@/components/books/CardBooks";
import { StatCard } from "@/components/dashboard/StatCard";
import Todolist from "@/components/dashboard/Todolist";
import CardRecentActivity from "@/components/dashboard/CardRecentActivity";
import { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDashboardStatsComponent } from "@/components/action-ai/useDashboardRender";
import { DraggableCard } from "@/components/DraggableCard";
import CardOrder from "@/components/orders/CardRecentOrders";
import CardQuickStats from "@/components/dashboard/CardQuickStats";
import { Charts, useStatsTools } from "@/components/action-ai/useStatsRender";

const DEFAULT_ORDER = [
  "card-books",
  "card-orders",
  "card-todo",
  "card-quickstats",
  "card-activity",
];

const DEFAULT_STATS = {
  total_revenue: 24582,
  revenue_trend: "12.5% from last month",
  active_users: 3847,
  users_trend: "8.2% from last week",
  books_published: 382,
  books_trend: "5 new this week",
  orders_pending: 42,
};

const DEFAULT_CHARTS: Charts = {
  revenue_chart: [20, 40, 30, 70, 50].map((v) => ({ date: "", value: v })),
  users_chart: [10, 25, 15, 40, 30].map((v) => ({ date: "", value: v })),
  orders_chart: [5, 15, 10, 25, 20].map((v) => ({ date: "", value: v })),
  books_chart: [30, 50, 25, 60, 40].map((v) => ({ date: "", value: v })),
};

// ✅ CARD_MAP ngoài component — không bao giờ re-create
const CARD_MAP: Record<string, React.ReactNode> = {
  "card-books": <CardBooks />,
  "card-orders": <CardOrder />,
  "card-quickstats": <CardQuickStats />,
  "card-todo": <Todolist />,
  "card-activity": <CardRecentActivity />,
};

const LEFT_CARDS = new Set(["card-books", "card-todo"]);

export default function DashboardPage() {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [charts, setCharts] = useState<Charts>(DEFAULT_CHARTS);
  const [cardOrder, setCardOrder] = useState(DEFAULT_ORDER);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setCardOrder((prev) =>
      arrayMove(
        prev,
        prev.indexOf(String(active.id)),
        prev.indexOf(String(over.id)),
      ),
    );
  }, []);

  useStatsTools();
  useDashboardStatsComponent((data) => {
    setStats({
      total_revenue: data.total_revenue,
      revenue_trend: data.revenue_trend,
      active_users: data.active_users,
      users_trend: data.users_trend,
      books_published: data.books_published,
      books_trend: data.books_trend,
      orders_pending: data.orders_pending,
    });
    setCharts({
      revenue_chart: data.revenue_chart,
      users_chart: data.users_chart,
      orders_chart: data.orders_chart,
      books_chart: data.books_chart,
    });
  });

  const leftCards = cardOrder.filter((id) => LEFT_CARDS.has(id));
  const rightCards = cardOrder.filter((id) => !LEFT_CARDS.has(id));

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        {/* Header */}
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 2xl:col-span-4 flex flex-col gap-4">
          <h1 className="font-extrabold text-4xl text-primary">Dashboard</h1>
          <p className="text-primary">
            Welcome back! Here's your performance overview.
          </p>
        </div>

        {/* StatCards */}
        <div className="bg-primary-foreground p-4 rounded-lg col-span-1 lg:col-span-2 2xl:col-span-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value={`$${stats.total_revenue.toLocaleString()}`}
              trend={stats.revenue_trend}
              icon="dollar"
              iconBgColor="bg-purple-500 text-white"
              chartColor="#a855f7"
              trendType="up"
              chartData={charts.revenue_chart}
            />
            <StatCard
              title="Active Users"
              value={stats.active_users.toLocaleString()}
              trend={stats.users_trend}
              trendType="up"
              icon="users"
              iconBgColor="bg-blue-500 text-white"
              chartColor="#60a5fa"
              chartData={charts.users_chart}
            />
            <StatCard
              title="Books Published"
              value={stats.books_published.toString()}
              trend={stats.books_trend}
              trendType="up"
              icon="book"
              iconBgColor="bg-amber-500 text-white"
              chartColor="#fbbf24"
              chartData={charts.books_chart}
            />
            <StatCard
              title="Orders Pending"
              value={stats.orders_pending.toString()}
              trend="Awaiting processing"
              trendType="neutral"
              icon="clock"
              iconBgColor="bg-orange-500 text-white"
              chartColor="#fb923c"
              chartData={charts.orders_chart}
            />
          </div>
        </div>

        {/* Draggable Cards */}
        <div className="bg-primary-foreground p-4 rounded-lg col-span-1 lg:col-span-2 2xl:col-span-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={cardOrder}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  {leftCards.map((id) => (
                    // ✅ disabled khi chưa mounted — không unmount/remount
                    <DraggableCard key={id} id={id} disabled={!mounted}>
                      {CARD_MAP[id]}
                    </DraggableCard>
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  {rightCards.map((id) => (
                    <DraggableCard key={id} id={id} disabled={!mounted}>
                      {CARD_MAP[id]}
                    </DraggableCard>
                  ))}
                </div>
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </>
  );
}
