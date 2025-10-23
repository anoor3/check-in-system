import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { MotionFadeIn } from "@/components/layout/motion-fade";
import { FeatureCard } from "@/components/layout/feature-card";

const features = [
  {
    title: "Rotating QR sessions",
    description: "Secure QR and code check-ins with geofencing and live windows.",
    icon: Sparkles
  },
  {
    title: "Realtime dashboards",
    description: "Monitor attendance as it happens, no refresh required.",
    icon: TrendingUp
  },
  {
    title: "Audit-ready reports",
    description: "Export CSV and PDF reports with full adjustment history.",
    icon: ShieldCheck
  }
];

export default function MarketingPage() {
  return (
    <div className="relative overflow-hidden">
      <section className="container mx-auto grid min-h-[80vh] place-items-center px-6 py-24">
        <MotionFadeIn className="max-w-4xl text-center">
          <span className="rounded-full bg-brand/10 px-4 py-1 text-sm font-semibold text-brand">
            Introducing PulseCheck
          </span>
          <h1 className="mt-6 text-balance font-display text-5xl font-semibold tracking-tight md:text-6xl">
            Attendance your campus can trust.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            PulseCheck blends delightful UX with uncompromising security. Professors run QR-powered sessions, students check in seamlessly, and admins gain clarity with actionable insights.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-base font-semibold text-white shadow-subtle transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-base font-semibold hover:-translate-y-0.5 hover:bg-muted"
            >
              Sign in
            </Link>
          </div>
        </MotionFadeIn>
      </section>

      <section className="bg-muted/40 py-24">
        <div className="container mx-auto grid gap-8 px-6 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-24">
        <MotionFadeIn className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-semibold">Designed for hybrid learning and beyond.</h2>
            <p className="mt-4 text-muted-foreground">
              With PulseCheck, your classes stay secure and accountable. Live QR sessions rotate every 15 seconds, and every manual adjustment leaves an audit trail.
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground">
              <p>• Built on Supabase Realtime and Row Level Security</p>
              <p>• Accessible from any device with WCAG AA compliance</p>
              <p>• Export CSV and PDF summaries for accreditation</p>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-background/80 p-8 shadow-subtle">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">Live session</p>
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              Watch check-ins stream in real time, extend windows, and rotate QR codes with one click.
            </p>
            <div className="mt-8 grid gap-4">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Session window</p>
                <p className="text-2xl font-semibold">5 minutes • Rotates every 15s</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Attendance</p>
                <p className="text-2xl font-semibold">Present 96% · Late 3% · Excused 1%</p>
              </div>
            </div>
          </div>
        </MotionFadeIn>
      </section>
    </div>
  );
}
