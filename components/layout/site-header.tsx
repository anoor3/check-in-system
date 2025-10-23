import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-display text-lg font-semibold">
          PulseCheck
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <nav className="hidden items-center gap-4 md:flex">
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/join" className="hover:text-foreground">
              Join class
            </Link>
            <Link href="/history" className="hover:text-foreground">
              History
            </Link>
          </nav>
          <ThemeToggle />
          {user ? (
            <form action="/auth/signout" method="post">
              <button className="rounded-full border border-border px-3 py-1 text-xs font-medium">Sign out</button>
            </form>
          ) : (
            <Link href="/signin" className="rounded-full border border-border px-3 py-1 text-xs font-medium">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
