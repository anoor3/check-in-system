"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";

const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

interface QRScannerProps {
  onScan: (value: string) => void;
  onError?: (error: Error) => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const handleScan = useCallback(
    (value: string | null) => {
      if (value) {
        onScan(value);
      }
    },
    [onScan]
  );

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-border">
        <QrReader
          delay={300}
          constraints={{ facingMode: "environment" }}
          onError={(error) => onError?.(error as Error)}
          onScan={handleScan}
          className="h-full w-full"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Having trouble? Ensure camera permissions are granted or enter the join code manually.
      </p>
      <Button type="button" variant="outline" onClick={() => onScan("")}>Use code entry</Button>
    </div>
  );
}
