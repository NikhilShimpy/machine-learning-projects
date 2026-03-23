"use client";

import { motion } from "framer-motion";
import { HistoryItem } from "@/types";
import { AudioWaveform, Calculator, MessageSquareText, Video, HeartPulse, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const typeIcons = {
  audio: AudioWaveform,
  numeric: Calculator,
  text: MessageSquareText,
  video: Video,
  health: HeartPulse,
};

const typeColors = {
  audio: "from-neon-purple to-neon-pink",
  numeric: "from-neon-green to-neon-cyan",
  text: "from-neon-orange to-neon-pink",
  video: "from-red-500 to-neon-orange",
  health: "from-neon-pink to-red-500",
};

interface HistoryCardProps {
  item: HistoryItem;
  onDelete?: () => void;
}

export function HistoryCard({ item, onDelete }: HistoryCardProps) {
  const Icon = typeIcons[item.type];

  const getResultSummary = () => {
    if (item.type === "audio") {
      const result = item.result as { traffic: string; confidence: number };
      return `Traffic: ${result.traffic} (${(result.confidence * 100).toFixed(1)}%)`;
    }
    if (item.type === "numeric") {
      const result = item.result as { quality: number; category: string };
      return `Quality: ${result.quality}/10 (${result.category})`;
    }
    if (item.type === "text") {
      const result = item.result as { mbti_type: string };
      return `Personality: ${result.mbti_type}`;
    }
    if (item.type === "video") {
      const result = item.result as { violence: boolean; confidence: number };
      return `Violence: ${result.violence ? "Yes" : "No"} (${(result.confidence * 100).toFixed(1)}%)`;
    }
    if (item.type === "health") {
      const result = item.result as { disease: boolean; risk: string };
      return `Disease: ${result.disease ? "Risk" : "No Risk"} (${result.risk})`;
    }
    return "";
  };

  const formattedTime = (() => {
    const date = new Date(item.timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass rounded-xl p-4 group"
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${typeColors[item.type]} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" className="capitalize">
              {item.type}
            </Badge>
            <span className="text-xs text-white/40">{formattedTime}</span>
          </div>

          <p className="text-sm text-white/70 truncate mb-1">
            Input: {item.input.slice(0, 50)}
            {item.input.length > 50 ? "..." : ""}
          </p>

          <p className="text-sm font-medium text-white">{getResultSummary()}</p>
        </div>

        {onDelete && (
          <motion.button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-neon-pink transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
