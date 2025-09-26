import React from 'react';
import { cn } from '../lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "card-modern group relative overflow-hidden",
      "transform transition-all duration-500 hover:-translate-y-1",
      "animate-fade-in",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 p-6 relative z-10",
      "bg-gradient-to-r from-primary-50/50 to-gold-50/50 dark:from-primary-900/20 dark:to-gold-900/20",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold leading-tight tracking-tight",
      "bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500",
      "bg-clip-text text-transparent",
      "group-hover:from-primary-500 group-hover:to-gold-500 transition-all duration-300",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-gray-600 dark:text-gray-300",
      "group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0 relative z-10", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between p-6 pt-4 relative z-10",
      "border-t border-gray-100 dark:border-gray-700/50 mt-4",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
