import * as React from "react";
import { cn } from "../../lib/utils";

export const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";