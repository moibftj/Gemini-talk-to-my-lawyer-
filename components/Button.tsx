import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseStyles = [
      "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300",
      "transform hover:scale-105 active:scale-95",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
      "relative overflow-hidden",
    ];

    const variants = {
      primary: [
        "bg-legal-gradient text-white shadow-legal",
        "hover:shadow-neon-blue focus:ring-primary-500",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary-400 before:to-primary-600 before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-20",
      ],
      secondary: [
        "bg-gold-gradient text-white shadow-legal",
        "hover:shadow-neon-gold focus:ring-gold-500",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-gold-400 before:to-gold-600 before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-20",
      ],
      outline: [
        "border-2 border-primary-200 dark:border-primary-700 text-primary-600 dark:text-primary-400",
        "bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
        "hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-600",
        "focus:ring-primary-500",
      ],
      ghost: [
        "text-gray-700 dark:text-gray-300 bg-transparent",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "focus:ring-gray-300 dark:focus:ring-gray-600",
      ],
      success: [
        "bg-success-gradient text-white shadow-legal",
        "hover:shadow-legal-lg focus:ring-success-500",
      ],
      warning: [
        "bg-warning-gradient text-white shadow-legal",
        "hover:shadow-legal-lg focus:ring-warning-500",
      ],
    };

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-sm",
      lg: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && "cursor-wait",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        )}
        {leftIcon && !isLoading && <span className="flex-shrink-0">{leftIcon}</span>}
        <span className="relative z-10">{children}</span>
        {rightIcon && !isLoading && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };