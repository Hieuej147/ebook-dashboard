"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  useAgent,
  useFrontendTool,
  useInterrupt,
} from "@copilotkit/react-core/v2";
import { ReactNode, useMemo, useState } from "react";
import { SidebarProvider } from "../ui/sidebar";
import AppSidebar from "./AppSidebar";
import Navbar from "./Navbar";
import { Toaster } from "sonner";
import z from "zod";
import { useCoAgentStateRender } from "@copilotkit/react-core";
import { AgentState } from "@/lib/types";
import { Progress } from "../action-ai/Log";
import "@copilotkit/react-core/v2/styles.css";
import { useLangChainAgent } from "@/app/provider/AgentContext";
import { CopilotPopup, CopilotSidebar } from "@copilotkit/react-ui";
// import {
//   useOrderStatsRender,
//   useOverviewStatsRender,
//   useRevenueStatsRender,
//   useUserStatsRender,
// } from "./action-ai/useStatsRender.tsx";

interface LayoutProps {
  children: ReactNode;
  defaultOpen: boolean;
}

export function EBookLayout({ children, defaultOpen }: LayoutProps) {
  const { state, setState } = useLangChainAgent();
  const router = useRouter();
  useCoAgentStateRender<AgentState>({
    name: "default",
    render: ({ state }) => {
      if (state.logs?.length > 0) {
        return <Progress logs={state.logs} />;
      }
      return null;
    },
  });
  useFrontendTool({
    name: "navigateRoute",
    description:
      "Navigates the user to specific administrative sections within the dashboard. Use this tool when the user asks to see their books, manage users, or return to the main overview.",
    parameters: z.object({
      section: z
        .enum(["dashboard", "books", "users"])
        .describe("The target section to navigate to."),
      bookId: z
        .string()
        .optional()
        .describe(
          "The unique ID of a book. Provide this ONLY if the user wants to edit a specific book.",
        ),
    }),
    handler: async ({ section, bookId }) => {
      // Mapping routes based on your /admin folder structure
      const routes = {
        dashboard: "/dashboard",
        books: "/dashboard/books",
        users: "/dashboard/users",
      };

      let targetPath = routes[section];

      // Special logic for editing a book if an ID is provided
      if (section === "books" && bookId) {
        targetPath = `/edit/${bookId}`;
      }

      if (targetPath) {
        router.push(targetPath);
        return `Successfully navigated to ${section}${bookId ? ` (Book ID: ${bookId})` : ""}.`;
      }

      return `Navigation failed: Section '${section}' not recognized.`;
    },
  });
  return (
    <>
      <div className="flex">
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <main className="w-full">
            <Navbar />
            <div className="p-4">{children}</div>
            <Toaster />
          </main>
        </SidebarProvider>
        <CopilotSidebar
          onSubmitMessage={async (message) => {
            setState({ ...state, logs: [] });
            await new Promise((resolve) => setTimeout(resolve, 30));
          }}
          defaultOpen={false}
          labels={{
            initial: "Hi! How can I assist you with your research today?",
          }}
        />
      </div>
    </>
  );
}
