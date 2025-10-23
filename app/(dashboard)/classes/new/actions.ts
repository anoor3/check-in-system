"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { generateJoinCode } from "@/lib/join-code";

const schema = z.object({
  name: z.string().min(2),
  section: z.string().optional(),
  term: z.string().optional(),
  timezone: z.string(),
  schedule: z.string().optional()
});

export async function createClass(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Invalid input", issues: parsed.error.flatten().fieldErrors };
  }

  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const joinCode = generateJoinCode();
  const { error, data } = await supabase
    .from("classes")
    .insert({
      owner_id: user.id,
      name: parsed.data.name,
      section: parsed.data.section ?? null,
      term: parsed.data.term ?? null,
      timezone: parsed.data.timezone,
      join_code: joinCode,
      is_join_open: true
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  await supabase.from("enrollments").insert({ class_id: data.id, user_id: user.id, role: "ta" });

  revalidatePath("/dashboard");
  return { data };
}
