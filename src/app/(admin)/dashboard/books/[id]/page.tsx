import BookDetail from "@/components/BookDetail";
import { fetchWithAuth } from "@/lib/dal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Check, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookClubCard from "@/components/BookClubCard";
import AuthorBookCard from "@/components/AuthorBookCard";
import PromoBanner from "@/components/PromoBanner";
import { notFound } from "next/navigation";

const BookDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  // GỌI API TRỰC TIẾP TẠI ĐÂY
  const res = await fetchWithAuth(`/books/${id}`, {
    method: "GET",
    next: { revalidate: 60 }, // Cache dữ liệu trong 60s
  });

  if (!res.ok) {
    if (res.status === 404) notFound(); // Trả về trang 404 nếu không thấy sách
    return (
      <div className="p-10 text-rose-500">
        Lỗi: Không thể lấy dữ liệu từ server
      </div>
    );
  }

  const bookData = await res.json();
  console.log(bookData);
  return (
    <>
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/books">Books</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {/**This is route book */}
                {bookData.id}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="mt-4 rounded-2xl p-4 bg-primary-foreground">
        <BookDetail data={bookData} />
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="col-span-1 lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold mt-4">Book Club</h2>
          <BookClubCard />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 mt-4">
            More by Abby Jimenez
          </h2>
          <div className="flex flex-col gap-4">
            <AuthorBookCard />
            <PromoBanner />
          </div>
        </div>
      </div>
    </>
  );
};
export default BookDetailPage;
