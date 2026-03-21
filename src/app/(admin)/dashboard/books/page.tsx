import BooksDashboardClient from "@/components/books/BooksDashboardClient";
import { getAdminBooks, getAllcategories, getCategoriesList } from "@/lib/dal";

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const filters = {
    page: Number(params.page) || 1,
    limit: 12,
    search: (params.search as string) || "",
    category: (params.category as string) || "",
    isActive: params.isActive !== "false",
  };

  // fetch parallel
  const [booksData, categoriesData, categoriesRes] = await Promise.all([
    getAdminBooks(filters),
    getAllcategories({ page: 1, limit: 20 }),
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
