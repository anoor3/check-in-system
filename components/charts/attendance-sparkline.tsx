import { getSupabaseServerClient } from "@/lib/supabase/server";
import { cn, formatDate } from "@/lib/utils";

interface AttendanceSparklineProps {
  userId: string;
}

export async function AttendanceSparkline({ userId }: AttendanceSparklineProps) {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("checkins")
    .select("status, created_at, attendance_sessions(title, class_id)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(14);

  if (!data?.length) {
    return <p className="text-sm text-muted-foreground">No attendance history yet. Your first session will appear here.</p>;
  }

  const points = data
    .map((item) => ({
      status: item.status,
      created_at: item.created_at,
      title: item.attendance_sessions?.title ?? "Session"
    }))
    .reverse();

  const statusScore: Record<string, number> = {
    present: 1,
    late: 0.5,
    excused: 0.75,
    absent: 0
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        {points.map((point) => (
          <div key={point.created_at} className="flex w-full flex-col items-center gap-2">
            <div
              className={cn(
                "flex h-20 w-full items-end justify-center rounded-lg bg-muted/40 p-1",
                point.status === "absent" && "bg-rose-200/40 dark:bg-rose-500/10",
                point.status === "late" && "bg-amber-200/40 dark:bg-amber-500/10"
              )}
            >
              <div
                style={{ height: `${(statusScore[point.status] ?? 0) * 100}%` }}
                className="w-full rounded-full bg-brand"
              />
            </div>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {formatDate(point.created_at).split(",")[0]}
            </span>
          </div>
        ))}
      </div>
      <ul className="grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
        {points.slice(-4).map((point) => (
          <li key={point.created_at} className="rounded-md border border-border/60 bg-background/70 px-3 py-2">
            <span className="block text-foreground">{point.title}</span>
            <span className="capitalize">{point.status}</span> · {formatDate(point.created_at)}
          </li>
        ))}
      </ul>
    </div>
  );
}
