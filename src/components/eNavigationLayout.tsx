"use client";
import { useRouter } from "next/navigation";
import { useFrontendTool } from "@copilotkit/react-core/v2";
import { ReactNode, useState } from "react";
import { SidebarProvider } from "./ui/sidebar";
import AppSidebar from "./AppSidebar";
import Navbar from "./Navbar";
import { Toaster } from "sonner";
import { CopilotPopup } from "@copilotkit/react-ui";
import z from "zod";

interface LayoutProps {
  children: ReactNode;
  defaultOpen: boolean;
}

export function EBookLayout({ children, defaultOpen }: LayoutProps) {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(true);
  // AI TOOL: Giữ nguyên logic điều phối Route
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
          <CopilotPopup
            defaultOpen={false}
            instructions={"You are assisting..."}
            labels={{
              title: "Sidebar Assistant",
              initial: "How can I help you today?",
            }}
          />
        </SidebarProvider>
      </div>
    </>
  );
}
