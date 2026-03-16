// app/dashboard/categories/[id]/page.tsx
import CategoryBooksClient from "@/components/categories/CategoryBooksClient";
import { getAdminBooks } from "@/lib/dal";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sParams = await searchParams;

  const filters = {
    category: id,
    page: Number(sParams.page) || 1,
    limit: 15, // 5 cột nên để limit là bội số của 5
    search: (sParams.search as string) || "",
    isActive: undefined,
  };

  // Lấy dữ liệu sách thuộc Category này
  const response = await getAdminBooks(filters);

  return (
    <CategoryBooksClient
      initialBooks={response.data || []}
      initialMeta={response.meta}
      categoryId={id}
      currentFilters={filters}
    />
  );
}
