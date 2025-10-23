import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface Checkin {
  id: string;
  user_id: string;
  status: string;
  method: string;
  created_at: string;
  profiles?: { full_name: string | null } | null;
}

interface CheckinTableProps {
  checkins: Checkin[];
}

export function CheckinTable({ checkins }: CheckinTableProps) {
  if (!checkins.length) {
    return <p className="text-sm text-muted-foreground">No check-ins yet. The list updates in real time.</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th scope="col" className="px-4 py-3 text-left font-medium uppercase tracking-wide text-xs text-muted-foreground">
              Student
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium uppercase tracking-wide text-xs text-muted-foreground">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium uppercase tracking-wide text-xs text-muted-foreground">
              Method
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium uppercase tracking-wide text-xs text-muted-foreground">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/80 bg-background">
          {checkins.map((checkin) => (
            <tr key={checkin.id}>
              <td className="px-4 py-3 text-sm font-medium">{checkin.profiles?.full_name ?? "Unnamed"}</td>
              <td className="px-4 py-3">
                <Badge variant={checkin.status === "present" ? "success" : checkin.status === "late" ? "warning" : "default"}>
                  {checkin.status}
                </Badge>
              </td>
              <td className="px-4 py-3 capitalize">{checkin.method}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(checkin.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
