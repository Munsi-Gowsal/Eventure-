import React from "react";
import { cn } from "../../lib/utils";

interface ShineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  glowColor?: string; // Optional custom gradient color (defaults to cyan / neon vibe)
}

export const ShineButton = React.forwardRef<HTMLButtonElement, ShineButtonProps>(
  ({ children, className, containerClassName, disabled, glowColor = "#00F5FF", ...props }, ref) => {
    return (
      <>
        <style>{`
          @keyframes shine-conic {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .shine-border-bg {
            background: conic-gradient(from 0deg, ${glowColor}, #000, #000, ${glowColor}, #000, #000, #000, ${glowColor});
            background-size: 300% 300%;
            animation: shine-conic 6s ease-out infinite;
          }
        `}</style>

        <div
          className={cn(
            "shine-border-bg inline-flex rounded-full p-[2px] transition duration-300",
            disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-cyan-500/20",
            containerClassName
          )}
        >
          <button
            ref={ref}
            disabled={disabled}
            className={cn(
              "px-8 py-2.5 text-sm font-medium text-white rounded-full bg-gray-950/90 backdrop-blur-md transition-all duration-300 w-full h-full flex items-center justify-center gap-2",
              disabled && "cursor-not-allowed",
              className
            )}
            {...props}
          >
            {children}
          </button>
        </div>
      </>
    );
  }
);

ShineButton.displayName = "ShineButton";

export default ShineButton;
