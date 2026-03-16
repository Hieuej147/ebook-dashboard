"use client";
import { Info, MoreVertical } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function   BookClubCard() {
  return (
    <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        {/* Title với icon menu dọc */}
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-lg font-bold text-slate-800">
            Cozy Classics
          </CardTitle>
          <MoreVertical size={18} className="text-slate-400 cursor-pointer" />
        </div>

        {/* Danh sách thông tin mục tiêu */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Reader Goal</span>
            <span className="font-bold text-slate-800">50 Pages</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">
              Start-End Timeline
            </span>
            <span className="font-bold text-slate-800">07/08 → 07/16</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Progress Status</span>
            <span className="text-blue-500 font-bold">Discussion Ongoing</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Banner thông báo nhỏ màu vàng-cam */}
        <div className="bg-[#fff9eb] border border-[#fef0c7] p-3 rounded-xl flex items-center gap-3 text-[#b54708] text-sm">
          <Info size={16} className="shrink-0" />
          <span className="font-bold underline cursor-pointer">
            Chapter 5 Today
          </span>
        </div>

        {/* Progress Bar với màu Cam đặc trưng */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-400 uppercase tracking-widest">
              Progress Bar
            </span>
            <span className="text-slate-800">52%</span>
          </div>
          <Progress value={52} color="#f28c28" />
        </div>

        {/* Nhóm Avatar và số lượng thành viên */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            <Avatar className="w-8 h-8 border-2 border-white">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8 border-2 border-white">
              <AvatarImage src="https://github.com/maxleiter.png" />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8 border-2 border-white">
              <AvatarImage src="https://github.com/evilrabbit.png" />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-rose-50 text-rose-600 text-[10px] font-black flex items-center justify-center">
              +8
            </div>
          </div>
          <span className="text-xs text-slate-400 font-bold">982 members</span>
        </div>
      </CardContent>

      <CardFooter>
        {/* Nút Join Now dạng Outline cam */}
        <Button
          variant="outline"
          className="w-full border-2 border-[#f28c28] text-[#f28c28] hover:bg-orange-50 font-bold rounded-xl py-6"
        >
          Join Now
        </Button>
      </CardFooter>
    </Card>
  );
}
