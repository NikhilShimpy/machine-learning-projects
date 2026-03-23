"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Zap,
  BarChart3,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VideoUpload } from "@/components/forms/VideoUpload";
import { ConfidenceBar } from "@/components/cards/ResultCard";
import { LoadingBrain } from "@/components/ui/loading";
import { useStore } from "@/store/useStore";
import { mockPredictVideo, predictVideo } from "@/lib/api";
import { VideoPredictionResponse } from "@/types";
import { cn } from "@/lib/utils";

export default function VideoPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<VideoPredictionResponse | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { videoLoading, setVideoLoading, addToast, addHistoryItem } = useStore();

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setVideoLoading(true);
    setResult(null);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Use mock API for demo, replace with real API in production
      const response = await mockPredictVideo(selectedFile);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setResult(response);

      addHistoryItem({
        type: "video",
        input: selectedFile.name,
        result: response,
      });

      addToast({
        type: response.violence ? "warning" : "success",
        title: "Analysis Complete",
        message: response.violence
          ? "Violence detected in video"
          : "No violence detected",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Analysis Failed",
        message: "Failed to analyze video. Please try again.",
      });
    } finally {
      setVideoLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <PageWrapper
      title="Video AI - Violence Detection"
      description="Analyze videos to detect violent activities using CNN + LSTM"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card variant="glass" className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-red-400" />
                Upload Video
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <VideoUpload
                onFileSelect={setSelectedFile}
                disabled={videoLoading}
                uploadProgress={videoLoading ? uploadProgress : undefined}
              />

              <Button
                variant="gradient"
                size="xl"
                className="w-full bg-gradient-to-r from-red-500 to-neon-orange hover:from-red-600 hover:to-orange-600"
                onClick={handleAnalyze}
                disabled={!selectedFile || videoLoading}
              >
                {videoLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Analyzing Video...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Detect Violence
                  </span>
                )}
              </Button>

              {/* How it works */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <p className="text-sm font-medium text-white/60">How it works:</p>
                <div className="space-y-2 text-sm text-white/40">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs">1</span>
                    <span>Upload a video file (.mp4, .avi, etc.)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs">2</span>
                    <span>Frames are extracted and preprocessed</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs">3</span>
                    <span>CNN + LSTM model analyzes temporal patterns</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs">4</span>
                    <span>Violence detection result is returned</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card variant="glass" className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-neon-cyan" />
                Detection Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {videoLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <LoadingBrain />
                    <motion.p
                      className="mt-6 text-white/60"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Scanning video for violence...
                    </motion.p>

                    {/* Scanning animation */}
                    <div className="mt-6 w-full max-w-xs">
                      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-red-500 to-transparent"
                          animate={{ x: ["-100%", "400%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-6"
                  >
                    {/* Main Result */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                      className={cn(
                        "text-center p-8 rounded-2xl border",
                        result.violence
                          ? "bg-gradient-to-br from-red-500/20 to-orange-500/10 border-red-500/30"
                          : "bg-gradient-to-br from-neon-green/20 to-neon-cyan/10 border-neon-green/30"
                      )}
                    >
                      <div className={cn(
                        "w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center",
                        result.violence ? "bg-red-500/20" : "bg-neon-green/20"
                      )}>
                        {result.violence ? (
                          <ShieldAlert className="w-10 h-10 text-red-400" />
                        ) : (
                          <ShieldCheck className="w-10 h-10 text-neon-green" />
                        )}
                      </div>

                      <h3 className={cn(
                        "text-3xl font-bold mb-2",
                        result.violence ? "text-red-400" : "text-neon-green"
                      )}>
                        {result.violence ? "VIOLENCE DETECTED" : "NO VIOLENCE"}
                      </h3>

                      <Badge
                        variant={result.violence ? "error" : "success"}
                        className="text-sm px-4 py-1"
                      >
                        {result.violence ? (
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Alert
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Safe
                          </span>
                        )}
                      </Badge>
                    </motion.div>

                    {/* Confidence */}
                    <div className="glass rounded-xl p-4">
                      <ConfidenceBar
                        value={result.confidence}
                        color={result.violence ? "pink" : "green"}
                      />
                    </div>

                    {/* Description */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <p className="text-white/70 text-sm">
                        {result.violence
                          ? "The AI model has detected patterns consistent with violent activity in this video. This detection is based on temporal analysis of video frames using CNN + LSTM architecture."
                          : "The video has been analyzed and no violent activity was detected. The content appears to be safe based on the CNN + LSTM model analysis."}
                      </p>
                    </motion.div>

                    {/* Use Cases */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <p className="text-xs text-white/40">Applicable for:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Surveillance", "Content Moderation", "Security", "Safety Monitoring"].map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                      <Video className="w-10 h-10 text-white/20" />
                    </div>
                    <p className="text-white/40 mb-2">No results yet</p>
                    <p className="text-sm text-white/20">
                      Upload a video and click analyze to detect violence
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
