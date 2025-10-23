import { redirect } from "next/navigation";
import { markCheckin } from "./actions";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

interface Props {
  params: { token: string };
}

export const dynamic = "force-dynamic";

export default async function CheckinPage({ params }: Props) {
  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/signin?redirect=/a/${params.token}`);
  }

  const result = await markCheckin(params.token);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-background/80 p-10 text-center shadow-subtle">
        {result?.error ? (
          <>
            <h1 className="text-3xl font-semibold text-rose-500">Check-in failed</h1>
            <p className="mt-3 text-sm text-muted-foreground">{result.error}</p>
            <Button asChild className="mt-6" variant="outline">
              <a href="/dashboard">Return to dashboard</a>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold text-emerald-500">You're in!</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your attendance has been recorded. You can review it anytime in your history.
            </p>
            <Button asChild className="mt-6">
              <a href="/history">View history</a>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
