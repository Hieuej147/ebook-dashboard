import { columns, User } from "@/app/(admin)/dashboard/users/columns";
import { DataTable } from "@/app/(admin)/dashboard/users/data-table";
import { fetchWithAuth } from "@/lib/dal";

const UserTableContainer = async () => {
  // 1. Fetch toàn bộ dữ liệu từ NestJS
  // Vì là Server Component nên token sẽ tự lấy từ Cookie HttpOnly
  const response = await fetchWithAuth("/users");

  // 2. Kiểm tra lỗi nếu API không phản hồi
  if (!response.ok) {
    return (
      <div className="p-4 text-destructive bg-destructive/10 rounded-md">
        Không thể kết nối với máy chủ NestJS hoặc lỗi phân quyền.
      </div>
    );
  }

  // 3. Nhận mảng [User, User, ...] từ backend
  const users = await response.json();
  return (
    <div className="">
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default UserTableContainer;
