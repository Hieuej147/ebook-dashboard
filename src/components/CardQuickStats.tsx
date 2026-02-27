import { PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { StatItem } from "./StatItem";

export default function CardQuickStats() {
  return (
    <Card className="h-full">
      {/* Header */}
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <PieChart className="w-5 h-5 text-purple-500" />
          <h1 className="font-bold text-[20px]">Quick Stats</h1>
        </CardTitle>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-6">
        <StatItem
          label="Conversion Rate"
          value={3.24}
          percent={32}
          color="#8B5CF6" // purple
        />

        <StatItem
          label="Avg Rating"
          value={4.6 / 5.0}
          percent={92}
          color="#F59E0B" // yellow
        />

        <StatItem
          label="Return Rate"
          value={1.2}
          percent={12}
          color="#EF4444" // red
        />
      </CardContent>
    </Card>
  );
}
