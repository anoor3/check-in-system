import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { JoinForm } from "@/components/dashboard/join-form";

interface Props {
  searchParams: { code?: string };
}

export default async function JoinPage({ searchParams }: Props) {
  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-3xl border border-border bg-background/80 p-8 shadow-subtle">
        <h1 className="text-3xl font-semibold">Join a class</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter a join code or scan a QR shared by your professor.</p>
        <div className="mt-8">
          <JoinForm initialCode={searchParams.code ?? ""} />
        </div>
      </div>
    </div>
  );
}
