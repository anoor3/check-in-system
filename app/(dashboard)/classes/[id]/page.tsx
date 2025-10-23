import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClassRoster } from "@/components/dashboard/class-roster";
import { SessionList } from "@/components/dashboard/session-list";

interface Props {
  params: { id: string };
}

export default async function ClassPage({ params }: Props) {
  const supabase = getSupabaseServerClient();
  const { data: klass } = await supabase
    .from("classes")
    .select("id,name,section,term,timezone,join_code,owner_id, created_at")
    .eq("id", params.id)
    .single();

  if (!klass) {
    notFound();
  }

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("user_id,status,role,profiles(full_name)")
    .eq("class_id", params.id)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  const { data: sessions } = await supabase
    .from("attendance_sessions")
    .select("id,title,open_at,close_at,status,class_id")
    .eq("class_id", params.id)
    .order("open_at", { ascending: false })
    .limit(5);

  const latestSessionId = sessions?.[0]?.id;

  return (
    <div className="space-y-8 px-6 py-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">{klass.term ?? "Term TBD"}</p>
          <h1 className="text-3xl font-semibold">{klass.name}</h1>
          <p className="text-sm text-muted-foreground">Section {klass.section ?? "—"} · {klass.timezone}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href={`/classes/${klass.id}/sessions/new`}>Schedule session</Link>
          </Button>
          <Button asChild disabled={!latestSessionId}>
            <Link href={latestSessionId ? `/classes/${klass.id}/sessions/${latestSessionId}` : `#`}>Open live view</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Share with students</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-dashed border-brand/60 bg-brand/5 px-6 py-4 text-center">
              <p className="text-xs uppercase tracking-wide text-brand">Join code</p>
              <p className="mt-2 text-3xl font-semibold tracking-widest">{klass.join_code ?? "------"}</p>
              <p className="mt-2 text-xs text-muted-foreground">Students can enter this code at pulsecheck.app/join</p>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/join?code=${klass.join_code ?? ""}`}>Copy join link</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roster</CardTitle>
          </CardHeader>
          <CardContent>
            <ClassRoster enrollments={enrollments ?? []} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <SessionList sessions={sessions ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
