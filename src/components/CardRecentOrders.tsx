
import { CheckCircleIcon, CheckIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderRow } from "./OrderRow";
import { Button } from "./ui/button";

export default function CardOrder() {
  return (
    <Card className="h-full">
      {/* Header */}
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckCircleIcon className="w-5 h-5 text-purple-500" />
          <h1 className="font-bold text-[20px]">Recent Orders</h1>
        </CardTitle>
      </CardHeader>

      {/* Content */}
      <CardContent className="divide-y">
        <OrderRow id="#ORD-2024-001" title="Future of AI" status="Completed" />
        <OrderRow
          id="#ORD-2024-002"
          title="Web Dev Guide"
          status="Processing"
        />
        <OrderRow
          id="#ORD-2024-003"
          title="Sustainable Living"
          status="Pending"
        />
      </CardContent>

      {/* Footer */}
      <CardFooter>
        <Button
          variant="outline"
          className="w-full border-purple-500 text-purple-500 transition-colors duration-200 ease-in-out hover:bg-purple-500 hover:text-white"
        >
          View All Orders
        </Button>
      </CardFooter>
    </Card>
  );
}
