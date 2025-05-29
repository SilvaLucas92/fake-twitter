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
      <div className="text-center space-y-4">
        <ErrorMsg error={error.message} />
        <Button onClick={reset} label="Try again" />
      </div>
    </div>
  );
}
