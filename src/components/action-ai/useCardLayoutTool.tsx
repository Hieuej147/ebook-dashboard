"use client";
import { useFrontendTool, ToolCallStatus } from "@copilotkit/react-core/v2";
import { z } from "zod";
import { useRef, useEffect } from "react";

const CardLayoutSchema = z.object({
  left_column: z
    .array(z.enum(["card-books", "card-todo"]))
    .describe("Thứ tự cards trong cột trái. Chỉ gồm: card-books, card-todo"),

  right_column: z
    .array(z.enum(["card-orders", "card-quickstats", "card-activity"]))
    .describe(
      "Thứ tự cards trong cột phải. Chỉ gồm: card-orders, card-quickstats, card-activity",
    ),
});

export function useCardLayoutTool(onReorder: (order: string[]) => void) {
  const onReorderRef = useRef(onReorder);
  useEffect(() => {
    onReorderRef.current = onReorder;
  }, [onReorder]);

  useFrontendTool(
    {
      name: "reorderDashboardCards",
      description: `Sắp xếp thứ tự cards trong từng cột trên Dashboard.
Cột trái (cố định): card-books, card-todo
Cột phải (cố định): card-orders, card-quickstats, card-activity
Chỉ thay đổi thứ tự TRONG từng cột, không chuyển card sang cột khác.`,
      parameters: CardLayoutSchema,
      handler: async (args) => {
        // ✅ Merge 2 cột thành 1 array theo kiểu xen kẽ
        const merged: string[] = [];
        const maxLen = Math.max(
          args.left_column.length,
          args.right_column.length,
        );
        for (let i = 0; i < maxLen; i++) {
          if (args.left_column[i]) merged.push(args.left_column[i]);
          if (args.right_column[i]) merged.push(args.right_column[i]);
        }
        onReorderRef.current(merged);

        const names: Record<string, string> = {
          "card-books": "Book Library",
          "card-orders": "Recent Orders",
          "card-quickstats": "Quick Stats",
          "card-todo": "Todo List",
          "card-activity": "Recent Activity",
        };
        return `Đã sắp xếp — Trái: ${args.left_column.map((id) => names[id]).join(" → ")} | Phải: ${args.right_column.map((id) => names[id]).join(" → ")}`;
      },
      render: ({ status }) => {
        if (
          status === ToolCallStatus.InProgress ||
          status === ToolCallStatus.Executing
        )
          return (
            <p className="text-sm animate-pulse">🔄 Đang sắp xếp cards...</p>
          );
        if (status === ToolCallStatus.Complete)
          return (
            <p className="text-sm text-green-600">✅ Đã sắp xếp Dashboard!</p>
          );
        return <></>;
      },
    },
    [],
  );
}
