"use client";

import { useTransition } from "react";
import CategoryFolder from "@/components/categories/CategoryFolder";
import { CustomPagination } from "@/components/CustomPagination"; // Dùng bản Proxy URL
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CategoriesDashboardClient({
  initialCategories,
  initialMeta,
  currentFilters,
}: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // --- HÀM PROXY URL (GIỐNG BÊN BOOKS) ---
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

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-900">All Categories</h1>
        <p className="text-sm text-slate-400">
          Total: <b>{initialMeta.total}</b> categories
        </p>
      </div>

      {/* Grid hiển thị */}
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-300",
          isPending && "opacity-50 pointer-events-none",
        )}
      >
        {initialCategories.length > 0 ? (
          initialCategories.map((cate: any, index: number) => {
            const colors = [
              "bg-blue-500",
              "bg-purple-500",
              "bg-orange-500",
              "bg-pink-500",
            ];
            const color = colors[index % colors.length];
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
                className="block transition-transform hover:scale-105 active:scale-95"
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
          <div className="col-span-full py-20 text-center text-slate-400">
            No categories found.
          </div>
        )}
      </div>

      {/* Phân trang ra giữa cực chuẩn */}
      <div className="mt-10 flex justify-center border-t pt-6">
        <CustomPagination
          meta={initialMeta}
          onPageChange={(p) => updateQuery({ page: p })}
        />
      </div>
    </div>
  );
}
