"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: "cyan" | "purple" | "pink" | "green" | "orange";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

export function ResultCard({
  title,
  value,
  subtitle,
  icon,
  color = "cyan",
  size = "md",
  animated = true,
  className,
}: ResultCardProps) {
  const colors = {
    cyan: "text-neon-cyan border-neon-cyan/30 shadow-neon-cyan",
    purple: "text-neon-purple border-neon-purple/30 shadow-neon-purple",
    pink: "text-neon-pink border-neon-pink/30 shadow-neon-pink",
    green: "text-neon-green border-neon-green/30 shadow-neon-green",
    orange: "text-neon-orange border-neon-orange/30 shadow-neon-orange",
  };

  const sizes = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  return (
    <motion.div
      initial={animated ? { opacity: 0, scale: 0.9 } : undefined}
      animate={animated ? { opacity: 1, scale: 1 } : undefined}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn(
        "glass rounded-2xl border p-6 text-center",
        colors[color].split(" ").slice(1).join(" "),
        className
      )}
    >
      {icon && (
        <div className="flex justify-center mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
              color === "cyan" && "from-neon-cyan/20 to-neon-cyan/5",
              color === "purple" && "from-neon-purple/20 to-neon-purple/5",
              color === "pink" && "from-neon-pink/20 to-neon-pink/5",
              color === "green" && "from-neon-green/20 to-neon-green/5",
              color === "orange" && "from-neon-orange/20 to-neon-orange/5"
            )}
          >
            {icon}
          </div>
        </div>
      )}

      <p className="text-white/50 text-sm font-medium mb-2 uppercase tracking-wider">
        {title}
      </p>

      <motion.p
        initial={animated ? { scale: 0.5, opacity: 0 } : undefined}
        animate={animated ? { scale: 1, opacity: 1 } : undefined}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
          delay: 0.2,
        }}
        className={cn("font-bold", sizes[size], colors[color].split(" ")[0])}
      >
        {value}
      </motion.p>

      {subtitle && (
        <p className="text-white/40 text-sm mt-2">{subtitle}</p>
      )}
    </motion.div>
  );
}

interface ConfidenceBarProps {
  value: number;
  label?: string;
  color?: "cyan" | "purple" | "pink" | "green" | "orange";
}

export function ConfidenceBar({
  value,
  label = "Confidence",
  color = "cyan",
}: ConfidenceBarProps) {
  const colors = {
    cyan: "from-neon-cyan to-neon-blue",
    purple: "from-neon-purple to-neon-pink",
    pink: "from-neon-pink to-neon-orange",
    green: "from-neon-green to-neon-cyan",
    orange: "from-neon-orange to-neon-pink",
  };

  const percentage = Math.round(value * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-white/60">{label}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-medium text-white"
        >
          {percentage}%
        </motion.span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full bg-gradient-to-r",
            colors[color]
          )}
        />
      </div>
    </div>
  );
}

interface RecommendationCardProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  color?: "cyan" | "purple" | "pink" | "green" | "orange";
}

export function RecommendationCard({
  title,
  items,
  icon,
  color = "cyan",
}: RecommendationCardProps) {
  const bgColors = {
    cyan: "from-neon-cyan/10 to-transparent border-neon-cyan/20",
    purple: "from-neon-purple/10 to-transparent border-neon-purple/20",
    pink: "from-neon-pink/10 to-transparent border-neon-pink/20",
    green: "from-neon-green/10 to-transparent border-neon-green/20",
    orange: "from-neon-orange/10 to-transparent border-neon-orange/20",
  };

  const textColors = {
    cyan: "text-neon-cyan",
    purple: "text-neon-purple",
    pink: "text-neon-pink",
    green: "text-neon-green",
    orange: "text-neon-orange",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border bg-gradient-to-b p-5",
        bgColors[color]
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("w-8 h-8", textColors[color])}>{icon}</div>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 text-sm text-white/70"
          >
            <span className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-r", {
              "from-neon-cyan to-neon-cyan": color === "cyan",
              "from-neon-purple to-neon-purple": color === "purple",
              "from-neon-pink to-neon-pink": color === "pink",
              "from-neon-green to-neon-green": color === "green",
              "from-neon-orange to-neon-orange": color === "orange",
            })} />
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
