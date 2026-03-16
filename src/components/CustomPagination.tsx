"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Meta {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

interface CustomPaginationProps {
  meta: Meta;
  onPageChange: (page: number) => void;
}

export function CustomPagination({
  meta,
  onPageChange,
}: CustomPaginationProps) {
  const { page, totalPages } = meta;

  // Nếu không có dữ liệu hoặc chỉ có 1 trang thì ẩn luôn cho gọn
  if (!totalPages || totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const items = [];
    const siblingCount = 1; // Hiển thị 1 trang lân cận

    for (let i = 1; i <= totalPages; i++) {
      const isFirstPage = i === 1;
      const isLastPage = i === totalPages;
      const isWithinRange =
        i >= page - siblingCount && i <= page + siblingCount;

      if (isFirstPage || isLastPage || isWithinRange) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={page === i}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
              className={
                page === i
                  ? "bg-purple-600 hover:bg-purple-700 text-white border-none"
                  : "cursor-pointer hover:bg-slate-100"
              }
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      } else if (
        i === page - siblingCount - 1 ||
        i === page + siblingCount + 1
      ) {
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
    <Pagination className="justify-center">
      <PaginationContent>
        {/* Nút Previous */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
            className={
              page <= 1
                ? "pointer-events-none opacity-40"
                : "cursor-pointer hover:bg-purple-50 text-purple-600 transition-colors"
            }
          />
        </PaginationItem>

        {/* Danh sách số trang */}
        {renderPageNumbers()}

        {/* Nút Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) onPageChange(page + 1);
            }}
            className={
              page >= totalPages
                ? "pointer-events-none opacity-40"
                : "cursor-pointer hover:bg-purple-50 text-purple-600 transition-colors"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
