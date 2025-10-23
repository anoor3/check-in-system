import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/types/database";

const protectedPaths = [
  "/dashboard",
  "/classes",
  "/join",
  "/history",
  "/settings"
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });
  const supabase = createMiddlewareSupabaseClient<Database>({ req: request, res: response });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const path = request.nextUrl.pathname;
  const isProtected = protectedPaths.some((route) => path.startsWith(route));

  if (!session && isProtected) {
    const redirectUrl = new URL("/signin", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/classes/:path*", "/join", "/history", "/settings"]
};
