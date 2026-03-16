"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CustomPagination } from "@/components/CustomPagination";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function CategoryBooksClient({
  initialBooks,
  initialMeta,
  categoryId,
  currentFilters,
}: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(currentFilters.search);

  // Hàm Proxy URL
  const updateQuery = (newParams: Record<string, any>) => {
    startTransition(() => {
      const params = new URLSearchParams(window.location.search);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) params.set(key, value.toString());
        else params.delete(key);
      });
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const onSearch = () => updateQuery({ search: searchTerm, page: 1 });

  return (
    <div className="p-4 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/categories" className="font-medium">
              Categories
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-bold text-purple-600">Books in Category</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Book Collection</h1>
          <p className="text-slate-500 text-sm font-medium">
            Found <span className="text-purple-600 font-bold">{initialMeta.total}</span> books
          </p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
          <Input
            value={searchTerm}
            placeholder="Search in this category..."
            className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus-visible:ring-purple-500 shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
        </div>
      </div>

      {/* Grid hiển thị sách */}
      <div className={cn(
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 transition-opacity duration-300",
        isPending && "opacity-50 pointer-events-none"
      )}>
        {initialBooks.length > 0 ? (
          initialBooks.map((book: any) => (
            <Card
              key={book.id}
              className="group rounded-2xl overflow-hidden border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-3/4 bg-slate-50 relative overflow-hidden">
                <Image 
                  src={book.imageUrl || "/harry.jpg"} 
                  alt={book.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-purple-600/90 backdrop-blur-sm border-none shadow-lg">
                    {book.category}
                  </Badge>
                </div>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-purple-600 transition-colors">
                  {book.title}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  By <span className="text-slate-600">{book.author}</span>
                </p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-purple-600 font-black text-sm">
                    {book.price?.toLocaleString()}đ
                  </span>
                  <Badge variant="outline" className="text-[10px] border-slate-100 text-slate-500">
                    Stock: {book.stock}
                  </Badge>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-32 text-center flex flex-col items-center justify-center space-y-3">
             <div className="bg-slate-50 p-4 rounded-full">
                <Search size={32} className="text-slate-300" />
             </div>
             <p className="text-slate-400 font-medium italic">No books found in this category.</p>
          </div>
        )}
      </div>

      {/* Phân trang */}
      <div className="mt-10 pt-6 border-t flex justify-center">
        <CustomPagination
          meta={initialMeta}
          onPageChange={(p) => updateQuery({ page: p })}
        />
      </div>
    </div>
  );
}