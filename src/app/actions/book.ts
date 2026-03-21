// "use server";
// import { revalidatePath } from "next/cache";

// export async function createCategoryAction(formData: any) {
//   const res = await fetch(`${process.env.NESTJS_API_URL}/category`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(formData),
//   });

//   if (res.ok) {
//     // Ép Server Component load lại dữ liệu mới nhất
//     revalidatePath("/dashboard/books");
//     return { success: true };
//   }
//   return { success: false };
// }


// export async function updateBookAction(id: string, formData: FormData) {
//   try {
//     const res = await fetch(`${process.env.NESTJS_API_URL}/books/${id}`, {
//       method: "PATCH",
//       // Khi gửi FormData, KHÔNG set Content-Type để trình duyệt tự xử lý Boundary
//       body: formData, 
//       // Nhớ truyền Token nếu API yêu cầu (lấy từ session trong dal.ts)
//     });

//     const result = await res.json();

//     if (res.ok) {
//       revalidatePath("/dashboard/books"); // Làm tươi danh sách sách
//       return { success: true };
//     }
//     return { success: false, message: result.message };
//   } catch (error) {
//     return { success: false, message: "Lỗi kết nối server" };
//   }
// }