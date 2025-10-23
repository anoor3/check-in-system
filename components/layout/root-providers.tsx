"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";

interface RootProvidersProps {
  children: React.ReactNode;
  initialSession?: Session | null;
}

export function RootProviders({ children, initialSession = null }: RootProvidersProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient<Database>());

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      <ThemeProvider>
        {children}
        <Toaster richColors position="bottom-center" />
      </ThemeProvider>
    </SessionContextProvider>
  );
}
