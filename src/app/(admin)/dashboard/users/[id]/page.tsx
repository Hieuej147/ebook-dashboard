"use client";
import Todolist from "@/components/Todolist";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { BadgeCheck, Candy, Citrus, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartArea } from "@/components/ChartArea";
import UserInfoCard from "@/components/UserInfoCard";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { User } from "../columns";
import { TableSkeleton } from "@/components/TableSkeleton";
const UserDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    async function getData() {
      const res = await fetch(`/api/users/${id}`, { cache: "no-cache" });
      const data = await res.json();
      console.log(user);
      setUser(data);
      setLoading(false);
    }
    if (id) getData();
  }, [id]);

  const handleUpdate = (updatedData: any) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };
  if (loading) return <TableSkeleton />;

  return (
    <>
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/users">Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                  "User"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/**Container */}
      <div className="mt-4 flex flex-col xl:flex-row gap-8">
        {/**Left */}
        <div className="w-full xl:w-1/3 space-y-6">
          {/**User badges container */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <h1 className="text-xl font-semibold">User Badges</h1>
            <div className="flex gap-4 mt-4">
              <HoverCard>
                <HoverCardTrigger>
                  <BadgeCheck
                    size={36}
                    className="rounded-full bg-purple-500/30 border border-purple-500/50 p-2"
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2"> Verified User</h1>
                  <p className="text-sm text-muted-foreground">
                    This user be hover by Admin
                  </p>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger>
                  <Shield
                    size={36}
                    className="rounded-full bg-blue-500/30 border border-blue-500/50 p-2"
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2"> Verified User</h1>
                  <p className="text-sm text-muted-foreground">
                    This user be hover by Admin
                  </p>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger>
                  <Candy
                    size={36}
                    className="rounded-full bg-yellow-500/30 border border-yellow-500/50 p-2"
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2"> Verified User</h1>
                  <p className="text-sm text-muted-foreground">
                    This user be hover by Admin
                  </p>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger>
                  <Citrus
                    size={36}
                    className="rounded-full bg-red-500/30 border border-red-500/50 p-2"
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2"> Verified User</h1>
                  <p className="text-sm text-muted-foreground">
                    This user be hover by Admin
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          {/**User Information container*/}
          <UserInfoCard user={user} onUserUpdate={handleUpdate} />
          {/**Card List container */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <Todolist />
          </div>
        </div>
        {/**Right */}
        <div className="w-full xl:w-2/3 space-y-6">
          {/**User Card Container */}
          <div className="bg-primary-foreground p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-12">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="grayscale"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-semibold">
                {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                  "User"}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat
              dignissimos iusto placeat mollitia. Architecto ea dolorum optio in
              voluptates, quo dolor laudantium dolores veritatis magni facilis
              voluptatibus odio hic provident.
            </p>
          </div>
          {/**Chart Container */}
          <div className="bg-primary-foreground p-4 rounded-lg space-y-2">
            <h1 className="text-xl font-semibold">User Activity</h1>
            <ChartArea />
          </div>
        </div>
      </div>
    </>
  );
};
export default UserDetailPage;
