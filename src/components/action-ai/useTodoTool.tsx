"use client";
import { useFrontendTool, ToolCallStatus } from "@copilotkit/react-core/v2";
import { useEffect, useRef } from "react";
import { z } from "zod";

const TodoActionSchema = z.object({
  action: z
    .enum(["add", "edit", "delete", "toggle"])
    .describe("Action to perform on the todo item"),
  id: z
    .string()
    .optional()
    .describe("ID of the todo to edit, delete, or toggle"),
  text: z
    .string()
    .optional()
    .describe("Content of the todo (used for add/edit)"),
  date: z
    .string()
    .optional()
    .describe("Date for the todo item, format: yyyy-MM-dd"),
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
        "Add, edit, delete, or toggle the completion status of todos in the Todo List on the Dashboard.",
      parameters: TodoActionSchema,
      handler: async (args) => {
        onActionRef.current(args);
        return `Successfully ${args.action}ed todo${args.text ? ` "${args.text}"` : ""}`;
      },
      render: ({ status }) => {
        if (
          status === ToolCallStatus.InProgress ||
          status === ToolCallStatus.Executing
        )
          return (
            <p className="text-sm animate-pulse">📝 Updating todo list...</p>
          );
        if (status === ToolCallStatus.Complete)
          return (
            <p className="text-sm text-green-600">✅ Todo list updated!</p>
          );
        return null;
      },
    },
    [],
  );
}
