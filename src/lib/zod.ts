import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu phải chứa ít nhất 6 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái viết hoa")
    .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ cái viết thường")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một số")
    .regex(/[^a-zA-Z0-9]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"),
  remember: z.boolean().optional(),
});

export const signupSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .regex(/[A-Z]/, "Cần ít nhất 1 chữ hoa")
      .regex(/[a-z]/, "Cần ít nhất 1 chữ thường")
      .regex(/[0-9]/, "Cần ít nhất 1 số")
      .regex(/[^a-zA-Z0-9]/, "Cần ít nhất 1 ký tự đặc biệt"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"], // Lỗi sẽ hiển thị ở ô confirmPassword
  });

export const formSchema = z.object({
  id: z.string().uuid(),
  firstname: z.string().min(2).max(50),
  lastname: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.enum(["ADMIN", "USER"]),
  customerType: z.enum(["NORMAL", "PREMIUM"]),
  createdAt: z.string().datetime(),
});

export const BookSchema = z.object({
  id: z.string().readonly(), // Không cho phép ghi đè mức Type
  categoryId: z.string().min(1, "Danh mục là bắt buộc"),
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  subtitle: z.string().optional().nullable(),
  author: z.string().min(1, "Tác giả là bắt buộc"),
  description: z.string().optional().nullable(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  sku: z.string().min(1),
  imageUrl: z.any().optional().nullable(),
  category: z.string().min(1, "Danh mục là bắt buộc"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  isActive: z.boolean(),

  // Các trường thời gian
  createdAt: z.string().datetime().readonly(),
  updatedAt: z.string().datetime().readonly(),
});

export type TSignupSchema = z.infer<typeof signupSchema>;

export type TLoginSchema = z.infer<typeof loginSchema>;

export type TFormSchema = z.infer<typeof formSchema>;

export type UpdateBookInput = z.infer<typeof BookSchema>;

// 👇 TYPE DÙNG CHO react-hook-form
export type TFormInput = z.input<typeof formSchema>;

// 👇 TYPE DÙNG SAU KHI submit (backend)
export type TFormOutput = z.output<typeof formSchema>;
