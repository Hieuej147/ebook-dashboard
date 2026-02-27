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

export const FilterButton = ({
  categories,
  filters,
  setFilters,
}: FilterButtonProps) => {
  // Đếm số lượng filter đang active để hiển thị Badge
  const activeCount = [
    filters.category !== "",
    filters.isActive !== undefined,
  ].filter(Boolean).length;

  const handleReset = () => {
    setFilters((prev: any) => ({
      ...prev,
      category: "",
      isActive: undefined,
      page: 1,
    }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-xl gap-2 h-11 border-slate-200 hover:bg-slate-50 relative"
        >
          <Filter
            size={16}
            className={activeCount > 0 ? "text-purple-600" : ""}
          />
          <span className="font-bold">Filter</span>
          {activeCount > 0 && (
            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-purple-600">
              {activeCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Filters</DropdownMenuLabel>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              className="h-auto p-0 text-[10px] text-red-500 hover:text-red-600 hover:bg-transparent"
              onClick={handleReset}
            >
              Reset all
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Lọc theo Category (Hiện Name - Lưu ID) */}
        <div className="py-2">
          <span className="px-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
            Categories
          </span>
          <ScrollArea className="h-[200px] mt-1">
            <DropdownMenuRadioGroup
              value={filters.category}
              onValueChange={(val) =>
                setFilters((prev: any) => ({ ...prev, category: val, page: 1 }))
              }
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

        {/* Lọc theo Trạng thái isActive */}
        <div className="py-2">
          <span className="px-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
            Status
          </span>
          <div className="flex flex-col gap-1 mt-1">
            <DropdownMenuCheckboxItem
              checked={filters.isActive === true}
              onCheckedChange={() =>
                setFilters((prev: any) => ({
                  ...prev,
                  isActive: true,
                  page: 1,
                }))
              }
              className="text-xs"
            >
              Active Books
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.isActive === false}
              onCheckedChange={() =>
                setFilters((prev: any) => ({
                  ...prev,
                  isActive: false,
                  page: 1,
                }))
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
