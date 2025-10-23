import "./globals.css";
import type { Metadata } from "next";
import { Inter, Spline_Sans } from "next/font/google";
import { RootProviders } from "@/components/layout/root-providers";
import { SiteHeader } from "@/components/layout/site-header";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spline = Spline_Sans({ subsets: ["latin"], variable: "--font-spline" });

export const metadata: Metadata = {
  title: "PulseCheck | Attendance that just works",
  description:
    "PulseCheck is a modern attendance platform with QR check-ins, realtime dashboards, and exportable reports.",
  metadataBase: new URL("https://pulsecheck.app"),
  openGraph: {
    title: "PulseCheck",
    description:
      "PulseCheck is a modern attendance platform with QR check-ins, realtime dashboards, and exportable reports.",
    url: "https://pulsecheck.app",
    siteName: "PulseCheck",
    locale: "en_US",
    type: "website"
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }]
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.auth.getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, spline.variable, "bg-background text-foreground")}>
        <RootProviders initialSession={data.session}>
          <div className="flex min-h-screen flex-col">
            <a
              href="#content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-subtle"
            >
              Skip to content
            </a>
            <SiteHeader />
            <main id="content" className="flex-1">
              {children}
            </main>
            <footer className="border-t border-border bg-muted/30 py-8 text-sm text-muted-foreground">
              <div className="container mx-auto flex flex-col gap-2 px-4 text-center md:flex-row md:items-center md:justify-between">
                <p>© {new Date().getFullYear()} PulseCheck. Built for learning communities.</p>
                <nav className="flex items-center justify-center gap-4">
                  <a href="/privacy" className="hover:text-foreground">
                    Privacy
                  </a>
                  <a href="/terms" className="hover:text-foreground">
                    Terms
                  </a>
                  <a href="/support" className="hover:text-foreground">
                    Support
                  </a>
                </nav>
              </div>
            </footer>
          </div>
        </RootProviders>
      </body>
    </html>
  );
}
