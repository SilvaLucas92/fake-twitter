import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8
        w-full
        sm:max-w-[640px]
        md:max-w-[768px]
        lg:max-w-[1024px]
        xl:max-w-[1100px]
        ${className}`}
    >
      {children}
    </div>
  );
}
