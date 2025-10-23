import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-background/80 p-8 shadow-subtle transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="mt-6 text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      <span className="absolute inset-x-0 bottom-0 h-1 scale-x-0 bg-brand transition group-hover:scale-x-100" aria-hidden />
    </article>
  );
}
