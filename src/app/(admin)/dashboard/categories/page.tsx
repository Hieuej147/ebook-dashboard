import CategoriesDashboardClient from "@/components/categories/CategoriesDashboardClient";
import { getAllcategories } from "@/lib/dal";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const filters = {
    page: Number(params.page) || 1,
    limit: 12, // Chia 4 cột nên để 12 cho đẹp Hiếu ạ
    search: (params.search as string) || "",
    isActive: params.isActive !== "false",
  };

  // Fetch data ngay tại Server
  const res = await getAllcategories(filters);

  return (
    <CategoriesDashboardClient
      initialCategories={res.data || []}
      initialMeta={res.meta}
      currentFilters={filters}
    />
  );
}
