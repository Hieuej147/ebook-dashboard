"use client";
import { useHumanInTheLoop, ToolCallStatus, useFrontendTool } from "@copilotkit/react-core/v2";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { QuickStats } from "./useStatsRender";


const DashboardStatsSchema = z.object({
  total_revenue: z.number().describe("Tổng doanh thu thực từ data"),
  revenue_trend: z
    .string()
    .describe("Mô tả xu hướng, vd: +12.5% so tháng trước"),
  active_users: z.number().describe("Số user active"),
  users_trend: z.string().describe("Mô tả xu hướng users"),
  books_published: z.number().describe("Số sách PUBLISHED"),
  books_trend: z.string().describe("Mô tả xu hướng sách"),
  orders_pending: z.number().describe("Số đơn đang PENDING"),
  revenue_chart: z
    .array(z.object({ date: z.string(), value: z.number() }))
    .describe("Dữ liệu chart doanh thu theo thời gian"),
  users_chart: z
    .array(z.object({ date: z.string(), value: z.number() }))
    .describe("Dữ liệu chart users theo thời gian"),
  orders_chart: z
    .array(z.object({ date: z.string(), value: z.number() }))
    .describe("Dữ liệu chart đơn hàng theo thời gian"),
  books_chart: z
    .array(z.object({ date: z.string(), value: z.number() }))
    .describe("Dữ liệu chart sách theo thời gian"),
});

type DashboardStatsProps = z.infer<typeof DashboardStatsSchema>;

export function useDashboardStatsComponent(
  onUpdate: (data: DashboardStatsProps) => void,
) {
  useHumanInTheLoop(
    {
      name: "updateDashboardStats",
      description:
        "Cập nhật các StatCard trên Dashboard. Gọi sau khi đã có data từ get_overview_stats. AI tự điền tất cả tham số từ data đã lấy được bao gồm cả chart data.",
      parameters: DashboardStatsSchema,
      render: ({ args, status, respond, result }) => {
        if (status === ToolCallStatus.InProgress)
          return (
            <p className="text-sm animate-pulse">⏳ Đang chuẩn bị dữ liệu...</p>
          );

        if (status === ToolCallStatus.Executing && respond)
          return (
            <div className="p-3 border border-blue-200 rounded-xl bg-blue-50/50 text-sm space-y-3">
              <p className="font-bold text-blue-800">
                📊 Cập nhật Dashboard với số liệu mới?
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
                  📊 Charts: <b>{args.revenue_chart?.length ?? 0} điểm</b>
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
                  ✅ Cập nhật
                </button>
                <button
                  onClick={() => respond({ confirmed: false })}
                  className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-medium"
                >
                  ❌ Huỷ
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
                ? "✅ Dashboard đã được cập nhật!"
                : "❌ Đã huỷ cập nhật."}
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
    .describe("Tỉ lệ chuyển đổi (%), tính từ completion_rate / 10"),
  avg_rating: z.number().describe("Đánh giá trung bình sách (0-5)"),
  return_rate: z
    .number()
    .describe("Tỉ lệ hoàn trả (%), tính từ 100 - completion_rate"),
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
        "Cập nhật Quick Stats card trên Dashboard. Gọi sau khi đã có data từ get_quick_stats hoặc get_order_stats.",
      parameters: UpdateQuickStatsSchema,
      handler: async (args) => {
        onUpdateRef.current(args);
        return `Đã cập nhật Quick Stats`;
      },
      render: ({ status }) => {
        if (
          status === ToolCallStatus.InProgress ||
          status === ToolCallStatus.Executing
        )
          return (
            <p className="text-sm animate-pulse">
              📊 Đang cập nhật Quick Stats...
            </p>
          );
        if (status === ToolCallStatus.Complete)
          return (
            <p className="text-sm text-green-600">
              ✅ Quick Stats đã cập nhật!
            </p>
          );
        return <></>;
      },
    },
    [],
  );
}
