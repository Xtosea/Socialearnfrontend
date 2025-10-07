import * as React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white shadow p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return (
    <div className={cn("mb-2 font-semibold text-lg", className)}>{children}</div>
  );
}

export function CardContent({ className, children }) {
  return <div className={cn("text-sm text-gray-600", className)}>{children}</div>;
}

export function CardFooter({ className, children }) {
  return (
    <div className={cn("mt-4 flex justify-end items-center gap-2", className)}>
      {children}
    </div>
  );
}