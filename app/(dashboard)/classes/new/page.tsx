import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createClass } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const timezones = Intl.supportedValuesOf("timeZone");

export default async function NewClassPage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold">Create a class</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Set up the essentials so students can join instantly.
        </p>
      </div>
      <form action={createClass} className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Course name</Label>
            <Input id="name" name="name" required placeholder="Introduction to Data Science" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input id="section" name="section" placeholder="A" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="term">Term</Label>
              <Input id="term" name="term" placeholder="Fall 2024" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              name="timezone"
              required
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              defaultValue={Intl.DateTimeFormat().resolvedOptions().timeZone}
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule (optional)</Label>
            <textarea
              id="schedule"
              name="schedule"
              className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              placeholder="e.g. Tuesdays & Thursdays · 10:30 – 11:45"
            />
          </div>
        </div>
        <Button type="submit" className="w-full md:w-auto">
          Save class
        </Button>
      </form>
    </div>
  );
}
