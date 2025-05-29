"use client";

import Button from "@/components/ui/button";
import { ErrorMsg } from "@/components/ui/error-msg";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        <ErrorMsg error={error.message} />
        <div className="flex justify-center">
          <Button onClick={reset} label="Try again" fullWidth={false} />
        </div>
      </div>
    </div>
  );
}
