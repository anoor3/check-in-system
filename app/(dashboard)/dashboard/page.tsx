import { redirect } from "next/navigation";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceSparkline } from "@/components/charts/attendance-sparkline";
import { SessionList } from "@/components/dashboard/session-list";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: ownedClasses } = await supabase
    .from("classes")
    .select("id,name,section,term,timezone,created_at")
    .eq("owner_id", user.id)
    .limit(6);

  const { data: enrolledClasses } = await supabase
    .from("enrollments")
    .select("classes(id,name,section,term,timezone,created_at)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .limit(6);

  const mergedClasses = [
    ...(ownedClasses ?? []),
    ...((enrolledClasses ?? []).map((entry) => entry.classes).filter(Boolean) as { id: string; name: string; section: string | null; term: string | null; timezone: string; created_at: string }[])
  ];
  const classes = mergedClasses.filter((klass, index, array) => array.findIndex((item) => item.id === klass.id) === index);

  const { data: sessions } = await supabase
    .from("attendance_sessions")
    .select("id,title,open_at,close_at,status,class_id,classes(name)")
    .gte("open_at", new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString())
    .order("open_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8 px-6 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </p>
          <h1 className="text-3xl font-semibold">Pulse overview</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link href="/classes/new">Create class</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/join">Join class</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active classes</CardTitle>
            <p className="text-sm text-muted-foreground">
              You have {classes.length} classes connected to your account.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {(classes ?? []).map((klass) => (
                <div key={klass.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">{klass.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {klass.section ? `${klass.section} · ` : ""}
                      {klass.term ?? "Term TBA"}
                    </p>
                  </div>
                  <Badge variant="default">{klass.timezone}</Badge>
                </div>
              ))}
              {classes.length === 0 && <p className="text-sm text-muted-foreground">No classes yet. Create or join one to get started.</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent sessions</CardTitle>
            <p className="text-sm text-muted-foreground">Monitor the latest attendance sessions across your classes.</p>
          </CardHeader>
          <CardContent>
            <SessionList sessions={sessions ?? []} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance momentum</CardTitle>
          <p className="text-sm text-muted-foreground">Snapshot of attendance over the past 7 sessions.</p>
        </CardHeader>
        <CardContent>
          <AttendanceSparkline userId={user.id} />
        </CardContent>
      </Card>
    </div>
  );
}
