// app/admin/layout.tsx

import { cookies } from "next/headers";
import { EAdminLayout } from "@/components/layout/DashboardLayout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <>
      <EAdminLayout defaultOpen={defaultOpen}>{children}</EAdminLayout>
    </>
  );
}
