"use client";

import { motion } from "framer-motion";
import {
  AudioWaveform,
  MessageSquareText,
  Video,
  HeartPulse,
  Brain,
  Activity,
  Clock,
  Zap,
  TrendingUp,
  Layers,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { AICard, QuickActionCard } from "@/components/cards/AICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

const aiModels = [
  {
    title: "Audio Traffic AI",
    description:
      "Analyze road traffic audio recordings to classify traffic density levels using CNN-based spectrogram analysis",
    href: "/dashboard/audio",
    icon: <AudioWaveform className="w-7 h-7 text-white" />,
    gradient: "from-neon-purple to-neon-pink",
    status: "active" as const,
    stats: [
      { label: "Accuracy", value: "67%" },
      { label: "Classes", value: "3" },
    ],
  },
  {
    title: "Personality AI",
    description:
      "Analyze text to predict MBTI personality types and provide personalized community recommendations",
    href: "/dashboard/text",
    icon: <MessageSquareText className="w-7 h-7 text-white" />,
    gradient: "from-neon-orange to-neon-pink",
    status: "active" as const,
    stats: [
      { label: "Accuracy", value: "67.28%" },
      { label: "Types", value: "16" },
    ],
  },
  {
    title: "Video Violence AI",
    description:
      "Detect violent activities in video content using CNN + LSTM deep learning for temporal pattern analysis",
    href: "/dashboard/video",
    icon: <Video className="w-7 h-7 text-white" />,
    gradient: "from-red-500 to-neon-orange",
    status: "active" as const,
    stats: [
      { label: "Accuracy", value: "77%" },
      { label: "Classes", value: "2" },
    ],
  },
  {
    title: "Heart Disease AI",
    description:
      "Predict heart disease risk based on patient health parameters using KNN classification model",
    href: "/dashboard/health",
    icon: <HeartPulse className="w-7 h-7 text-white" />,
    gradient: "from-neon-pink to-red-500",
    status: "active" as const,
    stats: [
      { label: "Accuracy", value: "88%" },
      { label: "Features", value: "13" },
    ],
  },
  {
    title: "Brain Tumor MRI AI",
    description:
      "Classify brain MRI scans to detect tumors using MobileNetV2 transfer learning for medical imaging",
    href: "/dashboard/image",
    icon: <Brain className="w-7 h-7 text-white" />,
    gradient: "from-neon-cyan to-neon-blue",
    status: "active" as const,
    stats: [
      { label: "Accuracy", value: "77%" },
      { label: "Classes", value: "4" },
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const router = useRouter();
  const history = useStore((state) => state.history);

  const recentActivity = history.slice(0, 5);

  return (
    <PageWrapper
      title="Dashboard"
      description="Welcome to Neural Nexus - Your AI Analysis Platform"
    >
      {/* Stats Row */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          {
            label: "Total Analyses",
            value: history.length.toString(),
            icon: Activity,
            color: "text-neon-cyan",
          },
          {
            label: "Active Models",
            value: "5",
            icon: Layers,
            color: "text-neon-green",
          },
          {
            label: "Avg Response",
            value: "1.2s",
            icon: Clock,
            color: "text-neon-orange",
          },
          {
            label: "Success Rate",
            value: "98%",
            icon: TrendingUp,
            color: "text-neon-purple",
          },
        ].map((stat, index) => (
          <motion.div key={index} variants={item}>
            <Card variant="glass" className="p-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/50">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* AI Models Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
      >
        {aiModels.map((model, index) => (
          <motion.div key={index} variants={item}>
            <AICard {...model} />
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="glass" className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-neon-cyan" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickActionCard
                title="Analyze Audio"
                description="Upload a .wav file for traffic analysis"
                icon={<AudioWaveform className="w-5 h-5 text-neon-purple" />}
                onClick={() => router.push("/dashboard/audio")}
              />
              <QuickActionCard
                title="Analyze Personality"
                description="Input text for MBTI prediction"
                icon={<MessageSquareText className="w-5 h-5 text-neon-orange" />}
                onClick={() => router.push("/dashboard/text")}
              />
              <QuickActionCard
                title="Detect Violence"
                description="Upload video for safety analysis"
                icon={<Video className="w-5 h-5 text-red-400" />}
                onClick={() => router.push("/dashboard/video")}
              />
              <QuickActionCard
                title="Check Heart Health"
                description="Enter health parameters"
                icon={<HeartPulse className="w-5 h-5 text-neon-pink" />}
                onClick={() => router.push("/dashboard/health")}
              />
              <QuickActionCard
                title="Analyze Brain MRI"
                description="Upload MRI scan for tumor detection"
                icon={<Brain className="w-5 h-5 text-neon-cyan" />}
                onClick={() => router.push("/dashboard/image")}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="glass" className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-neon-cyan" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => {
                    const typeIcons: Record<string, typeof AudioWaveform> = {
                      audio: AudioWaveform,
                      text: MessageSquareText,
                      video: Video,
                      health: HeartPulse,
                      image: Brain,
                    };
                    const Icon = typeIcons[activity.type] || Activity;

                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-white/60" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">
                            {activity.input.slice(0, 40)}...
                          </p>
                          <p className="text-xs text-white/40 capitalize">
                            {activity.type} Analysis
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <Activity className="w-12 h-12 text-white/20 mb-3" />
                  <p className="text-white/40">No recent activity</p>
                  <p className="text-sm text-white/20">
                    Start analyzing to see your history
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
