"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function markCheckin(token: string) {
  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/signin?redirect=/a/${token}`);
  }

  const { data, error } = await supabase.rpc("rpc_mark_checkin", {
    session_id: null,
    rotating_token: token,
    geo: null,
    device_fingerprint: null
  });

  if (error) {
    return { error: error.message };
  }

  return { data };
}
