import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(1)}%`;
}

export function getTrafficColor(traffic: string): string {
  switch (traffic.toLowerCase()) {
    case "low":
      return "text-neon-green";
    case "medium":
    case "moderate":
      return "text-neon-orange";
    case "high":
      return "text-neon-pink";
    default:
      return "text-white";
  }
}

export function getQualityColor(quality: number): string {
  if (quality >= 7) return "text-neon-green";
  if (quality >= 5) return "text-neon-orange";
  return "text-neon-pink";
}

export function getQualityCategory(quality: number): string {
  if (quality >= 7) return "High";
  if (quality >= 5) return "Medium";
  return "Low";
}

export function getMBTIColor(mbti: string): string {
  const analysts = ["INTJ", "INTP", "ENTJ", "ENTP"];
  const diplomats = ["INFJ", "INFP", "ENFJ", "ENFP"];
  const sentinels = ["ISTJ", "ISFJ", "ESTJ", "ESFJ"];
  const explorers = ["ISTP", "ISFP", "ESTP", "ESFP"];

  if (analysts.includes(mbti)) return "text-neon-purple";
  if (diplomats.includes(mbti)) return "text-neon-green";
  if (sentinels.includes(mbti)) return "text-neon-blue";
  if (explorers.includes(mbti)) return "text-neon-orange";
  return "text-white";
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
