import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { SessionTimer } from "@/components/dashboard/session-timer";
import { QRDisplay } from "@/components/qr/qr-display";
import { CheckinTable } from "@/components/dashboard/checkin-table";
import { rotateToken, closeSession } from "./actions";
import { Button } from "@/components/ui/button";

interface Props {
  params: { id: string; sessionId: string };
}

export const dynamic = "force-dynamic";

export default async function SessionPage({ params }: Props) {
  const supabase = getSupabaseServerClient();
  const { data: session } = await supabase
    .from("attendance_sessions")
    .select("id,title,open_at,close_at,status,rotates_every_seconds,class_id")
    .eq("id", params.sessionId)
    .single();

  if (!session) {
    notFound();
  }

  const { data: rpcToken, error: tokenError } = await supabase.rpc("rpc_rotate_token", { session_id: params.sessionId });
  const liveToken = tokenError ? null : rpcToken?.token ?? null;

  const { data: checkins } = await supabase
    .from("checkins")
    .select("id,user_id,status,method,created_at,profiles(full_name)")
    .eq("session_id", params.sessionId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 px-6 py-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            {session.status === "open" ? "Live session" : session.status}
          </p>
          <h1 className="text-3xl font-semibold">{session.title ?? "Attendance session"}</h1>
        </div>
        <div className="flex items-center gap-3">
          <form action={rotateToken.bind(null, params.sessionId, params.id)}>
            <Button type="submit" variant="outline">
              Rotate now
            </Button>
          </form>
          <form action={closeSession.bind(null, params.sessionId, params.id)}>
            <Button type="submit" variant="destructive">
              Close session
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <div className="space-y-6">
          <SessionTimer closeAt={session.close_at} />
          {liveToken ? (
            <QRDisplay token={liveToken} expiresIn={session.rotates_every_seconds} />
          ) : (
            <p className="rounded-2xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
              {tokenError ? tokenError.message : "Generate a token to begin accepting check-ins."}
            </p>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Live check-ins</h2>
            <p className="text-sm text-muted-foreground">{checkins?.length ?? 0} responses</p>
          </div>
          <CheckinTable checkins={checkins ?? []} />
        </div>
      </div>
    </div>
  );
}
