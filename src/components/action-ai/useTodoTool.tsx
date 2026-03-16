"use client";
import { useFrontendTool, ToolCallStatus } from "@copilotkit/react-core/v2";
import { useEffect, useRef } from "react";
import { z } from "zod";

const TodoActionSchema = z.object({
  action: z
    .enum(["add", "edit", "delete", "toggle"])
    .describe("Hành động cần thực hiện"),
  id: z.string().optional().describe("ID của todo cần edit/delete/toggle"),
  text: z.string().optional().describe("Nội dung todo (dùng cho add/edit)"),
  date: z.string().optional().describe("Ngày của todo, format: yyyy-MM-dd"),
});

type TodoAction = z.infer<typeof TodoActionSchema>;

export function useTodoTool(onAction: (action: TodoAction) => void) {
  const onActionRef = useRef(onAction);
  useEffect(() => {
    onActionRef.current = onAction;
  }, [onAction]);
  useFrontendTool(
    {
      name: "manageTodo",
      description:
        "Thêm, sửa, xóa, hoặc đánh dấu hoàn thành todo trong Todolist trên Dashboard.",
      parameters: TodoActionSchema,
      handler: async (args) => {
        onActionRef.current(args);
        return `Đã thực hiện: ${args.action} todo${args.text ? ` "${args.text}"` : ""}`;
      },
      render: ({ status }) => {
        if (
          status === ToolCallStatus.InProgress ||
          status === ToolCallStatus.Executing
        )
          return (
            <p className="text-sm animate-pulse">📝 Đang cập nhật todo...</p>
          );
        if (status === ToolCallStatus.Complete)
          return (
            <p className="text-sm text-green-600">✅ Đã cập nhật Todolist!</p>
          );
        return null;
      },
    },
    [],
  );
}
