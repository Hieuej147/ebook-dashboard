"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { Badge } from "@/components/ui/badge";
import { getAdminBooks } from "@/lib/dal";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function CategoryBooksPage() {
  const { id } = useParams(); // Đây chính là categoryId truyền từ trang trước
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    isActive: undefined,
    search: "",
    category: id as string,
    page: 1,
    limit: 12, // Tăng limit để khớp với lưới 4 cột
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchBooksByCategory() {
      setLoading(true);
      try {
        // Gọi API findAll ở Backend với query category=[id]
        // Lưu ý: route thực tế của Hiếu là /books/admin/all theo ảnh Screensho
        const response = await getAdminBooks(filters);
        setBooks(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.error("Lỗi lấy danh sách sách:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchBooksByCategory();
  }, [id, filters]);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }
  };
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      startTransition(() => {
        setFilters((prev) => ({ ...prev, page: newPage }));
      });
    }
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
    <div className="p-2 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/categories">
              Categories
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Books in Category</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Book Collection</h1>
          <p className="text-slate-500 text-sm">
            Found {meta.total} books for this category
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="col-span-full">
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
        </div>
        {loading ? (
          // Hiển thị Skeleton khi đang load
          Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
          ))
        ) : books.length > 0 ? (
          books.map((book: any) => (
            <Card
              key={book.id}
              className="rounded-2xl overflow-hidden border transition duration-200 ease-in-out hover:scale-105"
            >
              <div className="aspect-3/4 bg-slate-200 relative overflow-hidden">
                <Image src={book.imageUrl || "/harry.jpg"} alt="book" fill />
                <Badge className="absolute top-2 right-2 bg-purple-600">
                  {book.category}
                </Badge>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-slate-800 line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-500 italic">
                  By {book.author}
                </p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-purple-600 font-black">
                    {book.price?.toLocaleString()}đ
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Stock: {book.stock}
                  </span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-2">
            <p className="text-slate-400 italic">
              No books found in this category.
            </p>
          </div>
        )}
      </div>
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
  );
}
