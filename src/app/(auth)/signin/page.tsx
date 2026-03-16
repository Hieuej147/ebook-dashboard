"use client";
import { useActionState, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { loginSchema, TLoginSchema } from "@/lib/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { signinAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

export default function Login() {
  const [state, formAction, isPending] = useActionState(signinAction, null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // Chuyển data từ React Hook Form sang Server Action
  const onSubmit = async (data: TLoginSchema) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.remember) formData.append("remember", "true");

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <motion.div
      className="min-h-screen flex justify-between items-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto sm:max-w-lg shadow-xl">
        <CardHeader className="flex flex-col items-center justify-center gap-4 mt-6">
          <CardTitle className="text-3xl sm:text-4xl font-bold">
            Welcome back
          </CardTitle>
          <CardDescription className="text-base">
            Login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {/* LỖI TỪ SERVER (Dữ liệu không khớp) */}
          <div className="h-14">
            {/* Giữ chiều cao cố định cho vùng thông báo lỗi server */}
            {state?.message && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {state.message}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {/* EMAIL FIELD */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </Label>
              <div className="relative">
                {/* Icon Mail: Cố định vị trí so với Input */}
                <Mail
                  className={cn(
                    "absolute left-3.5 top-4 h-4 w-4 transition-colors z-10",
                    errors.email ? "text-destructive" : "text-muted-foreground",
                  )}
                />
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={cn(
                    "pl-11 h-12 focus-visible:ring-purple-500",
                    errors.email
                      ? "border-destructive focus-visible:ring-destructive"
                      : "",
                  )}
                />
              </div>
              {/* Error Zone: Giữ chỗ 20px để không đẩy layout */}
              <div className="h-5 px-1">
                <AnimatePresence>
                  {errors.email && (
                    <motion.span
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] text-destructive font-medium block"
                    >
                      {errors.email.message}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock
                  className={cn(
                    "absolute left-3.5 top-4 h-4 w-4 transition-colors z-10",
                    errors.password
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                />
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={cn(
                    "pl-11 h-12 focus-visible:ring-purple-500",
                    errors.password
                      ? "border-destructive focus-visible:ring-destructive"
                      : "",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="h-5 px-1">
                <AnimatePresence>
                  {errors.password && (
                    <motion.span
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] text-destructive font-medium block"
                    >
                      {errors.password.message}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* REMEMBER & FORGOT */}
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  onCheckedChange={(checked) => {
                    // Tự xử lý checked nếu cần gán vào RHF
                  }}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm cursor-pointer select-none"
                >
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                className="text-sm font-medium hover:underline text-purple-600"
              >
                Forgot password?
              </button>
            </div>

            <Button
              disabled={isPending}
              type="submit"
              className="w-full h-12 text-base font-semibold bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center text-sm pt-6 border-t mt-4">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="text-purple-600 font-bold hover:underline"
              >
                Sign up
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
