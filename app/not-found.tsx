import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-4xl font-semibold">We lost that page</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        The page you're looking for might have moved or no longer exists. Let's get you back on track.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
