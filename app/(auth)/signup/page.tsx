import Link from "next/link";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create account • PulseCheck"
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/60 px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border bg-background/80 p-10 shadow-subtle backdrop-blur">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-muted-foreground">Join as a professor or student in minutes.</p>
        </div>
        <div className="mt-8">
          <AuthForm mode="signup" />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="font-medium text-brand hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
