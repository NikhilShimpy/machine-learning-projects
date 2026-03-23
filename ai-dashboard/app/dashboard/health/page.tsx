"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  BarChart3,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Sparkles,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HealthForm } from "@/components/forms/HealthForm";
import { ConfidenceBar } from "@/components/cards/ResultCard";
import { LoadingBrain } from "@/components/ui/loading";
import { useStore } from "@/store/useStore";
import { mockPredictHealth } from "@/lib/api";
import { HealthPredictionResponse, HealthFeatures } from "@/types";
import { cn } from "@/lib/utils";

export default function HealthPage() {
  const [result, setResult] = useState<HealthPredictionResponse | null>(null);

  const { healthLoading, setHealthLoading, addToast, addHistoryItem } = useStore();

  const handleSubmit = async (data: HealthFeatures) => {
    setHealthLoading(true);
    setResult(null);

    try {
      const response = await mockPredictHealth(data);
      setResult(response);

      addHistoryItem({
        type: "health",
        input: `Age: ${data.age}, Chol: ${data.chol}, BP: ${data.trestbps}`,
        result: response,
      });

      addToast({
        type: response.disease ? "warning" : "success",
        title: "Analysis Complete",
        message: response.disease
          ? `Heart disease risk detected: ${response.risk}`
          : "No heart disease risk detected",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Analysis Failed",
        message: "Failed to analyze health data. Please try again.",
      });
    } finally {
      setHealthLoading(false);
    }
  };

  const getRiskConfig = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high":
        return {
          color: "pink" as const,
          badge: "error" as const,
          bgGradient: "from-red-500/20 to-neon-pink/10",
          borderColor: "border-red-500/30",
          description: "High risk of heart disease detected. Please consult a healthcare professional immediately.",
        };
      case "medium":
        return {
          color: "orange" as const,
          badge: "warning" as const,
          bgGradient: "from-neon-orange/20 to-yellow-500/10",
          borderColor: "border-neon-orange/30",
          description: "Moderate risk of heart disease. Consider lifestyle changes and regular check-ups.",
        };
      default:
        return {
          color: "green" as const,
          badge: "success" as const,
          bgGradient: "from-neon-green/20 to-neon-cyan/10",
          borderColor: "border-neon-green/30",
          description: "Low risk of heart disease. Maintain a healthy lifestyle for continued wellness.",
        };
    }
  };

  return (
    <PageWrapper
      title="Health AI - Heart Disease Prediction"
      description="Predict heart disease risk based on medical parameters"
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-2"
        >
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-neon-pink" />
                Patient Health Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HealthForm onSubmit={handleSubmit} isLoading={healthLoading} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card variant="glass" className="h-full sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-neon-cyan" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {healthLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <LoadingBrain />
                    <motion.p
                      className="mt-6 text-white/60"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Analyzing health parameters...
                    </motion.p>

                    {/* Heartbeat animation */}
                    <motion.div className="mt-6 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-neon-pink rounded-full"
                          animate={{
                            height: ["8px", "32px", "8px"],
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </motion.div>
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
                        "text-center p-6 rounded-2xl border",
                        `bg-gradient-to-br ${getRiskConfig(result.risk).bgGradient}`,
                        getRiskConfig(result.risk).borderColor
                      )}
                    >
                      <div className={cn(
                        "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
                        result.disease ? "bg-red-500/20" : "bg-neon-green/20"
                      )}>
                        {result.disease ? (
                          <Heart className="w-8 h-8 text-red-400" />
                        ) : (
                          <Heart className="w-8 h-8 text-neon-green" />
                        )}
                      </div>

                      <h3 className={cn(
                        "text-2xl font-bold mb-2",
                        result.disease ? "text-red-400" : "text-neon-green"
                      )}>
                        {result.disease ? "RISK DETECTED" : "LOW RISK"}
                      </h3>

                      <Badge
                        variant={getRiskConfig(result.risk).badge}
                        className="text-sm px-4 py-1"
                      >
                        {result.disease ? (
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {result.risk} Risk
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Healthy
                          </span>
                        )}
                      </Badge>
                    </motion.div>

                    {/* Confidence */}
                    <div className="glass rounded-xl p-4">
                      <ConfidenceBar
                        value={result.confidence}
                        label="Model Confidence"
                        color={getRiskConfig(result.risk).color}
                      />
                    </div>

                    {/* Description */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <p className="text-sm text-white/70">
                        {getRiskConfig(result.risk).description}
                      </p>
                    </motion.div>

                    {/* Key Factors */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-3"
                    >
                      <p className="text-xs text-white/40 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Key factors analyzed:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["Age", "Cholesterol", "Blood Pressure", "Heart Rate", "ECG"].map((factor) => (
                          <span
                            key={factor}
                            className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/50"
                          >
                            {factor}
                          </span>
                        ))}
                      </div>
                    </motion.div>

                    {/* Disclaimer */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                    >
                      <p className="text-xs text-yellow-400/80">
                        <strong>Disclaimer:</strong> This is an AI-based prediction tool and should not replace professional medical advice. Please consult a healthcare provider for accurate diagnosis.
                      </p>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                      <Activity className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-white/40 mb-2">No prediction yet</p>
                    <p className="text-sm text-white/20">
                      Enter health parameters and submit to see risk assessment
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
