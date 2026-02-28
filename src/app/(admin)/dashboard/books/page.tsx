"use client";

import { useEffect, useState, useTransition } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CategoryFolder from "@/components/CategoryFolder";
import DialogBook from "@/components/DialogBook";
import { BookRow } from "@/components/RowBook";
import { getAdminBooks } from "@/lib/dal";
import Link from "next/link";
import { EditBookID } from "@/components/SheetEdit";
import { FilterButton } from "@/components/ui/FilterButton";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BooksDashboard() {
  // --- STATE MANAGEMENT ---
  const [searchTerm, setSearchTerm] = useState(""); // State giữ chữ đang gõ
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesFlat, setCategoriesFlat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({
    isActive: true,
    search: "",
    category: "",
    page: 1,
    limit: 12, // Tăng limit để khớp với lưới 4 cột
  });
  const [SelectedBookID, setSelectedBookID] = useState<null | string>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // --- API CALL (PROXY ROUTE) ---
  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const response = await getAdminBooks(filters);
      setBooks(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error("Failed to load admin books:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/category"); // Gọi đến Route Handler Next.js
      const result = await res.json();
      if (res.ok) {
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCategoriesFlat = async () => {
    try {
      // Lưu ý: Route này phải trỏ đến endpoint /category/all/list ở NestJS
      const res = await fetch("/api/category/list");
      const result = await res.json();
      if (res.ok) {
        setCategoriesFlat(result.data || []);
      }
    } catch (error) {
      console.error("Failed to load flat categories:", error);
    }
  };
  useEffect(() => {
    fetchAdminData();
  }, [filters]);
  useEffect(() => {
    fetchCates();
    fetchCategoriesFlat();
  }, []);
  // --- LOGIC PHÂN TRANG ---
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      startTransition(() => {
        setFilters((prev) => ({ ...prev, page: newPage }));
      });
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }
  };
  const triggerSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  };
  const handEditClick = (id: string) => {
    setSelectedBookID(id);
    setIsSheetOpen(true);
  };

  const handleCategoryClick = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === categoryId ? "" : categoryId, // Click lại lần nữa để bỏ lọc
      page: 1,
    }));
  };
  const renderPaginationItems = () => {
    const items = [];
    const { page, totalPages } = meta;

    for (let i = 1; i <= totalPages; i++) {
      // Hiển thị trang đầu, trang cuối, và các trang lân cận trang hiện tại
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={page === i}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      } else if (i === page - 2 || i === page + 2) {
        items.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }
    return items;
  };

  return (
    <div className="grid grid-cols-12 gap-8 p-4 bg-primary-foreground min-h-screen">
      {/* --- CỘT TRÁI (9/12): DANH SÁCH SÁCH --- */}
      <div className="col-span-12 lg:col-span-9 space-y-6">
        {/* Header & Search Bar */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
            <Input
              value={searchTerm}
              placeholder="Search by title, author, or SKU..."
              className="pl-10 h-11 bg-slate-50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-purple-500 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <FilterButton
              categories={categoriesFlat}
              filters={filters}
              setFilters={setFilters}
            />
            <DialogBook />
          </div>
        </div>

        {/* Gallery Grid với ScrollArea */}
        <div className="bg-primary-foreground rounded-3xl border shadow-sm overflow-hidden">
          <ScrollArea className="h-[calc(100vh-280px)] p-6">
            <div
              className={cn(
                "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300",
                (isPending || isLoading) && books.length > 0
                  ? "pointer-events-none"
                  : "opacity-100",
              )}
            >
              {isLoading && books.length === 0 ? (
                // Skeleton Loading Placeholder
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-3/4 bg-slate-100 animate-pulse rounded-2xl"
                  />
                ))
              ) : books.length > 0 ? (
                books.map((book: any) => (
                  <Link href={`/dashboard/books/${book.id}`} key={book.id}>
                    <BookRow
                      id={book.id}
                      key={book.id}
                      image={book.imageUrl || "/harry.jpg"}
                      title={book.title}
                      author={book.author}
                      star={5}
                      status={book.status}
                      onDelete={() => {}}
                      onEdit={() => {
                        handEditClick(book.id);
                      }}
                    />
                  </Link>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                  <Search size={48} className="mb-4 opacity-20" />
                  <p className="font-medium">
                    No books found matching your search.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
          <EditBookID
            id={SelectedBookID}
            open={isSheetOpen}
            categories={categoriesFlat}
            onOpenChange={setIsSheetOpen}
            onSuccess={fetchAdminData}
          />

          {/* PHẦN PHÂN TRANG (PAGINATION) */}
          <div className="border-t border p-4 bg-primary-foreground">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(meta.page - 1);
                    }}
                    className={
                      meta.page <= 1
                        ? "pointer-events-none opacity-40"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(meta.page + 1);
                    }}
                    className={
                      meta.page >= meta.totalPages
                        ? "pointer-events-none opacity-40"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>

      {/* --- CỘT PHẢI (3/12): CATEGORIES --- */}
      <aside className="col-span-12 lg:col-span-3 space-y-6">
        <div className="bg-primary-foreground p-6 rounded-3xl border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Categories
            </h2>
            <Link
              href="/dashboard/categories"
              className="text-purple-600 text-xs font-bold p-0 hover:underline"
            >
              See All
            </Link>
          </div>

          <div className="space-y-4">
            <ScrollArea className="h-[630px]">
              {isLoading && categories.length === 0 ? (
                // Skeleton cho Category
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-slate-100 animate-pulse rounded-2xl"
                  />
                ))
              ) : categories.length > 0 ? (
                categories.map((cate: any, index: number) => {
                  // Gán màu xoay vòng cho Folder
                  const colors = [
                    "bg-blue-500",
                    "bg-purple-500",
                    "bg-orange-500",
                    "bg-pink-500",
                  ];
                  const color = colors[index % colors.length];
                  // TÍNH TOÁN PROGRESS: (Sách đang bán / Tổng số sách) * 100
                  const total = cate.bookCount || 0;
                  const active = cate.activeBookCount || 0;
                  const progressValue =
                    total > 0 ? Math.round((active / total) * 100) : 0;
                  return (
                    <CategoryFolder
                      key={cate.id}
                      name={cate.name}
                      bookCount={cate.bookCount} // Giả sử NestJS có dùng include _count
                      color={color}
                      progress={progressValue} // Hoặc logic tính toán của bạn
                      description={cate.description || "No description"}
                      // onClick={() => handleCategoryClick(cate.id)}
                    />
                  );
                })
              ) : (
                <p className="text-sm text-slate-400 text-center">
                  No categories found.
                </p>
              )}
            </ScrollArea>
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
          </div>
        </div>
      </aside>
    </div>
  );
}
