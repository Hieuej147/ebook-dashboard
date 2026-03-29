"use client";

import { MoreHorizontal, Trash2, UserSearch } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { apiFetch } from "@/lib/api-fetch";
interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning";
}
interface UserActionsProps {
  userId: string;
  email: string;
}

export const UserActions = ({ userId, email }: UserActionsProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await apiFetch(`/api/users/${userId}`, { method: "DELETE" });

      if (res.ok) {
        toast.success("Success deleted!");
        router.refresh(); 
      } else {
        toast.error("Unathentication");
      }
    } catch (error: any) {
      if (error?.message === "UNAUTHORIZED") return;
      toast.error("Error connected");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(userId)}
          >
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/users/${userId}`)}
          >
            <UserSearch className="mr-2 h-4 w-4" /> View Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => setIsModalOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Xóa người dùng?"
        description={`Bạn đang chuẩn bị xóa tài khoản ${email}. Toàn bộ dữ liệu liên quan sẽ bị mất.`}
      />
    </>
  );
};
export const ConfirmModal = ({
  open,
  onOpenChange,
  onConfirm,
  title = "Bạn có chắc chắn không?",
  description = "Hành động này không thể hoàn tác.",
  isLoading = false,
  variant = "danger",
}: ConfirmModalProps) => {
  const isDanger = variant === "danger";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle
            className={`flex items-center gap-2 ${isDanger ? "text-red-600" : "text-amber-600"}`}
          >
            <AlertTriangle size={20} />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="rounded-xl border-slate-200 hover:bg-slate-50">
            Hủy bỏ
          </AlertDialogCancel>
          <Button
            className={`rounded-xl ${
              isDanger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-amber-600 hover:bg-amber-700"
            } text-white`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Xác nhận"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
