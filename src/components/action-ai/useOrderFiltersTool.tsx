"use client";

import { useFrontendTool, ToolCallStatus } from "@copilotkit/react-core/v2";
import { z } from "zod";

const OrderFiltersSchema = z.object({
  search: z
    .string()
    .optional()
    .describe("Keywords to search by order ID or customer name"),
  status: z
    .enum(["ALL", "PENDING", "SHIPPED", "DELIVERED", "CANCELLED"])
    .optional()
    .describe("Order status to filter (defaults to ALL)"),
  page: z.number().optional().describe("Page number to navigate to"),
});

type OrderFiltersProps = z.infer<typeof OrderFiltersSchema>;

export function useOrderFiltersTool(
  onApplyFilters: (filters: OrderFiltersProps) => void,
) {
  useFrontendTool(
    {
      name: "applyOrderFilters",
      description:
        "Automatically applies filters (search, status) or handles pagination on the order management screen based on user request.",
      parameters: OrderFiltersSchema,
      handler: async (args) => {
        // AI automatically calls the interface update function
        onApplyFilters(args);
        return `Successfully applied filters: ${JSON.stringify(args)}`;
      },
      // Renders a small UI in the chat to let the user know the AI is performing the action
      render: ({ status }) => {
        if (
          status === ToolCallStatus.InProgress ||
          status === ToolCallStatus.Executing
        ) {
          return (
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-100">
              <span className="animate-spin">⏳</span> Updating interface...
            </div>
          );
        }
        if (status === ToolCallStatus.Complete) {
          return (
            <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg border border-green-100">
              ✅ Action completed!
            </div>
          );
        }
        return null;
      },
    },
    [onApplyFilters],
  );
}
