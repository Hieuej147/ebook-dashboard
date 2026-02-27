"use client";
import { Star, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card"; // Import từ Shadcn UI

export default function AuthorBookCard() {
  return (
    <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden group transition-all hover:shadow-md cursor-pointer">
      <CardContent className="p-5 flex gap-4 relative">
        {/* Ảnh bìa nhỏ */}
        <div className="w-24 h-32 shrink-0 rounded-lg overflow-hidden shadow-sm border border-slate-50">
          <img
            src="/harry.jpg"
            alt="The Friend Zone"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Thông tin nội dung */}
        <div className="flex flex-col gap-1.5 pr-6">
          <h4 className="font-bold text-slate-900 text-sm tracking-tight">
            The Friend Zone
          </h4>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              ClydeBank Business
            </span>
            <div className="flex items-center gap-0.5 text-yellow-400">
              <Star size={10} fill="currentColor" />
              <span className="text-[10px] font-bold text-slate-400 ml-0.5">
                3.5/5
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed italic line-clamp-3">
            "Kristen Peterson doesn't do drama. She will fight to the death for
            her friends, and has no room in her life for guys who just don't get
            her. She's also..."
          </p>

          {/* Nút mũi tên nhỏ ở góc dưới */}
          <div className="absolute bottom-5 right-5 w-6 h-6 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
            <ArrowRight size={14} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
