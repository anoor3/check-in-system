"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function closeSession(sessionId: string, classId: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("attendance_sessions")
    .update({ status: "closed", close_at: new Date().toISOString() })
    .eq("id", sessionId);
  if (error) {
    return { error: error.message };
  }
  revalidatePath(`/classes/${classId}/sessions/${sessionId}`);
  return { success: true };
}

export async function rotateToken(sessionId: string, classId: string) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.rpc("rpc_rotate_token", { session_id: sessionId });
  if (error) {
    return { error: error.message };
  }
  revalidatePath(`/classes/${classId}/sessions/${sessionId}`);
  return { data };
}
