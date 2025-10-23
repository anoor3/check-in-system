import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface SessionListProps {
  sessions: Array<{
    id: string;
    title: string | null;
    open_at: string;
    close_at: string;
    status: string;
    class_id: string;
    classes?: { name: string | null } | null;
  }>;
}

const statusVariant: Record<string, "default" | "success" | "warning" | "destructive"> = {
  open: "success",
  closed: "default",
  archived: "default",
  scheduled: "warning"
};

export function SessionList({ sessions }: SessionListProps) {
  if (!sessions.length) {
    return <p className="text-sm text-muted-foreground">No recent sessions. Start one to see realtime updates.</p>;
  }

  return (
    <ul className="space-y-3">
      {sessions.map((session) => (
        <li key={session.id} className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href={`/classes/${session.class_id}/sessions/${session.id}`} className="text-sm font-semibold hover:underline">
              {session.title || "Attendance session"}
            </Link>
            <p className="text-xs text-muted-foreground">
              {session.classes?.name ?? "Class"} · {formatDate(session.open_at)} – {formatDate(session.close_at)}
            </p>
          </div>
          <Badge variant={statusVariant[session.status] ?? "default"} className="self-start md:self-auto">
            {session.status}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
