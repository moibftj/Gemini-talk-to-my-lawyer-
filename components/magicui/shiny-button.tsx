import React from 'react';
import { cn } from "../../lib/utils";
import { motion, type MotionProps } from "framer-motion";

const animationProps = {
  initial: { "--x": "100%" },
  animate: { "--x": "-100%" },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 0.5,
    duration: 1.5,
    ease: "linear",
  },
} as const;

type ShinyButtonProps = {
  children: React.ReactNode;
  className?: string;
} & MotionProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <motion.button
              ref={ref}
              className={cn(
                "relative overflow-hidden rounded-lg px-6 py-2 font-medium transition-all",
                "bg-blue-600/90 text-white",
                "dark:bg-blue-500/90",
                "disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed",
                className
              )}
              {...animationProps}
              {...props}
            >
              <span className="relative z-10 block h-full w-full text-sm tracking-wide">
                {children}
              </span>
              <span
                className="absolute inset-0 z-0 block"
                style={{
                    backgroundImage: "linear-gradient(-60deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
                    backgroundPosition: "var(--x)",
                    backgroundSize: "200% auto",
                }}
              />
            </motion.button>
        );
    }
);

ShinyButton.displayName = "ShinyButton";
