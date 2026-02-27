"use client";

import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const BookActions = ({ book }: { book: any }) => {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Xóa sách: ${book.title}?`)) return;
    
    const res = await fetch(`/api/books/${book.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Đã xóa sách khỏi kho");
      router.refresh();
    } else {
      toast.error("Xóa thất bại!");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal size={16} /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => router.push(`/dashboard/books/${book.id}`)}>
          <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" /> Xóa sách
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};