"use client";

import {
  useFrontendTool,
  ToolCallStatus,
  useHumanInTheLoop,
} from "@copilotkit/react-core/v2";
import { z } from "zod";

// Schema for book filtering and pagination parameters
const BookFiltersSchema = z.object({
  search: z
    .string()
    .optional()
    .describe("Keywords to search by book title or author"),
  categoryId: z
    .string()
    .optional()
    .describe("ID of the book category to filter"),
  page: z.number().optional().describe("Page number to navigate to"),
});

type BookFiltersProps = z.infer<typeof BookFiltersSchema>;

export function useBookFiltersTool(
  onApplyFilters: (filters: BookFiltersProps) => void,
) {
  useFrontendTool(
    {
      name: "applyBookFilters",
      description:
        "Automatically applies filters (search, category) or handles book list pagination on the management screen based on user request.",
      parameters: BookFiltersSchema,
      handler: async (args) => {
        // Pass data to parent component for processing
        onApplyFilters(args);
        return `Successfully applied book filters: ${JSON.stringify(args)}`;
      },
      // Small UI render in chat (using purple/dark tones for the book theme)
      render: ({ status }) => {
        if (
          status === ToolCallStatus.InProgress ||
          status === ToolCallStatus.Executing
        ) {
          return (
            <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-200 shadow-sm">
              <span className="animate-spin">📚</span> Turning the pages...
            </div>
          );
        }
        if (status === ToolCallStatus.Complete) {
          return (
            <div className="text-sm text-green-700 bg-green-50 p-2 rounded-lg border border-green-200 shadow-sm">
              ✅ Book list updated!
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
  search: z.string().default("").describe("Search by book title or author"),
  category: z.string().default("").describe("Category UUID to filter"),
  status: z
    .enum(["", "DRAFT", "PUBLISHED"])
    .default("")
    .describe("Book status"),
});

type BookFilters = z.infer<typeof BookFiltersSchemaHumanLoop>;

export function useBookFiltersTool_HumanLoop(
  onApply: (filters: BookFilters) => void,
) {
  useHumanInTheLoop(
    {
      name: "filterBooks",
      description:
        "Filters the book list in CardBooks on the Dashboard by category, status, or search keyword.",
      parameters: BookFiltersSchemaHumanLoop,
      render: ({ args, status, respond, result }) => {
        if (status === ToolCallStatus.InProgress)
          return (
            <p className="text-sm animate-pulse">⏳ Preparing filters...</p>
          );

        if (status === ToolCallStatus.Executing && respond)
          return (
            <div className="p-3 border border-purple-200 rounded-xl bg-purple-50/50 text-sm space-y-3">
              <p className="font-bold text-purple-800">
                📚 Filter books with the following criteria?
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
                    Showing all books
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
                          ? `Found ${count} books with the selected filters.`
                          : `No books found matching this criteria.`,
                    });
                  }}
                  className="bg-purple-500 text-white px-3 py-1.5 rounded text-xs font-medium"
                >
                  ✅ Apply
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
              className={`p-2 text-sm ${parsed.confirmed ? "text-purple-600" : "text-gray-500"}`}
            >
              {parsed.confirmed
                ? `✅ ${parsed.message}`
                : "❌ Filter cancelled."}
            </div>
          );
        }
        return null;
      },
    },
    [onApply],
  );
}
