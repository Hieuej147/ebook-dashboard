interface OrderRowProps {
  id: string;
  title: string;
  status: "Completed" | "Processing" | "Pending";
}

const statusStyle = {
  Completed: "bg-green-100 text-green-600",
  Processing: "bg-blue-100 text-blue-600",
  Pending: "bg-yellow-100 text-yellow-600",
};

export function OrderRow({ id, title, status }: OrderRowProps) {
  return (
    <div className="flex items-center justify-between py-3">
      {/* Left */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{id}</span>
        <span className="text-xs text-muted-foreground">{title}</span>
      </div>

      {/* Right */}
      <span className={`text-xs px-2 py-1 rounded-2xl ${statusStyle[status]}`}>
        {status}
      </span>
    </div>
  );
}
