"use client";
import { FileClock, LucideIcon, Users2 } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, BookOpen, Activity } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  dollar: DollarSign,
  users: Users2,
  book: BookOpen,
  activity: Activity,
  clock: FileClock,
};

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  icon: string;
  trendType: "up" | "neutral" | "down"; // Để đổi màu xanh/cam
  iconBgColor: string; // Ví dụ: "bg-blue-100 text-blue-600"
  chartData: { value: number }[];
  chartColor: string;
}

export const StatCard = ({
  title,
  value,
  trend,
  trendType,
  icon,
  iconBgColor,
  chartData,
  chartColor,
}: StatCardProps) => {
  const Icon = ICON_MAP[icon];
  const chartConfig = {
    value: { label: "Data", color: chartColor },
  } satisfies ChartConfig;

  return (
    <Card className="rounded-2xl p-4 shadow-sm border flex flex-col justify-between min-h-[220px]">
      {/* Phần trên: Title và Icon */}
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="space-y-4">
          <p className="text-muted-foreground font-medium text-sm">{title}</p>
          <h2 className="text-3xl font-bold text-primary mt-1">{value}</h2>

          {/* Trend text */}
          <p
            className={`text-xs mt-2 font-medium ${
              trendType === "up" ? "text-emerald-500" : "text-orange-400"
            }`}
          >
            {trendType === "up" ? "↑" : ""} {trend}
          </p>
        </CardTitle>

        {/* Icon box */}
        <div
          className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${iconBgColor}`}
        >
          <Icon size={28} strokeWidth={2.5} className="text-primary" />
        </div>
      </CardHeader>

      {/* Phần dưới: Biểu đồ Mini */}
      <div className="h-12 w-full mt-4">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <Bar
                dataKey="value"
                fill={chartColor}
                radius={[6, 6, 6, 6]}
                barSize={100}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
};
