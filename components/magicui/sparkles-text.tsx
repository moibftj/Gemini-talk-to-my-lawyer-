import React from "react";
import { cn } from "../../lib/utils";

interface SparklesTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

export const SparklesText: React.FC<SparklesTextProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "relative inline-block text-shimmer font-bold tracking-tight",
        "animate-glow",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span
        className="absolute inset-0 animate-pulse bg-gradient-to-r from-primary-400/20 via-gold-400/20 to-primary-400/20 blur-sm"
        aria-hidden="true"
      />
    </span>
  );
};