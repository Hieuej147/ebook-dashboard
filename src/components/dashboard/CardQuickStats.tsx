"use client";
import { useState, useCallback } from "react";
import { PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatItem } from "./StatItem";
import { useUpdateQuickStatsTool } from "../action-ai/useDashboardRender";
import { QuickStats } from "../action-ai/useStatsRender";


const DEFAULT: QuickStats = {
  conversion_rate: 3.24,
  avg_rating: 0.92,
  return_rate: 1.2,
};

export default function CardQuickStats() {
  const [stats, setStats] = useState<QuickStats>(DEFAULT);
  const handleUpdate = useCallback((data: QuickStats) => setStats(data), []);
  useUpdateQuickStatsTool(handleUpdate);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <PieChart className="w-5 h-5 text-purple-500" />
          <h1 className="font-bold text-[20px]">Quick Stats</h1>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <StatItem
          label="Conversion Rate"
          value={stats.conversion_rate}
          percent={Math.min(stats.conversion_rate * 10, 100)}
          color="#8B5CF6"
        />
        <StatItem
          label="Avg Rating"
          value={stats.avg_rating}
          percent={Math.min(stats.avg_rating * 100, 100)}
          color="#F59E0B"
        />
        <StatItem
          label="Return Rate"
          value={stats.return_rate}
          percent={Math.min(stats.return_rate * 10, 100)}
          color="#EF4444"
        />
      </CardContent>
    </Card>
  );
}
