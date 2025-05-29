import React from "react";

export const ErrorMsg = ({ error }: { error: string }) => (
  <div className="rounded-md bg-red-50 p-4">
    <div className="flex">
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">{error}</h3>
      </div>
    </div>
  </div>
);
