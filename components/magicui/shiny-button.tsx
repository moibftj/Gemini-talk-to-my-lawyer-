import React from 'react';
import { cn } from "../../lib/utils";
import { motion, type MotionProps, type AnimationProps } from "motion/react";

const animationProps = {
  initial: { "--x": "100%", scale: 1 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.97 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 10,
      damping: 5,
      mass: 0.1,
    },
  },
} as AnimationProps;

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
                "relative rounded-lg px-6 py-2 font-medium transition-all",
                "bg-blue-600 hover:bg-blue-700 text-white",
                "dark:bg-blue-500 dark:hover:bg-blue-600",
                "disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed",
                className
              )}
              {...animationProps}
              {...props}
            >
              <span
                className="relative block h-full w-full text-sm tracking-wide"
                style={{
                  maskImage:
                    "linear-gradient(-75deg,rgba(0,0,0,0) calc(var(--x) + 20%),rgba(0,0,0,1) calc(var(--x) + 30%),rgba(0,0,0,0) calc(var(--x) + 100%))",
                }}
              >
                {children}
              </span>
              <span
                style={{
                  mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
                  maskComposite: "exclude",
                }}
                className="absolute inset-0 z-10 block rounded-[inherit] p-px"
              >
                 <span
                    className="absolute inset-px z-10 block rounded-[inherit]"
                    style={{
                        backgroundImage: "linear-gradient(-75deg, rgba(255,255,255,0.1) calc(var(--x) + 20%), rgba(255,255,255,0.5) calc(var(--x) + 25%), rgba(255,255,255,0.1) calc(var(--x) + 100%))",
                    }}
                 />
              </span>
            </motion.button>
        );
    }
);

ShinyButton.displayName = "ShinyButton";
