import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).single();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-3xl border border-border bg-background/80 p-8 shadow-subtle">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">Update your profile details and preferences.</p>
        <form className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" defaultValue={profile?.full_name ?? ""} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user.email ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <p className="rounded-md border border-dashed border-border px-3 py-2 text-sm capitalize text-muted-foreground">
              {profile?.role ?? "student"}
            </p>
          </div>
          <Button type="submit" disabled>
            Save changes
          </Button>
        </form>
      </div>
    </div>
  );
}
