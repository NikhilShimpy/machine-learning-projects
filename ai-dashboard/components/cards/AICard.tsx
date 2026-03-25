"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AICardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  gradient: string;
  status: "active" | "ready" | "standby";
  stats?: { label: string; value: string }[];
}

export function AICard({
  title,
  description,
  href,
  icon,
  gradient,
  status,
  stats,
}: AICardProps) {
  const statusColors = {
    active: "bg-neon-green text-neon-green",
    ready: "bg-neon-cyan text-neon-cyan",
    standby: "bg-neon-orange text-neon-orange",
  };

  const statusLabels = {
    active: "Active",
    ready: "Ready",
    standby: "Standby",
  };

  return (
    <Link href={href}>
      <motion.div
        className="group relative overflow-hidden rounded-2xl glass border border-white/5 p-6 h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient background on hover */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br",
            gradient
          )}
        />

        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={cn(
                "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                gradient
              )}
            >
              {icon}
            </div>
            <div className="flex items-center gap-2">
              <div className={cn("status-dot", status === "active" && "active")} />
              <span
                className={cn(
                  "text-xs font-medium",
                  statusColors[status].split(" ")[1]
                )}
              >
                {statusLabels[status]}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:gradient-text transition-all duration-300">
            {title}
          </h3>
          <p className="text-white/50 text-sm mb-4 line-clamp-2">{description}</p>

          {/* Stats */}
          {stats && (
            <div className="flex gap-4 mb-4">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/40">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Action */}
          <div className="flex items-center gap-2 text-white/60 group-hover:text-neon-cyan transition-colors">
            <span className="text-sm font-medium">Launch Module</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "gradient";
}

export function QuickActionCard({
  title,
  description,
  icon,
  onClick,
  variant = "default",
}: QuickActionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative w-full p-4 rounded-xl text-left group overflow-hidden",
        variant === "default"
          ? "glass border border-white/5"
          : "bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/20"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            variant === "default"
              ? "bg-white/5"
              : "bg-gradient-to-br from-neon-cyan to-neon-purple"
          )}
        >
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-white">{title}</h4>
          <p className="text-xs text-white/50">{description}</p>
        </div>
      </div>

      <Zap className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-hover:text-neon-cyan transition-colors" />
    </motion.button>
  );
}
