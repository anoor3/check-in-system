import Link from "next/link";
import { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign in • PulseCheck"
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/60 px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border bg-background/80 p-10 shadow-subtle backdrop-blur">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage your classes and attendance.</p>
        </div>
        <div className="mt-8">
          <AuthForm mode="signin" />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to PulseCheck?{" "}
          <Link href="/signup" className="font-medium text-brand hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
