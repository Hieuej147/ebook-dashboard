"use client";
import { useEffect, useState, useTransition } from "react";
import CategoryFolder from "@/components/CategoryFolder";
import { getAllcategories } from "@/lib/dal";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils"; // Giả định bạn dùng shadcn/ui có sẵn hàm cn
import Link from "next/link";

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    isActive: true,
    search: "",
    page: 1,
    limit: 10,
  });
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isPending, startTransition] = useTransition();

  const fetchAllCategories = async () => {
    setIsLoading(true);
    try {
      const res = await getAllcategories(pagination);
      setCategories(res.data);
      setMeta(res.meta);
    } catch (error) {
      console.error("Lỗi fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Lắng nghe sự thay đổi của pagination để fetch lại data
  useEffect(() => {
    fetchAllCategories();
  }, [pagination]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      // Giữ UI cũ mờ đi thay vì biến mất bằng startTransition
      startTransition(() => {
        setPagination((prev) => ({ ...prev, page: newPage }));
      });
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const { page, totalPages } = meta;
    for (let i = 1; i <= totalPages; i++) {
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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">All Categories</h1>

      {/* Grid chính */}
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-all duration-300",
          (isPending || IsLoading) && categories.length > 0
            ? "pointer-events-none"
            : "opacity-100",
        )}
      >
        {/* TRƯỜNG HỢP 1: ĐANG LOAD LẦN ĐẦU (Chưa có data) -> Hiện Skeleton */}
        {IsLoading && categories.length === 0 ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-40 w-full bg-slate-100 animate-pulse rounded-2xl"
            />
          ))
        ) : categories.length > 0 ? (
          /* TRƯỜNG HỢP 2: ĐÃ CÓ DATA -> Render list (kể cả khi đang fetch trang mới) */
          categories.map((cate: any, index: number) => {
            const colors = [
              "bg-blue-500",
              "bg-purple-500",
              "bg-orange-500",
              "bg-pink-500",
            ];
            const color = colors[index % colors.length];
            const total = cate.bookCount || 0;
            const active = cate.activeBookCount || 0;
            const progressValue =
              total > 0 ? Math.round((active / total) * 100) : 0;

            return (
              <Link
                href={`/dashboard/categories/${cate.id}`}
                key={cate.id}
                className="block transition-transform hover:scale-105"
              >
                <CategoryFolder
                  name={cate.name}
                  bookCount={cate.bookCount}
                  color={color}
                  progress={progressValue}
                  description={cate.description || "No description"}
                />
              </Link>
            );
          })
        ) : (
          /* TRƯỜNG HỢP 3: KHÔNG CÓ DATA NÀO */
          <p className="text-sm text-slate-400 text-center col-span-full py-20">
            No categories found.
          </p>
        )}
      </div>

      {/* Thanh phân trang */}
      <div className="mt-8">
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
  );
}
