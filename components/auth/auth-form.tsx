"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters")
});

interface AuthFormProps {
  mode: "signin" | "signup";
}

type FormValues = z.infer<typeof schema>;

export function AuthForm({ mode }: AuthFormProps) {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const fn = mode === "signin" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
      const { error } = await fn({ email: values.email, password: values.password });
      if (error) throw error;
      toast.success(mode === "signin" ? "Welcome back!" : "Account created. Let's finish onboarding.");
      router.replace(mode === "signin" ? "/dashboard" : "/onboarding");
    } catch (error: any) {
      toast.error(error.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" placeholder="you@university.edu" {...register("email")} />
        {errors.email && <p className="text-sm text-rose-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
        {errors.password && <p className="text-sm text-rose-500">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
      </Button>
    </form>
  );
}
