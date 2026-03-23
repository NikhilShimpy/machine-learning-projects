"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "neon";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-white/10 text-white",
      success: "bg-neon-green/20 text-neon-green border-neon-green/30",
      warning: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
      error: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
      info: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
      neon: "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
