// app/admin/layout.tsx
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { CopilotPopup, CopilotSidebar } from "@copilotkit/react-ui";
import { Toaster } from "@/components/ui/sonner";
import { EBookLayout } from "@/components/eNavigationLayout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return <EBookLayout defaultOpen={defaultOpen}>{children}</EBookLayout>;
}
