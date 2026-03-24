"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Zap,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Activity,
  FileWarning,
  Stethoscope,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/forms/ImageUpload";
import { ConfidenceBar } from "@/components/cards/ResultCard";
import { LoadingBrain } from "@/components/ui/loading";
import { useStore } from "@/store/useStore";
import { mockPredictBrainTumor, predictBrainTumor } from "@/lib/api";
import { ImagePredictionResponse } from "@/types";
import { cn } from "@/lib/utils";

const tumorClassConfig = {
  glioma: {
    color: "pink" as const,
    gradient: "from-red-500 to-neon-pink",
    bgGradient: "from-red-500/20 to-neon-pink/10",
    borderColor: "border-red-500/30",
    icon: FileWarning,
    label: "Glioma Tumor",
  },
  meningioma: {
    color: "orange" as const,
    gradient: "from-neon-orange to-yellow-500",
    bgGradient: "from-neon-orange/20 to-yellow-500/10",
    borderColor: "border-neon-orange/30",
    icon: AlertTriangle,
    label: "Meningioma Tumor",
  },
  pituitary: {
    color: "cyan" as const,
    gradient: "from-neon-cyan to-neon-blue",
    bgGradient: "from-neon-cyan/20 to-neon-blue/10",
    borderColor: "border-neon-cyan/30",
    icon: Activity,
    label: "Pituitary Tumor",
  },
  no_tumor: {
    color: "green" as const,
    gradient: "from-neon-green to-emerald-500",
    bgGradient: "from-neon-green/20 to-emerald-500/10",
    borderColor: "border-neon-green/30",
    icon: CheckCircle2,
    label: "No Tumor Detected",
  },
};

export default function ImagePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImagePredictionResponse | null>(null);

  const { imageLoading, setImageLoading, addToast, addHistoryItem } = useStore();

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setImageLoading(true);
    setResult(null);

    try {
      // Use mock API for demo, replace with predictBrainTumor for production
      const response = await mockPredictBrainTumor(selectedFile);
      setResult(response);

      addHistoryItem({
        type: "image",
        input: selectedFile.name,
        result: response,
      });

      const isTumor = response.prediction !== "no_tumor";
      addToast({
        type: isTumor ? "warning" : "success",
        title: "Analysis Complete",
        message: isTumor
          ? `${tumorClassConfig[response.prediction].label} detected`
          : "No tumor detected in the MRI scan",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Analysis Failed",
        message: "Failed to analyze MRI scan. Please try again.",
      });
    } finally {
      setImageLoading(false);
    }
  };

  const getConfig = (prediction: ImagePredictionResponse["prediction"]) => {
    return tumorClassConfig[prediction];
  };

  return (
    <PageWrapper
      title="Brain Tumor MRI AI"
      description="Analyze brain MRI scans to detect and classify tumors using deep learning"
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
                <Brain className="w-5 h-5 text-neon-cyan" />
                Upload MRI Scan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageUpload
                onFileSelect={setSelectedFile}
                disabled={imageLoading}
              />

              <Button
                variant="gradient"
                size="xl"
                className="w-full bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-cyan-600 hover:to-blue-600"
                onClick={handleAnalyze}
                disabled={!selectedFile || imageLoading}
              >
                {imageLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Analyzing MRI...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Analyze Scan
                  </span>
                )}
              </Button>

              {/* How it works */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <p className="text-sm font-medium text-white/60">How it works:</p>
                <div className="space-y-2 text-sm text-white/40">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center text-xs">1</span>
                    <span>Upload a brain MRI scan image</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center text-xs">2</span>
                    <span>Image is preprocessed and resized to 224x224</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center text-xs">3</span>
                    <span>MobileNetV2 deep learning model analyzes patterns</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center text-xs">4</span>
                    <span>Classification result with confidence scores</span>
                  </div>
                </div>
              </div>

              {/* Tumor Classes Info */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <p className="text-sm font-medium text-white/60">Detectable conditions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(tumorClassConfig).map(([key, config]) => (
                    <div
                      key={key}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg bg-white/5"
                      )}
                    >
                      <config.icon className={cn("w-4 h-4", {
                        "text-red-400": key === "glioma",
                        "text-neon-orange": key === "meningioma",
                        "text-neon-cyan": key === "pituitary",
                        "text-neon-green": key === "no_tumor",
                      })} />
                      <span className="text-xs text-white/60">{config.label}</span>
                    </div>
                  ))}
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
                Diagnosis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {imageLoading ? (
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
                      Analyzing brain MRI scan...
                    </motion.p>

                    {/* Scanning animation */}
                    <div className="mt-6 w-full max-w-xs">
                      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
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
                        `bg-gradient-to-br ${getConfig(result.prediction).bgGradient}`,
                        getConfig(result.prediction).borderColor
                      )}
                    >
                      <div className={cn(
                        "w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center",
                        result.prediction === "no_tumor" ? "bg-neon-green/20" : "bg-red-500/20"
                      )}>
                        {(() => {
                          const IconComponent = getConfig(result.prediction).icon;
                          return (
                            <IconComponent className={cn(
                              "w-10 h-10",
                              result.prediction === "no_tumor" ? "text-neon-green" : "text-red-400"
                            )} />
                          );
                        })()}
                      </div>

                      <h3 className={cn(
                        "text-2xl font-bold mb-2 uppercase",
                        result.prediction === "no_tumor" ? "text-neon-green" : "text-red-400"
                      )}>
                        {getConfig(result.prediction).label}
                      </h3>

                      <div className="flex items-center justify-center gap-2">
                        <Badge
                          variant={result.prediction === "no_tumor" ? "success" : "error"}
                          className="text-sm px-4 py-1"
                        >
                          {result.severity === "None" ? "Healthy" : `Severity: ${result.severity}`}
                        </Badge>
                      </div>
                    </motion.div>

                    {/* Confidence */}
                    <div className="glass rounded-xl p-4">
                      <ConfidenceBar
                        value={result.confidence}
                        color={getConfig(result.prediction).color}
                      />
                    </div>

                    {/* All Probabilities */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="glass rounded-xl p-4"
                    >
                      <p className="text-sm text-white/60 mb-3">Classification Probabilities</p>
                      <div className="space-y-3">
                        {Object.entries(result.all_probabilities).map(([key, value]) => {
                          const config = tumorClassConfig[key as keyof typeof tumorClassConfig];
                          return (
                            <div key={key} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-white/70 capitalize">
                                  {key.replace("_", " ")}
                                </span>
                                <span className="text-white font-medium">
                                  {(value * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${value * 100}%` }}
                                  transition={{ duration: 0.5, delay: 0.3 }}
                                  className={cn(
                                    "h-full rounded-full bg-gradient-to-r",
                                    config.gradient
                                  )}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-start gap-3">
                        <Stethoscope className="w-5 h-5 text-neon-cyan mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-white mb-1">Medical Information</p>
                          <p className="text-sm text-white/70">{result.description}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Disclaimer */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="p-3 rounded-lg bg-neon-orange/10 border border-neon-orange/20"
                    >
                      <p className="text-xs text-neon-orange">
                        <strong>Disclaimer:</strong> This AI model is for educational and research purposes only.
                        Always consult a qualified medical professional for actual diagnosis and treatment decisions.
                      </p>
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
                      <Brain className="w-10 h-10 text-white/20" />
                    </div>
                    <p className="text-white/40 mb-2">No results yet</p>
                    <p className="text-sm text-white/20">
                      Upload a brain MRI scan and click analyze to get diagnosis
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
