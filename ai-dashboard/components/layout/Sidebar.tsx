"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AudioWaveform,
  Calculator,
  MessageSquareText,
  Video,
  HeartPulse,
  Brain,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    gradient: "from-neon-cyan to-neon-blue",
  },
  {
    name: "Audio AI",
    href: "/dashboard/audio",
    icon: AudioWaveform,
    gradient: "from-neon-purple to-neon-pink",
  },
  {
    name: "Numeric AI",
    href: "/dashboard/numeric",
    icon: Calculator,
    gradient: "from-neon-green to-neon-cyan",
  },
  {
    name: "Text AI",
    href: "/dashboard/text",
    icon: MessageSquareText,
    gradient: "from-neon-orange to-neon-pink",
  },
  {
    name: "Video AI",
    href: "/dashboard/video",
    icon: Video,
    gradient: "from-red-500 to-neon-orange",
  },
  {
    name: "Health AI",
    href: "/dashboard/health",
    icon: HeartPulse,
    gradient: "from-neon-pink to-red-500",
  },
  {
    name: "Image AI",
    href: "/dashboard/image",
    icon: Brain,
    gradient: "from-neon-cyan to-neon-blue",
  },
  {
    name: "History",
    href: "/dashboard/history",
    icon: History,
    gradient: "from-neon-blue to-neon-purple",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    gradient: "from-white/50 to-white/30",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useStore();

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-screen glass-dark border-r border-white/5 z-40 flex flex-col"
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <motion.div
              className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink p-[2px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-neon-cyan" />
              </div>
            </motion.div>
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-lg font-bold gradient-text">
                    Neural Nexus
                  </h1>
                  <p className="text-xs text-white/40">AI Platform</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <motion.div
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-white/10"
                          : "hover:bg-white/5"
                      )}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className={cn(
                            "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b",
                            item.gradient
                          )}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200",
                          isActive
                            ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                            : "bg-white/5"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5 transition-colors",
                            isActive ? "text-white" : "text-white/60"
                          )}
                        />
                      </div>

                      {/* Label */}
                      <AnimatePresence mode="wait">
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                              "font-medium transition-colors",
                              isActive ? "text-white" : "text-white/60"
                            )}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </TooltipTrigger>
                {sidebarCollapsed && (
                  <TooltipContent side="right">
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-white/5">
          <motion.button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 text-white/60" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 text-white/60" />
                <span className="text-sm text-white/60">Collapse</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
