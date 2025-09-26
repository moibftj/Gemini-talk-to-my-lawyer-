import React from "react";
import { cn } from "../../lib/utils";

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "relative isolate overflow-hidden rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300",
        "bg-legal-gradient hover:shadow-neon-blue transform hover:scale-105 active:scale-95",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none",
        className,
      )}
      {...props}
    >
      <span className="relative z-20">{children}</span>
      <span
        aria-hidden="true"
        className="absolute inset-0 z-10 animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.6),transparent)] bg-[length:200%_100%] opacity-0 hover:opacity-100 transition-opacity duration-500"
      />
    </button>
  );
});
ShimmerButton.displayName = "ShimmerButton";
