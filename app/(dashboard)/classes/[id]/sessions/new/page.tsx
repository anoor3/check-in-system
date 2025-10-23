import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const schema = z.object({
  title: z.string().min(2),
  duration: z.number().min(1).max(60)
});

export default async function NewSessionPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: klass } = await supabase.from("classes").select("name").eq("id", params.id).maybeSingle();
  if (!klass) {
    redirect("/classes");
  }

  async function createSession(formData: FormData) {
    "use server";
    const supabase = getSupabaseServerClient();
    const duration = Number(formData.get("duration"));
    const parsed = schema.safeParse({
      title: formData.get("title")?.toString() ?? "Attendance session",
      duration: Number.isFinite(duration) ? duration : 5
    });
    if (!parsed.success) {
      return;
    }
    await supabase.rpc("rpc_create_session", {
      class_id: params.id,
      params: {
        title: parsed.data.title,
        rotates_every_seconds: 15,
        close_at: new Date(Date.now() + parsed.data.duration * 60 * 1000).toISOString()
      }
    });
    revalidatePath(`/classes/${params.id}`);
    redirect(`/classes/${params.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold">Start a new session</h1>
        <p className="text-sm text-muted-foreground">Configure the window and share instantly with your class.</p>
      </div>
      <form action={createSession} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Session title</Label>
          <Input id="title" name="title" placeholder={`Week 3 · ${klass.name}`} defaultValue={`Attendance for ${klass.name}`} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input id="duration" name="duration" type="number" min={1} max={60} defaultValue={5} />
        </div>
        <Button type="submit">Create session</Button>
      </form>
    </div>
  );
}
