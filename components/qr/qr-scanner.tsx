"use client";

import { useCallback } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";

import { Button } from "@/components/ui/button";

interface QRScannerProps {
  onScan: (value: string) => void;
  onError?: (error: Error) => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const handleDecode = useCallback(
    (result: string) => {
      if (result) {
        onScan(result);
      }
    },
    [onScan]
  );

  const handleError = useCallback(
    (error: Error | string) => {
      if (typeof error === "string") {
        onError?.(new Error(error));
      } else if (error) {
        onError?.(error);
      }
    },
    [onError]
  );

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-border">
        <QrScanner
          onDecode={handleDecode}
          onError={handleError}
          constraints={{ facingMode: "environment" }}
          scanDelay={300}
          containerStyle={{ width: "100%" }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Having trouble? Ensure camera permissions are granted or enter the join code manually.
      </p>
      <Button type="button" variant="outline" onClick={() => onScan("")}>
        Use code entry
      </Button>
    </div>
  );
}
