"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const roles = [
  {
    value: "professor",
    title: "Professor",
    description: "Create courses, manage sessions, and adjust attendance.",
    badge: "Faculty"
  },
  {
    value: "student",
    title: "Student",
    description: "Join classes, check in with QR codes, and download history.",
    badge: "Learner"
  }
] as const;

export function RoleSelect({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [selected, setSelected] = useState<(typeof roles)[number]["value"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    if (!selected) {
      toast.warning("Choose a role to continue");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.from("profiles").update({ role: selected }).eq("id", userId);
      if (error) throw error;
      toast.success("Profile updated");
      router.replace("/dashboard");
    } catch (error: any) {
      toast.error(error.message ?? "Could not update role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => setSelected(role.value)}
            className={cn(
              "flex flex-col gap-3 rounded-2xl border border-border bg-background/80 p-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand",
              selected === role.value && "border-brand ring-2 ring-brand"
            )}
          >
            <span className="inline-flex w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
              {role.badge}
            </span>
            <span className="text-lg font-semibold">{role.title}</span>
            <span className="text-sm text-muted-foreground">{role.description}</span>
          </button>
        ))}
      </div>
      <Button onClick={submit} className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Continue"}
      </Button>
    </div>
  );
}
