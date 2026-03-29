"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fetch";

interface DialogCategoryProps {
  onSuccess?: () => void;
}

const DialogCategory = ({ onSuccess }: DialogCategoryProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (res.ok) {
        toast.success("Tạo danh mục thành công!");
        setOpen(false);
        // Reset form
        setFormData({
          name: "",
          description: "",
          isActive: true,
        });
        if (onSuccess) onSuccess(); // Gọi lại hàm fetchCates ở ngoài
      } else {
        toast.error(result.message || "Có lỗi xảy ra");
      }
    } catch (error:any) {
      if (error?.message === "UNAUTHORIZED") return;
      toast.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-dashed border-2 py-10 rounded-2xl text-slate-400 gap-2 hover:bg-slate-50 hover:text-purple-600 hover:border-purple-200 transition-all group"
        >
          <Plus
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="font-bold">Create Category</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
            Thêm danh mục mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-xs font-black uppercase text-slate-400"
            >
              Tên danh mục
            </Label>
            <Input
              id="name"
              placeholder="Ví dụ: Science Fiction..."
              className="h-11 rounded-xl bg-slate-50 border-none focus-visible:ring-purple-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-xs font-black uppercase text-slate-400"
            >
              Mô tả ngắn
            </Label>
            <Textarea
              id="description"
              placeholder="Danh mục này nói về điều gì?"
              className="rounded-xl bg-slate-50 border-none focus-visible:ring-purple-500 min-h-[100px]"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100">
            <div className="space-y-0.5">
              <Label className="font-bold text-purple-900">
                Trạng thái hoạt động
              </Label>
              <p className="text-[10px] text-purple-600 font-medium italic">
                Cho phép hiển thị ngoài cửa hàng
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-purple-200 transition-all"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Xác nhận tạo danh mục"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCategory;
