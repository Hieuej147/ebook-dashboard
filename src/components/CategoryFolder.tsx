// components/admin/CategoryFolder.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Folder, MoreHorizontal } from "lucide-react";

interface CategoryProps {
  name: string;
  bookCount: number;
  color: string;
  progress: number;
  description: string;
}

export default function CategoryFolder({ name, bookCount, color, progress, description }: CategoryProps) {
  return (
    <Card className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          {/* Icon Thư mục với màu sắc động */}
          <div className={`p-3 rounded-xl ${color} text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
            <Folder size={20} fill="currentColor" fillOpacity={0.3} />
          </div>
          <button className="text-slate-300 hover:text-slate-600 transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="space-y-1">
          <h4 className="font-bold text-slate-900 text-sm tracking-tight">{name}</h4>
          <p className="text-[10px] text-slate-400 line-clamp-1 italic">{description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>{bookCount} Books</span>
            <span>{progress}% Active</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-slate-100" />
        </div>
      </CardContent>
    </Card>
  );
}