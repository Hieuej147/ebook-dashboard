"use client";

import { useCallback, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomPagination } from "../CustomPagination"; // Nhớ dùng file Phân trang Proxy
import CategoryFolder from "@/components/categories/CategoryFolder";
import DialogBook from "@/components/books/DialogBook";
import { BookRow } from "@/components/books/RowBook";
import Link from "next/link";
import { FilterButton } from "@/components/ui/FilterButton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import DialogCategory from "@/components/categories/DialogCategory";
import { useBookFiltersTool } from "../action-ai/useBookFiltersTool";
import { SearchBar } from "../SearchBar";
import { EditBookID } from "./SheetEdit";

export default function BooksDashboardClient({
  initialBooks,
  initialMeta,
  initialCategories,
  categoriesFlat,
  currentFilters,
}: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // --- STATE CHỈ GIỮ LẠI CÁI CẦN THIẾT CHO UI ---
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || "");
  const [SelectedBookID, setSelectedBookID] = useState<null | string>(null);
  const searchParams = useSearchParams(); // Dùng hook chuẩn của Next
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // --- HÀM PROXY URL (THAY THẾ CHO FETCH) ---
  const updateQuery = useCallback(
    (newParams: Record<string, any>) => {
      startTransition(() => {
        // Dùng URLSearchParams kế thừa từ URL hiện tại
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.set(key, value.toString());
          } else {
            params.delete(key);
          }
        });
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams],
  );

  useBookFiltersTool((filters) => {
    // Nếu AI có truyền từ khóa search, update lại state của ô Input
    if (filters.search !== undefined) {
      setSearchTerm(filters.search);
    }

    // Đẩy toàn bộ params mà AI bóc tách được lên URL
    updateQuery({
      search: filters.search,
      categoryId: filters.categoryId,
      page: filters.page,
    });
  });

  return (
    <div className="grid grid-cols-12 gap-8 p-4 bg-primary-foreground min-h-screen">
      <div className="col-span-12 lg:col-span-9 space-y-6">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <SearchBar
            defaultValue={currentFilters.search || ""}
            onSearchSubmit={(val: any) => updateQuery({ search: val, page: 1 })}
          />

          <div className="flex items-center gap-3">
            <FilterButton
              categories={categoriesFlat} // Dùng data từ server
              filters={currentFilters}
              setFilters={(f: any) => updateQuery(f)} // Proxy lên URL
            />
            <DialogBook />
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="bg-primary-foreground rounded-3xl border shadow-sm overflow-hidden">
          <ScrollArea className="h-[calc(100vh-280px)] p-6">
            <div
              className={cn(
                "grid grid-cols-4 gap-6",
                isPending && "opacity-50",
              )}
            >
              {initialBooks.length > 0 ? (
                initialBooks.map((book: any) => (
                  <div
                    key={book.id}
                    className="col-span-4 md:col-span-2 lg:col-span-1"
                  >
                    <Link key={book.id} href={`/dashboard/books/${book.id}`}>
                      <BookRow
                        image={book.imageUrl || "/harry.jpg"}
                        star={5}
                        {...book}
                        onEdit={() => {
                          setSelectedBookID(book.id);
                          setIsSheetOpen(true);
                        }}
                      />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-slate-400">
                  Không tìm thấy sách nào.
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Phân trang (Dùng initialMeta từ Server) */}
          <div className="border-t p-4">
            <CustomPagination
              meta={initialMeta}
              onPageChange={(p) => updateQuery({ page: p })}
            />
          </div>
        </div>
      </div>

      {/* Sidebar Categories */}
      <aside className="col-span-12 lg:col-span-3 space-y-6">
        <div className="bg-primary-foreground p-6 rounded-3xl border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Categories
            </h2>
            <Link
              href="/dashboard/categories"
              className="text-purple-600 text-xs font-bold hover:underline transition-all"
            >
              See All
            </Link>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4 pr-2">
              {initialCategories.map((cate: any, index: number) => {
                // Mảng màu sắc
                const colors = [
                  "bg-blue-500",
                  "bg-purple-500",
                  "bg-orange-500",
                  "bg-pink-500",
                ];
                const color = colors[index % colors.length];

                // Tính % progress nếu cần
                const progressValue =
                  cate.bookCount > 0
                    ? Math.round(
                        ((cate.activeBookCount || 0) / cate.bookCount) * 100,
                      )
                    : 0;

                return (
                  <Link
                    href={`/dashboard/categories/${cate.id}`}
                    key={cate.id}
                    className="block group transition-transform active:scale-95"
                  >
                    <CategoryFolder
                      name={cate.name}
                      bookCount={cate.bookCount || 0}
                      color={color}
                      progress={progressValue}
                      description={cate.description || "No description"}
                    />
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
          <DialogCategory onSuccess={() => router.refresh()} />
        </div>
      </aside>

      <EditBookID
        id={SelectedBookID}
        open={isSheetOpen}
        categories={categoriesFlat}
        onOpenChange={setIsSheetOpen}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
