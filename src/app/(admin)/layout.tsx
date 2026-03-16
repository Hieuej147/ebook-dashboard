// app/admin/layout.tsx

import { cookies } from "next/headers";
import { EBookLayout } from "@/components/layout/DashboardLayout";
import { getSession } from "@/lib/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const session = await getSession();

  return (
    <>
      <EBookLayout defaultOpen={defaultOpen}>{children}</EBookLayout>
    </>
  );
}
