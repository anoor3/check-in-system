"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { joinClass } from "@/app/(dashboard)/join/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRScanner } from "@/components/qr/qr-scanner";
import { toast } from "sonner";

export function JoinForm({ initialCode = "" }: { initialCode?: string }) {
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);
  const [state, formAction, isPending] = useActionState(joinClass, {
    error: undefined as string | undefined,
    success: false,
    classId: undefined as string | undefined
  });

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error]);

  useEffect(() => {
    if (state?.success && state.classId) {
      toast.success("Joined class! Redirecting...");
      router.replace(`/classes/${state.classId}`);
    }
  }, [router, state?.success, state?.classId]);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="code">Enter join code</Label>
          <Input
            id="code"
            name="code"
            defaultValue={initialCode}
            placeholder="e.g. Q7X9LP"
            className="uppercase tracking-widest"
            required
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1" type="submit" disabled={isPending}>
            {isPending ? "Joining..." : "Join class"}
          </Button>
          <Button type="button" variant="outline" className="flex-1" onClick={() => setShowScanner((prev) => !prev)}>
            {showScanner ? "Hide scanner" : "Scan QR"}
          </Button>
        </div>
      </form>
      {showScanner && (
        <QRScanner
          onScan={(value) => {
            if (!value) return;
            try {
              const url = new URL(value);
              const token = url.pathname.split("/").pop() ?? "";
              router.push(`/a/${token}`);
            } catch (error) {
              toast.error("Invalid QR code");
            }
          }}
          onError={(error) => toast.error(error.message)}
        />
      )}
    </div>
  );
}
