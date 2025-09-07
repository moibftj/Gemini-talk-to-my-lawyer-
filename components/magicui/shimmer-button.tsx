import React from "react";
import { cn } from "../../lib/utils";

export const ShimmerButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-lg px-6 py-2 font-medium transition-all",
          "bg-blue-600 hover:bg-blue-700 text-white",
          "dark:bg-blue-500 dark:hover:bg-blue-600",
          "disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <span
          className="absolute inset-0 animate-[shimmer-slide] [background:linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.4)_50%,transparent_80%)]"
          style={{ '--speed': '2.5s' } as React.CSSProperties}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
