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
  // The sparkle animation functionality has been removed.
  // The component now renders its children inside a simple span,
  // preserving any passed class names and props.
  return (
    <span className={cn(className)} {...props}>
      {children}
    </span>
  );
};