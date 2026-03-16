// app/dashboard/books/page.tsx
import BooksDashboardClient from "@/components/books/BooksDashboardClient";
import { getAdminBooks, getAllcategories, getCategoriesList } from "@/lib/dal";

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // 1. Chuẩn hóa filter từ URL
  const filters = {
    page: Number(params.page) || 1,
    limit: 12,
    search: (params.search as string) || "",
    category: (params.category as string) || "",
    isActive: params.isActive !== "false", // mặc định true
  };

  // 2. Fetch dữ liệu song song tại Server
  const [booksData, categoriesData, categoriesRes] = await Promise.all([
    getAdminBooks(filters),
    getAllcategories({ page: 1, limit: 20 }), // Sidebar lấy 20 cái đầu
    getCategoriesList(),
  ]);

  return (
    <BooksDashboardClient
      initialBooks={booksData.data || []}
      initialMeta={booksData.meta}
      initialCategories={categoriesData.data || []}
      categoriesFlat={categoriesRes.data || []}
      currentFilters={filters}
    />
  );
}
