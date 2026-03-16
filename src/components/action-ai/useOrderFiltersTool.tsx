"use client";

import { useFrontendTool, ToolCallStatus } from "@copilotkit/react-core/v2";
import { z } from "zod";

const OrderFiltersSchema = z.object({
  search: z
    .string()
    .optional()
    .describe("Từ khóa để tìm kiếm theo mã đơn hoặc tên khách hàng"),
  status: z
    .enum(["ALL", "PENDING", "SHIPPED", "DELIVERED", "CANCELLED"])
    .optional()
    .describe("Trạng thái đơn hàng cần lọc (mặc định là ALL)"),
  page: z.number().optional().describe("Số trang cần chuyển đến"),
});

type OrderFiltersProps = z.infer<typeof OrderFiltersSchema>;

export function useOrderFiltersTool(
  onApplyFilters: (filters: OrderFiltersProps) => void,
) {
  useFrontendTool(
    {
      name: "applyOrderFilters",
      description:
        "Tự động áp dụng bộ lọc (search, status) hoặc chuyển trang (pagination) trên màn hình quản lý đơn hàng theo yêu cầu của user.",
      parameters: OrderFiltersSchema,
      handler: async (args) => {
        // AI tự động gọi hàm cập nhật giao diện
        onApplyFilters(args);
        return `Đã tự động áp dụng: ${JSON.stringify(args)}`;
      },
      // Render một UI nhỏ trong chat để user biết AI đang thao tác giúp mình
      render: ({ status }) => {
        if (
          status === ToolCallStatus.InProgress ||
          status === ToolCallStatus.Executing
        ) {
          return (
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-100">
              <span className="animate-spin">⏳</span> Đang thao tác trên giao
              diện...
            </div>
          );
        }
        if (status === ToolCallStatus.Complete) {
          return (
            <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg border border-green-100">
              ✅ Đã hoàn tất thao tác!
            </div>
          );
        }
        return null;
      },
    },
    [onApplyFilters],
  );
}
