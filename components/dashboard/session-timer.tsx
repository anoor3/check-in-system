"use client";

import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/utils";

interface SessionTimerProps {
  closeAt: string;
  onExpire?: () => void;
}

export function SessionTimer({ closeAt, onExpire }: SessionTimerProps) {
  const target = new Date(closeAt).getTime();
  const [remaining, setRemaining] = useState(Math.max(0, Math.floor((target - Date.now()) / 1000)));

  useEffect(() => {
    const id = window.setInterval(() => {
      const seconds = Math.max(0, Math.floor((target - Date.now()) / 1000));
      setRemaining(seconds);
      if (seconds === 0) {
        window.clearInterval(id);
        onExpire?.();
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [target, onExpire]);

  return (
    <div className="rounded-2xl border border-border bg-muted/40 px-6 py-4 text-center">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">Session closes in</p>
      <p className="mt-2 font-display text-3xl font-semibold">{formatDuration(remaining)}</p>
      <p className="mt-1 text-xs text-muted-foreground">Ends at {new Date(closeAt).toLocaleTimeString()}</p>
    </div>
  );
}
