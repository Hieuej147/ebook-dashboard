// Tạo ngay trong file đó hoặc tách file riêng
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchBar = ({
  defaultValue,
  onSearchSubmit,
}: {
  defaultValue: string;
  onSearchSubmit: (val: string) => void;
}) => {
  const [term, setTerm] = useState(defaultValue);

  return (
    <div className="relative w-full md:w-96">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        value={term}
        placeholder="Search by title..."
        className="pl-10 h-11 bg-white rounded-xl"
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearchSubmit(term)}
      />
    </div>
  );
};
const OrderStatusFilter = ({
  currentValue,
  onStatusChange,
}: {
  currentValue: string;
  onStatusChange: (val: string) => void;
}) => {
  return (
    <Select value={currentValue || "ALL"} onValueChange={onStatusChange}>
      <SelectTrigger className="w-full sm:w-40 bg-white">
        <SelectValue placeholder="Trạng thái" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">Tất cả</SelectItem>
        <SelectItem value="PENDING">Chờ xử lý</SelectItem>
        <SelectItem value="SHIPPED">Đang giao</SelectItem>
        <SelectItem value="DELIVERED">Đã giao</SelectItem>
        <SelectItem value="CANCELLED">Đã hủy</SelectItem>
      </SelectContent>
    </Select>
  );
};
export { SearchBar, OrderStatusFilter };
