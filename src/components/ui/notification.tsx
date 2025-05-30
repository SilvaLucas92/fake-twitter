import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

interface NotificationProps {
  type: "error" | "success";
  message: string;
}

export function Notification({ type, message }: NotificationProps) {
  const isError = type === "error";

  return (
    <div
      className={`rounded-md p-4 border-2 ${
        isError ? "bg-red-50 border-red-600" : "bg-green-50 border-green-600"
      }`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {isError ? (
            <AlertCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
          ) : (
            <CheckCircle
              className="h-5 w-5 text-green-600"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="ml-3">
          <p
            className={`text-sm font-medium ${
              isError ? "text-red-800" : "text-green-800"
            }`}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
