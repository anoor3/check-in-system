"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { Button } from "@/components/ui/button";

interface QRDisplayProps {
  token: string;
  expiresIn: number;
  onRefresh?: () => Promise<void> | void;
}

export function QRDisplay({ token, expiresIn, onRefresh }: QRDisplayProps) {
  const [secondsLeft, setSecondsLeft] = useState(expiresIn);

  useEffect(() => {
    setSecondsLeft(expiresIn);
  }, [token, expiresIn]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-3xl border border-border bg-background p-6 shadow-subtle">
        <QRCode value={`${process.env.NEXT_PUBLIC_BASE_URL ?? "https://pulsecheck.app"}/a/${token}`} size={240} includeMargin />
      </div>
      <p className="text-sm text-muted-foreground">Rotates in {secondsLeft}s</p>
      {onRefresh && (
        <Button variant="outline" onClick={() => onRefresh()}>
          Refresh now
        </Button>
      )}
    </div>
  );
}
