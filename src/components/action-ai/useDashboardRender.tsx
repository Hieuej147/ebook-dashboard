"use client";
import {
  useHumanInTheLoop,
  ToolCallStatus,
  useFrontendTool,
} from "@copilotkit/react-core/v2";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { QuickStats } from "./useStatsRender";

const DashboardStatsSchema = z.object({
  total_revenue: z.number().describe("Total actual revenue from data"),
  revenue_trend: z
    .string()
    .describe("Trend description, e.g.: +12.5% from last month"),
  active_users: z.number().describe("Number of active users"),
  users_trend: z.string().describe("User trend description"),
  books_published: z.number().describe("Number of PUBLISHED books"),
  books_trend: z.string().describe("Book trend description"),
  orders_pending: z.number().describe("Number of PENDING orders"),
  revenue_chart: z
    .array(z.object({ date: z.string(), value: z.number() }))
    .describe("Revenue chart data over time"),
  users_chart: z
    .array(z.object({ date: z.string(), value: z.number() }))
    .describe("User chart data over time"),
  orders_chart: z
    .array(z.object({ date: z.string(), value: z.number() }))
    .describe("Order chart data over time"),
  books_chart: z
    .array(z.object({ date: z.string(), value: z.number() }))
    .describe("Book chart data over time"),
});

type DashboardStatsProps = z.infer<typeof DashboardStatsSchema>;

export function useDashboardStatsComponent(
  onUpdate: (data: DashboardStatsProps) => void,
) {
  useHumanInTheLoop(
    {
      name: "updateDashboardStats",
      description:
        "Updates the StatCards on the Dashboard. Call this after receiving data from get_overview_stats. AI automatically populates all parameters including chart data.",
      parameters: DashboardStatsSchema,
      render: ({ args, status, respond, result }) => {
        if (status === ToolCallStatus.InProgress)
          return <p className="text-sm animate-pulse">⏳ Preparing data...</p>;

        if (status === ToolCallStatus.Executing && respond)
          return (
            <div className="p-3 border border-blue-200 rounded-xl bg-blue-50/50 text-sm space-y-3">
              <p className="font-bold text-blue-800">
                📊 Update Dashboard with new data?
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  💰 Revenue: <b>${args.total_revenue?.toLocaleString()}</b>
                </div>
                <div>
                  📈 <b>{args.revenue_trend}</b>
                </div>
                <div>
                  👥 Users: <b>{args.active_users?.toLocaleString()}</b>
                </div>
                <div>
                  📈 <b>{args.users_trend}</b>
                </div>
                <div>
                  📚 Books: <b>{args.books_published}</b>
                </div>
                <div>
                  📈 <b>{args.books_trend}</b>
                </div>
                <div>
                  📦 Pending: <b>{args.orders_pending}</b>
                </div>
                <div>
                  📊 Charts: <b>{args.revenue_chart?.length ?? 0} points</b>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onUpdate(args as DashboardStatsProps);
                    respond({ confirmed: true });
                  }}
                  className="bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-medium"
                >
                  ✅ Update
                </button>
                <button
                  onClick={() => respond({ confirmed: false })}
                  className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-medium"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          );

        if (status === ToolCallStatus.Complete && result) {
          const parsed = JSON.parse(result);
          return (
            <div
              className={`p-2 text-sm ${parsed.confirmed ? "text-green-600" : "text-gray-500"}`}
            >
              {parsed.confirmed
                ? "✅ Dashboard has been updated!"
                : "❌ Update cancelled."}
            </div>
          );
        }

        return null;
      },
    },
    [onUpdate],
  );
}

const UpdateQuickStatsSchema = z.object({
  conversion_rate: z
    .number()
    .describe("Conversion rate (%), calculated from completion_rate / 10"),
  avg_rating: z.number().describe("Average book rating (0-5)"),
  return_rate: z
    .number()
    .describe("Return rate (%), calculated from 100 - completion_rate"),
});

export function useUpdateQuickStatsTool(onUpdate: (stats: QuickStats) => void) {
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useFrontendTool(
    {
      name: "updateQuickStats",
      description:
        "Updates the Quick Stats card on the Dashboard. Call this after receiving data from get_quick_stats or get_order_stats.",
      parameters: UpdateQuickStatsSchema,
      handler: async (args) => {
        onUpdateRef.current(args);
        return `Quick Stats updated successfully`;
      },
      render: ({ status }) => {
        if (
          status === ToolCallStatus.InProgress ||
          status === ToolCallStatus.Executing
        )
          return (
            <p className="text-sm animate-pulse">📊 Updating Quick Stats...</p>
          );
        if (status === ToolCallStatus.Complete)
          return (
            <p className="text-sm text-green-600">✅ Quick Stats updated!</p>
          );
        return <></>;
      },
    },
    [],
  );
}
