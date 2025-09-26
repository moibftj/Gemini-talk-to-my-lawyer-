import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  isLoading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, isLoading, type = 'text', id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="relative group">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium mb-2 transition-colors duration-200",
              error
                ? "text-red-600 dark:text-red-400"
                : isFocused
                ? "text-primary-600 dark:text-primary-400"
                : "text-gray-700 dark:text-gray-300"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              "input-modern w-full",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500",
              isLoading && "animate-pulse",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {(rightIcon || isLoading) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-slide-down">
            {error}
          </p>
        )}
      </div>
    );
  }
);

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, isLoading, id, rows = 4, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="relative group">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "block text-sm font-medium mb-2 transition-colors duration-200",
              error
                ? "text-red-600 dark:text-red-400"
                : isFocused
                ? "text-primary-600 dark:text-primary-400"
                : "text-gray-700 dark:text-gray-300"
            )}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            "input-modern w-full resize-y min-h-[100px]",
            error && "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500",
            isLoading && "animate-pulse",
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-slide-down">
            {error}
          </p>
        )}
      </div>
    );
  }
);

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  isLoading?: boolean;
}>(
  ({ className, label, error, isLoading, id, children, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="relative group">
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "block text-sm font-medium mb-2 transition-colors duration-200",
              error
                ? "text-red-600 dark:text-red-400"
                : isFocused
                ? "text-primary-600 dark:text-primary-400"
                : "text-gray-700 dark:text-gray-300"
            )}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "input-modern w-full cursor-pointer",
            error && "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500",
            isLoading && "animate-pulse",
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-slide-down">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
Textarea.displayName = "Textarea";
Select.displayName = "Select";

export { Input, Textarea, Select };
export type { InputProps, TextareaProps };