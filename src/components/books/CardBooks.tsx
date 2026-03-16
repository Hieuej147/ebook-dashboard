"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BookRow } from "./RowBook";
import { ScrollArea } from "../ui/scroll-area";
import DialogBook from "./DialogBook";
import { useBookFiltersTool_HumanLoop } from "../action-ai/useBookFiltersTool";
import { Loader2 } from "lucide-react";

type Book = {
  id: string;
  title: string;
  author: string;
  status: "DRAFT" | "PUBLISHED";
  coverImage?: string;
};

type Filters = {
  search: string;
  category: string;
  status: string;
};

export default function CardBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "",
    status: "",
  });

  const fetchBooks = useCallback(async (f: Filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: "1", limit: "10" });
      if (f.search) params.set("search", f.search);
      if (f.category) params.set("category", f.category);
      if (f.status)
        params.set("isActive", f.status === "PUBLISHED" ? "true" : "false");

      const res = await fetch(`/api/books/admin/all?${params.toString()}`);
      const data = await res.json();
      setBooks(data.data || []);
    } catch (e) {
      console.error("Failed to fetch books:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks(filters);
  }, [filters, fetchBooks]);

  // ✅ AI gọi tool này để lọc
  const handleFiltersUpdate = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);
  useBookFiltersTool_HumanLoop(handleFiltersUpdate);
  const handleRefresh = useCallback(
    () => fetchBooks(filters),
    [filters, fetchBooks],
  );
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-2xl">Book Library</h2>
            {(filters.search || filters.category || filters.status) && (
              <p className="text-xs text-purple-500 mt-1">
                🔍 Đang lọc
                {filters.search && `: "${filters.search}"`}
                {filters.status && ` · ${filters.status}`}
              </p>
            )}
          </div>
          <DialogBook />
        </CardTitle>
      </CardHeader>
      <ScrollArea className="max-h-[700px] mt-4 overflow-y-auto">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 flex justify-center py-8">
              <Loader2 className="animate-spin text-purple-500" />
            </div>
          ) : books.length === 0 ? (
            <div className="col-span-2 text-center text-muted-foreground py-8">
              Không tìm thấy sách nào
            </div>
          ) : (
            books.map((book) => (
              <BookRow
                key={book.id}
                image={book.coverImage || "/yuzuha.png"}
                title={book.title}
                author={book.author}
                star={0}
                status={book.status}
                onDelete={handleRefresh}
                onEdit={handleRefresh}
              />
            ))
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
