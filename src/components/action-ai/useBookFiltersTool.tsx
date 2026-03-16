"use client";

import {
  useFrontendTool,
  ToolCallStatus,
  useHumanInTheLoop,
} from "@copilotkit/react-core/v2";
import { z } from "zod";

// Định nghĩa Schema cho các tham số lọc và phân trang sách
const BookFiltersSchema = z.object({
  search: z
    .string()
    .optional()
    .describe("Từ khóa tìm kiếm theo tên sách hoặc tác giả"),
  categoryId: z
    .string()
    .optional()
    .describe("ID của thể loại sách (Category) để lọc"),
  page: z.number().optional().describe("Số trang cần chuyển đến"),
});

type BookFiltersProps = z.infer<typeof BookFiltersSchema>;

export function useBookFiltersTool(
  onApplyFilters: (filters: BookFiltersProps) => void,
) {
  useFrontendTool(
    {
      name: "applyBookFilters",
      description:
        "Tự động áp dụng bộ lọc (tìm kiếm, thể loại) hoặc chuyển trang danh sách sách (books) trên màn hình quản lý theo yêu cầu của user.",
      parameters: BookFiltersSchema,
      handler: async (args) => {
        // Chuyển dữ liệu cho component cha xử lý
        onApplyFilters(args);
        return `Đã tự động áp dụng bộ lọc sách: ${JSON.stringify(args)}`;
      },
      // Render UI nhỏ trong chat (đổi sang tone màu tím/tối cho hợp với trang sách)
      render: ({ status }) => {
        if (
          status === ToolCallStatus.InProgress ||
          status === ToolCallStatus.Executing
        ) {
          return (
            <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-200 shadow-sm">
              <span className="animate-spin">📚</span> Đang lật mở các trang
              sách...
            </div>
          );
        }
        if (status === ToolCallStatus.Complete) {
          return (
            <div className="text-sm text-green-700 bg-green-50 p-2 rounded-lg border border-green-200 shadow-sm">
              ✅ Đã tải xong danh sách sách!
            </div>
          );
        }
        return null;
      },
    },
    [onApplyFilters],
  );
}

const BookFiltersSchemaHumanLoop = z.object({
  search: z
    .string()
    .default("")
    .describe("Tìm kiếm theo tên sách hoặc tác giả"),
  category: z.string().default("").describe("UUID của category để lọc"),
  status: z
    .enum(["", "DRAFT", "PUBLISHED"])
    .default("")
    .describe("Trạng thái sách"),
});

type BookFilters = z.infer<typeof BookFiltersSchemaHumanLoop>;

export function useBookFiltersTool_HumanLoop(
  onApply: (filters: BookFilters) => void,
) {
  useHumanInTheLoop(
    {
      name: "filterBooks",
      description:
        "Lọc danh sách sách trong CardBooks trên Dashboard theo category, status hoặc từ khóa tìm kiếm.",
      parameters: BookFiltersSchemaHumanLoop,
      render: ({ args, status, respond, result }) => {
        if (status === ToolCallStatus.InProgress)
          return (
            <p className="text-sm animate-pulse">⏳ Đang chuẩn bị bộ lọc...</p>
          );

        if (status === ToolCallStatus.Executing && respond)
          return (
            <div className="p-3 border border-purple-200 rounded-xl bg-purple-50/50 text-sm space-y-3">
              <p className="font-bold text-purple-800">
                📚 Lọc sách với điều kiện sau?
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {args.search && (
                  <div>
                    🔍 Search: <b>{args.search}</b>
                  </div>
                )}
                {args.category && (
                  <div>
                    📂 Category: <b>{args.category}</b>
                  </div>
                )}
                {args.status && (
                  <div>
                    📌 Status: <b>{args.status}</b>
                  </div>
                )}
                {!args.search && !args.category && !args.status && (
                  <div className="col-span-2 text-gray-500">
                    Hiển thị tất cả sách
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    const params = new URLSearchParams({
                      page: "1",
                      limit: "10",
                    });
                    if (args.search) params.set("search", args.search);
                    if (args.category) params.set("category", args.category);
                    if (args.status)
                      params.set(
                        "isActive",
                        args.status === "PUBLISHED" ? "true" : "false",
                      );

                    let count = 0;
                    try {
                      const res = await fetch(
                        `/api/books/admin/all?${params.toString()}`,
                      );
                      const data = await res.json();
                      count = data.data?.length ?? 0;
                    } catch {}
                    onApply(args as BookFilters);
                    respond({
                      confirmed: true,
                      found: count,
                      message:
                        count > 0
                          ? `Tìm thấy ${count} sách với bộ lọc đã chọn.`
                          : `Không tìm thấy sách nào với bộ lọc này.`,
                    });
                  }}
                  className="bg-purple-500 text-white px-3 py-1.5 rounded text-xs font-medium"
                >
                  ✅ Áp dụng
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
              className={`p-2 text-sm ${parsed.confirmed ? "text-purple-600" : "text-gray-500"}`}
            >
              {parsed.confirmed
                ? `✅ ${parsed.message}` 
                : "❌ Đã huỷ."}
            </div>
          );
        }
        return null;
      },
    },
    [onApply],
  );
}
