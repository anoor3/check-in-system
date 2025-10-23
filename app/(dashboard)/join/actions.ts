"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  code: z.string().min(4)
});

export async function joinClass(prevState: { error?: string; success?: boolean; classId?: string } | undefined, formData: FormData) {
  const rawCode = formData.get("code");
  const parsed = schema.safeParse({ code: typeof rawCode === "string" ? rawCode.trim().toUpperCase() : rawCode });
  if (!parsed.success) {
    return { error: "Invalid code" };
  }

  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: klass, error: classError } = await supabase
    .from("classes")
    .select("id")
    .eq("join_code", parsed.data.code)
    .maybeSingle();

  if (classError || !klass) {
    return { error: "Join code not found or expired" };
  }

  const { error } = await supabase
    .from("enrollments")
    .upsert({ class_id: klass.id, user_id: user.id, role: "student", status: "active" }, { onConflict: "class_id,user_id" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true, classId: klass.id };
}
