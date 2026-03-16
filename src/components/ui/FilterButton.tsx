"use client";

import { Filter, Check, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
}

interface FilterButtonProps {
  categories: Category[];
  filters: {
    category: string;
    isActive: boolean | undefined;
  };
  setFilters: (value: any) => void;
}

// components/ui/FilterButton.tsx

export const FilterButton = ({
  categories,
  filters,
  setFilters,
}: FilterButtonProps) => {
  const activeCount = [
    filters.category !== "",
    filters.isActive !== undefined,
  ].filter(Boolean).length;

  // SỬA: Không dùng (prev) => ... nữa
  const handleReset = () => {
    setFilters({
      category: "",
      isActive: "", // Để rỗng để xoá khỏi URL
      page: 1,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-xl gap-2 h-11 border-slate-200 hover:bg-slate-50 relative"
        >
          {/* ICON FILTER Ở ĐÂY NÈ HIẾU */}
          <Filter
            size={16}
            className={
              activeCount > 0
                ? "text-purple-600 fill-purple-50"
                : "text-slate-500"
            }
          />
          <span className="font-bold">Filter</span>

          {activeCount > 0 && (
            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-purple-600 text-[10px] text-white">
              {activeCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-sm font-bold">
            Filters
          </DropdownMenuLabel>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              className="h-auto p-0 text-[10px] text-red-500 hover:bg-transparent"
              onClick={handleReset}
            >
              Reset all
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Lọc theo Category */}
        <div className="py-2">
          <span className="px-2 text-[10px] font-black uppercase text-slate-400">
            Categories
          </span>
          <ScrollArea className="h-[200px] mt-1">
            <DropdownMenuRadioGroup
              value={filters.category}
              // SỬA: Truyền object thay đổi trực tiếp
              onValueChange={(val) => setFilters({ category: val, page: 1 })}
            >
              <DropdownMenuRadioItem value="" className="text-xs">
                All Categories
              </DropdownMenuRadioItem>
              {categories.map((cate) => (
                <DropdownMenuRadioItem
                  key={cate.id}
                  value={cate.id}
                  className="text-xs"
                >
                  {cate.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </ScrollArea>
        </div>

        <DropdownMenuSeparator />

        {/* Lọc theo Status (isActive) */}
        <div className="py-2">
          <span className="px-2 text-[10px] font-black uppercase text-slate-400">
            Status
          </span>
          <div className="flex flex-col gap-1 mt-1">
            <DropdownMenuCheckboxItem
              checked={filters.isActive === true}
              // SỬA: Nếu click vào thì set true, click lại thì bỏ lọc (rỗng)
              onCheckedChange={() =>
                setFilters({
                  isActive: filters.isActive === true ? "" : "true",
                  page: 1,
                })
              }
              className="text-xs"
            >
              Active Books
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.isActive === false}
              onCheckedChange={() =>
                setFilters({
                  isActive: filters.isActive === false ? "" : "false",
                  page: 1,
                })
              }
              className="text-xs"
            >
              Drafts / Inactive
            </DropdownMenuCheckboxItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
