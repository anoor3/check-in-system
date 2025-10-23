import { redirect } from "next/navigation";
import { getUserFromServer } from "@/lib/supabase/server";
import { RoleSelect } from "@/components/onboarding/role-select";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await getUserFromServer();
  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/60 px-6 py-16">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-background/80 p-12 shadow-subtle backdrop-blur">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold">Tell us how you teach or learn</h1>
          <p className="text-sm text-muted-foreground">Choose a role to tailor PulseCheck to your needs.</p>
        </div>
        <div className="mt-10">
          <RoleSelect userId={user.id} />
        </div>
      </div>
    </div>
  );
}
