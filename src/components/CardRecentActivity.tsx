import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface ActivityItem {
  id: string;
  title: string;
  time: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    title: "Published a new book",
    time: "2 minutes ago",
  },
  {
    id: "2",
    title: "Order #ORD-2024-004 completed",
    time: "1 hour ago",
  },
  {
    id: "3",
    title: "New user registered",
    time: "Yesterday",
  },
  {
    id: "4",
    title: "New user registered",
    time: "5 hour ago",
  },
  {
    id: "5",
    title: "New user registered",
    time: "12 hour ago",
  },
  {
    id: "6",
    title: "New user registered",
    time: "Yesterday",
  },
  {
    id: "7",
    title: "New user registered",
    time: "Yesterday",
  },
  {
    id: "8",
    title: "New user registered",
    time: "18 hour ago",
  },
];

const CardRecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="w-5 h-5 text-purple-500" />
          <span className="font-bold">Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <ScrollArea className="max-h-[420px] mt-4 overflow-y-auto">
        <CardContent className="space-y-4">
          {activities.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-1 border-l-2 border-purple-500 pl-3"
            >
              <p className="text-sm font-medium">{item.title}</p>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};
export default CardRecentActivity;
