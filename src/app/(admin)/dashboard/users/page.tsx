// src/app/dashboard/users/page.tsx
import { Suspense } from "react";

import { TableSkeleton } from "@/components/TableSkeleton";
import UserTableContainer from "@/components/UserTableContainer";

export default async function UserListPage() {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">List User</h1>

   
      <Suspense fallback={<TableSkeleton />}>
        <UserTableContainer />
      </Suspense>
    </div>
  );
}
