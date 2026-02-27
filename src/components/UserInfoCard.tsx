"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import EditUser from "@/components/EditUser";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function UserInfoCard({
  user,
  onUserUpdate,
}: {
  user: any;
  onUserUpdate: (data: any) => void;
}) {
  const [open, setOpen] = useState(false);
  if (!user) {
    return (
      <div className="bg-primary-foreground p-4 rounded-lg space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-9 w-20" />
        </div>

        <div className="space-y-4 mt-4">
          <div className="flex flex-col gap-2 mb-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2 w-full" />
          </div>

          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between border-b pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/** Information Section */}
      <div className="bg-primary-foreground p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">User Information</h1>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="sm">Edit user</Button>
            </SheetTrigger>
            {/* Truyền dữ liệu sang component Edit để điền vào Form */}
            <EditUser
              initialData={user}
              onSuccess={(newData) => {
                onUserUpdate(newData); // Cập nhật state ở cha
                setOpen(false); // Đóng cái Sheet lại
              }}
            />
          </Sheet>
        </div>

        <div className="space-y-4 mt-4">
          <div className="flex flex-col gap-2 mb-6">
            <p className="text-muted-foreground text-sm">Profile completion</p>
            <Progress value={user.firstName && user.lastName ? 100 : 50} />
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-bold">Email:</span>
            <span className="text-muted-foreground">{user.email}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-bold">Role:</span>
            <Badge variant={user.role === "ADMIN" ? "destructive" : "default"}>
              {user.role}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Type:</span>
            <span className="text-sm uppercase">{user.customerType}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
