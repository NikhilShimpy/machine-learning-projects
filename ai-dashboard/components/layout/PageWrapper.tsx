"use client";

import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function PageWrapper({
  children,
  className,
  title,
  description,
}: PageWrapperProps) {
  const sidebarCollapsed = useStore((state) => state.sidebarCollapsed);

  return (
    <motion.main
      initial={false}
      animate={{ marginLeft: sidebarCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen bg-background"
    >
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-neon-purple/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-neon-cyan/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-neon-pink/10 rounded-full blur-[100px]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>

      {/* Content */}
      <div className={cn("relative z-10 p-6 lg:p-8", className)}>
        {/* Page Header */}
        {(title || description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {title && (
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-white/60 text-lg">{description}</p>
            )}
          </motion.div>
        )}

        {children}
      </div>
    </motion.main>
  );
}
