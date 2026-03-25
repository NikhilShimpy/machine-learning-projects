"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Wine, BarChart3, Award, TrendingUp } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WineForm } from "@/components/forms/WineForm";
import { ResultCard, ConfidenceBar } from "@/components/cards/ResultCard";
import { LoadingBrain } from "@/components/ui/loading";
import { useStore } from "@/store/useStore";
import { mockPredictWineQuality } from "@/lib/api";
import { NumericPredictionResponse, WineFeatures } from "@/types";

export default function NumericPage() {
  const [result, setResult] = useState<NumericPredictionResponse | null>(null);

  const { numericLoading, setNumericLoading, addToast, addHistoryItem } = useStore();

  const handleSubmit = async (data: WineFeatures) => {
    setNumericLoading(true);
    setResult(null);

    try {
      const response = await mockPredictWineQuality(data);
      setResult(response);

      addHistoryItem({
        type: "numeric",
        input: `Alcohol: ${data.alcohol}%, pH: ${data.pH}`,
        result: response,
      });

      addToast({
        type: "success",
        title: "Prediction Complete",
        message: `Wine quality score: ${response.quality}/10`,
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Prediction Failed",
        message: "Failed to predict wine quality. Please try again.",
      });
    } finally {
      setNumericLoading(false);
    }
  };

  const getQualityConfig = (quality: number) => {
    if (quality >= 7) {
      return {
        color: "green" as const,
        badge: "success" as const,
        description: "Excellent quality wine! This wine exhibits outstanding characteristics and well-balanced properties.",
      };
    }
    if (quality >= 5) {
      return {
        color: "orange" as const,
        badge: "warning" as const,
        description: "Good quality wine. This wine has decent characteristics with room for improvement.",
      };
    }
    return {
      color: "pink" as const,
      badge: "error" as const,
      description: "Below average quality. This wine may have imbalanced properties or defects.",
    };
  };

  return (
    <PageWrapper
      title="Wine Quality AI"
      description="Predict wine quality scores based on chemical properties"
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
                <Wine className="w-5 h-5 text-neon-green" />
                Wine Chemical Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WineForm onSubmit={handleSubmit} isLoading={numericLoading} />
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
                Quality Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {numericLoading ? (
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
                      Analyzing wine properties...
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
                    {/* Quality Score */}
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                        className="relative inline-flex items-center justify-center"
                      >
                        {/* Animated ring */}
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `conic-gradient(from 0deg, ${
                              getQualityConfig(result.quality).color === "green"
                                ? "#32d74b"
                                : getQualityConfig(result.quality).color === "orange"
                                ? "#ff9f0a"
                                : "#ff375f"
                            } ${(result.quality / 10) * 100}%, transparent ${
                              (result.quality / 10) * 100
                            }%)`,
                          }}
                          initial={{ rotate: -90 }}
                          animate={{ rotate: -90 }}
                        />
                        <div className="relative w-32 h-32 rounded-full bg-background flex flex-col items-center justify-center border-4 border-white/10">
                          <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className={`text-4xl font-bold ${
                              getQualityConfig(result.quality).color === "green"
                                ? "text-neon-green"
                                : getQualityConfig(result.quality).color === "orange"
                                ? "text-neon-orange"
                                : "text-neon-pink"
                            }`}
                          >
                            {result.quality.toFixed(1)}
                          </motion.span>
                          <span className="text-sm text-white/40">out of 10</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Category Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex justify-center"
                    >
                      <Badge
                        variant={getQualityConfig(result.quality).badge}
                        className="px-4 py-2 text-base"
                      >
                        <Award className="w-4 h-4 mr-2" />
                        {result.category} Quality
                      </Badge>
                    </motion.div>

                    {/* Confidence */}
                    {result.confidence && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="glass rounded-xl p-4"
                      >
                        <ConfidenceBar
                          value={result.confidence}
                          label="Model Confidence"
                          color={getQualityConfig(result.quality).color}
                        />
                      </motion.div>
                    )}

                    {/* Description */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <p className="text-sm text-white/70">
                        {getQualityConfig(result.quality).description}
                      </p>
                    </motion.div>

                    {/* Quality Scale */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-2"
                    >
                      <p className="text-xs text-white/40 text-center">Quality Scale</p>
                      <div className="flex gap-1">
                        {[...Array(10)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: 0.5 + i * 0.05 }}
                            className={`flex-1 h-2 rounded-full ${
                              i < result.quality
                                ? i < 5
                                  ? "bg-neon-pink"
                                  : i < 7
                                  ? "bg-neon-orange"
                                  : "bg-neon-green"
                                : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-white/30">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                      </div>
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
                      <TrendingUp className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-white/40 mb-2">No prediction yet</p>
                    <p className="text-sm text-white/20">
                      Adjust the wine properties and submit to see results
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
