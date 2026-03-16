import { columns, User } from "@/app/(admin)/dashboard/users/columns";
import { DataTable } from "@/app/(admin)/dashboard/users/data-table";
import axiosServer from "@/lib/axios-server";
import { notFound } from "next/navigation";

const UserTableContainer = async () => {
  let usersData;

  try {
    // Axios tự lấy Token từ Cookie nhờ Interceptor chúng ta đã viết
    const res = await axiosServer.get("/users");
    usersData = res.data;
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
    <div className="">
      <DataTable columns={columns} data={usersData} />
    </div>
  );
};

export default UserTableContainer;
