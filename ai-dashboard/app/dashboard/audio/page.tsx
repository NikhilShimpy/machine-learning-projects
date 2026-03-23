"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AudioWaveform, Zap, BarChart3, Volume2 } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AudioUpload } from "@/components/forms/AudioUpload";
import { ResultCard, ConfidenceBar } from "@/components/cards/ResultCard";
import { LoadingBrain } from "@/components/ui/loading";
import { useStore } from "@/store/useStore";
import { mockPredictAudioTraffic } from "@/lib/api";
import { AudioPredictionResponse } from "@/types";
import { cn } from "@/lib/utils";

export default function AudioPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<AudioPredictionResponse | null>(null);

  const { audioLoading, setAudioLoading, addToast, addHistoryItem } = useStore();

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAudioLoading(true);
    setResult(null);

    try {
      // Use mock API for demo, replace with real API in production
      const response = await mockPredictAudioTraffic(selectedFile);
      setResult(response);

      addHistoryItem({
        type: "audio",
        input: selectedFile.name,
        result: response,
      });

      addToast({
        type: "success",
        title: "Analysis Complete",
        message: `Traffic level detected: ${response.traffic}`,
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Analysis Failed",
        message: "Failed to analyze audio file. Please try again.",
      });
    } finally {
      setAudioLoading(false);
    }
  };

  const getTrafficConfig = (traffic: string) => {
    switch (traffic.toLowerCase()) {
      case "low":
        return {
          color: "green" as const,
          gradient: "from-neon-green to-neon-cyan",
          description: "Low traffic density detected. Roads are clear with minimal congestion.",
        };
      case "medium":
      case "moderate":
        return {
          color: "orange" as const,
          gradient: "from-neon-orange to-neon-pink",
          description: "Moderate traffic detected. Some congestion present on the road.",
        };
      case "high":
        return {
          color: "pink" as const,
          gradient: "from-neon-pink to-neon-purple",
          description: "High traffic density detected. Significant congestion present.",
        };
      default:
        return {
          color: "cyan" as const,
          gradient: "from-neon-cyan to-neon-blue",
          description: "Traffic level analyzed.",
        };
    }
  };

  return (
    <PageWrapper
      title="Audio Traffic AI"
      description="Analyze road traffic audio to classify traffic density levels"
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
                <AudioWaveform className="w-5 h-5 text-neon-purple" />
                Upload Audio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AudioUpload
                onFileSelect={setSelectedFile}
                disabled={audioLoading}
              />

              <Button
                variant="gradient"
                size="xl"
                className="w-full"
                onClick={handleAnalyze}
                disabled={!selectedFile || audioLoading}
              >
                {audioLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Analyzing Audio...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Analyze Traffic
                  </span>
                )}
              </Button>

              {/* How it works */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <p className="text-sm font-medium text-white/60">How it works:</p>
                <div className="space-y-2 text-sm text-white/40">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center text-xs">1</span>
                    <span>Upload a .wav audio file of road traffic</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center text-xs">2</span>
                    <span>Audio is converted to Log-Mel Spectrogram</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center text-xs">3</span>
                    <span>CNN model analyzes patterns in the sound</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center text-xs">4</span>
                    <span>Traffic density level is predicted</span>
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
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {audioLoading ? (
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
                      Analyzing audio patterns...
                    </motion.p>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-6"
                  >
                    {/* Traffic Level Result */}
                    <ResultCard
                      title="Traffic Level"
                      value={result.traffic}
                      icon={<Volume2 className="w-6 h-6 text-white" />}
                      color={getTrafficConfig(result.traffic).color}
                      size="lg"
                    />

                    {/* Confidence */}
                    <div className="glass rounded-xl p-4">
                      <ConfidenceBar
                        value={result.confidence}
                        color={getTrafficConfig(result.traffic).color}
                      />
                    </div>

                    {/* Description */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={cn(
                        "p-4 rounded-xl border",
                        `bg-gradient-to-r ${getTrafficConfig(result.traffic).gradient} bg-opacity-10`,
                        "border-white/10"
                      )}
                    >
                      <p className="text-white/80">
                        {getTrafficConfig(result.traffic).description}
                      </p>
                    </motion.div>

                    {/* Spectrogram placeholder */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="glass rounded-xl p-4"
                    >
                      <p className="text-sm text-white/40 mb-3">Spectrogram Visualization</p>
                      <div className="h-32 rounded-lg bg-gradient-to-r from-neon-purple/20 via-neon-cyan/20 to-neon-pink/20 flex items-center justify-center">
                        <div className="flex items-center gap-1">
                          {[...Array(30)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 bg-gradient-to-t from-neon-cyan to-neon-purple rounded-full"
                              animate={{
                                height: [
                                  `${20 + Math.random() * 60}%`,
                                  `${20 + Math.random() * 60}%`,
                                ],
                              }}
                              transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: i * 0.02,
                              }}
                              style={{ height: "50%" }}
                            />
                          ))}
                        </div>
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
                      <AudioWaveform className="w-10 h-10 text-white/20" />
                    </div>
                    <p className="text-white/40 mb-2">No results yet</p>
                    <p className="text-sm text-white/20">
                      Upload an audio file and click analyze to see results
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
