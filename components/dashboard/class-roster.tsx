import { Badge } from "@/components/ui/badge";

interface ClassRosterProps {
  enrollments: Array<{
    user_id: string;
    status: string;
    role: string;
    profiles?: { full_name: string | null; email?: string | null } | null;
  }>;
}

export function ClassRoster({ enrollments }: ClassRosterProps) {
  if (!enrollments.length) {
    return <p className="text-sm text-muted-foreground">No students yet. Share the join code or QR.</p>;
  }

  return (
    <ul className="space-y-3">
      {enrollments.map((member) => (
        <li key={member.user_id} className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3">
          <div>
            <p className="text-sm font-semibold">{member.profiles?.full_name ?? "Unnamed"}</p>
            <p className="text-xs text-muted-foreground capitalize">{member.status}</p>
          </div>
          <Badge variant={member.role === "ta" ? "success" : "default"}>{member.role}</Badge>
        </li>
      ))}
    </ul>
  );
}
