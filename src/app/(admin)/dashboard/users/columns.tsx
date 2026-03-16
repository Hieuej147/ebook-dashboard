"use client";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { UserActions } from "@/components/users/UserActions";
enum Role {
  USER,
  ADMIN,
}

enum CustomerType {
  NORMAL,
  PREMIUM,
}

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  customerType: CustomerType;
  createdAt: Date;
};
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "firstName",
    header: "FirstName",
  },
  {
    accessorKey: "lastName",
    header: "LastName",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "customerType",
    header: "CustomerType",
    cell: ({ row }) => {
      const customerType = row.getValue("customerType");
      return (
        <div
          className={cn(
            "p-1 rounded-md w-max text-xs",
            customerType === "NORMAL" && "bg-yellow-500/40",
            customerType === "PREMIUM" && "bg-green-500/40",
          )}
        >
          {customerType as CustomerType}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return <UserActions userId={user.id} email={user.email} />;
    },
  },
];
