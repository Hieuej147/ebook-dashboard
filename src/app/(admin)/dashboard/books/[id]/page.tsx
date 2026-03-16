import BookDetail from "@/components/books/BookDetail";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AuthorBookCard from "@/components/books/AuthorBookCard";
import PromoBanner from "@/components/books/PromoBanner";
import { notFound } from "next/navigation";
import axiosServer from "@/lib/axios-server";
import BookClubCard from "@/components/books/BookClubCard";

const BookDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  let bookData;

  try {
    // Axios tự lấy Token từ Cookie nhờ Interceptor chúng ta đã viết
    const res = await axiosServer.get(`/books/${id}`);
    bookData = res.data;
  } catch (error: any) {
    // Nếu NestJS báo 404, quăng ra trang 404 của Next.js ngay
    if (error.response?.status === 404) {
      notFound();
    }

    // Các lỗi khác thì báo lỗi hệ thống
    return (
      <div className="p-10 text-rose-500 font-semibold bg-rose-50 rounded-xl m-4">
        ❌ Lỗi: Không thể kết nối với máy chủ (Code:{" "}
        {error.response?.status || "500"})
      </div>
    );
  }
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
