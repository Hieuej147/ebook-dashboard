// app/admin/dashboard/page.tsx

import CardBooks from "@/components/CardBooks";
import CardOrder from "@/components/CardRecentOrders";
import CardQuickStats from "@/components/CardQuickStats";
import { StatCard } from "@/components/StatCard";
import { Book, DollarSign, FileClock, Plus, Users2 } from "lucide-react";
import Todolist from "@/components/Todolist";
import CardCalender from "@/components/CardCalender";
import CardRecentActivity from "@/components/CardRecentActivity";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 2xl:col-span-4 flex flex-col gap-4">
          <h1 className="font-extrabold text-4xl text-primary">Dashboard</h1>
          <p className="text-primary">
            Welcome back! Here's your performance overview.
          </p>
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg col-span-1 lg:col-span-2 2xl:col-span-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value="$24,582"
              trend="12.5% from last month"
              icon="dollar"
              iconBgColor="bg-purple-500 text-white"
              chartColor="#a855f7"
              trendType="up"
              chartData={[
                { value: 20 },
                { value: 40 },
                { value: 30 },
                { value: 70 },
                { value: 50 },
              ]}
            />
            <StatCard
              title="Active Users"
              value="3,847"
              trend="8.2% from last week"
              trendType="up"
              icon="users"
              iconBgColor="bg-blue-500 text-white" // Card 1: Icon nền xanh đậm
              chartColor="#60a5fa"
              chartData={[
                { value: 20 },
                { value: 40 },
                { value: 30 },
                { value: 70 },
                { value: 50 },
              ]}
            />

            <StatCard
              title="Books Published"
              value="382"
              trend="5 new this week"
              trendType="up"
              icon="book"
              iconBgColor="bg-amber-500 text-white" // Card 2: Màu vàng cam
              chartColor="#fbbf24"
              chartData={[
                { value: 30 },
                { value: 50 },
                { value: 25 },
                { value: 60 },
                { value: 40 },
              ]}
            />

            <StatCard
              title="Orders Pending"
              value="42"
              trend="Awaiting processing"
              trendType="neutral"
              icon="clock"
              iconBgColor="bg-orange-500 text-white" // Card 3: Màu cam đậm
              chartColor="#fb923c"
              chartData={[
                { value: 15 },
                { value: 35 },
                { value: 20 },
                { value: 55 },
                { value: 45 },
              ]}
            />
          </div>
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg col-span-1 lg:col-span-2 2xl:col-span-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <CardBooks />
            <div className="flex flex-col gap-y-4">
              <CardOrder />
              <CardQuickStats />
            </div>
            <Todolist />
            <CardRecentActivity />
          </div>
        </div>
      </div>
    </>
  );
}
