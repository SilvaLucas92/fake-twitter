"use client";

import Button from "@/components/ui/button";
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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-red-500 mb-4">{error.message}</p>
      <Button onClick={reset} label="Try again" />
    </div>
  );
}
