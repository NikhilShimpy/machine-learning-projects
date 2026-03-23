"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Toast as ToastType } from "@/types";
import { useEffect } from "react";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: "border-neon-green/50 bg-neon-green/10",
  error: "border-neon-pink/50 bg-neon-pink/10",
  info: "border-neon-blue/50 bg-neon-blue/10",
  warning: "border-neon-orange/50 bg-neon-orange/10",
};

const iconColors = {
  success: "text-neon-green",
  error: "text-neon-pink",
  info: "text-neon-blue",
  warning: "text-neon-orange",
};

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useStore((state) => state.removeToast);
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      className={`glass rounded-lg border p-4 shadow-lg ${colors[toast.type]} min-w-[320px] max-w-[420px]`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 ${iconColors[toast.type]}`} />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white">{toast.title}</p>
          <p className="text-sm text-white/70 mt-1">{toast.message}</p>
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="text-white/50 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useStore((state) => state.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
