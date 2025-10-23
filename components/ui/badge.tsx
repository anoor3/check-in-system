import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand/10 text-brand",
        success: "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
        warning: "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
        destructive: "border-transparent bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export type BadgeProps = VariantProps<typeof badgeVariants> & React.HTMLAttributes<HTMLDivElement>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
