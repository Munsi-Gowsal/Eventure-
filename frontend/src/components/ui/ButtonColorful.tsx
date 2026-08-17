import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const ButtonColorful = React.forwardRef<HTMLButtonElement, ButtonColorfulProps>(
  ({ children, className, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={cn(
          "relative group overflow-hidden rounded-xl p-[1px] transition-all",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          className
        )}
        disabled={disabled}
        {...(props as any)}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
        <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl"></span>
        <div className="relative bg-[var(--color-bg-main)]/80 backdrop-blur-md rounded-xl px-8 py-4 transition-all duration-300 group-hover:bg-transparent">
          <span className="font-bold text-white tracking-wide group-hover:text-white transition-colors duration-300">
            {children}
          </span>
        </div>
      </motion.button>
    );
  }
);

ButtonColorful.displayName = 'ButtonColorful';
