"use client";
import { useActionState, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { signupAction } from "@/app/actions/auth";
import { signupSchema, TSignupSchema } from "@/lib/zod";
import { cn } from "@/lib/utils";
import { startTransition } from "react";

export default function Register() {
  const [state, formAction, isPending] = useActionState(signupAction, null);
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: TSignupSchema) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto sm:max-w-lg shadow-xl">
        <CardHeader className="flex flex-col items-center justify-between gap-4 mt-6">
          <CardTitle className="text-3xl sm:text-4xl font-bold">
            Welcome
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Sign up for an account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {/* LỖI SERVER (Ví dụ: Email đã tồn tại) */}
          <div className="h-14">
            {state?.error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-center gap-3 text-sm"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {state.message}
              </motion.div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
            {/* EMAIL */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </Label>
              <div className="relative group">
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
                    "pl-11 h-12",
                    errors.email &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                />
              </div>
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

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative group">
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
                  placeholder="Create a password"
                  className={cn(
                    "pl-11 pr-11 h-12",
                    errors.password &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 p-1 text-muted-foreground hover:text-foreground"
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
                      className="text-[11px] text-destructive font-medium block leading-tight"
                    >
                      {errors.password.message}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative group">
                <Lock
                  className={cn(
                    "absolute left-3.5 top-4 h-4 w-4 transition-colors z-10",
                    errors.confirmPassword
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                />
                <Input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={cn(
                    "pl-11 pr-11 h-12",
                    errors.confirmPassword &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 p-1 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="h-5 px-1">
                <AnimatePresence>
                  {errors.confirmPassword && (
                    <span className="text-[11px] text-destructive font-medium block">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <Button
              disabled={isPending}
              type="submit"
              className="w-full h-12 text-base font-semibold mt-4"
            >
              {isPending ? "Creating account..." : "Sign Up with Email"}
            </Button>

            <div className="text-center text-sm pt-6 border-t mt-6">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <button
                type="button"
                onClick={() => router.push("/signin")}
                className="text-foreground font-bold hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
