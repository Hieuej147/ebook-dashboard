interface OrderRowProps {
  id: string;
  title: string;
  status: "Completed" | "Processing" | "Pending";
}

const statusStyle: any = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  SHIPPED: "bg-blue-100 text-blue-700 border-blue-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

export function OrderRow({ id, title, status }: OrderRowProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{id}</span>
        <span className="text-xs text-muted-foreground">{title}</span>
      </div>
      <span className={`text-xs px-2 py-1 rounded-2xl ${statusStyle[status]}`}>
        {status}
      </span>
    </div>
  );
}
