"use client";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/types/database";

export function createClient() {
  return createBrowserSupabaseClient<Database>();
}
