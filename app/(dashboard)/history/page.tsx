import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: history } = await supabase
    .from("checkins")
    .select("status, method, created_at, attendance_sessions(title, classes(name))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Attendance history</h1>
          <p className="text-sm text-muted-foreground">Export and review your check-ins across all classes.</p>
        </div>
        <Button variant="outline">Export CSV</Button>
      </div>
      <div className="mt-8 space-y-3">
        {(history ?? []).map((entry, index) => (
          <div key={`${entry.created_at}-${index}`} className="rounded-2xl border border-border bg-muted/40 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{entry.attendance_sessions?.title ?? "Session"}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.attendance_sessions?.classes?.name ?? "Class"} · {formatDate(entry.created_at)}
                </p>
              </div>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium capitalize text-brand">
                {entry.status}
              </span>
            </div>
          </div>
        ))}
        {!history?.length && <p className="text-sm text-muted-foreground">No attendance records yet.</p>}
      </div>
    </div>
  );
}
