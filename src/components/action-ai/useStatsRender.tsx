"use client";
import { useRenderTool } from "@copilotkit/react-core/v2";
import { z } from "zod";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#60a5fa", "#a855f7"];
const STATUS_COLORS: Record<string, string> = {
  DELIVERED: "#22c55e",
  PENDING: "#f59e0b",
  PROCESSING: "#60a5fa",
  SHIPPED: "#a855f7",
  CANCELLED: "#ef4444",
};

const PeriodSchema = z.object({
  period: z.enum(["today", "week", "month", "year"]).default("month"),
});

function safeParse(result: string) {
  try {
    return JSON.parse(result);
  } catch {
    try {
      return JSON.parse(result.replace(/'/g, '"'));
    } catch {
      return null;
    }
  }
}

export type Charts = {
  revenue_chart: { date: string; value: number }[];
  users_chart: { date: string; value: number }[];
  orders_chart: { date: string; value: number }[];
  books_chart: { date: string; value: number }[];
};

const Loading = ({ text }: { text: string }) => (
  <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
);

const ParseError = () => (
  <p className="text-sm text-red-500">❌ Data parsing error</p>
);

// ============================
// OVERVIEW STATS
// ============================
export function useOverviewStatsRender() {
  useRenderTool(
    {
      name: "get_overview_stats",
      parameters: PeriodSchema,
      render: ({ status, result }) => {
        if (status === "inProgress")
          return <Loading text="⏳ Loading statistics..." />;
        if (status === "executing") return <Loading text="⚙️ Processing..." />;
        const data = safeParse(result!);
        if (!data) return <ParseError />;

        const { revenue, users, orders, books } = data;
        return (
          <div className="grid grid-cols-2 gap-3 my-2">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm">💰 Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  ${revenue.total_revenue.toLocaleString()}
                </p>
                <p
                  className={`text-xs ${revenue.revenue_change_pct >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {revenue.revenue_change_pct >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(revenue.revenue_change_pct)}% vs last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm">👥 Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {users.total_users.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  +{users.new_users} new
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm">📦 Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{orders.total_orders}</p>
                <p className="text-xs text-muted-foreground">
                  Completion rate: {orders.completion_rate}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm">📚 Books</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {Object.values(
                    books.by_status as Record<string, number>,
                  ).reduce((a, b) => a + b, 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Published: {books.by_status?.PUBLISHED ?? 0}
                </p>
              </CardContent>
            </Card>
          </div>
        );
      },
    },
    [],
  );
}

// ============================
// REVENUE STATS
// ============================
export function useRevenueStatsRender() {
  useRenderTool(
    {
      name: "get_revenue_stats",
      parameters: PeriodSchema,
      render: ({ status, parameters, result }) => {
        if (status === "inProgress")
          return <Loading text="⏳ Loading revenue..." />;
        if (status === "executing")
          return <Loading text={`⚙️ Processing ${parameters.period}...`} />;

        const data = safeParse(result!);
        if (!data) return <ParseError />;

        return (
          <Card className="my-2">
            <CardHeader>
              <CardTitle className="text-sm">
                💰 Revenue — {data.period}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Total Revenue
                </span>
                <span className="font-bold">
                  ${data.total_revenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  vs Last Period
                </span>
                <span
                  className={
                    data.revenue_change_pct >= 0
                      ? "text-green-500 font-bold"
                      : "text-red-500 font-bold"
                  }
                >
                  {data.revenue_change_pct >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(data.revenue_change_pct)}%
                </span>
              </div>
              <p className="text-xs font-semibold text-muted-foreground pt-2">
                🏆 Top Selling Books
              </p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={data.top_books}>
                  <XAxis dataKey="title" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Bar
                    dataKey="total_sold"
                    fill="#a855f7"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      },
    },
    [],
  );
}

// ============================
// USER STATS
// ============================
export function useUserStatsRender() {
  useRenderTool(
    {
      name: "get_user_stats",
      parameters: PeriodSchema,
      render: ({ status, parameters, result }) => {
        if (status === "inProgress")
          return <Loading text="⏳ Loading users..." />;
        if (status === "executing")
          return <Loading text={`⚙️ Processing ${parameters.period}...`} />;

        const data = safeParse(result!);
        if (!data) return <ParseError />;

        const pieData = Object.entries(
          data.customer_types as Record<string, number>,
        ).map(([name, value]) => ({ name, value }));

        return (
          <Card className="my-2">
            <CardHeader>
              <CardTitle className="text-sm">
                👥 Users — {data.period}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xl font-bold">
                    {data.total_users.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-green-500">
                    +{data.new_users}
                  </p>
                  <p className="text-xs text-muted-foreground">New</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-blue-500">
                    {data.active_buyers}
                  </p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    label={({ name, value }: any) => `${name}: ${value}`}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      },
    },
    [],
  );
}

// ============================
// ORDER STATS
// ============================
export function useOrderStatsRender() {
  useRenderTool(
    {
      name: "get_order_stats",
      parameters: PeriodSchema,
      render: ({ status, parameters, result }) => {
        if (status === "inProgress")
          return <Loading text="⏳ Loading orders..." />;
        if (status === "executing")
          return <Loading text={`⚙️ Processing ${parameters.period}...`} />;

        const data = safeParse(result!);
        if (!data) return <ParseError />;

        const barData = Object.entries(
          data.by_status as Record<string, { count: number }>,
        ).map(([s, val]) => ({ status: s, count: val.count }));

        return (
          <Card className="my-2">
            <CardHeader>
              <CardTitle className="text-sm">
                📦 Orders — {data.period}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xl font-bold">{data.total_orders}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-green-500">
                    {data.completion_rate}%
                  </p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div>
                  <p className="text-xl font-bold">${data.avg_order_value}</p>
                  <p className="text-xs text-muted-foreground">Avg Value</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={barData}>
                  <XAxis dataKey="status" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={STATUS_COLORS[entry.status] ?? "#94a3b8"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      },
    },
    [],
  );
}

// ============================
// BOOK STATS
// ============================
export function useBookStatsRender() {
  useRenderTool(
    {
      name: "get_book_stats",
      parameters: z.object({}),
      render: ({ status, result }) => {
        if (status === "inProgress")
          return <Loading text="⏳ Loading books..." />;
        if (status === "executing") return <Loading text="⚙️ Processing..." />;

        const data = safeParse(result!);
        if (!data) return <ParseError />;

        const statusData = Object.entries(
          data.by_status as Record<string, number>,
        ).map(([name, value]) => ({ name, value }));

        const categoryData = Object.entries(
          data.by_category as Record<string, number>,
        )
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6);

        return (
          <Card className="my-2">
            <CardHeader>
              <CardTitle className="text-sm">📚 Book Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Status */}
              <div className="flex gap-3">
                {statusData.map((s) => (
                  <div
                    key={s.name}
                    className="flex-1 text-center p-2 rounded-lg bg-muted"
                  >
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.name}</p>
                  </div>
                ))}
              </div>

              {/* Top category */}
              <p className="text-xs font-semibold text-muted-foreground pt-1">
                📂 Top Categories
              </p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" tick={{ fontSize: 8 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* Low stock */}
              {data.low_stock_books?.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-red-500 pt-1">
                    ⚠️ Low Stock
                  </p>
                  <div className="space-y-1">
                    {data.low_stock_books.map(
                      (b: { title: string; stock: number }) => (
                        <div
                          key={b.title}
                          className="flex justify-between text-xs"
                        >
                          <span className="truncate max-w-[70%]">
                            {b.title}
                          </span>
                          <span className="text-red-500 font-bold">
                            {b.stock} left
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      },
    },
    [],
  );
}

const QuickStatsSchema = z.object({
  period: z.enum(["today", "week", "month", "year"]).default("month"),
});

export type QuickStats = {
  conversion_rate: number;
  avg_rating: number;
  return_rate: number;
};

export function useQuickStatsRender() {
  useRenderTool(
    {
      name: "get_quick_stats",
      parameters: QuickStatsSchema,
      render: ({ status, result }) => {
        if (status === "inProgress")
          return (
            <p className="text-sm animate-pulse">⏳ Loading quick stats...</p>
          );
        if (status === "executing")
          return <p className="text-sm animate-pulse">⚙️ Processing...</p>;
        if (status === "complete" && result) {
          const data = safeParse(result);
          if (!data) return <ParseError />;
          return (
            <Card className="my-2">
              <CardHeader>
                <CardTitle className="text-sm">
                  📊 Quick Stats — {data.period}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xl font-bold text-purple-500">
                    {data.conversion_rate}%
                  </p>
                  <p className="text-xs text-muted-foreground">Conversion</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-yellow-500">
                    {data.avg_rating}
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-red-500">
                    {data.return_rate}%
                  </p>
                  <p className="text-xs text-muted-foreground">Return Rate</p>
                </div>
              </CardContent>
            </Card>
          );
        }
        return <></>;
      },
    },
    [],
  );
}

// ============================
// MAIN EXPORT HOOK
// ============================
export function useStatsTools() {
  useQuickStatsRender();
  useOverviewStatsRender();
  useRevenueStatsRender();
  useUserStatsRender();
  useOrderStatsRender();
  useBookStatsRender();
}
